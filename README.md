# 말동무챗

노년층을 위한 AI 말동무 서비스의 소개 페이지입니다. 캐릭터 선택, 스크롤 애니메이션, 방문 기록, 출시 소식 신청 폼을 제공합니다. 실제 음성 대화 기능은 아직 구현하지 않았습니다.

## 파일 구성

- `maldongmu-site/index.html`: 화면과 수업 예제 기반 방문 기록·신청 폼
- `maldongmu-site/styles.css`: 화면 스타일
- `maldongmu-site/app.js`: 캐릭터 선택과 화면 동작
- `maldongmu-site/assets/`: 캐릭터 PNG, 로고, 글꼴과 글꼴 라이선스
- `netlify.toml`: Netlify 배포 폴더 설정

수업 원본, Apps Script 백업과 실제 검증 기록은 로컬에서 별도로 보관합니다.

## 로컬 확인

VS Code에서 `maldongmu-site/index.html`을 Live Server로 열면 됩니다. 이미지까지 확인하려면 `assets/character-candidates/`의 PNG 5개가 함께 있어야 합니다. 로컬에서도 방문 기록과 신청 폼은 연결된 실제 Google 스프레드시트로 전송됩니다.

Node.js가 설치되어 있으면 Mac과 Windows 모두 저장소 폴더에서 다음 명령을 사용할 수도 있습니다. 별도 패키지 설치는 필요 없습니다.

```sh
npm start
```

브라우저에서 http://127.0.0.1:5500 을 열고, 파일 수정 후 새로고침합니다. 종료는 `Ctrl+C`입니다. Windows에서는 `preview.cmd`를 더블클릭하거나 `node scripts/preview.cjs`를 실행해도 됩니다. PowerShell에서 `npm.ps1` 실행 정책 오류가 나면 `npm.cmd start`를 사용합니다.

## Mac·Windows 공동 작업

공통 원본은 https://github.com/BluebackFrog/sw 이며 각 컴퓨터는 이 저장소의 복제본에서 작업합니다. GitHub는 자동 파일 동기화 도구가 아니므로 저장만 해서는 다른 컴퓨터에 반영되지 않습니다.

- Mac 작업 폴더: `/Users/kdh02/Downloads/sw`
- Windows 작업 폴더: `C:\Users\kimdo\codex_workspace\sw`
- Windows의 기존 `maldongmu-site`, `sw-preview`, `workspace/yonsei/4-2/sw`는 과거 사본입니다. 새 작업은 위 저장소 폴더를 사용합니다.

Windows에서는 `open-workspace.cmd`를 더블클릭하면 이 폴더에서 Git을 사용할 수 있는 PowerShell 창이 열립니다. 일반 Git 설치가 없으면 현재 PC에 있는 Codex 번들 Git을 이 창에서만 사용하며, 시스템 PATH는 바꾸지 않습니다. Codex에서도 위 Windows 폴더를 작업 위치로 지정하면 됩니다.

### 컴퓨터를 번갈아 사용할 때

작업 시작 전에 저장소 폴더에서 실행합니다. `git status`로 저장하지 않은 수정이 없는지 먼저 확인합니다.

```sh
git status
git switch main
git pull --ff-only
```

수정 후 변경 내용을 확인하고 필요한 파일만 올립니다. 아래는 HTML·CSS·화면 동작을 수정한 예입니다. 이미지 등을 수정했다면 해당 경로도 추가합니다.

```sh
git diff
git add maldongmu-site/index.html maldongmu-site/styles.css maldongmu-site/app.js
git commit -m "Update landing page"
git push origin main
```

그다음 다른 컴퓨터에서 `git pull --ff-only`로 받습니다. 변경 내용을 올리기 전에 컴퓨터를 전환하면 수정본은 그 컴퓨터에만 남습니다.

### 두 컴퓨터에서 동시에 수정할 때

각 작업은 서로 다른 이름의 브랜치를 사용합니다. 아래의 `windows/form-update`는 작업에 맞게 바꾸고, Mac에서는 `mac/layout-update`처럼 다른 이름을 사용합니다.

