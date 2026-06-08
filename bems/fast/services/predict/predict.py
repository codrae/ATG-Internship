import logging
import sys

from sklearn.preprocessing import MinMaxScaler

sys.path.append("/")

logger = logging.getLogger(__name__)


def predict(model, test_loader, scaler, device="cpu"):
    model.eval()
    predictions = []
    actuals = []

    with torch.no_grad():
        for seqs, targets in test_loader:
            seqs, targets = seqs.to(device), targets.to(device)
            outputs = model(seqs)
            predictions.extend(outputs.cpu().numpy())
            actuals.extend(targets.cpu().numpy())

    predictions = scaler.inverse_transform(np.array(predictions).reshape(-1, 1))
    actuals = scaler.inverse_transform(np.array(actuals).reshape(-1, 1))

    return predictions, actuals


def load_data_from_df(df, column_name):
    """ 데이터 스케일링 함수 """
    data = df[column_name].values.reshape(-1, 1)

    scaler = MinMaxScaler()
    scaled_data = scaler.fit_transform(data)

    return scaled_data, scaler


import pandas as pd
import numpy as np
import torch


def generate_predictions(df, model, num_predictions, window_size):
    """
    학습 데이터로 주어진 데이터프레임을 사용하여 주어진 수만큼 데이터를 예측하는 함수

    Parameters:
    df : pd.DataFrame - 전체 데이터프레임, index는 시간(datetime), column은 예측 대상 데이터
    model : LSTMModel - 학습된 모델
    num_predictions : int - 예측할 데이터 포인트 수
    window_size : int - 입력으로 사용할 과거 데이터 시점 수

    Returns:
    pd.DataFrame - 예측된 값이 포함된 데이터프레임
    """
    try:
        # 데이터 전처리 및 스케일링
        data, scaler = load_data_from_df(df, 'DataValue')

        # 예측 수행
        prediction_input = data[-window_size:]  # 마지막 window_size 만큼의 데이터를 입력으로 사용
        predictions_list = []

        for _ in range(num_predictions):
            input_tensor = torch.tensor(prediction_input, dtype=torch.float32).unsqueeze(0).to("cpu")
            prediction = model(input_tensor)
            prediction_np = prediction.cpu().detach().numpy()[0][0]
            predictions_list.append(prediction_np)

            prediction_input = np.append(prediction_input[1:], [[prediction_np]], axis=0)
        print("스케일 역변환")
        # 스케일 역변환
        predictions_scaled = scaler.inverse_transform(np.array(predictions_list).reshape(-1, 1))
        print("예측값 데이터 프레임 생성")
        # 예측 값 데이터프레임 생성
        predictions_df = pd.DataFrame(
            predictions_scaled,
            index=pd.date_range(start=df.index[-1], periods=num_predictions + 1, freq='10min')[1:],
            columns=['DataValue']
        )

        print(predictions_df)
        return predictions_df

    except Exception as e:
        print(f"Error during prediction generation: {e}")
        raise
