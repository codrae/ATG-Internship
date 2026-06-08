import os
from influxdb_client import InfluxDBClient
import logging

# 환경변수에서 설정 읽기
INFLUXDB_CONFIG = {
    'url': os.getenv('INFLUXDB_URL', 'http://localhost:8086'),  # 기본값 추가
    'token': os.getenv('INFLUXDB_TOKEN', ''),
    'org': os.getenv('INFLUXDB_ORG', 'default_org'),
    'bucket': os.getenv('INFLUXDB_BUCKET', 'default_bucket'),
}

SPRING_CONFIG = {
    'url': os.getenv('SPRING_URL', 'http://localhost:8080'),
    "host": os.getenv("SPRING_HOST", "app"),
    "port": int(os.getenv("SPRING_PORT", 8080))

}


API_CONFIG = {
    'host': os.getenv('API_HOST', '0.0.0.0'),
    'port': int(os.getenv('API_PORT', 8000)),
}

LSTM_CONFIG = {
    "input_size": int(os.getenv('LSTM_INPUT_SIZE', 1)),
    "hidden_size": int(os.getenv('LSTM_HIDDEN_SIZE', 50)),
    "num_layers": int(os.getenv('LSTM_NUM_LAYERS', 2)),
    "output_size": int(os.getenv('LSTM_OUTPUT_SIZE', 1)),
    "dropout": float(os.getenv('LSTM_DROPOUT', 0.2)),
}

PREDICTION_CONFIG = {
    'num_predictions': int(os.getenv('PREDICTION_NUM', 25)),
    'interval_hours': int(os.getenv('PREDICTION_INTERVAL_HOURS', 4)),
    'interval_minutes': int(os.getenv('PREDICTION_INTERVAL_MINUTES', 60)),
}

# InfluxDB Client Initialization
client = InfluxDBClient(
    url=INFLUXDB_CONFIG['url'],
    token=INFLUXDB_CONFIG['token'],
    org=INFLUXDB_CONFIG['org']
)

# 건물 및 에너지원 정보만 저장하는 사전
buildings_dict = {
    "BUILDING_1": ["POWER", "HEAT", "GAS"],
    "ANNIVERSARY_MEMORIAL_HALL": ["POWER", "HEAT", "GAS"],
    "LAW_SCHOOL_BUILDING": ["POWER", "HEAT", "GAS"],
    "INHA_DREAM_CENTER_2_3": ["POWER", "HEAT", "GAS"],
    "HIGH_TECH_CENTER": ["POWER", "HEAT", "GAS"],
}

buildings_url_dict = {
    "BUILDING_1": "building-1",
    "ANNIVERSARY_MEMORIAL_HALL": "anniversary-memorial-hall",
    "LAW_SCHOOL_BUILDING": "law-school-building",
    "INHA_DREAM_CENTER_2_3": "inha-dream-center",
    "HIGH_TECH_CENTER": "high-tech-center",
}

# Logging 설정
def setup_logging():
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(message)s",
        handlers=[logging.StreamHandler()]
    )
    return logging.getLogger(__name__)
