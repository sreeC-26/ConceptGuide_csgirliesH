import { useEffect, useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import LearningExperience from './LearningExperience';

/**
 * Integration Point for Person 2's Component
 *
 * This component renders Person 2's LearningExperience component
 * after the user completes all 5 questions.
 */
export default function Person2Integration({ questions, answers, selectedText, surroundingContext }) {
  const { currentSessionId, history, setCurrentSessionId, fileName } = useAppStore();

  const qaPairs = useMemo(() => {
    if (!Array.isArray(questions) || !Array.isArray(answers) || questions.length === 0) {
      return [];
    }

    return questions.map((question, index) => {
      const questionText = typeof question === 'string' ? question : question.question || question;
      return {
        question: questionText,
        answer: answers[index] || '',
      };
    });
  }, [questions, answers]);

  useEffect(() => {
    // Only create session if we don't have one and we have Q&A pairs
    if (!history?.addSession || currentSessionId || qaPairs.length === 0) {
      return;
    }

    const newSessionId = history.addSession({
      fullSelectedText: selectedText || '',
      pdfName: fileName || '',
      questionResponses: qaPairs.map((qa, index) => ({
        question: qa.question,
        answer: qa.answer,
        level: index + 1,
      })),
    });

    if (newSessionId && setCurrentSessionId) {
      setCurrentSessionId(newSessionId);
    }
  }, [history, currentSessionId, setCurrentSessionId, selectedText, fileName, qaPairs]);

  // Also update session if it already exists but doesn't have questionResponses
  useEffect(() => {
    if (!currentSessionId || !history?.updateSessionProgress || qaPairs.length === 0) {
      return;
    }

    const session = history.getSessionById?.(currentSessionId);
    if (session && (!session.questionResponses || session.questionResponses.length === 0)) {
      history.updateSessionProgress(currentSessionId, undefined, undefined, {
        questionResponses: qaPairs.map((qa, index) => ({
          question: qa.question,
          answer: qa.answer,
          level: index + 1,
        })),
      });
    }
  }, [currentSessionId, history, qaPairs]);

  const sessionData = useMemo(() => {
    if (qaPairs.length === 0) {
      return null;
    }
    return {
      selectedText: selectedText || '',
      qaPairs,
    };
  }, [selectedText, qaPairs]);

  if (!sessionData) {
    return null;
  }

  return <LearningExperience sessionData={sessionData} sessionId={currentSessionId} />;
}
