# BEMS-Server
- 해당 서버는 인하대학교의 건물별 전력 누적 사용량 DB의 데이터를 활용하여 BEMS 관련 비즈니스 로직을 수행하는 Spring 서버 입니다.

## 주요 기능 및 목표

### 주요 기능

- 건물별로 주기적인 Polling을 통해 인하대학교의 MSSQL Server로부터 데이터를 읽어와 전처리 한 뒤 InfluxDB에 저장.
- 젼체/건물별 에너지 사용량을 월별/일별/시간별로 구분하여 요구사항에 맞게 데이터 반환.
- PostgreSQL에 분석을 위한 데이터 기록
  - 월별 소비량을 집계하여 PostgreSQL에 기록
  - 에너지 원단위를 계산하여 PostgreSQL에 기록
  - 전력 계약 종별 요금 데이터 기록
  - 이상치에 대한 로그 데이터 기록
  - 사용자가 지정한 에너지 사용량 임계값 기록
- FAST-API 서버의 모델 재학습에 대한 요청과 학습 완료에 대한 응답 송수신
- WebSocket을 활용한 실시간 데이터 송신
- (예정) LLM을 활용한 에너지 사용성 분석

### 목표

- 실제 인하대학교에서 활용할 수 있는 수준의 기능을 가진 BEMS 구축
- 시계열 데이터 예측 AI를 통한 에너지 사용 트렌드 및 사용량 예측 기능 탑재
- 각종 데이터를 수집, 보관하여 학교의 지식 자산 축적
- 자대 뿐 아니라 타대에 인프라 구축 제안

# 설치 및 실행 방법

### 필요한 환경

- Docker 관련 프로그램(docker desktop, docker-compose)

### 설치 명령어 및 실행 방법

1. 레포지토리 다운로드 

```bash

git clone https://github.com/ATG-SW/BEMS-Server.git  
```

2. docker-compose 관련 명령어 실행 (docker daemon이 켜져있어야 함)

```bash

docker-compose up --build 
```

3. 서버 종료(단, 이때 데이터를 유지하기 위해선 -v 커맨드를 제외 시켜야함)

```bash

docker-compose down -v
```

# License

- 회사 내규에 따름

# 프로젝트 정보

### 기술 스택

- spring web
- spring data jpa
- spring websocket
- springdoc open api
- spring redis
- spring ai
- jackson
- MSSQL Server
- PostgreSQL
- lombok
- docker, docker-compose

# 아키텍쳐 구조도
![architecture](/architecture.png)