# 🌿 PflanzenABC

PflanzenABC is a cross-platform Ionic + Angular application for managing your personal plant collection.  
You can add plants with optional photos, organize them alphabetically, and even back up your data securely to Firebase.

---

## ✨ Features

- 📚 **Plant Collection Management**  
  Add, edit, and delete plants in an IndexedDB database stored locally on your device.

- 🖼️ **Optional Plant Photos**  
  Each plant can have an optional image attached (stored locally and platform-bound).

- 🌱 **Separate Collections**  
  Create and manage multiple collections of plants, sorted alphabetically.

- 🔐 **Encrypted Cloud Backup**  
  When logged in, all data (except images) is automatically encrypted and backed up to Firebase in the background whenever IndexedDB changes.

- ☁️ **Cross-Platform Sync**  
  Backup data can be restored across platforms (Android, web, etc.), making your collection portable.

- 🔄 **Automatic Backup Sync**  
  Runs silently in the background when the user is authenticated.

---

## 🧩 Tech Stack

- **Framework:** [Ionic](https://ionicframework.com/) with [Angular](https://angular.io/)  
- **Database:** IndexedDB (via Angular service)  
- **Cloud:** Firebase (for authentication and encrypted backup storage)  
- **Build Tools:** Capacitor (for Android integration)  
- **CI/CD:** GitHub Actions (automated build & release pipeline)

---

## ⚙️ Local Development

### 1. Install Dependencies

```bash
npm install
```

### 2. Run the App in the Browser

```bash
ionic serve
```

### 3. Run on Android (Debug)

```bash
ionic capacitor build android
ionic capacitor run android -l --external
```

### 4. Build for Production

```bash
ionic build
```

## 🚀 GitHub Actions Pipeline

The GitHub Actions workflow automates both debug and release builds.

### 🔧 Debug Build

Triggered on each push to the main branch.

Builds the app in debug mode for Android.

Artifacts (APK/AAB) are uploaded for download and testing.

### 🏷️ Release Build

Triggered when a Git tag is pushed (e.g. v1.0.0).

Builds a signed release APK/AAB.

Publishes the artifact as a GitHub Release asset.

## 🔒 Firebase Integration

**Authentication**: Users can register and log in using Firebase Auth (email/password).

**Backup System**: IndexedDB data is encrypted before being uploaded to Firebase.

**Automatic Sync**: Whenever IndexedDB changes and the user is logged in, the app pushes updates to Firebase automatically.

**Images**: Images remain local and are not included in cloud backups (due to platform dependency).

## 🔑 Environment Setup

Create an .env or configure environment.ts with your Firebase credentials:

```bash
export const environment = {
  production: false,
  BACKUP_SECRET_KEY: "YOUR_BACKUP_SECRET_KEY",
  firebase: {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_BUCKET",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID",
  },
};
```

## 🧪 Future Ideas

- 🌍 Web & iOS builds

- 🧬 Import/Export via JSON

- 📸 Image backup option with Firebase Storage

- 🪴 Plant care reminders
