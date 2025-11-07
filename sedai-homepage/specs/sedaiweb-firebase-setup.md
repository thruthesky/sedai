---
name: sedaiweb-firebase-setup
version: 1.0.0
description: Firebase JavaScript SDK setup specification for SEDAI web using CDN (ES Module) approach
author: Song Jaeho
email: thruthesky@gmail.com
license: MIT
step: 10
dependencies: sedai-homepage/specs
---

## Overview

This specification defines the complete setup process for Firebase JavaScript SDK v12.5.0 using CDN imports with ES Modules. The setup enables Firebase services (Authentication, Firestore, Realtime Database, Storage, Analytics) for the SEDAI homepage and related web applications.

**Based on:** Firebase Official Documentation (https://firebase.google.com/docs/web/alt-setup)

## Requirements

### Browser Compatibility
- Modern browsers supporting ES Modules (ESM)
- Chrome 61+, Firefox 60+, Safari 11+, Edge 79+

### Firebase Services
- Firebase Console access
- Firebase project with web app registration
- Internet connection for CDN access

### Development Environment
- Text editor or IDE
- Web server (local or production)
- Firebase project credentials (API keys, project ID)

## Workflow

1. Create Firebase project in Firebase Console
2. Register web app and obtain Firebase configuration
3. Add Firebase SDK imports via CDN to HTML
4. Initialize Firebase services
5. Configure security rules
6. Test Firebase connection
7. Implement specific Firebase features

## Details

### Step 1: Create Firebase Project

**Navigate to Firebase Console:**
- URL: https://console.firebase.google.com
- Click "Add project" button
- Enter project name (e.g., `sedai-homepage`)
- Choose whether to enable Google Analytics (optional but recommended)
- Accept Firebase terms and create project

**Expected Result:**
- New Firebase project created
- Project overview dashboard accessible

### Step 2: Register Web App

**Register new web application:**

1. In Firebase Console, click the web icon `</>` to add a web app
2. Enter app nickname: `sedai-web`
3. Choose whether to set up Firebase Hosting (optional, can skip)
4. Click "Register app"

**Obtain Firebase Configuration:**

After registration, Firebase displays the configuration object:

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

**Important:**
- Copy this configuration object
- Store it securely (will be needed in HTML)
- API keys are safe to expose in client-side code (protected by Firebase security rules)

### Step 3: Firebase SDK CDN Import Structure

**SDK Version:** v12.5.0 (latest stable as of specification date)

**CDN Base URL:** `https://www.gstatic.com/firebasejs/12.5.0/`

**Available Modules:**

| Service | Module Name | CDN Path |
|---------|-------------|----------|
| Core (Required) | `firebase-app.js` | `https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js` |
| Authentication | `firebase-auth.js` | `https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js` |
| Firestore | `firebase-firestore.js` | `https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js` |
| Realtime Database | `firebase-database.js` | `https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js` |
| Storage | `firebase-storage.js` | `https://www.gstatic.com/firebasejs/12.5.0/firebase-storage.js` |
| Analytics | `firebase-analytics.js` | `https://www.gstatic.com/firebasejs/12.5.0/firebase-analytics.js` |
| Messaging | `firebase-messaging.js` | `https://www.gstatic.com/firebasejs/12.5.0/firebase-messaging.js` |

### Step 4: HTML Integration - Complete Example

**File Location:** Place in HTML `<body>` tag, before closing `</body>`

**Complete Firebase Setup Code:**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SEDAI - Firebase Integration</title>
</head>
<body>
    <h1>SEDAI Homepage</h1>

    <!-- Firebase SDK and Initialization -->
    <script type="module">
        // Import Firebase services
        import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js';
        import { getAnalytics } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-analytics.js';
        import { getAuth } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js';
        import { getFirestore } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js';
        import { getDatabase, ref, set, get, child } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js';

        // Firebase configuration
        const firebaseConfig = {
            apiKey: "YOUR_API_KEY",
            authDomain: "YOUR_PROJECT.firebaseapp.com",
            databaseURL: "https://YOUR_PROJECT.firebaseio.com",
            projectId: "YOUR_PROJECT_ID",
            storageBucket: "YOUR_PROJECT.appspot.com",
            messagingSenderId: "YOUR_SENDER_ID",
            appId: "YOUR_APP_ID",
            measurementId: "YOUR_MEASUREMENT_ID"
        };

        // Initialize Firebase
        const app = initializeApp(firebaseConfig);

        // Initialize services
        const analytics = getAnalytics(app);
        const auth = getAuth(app);
        const db = getFirestore(app);
        const rtdb = getDatabase(app);

        console.log("Firebase initialized successfully!");

        // Make Firebase services globally accessible (optional)
        window.firebaseApp = app;
        window.firebaseAuth = auth;
        window.firebaseDb = db;
        window.firebaseRtdb = rtdb;
    </script>
</body>
</html>
```

**Key Points:**
- `type="module"` attribute is **mandatory** for ES Module imports
- `initializeApp()` must be called **only once** per app
- Import only the services you need to reduce bundle size
- Services are initialized using `get*()` functions

### Step 5: Realtime Database Usage Example

**Complete Working Example:**

```html
<script type="module">
    import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js';
    import { getDatabase, ref, set, get, child, onValue } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js';

    const firebaseConfig = {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_PROJECT.firebaseapp.com",
        databaseURL: "https://YOUR_PROJECT.firebaseio.com",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_PROJECT.appspot.com",
        messagingSenderId: "YOUR_SENDER_ID",
        appId: "YOUR_APP_ID"
    };

    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);

    // Function: Write data to Realtime Database
    function writeUserData(userId, name, email) {
        set(ref(db, 'users/' + userId), {
            username: name,
            email: email,
            timestamp: Date.now()
        }).then(() => {
            console.log("Data written successfully");
        }).catch((error) => {
            console.error("Write failed:", error);
        });
    }

    // Function: Read data from Realtime Database
    function readUserData(userId) {
        const dbRef = ref(db);
        get(child(dbRef, `users/${userId}`))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    console.log("User data:", snapshot.val());
                } else {
                    console.log("No data available");
                }
            })
            .catch((error) => {
                console.error("Read failed:", error);
            });
    }

    // Function: Listen to real-time updates
    function listenToUserData(userId) {
        const userRef = ref(db, 'users/' + userId);
        onValue(userRef, (snapshot) => {
            const data = snapshot.val();
            console.log("Real-time update:", data);
        });
    }

    // Test calls
    writeUserData('user123', 'Song Jaeho', 'thruthesky@gmail.com');
    setTimeout(() => readUserData('user123'), 1000);
    listenToUserData('user123');
