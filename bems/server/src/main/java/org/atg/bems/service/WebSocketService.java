package org.atg.bems.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.atg.bems.message.BuildingMessage;
import org.atg.bems.message.DataPoint;
import org.atg.bems.mssql.entity.ElectricityData;

import org.atg.bems.mssql.entity.EnergyType;
import org.atg.bems.postgresql.entity.AnomalyLog;
import org.atg.bems.utils.CommonUtils;
import org.atg.bems.utils.CommonUtils.BuildingType;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class WebSocketService {
    private final SimpMessagingTemplate template;
    private final InfluxService influxService;
    private final AnomalyLogService anomalyLogService;
    private final BuildingService buildingService;
    public WebSocketService(SimpMessagingTemplate template, InfluxService influxService, AnomalyLogService anomalyLogService, BuildingService buildingService) {
        this.template = template;
        this.influxService = influxService;
        this.anomalyLogService = anomalyLogService;
        this.buildingService = buildingService;
    }

    public void sendPredictMessageByBuilding(String buildings, List<ElectricityData> predictDataList) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        String buildingEnglish = CommonUtils.toUrlBuildingName(buildings);
        BuildingMessage buildingMessage = CommonUtils.toBuildingMessage(buildingEnglish, predictDataList);
        String payload = objectMapper.writeValueAsString(buildingMessage);
        template.convertAndSend("/bems/" + buildingEnglish + "/predict", payload);
    }

    public void sendMessageByBuilding(String buildings, List<ElectricityData> dataList) throws JsonProcessingException {
        LocalDateTime startTime = dataList.getFirst().getDateTime();
        LocalDateTime lastTime = dataList.getLast().getDateTime();

        // TODO: 예측 데이터의 EnergyType 필드 참조 시도 시 null 에러 발생하여 POWER로 고정
        List<ElectricityData> predictData = influxService.readPredictElectricityData(startTime, lastTime, BuildingType.valueOf(buildings), EnergyType.POWER);

        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        String buildingEnglish = CommonUtils.toUrlBuildingName(buildings);
        BuildingMessage buildingMessage = CommonUtils.toBuildingMessage(buildingEnglish, dataList, predictData);
        String payload = objectMapper.writeValueAsString(buildingMessage);
        template.convertAndSend("/bems/" + buildingEnglish, payload);
        List<AnomalyLog> anomalyLogList = new ArrayList<>();
        for (DataPoint dataPoint : buildingMessage.dataList) {
            if (dataPoint.isAnomaly) {
                AnomalyLog build = AnomalyLog.builder()
                        .building(buildingService.readBuildingByName(buildings))
                        .createdAt(LocalDateTime.now())
                        .energyType(dataList.getFirst().getEnergyType())
                        .build();

                anomalyLogList.add(build);
            }
        }
        if(!anomalyLogList.isEmpty()) {
            anomalyLogService.saveAnomalyLogList(anomalyLogList);
        }

    }

    public void sendEmptyMessage(String buildings) {

        String buildingEnglish = CommonUtils.toUrlBuildingName(buildings);

        template.convertAndSend("/bems/" + buildingEnglish, "not yet");
    }
}
