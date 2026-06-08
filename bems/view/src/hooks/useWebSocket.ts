"use client";

import { useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Client, IMessage, StompSubscription } from "@stomp/stompjs";
import websocketConfig from "@/config/websocketConfig";
import { DataPoint } from "@/types";
import { buildingName, urlToBuildingId } from "@/data/buildings";
import { useNotification } from "@/hooks/useNotification";
import { useQueryClient } from "@tanstack/react-query";

interface IncomingBuildingData {
  building: string;
  energyType: string;
  isAnomaly: boolean;
  dataList: DataPoint[];
}

interface IncomingPredictData {
  building: string;
  energyType: string;
  predictDataList: DataPoint[];
}

export const useWebSocket = () => {
  const { addNotification } = useNotification();
  const stompClientRef = useRef<Client | null>(null);
  const subscriptionRef = useRef<StompSubscription[]>([]);
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log("웹소켓 연결을 시도한다.");

    const stompClient = new Client({
      webSocketFactory: () => new SockJS(websocketConfig.connectUrl),
      debug: (str: string) => {
        console.log("stompClient 생성 디버깅: ", str);
      },
      reconnectDelay: 5000,
    });

    stompClient.onConnect = () => {
      console.log("STOMP 연결 설정 완료");

      Object.entries(buildingName).forEach(([, [url, korean]]) => {
        // 실시간 데이터 구독
        const dataSubscription = stompClient.subscribe(
          `/bems/${url}`,
          (message: IMessage) => {
            const incomingData: IncomingBuildingData = JSON.parse(message.body);
            const {
              building: incomingBuilding,
              energyType: incomingEnergy,
              isAnomaly,
              dataList,
            } = incomingData;

            console.log(
              `${incomingData.building}의 incoming data: `,
              incomingData.dataList,
            );

            const buildingIdMapped = urlToBuildingId[incomingBuilding];
            if (!buildingIdMapped) {
              console.log(
                "useWebSocket: 알 수 없는 건물 데이터가 들어왔습니다.",
              );
              return;
            }

            // 이상치 데이터인 경우 알림 메시지 출력
            if (isAnomaly) {
              addNotification(
                `${korean} (${incomingEnergy})에서 이상치가 감지되었습니다.`,
              );
            }

            // 에너지원별로 데이터 그룹화
            const groupedData: { [energyType: string]: DataPoint[] } =
              dataList.reduce(
                (acc, dataPoint) => {
                  const { energyType } = dataPoint;
                  if (energyType) {
                    acc[energyType] = acc[energyType] || [];
                    acc[energyType].push(dataPoint);
                  } else {
                    console.warn("에너지 타입이 없습니다: ", dataPoint);
                  }
                  return acc;
                },
                {} as { [energyType: string]: DataPoint[] },
              );

            // 기존 데이터에 데이터 업데이트
            const prevBuildingData =
              queryClient.getQueryData<{ [energyType: string]: DataPoint[] }>([
                "buildingRawData",
                buildingIdMapped,
              ]) || {};

            // 기존 데이터와 새로운 데이터 병합
            const updatedBuildingData = { ...prevBuildingData };
            for (const [energy, newDataPoints] of Object.entries(groupedData)) {
              updatedBuildingData[energy] = [
                ...(updatedBuildingData[energy] || []),
                ...newDataPoints,
              ];
            }

            // 업데이트된 데이터 캐시에 반영
            queryClient.setQueryData(
              ["buildingRawData", buildingIdMapped],
              updatedBuildingData,
            );
          },
        );

        // 예측 데이터 구독
        const predictDataSubscription = stompClient.subscribe(
          `/bems/${url}/predict`,
          (message: IMessage) => {
            const incomingPredict: IncomingPredictData = JSON.parse(
              message.body,
            );
            const { building: incomingBuilding, predictDataList } =
              incomingPredict;

            const buildingIdMapped = urlToBuildingId[incomingBuilding];
            if (!buildingIdMapped) {
              console.log(
                "useWebSocket: 알 수 없는 건물의 예측 데이터가 들어왔습니다.",
              );
              return;
            }

            // 예측 데이터 업데이트
            queryClient.setQueryData(
              ["buildingPredictData", buildingIdMapped],
              predictDataList,
            );

            addNotification(`${korean}의 예측 데이터가 업데이트되었습니다.`);
          },
        );

        subscriptionRef.current.push(dataSubscription, predictDataSubscription);
      });
    };

    // 구독한 주소가 존재하지 않는 경우 에러 발생함
    stompClient.onStompError = (frame) => {
      console.error("STOMP 오류 발생: ", frame.headers["message"]);
      console.error("STOMP 오류 발생: ", frame.body);
    };

    stompClient.activate();
    stompClientRef.current = stompClient;

    // 언마운트 시 연결 해제
    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
        stompClientRef.current = null;
      }

      subscriptionRef.current.forEach((subscription) =>
        subscription.unsubscribe(),
      );
      subscriptionRef.current = [];
    };
  }, [addNotification, queryClient]);
};
