import { create } from 'zustand';
import { useAuthStore } from './useAuthStore';
import {
  saveSessionToFirebase,
  fetchUserSessions,
  deleteSessionFromFirebase,
  updateSessionInFirebase,
} from '../services/historyService';

const buildQAFromResponses = (responses = []) => {
  if (!Array.isArray(responses) || responses.length === 0) {
    return null;
  }

  const questions = responses.map((resp, index) => ({
    level: resp.level ?? index + 1,
    question: resp.question ?? `Question ${index + 1}`,
    type: resp.type ?? resp.confusionType ?? 'Review',
  }));

  const answers = responses.map((resp) => resp.answer ?? '');
  return { questions, answers };
};

export const useAppStore = create((set, get) => ({
  // PDF state
  fullText: '',
  pageTexts: [],
  pageCount: 0,
  fileName: '',
  pdfFile: null,
  pdfDocument: null,

  // Selection state
  selectedText: '',
  surroundingContext: '',
  showConfusionButton: false,
  confusionButtonPosition: { x: 0, y: 0 },

  // Question state
  questions: [],
  currentQuestionIndex: 0,
  answers: [],
  showQuestionModal: false,
  qaData: null, // Complete Q&A data for Person 2's component

  // Session / review state
  currentSessionId: null,
  reviewMode: false,
  reviewAnalysis: null,
  refreshInsightsTimestamp: null,

  // Core actions
  setPdfData: (data) => set((state) => {
    // If switching to a new PDF, ensure current session is saved
    // (sessions are already saved to Firebase when created/updated, so this is just for state)
    return {
      fullText: data.fullText || '',
      pageTexts: data.pageTexts || [],
      pageCount: data.pageCount || 0,
      fileName: data.fileName || '',
      pdfFile: data.pdfFile || null,
      pdfDocument: data.pdfDocument || null,
      // Clear current session state when switching PDFs (new session will be created when questions are answered)
      currentSessionId: null,
      qaData: null,
      reviewMode: false,
      reviewAnalysis: null,
    };
  }),

  setSelection: (selectedText, surroundingContext) => set({
    selectedText,
    surroundingContext,
    questions: [],
    currentQuestionIndex: 0,
    answers: [],
    qaData: null,
  }),

  setConfusionButton: (show, position = { x: 0, y: 0 }) => set({
    showConfusionButton: show,
    confusionButtonPosition: position,
  }),

  setQuestions: (questions) => set({ questions }),
  setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),

  addAnswer: (answer) => set((state) => ({
    answers: [...state.answers, answer],
  })),

  setAnswer: (index, answer) => set((state) => {
    const newAnswers = [...state.answers];
    newAnswers[index] = answer;
    return { answers: newAnswers };
  }),

  setShowQuestionModal: (show) => set({ showQuestionModal: show }),

  setQAData: (qaData) => set({ qaData, refreshInsightsTimestamp: Date.now() }),
  setCurrentSessionId: (id) => set({ currentSessionId: id }),
  setReviewMode: (value) => set({ reviewMode: value }),
  setReviewAnalysis: (analysis) => set({ reviewAnalysis: analysis, refreshInsightsTimestamp: Date.now() }),
  setRefreshInsightsTimestamp: (timestamp = Date.now()) => set({ refreshInsightsTimestamp: timestamp }),

      reset: () => set((state) => {
        // Preserve history when resetting - only clear current session state
        return {
          fullText: '',
          pageTexts: [],
          pageCount: 0,
          fileName: '',
          pdfFile: null,
          pdfDocument: null,
          selectedText: '',
          surroundingContext: '',
          showConfusionButton: false,
          questions: [],
          currentQuestionIndex: 0,
          answers: [],
          showQuestionModal: false,
          qaData: null,
          currentSessionId: null,
          reviewMode: false,
          reviewAnalysis: null,
          refreshInsightsTimestamp: null,
          // Keep history intact
          history: state.history,
        };
      }),

  loadSessionForReview: (sessionId) => {
    if (!sessionId) return;
    const session = get().history.getSessionById(sessionId);
    if (!session) return;

    const qaPayload = buildQAFromResponses(session.questionResponses);

    // Build complete analysis result from stored session data
    const analysisResult = session.analysisResult || {
      mindMap: session.mindMapData ?? null,
      repairPath: session.repairPathData ?? [],
      diagnosticSummary: session.diagnosticSummary ?? '',
      confusionType: session.confusionType ?? null,
      masteryScore: session.masteryScore ?? null,
      levelScores: session.levelScores ?? [],
      overallAccuracy: session.masteryScore ? session.masteryScore / 100 : 0,
      overallConfidence: session.masteryScore ? session.masteryScore / 100 : 0,
      specificGaps: [],
      secondaryTypes: [],
    };

    set((state) => ({
      currentSessionId: sessionId,
      selectedText: session.fullSelectedText ?? session.selectedText ?? state.selectedText,
      qaData: qaPayload ?? state.qaData,
      reviewMode: true,
      reviewAnalysis: analysisResult,
      showQuestionModal: false,
      history: {
        ...state.history,
        currentSessionId: sessionId,
      },
    }));
  },

  exitReviewMode: () => set((state) => ({
    reviewMode: false,
    reviewAnalysis: null,
    qaData: null,
    currentSessionId: null,
    history: {
      ...state.history,
      currentSessionId: null,
    },
  })),

  history: {
    sessions: [],
    currentSessionId: null,

    addSession: (sessionData = {}) => {
      const userId = useAuthStore.getState().user?.uid || null;
      const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
      const baseText = sessionData.fullSelectedText || '';
      const normalizedSession = {
        id: sessionData.id || generateId(),
        timestamp: new Date().toISOString(),
        pdfName: sessionData.pdfName ?? get().fileName ?? '',
        selectedText: baseText.slice(0, 100),
        fullSelectedText: baseText,
        confusionType: sessionData.confusionType ?? null,
        masteryScore: typeof sessionData.masteryScore === 'number' ? sessionData.masteryScore : null,
        timeSpent: typeof sessionData.timeSpent === 'number' ? sessionData.timeSpent : 0,
        totalSteps: typeof sessionData.totalSteps === 'number' ? sessionData.totalSteps : 0,
        completedSteps: typeof sessionData.completedSteps === 'number' ? sessionData.completedSteps : 0,
        mindMapData: sessionData.mindMapData ?? null,
        repairPathData: sessionData.repairPathData ?? null,
        questionResponses: Array.isArray(sessionData.questionResponses) ? sessionData.questionResponses : [],
        diagnosticSummary: sessionData.diagnosticSummary ?? '',
        levelScores: Array.isArray(sessionData.levelScores) ? sessionData.levelScores : [],
      };

      set((state) => {
        const existingHistory = state.history || {};
        const existingSessions = existingHistory.sessions || [];
        
        // Check if session with this ID already exists to prevent duplicates
        const existingIndex = existingSessions.findIndex(s => s.id === normalizedSession.id);
        let updatedSessions;
        
        if (existingIndex >= 0) {
          // Update existing session instead of creating duplicate
          updatedSessions = [...existingSessions];
          updatedSessions[existingIndex] = { ...updatedSessions[existingIndex], ...normalizedSession };
        } else {
          // Add new session at the beginning
          updatedSessions = [normalizedSession, ...existingSessions];
        }

        return {
          history: {
            ...existingHistory,
            sessions: updatedSessions,
            currentSessionId: normalizedSession.id,
          },
          currentSessionId: normalizedSession.id,
          reviewMode: false,
          reviewAnalysis: null,
          refreshInsightsTimestamp: Date.now(),
        };
      });

      if (userId) {
        (async () => {
          try {
            await saveSessionToFirebase(userId, normalizedSession);
          } catch (error) {
            console.error('Failed to save session to Firebase:', error);
          }
        })();
      }

      return normalizedSession.id;
    },

    getSessionById: (id) => {
      const { history } = get();
      if (!history || !Array.isArray(history.sessions)) return null;
      return history.sessions.find((session) => session.id === id) || null;
    },

    deleteSession: (id) => {
      const userId = useAuthStore.getState().user?.uid || null;
      const exitReviewMode = get().exitReviewMode;

      set((state) => {
        const existingHistory = state.history || {};
        const filteredSessions = (existingHistory.sessions || []).filter((session) => session.id !== id);
        const isDeletingCurrent = existingHistory.currentSessionId === id || state.currentSessionId === id;
        const newCurrentId = isDeletingCurrent ? null : existingHistory.currentSessionId;

        return {
          history: {
            ...existingHistory,
            sessions: filteredSessions,
            currentSessionId: newCurrentId,
          },
          currentSessionId: isDeletingCurrent ? null : state.currentSessionId,
          reviewMode: isDeletingCurrent ? false : state.reviewMode,
          reviewAnalysis: isDeletingCurrent ? null : state.reviewAnalysis,
          qaData: isDeletingCurrent ? null : state.qaData,
          refreshInsightsTimestamp: Date.now(),
        };
      });

      if (userId) {
        (async () => {
          try {
            await deleteSessionFromFirebase(userId, id);
          } catch (error) {
            console.error('Failed to delete session from Firebase:', error);
          }
        })();
      }

      if (get().currentSessionId === null) {
        exitReviewMode();
      }
    },

    getAllSessions: () => {
      const { history } = get();
      if (!history || !Array.isArray(history.sessions)) return [];
      return [...history.sessions].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    },

    updateSessionProgress: (id, completedSteps, timeSpent, updates = {}) => {
      const userId = useAuthStore.getState().user?.uid || null;

      set((state) => {
        const existingHistory = state.history || {};
        const updatedSessions = (existingHistory.sessions || []).map((session) => {
          if (session.id !== id) return session;
          return {
            ...session,
            completedSteps: typeof completedSteps === 'number' ? completedSteps : session.completedSteps,
            timeSpent: typeof timeSpent === 'number' ? timeSpent : session.timeSpent,
            ...updates,
          };
        });

        return {
          history: {
            ...existingHistory,
            sessions: updatedSessions,
          },
          refreshInsightsTimestamp: Date.now(), // Trigger history refresh
        };
      });

      if (userId) {
        const payload = { ...updates };

        if (typeof completedSteps === 'number') {
          payload.completedSteps = completedSteps;
        }
        if (typeof timeSpent === 'number') {
          payload.timeSpent = timeSpent;
        }

        if (Object.keys(payload).length > 0) {
          (async () => {
            try {
              await updateSessionInFirebase(userId, id, payload);
            } catch (error) {
              console.error('Failed to update session in Firebase:', error);
            }
          })();
        }
      }
    },
  },

  syncSessionsFromFirebase: async () => {
    const userId = useAuthStore.getState().user?.uid;
    if (!userId) {
      return [];
    }

    try {
      const remoteSessions = await fetchUserSessions(userId);
      const sortedSessions = [...remoteSessions].sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));

      set((state) => {
        const existingHistory = state.history || {};
        const existingSessions = existingHistory.sessions || [];
        const previousCurrentId = state.currentSessionId || existingHistory.currentSessionId || null;
        
        // Merge remote sessions with existing ones, avoiding duplicates
        const sessionMap = new Map();
        // First add existing sessions
        existingSessions.forEach(session => {
          sessionMap.set(session.id, session);
        });
        // Then add/update with remote sessions
        sortedSessions.forEach(session => {
          sessionMap.set(session.id, session);
        });
        
        const mergedSessions = Array.from(sessionMap.values()).sort(
          (a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0)
        );
        
        const hasPrevious = mergedSessions.some((session) => session.id === previousCurrentId);
        const newCurrentId = hasPrevious ? previousCurrentId : (mergedSessions[0]?.id ?? null);

        return {
          history: {
            ...existingHistory,
            sessions: mergedSessions,
            currentSessionId: newCurrentId,
          },
          currentSessionId: newCurrentId,
          reviewMode: hasPrevious ? state.reviewMode : false,
          reviewAnalysis: hasPrevious ? state.reviewAnalysis : null,
        };
      });

      return sortedSessions;
    } catch (error) {
      console.error('Failed to sync sessions from Firebase:', error);
      return [];
    }
  },
}));
