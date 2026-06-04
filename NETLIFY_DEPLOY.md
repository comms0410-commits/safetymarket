# Netlify 배포 체크리스트

이 MVP는 DB, Prisma, NextAuth 없이 정적 샘플 데이터로 동작하는 프론트엔드 중심 Next.js 웹 서비스입니다.

## Netlify Build settings

- Base directory: 비워두기 또는 `.`
- Build command: `npm run build`
- Publish directory: `.next`
- Functions directory: 비워두기
- Node version: `20`

정상 로그에서는 Resolved config가 `publish: /opt/build/repo/.next`로 표시되어야 합니다.

## 환경변수

초기 MVP는 환경변수가 없어도 빌드됩니다. 후속 단계에서 필요할 때만 아래 값을 추가하세요.

```env
OPENAI_API_KEY=
DATA_GO_KR_SERVICE_KEY=
NEIS_API_KEY=
CHILDCARE_API_KEY=
KOSIS_API_KEY=
KIPRIS_API_KEY=
NTS_BUSINESS_API_KEY=
OPENDART_API_KEY=
```

## Next.js Runtime plugin

`netlify.toml`의 `[[plugins]]` 설정으로 Netlify가 Next.js Runtime을 사용합니다. UI에 구버전 플러그인이 남아 있으면 제거 후 저장소 설정을 우선 사용하세요.

## 이전 오류 해결

`publish: /opt/build/repo`, `publishOrigin: ui`, `Your publish directory is pointing to the base directory`가 보이면 Netlify UI의 Publish directory가 루트로 설정된 상태입니다. 반드시 `.next`로 변경하세요.
