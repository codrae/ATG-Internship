import matplotlib.pyplot as plt
import pandas as pd
from influxdb_client import InfluxDBClient

from core.config import INFLUXDB_CONFIG

# InfluxDB 클라이언트 및 Write API 생성
client = InfluxDBClient(
    url=INFLUXDB_CONFIG['url'],
    token=INFLUXDB_CONFIG['token'],
    org=INFLUXDB_CONFIG['org']
)

# 데이터 가져오기
query = f"""
from(bucket: "{INFLUXDB_CONFIG['bucket']}")
  |> range(start: -1w)
  |> filter(fn: (r) => r["_measurement"] == "ANNIVERSARY_MEMORIAL_HALL")
  |> filter(fn: (r) => r["_field"] == "value")
  |> filter(fn: (r) => r["energy_type"] == "POWER")
  |> aggregateWindow(every: 1h, fn: mean, createEmpty: false)
  |> yield(name: "mean")
"""

query_predict = f"""
import "experimental"
from(bucket: "{INFLUXDB_CONFIG['bucket']}")
  |> range(start: -1h, stop: experimental.addDuration(d: 1d, to: now()))
  |> filter(fn: (r) => r["_measurement"] == "ANNIVERSARY_MEMORIAL_HALL_PREDICT")
  |> filter(fn: (r) => r["_field"] == "value")
  |> filter(fn: (r) => r["energy_type"] == "POWER")
  |> aggregateWindow(every: 1h, fn: mean, createEmpty: false)
  |> yield(name: "mean")
"""


# 데이터 가져오기 및 변환 함수
def fetch_data_from_influxdb(q):
    tables = client.query_api().query(q, org=INFLUXDB_CONFIG['org'])
    data = []
    for table in tables:
        for record in table.records:
            data.append({
                "time": record.get_time(),
                "value": record.get_value(),
                "measurement": record.get_measurement()
            })
    return pd.DataFrame(data)


# 데이터 시각화 함수
def visualize_data(df):
    df['time'] = pd.to_datetime(df['time'])
    plt.figure(figsize=(12, 6))

    # 측정값별로 필터링 및 시각화
    for measurement in df['measurement'].unique():
        filtered_df = df[df['measurement'] == measurement]
        plt.plot(filtered_df['time'], filtered_df['value'], marker='o', label=measurement)

    plt.title("Power Usage Over Time")
    plt.xlabel("Time")
    plt.ylabel("Value")
    plt.legend()
    plt.grid(True)
    plt.show()


# 실행 부분
if __name__ == "__main__":
    # 역사 데이터와 예측 데이터 가져오기
    df_history = fetch_data_from_influxdb(query)
    df_predict = fetch_data_from_influxdb(query_predict)

    # 두 데이터 병합
    df = pd.concat([df_history, df_predict], ignore_index=True)

    if not df.empty:
        print("Fetched data:")
        print(df.head())
        # 시각화
        visualize_data(df)
    else:
        print("No data found.")
