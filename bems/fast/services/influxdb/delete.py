from influxdb_client import InfluxDBClient
from core.config import INFLUXDB_CONFIG

# InfluxDB 클라이언트 생성
client = InfluxDBClient(
    url=INFLUXDB_CONFIG['url'],
    token=INFLUXDB_CONFIG['token'],
    org=INFLUXDB_CONFIG['org']
)

# Delete API 인스턴스
delete_api = client.delete_api()

# 삭제 범위 설정 (start ~ stop)
# start를 충분히 과거(예: Epoch 시간 시작점)로 설정하여 해당 시간 이전의 모든 데이터 삭제
start_time = "1970-01-01T00:00:00Z"
stop_time = "2024-12-14T01:40:00Z"

# measurement 조건
predicate = '_measurement="ANNIVERSARY_MEMORIAL_HALL_PREDICT"'

# 삭제 요청
delete_api.delete(
    start=start_time,
    stop=stop_time,
    predicate=predicate,
    bucket=INFLUXDB_CONFIG['bucket'],
    org=INFLUXDB_CONFIG['org']
)

print("Deletion request completed.")
