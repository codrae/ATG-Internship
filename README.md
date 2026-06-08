# 인하대 BEMS · 건물에너지관리시스템

> 인하대학교 캠퍼스 전력 데이터를 실시간으로 수집·분석하고, AI로 사용량을 예측하는 **건물에너지관리시스템(Building Energy Management System)**
> 탄소중립 아카데미 2기 · ATG(Asset Technology Group) 인턴십 팀 프로젝트 (2024)

<img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white"/>
<img src="https://img.shields.io/badge/Spring-6DB33F?style=for-the-badge&logo=spring&logoColor=white"/>
<img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white"/>
<img src="https://img.shields.io/badge/PyTorch-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white"/>
<img src="https://img.shields.io/badge/InfluxDB-22ADF6?style=for-the-badge&logo=influxdb&logoColor=white"/>
<img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white"/>
<img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white"/>
<img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white"/>

---

## 📑 최종 발표 자료

<a href="docs/BEMS최종PPT.pdf">
  <img src="docs/bems-cover.png" width="600" alt="BEMS 최종 발표 표지"/>
</a>

> 전체 발표 자료(41p): **[docs/BEMS최종PPT.pdf](docs/BEMS최종PPT.pdf)**

## 📌 프로젝트 배경

인하대학교는 건물 전력 데이터를 **수기로 기록**하고 설비를 **수동 제어**하고 있어, 데이터가 서버에 축적·분석되지 않고 활용성이 낮은 상태였습니다. (모니터링·제어 시스템 부재)

본 프로젝트는 이러한 환경에 **디지털 전환(DX)** 을 적용해, 전력 데이터를 실시간 수집·정형화하고 모니터링·분석·예측을 제공하는 BEMS를 구축했습니다. 약 3년치 시계열 데이터에 센서 통신 오류로 인한 결측·이상치가 혼재되어 있어, 모델 학습 전 정교한 데이터 클리닝이 필수적이었습니다.

> 데이터의 의미를 정확히 이해하기 위해 서울대·인천대 등 타 기관을 답사·벤치마킹하고, 인하대 현장 실태를 직접 조사하여 도메인을 파악한 뒤 파이프라인을 설계했습니다.

**BEMS 3단계 기능**
- **LV1 모니터링** — 데이터 감시·조회, 실시간 알림(경보)
- **LV2 분석** — 설비 성능·효율 분석, 지표 관리 및 보고서
- **LV3 제어** — 자동 제어 *(향후 과제)*

## 🧩 시스템 아키텍처

```
인하대 실시간 전력 DB (MSSQL, 10분·10초 간격)
        │ WRITE
        ▼
┌──────────────────────────────────────────────┐
│  Spring 메인 비즈니스 로직 서버 (Java, 3-Layer)   │
│  · Dynamic Polling / 요금 정산 / 원단위 계산        │
│  · 이상치 탐지 / 월·일별 집계 / Entity CRUD         │
│  · STOMP WebSocket (Pub/Sub) / Redis 캐싱         │
└───┬──────────────┬───────────────┬─────────────┘
    │              │               │
 InfluxDB     PostgreSQL      Spring AI ── LLM (GPT/Claude/Ollama)
 (전력·예측    (메타·집계·       · 지표/에너지 효율 분석
  시계열)       이상치·요금)    │
    └── 예측 시그널 ──> FastAPI 예측 서버 (PyTorch LSTM)
                         · APScheduler 주기적 재학습
                         · InfluxDB 자동 갱신
        │ REST / WebSocket
        ▼
   Next.js BEMS Website (실시간 모니터링 대시보드)
```

## ✨ 주요 기능

- **실시간 에너지 모니터링** — 건물·에너지원별(전기/물/가스) 실시간 데이터, 이상치 표시
- **통계 분석** — 월별 사용량 추세, 전월 동일 날짜 대비 비교, 용도별(교육용/산업용) 전기세, 누적 금액
- **지표 관리 & AI 분석** — 원단위·목표 설정, LLM 기반 에너지 효율 분석 요약
- **AI 사용량 예측** — LSTM 기반 미래 에너지 사용량 예측 및 시각화

## 🤖 AI 예측 모델

전력 시계열 예측을 위해 4개 모델(ARIMA · Prophet · LightGBM · LSTM)을 비교한 뒤, 장기 시계열의 변동성·불확실성 대응에 유리한 **LSTM(PyTorch)** 을 선정했습니다.

- **ETL 파이프라인** — 결측 구간 탐지(누락 포인트 56개), 이상치 처리(Z-score>3, 선형보간), `MinMaxScaler` 정규화로 LSTM 학습 안정성 확보
- **하이퍼파라미터 튜닝** — Grid Search / Random Search / AutoML 비교 후 **Grid Search** 채택
- **예측 성능** — **MAPE 14.21**, **RMSE 15 (원 단위) / RMSE 0.1217 · MAE 0.0697 (정규화 기준)**
- **서빙** — FastAPI 예측 API, APScheduler 기반 자동 재학습, h5 모델 on-premise 배포, InfluxDB 갱신 및 Spring 서버와 실시간 통신

## 🛠️ 기술 스택

