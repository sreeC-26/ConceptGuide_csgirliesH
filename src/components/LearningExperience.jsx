import { useState, useEffect, useRef } from 'react';
import DiagnosticSummary from './DiagnosticSummary';
import DependencyGraph from './DependencyGraph';
import RepairPath from './RepairPath';
import Congratulations from './Congratulations';
import { useAppStore } from '../store/useAppStore';


export default function LearningExperience({ sessionData, sessionId }) {


  const hasPersistedAnalysisRef = useRef(false);
  const hasPersistedMindMapRef = useRef(false);
  const hasPersistedCompletionRef = useRef(false);
  const analyzedSessionIdRef = useRef(null);
  const { history, reviewMode, reviewAnalysis } = useAppStore();


  // Initialize analyzing state - false if we have existing analysis or are in review mode
  const [analyzing, setAnalyzing] = useState(() => {
    // If we have reviewAnalysis, don't analyze
    if (reviewMode && reviewAnalysis) return false;
    // If we have a sessionId, check if it has analysis in history
    if (sessionId && history?.getSessionById) {
      const session = history.getSessionById(sessionId);
      if (session?.analysisResult) return false;
    }
    // Otherwise, we need to analyze
    return true;
  });
  const [showingMap, setShowingMap] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [showCongratulations, setShowCongratulations] = useState(false);


  useEffect(() => {
    // FIRST: Check if we have analysis result already (from state, store, or history) - restore immediately
    if (sessionId) {
      const session = history?.getSessionById?.(sessionId);
     
      // Priority 1: If we have analysisResult in component state, use it directly
      if (analysisResult) {
        setAnalyzing(false);
        analyzedSessionIdRef.current = sessionId;
       
        // Restore showing state based on progress
        if (session?.completedSteps !== undefined && session?.totalSteps) {
          if (session.completedSteps >= session.totalSteps) {
            // Completed - show congratulations
            setShowingMap(false);
            setShowCongratulations(true);
          } else if (session.completedSteps > 0 && analysisResult.repairPath && analysisResult.repairPath.length > 0) {
            // In middle of learning path - show it directly
            setShowingMap(false);
          } else if (analysisResult.mindMap && analysisResult.mindMap.nodes && analysisResult.mindMap.nodes.length > 0) {
            // Show map if path not started yet
            setShowingMap(true);
          } else {
            // No mindMap, show repairPath if available
            setShowingMap(false);
          }
        } else if (analysisResult.mindMap && analysisResult.mindMap.nodes && analysisResult.mindMap.nodes.length > 0) {
          // Has mind map - show it first
          setShowingMap(true);
        } else if (analysisResult.repairPath && analysisResult.repairPath.length > 0) {
          // No mindMap, has repair path - show it
          setShowingMap(false);
        }
        return;
      }
     
      // Priority 2: If we have reviewAnalysis in store for current session (not review mode), use it
      if (reviewAnalysis && !reviewMode && sessionId === useAppStore.getState().currentSessionId) {
        setAnalyzing(false);
        setAnalysisResult(reviewAnalysis);
        analyzedSessionIdRef.current = sessionId;
       
        // Restore showing state based on progress
        if (session?.completedSteps !== undefined && session?.totalSteps) {
          if (session.completedSteps >= session.totalSteps) {
            // Completed - show congratulations
            setShowingMap(false);
            setShowCongratulations(true);
          } else if (session.completedSteps > 0 && reviewAnalysis.repairPath && reviewAnalysis.repairPath.length > 0) {
            // In middle of learning path - show it directly
            setShowingMap(false);
          } else if (reviewAnalysis.mindMap && reviewAnalysis.mindMap.nodes && reviewAnalysis.mindMap.nodes.length > 0) {
            // Show map if path not started yet
            setShowingMap(true);
          } else {
            // No mindMap, show repairPath if available
            setShowingMap(false);
          }
        } else if (reviewAnalysis.mindMap && reviewAnalysis.mindMap.nodes && reviewAnalysis.mindMap.nodes.length > 0) {
          // Has mind map - show it first
          setShowingMap(true);
        } else if (reviewAnalysis.repairPath && reviewAnalysis.repairPath.length > 0) {
          // No mindMap, has repair path - show it
          setShowingMap(false);
        }
        return;
      }
     
      // Priority 3: If we don't have analysisResult but have it in session history, restore it
      if (session?.analysisResult) {
        setAnalyzing(false);
        setAnalysisResult(session.analysisResult);
        analyzedSessionIdRef.current = sessionId;
       
        // Restore showing state based on progress
        if (session.completedSteps !== undefined && session.totalSteps) {
          if (session.completedSteps >= session.totalSteps) {
            // Completed - show congratulations
            setShowingMap(false);
            setShowCongratulations(true);
          } else if (session.completedSteps > 0 && session.analysisResult.repairPath && session.analysisResult.repairPath.length > 0) {
            // In middle of learning path - show it directly
            setShowingMap(false);
          } else if (session.analysisResult.mindMap && session.analysisResult.mindMap.nodes && session.analysisResult.mindMap.nodes.length > 0) {
            // Show map if path not started yet
            setShowingMap(true);
          } else {
            // No mindMap, show repairPath if available
            setShowingMap(false);
          }
        } else if (session.analysisResult.mindMap && session.analysisResult.mindMap.nodes && session.analysisResult.mindMap.nodes.length > 0) {
          // Has mind map - show it first
          setShowingMap(true);
        } else if (session.analysisResult.repairPath && session.analysisResult.repairPath.length > 0) {
          // No mindMap, has repair path - show it
          setShowingMap(false);
        }
        return;
      }
     
      // If already analyzed for this session, skip
      if (analyzedSessionIdRef.current === sessionId) {
        setAnalyzing(false);
        return;
      }
    }


    // SECOND: Handle review mode (when reviewing an old session)
    if (reviewMode && reviewAnalysis) {
      setAnalyzing(false);
      setError(null);
      setAnalysisResult(reviewAnalysis);
     
      // Determine what to show based on stored progress
      const session = history?.getSessionById?.(sessionId);
      if (session?.completedSteps !== undefined && session?.totalSteps) {
        if (session.completedSteps >= session.totalSteps) {
          // All completed - show congratulations
          setShowingMap(false);
          setShowCongratulations(true);
        } else if (session.completedSteps > 0 && reviewAnalysis.repairPath && reviewAnalysis.repairPath.length > 0) {
          // Show learning path if not completed - go directly to where they left off
          setShowingMap(false);
        } else if (reviewAnalysis.mindMap && reviewAnalysis.mindMap.nodes && reviewAnalysis.mindMap.nodes.length > 0) {
          // Show map if path not started yet
          setShowingMap(true);
        } else {
          // No mindMap, show repairPath if available
          setShowingMap(false);
        }
      } else if (reviewAnalysis.mindMap && reviewAnalysis.mindMap.nodes && reviewAnalysis.mindMap.nodes.length > 0) {
        // Has mind map - show it first
        setShowingMap(true);
      } else if (reviewAnalysis.repairPath && reviewAnalysis.repairPath.length > 0) {
        // No mindMap, has repair path - show it
        setShowingMap(false);
      }
      hasPersistedAnalysisRef.current = true;
      hasPersistedMindMapRef.current = true;
      analyzedSessionIdRef.current = sessionId;
      return;
    }


    // Don't analyze if we don't have sessionData
    if (!sessionData || !sessionData.qaPairs || sessionData.qaPairs.length === 0) {
      setAnalyzing(false);
      return;
    }


    let cancelled = false;


    const fetchAnalysis = async () => {
      try {
        setAnalyzing(true);
        setError(null);


        const response = await fetch('http://localhost:3001/api/analyze-and-generate-path', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(sessionData),
        });


        if (!response.ok) {
          let errorMessage = `Analysis failed: ${response.statusText}`;
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
            if (errorData.details) {
              errorMessage += ` - ${errorData.details}`;
            }
          } catch (e) {
            // If response is not JSON, use status text
          }
          throw new Error(errorMessage);
        }


        const data = await response.json();
        if (!cancelled) {
          setAnalysisResult(data);
          setAnalyzing(false);
          // If a mind map exists with nodes, show it first. User will click "Continue to Learning Path" to proceed.
          // Only show repairPath directly if there's no mindMap or mindMap has no nodes.
          if (data.mindMap && data.mindMap.nodes && data.mindMap.nodes.length > 0) {
            setShowingMap(true);
          } else {
            setShowingMap(false);
          }
          analyzedSessionIdRef.current = sessionId;
         
          // Store analysis result in store for quick access (for current session only)
          if (sessionId === useAppStore.getState().currentSessionId && !reviewMode) {
            useAppStore.getState().setReviewAnalysis(data);
          }
         
          // Store analysis result in history if we have a sessionId
          if (sessionId && history?.updateSessionProgress) {
            history.updateSessionProgress(sessionId, undefined, undefined, {
              analysisResult: data,
              mindMapData: data.mindMap || null,
              repairPathData: data.repairPath || [],
              diagnosticSummary: data.diagnosticSummary || '',
              confusionType: data.confusionType || null,
              masteryScore: data.masteryScore || (data.overallAccuracy ? Math.round(data.overallAccuracy * 100) : null),
              levelScores: data.levelScores || [],
              overallAccuracy: data.overallAccuracy || 0,
              overallConfidence: data.overallConfidence || 0,
              specificGaps: data.specificGaps || [],
              secondaryTypes: data.secondaryTypes || [],
            });
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'An unknown error occurred');
          setAnalyzing(false);
        }
      }
    };


    fetchAnalysis();


    return () => {
      cancelled = true;
    };
  }, [sessionData, reviewMode, reviewAnalysis, sessionId, history]);


  const handleMapComplete = () => {
    setShowingMap(false);
  };


  const handlePathComplete = () => {
    // Learning path completed - show congratulations
    setShowCongratulations(true);


    if (!hasPersistedCompletionRef.current && history?.updateSessionProgress && sessionId && analysisResult?.repairPath) {
      const totalSteps = analysisResult.repairPath.length;
      // Save completion with all analysis data
      history.updateSessionProgress(sessionId, totalSteps, undefined, {
        completedSteps: totalSteps,
        totalSteps,
        analysisResult: analysisResult,
        mindMapData: analysisResult.mindMap || null,
        repairPathData: analysisResult.repairPath || [],
        diagnosticSummary: analysisResult.diagnosticSummary || '',
        confusionType: analysisResult.confusionType || null,
        masteryScore: analysisResult.masteryScore || (analysisResult.overallAccuracy ? Math.round(analysisResult.overallAccuracy * 100) : null),
        levelScores: analysisResult.levelScores || [],
        overallAccuracy: analysisResult.overallAccuracy || 0,
        overallConfidence: analysisResult.overallConfidence || 0,
        specificGaps: analysisResult.specificGaps || [],
        secondaryTypes: analysisResult.secondaryTypes || [],
      });
      hasPersistedCompletionRef.current = true;
     
      // Refresh history to show the updated session
      if (history?.refreshInsightsTimestamp !== undefined) {
        useAppStore.getState().setRefreshInsightsTimestamp(Date.now());
      }
    }
  };


  const handleCongratulationsComplete = () => {
    // Reset to home screen
    useAppStore.getState().reset();
    setShowCongratulations(false);
    // Reload page to return to home
    window.location.reload();
  };


  if (analyzing) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: '#1A1A1A' }}>
        <div className="text-center gradient-border rounded-lg p-8">
          <div className="window-controls mb-4">
            <div className="window-dot window-dot-red"></div>
            <div className="window-dot window-dot-yellow"></div>
            <div className="window-dot window-dot-green"></div>
          </div>
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 mb-4" style={{ borderColor: '#FF4081' }}></div>
          <p className="text-lg mb-2" style={{ fontFamily: 'Poppins, sans-serif', color: '#FFFFFF', fontSize: '1.5rem' }}>Analyzing your responses...</p>
          <p className="text-sm" style={{ fontFamily: 'Poppins, sans-serif', color: '#F5D9E4' }}>This may take a few moments</p>
        </div>
      </div>
    );
  }


  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: '#1A1A1A' }}>
        <div className="gradient-border rounded-lg p-8 max-w-md">
          <div className="window-controls mb-4">
            <div className="window-dot window-dot-red"></div>
            <div className="window-dot window-dot-yellow"></div>
            <div className="window-dot window-dot-green"></div>
          </div>
          <div className="text-2xl mb-4" style={{ color: '#FF4081' }}>⚠️</div>
          <h2 className="text-xl mb-2" style={{ fontFamily: 'Poppins, sans-serif', color: '#FFFFFF', fontSize: '1.75rem' }}>Analysis Error</h2>
          <p className="mb-4" style={{ fontFamily: 'Poppins, sans-serif', color: '#F5D9E4' }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }


  if (showCongratulations) {
    return <Congratulations onComplete={handleCongratulationsComplete} />;
  }


  // Show analyzing state only if we're actually analyzing
  // Don't show it if we're in review mode or have existing analysis
  if (analyzing && !analysisResult && !error && !reviewMode && !reviewAnalysis) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: '#1A1A1A' }}>
        <div className="text-center gradient-border rounded-lg p-8">
          <div className="window-controls mb-4">
            <div className="window-dot window-dot-red"></div>
            <div className="window-dot window-dot-yellow"></div>
            <div className="window-dot window-dot-green"></div>
          </div>
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 mb-4" style={{ borderColor: '#FF4081' }}></div>
          <p className="text-lg mb-2" style={{ fontFamily: 'Poppins, sans-serif', color: '#FFFFFF', fontSize: '1.5rem' }}>Analyzing your responses...</p>
          <p className="text-sm" style={{ fontFamily: 'Poppins, sans-serif', color: '#F5D9E4' }}>This may take a few moments</p>
        </div>
      </div>
    );
  }


  // If we have reviewAnalysis but no analysisResult yet, wait for useEffect to set it
  if (!analysisResult && !reviewMode && !reviewAnalysis && !analyzing) {
    return null;
  }


  // Use reviewAnalysis if available, otherwise use analysisResult
  const displayResult = reviewAnalysis || analysisResult;
 
  if (!displayResult) {
    return null;
  }


  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#1A1A1A' }}>
      <div className="container mx-auto max-w-6xl">
        {/* Diagnostic Summary - Always shown first */}
        <DiagnosticSummary analysisResult={displayResult} />


        {/* Dependency Graph - Renders ONLY if showingMap is true AND a mindMap exists with nodes */}
{showingMap && displayResult.mindMap && displayResult.mindMap.nodes && displayResult.mindMap.nodes.length > 0 && (
  <div className="mt-8">
    <DependencyGraph
      mindMap={displayResult.mindMap}
      onComplete={handleMapComplete}
    />
  </div>
)}


{/* Repair Path - Renders ONLY if showingMap is false AND a repairPath exists */}
{!showingMap && displayResult.repairPath && (
  <div className="mt-8">
    <RepairPath
      steps={displayResult.repairPath}
      onComplete={handlePathComplete}
      sessionId={sessionId} // Pass the sessionId down
    />
  </div>
)}
      </div>
    </div>
  );
}



