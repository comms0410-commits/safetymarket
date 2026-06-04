# 일일 동향파악

T안심알리미 서비스의 경쟁사 및 시장동향을 매일 파악하기 위한 웹 기반 내부 대시보드입니다.

## 현재 MVP 방향

초기 버전은 **Netlify 배포 안정성**을 최우선으로 둔 프론트엔드 중심 Next.js 웹 서비스입니다.

- DB 연결 없음
- Prisma 없음
- NextAuth 없음
- 공공 API 실연동 없음
- 환경변수 없이도 `npm run build` 가능
- 정적 샘플 데이터로 대시보드와 주요 화면 즉시 확인 가능
- 모바일, 태블릿, 데스크톱 반응형 지원

PostgreSQL, Prisma, NextAuth, OpenAI, 공공 API connector는 후속 단계에서 안정 배포가 확인된 뒤 추가합니다.

## 주요 화면

- `/dashboard`: 경쟁사 인텔리전스 대시보드
- `/competitors`: 경쟁사 목록
- `/competitors/[id]`: 경쟁사 상세 프로필
- `/competitors/new`: 경쟁사 등록 데모 화면
- `/sources`: 수집 URL/채널 샘플 화면
- `/ask`: AI 시장질문 UI placeholder
- `/research/questions`: 질문 이력 placeholder
- `/reports/daily`: 일일 리포트 샘플 화면
- `/compare`: 경쟁사 비교표
- `/api-settings`: 공공 API 설정 placeholder
- `/procurement/radar`: 조달 레이더 준비중
- `/market/schools`: 학교 시장지도 준비중
- `/market/childcare`: 유아시장 분석 준비중
- `/market/forecast`: 시장규모 예측 준비중

## 기술 스택

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Recharts
- Netlify Next.js Runtime

## 로컬 실행

```bash
npm install
npm run dev
```

브라우저에서 접속합니다.

```text
http://localhost:3000
```

## 로컬 빌드 확인

```bash
npm run build
```

## 보안 패치 기준

CVE-2025-55182 / React Server Components 관련 Netlify 차단을 피하기 위해 `next`, `react`, `react-dom`은 npm latest 기준 패치 버전으로 올려두었습니다. Lockfile도 함께 커밋합니다.


## Netlify 배포 설정

프로젝트 루트의 `netlify.toml`에 Netlify 설정이 들어 있습니다.

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "20"
```

Netlify UI에서도 아래와 같이 맞춰주세요.

- Build command: `npm run build`
- Publish directory: `.next`
- Base directory: 비워두기 또는 `.`
- Node version: `20`

정상 배포 로그에서는 publish directory가 `/opt/build/repo/.next`로 보여야 합니다.

## 환경변수

초기 MVP는 환경변수가 없어도 빌드/실행됩니다. `.env.example`은 후속 연동을 위한 placeholder만 포함합니다.

## 후속 단계 예정

1. 실제 로그인/권한 관리 도입
2. PostgreSQL + Prisma 데이터 저장소 연결
3. 수집 URL CRUD 및 Cheerio 기반 수동 수집
4. OpenAI 기반 요약/질문/리포트 생성
5. 공공 API connector 및 API 설정 테스트 기능 연결
