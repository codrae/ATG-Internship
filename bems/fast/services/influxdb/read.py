import os
import sys

import pandas as pd

# 프로젝트 루트 경로를 추가
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

from core.config import *

# InfluxDB 클라이언트 및 Query API를 전역으로 선언
query_api = client.query_api()


def read_data(
        measurement: str = "ANNIVERSARY_MEMORIAL_HALL",
        tag_key: str = "energy_type",
        tag_value: str = "POWER",
        start_time: str = "2024-04-25T00:00:00Z",
        stop_time: str = "now()"
) -> pd.DataFrame:
    """
    InfluxDB에서 데이터를 조회하여 pandas DataFrame으로 반환합니다.

    Args:
        measurement (str): 조회할 측정값(measurement) 이름.
        tag_key (str): 필터링할 태그의 키.
        tag_value (str): 필터링할 태그의 값.
        start_time (str): 조회할 데이터의 시작 시간 (예: '2024-04-25T00:00:00Z' 또는 '-24h').
        stop_time (str, optional): 조회할 데이터의 종료 시간 (예: '2024-04-26T00:00:00Z'). 기본값은 현재 시간.

    Returns:
        pd.DataFrame: 조회된 데이터를 포함하는 pandas DataFrame.
    """

    # 시간 필터링 설정
    if stop_time:
        time_range = f'range(start: {start_time}, stop: {stop_time})'
    else:
        time_range = f'range(start: {start_time})'

    query = f'''
    from(bucket: "{INFLUXDB_CONFIG['bucket']}")
      |> {time_range}
      |> filter(fn: (r) => r["_measurement"] == "{measurement}")
      |> filter(fn: (r) => r["_field"] == "value")
      |> filter(fn: (r) => r["{tag_key}"] == "{tag_value}")
      |> sort(columns: ["_time"], desc: false)
    '''

    print("실행할 쿼리:")
    print(query)

    try:
        # 쿼리 실행
        tables = query_api.query(query, org=INFLUXDB_CONFIG['org'])

        # 결과를 리스트로 변환
        records = []
        for table in tables:
            for record in table.records:
                records.append({
                    "DateTime": record.get_time(),
                    "DataValue": record.get_value(),
                    "Tag": record.values.get(tag_key)
                })

        # DataFrame으로 변환
        df = pd.DataFrame(records)

        if not df.empty:
            print(f"조회된 데이터 ({len(df)}개):")
            print(df)
        else:
            print("조회된 데이터가 없습니다.")

        return df

    except Exception as e:
        print(f"데이터 조회 중 오류 발생: {e}")
        return pd.DataFrame()


if __name__ == "__main__":
    df = read_data()
    print(df)
