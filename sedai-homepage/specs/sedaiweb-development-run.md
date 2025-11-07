
# 로컬 실행

```
% http-server .
```

와 같이 실행하고 웹 브라우저로 접속을 하면 됩니다.


# 디버그 토큰 방식으로 로컬 개발 환경에서 Firebase App Check 사용하기

127.0.0.1에서도 로컬 테스트할 수 있습니다. 가장 간단하고 권장되는 방법은 App Check 디버그 토큰을 쓰는 거예요. (로컬에선 도메인 허용 대신 디버그 토큰이 표준입니다.)

빠른 해결(권장)
	1.	초기화 전에 한 줄 추가

// 가장 위, Firebase 초기화랑 App Check 초기화보다 먼저!
(self as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true; // 1회용 토큰 생성 모드

	2.	페이지 새로고침 → 브라우저 콘솔에 App Check debug token: … 이 출력됩니다.
	3.	Firebase 콘솔 → App Check → Debug tokens → Add
콘솔에 찍힌 토큰 값을 그대로 등록하세요.
	4.	App Check 초기화(이 코드는 Firebase 초기화 직후, 어떤 서비스 호출보다 먼저!)

import { initializeApp } from "firebase/app";
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";

const app = initializeApp({ /* your config */ });

initializeAppCheck(app, {
  provider: new ReCaptchaEnterpriseProvider("YOUR_RECAPTCHA_ENTERPRISE_SITE_KEY"),
  isTokenAutoRefreshEnabled: true,
});

이제 http://127.0.0.1:포트(또는 localhost)에서 호출되는 요청도 유효한 App Check 토큰이 붙습니다.
(디버그 토큰은 로컬 개발 전용이라 보안에 영향 없습니다.)

깔끔하게 쓰고 싶다면:
첫 새로고침으로 토큰을 얻어 콘솔에 등록한 다음, 코드에

(self as any).FIREBASE_APPCHECK_DEBUG_TOKEN = "콘솔에 등록한_고정_토큰값";

처럼 문자열로 넣어두면 이후 콘솔 로그가 뜨지 않습니다.

⸻

흔한 오류/체크포인트
	•	“Missing appcheck token …” 경고
→ App Check 초기화가 Realtime Database 구독/요청보다 먼저 실행되는지 확인하세요.
(예: onValue() 호출 전에 위의 initializeAppCheck가 실행되어야 합니다.)
	•	Enforce 모드
이미 Realtime DB를 Enforce로 켰다면 토큰 없을 때 차단됩니다.
디버그 토큰 등록 + 올바른 초기화 순서면 해결됩니다.
(모니터링 모드에선 경고만 뜨고 동작은 합니다.)
	•	document.write 경고
BrowserPollConnection.ts … Avoid using document.write()는 Realtime DB의 폴백 폴링에서 나오는 무해한 브라우저 경고입니다. 기능엔 영향 없습니다.

