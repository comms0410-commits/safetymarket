# 일일 동향파악

T안심알리미 서비스의 경쟁사 및 시장동향을 매일 파악하기 위한 루키스 내부 웹 기반 시장분석 서비스입니다.

이 프로젝트는 **브라우저에서 바로 실행되는 Next.js 반응형 웹 서비스**입니다. 데스크톱에서는 좌측 고정 사이드바와 상단 헤더, 태블릿/모바일에서는 햄버거 메뉴와 카드형 콘텐츠로 사용할 수 있도록 구성했습니다.

## 1단계 구현 범위

- Next.js App Router 기반 웹 서비스 초기 세팅
- TypeScript, Tailwind CSS 기반 B2B SaaS 스타일 UI
- 데스크톱/태블릿/모바일 대응 반응형 레이아웃
- NextAuth Credentials 기반 로그인
- PostgreSQL + Prisma schema 작성
- 기본 관리자 계정 seed
- 기본 경쟁사 seed
- 수집 채널, 샘플 이슈, 샘플 리포트, 공공 API 설정 seed
- `/dashboard` 데이터 기반 인텔리전스 대시보드
- `/competitors` 경쟁사 목록
- `/competitors/new` 경쟁사 등록
- `/competitors/[id]` 경쟁사 프로필, 최근 동향, 수집자료, 대응전략 메모 탭형 상세 화면
- `/sources`, `/ask`, `/research/questions`, `/reports/daily`, `/compare`, `/api-settings` 기본 화면
- 조달/시장지도 placeholder 화면

공공기관 API, 실제 웹 수집, AI 답변 생성, Word 다운로드는 후속 단계에서 연결합니다. 현재는 추후 확장을 위한 DB와 화면 구조를 먼저 제공합니다.

## UI/UX 방향

외부 경쟁사 인텔리전스 플랫폼의 정보 구조를 참고하되, 로고/색상/그래픽/문구/레이아웃을 복제하지 않고 T안심알리미 시장분석에 특화된 독립적인 내부 SaaS 화면으로 구성했습니다.

핵심 화면 방향은 다음과 같습니다.

- 경쟁사 동향을 한눈에 보는 데이터 기반 대시보드
- 카드형 KPI와 모니터링 채널 카드
- 중요도 높은 이슈 중심의 리포트형 화면
- 임원 보고용으로 바로 읽을 수 있는 정돈된 정보 구조
- 360px 이상 모바일 화면에서도 주요 지표 확인 가능
- 모바일 테이블은 카드형 리스트 또는 가로 스크롤로 대응

## 기술 스택

- Next.js
- React
- TypeScript
- Tailwind CSS
- PostgreSQL
- Prisma
- NextAuth
- Recharts

## 환경변수 설정

1. `.env.example`을 복사해 `.env`를 만듭니다.

```bash
cp .env.example .env
```

