import asyncio
import os
import sys

import httpx
import requests

from services.predict.predict import generate_predictions

# 프로젝트 루트 경로를 추가
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

from core.config import setup_logging, SPRING_CONFIG, buildings_url_dict
from services.data.data_preprocessing import preprocess
from services.influxdb.create import write_df_to_influxdb
from services.influxdb.read import read_data
from services.models.load_model import load_model

logger = setup_logging()


def notify_spring_server_get(building_id: str, energy_type: str):
    """
    Spring 서버에 GET 요청을 보내어 예측 데이터를 요청합니다.

    Args:
        building_id (str): 건물 ID (Enum과 일치해야 함)
        energy_type (str): 에너지 타입 (Enum과 일치해야 함)
    """
    url = f"http://{SPRING_CONFIG["host"]}:{SPRING_CONFIG["port"]}/lstm/complete/{buildings_url_dict.get(building_id)}/{energy_type}"

    try:
        # GET 요청은 본문 없이 경로 변수만 전달
        response = requests.get(url, headers={'Accept': 'application/json'}, timeout=10.0)

        if response.status_code == 200:
            logger.info(f"{building_id} - {energy_type} 예측 완료 상태가 서버에 성공적으로 전달되었습니다.")
            logger.info(f"응답 내용: {response.json()}")
        else:
            logger.error(f"{building_id} - {energy_type} 예측 완료 상태 전달에 실패했습니다. 응답 코드: {response.status_code}")
            logger.error(f"응답 내용: {response.text}")
            return False

    except requests.exceptions.RequestException as e:
        logger.error(f"Spring 서버에 알림을 보내는 중 오류 발생: {e}")
        return False
    return True


async def run_predict_task(building_id: str, energy_type: str):
    """특정 건물과 에너지원에 대해 예측을 수행하는 비동기 함수입니다."""

    try:
        # 데이터 로드 및 전처리
        df = await asyncio.to_thread(read_data, measurement=building_id, tag_key="energy_type", tag_value=energy_type)
        preprocessed_df = await asyncio.to_thread(preprocess, df)
        # data, scaler = await asyncio.to_thread(data_scaler, preprocessed_df)
        print("데이터 로드 및 전처리 종료")
        # 모델 로드 및 예측 수행
        model = await asyncio.to_thread(load_model, building_id, energy_type)
        predictions = await asyncio.to_thread(generate_predictions,preprocessed_df, model, 25, 24)
        # predict_df = await asyncio.to_thread(arr_to_df, predictions, preprocessed_df)
        print("모델 로드 및 예측 수행 완료")
        # 예측 결과 저장
        await asyncio.to_thread(
            write_df_to_influxdb, predictions, measurement=f"{building_id}_PREDICT", tag_value=energy_type
        )
        logger.info(f"{building_id} - {energy_type} 예측 결과가 InfluxDB에 성공적으로 저장되었습니다.")

        # 예측 완료 알림 전송
        await complete_predict(building_id, energy_type)

    except Exception as e:
        logger.error(f"{building_id} - {energy_type} 예측 중 오류 발생: {e}")


async def complete_predict(building_id, energy_type):
    """예측 완료를 알리는 비동기 함수입니다."""
    url = f"http://{SPRING_CONFIG["host"]}:{SPRING_CONFIG["port"]}/lstm/complete/{buildings_url_dict.get(building_id)}/{energy_type}"
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url, timeout=10.0)

        if response.status_code == 200:
            logger.info(f"{building_id} - {energy_type} 예측 완료 상태가 서버에 성공적으로 전달되었습니다.")
            logger.info(f"응답 내용: {response.json()}")
        else:
            logger.error(f"{building_id} - {energy_type} 예측 완료 상태 전달에 실패했습니다. 응답 코드: {response.status_code}")
            logger.error(f"응답 내용: {response.text}")
    except httpx.RequestError as e:
        logger.error(f"Spring 서버에 알림을 보내는 중 오류 발생: {e}")


if __name__ == "__main__":
    # 테스트를 위한 설정값
    test_building_id = "ANNIVERSARY_MEMORIAL_HALL"
    test_energy_type = "POWER"

    # 테스트 시작 메시지
    logger.info("===== 예측 테스트 시작 =====")

    try:
        # 비동기 함수를 실행하기 위해 asyncio.run() 사용
        asyncio.run(run_predict_task(building_id=test_building_id, energy_type=test_energy_type))
        logger.info("예측 작업이 정상적으로 완료되었습니다.")
    except Exception as e:
        logger.error(f"예측 테스트 중 오류 발생: {e}")

    # 테스트 종료 메시지
    logger.info("===== 예측 테스트 종료 =====")
