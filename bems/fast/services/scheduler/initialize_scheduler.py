import asyncio
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from apscheduler.triggers.interval import IntervalTrigger
from core.config import PREDICTION_CONFIG, setup_logging

logger = setup_logging()

def initialize_scheduler():
    scheduler = BackgroundScheduler()

    # Import 재학습 및 예측 관련 함수
    from services.train.run_all_trains import run_all_retrain
    from services.predict.run_all_predictions import run_all_predictions

    # 1. 비동기 작업을 동기로 호출할 수 있도록 래핑
    def run_all_predictions_task():
        asyncio.run(run_all_predictions())

    # 2. 재학습 스케줄러 설정 (매일 04:00)
    scheduler.add_job(
        run_all_retrain,
        trigger=CronTrigger(hour=10, minute=0),  # 매일 오전 4시
        name="Daily Retrain",
        replace_existing=True,
    )

    # 3. 예측 스케줄러 설정 (설정된 간격으로 실행)
    scheduler.add_job(
        run_all_predictions_task,
        trigger=IntervalTrigger(minutes=PREDICTION_CONFIG["interval_minutes"]),  # 설정된 간격
        name="Run All Predictions",
        replace_existing=True,
    )

    # 스케줄러 시작
    scheduler.start()
    logger.info("스케줄러가 시작되었습니다.")
    return scheduler
