# 말동무챗

노년층을 위한 AI 말동무 서비스의 소개 페이지입니다. 캐릭터 선택, 스크롤 애니메이션, 방문 기록, 출시 소식 신청 폼을 제공합니다. 실제 음성 대화 기능은 아직 구현하지 않았습니다.

첫 화면에는 가족에 대한 공감 문구와 휴대폰을 보며 미소 짓는 어르신 일러스트를 배치했습니다. ‘우리의 마음’ 이야기 뒤에 ‘말동무 친구들’에서 캐릭터를 고를 수 있습니다. 일러스트는 내장 ImageGen으로 자연스러운 인물 비율과 물감의 번짐을 살린 수채화로 제작했으며, 제작 기록은 `design/hero-watercolor-wide.txt`에 있습니다. 실제 이용자 후기가 아닌 가상의 장면입니다.

복순 할머니는 부드러운 전라도 말투, 덕수 할아버지는 경상도 말투를 사용합니다. 나머지 세 캐릭터의 대사는 유지합니다.

두 수채화의 할아버지는 첫 화면의 인물과 체크셔츠·베이지색 면바지 차림을 기준으로 맞췄습니다. 혼자 TV를 보는 장면은 거실 배경과 표시 너비를 넓히고 가장자리를 부드럽게 처리했습니다. 편집 프롬프트는 `design/grandparents-consistent-outfit.txt`에 있습니다.

로고는 안경과 미소를 담은 말풍선이며 상단·하단 로고와 브라우저 아이콘에 함께 사용합니다. ‘통화를 끊고 나서도 / 괜히 마음이 쓰이는 날.’ 두 줄과 ‘오늘은 이런 이야기를 했어.’ 제목에만 칠곡군의 ‘칠곡할매 김영분체’를 사용합니다. 나머지 인용문·본문·메뉴·앱 예시는 Pretendard입니다. 글자 모양을 바꾸지 않은 WOFF2 파일을 로컬에서 불러오며 이용 조건과 공식 출처는 `maldongmu-site/assets/fonts/CHILGOK-LICENSE.txt`에 있습니다.

중간의 ‘함께할 일상’에는 스크롤에 따라 음성 대화·캐릭터·이야기 선택·큰 글씨를 보여주는 휴대폰 미리보기가 있습니다. 선택한 캐릭터에 맞는 배경과 네 가지 자세도 이 화면에 반영됩니다. 스크롤과 01–04 버튼에 따라 듣기, 인사, 사과로 끝말잇기 제안, 편안하게 듣는 모습으로 전환됩니다. 이미지와 제작 프롬프트는 `maldongmu-site/assets/character-scenes/`와 `design/character-scenes.txt`에 있습니다. 소개용 화면이며, 페이지 마지막의 대화·음성 입력 체험 데모는 포함하지 않습니다.

## 파일 구성

- `maldongmu-site/index.html`: 화면과 출시 소식 신청 폼
- `maldongmu-site/signup.js`: 쿠키 ID, 방문 기록과 이메일 신청 저장
- `scripts/experiment-report.cjs`: 실험 기간과 홍보 유입별 고유 방문자·신청자 집계
- `maldongmu-site/styles.css`: 화면 스타일
- `maldongmu-site/app.js`: 캐릭터 선택과 화면 동작
- `maldongmu-site/assets/`: 캐릭터 PNG, 로고, 글꼴과 글꼴 라이선스
- `maldongmu-site/assets/optimized/`: 화면 크기에 맞춘 WebP 이미지와 페이지용 글꼴. 원본 PNG와 전체 글꼴은 보관합니다.
- `netlify.toml`: Netlify 배포 폴더 설정

수업 원본, Apps Script 백업과 실제 검증 기록은 로컬에서 별도로 보관합니다.

## 로컬 확인

VS Code에서 `maldongmu-site/index.html`을 Live Server로 열면 됩니다. 이미지까지 확인하려면 `assets/character-candidates/`의 PNG 5개가 함께 있어야 합니다. 로컬에서도 실제 시트에 전송되지만 `localhost`, `127.0.0.1`, `file:` 접속은 테스트로 표시되어 실험 집계에서 제외됩니다.

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

