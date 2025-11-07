---
name: sedaiweb-firebase-setup
version: 1.0.0
description: CDN (ES Module) 방식을 사용한 SEDAI 웹을 위한 Firebase JavaScript SDK 설정 명세
author: Song Jaeho
email: thruthesky@gmail.com
license: MIT
step: 10
dependencies: sedai-homepage/specs
---

## 개요

본 명세는 ES 모듈과 함께 CDN imports를 사용하여 Firebase JavaScript SDK v12.5.0의 완전한 설정 프로세스를 정의합니다. 이 설정은 SEDAI 홈페이지 및 관련 웹 애플리케이션을 위한 Firebase 서비스(Authentication, Firestore, Realtime Database, Storage, Analytics)를 가능하게 합니다.

**기반:** Firebase 공식 문서 (https://firebase.google.com/docs/web/alt-setup)

## 요구사항

### 브라우저 호환성
- ES 모듈(ESM)을 지원하는 최신 브라우저
- Chrome 61+, Firefox 60+, Safari 11+, Edge 79+

### Firebase 서비스
- Firebase Console 접근 권한
- 웹 앱이 등록된 Firebase 프로젝트
- CDN 접근을 위한 인터넷 연결

### 개발 환경
- 텍스트 에디터 또는 IDE
- 웹 서버 (로컬 또는 프로덕션)
- Firebase 프로젝트 자격 증명 (API 키, 프로젝트 ID)

## 워크플로우

1. Firebase Console에서 Firebase 프로젝트 생성
2. 웹 앱 등록 및 Firebase 구성 획득
3. HTML에 CDN을 통한 Firebase SDK imports 추가
4. Firebase 서비스 초기화
5. 보안 규칙 구성
6. Firebase 연결 테스트
7. 특정 Firebase 기능 구현

## 상세 내용

### 단계 1: Firebase 프로젝트 생성

**Firebase Console로 이동:**
- URL: https://console.firebase.google.com
- "프로젝트 추가" 버튼 클릭
- 프로젝트 이름 입력 (예: `sedai-homepage`)
- Google Analytics 활성화 여부 선택 (선택사항이지만 권장)
- Firebase 약관 동의 및 프로젝트 생성

**예상 결과:**
- 새 Firebase 프로젝트 생성됨
- 프로젝트 개요 대시보드 접근 가능

### 단계 2: 웹 앱 등록

**새 웹 애플리케이션 등록:**

1. Firebase Console에서 웹 아이콘 `</>`을 클릭하여 웹 앱 추가
2. 앱 닉네임 입력: `sedai-web`
3. Firebase Hosting 설정 여부 선택 (선택사항, 건너뛸 수 있음)
4. "앱 등록" 클릭

**Firebase 구성 획득:**

등록 후 Firebase는 구성 객체를 표시합니다:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "sedai-homepage.firebaseapp.com",
  databaseURL: "https://sedai-homepage.firebaseio.com",
  projectId: "sedai-homepage",
  storageBucket: "sedai-homepage.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456",
  measurementId: "G-ABCDEFGH"
};
```

**중요:**
- 이 구성 객체를 복사
- 안전하게 보관 (HTML에서 필요함)
- API 키는 클라이언트 측 코드에 노출되어도 안전함 (Firebase 보안 규칙으로 보호)

### 단계 3: Firebase SDK CDN Import 구조

**SDK 버전:** v12.5.0 (명세 작성 시점의 최신 안정 버전)

**CDN 기본 URL:** `https://www.gstatic.com/firebasejs/12.5.0/`

**사용 가능한 모듈:**

| 서비스 | 모듈 이름 | CDN 경로 |
|---------|-------------|----------|
| 코어 (필수) | `firebase-app.js` | `https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js` |
| 인증 | `firebase-auth.js` | `https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js` |
| Firestore | `firebase-firestore.js` | `https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js` |
| Realtime Database | `firebase-database.js` | `https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js` |
| Storage | `firebase-storage.js` | `https://www.gstatic.com/firebasejs/12.5.0/firebase-storage.js` |
| Analytics | `firebase-analytics.js` | `https://www.gstatic.com/firebasejs/12.5.0/firebase-analytics.js` |
| Messaging | `firebase-messaging.js` | `https://www.gstatic.com/firebasejs/12.5.0/firebase-messaging.js` |

