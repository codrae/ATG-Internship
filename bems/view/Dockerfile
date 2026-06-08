# Base image
FROM node:18-alpine

# 작업 디렉토리 설정
WORKDIR /app

# 패키지 매니저 캐시를 위한 package.json과 package-lock.json 복사
COPY package*.json ./

# 개발/프로덕션 의존성 설치
RUN npm install --production

# 소스 복사
COPY . .

# Next.js 빌드
RUN npm run build

# 포트 설정
EXPOSE 3000

# 환경 변수 설정
ARG NEXT_PUBLIC_SERVER_URL
ENV NEXT_PUBLIC_SERVER_URL=${NEXT_PUBLIC_SERVER_URL}

ARG SPRING_URL
ENV SPRING_URL=${SPRING_URL}

CMD ["npm", "start"]
