# ATG-Internship

ATG 인턴십 기간 동안 진행한 산출물을 한 저장소로 정리한 모노레포입니다.
실제 고객사 대상 프로젝트(**BEMS**, **FEMS**)와 그 과정에서의 학습·실험 자료로 구성됩니다.

## 구성

### `bems/` — BEMS (Building Energy Management System)
건물 에너지 관리 시스템. 데이터 수집 → 저장 → 예측 → 시각화 파이프라인.

| 디렉토리 | 스택 | 역할 |
| --- | --- | --- |
| `bems/fast/` | Python · FastAPI · APScheduler | 데이터 수집·전처리 및 LSTM 기반 전력 예측 서비스 |
| `bems/server/` | Java · Spring · Gradle | 백엔드 API 서버 (InfluxDB · PostgreSQL · Redis · 외부 MSSQL EMS DB 연동) |
| `bems/view/` | Next.js · Ant Design | 대시보드 프론트엔드 |

### `fems/` — FEMS (Factory Energy Management System)
SIMMTECH 고객사 대상 공장 에너지 관리 시스템 프론트엔드 (Next.js).

### `experiments/` — 학습·실험
인턴십 과정에서의 테스트·공부·실험 자료.

| 디렉토리 | 내용 |
| --- | --- |
| `experiments/study/` | BEMS 기초 개발 — 데이터 전처리·분석, LSTM/GRU 예측 모델 연습 |
| `experiments/node-red/` | Node-RED 데이터 수집 플로우 + InfluxDB 스트리밍 |
| `experiments/dvc/` | DVC 기반 데이터셋/모델 버전 관리 |
| `experiments/timeseries-models/` | 시계열 딥러닝 모델 학습/평가 |
| `experiments/cursor-lib/` | Next.js 기반 프론트엔드/도구 라이브러리 |

## 보안

모든 비밀값(DB 비밀번호, InfluxDB 토큰, API 키, 외부 서버 주소 등)은 코드에서 분리되어
환경변수(`.env`)로 주입됩니다. 각 서비스의 `.env.example`을 참고해 로컬 환경을 구성하세요.
실제 `.env` 파일은 저장소에 포함되지 않습니다.