### 단계 4: HTML 통합 - 완전한 예제

**파일 위치:** HTML `<body>` 태그 내부, `</body>` 닫기 전에 배치

**완전한 Firebase 설정 코드:**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SEDAI - Firebase 통합</title>
</head>
<body>
    <h1>SEDAI 홈페이지</h1>

    <!-- Firebase SDK 및 초기화 -->
    <script type="module">
        // Firebase 서비스 import
        import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js';
        import { getAnalytics } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-analytics.js';
        import { getAuth } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js';
        import { getFirestore } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js';
        import { getDatabase, ref, set, get, child } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js';

        // Firebase 구성
        const firebaseConfig = {
            apiKey: "AIzaSyCb6xetNmUryJB44czwe9BrQPwYaSee7Rs",
            authDomain: "sedai-firebase.firebaseapp.com",
            databaseURL: "https://sedai-firebase-default-rtdb.firebaseio.com",
            projectId: "sedai-firebase",
            storageBucket: "sedai-firebase.firebasestorage.app",
            messagingSenderId: "275784781126",
            appId: "1:275784781126:web:91b75808d32ec3fa28a947"
        };

        // Firebase 초기화
        const app = initializeApp(firebaseConfig);

        // 서비스 초기화
        const analytics = getAnalytics(app);
        const auth = getAuth(app);
        const db = getFirestore(app);
        const rtdb = getDatabase(app);

        console.log("Firebase가 성공적으로 초기화되었습니다!");

        // Firebase 서비스를 전역적으로 접근 가능하게 만들기 (선택사항)
        window.firebaseApp = app;
        window.firebaseAuth = auth;
        window.firebaseDb = db;
        window.firebaseRtdb = rtdb;
    </script>
</body>
</html>
```

**핵심 사항:**
- `type="module"` 속성은 ES Module imports를 위해 **필수**
- `initializeApp()`은 앱당 **단 한 번**만 호출되어야 함
- 필요한 서비스만 import하여 번들 크기 축소
- 서비스는 `get*()` 함수를 사용하여 초기화

### 단계 5: Realtime Database 사용 예제

**완전한 작동 예제:**

```html
<script type="module">
    import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js';
    import { getDatabase, ref, set, get, child, onValue } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js';

    const firebaseConfig = {
        apiKey: "AIzaSyCb6xetNmUryJB44czwe9BrQPwYaSee7Rs",
        authDomain: "sedai-firebase.firebaseapp.com",
        databaseURL: "https://sedai-firebase-default-rtdb.firebaseio.com",
        projectId: "sedai-firebase",
        storageBucket: "sedai-firebase.firebasestorage.app",
        messagingSenderId: "275784781126",
        appId: "1:275784781126:web:91b75808d32ec3fa28a947"
    };

    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);

    // 함수: Realtime Database에 데이터 쓰기
    function writeUserData(userId, name, email) {
        set(ref(db, 'users/' + userId), {
            username: name,
            email: email,
            timestamp: Date.now()
        }).then(() => {
            console.log("데이터가 성공적으로 작성되었습니다");
        }).catch((error) => {
            console.error("쓰기 실패:", error);
        });
    }

    // 함수: Realtime Database에서 데이터 읽기
    function readUserData(userId) {
        const dbRef = ref(db);
        get(child(dbRef, `users/${userId}`))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    console.log("사용자 데이터:", snapshot.val());
                } else {
                    console.log("사용 가능한 데이터 없음");
                }
            })
            .catch((error) => {
                console.error("읽기 실패:", error);
            });
    }

    // 함수: 실시간 업데이트 수신
    function listenToUserData(userId) {
        const userRef = ref(db, 'users/' + userId);
        onValue(userRef, (snapshot) => {
            const data = snapshot.val();
            console.log("실시간 업데이트:", data);
        });
    }

    // 테스트 호출
    writeUserData('user123', 'Song Jaeho', 'thruthesky@gmail.com');
    setTimeout(() => readUserData('user123'), 1000);
    listenToUserData('user123');
