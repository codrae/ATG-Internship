import torch.nn as nn
import torch.optim as optim
import logging

from core.config import LSTM_CONFIG
from services.models.lstm_model import LSTMModel

# [CHANGE] 로거 생성
logger = logging.getLogger(__name__)


def train_model(train_loader, building_id: str, energy_type: str, num_epochs=30, learning_rate=0.001, device="cpu"):
    """
    [CHANGE] train_model 함수:
    주어진 train_loader와 모델 파라미터(LSTM_CONFIG)를 사용해 LSTM 모델을 학습한다.

    Args:
        train_loader (DataLoader): 학습 데이터로더
        building_id (str): 빌딩 식별자
        energy_type (str): 에너지 유형
        num_epochs (int): 학습 에폭 수 (기본값: 30)
        learning_rate (float): 학습률 (기본값: 0.001)
        device (str): 'cpu' 또는 'cuda' 디바이스명 (기본값: 'cpu')

    Returns:
        model (LSTMModel): 학습된 모델 인스턴스
    """

    logger.info(f"Initializing LSTMModel for building_id={building_id}, energy_type={energy_type}, "
                f"num_epochs={num_epochs}, learning_rate={learning_rate}, device={device}")

    model = LSTMModel().to(device)
    criterion = nn.MSELoss()
    optimizer = optim.Adam(model.parameters(), lr=learning_rate)

    logger.info("Model training started.")

    for epoch in range(num_epochs):
        model.train()
        epoch_loss = 0.0

        for seqs, targets in train_loader:
            seqs, targets = seqs.to(device), targets.to(device)
            optimizer.zero_grad()
            outputs = model(seqs)
            loss = criterion(outputs, targets)
            loss.backward()
            optimizer.step()
            epoch_loss += loss.item()

        avg_loss = epoch_loss / len(train_loader)

        logger.debug(f"Epoch {epoch + 1}/{num_epochs} completed. Avg Loss: {avg_loss:.4f}")

        # 기존 코드와 호환성 유지 (10 에폭마다 print)
        if (epoch + 1) % 10 == 0:
            print(
                f'Train for {building_id} / {energy_type}. \n Epoch {epoch + 1}/{num_epochs}, Average Loss: {avg_loss:.4f}')
            logger.info(f"Epoch {epoch + 1}/{num_epochs}, Average Loss: {avg_loss:.4f}")

    logger.info(f"Model training completed for building_id={building_id}, energy_type={energy_type}")

    return model
