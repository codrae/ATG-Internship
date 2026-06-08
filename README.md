# ATG-BEMS

ATG 인턴십 기간 동안 진행한 **BEMS(Building Energy Management System)** 관련 산출물을 하나의 저장소로 통합한 모노레포입니다.

`study/`에는 BEMS 기초 개발 산출물(데이터 로드·전처리·분석, LSTM/GRU 등 시계열 예측 모델 연습)이 위치하며, 인턴 기간 중 별도 저장소로 진행했던 작업들을 아래 하위 디렉토리로 흡수했습니다.

## 구성

| 디렉토리 | 역할 | 원본 저장소 |
| --- | --- | --- |
| `study/` | BEMS 기초 개발 — 데이터 로드·전처리·분석, LSTM/GRU 시계열 예측 모델 연습 (AMPds2, CU-BEMS 데이터셋 실험) | (루트 기존 산출물) |
| `node-red/` | Node-RED 기반 데이터 수집 플로우 및 InfluxDB 스트리밍 연동 | `codrae/Node-Red` |
| `dvc/` | DVC로 관리하는 데이터셋/모델 버전 관리 (CU-BEMS 데이터, 학습 모델 아티팩트) | `codrae/atg_dvc` |
| `timeseries-models/` | 시계열 딥러닝 모델(LSTM 등) 학습/평가 스크립트 및 노트북 | `codrae/timeseries-dl-models` |
| `cursor-lib/` | Next.js 기반 프론트엔드/도구 라이브러리 | `codrae/CURSOR` |

`study/`는 본 저장소에서 처음부터 진행한 BEMS 기초 개발 산출물이며, 그 외 하위 디렉토리(`node-red/`, `dvc/`, `timeseries-models/`, `cursor-lib/`)는 각 원본 저장소의 커밋 히스토리를 `git subtree`로 보존한 채 통합되었습니다.
