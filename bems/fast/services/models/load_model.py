import logging  # [CHANGE] 로깅을 위해 추가
import os
import sys

import torch

from utils.get_latest_file import get_latest_file
from utils.set_device import set_device

# 프로젝트 루트 경로 설정
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(current_dir, "../.."))
sys.path.append(project_root)

from services.models.lstm_model import LSTMModel

logger = logging.getLogger(__name__)


def load_model(building_id: str, energy_type: str):
    """
    trained_models 폴더에서 가장 최근 .pth 파일을 로드하고 LSTM 모델을 반환합니다.
    """
    logger.info(f"Attempting to load model for building_id={building_id}, energy_type={energy_type}")

    try:
        # trained_models 폴더에서 가장 최근 파일 찾기
        model_directory = os.path.join(project_root, "services", "train", "trained_models")
        latest_file = get_latest_file(model_directory, building_id, energy_type, "pth")
        logger.info(f"Latest model file found: {latest_file}")
    except FileNotFoundError as e:
        print(f"Error: {e}")
        logger.error(f"Model file not found for {building_id}-{energy_type}: {e}")
        return None

    # LSTM 모델 초기화
    model = LSTMModel()
    logger.debug("LSTMModel instance created.")

    try:
        logger.debug("Loading state_dict from the model file.")
        state_dict = torch.load(latest_file, map_location="cpu", weights_only=True)
        model.load_state_dict(state_dict)
        logger.info("Model state_dict successfully loaded into the LSTMModel.")
    except Exception as e:
        logger.error(f"Exception occurred while loading model state_dict: {e}")
        return None

    # 디바이스 설정
    device = set_device()
    model = model.to(device)
    logger.info(f"Model moved to device: {device}")

    logger.info(f"Model loading completed for building_id={building_id}, energy_type={energy_type}")

    return model


if __name__ == "__main__":
    # 테스트용 설정값
    test_building_id = "ANNIVERSARY_MEMORIAL_HALL"
    test_energy_type = "POWER"

    print("===== 모델 로드 테스트 시작 =====")
    logger.info("===== 모델 로드 테스트 시작 =====")

    loaded_model = load_model(test_building_id, test_energy_type)

    if loaded_model:
        print("테스트 성공: 모델이 성공적으로 로드되었습니다.")
        logger.info("Model load test successful.")
    else:
        print("테스트 실패: 모델 로드에 문제가 발생했습니다.")
        logger.warning("Model load test failed.")

    print("===== 모델 로드 테스트 종료 =====")
    logger.info("===== 모델 로드 테스트 종료 =====")
