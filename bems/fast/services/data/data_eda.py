import matplotlib

matplotlib.use('TkAgg')  # Tkinter 기반 GUI 백엔드를 사용하는 경우

import matplotlib.pyplot as plt
import pandas as pd
from scipy.stats import zscore


def analyze_dataframe(df):
    # 'DateTime'을 datetime 형식으로 변환
    if df['DateTime'].dtype == 'O':  # 문자열일 경우 변환
        df['DateTime'] = pd.to_datetime(df['DateTime'])

    # 결측치 확인
    missing_values = df.isnull().sum()

    # Z-score를 사용한 이상치 확인
    df['zscore'] = zscore(df['DataValue'])
    outliers_zscore = df[df['zscore'].abs() > 3]

    # DataValue가 0인 값 확인
    zero_values = df[df['DataValue'] == 0]

    # 전체 시각화
    plt.figure(figsize=(10, 6))
    plt.plot(df['DateTime'], df['DataValue'], marker='o', label='DataValue')
    plt.title('DataValue Trend Over Time')
    plt.xlabel('DateTime')
    plt.ylabel('DataValue')
    plt.grid(True)

    n_ticks = 12  # 표시할 라벨 수
    x_ticks = df['DateTime'][::len(df) // n_ticks]  # 일정 간격으로 12개 라벨 선택
    plt.xticks(x_ticks, rotation=45)  # 45도 회전

    plt.tight_layout()
    plt.show()

    # 각 결과를 한 줄로 출력
    print(f"결측치 개수: \n{missing_values}")
    print(f"이상치 개수 (Z-score > 3): {outliers_zscore.shape[0]}")
    print(f"DataValue가 0인 값 개수: {zero_values.shape[0]}")

    # DataValue가 0인 값들의 DateTime 출력
    if not zero_values.empty:
        print("DataValue가 0인 값들의 DateTime:")
        print(zero_values['DateTime'].to_string(index=False))  # DateTime만 출력
    else:
        print("DataValue가 0인 값이 없습니다.")

    # zscore 컬럼 삭제
    df = df.drop(columns=['zscore'], errors='ignore')

    print("df.tail()의 모습 \n" + df.tail().to_string(index=False))


def find_missing_intervals(df):
    # DateTime 열을 datetime 형식으로 변환
    df['DateTime'] = pd.to_datetime(df['DateTime'])

    previous_time = None
    missing_found = False  # 누락된 구간 여부를 추적할 변수

    for current_time in df['DateTime']:
        if previous_time is not None:
            time_diff_minutes = (current_time - previous_time).total_seconds() / 60
            if time_diff_minutes > 10:
                missing_points = (time_diff_minutes // 10) - 1
                print(
                    f"누락된 구간: {previous_time.strftime('%Y-%m-%d %H:%M')} ~ {current_time.strftime('%H:%M')}, 누락된 데이터포인트: {int(missing_points)}개")
                missing_found = True  # 누락된 구간이 있음을 표시
        previous_time = current_time

    # 누락된 구간이 없을 경우 메시지 출력
    if not missing_found:
        print("누락된 구간이 없습니다.")


def eda(data):
    analyze_dataframe(data)
    find_missing_intervals(data)
