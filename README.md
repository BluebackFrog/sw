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

## 데이터 연결

방문자의 브라우저가 Google Apps Script 웹 앱으로 요청을 보내면, Apps Script가 스프레드시트에 행을 추가합니다.

- `visitors`: 쿠키 식별자, 방문 주소, IP, 유입 주소, 시각, `utm`, 기기 유형
- `tab_final`: 쿠키 식별자, 이메일, 의견

연결 주소는 `index.html`의 `addrScript`에 있습니다. 서버는 JSON으로 응답하며, 폼은 `success: true`를 확인한 뒤 입력을 비우고 완료 팝업을 표시합니다. Postman은 수동 요청 테스트용이며 사이트 실행에는 필요하지 않습니다. 자동 메일 발송은 연결하지 않았습니다.

## Netlify 배포

이 저장소를 Netlify에 연결할 때 배포 브랜치는 `main`, 배포 폴더는 `maldongmu-site`를 사용합니다. 별도 빌드 명령은 필요하지 않으며 배포 폴더는 `netlify.toml`에 설정되어 있습니다.

기존 사이트 주소: https://lively-bubblegum-3768ab.netlify.app/

최신 배포 완료와 공개 설정을 확인한 뒤 이 주소를 공유합니다. 커뮤니티별 유입 구분에는 `?utm=indietalk`처럼 `utm` 값을 붙일 수 있습니다. Live Server의 `localhost` 또는 `127.0.0.1` 주소는 외부 공유용이 아닙니다.
