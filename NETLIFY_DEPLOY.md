# Netlify 배포 체크리스트

이 MVP는 기본 화면은 정적 샘플 데이터로 동작하며, Netlify Blobs + Scheduled Function을 통해 매일 자동 분석 결과를 서버 저장소에 반영할 수 있습니다.

## Netlify Build settings

- Base directory: 비워두기 또는 `.`
- Build command: `npm run build`
- Publish directory: `.next`
- Functions directory: `netlify/functions`
- Node version: `20`

정상 로그에서는 Resolved config가 `publish: /opt/build/repo/.next`로 표시되어야 합니다.

## 자동 분석 환경변수

빌드는 환경변수 없이도 성공해야 합니다. 운영에서 자동 분석을 활성화하려면 Netlify Environment variables에 아래 값을 추가하세요.

```env
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4.1-mini
MARKET_WATCH_BLOB_STORE=daily-market-watch
```

선택적으로 수동 실행 API를 보호하려면 아래 값을 추가합니다.

```env
MARKET_WATCH_RUN_SECRET=임의의-긴-문자열
```

네이버 뉴스 API 키가 있으면 우선 사용합니다. 없으면 Google News RSS를 시도하고, 실패하면 mock fallback으로 저장합니다.

```env
NAVER_CLIENT_ID=
NAVER_CLIENT_SECRET=
```

## 자동 실행 일정

`netlify/functions/daily-market-watch.ts`는 Netlify Scheduled Function이며 cron은 `0 0 * * *`입니다. 이는 한국시간 오전 9시입니다.

## 수동 실행

배포 후 아래 API로 즉시 한 번 실행할 수 있습니다.

```bash
curl -X POST "https://YOUR_SITE.netlify.app/api/market-watch/run?secret=MARKET_WATCH_RUN_SECRET"
```

최신 결과 조회:

```bash
curl "https://YOUR_SITE.netlify.app/api/market-watch/latest"
```

## 이전 publish directory 오류 해결

`publish: /opt/build/repo`, `publishOrigin: ui`, `Your publish directory is pointing to the base directory`가 보이면 Netlify UI의 Publish directory가 루트로 설정된 상태입니다. 반드시 `.next`로 변경하세요.
