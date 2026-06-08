import torch
import os
import logging

logger = logging.getLogger("app_logger")  # 기존 로거 사용

def save_model(building_id: str, energy_type: str, model, save_path: str) -> None:
    """
    모델을 지정된 경로에 저장하는 함수.

    Args:
        building_id (str): 건물 ID.
        energy_type (str): 에너지원 타입.
        model: 저장할 모델 객체.
        save_path (str): 모델을 저장할 파일 경로.

    Raises:
        Exception: 모델 저장에 실패한 경우.
    """
    try:
        os.makedirs(os.path.dirname(save_path), exist_ok=True)  # 디렉토리 없으면 생성
        torch.save(model.state_dict(), save_path)
        logger.info(f"Model saved to {save_path}")
    except Exception as e:
        logger.error(f"Failed to save model to {save_path}: {e}")
        raise e
