# Netlify 배포 체크리스트

최근 Netlify 로그에서 `No config file was defined`와 `publishOrigin: ui`, `publish: /opt/build/repo`가 보이면 Netlify가 저장소의 `netlify.toml`을 읽지 못했거나 UI 설정이 루트 publish directory로 덮어쓴 상태입니다.

## 필수 Build settings

Netlify UI의 **Site configuration → Build & deploy → Build settings**에서 아래처럼 맞춥니다.

- Base directory: 비워두기 또는 `.`
- Build command: `npm run build`
- Publish directory: `.next`
- Functions directory: 비워두기

`netlify.toml`에도 동일 설정이 들어 있습니다. 정상이라면 deploy log의 Resolved config에서 `publishOrigin: config`, `publish: /opt/build/repo/.next`가 보여야 합니다.

## Next.js Runtime plugin

Netlify UI의 Plugins에서 `@netlify/plugin-nextjs`가 구버전이면 제거 후 다시 추가하거나, 저장소의 `netlify.toml` 설정을 사용하세요. 이 저장소는 `@netlify/plugin-nextjs@5.15.11`을 devDependency에도 고정했습니다.

## 필수 환경변수

Netlify Environment variables에 아래 값을 설정하세요.

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB?schema=public
NEXTAUTH_SECRET=충분히-긴-랜덤-문자열
NEXTAUTH_URL=https://배포된-netlify-도메인
OPENAI_API_KEY=
```

공공 API 키는 현재 placeholder이므로 비워둘 수 있습니다.

```env
DATA_GO_KR_SERVICE_KEY=
NEIS_API_KEY=
CHILDCARE_API_KEY=
KOSIS_API_KEY=
KIPRIS_API_KEY=
NTS_BUSINESS_API_KEY=
OPENDART_API_KEY=
```

## 배포 전 운영 DB 초기화

Netlify 빌드 단계에서 seed를 자동 실행하지 않습니다. 운영 DB에 접근 가능한 로컬/CI 환경에서 최초 1회 실행하세요.

```bash
npm run prisma:migrate -- --name init
npm run prisma:seed
```
