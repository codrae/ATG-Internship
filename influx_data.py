import influxdb_client
from influxdb_client.client.write_api import SYNCHRONOUS
import numpy as np
import pandas as pd

bucket = "demo"
org = "halee"
token = "uvxB6umk1_oPBve07f12HA4dqUlvaOOSK1-y1LbE5ZluB-D2LnvdYg-nIlcWxOqilohFJxlSE-0eVpb_ZjSsOg=="
url = "http://localhost:8086"

# client config 설정
client = influxdb_client.InfluxDBClient(
    url = url,
    token = token,
    org = org
)

query_api = client.query_api()
query = 'from(bucket: "demo")\
  |> range(start:0)\
  |> filter(fn: (r) => r._measurement== "Electricity_B1E.csv_measurements")\
  |> filter(fn: (r) => r._field == "active_power")\
  |> aggregateWindow(every: 1d, fn: mean, createEmpty: false)\
  |> yield(name: "mean")'


tables = query_api.query(org=org, query=query)
# print(len(tables)) # <class 'influxdb_client.client.flux_table.TableList'> 


results = []
for table in tables:
    for record in table.records:
        results.append(
            [record.get_field(),
             record.get_value(),
             record.get_measurement(),
             record.get_time(),
            ]
        )   

active_values = np.array([row[1] for row in results], dtype = np.float32).reshape(-1,1)
time = np.array([row[3] for row in results], dtype='datetime64').reshape(-1,1) 

# 타임존 정보를 제거하는 방법
time = np.array([row[3].replace(tzinfo=None) for row in results], dtype='datetime64[s]')


data = pd.DataFrame()
data['active_power'] = pd.DataFrame(active_values)
data['Date'] = pd.to_datetime(time, utc=True)

