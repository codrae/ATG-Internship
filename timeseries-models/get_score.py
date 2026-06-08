import numpy as np
from sklearn.metrics import mean_squared_error, mean_absolute_error

def calculate_score(y_true, y_pred, max_rmse=10, max_mae=10):
    """
    실제 값(y_true)과 예측 값(y_pred)을 기반으로 RMSE와 MAE를 계산한 후,
    이를 100점 만점으로 변환하여 성능 점수를 반환하는 함수.
    
    Args:
        y_true (np.array): 실제 값의 배열
        y_pred (np.array): 예측 값의 배열
        max_rmse (float): RMSE 기준 최대 허용 값 (이 값 이상이면 0점)
        max_mae (float): MAE 기준 최대 허용 값 (이 값 이상이면 0점)
        
    Returns:
        total_score (float): RMSE와 MAE에 기반한 총 점수 (100점 만점)
    """
    
    # RMSE (Root Mean Squared Error) 계산
    # RMSE는 예측값과 실제값 사이의 차이를 제곱한 후 평균을 구한 다음 그 제곱근을 구하는 값
    rmse = np.sqrt(mean_squared_error(y_true, y_pred))
    
    # MAE (Mean Absolute Error) 계산
    # MAE는 예측값과 실제값 사이의 차이의 절댓값을 평균한 값
    mae = mean_absolute_error(y_true, y_pred)
    
    # RMSE와 MAE 출력 (성능 확인용)
    print(f'rmse : {rmse}')
    print(f'mae : {mae}')
    
    # RMSE와 MAE를 점수로 변환
    # RMSE 점수 계산 (작을수록 좋은 점수를 받음)
    # RMSE가 max_rmse(예: 10)일 때 0점, RMSE가 0일 때 50점을 받음
    rmse_score = max(0, 50 - (rmse / max_rmse) * 50)
    
    # MAE 점수 계산 (작을수록 좋은 점수를 받음)
    # MAE가 max_mae(예: 10)일 때 0점, MAE가 0일 때 50점을 받음
    mae_score = max(0, 50 - (mae / max_mae) * 50)
    
    # 총 점수 계산
    # RMSE 점수와 MAE 점수를 더한 값이 최종 점수로 계산됨 (최대 100점)
    total_score = rmse_score + mae_score
    
    # 총 점수 반환
    return total_score
# 총 점수 계산
total_score = calculate_score(y_true, y_pred)



# 결과 출력 (100점 만점에서 총 점수 출력)
print(f'Total Score: {total_score:.2f}/100')
