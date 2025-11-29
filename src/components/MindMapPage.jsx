import { useNavigate } from 'react-router-dom';
import DependencyGraph from './DependencyGraph';

export default function MindMapPage({ mindMap, onBack, onContinueToPath }) {
  const navigate = useNavigate();

  if (!mindMap || !mindMap.nodes || mindMap.nodes.length === 0) {
    return (
      <div className="min-h-screen p-4 sm:p-6 flex items-center justify-center" style={{ backgroundColor: '#1A1A1A' }}>
        <div className="text-center">
          <p className="text-lg sm:text-xl text-pink-400 mb-4">No mind map available</p>
          <button
            onClick={onBack}
            className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg bg-pink-500 text-white hover:opacity-90 text-sm sm:text-base"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6" style={{ backgroundColor: '#1A1A1A' }}>
      <div className="container mx-auto max-w-7xl">
        {/* Header with Back Button */}
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <button
            onClick={onBack}
            className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-all duration-200 hover:opacity-90 text-sm sm:text-base order-1 sm:order-none"
            style={{
              fontFamily: 'Poppins, sans-serif',
              backgroundColor: '#1A1A1A',
              color: '#FFFFFF',
              border: '1px solid #FF4081',
            }}
          >
            ← Back
          </button>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold order-0 sm:order-none" style={{ fontFamily: 'Poppins, sans-serif', color: '#FFFFFF' }}>
            Concept Map
          </h2>
          <div className="hidden sm:block" style={{ width: '100px' }}></div> {/* Spacer for centering */}
        </div>

        {/* Mind Map - Responsive Display */}
        <div className="mb-6 sm:mb-8 overflow-x-auto" style={{ minHeight: '300px' }}>
          <div className="min-w-[300px] sm:min-w-0" style={{ minHeight: '300px', height: 'calc(100vh - 300px)', maxHeight: '600px' }}>
            <DependencyGraph
              mindMap={mindMap}
              onComplete={() => {}} // Don't auto-advance, use button instead
            />
          </div>
        </div>

        {/* Continue to Learning Path Button */}
        <div className="flex justify-center">
          <button
            onClick={onContinueToPath}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold transition-all duration-200 hover:opacity-90 shadow-lg"
            style={{
              fontFamily: 'Poppins, sans-serif',
              background: 'linear-gradient(135deg, #FF4081 0%, #E0007A 100%)',
              color: '#FFFFFF',
            }}
          >
            Continue to Learning Path
          </button>
        </div>
      </div>
    </div>
  );
}
