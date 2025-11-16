export default function DiagnosticSummary({ analysisResult }) {
  const { overallAccuracy, overallConfidence, levelScores, diagnosticSummary, confusionType, secondaryTypes, specificGaps } = analysisResult;

  const accuracyPercentage = Math.round(overallAccuracy * 100);
  const confidencePercentage = Math.round(overallConfidence * 100);
  const accuracyColor = overallAccuracy >= 0.7 ? '#27C93F' : overallAccuracy >= 0.5 ? '#FFBD2E' : '#FF5F56';

  return (
    <div className="gradient-border rounded-lg p-6 mb-6">
      <div className="window-controls mb-4">
        <div className="window-dot window-dot-red"></div>
        <div className="window-dot window-dot-yellow"></div>
        <div className="window-dot window-dot-green"></div>
      </div>
      <h2 className="text-2xl mb-4 flex items-center" style={{ fontFamily: 'Poppins, sans-serif', color: '#FFFFFF', fontSize: '2rem' }}>
        <span className="mr-2">📊</span>
        Diagnostic Summary
      </h2>

      {/* Overall Accuracy and Confidence */}
      <div className="mb-6 grid md:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg" style={{ fontFamily: 'Poppins, sans-serif', color: '#FFFFFF', fontSize: '1.5rem' }}>Overall Accuracy</h3>
            <span className="text-2xl font-bold" style={{ color: accuracyColor }}>
              {accuracyPercentage}%
            </span>
          </div>
          <div className="w-full rounded-full h-3" style={{ backgroundColor: '#1A1A1A' }}>
            <div
              className="h-3 rounded-full transition-all"
              style={{ width: `${accuracyPercentage}%`, backgroundColor: accuracyColor }}
            ></div>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg" style={{ fontFamily: 'Poppins, sans-serif', color: '#FFFFFF', fontSize: '1.5rem' }}>Overall Confidence</h3>
            <span className="text-2xl font-bold" style={{ color: '#FF4081' }}>
              {confidencePercentage}%
            </span>
          </div>
          <div className="w-full rounded-full h-3" style={{ backgroundColor: '#1A1A1A' }}>
            <div
              className="h-3 rounded-full transition-all"
              style={{ width: `${confidencePercentage}%`, background: 'linear-gradient(135deg, #FF4081 0%, #E0007A 100%)' }}
            ></div>
          </div>
        </div>
      </div>

      {/* Level Scores */}
      {levelScores && levelScores.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg mb-3" style={{ fontFamily: 'Poppins, sans-serif', color: '#FFFFFF', fontSize: '1.5rem' }}>Question-Level Analysis</h3>
          <div className="space-y-3">
            {levelScores.map((levelScore, index) => {
              const accuracyPercentage = Math.round(levelScore.accuracy * 100);
              const confidencePercentage = Math.round(levelScore.confidence * 100);
              return (
                <div key={index} className="rounded-lg p-4" style={{ backgroundColor: '#1A1A1A', border: '1px solid #FF4081' }}>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold" style={{ fontFamily: 'Poppins, sans-serif', color: '#FFFFFF', fontSize: '1.25rem' }}>Question {levelScore.level}</h4>
                    <div className="flex gap-4 text-sm" style={{ fontFamily: 'Poppins, sans-serif', color: '#F5D9E4' }}>
                      <span>Accuracy: <span className="font-semibold">{accuracyPercentage}%</span></span>
                      <span>Confidence: <span className="font-semibold">{confidencePercentage}%</span></span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div>
                      <div className="text-xs mb-1" style={{ fontFamily: 'Poppins, sans-serif', color: '#F5D9E4' }}>Accuracy</div>
                      <div className="w-full rounded-full h-2" style={{ backgroundColor: '#2D2D2D' }}>
                        <div
                          className="h-2 rounded-full"
                          style={{ width: `${accuracyPercentage}%`, background: 'linear-gradient(135deg, #FF4081 0%, #E0007A 100%)' }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs mb-1" style={{ fontFamily: 'Poppins, sans-serif', color: '#F5D9E4' }}>Confidence</div>
                      <div className="w-full rounded-full h-2" style={{ backgroundColor: '#2D2D2D' }}>
                        <div
                          className="h-2 rounded-full"
                          style={{ width: `${confidencePercentage}%`, background: 'linear-gradient(135deg, #FF4081 0%, #E0007A 100%)' }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  {levelScore.keywordMatches && levelScore.keywordMatches.length > 0 && (
                    <div className="mb-2">
                      <span className="text-xs font-semibold" style={{ color: '#27C93F' }}>✓ Keywords Found: </span>
                      <span className="text-xs" style={{ fontFamily: 'Poppins, sans-serif', color: '#27C93F' }}>{levelScore.keywordMatches.join(', ')}</span>
                    </div>
                  )}
                  {levelScore.missingKeywords && levelScore.missingKeywords.length > 0 && (
                    <div className="mb-2">
                      <span className="text-xs font-semibold" style={{ color: '#FF5F56' }}>✗ Missing Keywords: </span>
                      <span className="text-xs" style={{ fontFamily: 'Poppins, sans-serif', color: '#FF5F56' }}>{levelScore.missingKeywords.join(', ')}</span>
                    </div>
                  )}
                  {levelScore.reasoning && (
                    <p className="text-sm mt-2 italic" style={{ fontFamily: 'Poppins, sans-serif', color: '#F5D9E4' }}>{levelScore.reasoning}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Diagnostic Summary Text */}
      <div className="mb-6">
        <h3 className="text-lg mb-2" style={{ fontFamily: 'Poppins, sans-serif', color: '#FFFFFF', fontSize: '1.5rem' }}>Overall Assessment</h3>
        <p className="leading-relaxed whitespace-pre-wrap" style={{ fontFamily: 'Poppins, sans-serif', color: '#F5D9E4' }}>{diagnosticSummary}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-lg p-4" style={{ backgroundColor: '#1A1A1A', border: '1px solid #FF4081' }}>
          <h4 className="font-semibold mb-2 flex items-center" style={{ fontFamily: 'Poppins, sans-serif', color: '#FF4081', fontSize: '1.25rem' }}>
            <span className="mr-2">🎯</span>
            Confusion Type
          </h4>
          <p className="mb-2" style={{ fontFamily: 'Poppins, sans-serif', color: '#F5D9E4' }}>{confusionType}</p>
          {secondaryTypes && secondaryTypes.length > 0 && (
            <div>
              <span className="text-xs font-semibold" style={{ color: '#FF4081' }}>Secondary Types: </span>
              <span className="text-xs" style={{ fontFamily: 'Poppins, sans-serif', color: '#F5D9E4' }}>{secondaryTypes.join(', ')}</span>
            </div>
          )}
        </div>

        <div className="rounded-lg p-4" style={{ backgroundColor: '#1A1A1A', border: '1px solid #FFBD2E' }}>
          <h4 className="font-semibold mb-2 flex items-center" style={{ fontFamily: 'Poppins, sans-serif', color: '#FFBD2E', fontSize: '1.25rem' }}>
            <span className="mr-2">⚠️</span>
            Knowledge Gaps
          </h4>
          <ul className="list-none space-y-1" style={{ fontFamily: 'Poppins, sans-serif', color: '#F5D9E4' }}>
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

