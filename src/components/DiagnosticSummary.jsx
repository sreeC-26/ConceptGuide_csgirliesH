export default function DiagnosticSummary({ analysisResult }) {
  const { overallAccuracy, overallConfidence, levelScores, diagnosticSummary, confusionType, secondaryTypes, specificGaps } = analysisResult;

  const accuracyPercentage = Math.round(overallAccuracy * 100);
  const confidencePercentage = Math.round(overallConfidence * 100);
  const accuracyColor = overallAccuracy >= 0.7 ? '#27C93F' : overallAccuracy >= 0.5 ? '#FFBD2E' : '#FF5F56';

  return (
    <div className="gradient-border rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
      <div className="window-controls mb-3 sm:mb-4 hidden sm:flex">
        <div className="window-dot window-dot-red"></div>
        <div className="window-dot window-dot-yellow"></div>
        <div className="window-dot window-dot-green"></div>
      </div>
      <h2 className="text-xl sm:text-2xl mb-3 sm:mb-4 flex items-center" style={{ fontFamily: 'Poppins, sans-serif', color: '#FFFFFF' }}>
        Diagnostic Summary
      </h2>

      {/* Overall Accuracy and Confidence */}
      <div className="mb-4 sm:mb-6 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm sm:text-base md:text-lg" style={{ fontFamily: 'Poppins, sans-serif', color: '#FFFFFF' }}>Overall Accuracy</h3>
            <span className="text-lg sm:text-xl md:text-2xl font-bold" style={{ color: accuracyColor }}>
              {accuracyPercentage}%
            </span>
          </div>
          <div className="w-full rounded-full h-2 sm:h-3" style={{ backgroundColor: '#1A1A1A' }}>
            <div
              className="h-2 sm:h-3 rounded-full transition-all"
              style={{ width: `${accuracyPercentage}%`, backgroundColor: accuracyColor }}
            ></div>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm sm:text-base md:text-lg" style={{ fontFamily: 'Poppins, sans-serif', color: '#FFFFFF' }}>Overall Confidence</h3>
            <span className="text-lg sm:text-xl md:text-2xl font-bold" style={{ color: '#FF4081' }}>
              {confidencePercentage}%
            </span>
          </div>
          <div className="w-full rounded-full h-2 sm:h-3" style={{ backgroundColor: '#1A1A1A' }}>
            <div
              className="h-2 sm:h-3 rounded-full transition-all"
              style={{ width: `${confidencePercentage}%`, background: 'linear-gradient(135deg, #FF4081 0%, #E0007A 100%)' }}
            ></div>
          </div>
        </div>
      </div>

      {/* Level Scores */}
      {levelScores && levelScores.length > 0 && (
        <div className="mb-4 sm:mb-6">
          <h3 className="text-sm sm:text-base md:text-lg mb-2 sm:mb-3" style={{ fontFamily: 'Poppins, sans-serif', color: '#FFFFFF' }}>Question-Level Analysis</h3>
          <div className="space-y-2 sm:space-y-3">
            {levelScores.map((levelScore, index) => {
              const accuracyPercentage = Math.round(levelScore.accuracy * 100);
              const confidencePercentage = Math.round(levelScore.confidence * 100);
              return (
                <div key={index} className="rounded-lg p-3 sm:p-4" style={{ backgroundColor: '#1A1A1A', border: '1px solid #FF4081' }}>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0 mb-2">
                    <h4 className="font-semibold text-sm sm:text-base" style={{ fontFamily: 'Poppins, sans-serif', color: '#FFFFFF' }}>Question {levelScore.level}</h4>
                    <div className="flex gap-3 sm:gap-4 text-xs sm:text-sm" style={{ fontFamily: 'Poppins, sans-serif', color: '#F5D9E4' }}>
                      <span>Accuracy: <span className="font-semibold">{accuracyPercentage}%</span></span>
                      <span>Confidence: <span className="font-semibold">{confidencePercentage}%</span></span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div>
                      <div className="text-[10px] sm:text-xs mb-1" style={{ fontFamily: 'Poppins, sans-serif', color: '#F5D9E4' }}>Accuracy</div>
                      <div className="w-full rounded-full h-1.5 sm:h-2" style={{ backgroundColor: '#2D2D2D' }}>
                        <div
                          className="h-1.5 sm:h-2 rounded-full"
                          style={{ width: `${accuracyPercentage}%`, background: 'linear-gradient(135deg, #FF4081 0%, #E0007A 100%)' }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] sm:text-xs mb-1" style={{ fontFamily: 'Poppins, sans-serif', color: '#F5D9E4' }}>Confidence</div>
                      <div className="w-full rounded-full h-1.5 sm:h-2" style={{ backgroundColor: '#2D2D2D' }}>
                        <div
                          className="h-1.5 sm:h-2 rounded-full"
                          style={{ width: `${confidencePercentage}%`, background: 'linear-gradient(135deg, #FF4081 0%, #E0007A 100%)' }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  {levelScore.keywordMatches && levelScore.keywordMatches.length > 0 && (
                    <div className="mb-1 sm:mb-2">
                      <span className="text-[10px] sm:text-xs font-semibold" style={{ color: '#27C93F' }}>✓ Keywords Found: </span>
                      <span className="text-[10px] sm:text-xs" style={{ fontFamily: 'Poppins, sans-serif', color: '#27C93F' }}>{levelScore.keywordMatches.join(', ')}</span>
                    </div>
                  )}
                  {levelScore.missingKeywords && levelScore.missingKeywords.length > 0 && (
                    <div className="mb-1 sm:mb-2">
                      <span className="text-[10px] sm:text-xs font-semibold" style={{ color: '#FF5F56' }}>✗ Missing Keywords: </span>
                      <span className="text-[10px] sm:text-xs" style={{ fontFamily: 'Poppins, sans-serif', color: '#FF5F56' }}>{levelScore.missingKeywords.join(', ')}</span>
                    </div>
                  )}
                  {levelScore.reasoning && (
                    <p className="text-xs sm:text-sm mt-1 sm:mt-2 italic" style={{ fontFamily: 'Poppins, sans-serif', color: '#F5D9E4' }}>{levelScore.reasoning}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Diagnostic Summary Text */}
      <div className="mb-4 sm:mb-6">
        <h3 className="text-sm sm:text-base md:text-lg mb-2" style={{ fontFamily: 'Poppins, sans-serif', color: '#FFFFFF' }}>Overall Assessment</h3>
        <p className="leading-relaxed whitespace-pre-wrap text-sm sm:text-base" style={{ fontFamily: 'Poppins, sans-serif', color: '#F5D9E4' }}>{diagnosticSummary}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <div className="rounded-lg p-3 sm:p-4" style={{ backgroundColor: '#1A1A1A', border: '1px solid #FF4081' }}>
          <h4 className="font-semibold mb-2 flex items-center text-sm sm:text-base" style={{ fontFamily: 'Poppins, sans-serif', color: '#FF4081' }}>
            Confusion Type
          </h4>
          <p className="mb-2 text-sm sm:text-base" style={{ fontFamily: 'Poppins, sans-serif', color: '#F5D9E4' }}>{confusionType}</p>
          {secondaryTypes && secondaryTypes.length > 0 && (
            <div>
              <span className="text-[10px] sm:text-xs font-semibold" style={{ color: '#FF4081' }}>Secondary Types: </span>
              <span className="text-[10px] sm:text-xs" style={{ fontFamily: 'Poppins, sans-serif', color: '#F5D9E4' }}>{secondaryTypes.join(', ')}</span>
            </div>
          )}
        </div>

        <div className="rounded-lg p-3 sm:p-4" style={{ backgroundColor: '#1A1A1A', border: '1px solid #FFBD2E' }}>
          <h4 className="font-semibold mb-2 flex items-center text-sm sm:text-base" style={{ fontFamily: 'Poppins, sans-serif', color: '#FFBD2E' }}>
            Knowledge Gaps
          </h4>
          <ul className="list-none space-y-1 text-sm sm:text-base" style={{ fontFamily: 'Poppins, sans-serif', color: '#F5D9E4' }}>
            {specificGaps.map((gap, index) => (
              <li key={index} style={{ position: 'relative', paddingLeft: '1rem' }}>
                <span style={{ position: 'absolute', left: 0, color: '#FF4081' }}>•</span>
                {gap}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
