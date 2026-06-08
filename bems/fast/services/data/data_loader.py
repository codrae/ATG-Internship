import logging

from sklearn.preprocessing import MinMaxScaler
from torch.utils.data import DataLoader, Subset

from services.data.dataset_class import PowerDataset

# 로그 설정 (이미 설정됨)
logger = logging.getLogger(__name__)


def data_scaler(df, column_name='DataValue'):
    logger.info(f"Starting data scaling for column: {column_name}")
    data = df[column_name].values.reshape(-1, 1)

    scaler = MinMaxScaler()
    scaled_data = scaler.fit_transform(data)

    logger.info(f"Data scaling completed. Data shape: {scaled_data.shape}, "
                f"Min value: {scaled_data.min()}, Max value: {scaled_data.max()}")

    return scaled_data, scaler


def create_train_dataloader(data, window_size=24, batch_size=32, shuffle=False):
    logger.info(f"Creating train DataLoader with window_size={window_size}, "
                f"batch_size={batch_size}, shuffle={shuffle}")

    dataset = PowerDataset(data, window_size)
    logger.info(f"PowerDataset created for training. Dataset length: {len(dataset)}")

    # 훈련/검증 데이터 분리 (80% 훈련 데이터, 20% 테스트 데이터)
    train_size = int(len(dataset) * 0.80)

    # 학습과 테스트 데이터셋을 슬라이싱으로 나누기
    train_dataset = Subset(dataset, list(range(train_size)))
    test_dataset = Subset(dataset, list(range(train_size, len(dataset))))

    # 데이터 로더 생성
    train_loader = DataLoader(train_dataset, batch_size=32, shuffle=True)
    test_loader = DataLoader(test_dataset, batch_size=32, shuffle=False)
    return train_loader, test_loader


def test_dataloader(train_loader):
    logger.info("Testing DataLoader output...")

    for batch_idx, (inputs, targets) in enumerate(train_loader):
        logger.info(f"Batch {batch_idx}: Inputs shape = {inputs.shape}, Targets shape = {targets.shape}")
        print(f"Batch {batch_idx}:")
        print(f"Inputs:\n{inputs}\n")
        print(f"Targets:\n{targets}\n")
        break  # 첫 번째 배치만 확인하고 종료


# 예시 데이터프레임 생성 및 함수 실행 (테스트 목적)
if __name__ == "__main__":
    import pandas as pd
    import numpy as np

    # 테스트용 데이터프레임 생성
    df = pd.DataFrame({
        "DataValue": np.random.rand(1000)  # 1000개의 랜덤 값
    })

    # 스케일링
    scaled_data, _ = data_scaler(df, column_name='DataValue')

    # DataLoader 생성
    train_loader = create_train_dataloader(scaled_data, window_size=24, batch_size=32, shuffle=True)

    # DataLoader 테스트
    test_dataloader(train_loader)