| 영역 | 스택 |
|------|------|
| **Frontend** | Next.js 14 (TypeScript), TanStack Query, TailwindCSS, shadcn/ui, Jotai, ECharts |
| **Backend** | Java / Spring (Controller–Service–Repository), STOMP WebSocket, Spring AI (LLM 추상화) |
| **AI / 예측** | Python, PyTorch (LSTM), FastAPI, APScheduler |
| **Database** | InfluxDB(시계열), PostgreSQL(메타·집계), Redis(캐싱) |
| **Source** | MSSQL Server (인하대 실시간 전력 DB) |
| **Infra** | Docker / Docker Compose |
| **협업** | GitHub Projects, PR 코드리뷰, 주간 스크럼, commit/branch convention |

## 🧠 기술적으로 해결한 문제

- **실시간성 보장** — `DynamicScheduler`가 건물별 `BuildingScheduler`를 개별 스레드로 운영. 평소 600초 폴링하다가 데이터 미수신 시 10초 빠른 폴링으로 전환, 수신되면 다시 600초로 복귀하는 **적응형 폴링**으로 실시간성과 부하를 동시에 관리.
- **재학습 ↔ 예측 충돌 (핫스왑 아키텍처)** — 24시간 주기 재학습이 4시간 주기 예측을 침범하면 예측 데이터에 갭이 발생. 재학습 중에도 '기존 모델'로 예측 적재를 멈추지 않고, 무거운 재학습이 끝나면 동일 타임스탬프의 예측값을 '새 모델' 결과로 **자동 덮어쓰기(Overwrite)** 하는 핫스왑 방식으로 충돌을 해소. `is_training` 플래그로 중복 재학습도 차단.
- **다건물 비동기 병렬 서빙** — `httpx`·`asyncio.gather`로 다수 건물·에너지원의 예측을 병렬 처리해 서빙 속도 확보.
- **예측 신뢰성** — 예측 구간이 길수록 오류가 누적되므로, 주기적 재학습으로 최신 분포를 반영하고 사용자 요청으로 재학습되더라도 **기존 스케줄 주기(예: 매일 정해진 시각)는 유지**하도록 설계.

## 📊 성과

- **프론트엔드 렌더링** — Lighthouse 점수 **44 → 85** (약 2배 향상)
- **조회 성능** — InfluxDB로 시계열 데이터를 분리하고 Redis 캐싱 + 월 단위 집계 저장을 도입해 모니터링 응답 속도 개선
- **AI 예측** — LSTM 기반 MAPE 14.21 / RMSE 15(원 단위)·0.1217(정규화) 달성
- **배포 최적화** — Docker 이미지 **12.5GB → 2.2GB (5.7× 경량화)**, 빌드 시간 **약 7× 단축**

## 🚀 배포

Docker Compose 기반으로 `bems-network` 위에 서비스를 구성합니다.

| 서비스 | 포트 |
|--------|------|
| bems-view (Next.js) | 3000 |
| bems-server (Spring) | 8080 |
| bems-ai (FastAPI) | 8000 |
| InfluxDB | 8086 |
| PostgreSQL | 5432 |
| Redis | 6379 |

## 👥 팀 & 역할

탄소중립 아카데미 2기 / ATG 인턴십 팀 프로젝트 (기여자 4명)

| 이름 | 역할 |
|------|------|
| **김용진 (본인)** | **Frontend · AI 모델 · InfluxDB 연동** (약 33% 기여) |
| 김용빈 | 서버 개발, 문서 작업, GitHub 관리 |
| 이시현 | Frontend, 디자인 |

## 📁 레포 구조

이 저장소는 ATG 인턴십 기간의 산출물을 하나로 통합한 모노레포입니다. BEMS 본체와 더불어 FEMS 프로젝트, 학습·실험 자료를 함께 담고 있습니다.

```
.
├── bems/                  # ★ BEMS 본체
│   ├── fast/              #   FastAPI 예측 서버 (PyTorch LSTM, APScheduler)
│   ├── server/            #   Spring 메인 서버 (InfluxDB/PostgreSQL/Redis/MSSQL 연동)
│   └── view/              #   Next.js 실시간 모니터링 대시보드
├── fems/                  # SIMMTECH FEMS 프론트엔드 (Next.js)
├── experiments/           # 학습·실험 과정 산출물
│   ├── study/             #   BEMS 기초 개발 (데이터 전처리·분석, LSTM/GRU 연습)
│   ├── node-red/          #   Node-RED 데이터 수집 + InfluxDB 스트리밍
│   ├── dvc/               #   데이터 버전 관리(DVC) 실험
│   ├── timeseries-models/ #   시계열 예측 모델 실험
│   └── cursor-lib/        #   진동 데이터 커서 라이브러리 (ATG)
└── docs/                  # 발표 자료 (BEMS최종PPT.pdf)
```

> 비밀값(DB 비밀번호, InfluxDB 토큰, API 키, 외부 서버 주소 등)은 모두 환경변수(`.env`)로 분리되어 있으며, 각 서비스의 `.env.example`을 참고해 구성합니다. 실제 `.env`는 저장소에 포함되지 않습니다.

---

*탄소중립 아카데미 2기 · ATG 인턴십 BEMS 구축 프로젝트 (2024)*
