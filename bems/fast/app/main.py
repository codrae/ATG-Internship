import os
import sys
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse, JSONResponse

from core.config import API_CONFIG, setup_logging, buildings_url_dict
from services.scheduler.initialize_scheduler import initialize_scheduler
from services.train.re_train import re_train
from services.train.run_all_trains import run_all_retrain

logger = setup_logging()

# 현재 파일과 프로젝트 루트 경로 설정
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(current_dir, '..'))
if project_root not in sys.path:
    sys.path.insert(0, project_root)


@asynccontextmanager
async def lifespan(app: FastAPI):
    scheduler = initialize_scheduler()

    logger.info("서버 시작 시 run_all_retrain 실행")
    run_all_retrain()

    try:
        yield  # FastAPI 앱의 lifespan 유지
    finally:
        # 스케줄러 종료
        scheduler.shutdown()
        logger.info("스케줄러가 종료되었습니다.")


# FastAPI 앱을 lifespan과 함께 한 번만 선언
app = FastAPI(lifespan=lifespan)


# 기본 라우트
@app.get("/")
async def home():
    return {"message": "Server is good!"}


@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    return FileResponse("static/favicon.ico")


# url명을 key, 건물명을 value로 가지는 dictionary 생성
reverse_buildings_url_dict = {v: k for k, v in buildings_url_dict.items()}


# 재학습 엔드포인트
@app.get("/retrain/{building_id}/{energy_type}")
async def re_train_endpoint(building_id: str, energy_type: str):
    result = re_train(building_id, energy_type)

    if "error" in result:
        raise HTTPException(status_code=500, detail=result["details"])

    return JSONResponse(content=result, status_code=200)


@app.get("/retrain-all")
async def re_train_all_endpoint():
    result = run_all_retrain()

    if "error" in result:
        raise HTTPException(status_code=500, detail=result["details"])

    return JSONResponse(content=result, status_code=200)


@app.get("/learning-status") # TODO: 모델이 건물/에너지원별로 (현재는 전력뿐이지만) 있기에, 이에 맞춰 상태도 구분해주어야 함.
def is_learning():
    return False


# 애플리케이션 실행
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host=API_CONFIG['host'], port=API_CONFIG['port'])
