import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))
import pandas as pd
from influxdb_client import InfluxDBClient
from influxdb_client import Point
from influxdb_client.client.write_api import SYNCHRONOUS

from core.config import INFLUXDB_CONFIG

# 현재 파일의 경로 기준으로 프로젝트 루트 경로를 추가
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))


# InfluxDB 클라이언트 및 Write API를 전역으로 선언
client = InfluxDBClient(url=INFLUXDB_CONFIG['url'], token=INFLUXDB_CONFIG['token'], org=INFLUXDB_CONFIG['org'])
write_api = client.write_api(write_options=SYNCHRONOUS)


def write_df_to_influxdb(df: pd.DataFrame, measurement: str, tag_value: str):
    """
    Pandas DataFrame을 InfluxDB에 씁니다. 데이터 타입을 태그로 추가합니다.

    Args:
        df (pd.DataFrame): 저장할 데이터프레임. 최소한 'DateTime'과 'DataValue' 열이 있어야 합니다.
    """
    # DataValue를 float 타입으로 변환
    df["DataValue"] = df["DataValue"].astype(float)

    # 태그 설정: raw, processed, predict 중 하나
    tags = {"energy_type": tag_value}

    # 포인트 생성
    points = [
        Point(measurement)
        .field("value", row["DataValue"])
        .time(row.name)
        .tag("energy_type", tag_value)
        for _, row in df.iterrows()
    ]

    if points:
        try:
            write_api.write(bucket=INFLUXDB_CONFIG['bucket'], org=INFLUXDB_CONFIG['org'], record=points)
            print(f"Data from {measurement} has been successfully written to InfluxDB with energy_type '{tag_value}'.")
        except Exception as e:
            print(f"데이터 쓰기 중 오류 발생: {e}")
    else:
        print("No new data to write to InfluxDB.")


import pandas as pd
from datetime import datetime, timedelta

if __name__ == "__main__":
    # 현재 시간 기준으로 24시간 동안의 10분 간격 데이터 생성
    end_time = datetime.now()
    start_time = end_time - timedelta(hours=24)
    time_index = pd.date_range(start=start_time, end=end_time, freq="10min")

    # 예시 데이터 생성 (DataValue 열에는 임의의 값 생성)
    test_data = {
        "DateTime": time_index,
        "DataValue": [100 + i * 0.5 for i in range(len(time_index))]  # 예시 데이터 값 생성
    }

    # DataFrame 생성
    df = pd.DataFrame(test_data)

    df["DateTime"] = df["DateTime"].dt.tz_localize("UTC")

    df.set_index("DateTime", inplace=True)
    df.sort_index(inplace=True)

    # 함수 호출
    measurement = "test_measurement_raw"
    tag_value = "POWER"

    # InfluxDB에 데이터 쓰기
    write_df_to_influxdb(df, measurement, tag_value)

    # 결과 메시지 출력
    print("24시간 동안의 10분 간격 테스트 데이터가 InfluxDB에 성공적으로 작성되었는지 확인하세요.")
