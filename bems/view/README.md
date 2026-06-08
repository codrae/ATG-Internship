# BEMS (Building Energy Management System)

BEMS는 건물 에너지 관리 시스템으로, 에너지 데이터를 실시간으로 시각화하고 관리할 수 있는 기능을 제공하는 Next.js 기반의 프론트엔드 애플리케이션입니다.
사용자는 이 시스템을 통해 에너지 사용량을 효과적으로 모니터링할 수 있습니다.

## 기술 스택

- **Framework**: [Next.js](https://nextjs.org/) - v14.2.13
- **Language**: TypeScript
- **CSS Framework**: Tailwind CSS - v3.4.1
- **Charting Libraries**: Chart.js, ECharts
- **HTTP Client**: Axios
- **State Management**: Redux
- **Database**: MSSQL (mssql 라이브러리 사용)
- **React Libraries**: React Modal, React Chart.js(ECharts로 모두 전환 예정)

## 설치 및 실행 방법

1. **레포지토리 클론**: 레포지토리를 로컬로 클론합니다.

   ```bash
   git clone https://github.com/yourusername/bems-frontend.git
   ```

2. **의존성 설치**: 프로젝트 디렉토리로 이동한 후, npm을 사용하여 필요한 패키지를 설치합니다.

   ```bash
   cd bems-frontend
   npm install
   ```

3. **개발 서버 실행**: 개발 서버를 실행하여 로컬에서 애플리케이션을 확인합니다.

   ```bash
   npm run dev
   ```

   기본적으로 개발 서버는 [http://localhost:3000](http://localhost:3000)에서 실행됩니다.

4. **프로덕션 빌드**: 프로젝트를 프로덕션 환경에서 사용하기 위해 빌드합니다.

   ```bash
   npm run build
   ```

5. **프로덕션 서버 시작**: 프로덕션 환경에서 서버를 시작합니다.

   ```bash
   npm run start
   ```

## 사용 가능한 스크립트

- **`npm run dev`**: 개발 모드에서 프로젝트를 실행합니다.
- **`npm run build`**: 프로젝트를 프로덕션 빌드합니다.
- **`npm run start`**: 프로덕션 환경에서 서버를 실행합니다.
- **`npm run lint`**: 코드 스타일 검사(lint)를 실행하여 코드 품질을 유지합니다.

## 환경 변수 설정

BEMS 프로젝트는 환경 변수를 사용하여 API 및 데이터베이스 URL 등을 관리합니다. 환경 변수는 프로젝트 루트 디렉토리의 `.env.local` 파일에서 설정할 수 있습니다.

```bash
NEXT_PUBLIC_API_URL=http://localhost:4000
DATABASE_URL=mssql://user:password@localhost:1433/database
```

위와 같은 설정을 사용하여 환경 변수를 관리하며, 개발 환경에서 필요한 정보를 설정할 수 있습니다.

## 의존성

- **Next.js**: v14.2.13
- **React**: ^18
- **Axios**: ^1.7.7
- **ECharts**: ^5.5.1
- **Tailwind CSS**: ^3.4.1
- 기타 자세한 의존성 목록은 `package.json`을 참조하세요.
