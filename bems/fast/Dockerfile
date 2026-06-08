# Python 3.12 slim 버전을 기본 이미지로 사용
FROM python:3.12-slim

# Python이 .pyc 파일을 생성하지 않도록 설정하고 출력 스트림을 버퍼링하지 않도록 설정
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# 작업 디렉터리를 /app으로 설정
WORKDIR /app

# [공통 설정] Python 기본 종속성 설치
# apt-get 명령어는 빌드 도구 설치를 포함하도록 수정
RUN apt-get update && \
    apt-get install --no-install-recommends -y gcc build-essential && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# [개발 환경] 추가 도구 설치
# 개발 환경에서만 필요한 디버그 및 도구 설치. 주석 해제 시 적용
# RUN apt-get update && \
#     apt-get install --no-install-recommends -y vim iputils-ping net-tools && \
#     apt-get clean && rm -rf /var/lib/apt/lists/*

# 종속성 파일 requirements.txt를 컨테이너로 복사
COPY ./requirements.txt /app/requirements.txt

# pip 캐시를 사용하여 종속성 설치 속도 최적화 및 종속성 설치
RUN --mount=type=cache,target=/root/.cache/pip pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r /app/requirements.txt

# 애플리케이션 코드 전체를 컨테이너로 복사
COPY . /app

# [개발 환경] 소스 코드 핫 리로드를 위한 추가 패키지 설치 (선택 사항)
# RUN pip install --no-cache-dir watchgod

# 컨테이너에서 사용할 포트 8000을 노출
EXPOSE 8000

# 컨테이너에 authorship 정보를 추가
LABEL authors="KIMYONGJIN"

# 보안을 위해 비루트(non-root) 사용자로 애플리케이션 실행
RUN adduser --disabled-password appuser
USER appuser

# [프로덕션 환경] 최적화된 명령어
# 기본적으로 uvicorn 서버를 실행하여 FastAPI 애플리케이션 시작
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

# [개발 환경] 리로드 옵션 추가
# CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