</script>
```

### 단계 6: Firebase 보안 규칙

**Realtime Database 규칙:**

이동: Firebase Console → Realtime Database → 규칙

**개발 환경 (테스트 전용):**
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

**⚠ 경고:** 위 규칙은 누구나 데이터베이스를 읽고 쓸 수 있게 합니다. 개발 목적으로만 사용하세요.

**프로덕션 환경 (권장):**
```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null",
    "users": {
      "$userId": {
        ".read": "$userId === auth.uid",
        ".write": "$userId === auth.uid"
      }
    }
  }
}
```

**Firestore 보안 규칙:**

이동: Firebase Console → Firestore Database → 규칙

**프로덕션 규칙:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 사용자는 자신의 문서만 읽기/쓰기 가능
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // 공개 읽기, 인증된 사용자만 쓰기
    match /posts/{postId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 단계 7: 인증 설정 예제

**이메일/비밀번호 인증:**

```html
<script type="module">
    import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js';
    import {
        getAuth,
        createUserWithEmailAndPassword,
        signInWithEmailAndPassword,
        signOut,
        onAuthStateChanged
    } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js';

    const firebaseConfig = {
        apiKey: "AIzaSyCb6xetNmUryJB44czwe9BrQPwYaSee7Rs",
        authDomain: "sedai-firebase.firebaseapp.com",
        databaseURL: "https://sedai-firebase-default-rtdb.firebaseio.com",
        projectId: "sedai-firebase",
        storageBucket: "sedai-firebase.firebasestorage.app",
        messagingSenderId: "275784781126",
        appId: "1:275784781126:web:91b75808d32ec3fa28a947"
    };
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    // 새 사용자 가입
    function signUpUser(email, password) {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log("사용자 생성됨:", user.uid);
            })
            .catch((error) => {
                console.error("가입 오류:", error.code, error.message);
            });
    }

    // 기존 사용자 로그인
    function signInUser(email, password) {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log("사용자 로그인됨:", user.uid);
            })
            .catch((error) => {
                console.error("로그인 오류:", error.code, error.message);
            });
    }

    // 사용자 로그아웃
    function signOutUser() {
        signOut(auth)
            .then(() => {
                console.log("사용자 로그아웃됨");
            })
            .catch((error) => {
                console.error("로그아웃 오류:", error);
            });
    }

    // 인증 상태 모니터링
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("사용자 로그인 상태:", user.uid);
        } else {
            console.log("사용자 로그아웃 상태");
        }
    });
</script>
```

### 단계 8: Firestore Database 예제

**문서 CRUD 작업:**

```html
<script type="module">
    import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js';
    import {
        getFirestore,
        collection,
        doc,
        setDoc,
        getDoc,
        updateDoc,
        deleteDoc,
        query,
        where,
        getDocs
    } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js';

    const firebaseConfig = {
        apiKey: "AIzaSyCb6xetNmUryJB44czwe9BrQPwYaSee7Rs",
        authDomain: "sedai-firebase.firebaseapp.com",
        databaseURL: "https://sedai-firebase-default-rtdb.firebaseio.com",
        projectId: "sedai-firebase",
        storageBucket: "sedai-firebase.firebasestorage.app",
        messagingSenderId: "275784781126",
        appId: "1:275784781126:web:91b75808d32ec3fa28a947"
    };
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    // 문서 생성
    async function createUser(userId, userData) {
        await setDoc(doc(db, "users", userId), userData);
        console.log("문서 생성됨");
    }

    // 문서 읽기
    async function getUser(userId) {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log("사용자 데이터:", docSnap.data());
            return docSnap.data();
        } else {
            console.log("해당 문서 없음");
            return null;
        }
    }

    // 문서 업데이트
    async function updateUser(userId, updates) {
        const docRef = doc(db, "users", userId);
        await updateDoc(docRef, updates);
        console.log("문서 업데이트됨");
    }

    // 문서 삭제
    async function deleteUser(userId) {
        await deleteDoc(doc(db, "users", userId));
        console.log("문서 삭제됨");
    }

    // 문서 쿼리
    async function getUsersByAge(minAge) {
        const q = query(collection(db, "users"), where("age", ">=", minAge));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
        });
    }

    // 테스트 호출
    createUser("user123", {
        name: "Song Jaeho",
        email: "thruthesky@gmail.com",
        age: 30
    });
