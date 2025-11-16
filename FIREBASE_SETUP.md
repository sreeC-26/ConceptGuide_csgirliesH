# Firebase Setup Guide

To enable authentication and history saving, you need to set up Firebase:

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the setup wizard
3. Enable Authentication:
   - Go to Authentication → Sign-in method
   - Enable "Email/Password" provider

4. Enable Firestore:
   - Go to Firestore Database
   - Click "Create database"
   - Choose "Start in test mode" (or set up rules as needed)
   - Select a location

## 2. Get Your Firebase Config

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click the web icon (`</>`) to add a web app
4. Copy the Firebase configuration object

## 3. Set Environment Variables

Create a `.env` file in the project root with:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

## 4. Firestore Security Rules (Optional but Recommended)

In Firestore Database → Rules, add:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /history/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

This ensures users can only read/write their own history.

## 5. Restart Your Dev Server

After setting up the `.env` file, restart your Vite dev server.