두 컴퓨터의 `signup.js`는 같은 `endpoint`를 사용하므로 기존 Apps Script와 Google Sheets를 그대로 사용합니다. PC마다 새 백엔드나 DB를 만들 필요가 없습니다. 로컬 미리보기의 접속·신청은 테스트 기록으로 저장되며 쿠키 방문자 ID는 컴퓨터·브라우저·사이트 주소별로 다를 수 있습니다.

GitHub는 코드, Netlify는 공개 사이트, Apps Script는 요청 처리, Google Sheets는 데이터 보관을 담당합니다. Apps Script 편집기의 코드는 이 저장소의 HTML과 별도로 배포됩니다. 서버 코드를 바꿀 때는 기존 웹 앱 배포를 새 버전으로 갱신합니다.

## 데이터 연결

방문자의 브라우저가 Google Apps Script 웹 앱으로 요청을 보내면, Apps Script가 스프레드시트에 행을 추가합니다.

- `visitors`: `id`, `landingUrl`, `ip`, `referer`, `time_stamp`, `utm`, `device`, `experiment_id`, `is_test`
- `tab_final`: `id`, `email`, `advice`, `experiment_id`, `time_stamp`, `utm`, `is_test`

연결 주소는 `signup.js`의 `endpoint`에 있습니다. Apps Script는 탭의 첫 행에 있는 열 이름에 맞춰 데이터를 저장하므로 위 열 이름을 임의로 바꾸지 않습니다. 방문과 신청은 기존 `visitors`, `tab_final` 두 탭에서 관리합니다. 이미 열린 페이지가 `xyz_visitors`, `xyz_signups`로 요청해도 서버에서 각각 기존 탭으로 연결합니다. 서버 배포 주소는 유지하며 시각은 UTC ISO 문자열로 저장합니다. 실제 IP와 이메일 저장 방식도 유지합니다.

이메일만 필수이며 의견은 선택입니다. 서버의 `success: true`를 확인한 뒤 신청 완료를 표시합니다. 실패하면 입력을 보존하고 재시도할 수 있습니다. 전송 중에는 버튼을 잠그며 성공 후 같은 실험·브라우저에서 반복 신청을 막습니다. 자동 메일 발송은 연결하지 않았습니다.

### 이메일 신청률 가설과 집계

가설: **실험 기간에 지정한 홍보 링크로 들어온 고유 방문자의 10% 이상은 말동무챗 출시 알림을 받기 위해 이메일 신청을 완료할 것이다.**

배포 후 홍보 전에 실험 시작·종료 시각과 사용할 `utm` 값을 정합니다. 예를 들어 홍보 링크 끝에 `?utm=community1`을 붙입니다. 실험 구분은 `email-signup-v1`이며 다음 실험에서는 `signup.js`와 집계 스크립트의 실험 ID를 함께 바꿉니다.

- 분모 N: 해당 실험·기간에 지정한 `utm`으로 방문한 고유 ID 수.
- 분자 S: 그 방문자 중 같은 기간에 이메일 신청이 저장된 고유 ID 수. 방문 기록보다 앞선 신청은 제외합니다.
- 신청률: S / N. 새로고침·재방문·반복 제출 행은 같은 ID로 묶어 한 번만 셉니다.
- `is_test=true`와 이전 실험의 기록은 제외합니다. 최초 홍보 유입을 브라우저에 기억하므로 이후 직접 재방문한 신청도 연결됩니다.
- 쿠키 ID는 사람이 아니라 브라우저 단위의 근사치입니다. 기기 변경·쿠키와 저장소 삭제·저장 차단은 중복 또는 유입 연결 누락을 만들 수 있습니다.

아래 기간은 **실행 예시**입니다. 실제로 정한 시작·종료 시각과 홍보 유입으로 바꿔 실행합니다. 시작은 포함하고 종료는 제외합니다. 이메일과 IP 원문은 출력하지 않습니다.

```sh
node scripts/experiment-report.cjs --from "2026-11-01T00:00:00+09:00" --to "2026-11-08T00:00:00+09:00" --utm "community1,community2"
```

현재 Windows 환경의 Node.js 24에서 인증서 확인 오류가 나면 `node --use-system-ca scripts/experiment-report.cjs ...`처럼 운영체제의 신뢰 인증서를 사용합니다. 인증서 검증을 끄지 않습니다.