</script>
```

### 단계 9: Storage (파일 업로드) 예제

**파일 업로드 및 다운로드:**

```html
<script type="module">
    import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js';
    import {
        getStorage,
        ref,
        uploadBytes,
        getDownloadURL,
        deleteObject
    } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-storage.js';

    const firebaseConfig = {
        apiKey: "AIzaSyCb6xetNmUryJB44czwe9BrQPwYaSee7Rs",
        authDomain: "sedai-firebase.firebaseapp.com",
        databaseURL: "https://sedai-firebase-default-rtdb.firebaseio.com",
        projectId: "sedai-firebase",
        storageBucket: "sedai-firebase.firebasestorage.app",
        messagingSenderId: "275784781126",
        appId: "1:275784781126:web:91b75808d32ec3fa28a947"
    };
    const app = initializeApp(firebaseConfig);
    const storage = getStorage(app);

    // 파일 업로드
    async function uploadFile(file, path) {
        const storageRef = ref(storage, path);
        const snapshot = await uploadBytes(storageRef, file);
        console.log("파일 업로드됨:", snapshot.metadata.fullPath);

        // 다운로드 URL 가져오기
        const downloadURL = await getDownloadURL(snapshot.ref);
        console.log("다운로드 URL:", downloadURL);
        return downloadURL;
    }

    // 파일 삭제
    async function deleteFile(path) {
        const storageRef = ref(storage, path);
        await deleteObject(storageRef);
        console.log("파일 삭제됨");
    }

    // 예제: 파일 입력 처리
    document.getElementById('fileInput').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            uploadFile(file, `uploads/${file.name}`);
        }
    });
</script>
```

## 테스팅

### 검증 체크리스트

- [ ] Firebase 프로젝트가 성공적으로 생성됨
- [ ] 웹 앱이 등록되고 구성을 획득함
- [ ] Firebase SDK가 콘솔 오류 없이 로드됨
- [ ] `initializeApp()`이 성공적으로 실행됨
- [ ] 서비스 초기화됨 (Auth, Firestore, Realtime DB, Storage)
- [ ] 테스트 쓰기 작업 성공
- [ ] 테스트 읽기 작업 성공
- [ ] 보안 규칙이 적절히 구성됨
- [ ] 인증 흐름이 작동함 (구현된 경우)
- [ ] 브라우저 콘솔에 오류 없음

### 테스팅 명령

**브라우저 콘솔(F12)을 열고 확인:**

```javascript
// Firebase가 초기화되었는지 확인
console.log(window.firebaseApp);

// 서비스가 사용 가능한지 확인
console.log(window.firebaseAuth);
console.log(window.firebaseDb);
console.log(window.firebaseRtdb);
```

**예상 출력:**
- 콘솔에 오류 없음
- Firebase 객체가 정의됨
- `"Firebase가 성공적으로 초기화되었습니다!"` 메시지 나타남

## 일반적인 문제 및 해결책

### 문제 1: 모듈을 찾을 수 없음 오류
**오류:** `Failed to resolve module specifier "firebase/app"`

**해결책:**
- `<script>` 태그에 `type="module"` 속성이 있는지 확인
- npm 스타일 imports가 아닌 전체 CDN URL 사용
- 올바름: `import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js'`
- 잘못됨: `import { initializeApp } from 'firebase/app'`

### 문제 2: Firebase가 정의되지 않음
**오류:** `Uncaught ReferenceError: firebase is not defined`

**해결책:**
- 최신 Firebase SDK (v9+)는 전역 `firebase` 객체를 사용하지 않음
- 모듈식 imports 사용: `import { initializeApp } from '...'`
- `firebase.app()`에 접근하려 하지 마세요 - 대신 `initializeApp()` 사용

