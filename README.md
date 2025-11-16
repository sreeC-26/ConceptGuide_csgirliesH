# ConceptGuide

**An AI-Powered Learning Companion for Understanding Complex Concepts**

ConceptGuide is an intelligent educational platform that helps students understand confusing concepts from PDF documents through personalized diagnostic questioning and adaptive learning paths. The application uses AI to analyze student responses, generate concept dependency maps, and create customized learning experiences.

## 🎯 What is ConceptGuide?

ConceptGuide is a web-based learning tool designed to help students overcome confusion when reading educational materials. Instead of simply providing answers, ConceptGuide:

1. **Identifies Confusion**: Students highlight text they find confusing in a PDF
2. **Diagnoses Understanding**: Asks 5 targeted questions across different cognitive levels (Vocabulary, Motivation, Foundation, Misconception, Application)
3. **Visualizes Dependencies**: Creates an interactive mind map showing concept relationships and prerequisites
4. **Personalizes Learning**: Generates a step-by-step learning path tailored to the student's specific gaps
5. **Guides Progress**: Provides interactive learning cards with explanations, examples, and practice problems

## 👥 Who Can Use ConceptGuide?

### Primary Users:
- **Students** learning from textbooks, research papers, or educational PDFs
- **Self-learners** studying independently who need structured guidance
- **Educators** who want to understand student comprehension gaps

### Ideal For:
- Complex technical subjects (mathematics, computer science, engineering)
- Abstract concepts that require foundational understanding
- Topics where prerequisite knowledge is critical
- Students who struggle with self-assessment

## ✨ Key Features

### 📄 PDF Processing
- Upload PDF documents via drag-and-drop or file selection
- Automatic text extraction and organization
- Clean, structured content display with headings and formatting
- Text selection and highlighting capabilities

### ❓ Intelligent Question Generation
- 5-level diagnostic question structure:
  - **Level 1**: Vocabulary/Definition (surface clarity)
  - **Level 2**: Purpose/Motivation (contextual understanding)
  - **Level 3**: Foundation Check (prerequisites)
  - **Level 4**: Mental Model Audit (misconceptions)
  - **Level 5**: Application Bridge (real-world connection)
- Conversational, beginner-friendly questions (under 20 words each)
- AI-generated based on selected text and full document context