출력된 N과 S를 [수업의 비율 검정 코드](https://class.handsomeys.com/a_b_test_proportion.html)에 입력합니다. 관측 신청률과 통계적 검정 결과는 구분해 제출하며, 유의하지 않다는 이유만으로 ‘10% 이상임을 입증했다’고 해석하지 않습니다. 집계 로직 확인은 `node --test scripts/experiment-report.test.cjs`로 실행합니다.

공개 사이트의 화면·폼 확인은 `?test=1&utm=qa-check`를 붙여 접속합니다. 같은 탭에서는 테스트 구분이 유지되며 `?test=0`으로 해제할 수 있습니다. 테스트 신청은 새로고침 후 다시 시도할 수 있습니다. 로컬 접속은 항상 테스트입니다. 휴대폰에서 확인할 때도 이 테스트 링크를 사용합니다.

## Netlify 배포

현재 Netlify와 GitHub의 자동 배포 연결은 설정하지 않았습니다. GitHub에 코드를 올린 것만으로 사이트가 갱신되지는 않습니다. 직접 배포할 때는 Netlify 프로젝트의 업로드 영역에 `maldongmu-site` 폴더 전체를 올립니다.

이 저장소를 Netlify에 연결할 때 배포 브랜치는 `main`, 배포 폴더는 `maldongmu-site`를 사용합니다. 별도 빌드 명령은 필요하지 않으며 배포 폴더는 `netlify.toml`에 설정되어 있습니다.

공개 사이트: https://maldongmu-chat.netlify.app/

2026-11-01 21:37(한국시간)에 현재 로컬 사이트의 파일 37개를 기존 프로젝트에 수동 배포했습니다. 배포 ID는 `6ae73272567e132ab7209066`입니다. 공개 파일은 원본과 일치하며 HTML 두 개에는 Netlify가 안내 주석과 배지를 자동 추가합니다. 공개 주소에서 PC·모바일 화면, 다섯 캐릭터의 총 20개 장면, 신청 흐름을 검사했습니다. 실제 테스트 신청의 DB 저장, 방문 ID 연결, 실험 집계 제외도 확인했습니다.

에브리타임에 실제 공유한 링크의 유입 값은 `utm=everytime`입니다. 첫 게시 시각은 2026-11-01 23:11(한국시간)이며 실험 종료 시각은 아직 정하지 않았습니다. 개인 점검에는 위의 `test=1` 링크를 사용하며, 실제 홍보 링크에는 `test=1`을 넣지 않습니다.

2026-11-01 22:55(한국시간)에 이미지 로딩 개선 버전을 배포했습니다(`6ae744cdec743e4c769952fc`). 첫 화면과 TV 그림은 화면 폭에 따라 WebP 크기를 선택하며 캐릭터 선택 버튼에는 작은 썸네일을 사용합니다. 휴대폰 장면과 하단 실루엣은 해당 구간에 가까워질 때 불러옵니다. 현재 문구에 쓰이는 글꼴만 먼저 내려받고 새 문구나 입력에 다른 글자가 필요하면 기존 전체 글꼴로 표시합니다.

공개 사이트를 모바일 화면(390px, DPR 2), 캐시 없는 4Mbps·지연 150ms 조건에서 비교했을 때 첫 접속 리소스가 22.60MB에서 0.62MB로 줄었고 첫 그림 표시는 약 44.5초에서 1.5초로 단축됐습니다. 이 수치는 동일 조건의 점검 결과이며 실제 기기와 통신 환경에 따라 달라집니다. PC·모바일 신청 흐름과 총 20개 캐릭터 장면 전환도 다시 검사했습니다.

외부 커뮤니티에는 위의 공개 주소를 공유합니다. 커뮤니티별 유입 구분에는 `?utm=indietalk`처럼 `utm` 값을 붙일 수 있습니다. Live Server의 `localhost` 또는 `127.0.0.1` 주소는 외부 공유용이 아닙니다.

2026-11-02에 데이터 저장과 집계를 `visitors`, `tab_final`로 통합했습니다. 첫 홍보 이후 방문 기록을 기존 탭으로 옮겼으며 `xyz_visitors`, `xyz_signups` 탭은 제거했습니다. Apps Script 버전 3은 이전 탭 이름의 요청도 기존 탭으로 연결하므로 이미 열린 페이지의 저장도 계속 동작합니다. 이 변경은 Netlify 배포 `6ae7eef7262d07d0865500ed`에 반영했습니다.
