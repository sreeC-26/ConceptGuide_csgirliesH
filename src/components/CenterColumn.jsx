import PDFViewer from './PDFViewer';
import PDFUpload from './PDFUpload';
import QuestionModal from './QuestionModal';
import Person2Integration from './Person2Integration';
import { useAppStore } from '../store/useAppStore';

export default function CenterColumn() {
  const { pdfDocument, showQuestionModal, qaData, selectedText, surroundingContext } = useAppStore();

  // Show Person 2's component if Q&A is complete
  if (qaData) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden" style={{ backgroundColor: '#1A1A1A' }}>
        <div className="flex-1 overflow-auto">
          <Person2Integration
            questions={qaData.questions}
            answers={qaData.answers}
            selectedText={selectedText}
            surroundingContext={surroundingContext}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ backgroundColor: '#1A1A1A' }}>
      <div className="flex-1 overflow-auto">
        {!pdfDocument ? (
          <PDFUpload />
        ) : (
          <PDFViewer />
        )}
      </div>
      {showQuestionModal && <QuestionModal />}
    </div>
  );
}

