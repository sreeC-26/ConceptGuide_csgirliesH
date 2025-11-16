# ConceptGuide - Complete Testing Guide

## 🎯 What the System Can Do

### 1. **PDF Upload & Viewing** 📄
- **Drag & Drop**: Drag a PDF file onto the upload area
- **File Selection**: Click "Choose File" button to browse and select a PDF
- **PDF Display**: Once uploaded, the PDF displays with:
  - Page images (visual representation)
  - Selectable text content below each page (for text selection)

**Test Steps:**
1. Open the app in browser
2. Drag a PDF file onto the upload area OR click "Choose File"
3. Verify the PDF loads and displays pages
4. Scroll to see all pages

---

### 2. **Text Selection & Confusion Trigger** ✏️
- **Select Text**: Click and drag to select any text from the gray text boxes below PDF pages
- **Confusion Button**: When text is selected, a button appears saying "I'm confused about this"
- **Context Capture**: The system captures:
  - The selected text
  - 500 characters before and after for context

**Test Steps:**
1. After uploading a PDF, scroll to the text content area
2. Click and drag to select some text
3. Verify the "I'm confused about this" button appears
4. Click the button

---

### 3. **AI Question Generation** 🤖
- **Automatic Generation**: When you click the confusion button, the system:
  - Sends selected text and context to Gemini API
  - Generates 5 questions using a "question ladder" approach
  - Displays questions one by one in a modal

**Test Steps:**
1. Select text and click confusion button
2. Modal should open with "Question 1 of 5"
3. Verify a question appears (either AI-generated or sample fallback)
4. Check progress bar shows 1/5

---

### 4. **Answer Questions (Text Input)** ⌨️
- **Text Area**: Type your answer in the textarea
- **Navigation**: Use "Previous" and "Next" buttons to navigate
- **Progress Tracking**: See "Question X of 5" indicator
- **Answer Storage**: All answers are saved as you progress

**Test Steps:**
1. In the question modal, type an answer
2. Click "Next" to go to question 2
3. Type another answer
4. Click "Previous" to go back and verify your answer is still there
5. Continue through all 5 questions

---

### 5. **Voice Recording & Transcription** 🎤
- **Start Recording**: Click "Start Recording" button
- **Visual Indicator**: Button changes to red with "Recording... Click to stop"
- **Stop Recording**: Click again to stop
- **Automatic Transcription**: Audio is sent to OpenAI Whisper API
- **Text Insertion**: Transcribed text appears in the textarea
- **Edit Transcription**: You can edit the transcribed text before submitting

**Test Steps:**
1. In the question modal, click "Start Recording"
2. Allow microphone permissions if prompted
3. Speak your answer clearly
4. Click "Stop Recording" (or wait for auto-stop)
5. Verify transcribed text appears in the textarea
6. Edit if needed, then click "Next"

**Requirements:**
- Microphone permissions granted
- Backend server running (for Whisper API)
- OpenAI API key with credits

---

### 6. **Question Progress & Navigation** 📊
- **Progress Bar**: Visual progress bar shows completion percentage
- **Question Counter**: "Question X of 5" displays current position
- **Previous Button**: Go back to previous questions (disabled on first question)
- **Next/Submit Button**: 
  - Shows "Next" for questions 1-4
  - Shows "Submit" on question 5

**Test Steps:**
1. Answer question 1, click "Next"
2. Answer question 2, click "Previous" (should go back to Q1)
3. Navigate forward through all questions
4. On question 5, verify button says "Submit"

---

### 7. **Submit & Integration Point** ✅
- **Data Collection**: All 5 question-answer pairs are collected
- **Integration Display**: After submit, Person2Integration component shows:
  - Selected text
  - All 5 questions
  - All 5 answers
- **Ready for Person 2**: Component is ready to receive Person 2's component

**Test Steps:**
1. Answer all 5 questions
2. Click "Submit" on question 5
3. Modal closes
4. Verify Person2Integration component displays with all Q&A data
5. Check that selected text and context are shown

---

### 8. **3-Column Layout** 📐
- **Left Sidebar**: History panel (collapsible)
  - Currently shows "No history yet"
  - Can be collapsed/expanded
- **Center Column**: Main content area
  - PDF upload/viewer
  - Question modal overlay
