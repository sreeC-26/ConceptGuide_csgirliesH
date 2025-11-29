# 🚀 ConceptGuide Deployment Guide

This guide covers how to deploy ConceptGuide for **free** using Vercel (frontend) and various backend hosting options.

---

## 📋 Table of Contents

1. [Deployment Overview](#deployment-overview)
2. [Prerequisites](#prerequisites)
3. [Option 1: Vercel (Frontend) + Railway (Backend)](#option-1-vercel-frontend--railway-backend)
4. [Option 2: Vercel (Full Stack with Serverless)](#option-2-vercel-full-stack-with-serverless)
5. [Option 3: Vercel + Render](#option-3-vercel--render)
6. [Environment Variables Configuration](#environment-variables-configuration)
7. [Post-Deployment Checklist](#post-deployment-checklist)
8. [Firebase Data Structure](#firebase-data-structure)
9. [Viewing Firebase Data](#viewing-firebase-data)
10. [Troubleshooting](#troubleshooting)

---

## 🏗️ Deployment Overview

ConceptGuide has two parts that need to be deployed:

| Component | What it does | Deployment Options |
|-----------|--------------|-------------------|
| **Frontend** | React app (Vite) | Vercel, Netlify, Cloudflare Pages |
| **Backend** | Express API (Gemini calls) | Railway, Render, Vercel Serverless |

### Free Tier Limits

| Platform | Free Tier Limits |
|----------|-----------------|
| **Vercel Hobby** | 100GB bandwidth/month, unlimited deployments |
| **Railway** | $5 free credits/month (~500 hours) |
| **Render** | 750 hours/month for web services |
| **Firebase** | 1GB storage, 50K reads/day, 20K writes/day |

---

## ✅ Prerequisites

Before deploying, ensure you have:

- [ ] GitHub account with your code pushed
- [ ] Vercel account (sign up at [vercel.com](https://vercel.com))
- [ ] Google Gemini API key
- [ ] Firebase project configured

---

## 🎯 Option 1: Vercel (Frontend) + Railway (Backend)

**Recommended for beginners** - Easiest setup with separate frontend and backend.

### Step 1: Deploy Backend to Railway

#### 1.1 Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project"

#### 1.2 Deploy from GitHub
1. Click "Deploy from GitHub repo"
2. Select your ConceptGuide repository
3. Railway will detect it as a Node.js app

#### 1.3 Configure Railway
1. Go to your project → "Variables"
2. Add environment variables:

```
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3001
```

#### 1.4 Configure Start Command
1. Go to "Settings" → "Deploy"
2. Set **Start Command**: `npm run server`
3. Set **Root Directory**: `/` (leave empty for root)

#### 1.5 Get Your Backend URL
After deployment, Railway will give you a URL like:
```
https://conceptguide-backend-production.up.railway.app
```

**Save this URL** - you'll need it for the frontend.

---

### Step 2: Deploy Frontend to Vercel

#### 2.1 Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub

#### 2.2 Import Project
1. Click "Add New..." → "Project"
2. Select your ConceptGuide repository
3. Vercel will auto-detect Vite

#### 2.3 Configure Build Settings

| Setting | Value |
|---------|-------|
| Framework Preset | Vite |
| Root Directory | `./` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

#### 2.4 Add Environment Variables

In Vercel dashboard → Project Settings → Environment Variables:

```
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id

# Backend URL (from Railway)
VITE_API_URL=https://your-railway-app.up.railway.app
```

#### 2.5 Update Frontend API Calls

Before deploying, update your frontend to use environment variable for API URL.

Create/update `src/config.js`:

```javascript
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
```

Then update all `fetch` calls in your components to use this:

```javascript
// Before
fetch('http://localhost:3001/api/analyze-and-generate-path', ...)

// After
import { API_URL } from '../config';
fetch(`${API_URL}/api/analyze-and-generate-path`, ...)
```

**Files to update:**
- `src/components/PDFUpload.jsx` - PDF cleaning endpoint
- `src/components/QuestionModal.jsx` - Question generation endpoint
- `src/components/LearningExperience.jsx` - Analysis endpoint
- `src/components/InsightsPanel.jsx` - Insights endpoint

#### 2.6 Deploy
1. Click "Deploy"
2. Wait for build to complete
3. Your app is live at `https://your-project.vercel.app`

---

## ⚡ Option 2: Vercel (Full Stack with Serverless)

**Advanced** - Convert Express to Vercel serverless functions.

### Step 1: Create API Directory

Create `api/` folder in your project root:

```
ConceptGuide/
├── api/
│   ├── generate-questions.js
│   ├── clean-pdf-content.js
│   ├── generate-insights.js
│   └── analyze-and-generate-path.js
├── src/
└── ...
```

### Step 2: Convert Express Routes to Serverless

Create `api/analyze-and-generate-path.js`:

```javascript
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { selectedText, qaPairs } = req.body;
    
    // Your existing analysis logic here...
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    // ... rest of your code from server.js
    
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

### Step 3: Update vercel.json

Create `vercel.json` in project root:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/**/*.js",
      "use": "@vercel/node"
    },
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
```

### Step 4: Update Frontend API Calls

```javascript
// Use relative URLs for Vercel serverless
fetch('/api/analyze-and-generate-path', ...)
```

### Step 5: Add Environment Variables

In Vercel dashboard, add:
```
GEMINI_API_KEY=your_gemini_api_key
VITE_FIREBASE_API_KEY=...
// ... other Firebase vars
```

### Step 6: Deploy

```bash
vercel deploy --prod
```

---

## 🌐 Option 3: Vercel + Render

Similar to Railway, but using Render for backend.

### Deploy Backend to Render

1. Go to [render.com](https://render.com)
2. Click "New" → "Web Service"
3. Connect GitHub repository
4. Configure:

| Setting | Value |
|---------|-------|
| Name | conceptguide-backend |
| Environment | Node |
| Build Command | `npm install` |
| Start Command | `npm run server` |

5. Add environment variables:
```
GEMINI_API_KEY=your_key
PORT=3001
```

6. Click "Create Web Service"
7. Get URL: `https://conceptguide-backend.onrender.com`

### Deploy Frontend to Vercel

Same as Option 1, Step 2.

---

## 🔐 Environment Variables Configuration

### Complete List of Environment Variables

#### Backend (Railway/Render)

```env
# Required
GEMINI_API_KEY=your_google_ai_api_key

# Optional
PORT=3001
NODE_ENV=production
```

#### Frontend (Vercel)

```env
# Firebase (Required for auth & persistence)
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123

# Backend URL (if using separate backend)
VITE_API_URL=https://your-backend-url.up.railway.app
```

### How to Get Firebase Config

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Click gear icon → "Project settings"
4. Scroll to "Your apps" → Select web app
5. Copy config values

---

## ✅ Post-Deployment Checklist

After deploying, verify everything works:

- [ ] **Homepage loads** - Visit your Vercel URL
- [ ] **PDF upload works** - Upload a test PDF
- [ ] **Text selection works** - Select text, see "I'm confused" button
- [ ] **Questions generate** - Click button, see 5 questions
- [ ] **Analysis completes** - Submit answers, see results
- [ ] **Mind map displays** - Click "View Mind Map"
- [ ] **Learning path works** - Complete a learning step
- [ ] **Auth works** - Sign up/Sign in
- [ ] **History saves** - Check History page after completing session
- [ ] **Goals work** - Create and track a goal

### Common Issues

| Issue | Solution |
|-------|----------|
| API calls fail | Check CORS settings, verify backend URL |
| Firebase auth fails | Verify Firebase config, check authorized domains |
| Build fails | Check Node version, clear cache |
| Slow cold starts | Railway/Render free tier has cold starts ~30s |

---

## 🔥 Firebase Data Structure

### What's Stored in Firebase

ConceptGuide uses Firebase for two main purposes:

#### 1. Authentication (Firebase Auth)

Stores user accounts:
- Email
- Password (hashed)
- User ID (uid)
- Account creation date
- Last sign-in

#### 2. Firestore Database

```
firestore/
└── users/
    └── {userId}/
        ├── sessions/
        │   └── {sessionId}/
        │       ├── id: string
        │       ├── timestamp: string (ISO date)
        │       ├── pdfName: string
        │       ├── selectedText: string (first 100 chars)
        │       ├── fullSelectedText: string
        │       ├── confusionType: string | null
        │       ├── masteryScore: number | null
        │       ├── timeSpent: number (minutes)
        │       ├── totalSteps: number
        │       ├── completedSteps: number
        │       ├── analysisComplete: boolean
        │       ├── diagnosticSummary: string
        │       ├── overallAccuracy: number (0-1)
        │       ├── overallConfidence: number (0-1)
        │       ├── questionResponses: array
        │       │   └── { question, answer, level, type }
        │       ├── levelScores: array
        │       │   └── { level, accuracy, confidence, keywords }
        │       ├── specificGaps: array of strings
        │       ├── mindMapData: object | null
        │       │   ├── nodes: array
        │       │   └── edges: array
        │       └── repairPathData: array
        │           └── { stepNumber, conceptName, explanation, ... }
        │
        └── goals/
            └── {goalId}/
                ├── id: string
                ├── name: string
                ├── type: "sessions" | "time" | "mastery" | "streak"
                ├── target: number
                ├── period: "daily" | "weekly" | "monthly"
                ├── startDate: string (ISO date)
                ├── isActive: boolean
                ├── reminderEnabled: boolean
                ├── reminderTime: string ("HH:MM")
                ├── createdAt: string (ISO date)
                └── updatedAt: string (ISO date)
```

### Data Size Estimates

| Data Type | Approximate Size |
|-----------|-----------------|
| Session (without analysis) | ~1 KB |
| Session (with full analysis) | ~10-50 KB |
| Goal | ~500 bytes |
| User with 10 sessions | ~100-500 KB |

---

## 👀 Viewing Firebase Data

### Method 1: Firebase Console (Recommended)

#### View Authentication Data

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Click **"Authentication"** in left sidebar
4. Click **"Users"** tab

You'll see:
- User email
- User UID
- Creation date
- Last sign-in
- Provider (email/password)

![Firebase Auth Users](https://firebase.google.com/docs/auth/images/console-users.png)

#### View Firestore Data

1. In Firebase Console, click **"Firestore Database"**
2. You'll see the collection structure:

```
📁 users
   📁 abc123xyz (user ID)
      📁 sessions
         📄 session-1234567890-abc123
            ├─ id: "session-1234567890-abc123"
            ├─ pdfName: "calculus-chapter3.pdf"
            ├─ masteryScore: 75
            ├─ confusionType: "missing_foundation"
            ├─ completedSteps: 5
            └─ ... (more fields)
      📁 goals
         📄 goal-1234567890-xyz789
            ├─ name: "Weekly Study Sessions"
            ├─ type: "sessions"
            ├─ target: 5
            └─ ... (more fields)
```

#### Firestore Console Features

| Feature | How to Use |
|---------|-----------|
| **View document** | Click on any document to see all fields |
| **Edit document** | Click on a field value to edit |
| **Delete document** | Click "⋮" → "Delete document" |
| **Add document** | Click "Add document" button |
| **Filter** | Use the filter bar above the document list |
| **Query** | Click "Query builder" for complex queries |

### Method 2: Firebase CLI

#### Install Firebase CLI

```bash
npm install -g firebase-tools
firebase login
```

#### View Data via CLI

```bash
# List all collections
firebase firestore:indexes

# Export data
firebase firestore:export ./backup

# Use emulator for local testing
firebase emulators:start
```

### Method 3: In-App Admin View

You can create an admin page in your app to view data. Add this component:

```jsx
// src/pages/AdminPage.jsx (for development only)
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuthStore } from '../store/useAuthStore';

export default function AdminPage() {
  const [sessions, setSessions] = useState([]);
  const [goals, setGoals] = useState([]);
  const user = useAuthStore(state => state.user);

  useEffect(() => {
    if (!user) return;
    
    const fetchData = async () => {
      // Fetch sessions
      const sessionsRef = collection(db, 'users', user.uid, 'sessions');
      const sessionsSnap = await getDocs(sessionsRef);
      setSessions(sessionsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      
      // Fetch goals
      const goalsRef = collection(db, 'users', user.uid, 'goals');
      const goalsSnap = await getDocs(goalsRef);
      setGoals(goalsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    
    fetchData();
  }, [user]);

  return (
    <div className="p-8">
      <h1>Firebase Data Viewer</h1>
      
      <h2>Sessions ({sessions.length})</h2>
      <pre>{JSON.stringify(sessions, null, 2)}</pre>
      
      <h2>Goals ({goals.length})</h2>
      <pre>{JSON.stringify(goals, null, 2)}</pre>
    </div>
  );
}
```

### Understanding Your Data

#### Session Document Example

```json
{
  "id": "1732876543210-abc123xy",
  "timestamp": "2024-11-29T10:15:43.210Z",
  "pdfName": "Introduction_to_Calculus.pdf",
  "selectedText": "The derivative of a function measures the rate at which...",
  "fullSelectedText": "The derivative of a function measures the rate at which the function's output changes as its input changes. Formally, the derivative of f at point a is defined as the limit...",
  "confusionType": "missing_foundation",
  "masteryScore": 68,
  "timeSpent": 23,
  "totalSteps": 5,
  "completedSteps": 5,
  "analysisComplete": true,
  "diagnosticSummary": "You understand the intuitive concept of derivatives but lack formal foundation in limits...",
  "overallAccuracy": 0.68,
  "overallConfidence": 0.72,
  "questionResponses": [
    {
      "question": "In your own words, what is a derivative?",
      "answer": "It measures how fast something changes",
      "level": 1,
      "type": "Vocabulary/Definition"
    }
    // ... 4 more
  ],
  "levelScores": [
    { "level": 1, "accuracy": 0.85, "confidence": 0.9 },
    { "level": 2, "accuracy": 0.75, "confidence": 0.8 },
    { "level": 3, "accuracy": 0.45, "confidence": 0.5 },
    { "level": 4, "accuracy": 0.70, "confidence": 0.75 },
    { "level": 5, "accuracy": 0.65, "confidence": 0.7 }
  ],
  "specificGaps": ["formal limit definition", "epsilon-delta", "h→0 notation"],
  "mindMapData": {
    "nodes": [
      { "id": "functions", "label": "Functions", "type": "foundation" },
      { "id": "limits", "label": "Limits", "type": "prerequisite" },
      { "id": "derivatives", "label": "Derivatives", "type": "target" }
    ],
    "edges": [
      { "source": "functions", "target": "limits" },
      { "source": "limits", "target": "derivatives" }
    ]
  },
  "repairPathData": [
    {
      "stepNumber": 1,
      "conceptName": "Understanding Functions",
      "explanation": "A function is a relationship between inputs and outputs...",
      "examples": [{ "title": "Example", "content": "f(x) = 2x + 1" }],
      "practiceProblem": {
        "question": "What is f(3) if f(x) = 2x + 1?",
        "options": ["A) 5", "B) 6", "C) 7", "D) 8"],
        "correctAnswer": "C) 7",
        "explanation": "f(3) = 2(3) + 1 = 7"
      }
    }
    // ... more steps
  ]
}
```

#### Goal Document Example

```json
{
  "id": "goal-1732876543210-xyz789",
  "name": "Weekly Study Sessions",
  "type": "sessions",
  "target": 5,
  "period": "weekly",
  "startDate": "2024-11-25T00:00:00.000Z",
  "isActive": true,
  "reminderEnabled": true,
  "reminderTime": "09:00",
  "createdAt": "2024-11-25T14:30:00.000Z",
  "updatedAt": "2024-11-29T10:15:43.210Z"
}
```

---

## 🔧 Troubleshooting

### Deployment Issues

| Issue | Solution |
|-------|----------|
| **Build fails on Vercel** | Check Node version (needs 18+), run `npm run build` locally first |
| **API returns 500** | Check backend logs, verify GEMINI_API_KEY is set |
| **CORS errors** | Add your Vercel domain to backend CORS config |
| **Firebase auth fails** | Add Vercel domain to Firebase authorized domains |
| **Cold start timeout** | Upgrade to paid tier or use keep-alive pings |

### Firebase Issues

| Issue | Solution |
|-------|----------|
| **Permission denied** | Check Firestore rules, ensure user is authenticated |
| **Data not syncing** | Check network, verify Firebase config |
| **Quota exceeded** | Upgrade plan or optimize queries |

### Adding Vercel Domain to Firebase

1. Go to Firebase Console → Authentication → Settings
2. Click "Authorized domains"
3. Add your Vercel domain: `your-project.vercel.app`

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Render Documentation](https://render.com/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)

---

## 🎉 You're Done!

Your ConceptGuide application is now deployed and accessible worldwide!

**Your URLs:**
- Frontend: `https://your-project.vercel.app`
- Backend: `https://your-backend.up.railway.app`

Share your app and help students learn better! 🎓

---

<p align="center">
  Need help? Open an issue on GitHub!
</p>

