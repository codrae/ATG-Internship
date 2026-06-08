# BEMS - FastAPI 프로젝트 구조 및 역할

---

## 프로젝트 주요 기능
1. **예측 모델 Serving**: 학습된 모델을 API로 제공하여 예측 기능을 지원
2. **API 제공**: NextJS-Spring 기반 프로젝트와 연동을 위한 API 엔드포인트 제공
3. **데이터 전처리 및 분석**: 필요한 경우 데이터 전처리와 분석 기능 수행
4. **데이터 분석 기능**: 통계 분석 및 데이터 조회 기능 제공
5. **재학습 서버 제공**: 모델의 재학습을 위한 서버 기능 제공

---

## 프로젝트 디렉토리 구조

### app/
- **main.py**: FastAPI 애플리케이션의 메인 진입점입니다. 모든 API 엔드포인트를 초기화하고 애플리케이션을 실행합니다.

### core/
- **config.py**: 데이터베이스 설정 및 FastAPI 설정이 포함되어 있으며, 보안상 `gitignore` 처리되어 있습니다.

### services/
- **data/**: 데이터 전처리, EDA, PyTorch의 Dataset 클래스 설정 및 DataLoader 구현 등 데이터 관련 로직을 담당합니다.
- **influxdb/**: InfluxDB와의 통신을 담당하며, 기본적인 CRUD 기능을 포함합니다.
- **models/**: LSTM 모델의 로드, 정의, 저장 등의 작업을 담당합니다.
- **predict/**: 예측 관련 로직이 포함되며, 기본 예측, API 통신을 위한 재예측, 대규모 예측 등을 수행합니다.
- **train/**: 모델 학습을 위한 코드로, 학습 후 결과를 `trained_models/` 디렉토리에 저장합니다.
- **scheduler/**: 주기적으로 수행되는 작업을 관리하기 위한 스케줄러 관련 로직이 포함됩니다.
- **visualize/**: 배포 전이나 개발 과정에서 데이터를 시각화하여 검증하는데에 사용됩니다.

### utils/
- 오래된 파일 정리, 최근 파일 불러오기, 기기 설정(cpu/gpu)등 기타 편의 기능을 제공합니다.

### Dockerfile, docker-compose.yml
- FastAPI 애플리케이션을 컨테이너화하여 다양한 환경에 쉽게 배포할 수 있도록 설정합니다.

### requirements.txt
- `torch`, `fastapi`, `pyodbc`, `uvicorn` 등 프로젝트에서 사용되는 Python 패키지를 명시합니다.

### static/
- `favicon.ico` 등 기타 정적 파일을 저장하는 디렉토리입니다.

### train/trained_models/
- 학습된 모델 파일을 저장하는 디렉토리로, 예측 및 재학습 시 사용됩니다. 예: `lstm_model.pth`.

---

## 주요 명령어

1. **로컬 서버 실행**  
   ```bash
   uvicorn app.main:app --reload
   ```
접속 URL: http://127.0.0.1:8000

2. **로컬 네트워크에서 접속 가능하게 서버 실행**
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000
   ```
접속 URL: http://192.168.99.234:8000

3. **API 요청 보내기**
    ```bash
    curl -X POST http://127.0.0.1:8000/retrain/{building_id}/{energy_type}
    ```
접속 URL: http://192.168.99.234:8000

4. **API 문서 접속**
   ```bash
   uvicorn api.main:app --host 0.0.0.0 --port 8000
   ```
접속 URL: http://192.168.99.234:8000/docs

5. **requirements.txt 업데이트**
   ```bash
   pip freeze > requirements.txt   ```
   ```
6. **requirements.txt 설치하기**
   ```bash
   pip install -r requirements.txt
    ```
7. **docker 환경에서 실행**
   ```bash
   docker compose up --build -d
    ```
