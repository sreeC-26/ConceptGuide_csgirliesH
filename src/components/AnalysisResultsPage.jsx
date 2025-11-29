import { useNavigate } from 'react-router-dom';
import DiagnosticSummary from './DiagnosticSummary';

export default function AnalysisResultsPage({ analysisResult, onViewMindMap }) {
  const navigate = useNavigate();

  if (!analysisResult) {
    return null;
  }

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6" style={{ backgroundColor: '#1A1A1A' }}>
      <div className="container mx-auto max-w-6xl">
        {/* Diagnostic Summary - Shows all analysis details */}
        <DiagnosticSummary analysisResult={analysisResult} />

        {/* Mind Map Button */}
        <div className="mt-6 sm:mt-8 flex justify-center">
          <button
            onClick={onViewMindMap}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold transition-all duration-200 hover:opacity-90 shadow-lg"
            style={{
              fontFamily: 'Poppins, sans-serif',
              background: 'linear-gradient(135deg, #FF4081 0%, #E0007A 100%)',
              color: '#FFFFFF',
            }}
          >
            View Mind Map
          </button>
        </div>
      </div>
    </div>
  );
}