</script>
```

### Step 6: Firebase Security Rules

**Realtime Database Rules:**

Navigate to: Firebase Console ’ Realtime Database ’ Rules

**Development Environment (Testing Only):**
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

**  WARNING:** The above rules allow anyone to read/write your database. Use ONLY for development.

**Production Environment (Recommended):**
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

**Firestore Security Rules:**

Navigate to: Firebase Console ’ Firestore Database ’ Rules

**Production Rules:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own documents
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Public read, authenticated write
    match /posts/{postId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Step 7: Authentication Setup Example

**Email/Password Authentication:**

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

    const firebaseConfig = { /* your config */ };
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    // Sign up new user
    function signUpUser(email, password) {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log("User created:", user.uid);
            })
            .catch((error) => {
                console.error("Sign up error:", error.code, error.message);
            });
    }

    // Sign in existing user
    function signInUser(email, password) {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log("User signed in:", user.uid);
            })
            .catch((error) => {
                console.error("Sign in error:", error.code, error.message);
            });
    }

    // Sign out user
    function signOutUser() {
        signOut(auth)
            .then(() => {
                console.log("User signed out");
            })
            .catch((error) => {
                console.error("Sign out error:", error);
            });
    }

    // Monitor authentication state
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("User is signed in:", user.uid);
        } else {
            console.log("User is signed out");
        }
    });
</script>
```

### Step 8: Firestore Database Example

**Document CRUD Operations:**

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

    const firebaseConfig = { /* your config */ };
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    // Create document
    async function createUser(userId, userData) {
        await setDoc(doc(db, "users", userId), userData);
        console.log("Document created");
    }

    // Read document
    async function getUser(userId) {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log("User data:", docSnap.data());
            return docSnap.data();
        } else {
            console.log("No such document");
            return null;
        }
    }

    // Update document
    async function updateUser(userId, updates) {
        const docRef = doc(db, "users", userId);
        await updateDoc(docRef, updates);
        console.log("Document updated");
    }

    // Delete document
    async function deleteUser(userId) {
        await deleteDoc(doc(db, "users", userId));
        console.log("Document deleted");
    }

    // Query documents
    async function getUsersByAge(minAge) {
        const q = query(collection(db, "users"), where("age", ">=", minAge));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
        });
    }

    // Test calls
    createUser("user123", {
        name: "Song Jaeho",
        email: "thruthesky@gmail.com",
        age: 30
    });
</script>
```

### Step 9: Storage (File Upload) Example

**Upload and Download Files:**

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

    const firebaseConfig = { /* your config */ };
    const app = initializeApp(firebaseConfig);
    const storage = getStorage(app);

    // Upload file
    async function uploadFile(file, path) {
        const storageRef = ref(storage, path);
        const snapshot = await uploadBytes(storageRef, file);
        console.log("File uploaded:", snapshot.metadata.fullPath);

        // Get download URL
        const downloadURL = await getDownloadURL(snapshot.ref);
        console.log("Download URL:", downloadURL);
        return downloadURL;
    }

    // Delete file
    async function deleteFile(path) {
        const storageRef = ref(storage, path);
        await deleteObject(storageRef);
        console.log("File deleted");
    }

    // Example: Handle file input
    document.getElementById('fileInput').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            uploadFile(file, `uploads/${file.name}`);
        }
    });
</script>
```