### 🗺️ Concept Dependency Mapping
- Interactive mind map visualization using ReactFlow
- Color-coded nodes by depth:
  - **Green** (#27C93F): Foundation concepts (Depth 0)
  - **Pink** (#FF4081): Intermediate concepts (Depth 1)
  - **Yellow** (#FFBD2E): Advanced concepts (Depth 2)
  - **Red** (#FF5F56): Target concepts (Depth 3)
  - **Purple** (#9B59B6): Advanced topics (Depth 4+)
- Shows critical and helpful relationships between concepts
- Recommended learning path visualization

### 🎓 Personalized Learning Path
- **Comprehensive Coverage**: Learning path includes steps for EVERY node from the mind map, not just the recommended path
- Step-by-step learning cards ordered by depth and importance
- Each card includes:
  - **Why This Step Matters**: Personalization explanation
  - **Concept Explanation**: Clear, structured content
  - **Examples**: Real-world applications
  - **Practice Problems**: Interactive multiple-choice questions (must be solved before proceeding)
  - **Progress Tracking**: Visual progress bar and step indicators
- Answers persist across navigation (Previous/Next buttons)
- Users cannot mark a step complete until they solve the practice problem
- Completion celebration and automatic return to home

### 🎨 Modern UI/UX
- Retro-terminal/hacker-girl theme with neon pink accents
- Dark mode optimized (#1A1A1A background)
- Gradient borders and window controls
- Responsive design
- Smooth animations and transitions

## 🛠️ Technology Stack

### Frontend
- **React 19** - Modern UI framework
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Zustand** - Lightweight state management
- **ReactFlow** - Interactive graph visualization
- **pdfjs-dist** - PDF rendering and text extraction
- **Firebase** - Authentication (optional)

### Backend
- **Node.js** - Runtime environment
- **Express** - Web server framework
- **Google Generative AI (Gemini 2.0 Flash)** - AI-powered analysis and generation
- **CORS** - Cross-origin resource sharing

## 📋 Prerequisites

Before setting up ConceptGuide, ensure you have:

- **Node.js** (v18 or higher) and npm installed
- A **Google AI API key** (get one from [Google AI Studio](https://makersuite.google.com/app/apikey))
- A modern web browser (Chrome, Firefox, Edge, Safari)
- Basic knowledge of terminal/command line

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd csgirlies
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- React and related libraries
- Express and backend dependencies
- PDF processing libraries
- ReactFlow for graph visualization
- Firebase SDK (for authentication)

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
GEMINI_API_KEY=your_google_ai_api_key_here
PORT=3001
```

**Getting a Google AI API Key:**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and paste it into your `.env` file

### 4. (Optional) Firebase Setup for Authentication

If you want to use authentication features:

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Email/Password authentication
3. Create a Firestore database
4. Add your Firebase config to `.env`:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

See `FIREBASE_SETUP.md` for detailed instructions.

### 5. Start the Development Servers

**Terminal 1 - Backend Server:**
```bash
npm run server
```

The backend will start on `http://localhost:3001`

**Terminal 2 - Frontend Development Server:**
```bash
npm run dev
```

The frontend will start on `http://localhost:5173` (or the port Vite assigns)

### 6. Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

## 📁 Project Structure

```
csgirlies/
├── src/
│   ├── components/
│   │   ├── Layout.jsx              # Main layout with sidebars
│   │   ├── TopNavBar.jsx           # Navigation bar
│   │   ├── LeftSidebar.jsx         # History sidebar (currently disabled)
│   │   ├── RightSidebar.jsx       # PDF content display
│   │   ├── CenterColumn.jsx        # Main content area
│   │   ├── PDFUpload.jsx           # PDF upload component
│   │   ├── PDFViewer.jsx           # PDF viewer with selection
│   │   ├── QuestionModal.jsx      # Question answering interface
│   │   ├── Person2Integration.jsx  # Integration point for learning experience
│   │   ├── LearningExperience.jsx  # Main learning flow controller
│   │   ├── DiagnosticSummary.jsx   # AI analysis summary
│   │   ├── DependencyGraph.jsx     # Interactive mind map
│   │   ├── RepairPath.jsx          # Learning path container
│   │   ├── LearningCard.jsx        # Individual learning step
│   │   ├── Congratulations.jsx     # Completion animation
│   │   ├── AuthModal.jsx           # Authentication modal
│   │   └── VoiceRecorder.jsx       # Voice input component
│   ├── store/
│   │   ├── useAppStore.js          # Main application state
│   │   └── useAuthStore.js         # Authentication state
│   ├── firebase/
│   │   └── config.js               # Firebase configuration
│   ├── assets/                     # Static assets
│   ├── App.jsx                     # Root component
│   ├── main.jsx                    # Entry point
│   └── index.css                   # Global styles
├── public/
│   └── logo.png                    # Application logo
├── server.js                       # Express backend server
├── package.json                    # Dependencies and scripts
├── vite.config.js                  # Vite configuration
├── tailwind.config.js              # Tailwind CSS configuration
├── postcss.config.js               # PostCSS configuration
├── .env                            # Environment variables (create this)
├── README.md                       # This file
├── FIREBASE_SETUP.md               # Firebase setup guide
└── TESTING_GUIDE.md                # Testing instructions
```

## 🔌 API Endpoints

### POST `/api/generate-questions`

Generates 5 diagnostic questions based on selected text.

**Request Body:**
```json
{
  "selectedText": "The confusing text from PDF",
  "surroundingContext": "Context around the selected text",
  "fullPdfText": "Complete PDF content"
}
```

**Response:**
```json
{
  "questions": [
    {
      "level": 1,
      "type": "Vocabulary",
      "question": "What does [concept] mean in your own words?",
      "expectedKeywords": ["keyword1", "keyword2", "keyword3"]
    },
    ...
  ]
}
```

### POST `/api/clean-pdf-content`

Cleans and organizes raw PDF text for better display.

**Request Body:**
```json
{
  "rawText": "Unformatted PDF text"
}
```

**Response:**
```json
{
  "cleanedText": "Organized text with headings and structure"
}
```

### POST `/api/analyze-and-generate-path`

Performs complete analysis and generates learning path. This is the main endpoint that:
1. Analyzes student responses
2. Generates concept dependency mind map
3. Creates personalized learning path

**Request Body:**
```json
{
  "selectedText": "Original confusing text",
  "qaPairs": [
    {
      "question": "Question text",
      "answer": "Student's answer"
    },
    ...
  ]
}
```

**Response:**
```json
{
  "analysis": {
    "confusionType": "vocabulary|foundation|misconception|application",
    "specificGaps": ["gap1", "gap2", ...],
    "prerequisiteConcepts": ["concept1", "concept2", ...]
  },
  "mindMap": {
    "nodes": [...],
    "edges": [...],
    "recommendedPath": ["nodeId1", "nodeId2", ...]
  },
  "repairPath": {
    "steps": [
      {
        "stepNumber": 1,
        "conceptName": "Concept name",
        "explanation": "...",
        "examples": [...],
        "practiceProblem": {...}
      },
      ...
    ]
  }
}
```

## 🎮 Usage Flow

1. **Upload PDF**: Drag and drop or select a PDF file
2. **Read Content**: View organized PDF content in the right sidebar
3. **Select Confusing Text**: Highlight text you don't understand
4. **Click "I'm confused about this"**: Opens question modal
5. **Answer Questions**: Answer all 5 diagnostic questions (text or voice input)
6. **Submit Answers**: Review and submit your responses
7. **View Analysis**: See AI-generated diagnostic summary
8. **Explore Mind Map**: Interact with the concept dependency graph showing all related concepts
9. **Follow Learning Path**: Complete step-by-step learning cards for EVERY concept in the mind map
10. **Practice**: Answer practice problems (required before proceeding) and track progress
11. **Complete**: Celebrate completion and return to home

## 🎨 Theme & Styling

ConceptGuide uses a retro-terminal/hacker-girl theme:

- **Main Background**: `#1A1A1A` (dark gray)
- **Panel Background**: `#2D2D2D` (lighter gray)
- **Primary Accent**: `#FF4081` (neon pink)
- **Gradient End**: `#E0007A` (hot magenta)
- **Text Color**: `#F5D9E4` (light pink)
- **Heading Color**: `#FFFFFF` (white)
- **Font**: Poppins (Google Fonts)

All panels feature:
- Gradient borders (pink to magenta)
- Window control dots (red, yellow, green)
- Rounded corners (`rounded-lg`)

## 🐛 Troubleshooting

### Backend Server Won't Start
- Check that port 3001 is not in use
- Verify `GEMINI_API_KEY` is set in `.env`
- Ensure all dependencies are installed: `npm install`

### Questions Not Generating
- Verify your Google AI API key is valid
- Check browser console for error messages
- Ensure backend server is running on port 3001
- Check API quota limits in Google AI Studio

### PDF Not Loading
- Ensure PDF file is not corrupted
- Check browser console for PDF.js errors
- Try a different PDF file
- Clear browser cache

### Mind Map Nodes Overlapping
- Use the zoom controls to adjust view
- Click "Fit View" button to see all nodes
- The graph automatically spaces nodes, but very large graphs may need manual adjustment

### Authentication Issues
- Verify Firebase configuration in `.env`
- Check Firebase console for authentication rules
- Ensure Email/Password authentication is enabled

## 📝 Development

### Running in Development Mode

```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run dev
```

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Code Structure

- **Components**: React functional components with hooks
- **State Management**: Zustand stores for global state
- **Styling**: Tailwind CSS with custom theme classes
- **API Calls**: Fetch API for backend communication
- **PDF Processing**: Client-side using pdfjs-dist

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Google Generative AI (Gemini) for intelligent analysis
- ReactFlow for graph visualization
- PDF.js for PDF processing
- The open-source community for excellent tools and libraries

## 📧 Support

For issues, questions, or contributions, please open an issue on GitHub.

---

**Made with ❤️ for students who want to understand, not just memorize.**