2. 로컬 PostgreSQL 접속 정보를 설정합니다.

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/daily_market_watch?schema=public"
NEXTAUTH_SECRET="충분히-긴-랜덤-문자열"
NEXTAUTH_URL="http://localhost:3000"
OPENAI_API_KEY=
```

3. 추후 공공 API 연동용 키는 현재 비워두어도 됩니다. 키가 없어도 1단계 서비스는 실행됩니다.

```env
DATA_GO_KR_SERVICE_KEY=
NEIS_API_KEY=
CHILDCARE_API_KEY=
KOSIS_API_KEY=
KIPRIS_API_KEY=
NTS_BUSINESS_API_KEY=
OPENDART_API_KEY=
```

## 로컬 실행 방법

### 1. PostgreSQL 실행

Docker를 사용할 수 있다면 아래 명령으로 로컬 DB를 실행합니다.

```bash
docker compose up -d postgres
```

이미 사내/로컬 PostgreSQL을 사용한다면 `.env`의 `DATABASE_URL`만 해당 접속 정보로 변경하면 됩니다.

### 2. 의존성 설치

```bash
npm install
```

### 3. Prisma Client 생성

```bash
npm run prisma:generate
```

### 4. Prisma migration 적용

```bash
npm run prisma:migrate -- --name init
```

또는 직접 Prisma 명령을 사용할 수 있습니다.

```bash
npx prisma migrate dev --name init
```

### 5. Seed 데이터 입력

```bash
npm run prisma:seed
```

Seed 데이터에는 다음이 포함됩니다.

- 기본 관리자 계정
- 기본 경쟁사 7개
- 경쟁사별 샘플 수집 채널
- 반응형 대시보드 확인용 샘플 이슈
- 샘플 일일 리포트
- 공공 API 설정 placeholder

기본 관리자 계정은 다음과 같습니다.

- 이메일: `admin@lucis.local`
- 비밀번호: `ChangeMe123!`
- 권한: `SUPER_ADMIN`

기본 경쟁사는 다음과 같습니다.

- JT통신 / 아이알리미
- SH네트웍스 / 키즈콜
- 기창큐브 / 스쿨맘톡
- 웰티즌 / 웰티즌스쿨, 노란버스, 엑스맨
- 이웃닷컴 / e알리미
- 엔트랙
- 세이프어드바이저 / 교원안심번호

### 6. 웹 서버 실행

```bash
npm run dev
```

브라우저에서 아래 주소로 접속합니다.

```text
http://localhost:3000
```

로그인 후 `/dashboard`에서 핵심 화면을 바로 확인할 수 있습니다.

## 주요 경로

- `/login`: 로그인
- `/dashboard`: 데이터 기반 인텔리전스 대시보드
- `/competitors`: 경쟁사 목록
- `/competitors/new`: 경쟁사 등록
- `/competitors/[id]`: 경쟁사 상세/수정/최근 동향/수집자료
- `/sources`: 수집 URL 관리 화면
- `/ask`: AI 시장질문 화면
- `/research/questions`: 질문 이력 화면
- `/reports/daily`: 일일 리포트 화면
- `/compare`: 경쟁사 비교표
- `/api-settings`: 공공 API 설정 화면
- `/procurement/radar`: 조달 레이더 준비중
- `/market/schools`: 학교 시장지도 준비중
- `/market/childcare`: 유아시장 분석 준비중
- `/market/forecast`: 지역별 시장규모 예측 준비중

## 반응형 확인 포인트

- 데스크톱: 좌측 고정 사이드바 + 상단 검색/사용자 메뉴 + 대시보드 그리드
- 태블릿: 카드 그리드가 2열 중심으로 재배치
- 모바일: 햄버거 메뉴 + 카드형 KPI + 가로 스크롤 테이블
- 최소 360px 화면 폭에서도 핵심 KPI와 오늘의 핵심 이슈 확인 가능

## 후속 단계 예정

- 2단계: 수집 URL CRUD, Cheerio 기반 수동 웹페이지 수집, CollectedItem 저장, AI 요약, Insight 생성
- 3단계: `/ask` OpenAI Responses API 기반 시장질문 검색, ResearchQuestion 저장, 질문 이력 관리
- 4단계: 일일 리포트 생성, Word 다운로드, 대시보드 차트 고도화
- 5단계: 공공 API Connector placeholder 실제 연결, 조달·학교·어린이집·통계·특허·공시 데이터 확장

## Netlify 배포 설정

Netlify에서도 동일한 Next.js 웹 서비스로 실행됩니다. 이번 프로젝트는 서버 컴포넌트와 NextAuth, Prisma를 사용하므로 **외부 PostgreSQL 데이터베이스**가 필요합니다.

### Netlify Build settings

`netlify.toml`에 아래 설정을 포함했습니다.

- Build command: `npm run build`
- Publish directory: `.next`
- Node version: `20`
- Next.js Runtime: `@netlify/plugin-nextjs`

### Netlify 환경변수

Netlify Site settings → Environment variables에 최소한 아래 값을 설정하세요.

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB?schema=public
NEXTAUTH_SECRET=충분히-긴-랜덤-문자열
NEXTAUTH_URL=https://배포된-netlify-도메인
OPENAI_API_KEY=
```

공공 API 키는 현재 미연동 상태이므로 비워둘 수 있습니다.

```env
DATA_GO_KR_SERVICE_KEY=
NEIS_API_KEY=
CHILDCARE_API_KEY=
KOSIS_API_KEY=
KIPRIS_API_KEY=
NTS_BUSINESS_API_KEY=
OPENDART_API_KEY=
```

### Netlify 배포 전 DB 준비

Netlify 빌드는 애플리케이션을 빌드만 하며, 운영 DB migration/seed는 별도로 실행하는 것을 권장합니다.

```bash
npm run prisma:migrate -- --name init
npm run prisma:seed
```

운영 DB에 직접 접속 가능한 환경에서 위 명령을 한 번 실행하면 기본 관리자 계정과 샘플 대시보드 데이터가 들어갑니다.