- **Right Sidebar**: Context panel (hidden by default)
  - Can be toggled open/closed
  - Placeholder content

**Test Steps:**
1. Verify 3-column layout on page load
2. Click arrow buttons to collapse/expand sidebars
3. Verify center column adjusts width accordingly

---

## 🧪 Complete Test Flow

### Full End-to-End Test:
1. ✅ **Start Backend**: `npm run server` (Terminal 1)
2. ✅ **Start Frontend**: `npm run dev` (Terminal 2)
3. ✅ **Open Browser**: Go to `http://localhost:5173`
4. ✅ **Upload PDF**: Drag & drop or select a PDF file
5. ✅ **View PDF**: Verify pages and text content display
6. ✅ **Select Text**: Click and drag to select confusing text
7. ✅ **Click Confusion Button**: Verify modal opens
8. ✅ **Answer Question 1**: Type answer, click "Next"
9. ✅ **Answer Question 2**: Use voice recording, verify transcription
10. ✅ **Answer Questions 3-5**: Mix of text and voice
11. ✅ **Submit**: Click "Submit" on question 5
12. ✅ **Verify Integration**: Check Person2Integration component displays all data

---

## 🔍 What to Check

### Visual Checks:
- [ ] 3-column layout displays correctly
- [ ] PDF pages render properly
- [ ] Text is selectable
- [ ] Confusion button appears on selection
- [ ] Modal opens and closes smoothly
- [ ] Progress bar updates correctly
- [ ] Buttons are clickable and responsive

### Functional Checks:
- [ ] PDF upload works (drag & drop + file picker)
- [ ] Text selection captures correct text
- [ ] Questions are generated (or fallback works)
- [ ] Answers are saved when navigating
- [ ] Voice recording captures audio
- [ ] Transcription appears in textarea
- [ ] All 5 questions can be answered
- [ ] Submit collects all Q&A data
- [ ] Integration component receives data

### API Checks:
- [ ] Backend server responds to `/api/health`
- [ ] Gemini API generates questions (check backend terminal)
- [ ] OpenAI Whisper transcribes audio (check backend terminal)
- [ ] Fallback to sample questions if APIs fail

---

## 🐛 Common Issues & Solutions

### Issue: PDF doesn't upload
- **Check**: File is a valid PDF
- **Check**: Browser console for errors
- **Solution**: Try a different PDF file

### Issue: Text selection doesn't work
- **Check**: You're selecting from gray text boxes (not images)
- **Check**: Text is actually selectable (not just images)
- **Solution**: Scroll to text content area below PDF pages

### Issue: Questions don't generate
- **Check**: Backend terminal for API errors
- **Check**: `.env` file has correct Gemini API key
- **Solution**: App will use sample questions as fallback

### Issue: Voice transcription fails
- **Check**: Backend server is running
- **Check**: OpenAI API key is correct and has credits
- **Check**: Microphone permissions granted
- **Solution**: You can still type answers manually

### Issue: Modal doesn't close
- **Check**: All 5 questions answered
- **Check**: Clicked "Submit" on question 5
- **Solution**: Check browser console for errors

---

## 📊 Expected Results

### Successful Test:
- ✅ PDF uploads and displays
- ✅ Text selection works
- ✅ 5 questions generated/displayed
- ✅ All answers saved
- ✅ Voice transcription works (if tested)
- ✅ Submit shows integration component
- ✅ All Q&A data displayed correctly

### Partial Success (API Issues):
- ✅ PDF uploads and displays
- ✅ Text selection works
- ⚠️ Sample questions used (API failed)
- ✅ All answers saved
- ⚠️ Voice transcription fails (can still type)
- ✅ Submit shows integration component

---

## 🎯 Quick Test Checklist

- [ ] Backend server running (`npm run server`)
- [ ] Frontend server running (`npm run dev`)
- [ ] Browser opened to `http://localhost:5173`
- [ ] `.env` file created with API keys
- [ ] PDF uploaded successfully
- [ ] Text selected and confusion button clicked
- [ ] Question modal opened
- [ ] At least one question answered
- [ ] Voice recording tested (optional)
- [ ] All 5 questions completed
- [ ] Submit button clicked
- [ ] Integration component displayed

---

**Happy Testing! 🚀**

