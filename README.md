# 🎯 ConceptGuide

> **An AI-Powered Learning Companion for Understanding Complex Concepts**

ConceptGuide is an intelligent, AI-powered educational platform that transforms how students learn from complex educational materials. Instead of passively reading, ConceptGuide actively **diagnoses learning gaps**, **visualizes concept relationships**, and **creates personalized learning paths** tailored to each student's specific needs.

![ConceptGuide Banner](./public/logo.png)

---

## 📋 Table of Contents

1. [The Challenge](#-the-challenge)
2. [Our Solution](#-our-solution)
3. [Key Features](#-key-features)
4. [Complete User Flow](#-complete-user-flow)
5. [Technology Stack](#-technology-stack)
6. [System Architecture](#-system-architecture)
7. [Project Structure](#-project-structure)
8. [File-by-File Documentation](#-file-by-file-documentation)
9. [Getting Started](#-getting-started)
10. [API Endpoints](#-api-endpoints)
11. [State Management](#-state-management)
12. [Testing](#-testing)
13. [Firebase Setup](#-firebase-setup)
14. [Contributing](#-contributing)
15. [License](#-license)
16. [Acknowledgments](#-acknowledgments)

---

## 🔍 The Challenge

Students learning from textbooks, research papers, and educational PDFs face several critical challenges:

| Challenge | Description |
|-----------|-------------|
| **Passive Learning** | Traditional reading is passive; students don't know if they truly understand until they're tested |
| **Hidden Confusion** | Students often don't realize they're confused until they fail an exam or assignment |
| **Prerequisite Gaps** | Complex concepts build on foundations. If a student misses a prerequisite, everything after becomes incomprehensible |
| **One-Size-Fits-All** | Educational materials assume all students have the same background knowledge |
| **Isolated Concepts** | Students struggle to see how concepts relate to each other and build upon one another |

---

## 💡 Our Solution

ConceptGuide solves these problems through a **5-stage diagnostic and personalized learning system**:

### Stage 1: Intelligent Confusion Detection
Students highlight text they find confusing, triggering an AI-powered diagnostic process.

### Stage 2: 5-Level Diagnostic Questioning
The system asks 5 targeted questions to pinpoint the exact nature of the confusion:
- **Level 1**: Vocabulary/Definition
- **Level 2**: Purpose/Motivation
- **Level 3**: Foundation/Prerequisites
- **Level 4**: Misconception Check
- **Level 5**: Application/Real-world

### Stage 3: AI-Powered Analysis
Google's Gemini AI analyzes student responses to:
- Identify specific knowledge gaps
- Calculate mastery scores per question
- Determine confusion type (vocabulary, foundation, misconception, etc.)
- Extract keywords and missing concepts

### Stage 4: Visual Concept Mapping
An interactive mind map is generated, visualizing:
- All related concepts
- Prerequisite dependencies
- Recommended learning path
- Concept importance levels

### Stage 5: Personalized Learning Path
A step-by-step learning experience covering:
- Explanations for each concept
- Real-world examples
- Practice problems with solutions
- Progress tracking

---

## ✨ Key Features

### 📄 PDF Processing
- Upload any PDF document
- Automatic text extraction using PDF.js
- AI-powered text cleaning and organization with headings
- Highlight-to-select interaction

### 🧠 AI-Powered Diagnostics
- 5-level diagnostic questioning system
- Real-time response analysis
- Accuracy and confidence scoring per question
- Keyword matching and gap identification

### 🗺️ Interactive Concept Maps
- Visual dependency graphs using ReactFlow
- Color-coded nodes by importance
- Prerequisite relationship visualization
- Recommended learning path highlighting

### 🎓 Personalized Learning Paths
- Step-by-step concept cards
- Explanations with examples
- Mandatory practice problems
- Progress tracking and persistence

### 🎤 Voice-to-Text Input
- Browser-based speech recognition
- Real-time transcription
- Multi-language support

### 📊 Progress Tracking & History
- Session history with Firebase persistence
- Analytics dashboard
- Confusion type breakdown
- Study streak tracking

### 🎯 Study Goals & Reminders
- Set weekly/daily/monthly goals
- Track sessions, time, mastery, streaks
- In-app reminder notifications
- Progress visualization

### 🔐 Authentication
- Firebase Authentication
- Email/password sign up and sign in
- Cross-device data sync
- Secure session management

---

## 🎮 Complete User Flow

### Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           USER FLOW DIAGRAM                                  │
└─────────────────────────────────────────────────────────────────────────────┘

    ┌──────────┐     ┌──────────┐     ┌──────────────┐     ┌─────────────┐
    │  Upload  │────▶│  Read &  │────▶│  "I'm        │────▶│  Answer 5   │
    │   PDF    │     │  Select  │     │  Confused"   │     │  Questions  │
    └──────────┘     └──────────┘     └──────────────┘     └─────────────┘
                                                                   │
                                                                   ▼
    ┌──────────┐     ┌──────────┐     ┌──────────────┐     ┌─────────────┐
    │  Study   │◀────│  Mind    │◀────│  Analysis    │◀────│   Submit    │
    │  Path    │     │   Map    │     │   Results    │     │   Answers   │
    └──────────┘     └──────────┘     └──────────────┘     └─────────────┘
         │
         ▼
    ┌──────────┐     ┌──────────┐     ┌──────────────┐
    │Complete  │────▶│ Session  │────▶│  History &   │
    │  Path    │     │  Saved   │     │  Analytics   │
    └──────────┘     └──────────┘     └──────────────┘
```

### Step-by-Step User Journey

#### 1. **Landing Page**
- User sees the ConceptGuide home page
- Option to sign in/sign up or continue as guest
- Navigation to History, Goals, Analytics

#### 2. **PDF Upload**
```
User Action: Drag & drop or click to upload PDF
System Response: 
  - Extract text using PDF.js
  - Send to Gemini AI for organization
  - Display formatted content with headings
```

#### 3. **Text Selection**
```
User Action: Highlight confusing text in the PDF content
System Response:
  - Show "I'm confused about this" button
  - Capture selected text and surrounding context
```

#### 4. **Diagnostic Questions**
```
User Action: Click confusion button
System Response:
  - Generate 5 diagnostic questions via Gemini AI
  - Present questions one at a time
  - Allow text or voice input for answers
```

#### 5. **Analysis Results Page**
```
System displays:
  ┌────────────────────────────────────────────┐
  │  📊 Overall Analysis                       │
  │  ├─ Overall Accuracy: 65%                  │
  │  ├─ Overall Confidence: 72%                │
  │  └─ Confusion Type: Missing Foundation     │
  ├────────────────────────────────────────────┤
  │  📝 Per-Question Breakdown                 │
  │  ├─ Q1: Vocabulary (85% accuracy)          │
  │  ├─ Q2: Purpose (70% accuracy)             │
  │  ├─ Q3: Foundation (45% accuracy) ⚠️       │
  │  ├─ Q4: Misconception (60% accuracy)       │
  │  └─ Q5: Application (65% accuracy)         │
  ├────────────────────────────────────────────┤
  │  🔑 Missing Keywords                       │
  │  └─ limits, derivative definition, h→0     │
  ├────────────────────────────────────────────┤
  │  [View Mind Map →]                         │
  └────────────────────────────────────────────┘
```

#### 6. **Mind Map Page**
```
Interactive concept map showing:
  ┌─────────────────────────────────────────────┐
  │                                             │
  │     [Functions]                             │
  │         │                                   │
  │         ▼                                   │
  │     [Limits] ──────▶ [Continuity]          │
  │         │                                   │
  │         ▼                                   │
  │    [Derivatives] ◀── Target Concept        │
  │         │                                   │
  │         ▼                                   │
  │   [Applications]                            │
  │                                             │
  │  [← Back] [Continue to Learning Path →]    │
  └─────────────────────────────────────────────┘
```

#### 7. **Learning Path**
```
Step-by-step learning cards:
  ┌─────────────────────────────────────────────┐
  │  Step 1 of 5: Understanding Functions       │
  │  ━━━━━━━━━━━━━━━━━━━━ 20%                   │
  ├─────────────────────────────────────────────┤
  │  🎯 Why This Step Matters                   │
  │  You mentioned 'function' but didn't        │
  │  explain what it means mathematically...    │
  ├─────────────────────────────────────────────┤
  │  💡 Explanation                             │
  │  A function is like a machine...            │
  ├─────────────────────────────────────────────┤
  │  📝 Examples                                │
  │  • f(x) = 2x + 1                            │
  │  • g(x) = x²                                │
  ├─────────────────────────────────────────────┤
  │  ✏️ Practice Problem                        │
  │  Q: If f(x) = 3x - 2, what is f(4)?        │
  │  [A) 10] [B) 12] [C) 14] [D) 16]           │
  │                                             │
  │  [Show Solution]                            │
  ├─────────────────────────────────────────────┤
  │  [Mark Complete & Continue →]               │
  └─────────────────────────────────────────────┘
```

#### 8. **Completion**
```
  ┌─────────────────────────────────────────────┐
  │                                             │
  │              🎉 Congratulations!            │
  │                                             │
  │    You've completed the learning path!      │
  │                                             │
  │    Session saved to history                 │
  │                                             │
  │    [Return to Home] [View History]          │
  │                                             │
  └─────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

### Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2.0 | UI framework with component architecture |
| **Vite** | 7.2.2 | Fast build tool and development server |
| **Tailwind CSS** | 3.4.18 | Utility-first CSS framework |
| **Zustand** | 5.0.8 | Lightweight state management |
| **ReactFlow** | 11.11.4 | Interactive graph visualization |
| **React Router** | 7.9.6 | Client-side routing |
| **pdfjs-dist** | 5.4.394 | PDF rendering and text extraction |
| **Firebase** | 12.6.0 | Authentication and Firestore database |

### Backend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18+ | JavaScript runtime environment |
| **Express** | 5.1.0 | Web server framework |
| **@google/generative-ai** | 0.24.1 | Gemini AI model integration |
| **CORS** | 2.8.5 | Cross-origin resource sharing |
| **dotenv** | 17.2.3 | Environment variable management |

### Testing Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Vitest** | 2.1.8 | Test runner |
| **@testing-library/react** | 16.1.0 | React component testing |
| **@testing-library/jest-dom** | 6.6.3 | Custom DOM matchers |
| **jsdom** | 25.0.1 | Browser environment simulation |

---

## 🏛️ System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              SYSTEM ARCHITECTURE                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                            Frontend (React + Vite)                          │
│                                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │   Pages     │  │ Components  │  │   Stores    │  │  Services   │       │
│  │             │  │             │  │  (Zustand)  │  │             │       │
│  │ • Home      │  │ • PDFViewer │  │             │  │ • history   │       │
│  │ • History   │  │ • QuestionM │  │ • AppStore  │  │ • goals     │       │
│  │ • Goals     │  │ • MindMap   │  │ • AuthStore │  │ • analytics │       │
│  │ • Analytics │  │ • Learning  │  │ • GoalsStore│  │             │       │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘       │
│                                                                             │
│                              React Router                                   │
└────────────────────────────────────┬────────────────────────────────────────┘
                                     │
                                     │ HTTP/REST
                                     │
┌────────────────────────────────────▼────────────────────────────────────────┐
│                         Backend (Express.js)                                │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                          API Endpoints                               │   │
│  │                                                                       │   │
│  │  POST /api/generate-questions    - Generate diagnostic questions     │   │
│  │  POST /api/clean-pdf-content     - Clean and organize PDF text       │   │
│  │  POST /api/generate-insights     - Generate learning insights        │   │
│  │  POST /api/analyze-and-generate-path - Full analysis pipeline       │   │
│  │                                                                       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                     │                                       │
└─────────────────────────────────────┼───────────────────────────────────────┘
                                      │
            ┌─────────────────────────┼─────────────────────────┐
            │                         │                         │
            ▼                         ▼                         ▼
   ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
   │   Gemini AI     │    │    Firebase     │    │     PDF.js      │
   │                 │    │                 │    │                 │
   │ • Question Gen  │    │ • Auth          │    │ • Text Extract  │
   │ • Response      │    │ • Firestore     │    │ • Page Render   │
   │   Analysis      │    │ • User Data     │    │                 │
   │ • Mind Map Gen  │    │ • Sessions      │    │ (Client-side)   │
   │ • Path Gen      │    │ • Goals         │    │                 │
   └─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              DATA FLOW                                       │
└─────────────────────────────────────────────────────────────────────────────┘

User uploads PDF
       │
       ▼
┌──────────────┐    PDF.js extracts text    ┌──────────────┐
│   PDF File   │ ─────────────────────────▶ │  Raw Text    │
└──────────────┘                            └──────────────┘
                                                   │
                                                   ▼
                                            ┌──────────────┐
                               Gemini AI    │  Formatted   │
                               organizes    │    Text      │
                                            └──────────────┘
                                                   │
User selects text                                  │
       │                                           │
       ▼                                           ▼
┌──────────────┐                            ┌──────────────┐
│Selected Text │ ────────────────────────▶  │  Question    │
│  + Context   │      Gemini generates      │   Modal      │
└──────────────┘                            └──────────────┘
                                                   │
User answers questions                             │
       │                                           │
       ▼                                           ▼
┌──────────────┐                            ┌──────────────┐
│   Q&A Pairs  │ ────────────────────────▶  │  Analysis    │
└──────────────┘      Gemini analyzes       │   Result     │
                                            └──────────────┘
                                                   │
                                    ┌──────────────┼──────────────┐
                                    │              │              │
                                    ▼              ▼              ▼
                             ┌──────────┐  ┌──────────┐  ┌──────────┐
                             │ Mind Map │  │  Repair  │  │ Diagnos- │
                             │   Data   │  │   Path   │  │   tic    │
                             └──────────┘  └──────────┘  └──────────┘
                                    │              │              │
                                    └──────────────┼──────────────┘
                                                   │
                                                   ▼
                                            ┌──────────────┐
                                            │   Firebase   │
                                            │   Storage    │
                                            └──────────────┘
```

---

## 📁 Project Structure

```
ConceptGuide/
├── 📁 public/
│   └── logo.png                    # Application logo
├── 📁 src/
│   ├── 📁 assets/
│   │   └── react.svg               # React logo asset
│   ├── 📁 components/              # React components (25 files)
│   ├── 📁 firebase/
│   │   └── config.js               # Firebase configuration
│   ├── 📁 pages/                   # Page components (3 files)
│   ├── 📁 services/                # Business logic services (3 files)
│   ├── 📁 store/                   # Zustand stores (3 files)
│   ├── 📁 tests/                   # Test suites
│   │   ├── 📁 components/          # Component tests
│   │   ├── 📁 integration/         # Integration tests
│   │   ├── 📁 services/            # Service tests
│   │   ├── 📁 store/               # Store tests
│   │   ├── 📁 utils/               # Test utilities
│   │   └── setup.js                # Test configuration
│   ├── 📁 utils/
│   │   └── analyzeHistory.js       # History analysis utilities
│   ├── App.jsx                     # Main application component
│   ├── index.css                   # Global styles
│   └── main.jsx                    # Application entry point
├── .env                            # Environment variables (create this)
├── .gitignore                      # Git ignore rules
├── eslint.config.js                # ESLint configuration
├── index.html                      # HTML entry point
├── package.json                    # Dependencies and scripts
├── postcss.config.js               # PostCSS configuration
├── README.md                       # This file
├── server.js                       # Express backend server
├── tailwind.config.js              # Tailwind CSS configuration
├── TESTING.md                      # Testing documentation
├── vite.config.js                  # Vite configuration
└── vitest.config.js                # Vitest configuration
```

---

## 📄 File-by-File Documentation

### Root Files

| File | Description |
|------|-------------|
| `server.js` | Express.js backend server with 4 API endpoints for Gemini AI integration. Handles question generation, PDF cleaning, insights generation, and full analysis pipeline. |
| `package.json` | Project configuration with dependencies, scripts, and metadata. |
| `vite.config.js` | Vite build tool configuration for development and production. |
| `vitest.config.js` | Vitest test runner configuration with jsdom environment. |
| `tailwind.config.js` | Tailwind CSS customization and theme configuration. |
| `index.html` | HTML template with viewport settings and root element. |

### Entry Points (`src/`)

| File | Description |
|------|-------------|
| `main.jsx` | Application entry point. Initializes React with BrowserRouter for routing. Sets up Firebase auth state listener. |
| `App.jsx` | Root component defining routes: `/` (Home), `/history`, `/goals`, `/analytics`. Syncs sessions and goals from Firebase on user login. |
| `index.css` | Global CSS with Tailwind directives and custom component styles. Defines `.btn-primary`, `.btn-secondary`, gradient borders, window controls. |

### Components (`src/components/`)

#### Layout Components

| Component | Lines | Description |
|-----------|-------|-------------|
| `Layout.jsx` | ~200 | Main application layout with responsive design. Renders LeftSidebar, CenterColumn, RightSidebar on desktop; stacked on mobile. Manages column visibility states. |
| `TopNavBar.jsx` | ~165 | Top navigation bar with logo, ConceptGuide name, Home, History, Goals, Analytics links, and Sign In/Logout button. |
| `LeftSidebar.jsx` | ~50 | Left sidebar container for PDF upload component on desktop. |
| `CenterColumn.jsx` | ~150 | Main content area displaying PDF viewer when document loaded, or upload prompt otherwise. Renders ConfusionButton when text selected. |
| `RightSidebar.jsx` | ~100 | Right sidebar showing HistoryPanel on desktop. |

#### PDF Components

| Component | Lines | Description |
|-----------|-------|-------------|
| `PDFUpload.jsx` | ~180 | Drag-and-drop PDF upload with file selection. Uses PDF.js for text extraction. Sends to Gemini for cleaning/organization. Stores in Zustand. |
| `PDFViewer.jsx` | ~250 | Displays formatted PDF content with markdown rendering. Handles text selection. Updates Zustand with selected text and surrounding context. |

#### Diagnostic Components

| Component | Lines | Description |
|-----------|-------|-------------|
| `ConfusionButton.jsx` | ~80 | Floating button that appears when text is selected. Positioned near selection. Triggers QuestionModal on click. |
| `QuestionModal.jsx` | ~310 | Modal displaying 5 diagnostic questions. Shows one question at a time with progress indicator. Supports text and voice input. Submits Q&A pairs to store. |
| `VoiceRecorder.jsx` | ~120 | Browser-based speech recognition component. Uses Web Speech API. Shows recording status and transcription. |

#### Analysis Components

| Component | Lines | Description |
|-----------|-------|-------------|
| `Person2Integration.jsx` | ~70 | Bridge component connecting Q&A data to LearningExperience. Creates session in history store. Manages session ID. |
| `LearningExperience.jsx` | ~480 | Main orchestrator for post-analysis flow. Fetches analysis from API. Manages view states: results → mindmap → path → congratulations. Persists progress. |
| `AnalysisResultsPage.jsx` | ~100 | Displays diagnostic summary with overall accuracy, confidence, per-question breakdown, keywords, confusion type. Has "View Mind Map" button. |
| `DiagnosticSummary.jsx` | ~200 | Reusable summary component showing accuracy meters, level scores, gap identification, confusion type analysis. |

#### Mind Map Components

| Component | Lines | Description |
|-----------|-------|-------------|
| `MindMapPage.jsx` | ~80 | Full-page mind map display with back button and "Continue to Learning Path" button. |
| `DependencyGraph.jsx` | ~300 | Interactive concept map using ReactFlow. Renders nodes as concept cards with labels, descriptions, time estimates. Draws edges with strength indicators. |

#### Learning Path Components

| Component | Lines | Description |
|-----------|-------|-------------|
| `RepairPath.jsx` | ~120 | Learning path container with progress bar and step indicators. Manages current step state. Handles navigation and completion. |
| `LearningCard.jsx` | ~210 | Individual learning step card. Shows "Why This Step", explanation, examples, practice problem with MCQ. Blocks progression until solution viewed. |
| `Congratulations.jsx` | ~80 | Completion celebration component with confetti animation. Shows session summary and navigation options. |

#### History & Analytics Components

| Component | Lines | Description |
|-----------|-------|-------------|
| `HistoryPanel.jsx` | ~300 | Session history list with search, sort, filter. Shows session cards with PDF name, confusion type, mastery score, time spent. Review and delete actions. |
| `InsightsPanel.jsx` | ~105 | AI-generated insights panel (currently not prominently displayed). Shows personalized learning suggestions. |

#### Goals Components

| Component | Lines | Description |
|-----------|-------|-------------|
| `GoalCard.jsx` | ~180 | Individual goal display with progress bar, status badge, days remaining, action buttons for pause/resume/delete. |
| `CreateGoalModal.jsx` | ~295 | Multi-step goal creation wizard. Step 1: presets or custom. Step 2: goal type. Step 3: name, target, period, reminders. |
| `NotificationToast.jsx` | ~100 | In-app notification system for goal reminders. Shows warning/urgent/success states. Dismissible with animation. |

#### Authentication Components

| Component | Lines | Description |
|-----------|-------|-------------|
| `AuthModal.jsx` | ~200 | Sign in/Sign up modal with email/password. Firebase authentication integration. Error handling and loading states. |

### Pages (`src/pages/`)

| Page | Lines | Description |
|------|-------|-------------|
| `HistoryPage.jsx` | ~80 | Full-page history view with TopNavBar. Wraps HistoryPanel component. Back button when in learning session. |
| `GoalsPage.jsx` | ~225 | Goal management page. Shows overall stats, goal grid, quick tips. Create goal button opens modal. Calculates progress from sessions. |
| `AnalyticsPage.jsx` | ~250 | Learning analytics dashboard. Shows total sessions, steps, time, avg mastery. Study streak. Confusion type breakdown chart. |

### Services (`src/services/`)

| Service | Lines | Description |
|---------|-------|-------------|
| `historyService.js` | ~50 | Firebase Firestore CRUD for sessions. Functions: `saveSessionToFirebase`, `fetchUserSessions`, `deleteSessionFromFirebase`, `updateSessionInFirebase`. |
| `goalsService.js` | ~250 | Goal management service. CRUD operations. Progress calculation with period handling. Reminder logic with urgency levels. Streak calculation. |
| `customAnalytics.js` | ~150 | Client-side analytics calculations. Common confusion types, mastery averages, weak/strong areas, study time totals, trend detection. |

### Stores (`src/store/`)

| Store | Lines | Description |
|-------|-------|-------------|
| `useAppStore.js` | ~455 | Main application state. PDF data, selection state, question state, session management, history with full CRUD. Firebase sync. |
| `useAuthStore.js` | ~60 | Authentication state. User object, loading state. Sign in, sign up, sign out actions. Auth state listener setup. |
| `useGoalsStore.js` | ~180 | Goals state management. Goals array, reminders, loading state. CRUD with optimistic updates. Progress calculation. |

### Firebase (`src/firebase/`)

| File | Description |
|------|-------------|
| `config.js` | Firebase initialization with environment variables. Exports `app`, `auth`, `db` instances. |

### Tests (`src/tests/`)

| Directory/File | Description |
|----------------|-------------|
| `setup.js` | Global test configuration. Mocks for matchMedia, IntersectionObserver, ResizeObserver, fetch, Firebase. |
| `utils/testUtils.jsx` | Helper functions: `renderWithProviders`, `createMockSession`, `createMockGoal`, `createMockAnalysisResult`. |
| `services/goalsService.test.js` | Unit tests for goal progress calculation, reminder logic. 15 test cases. |
| `store/useAppStore.test.js` | App store tests for state management, history CRUD. 20 test cases. |
| `store/useGoalsStore.test.js` | Goals store tests for CRUD, progress, reminders. 8 test cases. |
| `components/GoalCard.test.jsx` | GoalCard rendering and interaction tests. |
| `components/LearningCard.test.jsx` | LearningCard component tests. 15 test cases. |
| `components/NotificationToast.test.jsx` | Notification component tests. 9 test cases. |
| `integration/learningFlow.test.jsx` | End-to-end learning path flow tests. 10 test cases. |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** or **yarn**
- **Git**
- **Google Account** (for Gemini API key)

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ConceptGuide.git
cd ConceptGuide
```

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Required: Google Gemini API Key
GEMINI_API_KEY=your_google_ai_api_key_here

# Optional: Server Port (defaults to 3001)
PORT=3001

# Firebase Configuration (for auth & persistence)
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

**Get a Google AI API Key:**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the key to your `.env` file

#### 4. Start the Servers

**Terminal 1: Backend Server**
```bash
npm run server
```
The backend will start on `http://localhost:3001`

**Terminal 2: Frontend Development Server**
```bash
npm run dev
```
The frontend will be available at `http://localhost:5173`

#### 5. Access the Application

Open your browser and navigate to `http://localhost:5173`

---

## 🔌 API Endpoints

### POST `/api/generate-questions`

Generates 5 diagnostic questions based on selected text.

**Request:**
```json
{
  "selectedText": "The derivative measures the rate of change...",
  "context": "Chapter 3: Calculus Fundamentals..."
}
```

**Response:**
```json
{
  "questions": [
    {
      "level": 1,
      "type": "Vocabulary/Definition",
      "question": "In your own words, what does 'derivative' mean?",
      "expectedKeywords": ["rate", "change", "slope"]
    },
    // ... 4 more questions
  ]
}
```

### POST `/api/clean-pdf-content`

Cleans and organizes raw PDF text with headings.

**Request:**
```json
{
  "rawText": "Page 1 Header... actual content... footer..."
}
```

**Response:**
```json
{
  "cleanedText": "## Introduction\n\nActual content organized with headings..."
}
```

### POST `/api/generate-insights`

Generates personalized learning insights from session history.

**Request:**
```json
{
  "sessions": [
    { "confusionType": "vocabulary", "masteryScore": 75, "timeSpent": 15 },
    // ... more sessions
  ]
}
```

**Response:**
```json
{
  "insights": [
    "📊 You've completed 5 sessions this week!",
    "💡 Focus on foundation concepts to improve faster."
  ]
}
```

### POST `/api/analyze-and-generate-path`

Full analysis pipeline: analyzes responses, generates mind map, creates repair path.

**Request:**
```json
{
  "selectedText": "The concept of limits...",
  "qaPairs": [
    { "question": "What is a limit?", "answer": "When x gets close to a number", "level": 1 }
  ]
}
```

**Response:**
```json
{
  "overallAccuracy": 0.65,
  "overallConfidence": 0.72,
  "confusionType": "missing_foundation",
  "levelScores": [...],
  "specificGaps": ["formal definition", "epsilon-delta"],
  "diagnosticSummary": "You understand the intuition but lack formal foundation...",
  "mindMap": {
    "nodes": [...],
    "edges": [...],
    "recommendedPath": ["functions", "limits", "derivatives"]
  },
  "repairPath": [
    {
      "stepNumber": 1,
      "conceptName": "Functions",
      "explanation": "...",
      "examples": [...],
      "practiceProblem": { "question": "...", "options": [...], "correctAnswer": "..." }
    }
  ]
}
```

---

## 🗃️ State Management

### useAppStore (Main Application State)

```javascript
{
  // PDF State
  fullText: string,
  pageTexts: string[],
  pageCount: number,
  fileName: string,
  pdfFile: File | null,
  pdfDocument: PDFDocument | null,

  // Selection State
  selectedText: string,
  surroundingContext: string,
  showConfusionButton: boolean,
  confusionButtonPosition: { x: number, y: number },

  // Question State
  questions: Question[],
  currentQuestionIndex: number,
  answers: string[],
  showQuestionModal: boolean,
  qaData: QAData | null,

  // Session State
  currentSessionId: string | null,
  reviewMode: boolean,
  reviewAnalysis: AnalysisResult | null,

  // History
  history: {
    sessions: Session[],
    addSession: (data) => string,
    getSessionById: (id) => Session,
    deleteSession: (id) => void,
    updateSessionProgress: (id, steps, time, updates) => void,
    getAllSessions: () => Session[]
  }
}
```

### useAuthStore (Authentication State)

```javascript
{
  user: User | null,
  loading: boolean,
  signIn: (email, password) => Promise<Result>,
  signUp: (email, password) => Promise<Result>,
  signOut: () => Promise<Result>
}
```

### useGoalsStore (Goals State)

```javascript
{
  goals: Goal[],
  activeReminders: Reminder[],
  isLoading: boolean,
  error: string | null,
  
  fetchGoals: () => Promise<Goal[]>,
  addGoal: (data) => Promise<Goal>,
  updateGoal: (id, updates) => Promise<void>,
  removeGoal: (id) => Promise<void>,
  toggleGoalActive: (id) => Promise<void>,
  checkReminders: (sessions) => Reminder[],
  dismissReminder: (goalId) => void
}
```

---

## 🧪 Testing

### Running Tests

```bash
# Watch mode (development)
npm test

# Single run (CI/CD)
npm run test:run

# Interactive UI
npm run test:ui

# Coverage report
npm run test:coverage
```

### Test Coverage

| Category | Files | Tests |
|----------|-------|-------|
| Services | 1 | 15 |
| Stores | 2 | 28 |
| Components | 3 | 24+ |
| Integration | 1 | 10 |
| **Total** | **7** | **77+** |

See `TESTING.md` for comprehensive testing documentation.

---

## 🔥 Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Follow setup wizard

### 2. Enable Authentication

1. Go to Authentication → Sign-in method
2. Enable Email/Password

### 3. Create Firestore Database

1. Go to Firestore Database
2. Click "Create database"
3. Start in production mode
4. Choose location

### 4. Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 5. Get Configuration

1. Go to Project Settings → General
2. Scroll to "Your apps" → Web app
3. Copy config values to `.env`

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow existing code style
- Add tests for new features
- Update documentation as needed
- Keep commits atomic and well-described

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **CSGirlies Hackathon** for inspiring this project
- **Google Generative AI (Gemini)** for intelligent analysis and generation
- **ReactFlow** for beautiful graph visualizations
- **PDF.js** for client-side PDF processing
- **Firebase** for authentication and data persistence
- **The open-source community** for excellent tools and libraries

---

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-username/ConceptGuide/issues) page
2. Create a new issue with detailed description
3. Include steps to reproduce, expected behavior, and actual behavior

---

<p align="center">
  Made with ❤️ by the ConceptGuide Team
</p>
