import traceback
from datetime import datetime, timezone

from core.config import setup_logging, buildings_dict
# 서비스 모듈 임포트
from services.train.re_train import re_train

# 로깅 설정
logger = setup_logging()

def run_all_retrain():
    """
    모든 건물과 에너지원에 대해 재학습을 실행합니다.
    """
    logger.info(f"run_all_retrain 시작: {datetime.now(timezone.utc).isoformat()}")
    results = {}
    for building_id, energy_types in buildings_dict.items():
        for energy_type in energy_types:
            logger.info(f"재학습 시작 - 건물: {building_id}, 에너지원: {energy_type}")
            try:
                result = re_train(building_id, energy_type)
                if "error" in result:
                    logger.error(f"재학습 실패 - 건물: {building_id}, 에너지원: {energy_type}")
                else:
                    logger.info(f"재학습 성공 - 건물: {building_id}, 에너지원: {energy_type}")
                results[(building_id, energy_type)] = result
            except Exception as e:
                logger.error(f"예외 발생 - 건물: {building_id}, 에너지원: {energy_type}, 에러: {e}")
                traceback.print_exc()
                results[(building_id, energy_type)] = {"error": "Exception occurred", "details": str(e)}
    logger.info(f"run_all_retrain 완료: {datetime.now(timezone.utc).isoformat()}")

    # 요약 결과 출력
    print_summary_log(results)

    return results

def print_summary_log(results):
    """
    결과를 요약해서 로그로 출력합니다.
    """
    logger.info("\n" + "=" * 50)
    logger.info("재학습 요약 결과:")
    logger.info(f"{'건물 ID':<15}{'에너지원':<15}{'결과':<10}")
    logger.info("-" * 50)

    for (building_id, energy_type), status in results.items():
        # 딕셔너리 타입일 경우 문자열로 변환
        status_str = str(status) if isinstance(status, dict) else status
        logger.info(f"{building_id:<15}{energy_type:<15}{status_str:<10}")

    logger.info("=" * 50)


# 관리자가 직접 실행
if __name__ == "__main__":
    run_all_retrain()