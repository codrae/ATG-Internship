import asyncio

from core.config import buildings_dict
from core.config import setup_logging
from services.predict.re_predict import run_predict_task

logger = setup_logging()


async def run_all_predictions():
    """전체 건물과 에너지원에 대해 비동기 예측을 병렬로 수행하는 함수입니다."""
    logger.info("전체 건물과 에너지원에 대한 예측이 시작되었습니다.")

    tasks = []
    for building_id, energy_types in buildings_dict.items():
        for energy_type in energy_types:
            logger.info(f"예측 작업 준비 - 건물: {building_id}, 에너지원: {energy_type}")
            # 각 예측 작업을 개별 태스크로 생성
            task = asyncio.create_task(run_predict_task(building_id, energy_type))
            tasks.append(task)

    # 모든 태스크를 비동기적으로 병렬 실행
    await asyncio.gather(*tasks)
    logger.info("전체 예측 작업이 완료되었습니다.")