## Testing

### Verification Checklist

- [ ] Firebase project created successfully
- [ ] Web app registered and configuration obtained
- [ ] Firebase SDK loads without console errors
- [ ] `initializeApp()` executes successfully
- [ ] Services initialize (Auth, Firestore, Realtime DB, Storage)
- [ ] Test write operation succeeds
- [ ] Test read operation succeeds
- [ ] Security rules configured appropriately
- [ ] Authentication flow works (if implemented)
- [ ] Browser console shows no errors

### Testing Commands

**Open browser console (F12) and verify:**

```javascript
// Check if Firebase is initialized
console.log(window.firebaseApp);

// Check if services are available
console.log(window.firebaseAuth);
console.log(window.firebaseDb);
console.log(window.firebaseRtdb);
```

**Expected output:**
- No errors in console
- Firebase objects are defined
- `"Firebase initialized successfully!"` message appears

## Common Issues and Solutions

### Issue 1: Module not found error
**Error:** `Failed to resolve module specifier "firebase/app"`

**Solution:**
- Ensure `type="module"` attribute is present in `<script>` tag
- Use full CDN URLs, not npm-style imports
- Correct: `import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js'`
- Incorrect: `import { initializeApp } from 'firebase/app'`

### Issue 2: Firebase not defined
**Error:** `Uncaught ReferenceError: firebase is not defined`

**Solution:**
- Modern Firebase SDK (v9+) does not use global `firebase` object
- Use modular imports: `import { initializeApp } from '...'`
- Do not try to access `firebase.app()` - use `initializeApp()` instead

### Issue 3: CORS errors
**Error:** `Access to fetch at '...' from origin '...' has been blocked by CORS policy`

**Solution:**
- Serve HTML file via web server (not `file://` protocol)
- Use local server: `python3 -m http.server 8000`
- Or use VS Code Live Server extension
- Firebase CDN requires HTTP/HTTPS protocol

### Issue 4: Permission denied
**Error:** `FirebaseError: Missing or insufficient permissions`

**Solution:**
- Check Firebase security rules in Console
- Ensure user is authenticated (if rules require auth)
- Verify rules allow the specific operation
- Test with development rules first (`.read: true, .write: true`)

## Production Deployment Checklist

- [ ] Replace placeholder Firebase config with actual project credentials
- [ ] Update security rules to production-ready configuration
- [ ] Enable required Firebase services (Auth, Firestore, RTDB, Storage)
- [ ] Set up billing alerts in Firebase Console
- [ ] Configure CORS settings if using custom domain
- [ ] Test all Firebase features in production environment
- [ ] Monitor Firebase usage via Console dashboard
- [ ] Set up error logging and monitoring

## Service-Specific Documentation

### Firebase Services Quick Reference

**Authentication:**
- Methods: Email/Password, Google, Facebook, Twitter, GitHub
- Functions: `signInWithEmailAndPassword()`, `signOut()`, `onAuthStateChanged()`
- Documentation: https://firebase.google.com/docs/auth/web/start

**Firestore (Document Database):**
- Structure: Collections ’ Documents ’ Fields
- Functions: `setDoc()`, `getDoc()`, `updateDoc()`, `deleteDoc()`, `query()`
- Documentation: https://firebase.google.com/docs/firestore/quickstart

**Realtime Database:**
- Structure: JSON tree
- Functions: `set()`, `get()`, `onValue()`, `update()`, `remove()`
- Documentation: https://firebase.google.com/docs/database/web/start

**Storage (File Upload):**
- Supported: Images, videos, audio, documents
- Functions: `uploadBytes()`, `getDownloadURL()`, `deleteObject()`
- Documentation: https://firebase.google.com/docs/storage/web/start

**Analytics:**
- Automatic page view tracking
- Custom event logging: `logEvent(analytics, 'event_name', params)`
- Documentation: https://firebase.google.com/docs/analytics/get-started

## Notes

- **API Key Security:** Firebase API keys can be safely exposed in client-side code. Security is enforced through Firebase Security Rules, not key secrecy.
- **SDK Updates:** Check https://firebase.google.com/docs/web/setup for latest SDK version. Update CDN URLs accordingly (currently v12.5.0).
- **Bundle Size:** Only import services you need. Each Firebase service adds to page load size.
- **Browser Support:** ES Modules require modern browsers. Consider fallback for older browsers if needed.
- **Rate Limits:** Firebase has quota limits. Monitor usage in Firebase Console.

## References

- Firebase Web Setup (Official): https://firebase.google.com/docs/web/setup
- Firebase CDN Setup (Official): https://firebase.google.com/docs/web/alt-setup
- Firebase JavaScript SDK Reference: https://firebase.google.com/docs/reference/js
- Firebase Console: https://console.firebase.google.com
- Firebase Status Page: https://status.firebase.google.com