### 문제 3: CORS 오류
**오류:** `Access to fetch at '...' from origin '...' has been blocked by CORS policy`

**해결책:**
- `file://` 프로토콜이 아닌 웹 서버를 통해 HTML 파일 제공
- 로컬 서버 사용: `python3 -m http.server 8000`
- 또는 VS Code Live Server 확장 프로그램 사용
- Firebase CDN은 HTTP/HTTPS 프로토콜 필요

### 문제 4: 권한 거부
**오류:** `FirebaseError: Missing or insufficient permissions`

**해결책:**
- Firebase Console에서 보안 규칙 확인
- 사용자가 인증되었는지 확인 (규칙이 인증을 요구하는 경우)
- 규칙이 특정 작업을 허용하는지 확인
- 먼저 개발 규칙으로 테스트 (`.read: true, .write: true`)

## 프로덕션 배포 체크리스트

- [ ] 플레이스홀더 Firebase 구성을 실제 프로젝트 자격 증명으로 교체
- [ ] 보안 규칙을 프로덕션 준비 구성으로 업데이트
- [ ] 필요한 Firebase 서비스 활성화 (Auth, Firestore, RTDB, Storage)
- [ ] Firebase Console에서 청구 알림 설정
- [ ] 커스텀 도메인 사용 시 CORS 설정 구성
- [ ] 프로덕션 환경에서 모든 Firebase 기능 테스트
- [ ] Console 대시보드를 통해 Firebase 사용량 모니터링
- [ ] 오류 로깅 및 모니터링 설정

## 서비스별 문서

### Firebase 서비스 빠른 참조

**Authentication:**
- 방법: Email/Password, Google, Facebook, Twitter, GitHub
- 함수: `signInWithEmailAndPassword()`, `signOut()`, `onAuthStateChanged()`
- 문서: https://firebase.google.com/docs/auth/web/start

**Firestore (문서 데이터베이스):**
- 구조: Collections → Documents → Fields
- 함수: `setDoc()`, `getDoc()`, `updateDoc()`, `deleteDoc()`, `query()`
- 문서: https://firebase.google.com/docs/firestore/quickstart

**Realtime Database:**
- 구조: JSON 트리
- 함수: `set()`, `get()`, `onValue()`, `update()`, `remove()`
- 문서: https://firebase.google.com/docs/database/web/start

**Storage (파일 업로드):**
- 지원: 이미지, 비디오, 오디오, 문서
- 함수: `uploadBytes()`, `getDownloadURL()`, `deleteObject()`
- 문서: https://firebase.google.com/docs/storage/web/start

**Analytics:**
- 자동 페이지 뷰 추적
- 커스텀 이벤트 로깅: `logEvent(analytics, 'event_name', params)`
- 문서: https://firebase.google.com/docs/analytics/get-started

## 참고사항

- **API 키 보안:** Firebase API 키는 클라이언트 측 코드에 안전하게 노출될 수 있습니다. 보안은 키 비밀성이 아닌 Firebase 보안 규칙을 통해 시행됩니다.
- **SDK 업데이트:** https://firebase.google.com/docs/web/setup 에서 최신 SDK 버전을 확인하세요. CDN URL을 그에 따라 업데이트하세요 (현재 v12.5.0).
- **번들 크기:** 필요한 서비스만 import하세요. 각 Firebase 서비스는 페이지 로드 크기를 증가시킵니다.
- **브라우저 지원:** ES 모듈은 최신 브라우저가 필요합니다. 필요한 경우 이전 브라우저용 대체 방안을 고려하세요.
- **속도 제한:** Firebase에는 할당량 제한이 있습니다. Firebase Console에서 사용량을 모니터링하세요.

## 참조

- Firebase 웹 설정 (공식): https://firebase.google.com/docs/web/setup
- Firebase CDN 설정 (공식): https://firebase.google.com/docs/web/alt-setup
- Firebase JavaScript SDK 참조: https://firebase.google.com/docs/reference/js
- Firebase Console: https://console.firebase.google.com
- Firebase 상태 페이지: https://status.firebase.google.com