```sh
git switch main
git pull --ff-only
git switch -c windows/form-update
```

수정한 파일을 `git add`, `git commit`으로 저장한 뒤 브랜치를 올립니다.

```sh
git push -u origin windows/form-update
```

GitHub에서 해당 브랜치의 Pull Request를 만들어 검토 후 `main`에 합칩니다. 다른 컴퓨터에서는 현재 작업을 먼저 커밋한 뒤 `main`으로 돌아가 `git pull --ff-only`로 받습니다. 같은 줄을 동시에 고치면 충돌 내용을 확인해 합쳐야 합니다. `pull`이나 `push`가 거절되면 중단하고 변경 이력을 확인하며, 강제 push나 `reset --hard`로 덮어쓰지 않습니다.

Windows에서 첫 push는 GitHub 로그인이 필요합니다. Git Credential Manager의 브라우저 안내를 따라 저장소 접근 권한이 있는 계정으로 로그인합니다. 토큰이나 비밀번호를 이 저장소에 저장하지 않습니다. Git 작성자 이름·이메일 설정은 로그인과 별개입니다.

## 함께 쓰는 클라우드 설정

두 컴퓨터의 HTML은 같은 `addrScript`를 사용하므로 기존 Apps Script와 Google Sheets를 그대로 사용합니다. PC마다 새 백엔드나 DB를 만들 필요가 없습니다. 로컬 미리보기에서 접속·폼 제출을 하면 실제 시트에 기록되며, 쿠키 방문자 ID는 컴퓨터·브라우저·사이트 주소별로 다를 수 있습니다.

GitHub는 코드, Netlify는 공개 사이트, Apps Script는 요청 처리, Google Sheets는 데이터 보관을 담당합니다. Apps Script 편집기의 코드는 이 저장소의 HTML과 별도로 배포됩니다. 서버 코드를 바꿀 때는 기존 웹 앱 배포를 새 버전으로 갱신합니다.

## 데이터 연결

방문자의 브라우저가 Google Apps Script 웹 앱으로 요청을 보내면, Apps Script가 스프레드시트에 행을 추가합니다.

- `visitors`: 쿠키 식별자, 방문 주소, IP, 유입 주소, 시각, `utm`, 기기 유형
- `tab_final`: 쿠키 식별자, 이메일, 의견

연결 주소는 `index.html`의 `addrScript`에 있습니다. 서버는 JSON으로 응답하며, 폼은 `success: true`를 확인한 뒤 입력을 비우고 완료 팝업을 표시합니다. Postman은 수동 요청 테스트용이며 사이트 실행에는 필요하지 않습니다. 자동 메일 발송은 연결하지 않았습니다.

## Netlify 배포

현재 Netlify와 GitHub의 자동 배포 연결은 설정하지 않았습니다. GitHub에 코드를 올린 것만으로 사이트가 갱신되지는 않습니다. 직접 배포할 때는 Netlify 프로젝트의 업로드 영역에 `maldongmu-site` 폴더 전체를 올립니다.

이 저장소를 Netlify에 연결할 때 배포 브랜치는 `main`, 배포 폴더는 `maldongmu-site`를 사용합니다. 별도 빌드 명령은 필요하지 않으며 배포 폴더는 `netlify.toml`에 설정되어 있습니다.

공개 사이트: https://lively-bubblegum-3768ab.netlify.app/

2026-10-31에 캐릭터 원본 5개가 포함된 최신 사이트를 수동 배포하고 공개했습니다. 로그인 없는 접속, 배포 파일의 원본 일치, 브라우저에서 다섯 캐릭터의 표시와 전환을 확인했습니다.

외부 커뮤니티에는 위의 공개 주소를 공유합니다. 커뮤니티별 유입 구분에는 `?utm=indietalk`처럼 `utm` 값을 붙일 수 있습니다. Live Server의 `localhost` 또는 `127.0.0.1` 주소는 외부 공유용이 아닙니다.
