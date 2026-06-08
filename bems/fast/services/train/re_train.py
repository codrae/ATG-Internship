import logging
import os
import sys
from datetime import datetime, timezone

from services.predict.re_predict import complete_predict
from services.predict.predict import generate_predictions

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

from core.config import setup_logging
from utils.cleanup_old_files import cleanup_old_files
from services.models.save_model import save_model
from services.data.data_loader import create_train_dataloader, data_scaler
from services.data.data_preprocessing import preprocess
from services.influxdb.create import write_df_to_influxdb
from services.influxdb.read import read_data
from services.train.train import train_model

import torch
import traceback

logger = setup_logging()


def re_train(building_id: str, energy_type: str):
    """
    재학습 및 예측 수행
    """
    try:
        # ----------------- 데이터 로드 -----------------
        raw_df = read_data(measurement=building_id, tag_key="energy_type", tag_value=energy_type)
        if raw_df is None or raw_df.empty:
            logger.error("Data load failed: No data found.")
            return {"error": "Data load failed"}

        print(raw_df['DataValue'].max(), "_____________________", raw_df['DataValue'].min())

        # ----------------- 데이터 전처리 -----------------
        preprocessed_df = preprocess(raw_df)
        if preprocessed_df is None or preprocessed_df.empty:
            logger.error("Preprocessing failed: No processed data.")
            return {"error": "Preprocessing failed"}

        # 전처리된 데이터프레임(preprocessed_df)의 DataValue 열의 최소값과 최대값 찾기
        min_value = preprocessed_df['DataValue'].min()
        max_value = preprocessed_df['DataValue'].max()
        print(f"Min Value: {min_value}, Max Value: {max_value}")

        # ----------------- 데이터 스케일링 및 로더 생성 -----------------
        data, scaler = data_scaler(preprocessed_df)
        if data is None or len(data) == 0 or scaler is None:
            logger.error("Data scaling failed.")
            return {"error": "Data scaling failed"}
        logger.info(f"Scaled data shape: {data.shape}, Min: {data.min()}, Max: {data.max()}")

        train_loader, test_loader = create_train_dataloader(data)
        if train_loader is None or test_loader is None:
            logger.error("DataLoader creation failed.")
            return {"error": "DataLoader creation failed"}

        # ----------------- 모델 학습 -----------------
        device = torch.device("cpu")
        trained_model = train_model(train_loader, building_id, energy_type, device="cpu")
        if trained_model is None:
            logger.error("Model training failed.")
            return {"error": "Model training failed"}

        # ----------------- 미래 데이터 예측 -----------------
        future_predictions = generate_predictions(preprocessed_df, trained_model, 25, 24)
        logger.info("Future predictions completed.")

        # ----------------- 모델 저장 및 정리 -----------------
        current_time = datetime.now(timezone.utc).strftime("%Y%m%d%H%M%S")
        logger.info(f"Re-training started for building: {building_id}, energy_type: {energy_type}")

        model_directory = "trained_models"
        os.makedirs(model_directory, exist_ok=True)
        model_filename = f"{building_id}_{energy_type}_{current_time}.pth"
        save_model(building_id, energy_type, trained_model, save_path=os.path.join(model_directory, model_filename))
        cleanup_old_files(building_id=building_id, energy_type=energy_type)

        write_df_to_influxdb(future_predictions, measurement=f"{building_id}_PREDICT", tag_value=energy_type)
        logger.info(f"Re-training and prediction completed for building: {building_id}, energy_type: {energy_type}")

        complete_predict(building_id,energy_type)

        return {"message": "Re-training and prediction completed successfully."}

    except Exception as e:
        logger.error(f"Error during re-training: {e}")
        traceback.print_exc()
        return {"error": "Internal Server Error", "details": str(e)}


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    test_building_id = "ANNIVERSARY_MEMORIAL_HALL"
    test_energy_type = "POWER"

    logger.info("===== Re-training Test Started =====")

    result = re_train(building_id=test_building_id, energy_type=test_energy_type)
    if result and "message" in result:
        logger.info(result["message"])
    else:
        logger.error(result.get("error", "Unknown error"))
        logger.error(result.get("details", "No additional details"))

    logger.info("===== Re-training Test Completed =====")
