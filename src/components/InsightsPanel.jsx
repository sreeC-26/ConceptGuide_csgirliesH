import { memo, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import {
  calculateCommonConfusionTypes,
  calculateAverageMasteryByType,
  identifyWeakAreas,
  identifyStrongAreas,
  calculateTotalStudyTime,
  detectLearningTrends,
  extractConceptName,
} from '../utils/analyzeHistory.js';

const CARD_BASE_CLASSES = 'rounded-2xl border border-pink-500/30 bg-gradient-to-br from-[#2B1B2F] via-[#1D1421] to-[#1A1A1A] p-4 shadow-lg shadow-pink-500/10';
const SECTION_TITLE_CLASSES = 'flex items-center gap-2 text-lg font-semibold text-white';
const BADGE_CLASSES = 'inline-flex items-center gap-2 rounded-full border border-pink-500/40 bg-pink-500/15 px-3 py-1 text-xs font-semibold text-pink-100 uppercase tracking-wide';

const iconMap = {
  commonConfusion: '📊',
  strongAreas: '💪',
  weakAreas: '🎯',
  studyTime: '⏱️',
  aiInsight: '🔮',
  trendUp: '🚀',
  trendDown: '✨',
  trendSteady: '🌈',
};

function formatMinutes(minutes = 0) {
  if (!minutes || minutes <= 0) return '0 min';
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  if (hours > 0) {
    return `${hours}h${mins > 0 ? ` ${mins}m` : ''}`;
  }
  return `${mins} min`;
}

function buildLocalInsights(sessions = []) {
  if (!Array.isArray(sessions) || sessions.length === 0) {
    return { insights: [], metadata: {} };
  }

  const commonConfusion = calculateCommonConfusionTypes(sessions);
  const averageMasteryByType = calculateAverageMasteryByType(sessions);
  const weakAreas = identifyWeakAreas(sessions);
  const strongAreas = identifyStrongAreas(sessions);
  const totalStudyTime = calculateTotalStudyTime(sessions);
  const trends = detectLearningTrends(sessions);

  const strongestType = Object.entries(averageMasteryByType).reduce(
    (acc, [type, score]) => {
      if (score === null || score === undefined) return acc;
      if (!acc || score > acc.score) {
        return { type, score };
      }
      return acc;
    },
    null,
  );

  const weakestType = Object.entries(averageMasteryByType).reduce(
    (acc, [type, score]) => {
      if (score === null || score === undefined) return acc;
      if (!acc || score < acc.score) {
        return { type, score };
      }
      return acc;
    },
    null,
  );

  const insights = [];

  if (commonConfusion.type) {
    insights.push({
      key: 'commonConfusion',
      icon: iconMap.commonConfusion,
      title: 'Most Frequent Confusion',
      description:
        commonConfusion.count > 0
          ? `${commonConfusion.type} shows up in ${commonConfusion.percentage}% of your sessions. A quick refresher on the foundations could unlock a breakthrough.`
          : 'No stand-out confusion types yet — awesome progress!',
      accent: 'from-pink-500/20 to-purple-500/10',
    });
  }

  if (strongestType && strongestType.score >= 0) {
    insights.push({
      key: 'strongestType',
      icon: iconMap.strongAreas,
      title: 'Strongest Concept Area',
      description: `${strongestType.type} mastery averages ${strongestType.score}% — an incredible foundation to build on. Consider exploring advanced topics here!`,
      accent: 'from-green-500/20 to-emerald-500/10',
    });
  }

  if (weakestType && weakestType.score >= 0) {
    insights.push({
      key: 'weakestType',
      icon: iconMap.weakAreas,
      title: 'Growth Opportunity',
      description: `${weakestType.type} sits at about ${weakestType.score}% mastery. A little targeted practice will level this up quickly.`,
      accent: 'from-amber-500/20 to-orange-500/10',
    });
  }

  if (weakAreas.length > 0) {
    insights.push({
      key: 'weakAreasList',
      icon: iconMap.weakAreas,
      title: 'Focus Concepts',
      description: `Give extra attention to ${weakAreas
        .map((area) => area.concept)
        .slice(0, 3)
        .join(', ')} — mastering these will boost your confidence.`,
      accent: 'from-orange-500/20 to-red-500/10',
      list: weakAreas.slice(0, 3).map((area) => `${area.concept} • ${area.mastery}%`),
    });
  }

  if (strongAreas.length > 0) {
    insights.push({
      key: 'strongAreasList',
      icon: iconMap.strongAreas,
      title: 'Recent Wins',
      description: `${strongAreas[0].concept} is shining at around ${strongAreas[0].mastery}% mastery. Celebrate the win and keep going!`,
      accent: 'from-emerald-500/20 to-green-500/10',
      list: strongAreas.slice(0, 3).map((area) => `${area.concept} • ${area.mastery}%`),
    });
  }

  const studyTimeRecent = formatMinutes(trends.recentTotalTime);
  const studyTimeTotal = formatMinutes(totalStudyTime);

  insights.push({
    key: 'studyTime',
    icon: iconMap.studyTime,
    title: 'Study Momentum',
    description:
      trends.recentTotalTime > 0
        ? `You dedicated ${studyTimeRecent} this past week — consistent effort is fueling your growth!`
        : `You've invested ${studyTimeTotal} in your learning journey so far — every minute counts!`,
    accent: 'from-pink-500/15 to-purple-500/10',
  });

  const trendInsight = {
    up: 'Your mastery trend is rising — keep the momentum going with another focused session soon!',
    down: 'Mastery dipped slightly recently. Revisiting earlier wins can help you bounce back quickly.',
    steady: 'Your learning pace is steady. Try a short stretch goal to spark your next breakthrough.',
  };

  insights.push({
    key: 'trend',
    icon:
      trends.trend === 'up'
        ? iconMap.trendUp
        : trends.trend === 'down'
        ? iconMap.trendDown
        : iconMap.trendSteady,
    title: 'Learning Trend',
    description: trendInsight[trends.trend || 'steady'],
    accent:
      trends.trend === 'up'
        ? 'from-green-500/20 to-emerald-500/10'
        : trends.trend === 'down'
        ? 'from-red-500/20 to-rose-500/10'
        : 'from-indigo-500/20 to-blue-500/10',
  });

  return {
    insights,
    metadata: {
      totalStudyTime,
      strongAreas,
      weakAreas,
      trends,
      commonConfusion,
      averageMasteryByType,
    },
  };
}

async function fetchAIInsights(sessions = []) {
  const response = await fetch('/api/generate-insights', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sessions: sessions.map((session) => ({
        confusionType: session.confusionType,
        masteryScore: session.masteryScore,
        conceptName: extractConceptName(session),
      })),
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error?.message || 'Failed to generate AI insights');
  }

  const data = await response.json();
  if (!Array.isArray(data.insights)) {
    return [];
  }

  return data.insights.filter(Boolean).slice(0, 5);
}

export default function InsightsPanel({ sessions = [], onRefresh }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [aiInsights, setAiInsights] = useState([]);
  const [error, setError] = useState(null);

  const hasSessions = Array.isArray(sessions) && sessions.length > 0;

  const { insights: localInsights } = useMemo(() => buildLocalInsights(sessions), [sessions]);

  useEffect(() => {
    let isMounted = true;

    const loadAIInsights = async () => {
      if (!hasSessions) {
        setAiInsights([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const insights = await fetchAIInsights(sessions);
        if (isMounted) {
          setAiInsights(insights);
        }
      } catch (err) {
        console.error('Failed to load AI insights:', err);
        if (isMounted) {
          setError('Unable to generate personalized insights right now.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadAIInsights();

    return () => {
      isMounted = false;
    };
  }, [sessions, hasSessions]);

  const handleRefresh = async () => {
    if (!hasSessions) return;

    setIsLoading(true);
    setError(null);

    try {
      const insights = await fetchAIInsights(sessions);
      setAiInsights(insights);
      if (typeof onRefresh === 'function') {
        onRefresh();
      }
    } catch (err) {
      console.error('Failed to refresh AI insights:', err);
      setError('Unable to refresh insights at the moment.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!hasSessions) {
    return (
      <div className="mb-6 rounded-2xl border border-pink-500/20 bg-pink-500/10 p-6 text-center text-pink-100">
        <div className="text-2xl mb-2">✨</div>
        <h3 className="text-lg font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Your learning insights will appear here
        </h3>
        <p className="text-sm text-pink-200/70" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Complete a study session to unlock personalized feedback and encouragement tailored just for you.
        </p>
      </div>
    );
  }

  return (
    <div className="mb-6 overflow-hidden rounded-3xl border border-pink-500/25 bg-[#1A1A1A]/90" style={{ boxShadow: '0 20px 40px -25px rgba(255, 64, 129, 0.5)' }}>
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="flex w-full items-center justify-between px-6 py-5 text-left transition hover:bg-pink-500/10"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">✨</span>
          <div>
            <h3 className="text-xl font-semibold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Your Learning Insights
            </h3>
            <p className="text-sm text-pink-200/70" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Celebrate wins, spot patterns, and discover your next best moves.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              handleRefresh();
            }}
            className={clsx(
              'flex items-center gap-2 rounded-full border border-pink-500/40 px-4 py-2 text-sm font-semibold text-pink-100 transition focus:outline-none focus:ring-2 focus:ring-pink-400/60',
              isLoading ? 'opacity-60 cursor-wait' : 'hover:bg-pink-500/10',
            )}
            disabled={isLoading}
          >
            <span className={clsx('inline-block transition-transform', isLoading && 'animate-spin')}>
              🔄
            </span>
            Refresh Insights
          </button>
          <span
            className={clsx(
              'grid h-10 w-10 place-content-center rounded-full border border-pink-500/40 text-xl text-pink-200 transition',
              isExpanded ? 'bg-pink-500/20 rotate-0' : 'bg-[#1A1A1A] rotate-180',
            )}
          >
            ⌃
          </span>
        </div>
      </button>

      <div
        className={clsx(
          'grid gap-4 px-6 pb-6 transition-all duration-300 ease-out',
          isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr] pt-0',
        )}
      >
        <div className={clsx('overflow-hidden transition-opacity duration-300', isExpanded ? 'opacity-100 pt-4' : 'opacity-0')}>
          {error && (
            <div className="mb-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {error}
            </div>
          )}

          <div className="grid gap-4 lg:grid-cols-2">
            {localInsights.map((insight) => (
              <div
                key={insight.key}
                className={clsx(CARD_BASE_CLASSES, insight.accent)}
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{insight.icon}</span>
                  <h4 className="text-lg font-semibold text-white">{insight.title}</h4>
                </div>
                <p className="mt-2 text-sm text-pink-100/80 leading-relaxed">{insight.description}</p>
                {Array.isArray(insight.list) && insight.list.length > 0 && (
                  <ul className="mt-3 space-y-2 text-sm text-pink-100/70">
                    {insight.list.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <span className="text-pink-300">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-pink-500/20 bg-pink-500/10 p-5" style={{ fontFamily: 'Poppins, sans-serif' }}>
            <div className={SECTION_TITLE_CLASSES}>
              <span className="text-2xl">🔮</span>
              <span>Personalized AI Encouragement</span>
            </div>
            <p className="mt-2 text-sm text-pink-100/70">
              Smart suggestions crafted just for you, based on your study patterns.
            </p>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {isLoading && (
                <div className="col-span-full flex items-center gap-3 rounded-xl border border-pink-500/30 bg-[#221420] px-4 py-3 text-sm text-pink-100/70">
                  <span className="text-xl animate-spin">🌟</span>
                  <span>Summoning fresh insights...</span>
                </div>
              )}

              {!isLoading && aiInsights.length === 0 && !error && (
                <div className="col-span-full rounded-xl border border-pink-500/30 bg-[#221420] px-4 py-3 text-sm text-pink-100/70">
                  We're analyzing your history to craft tailored recommendations. Check back after a few more sessions!
                </div>
              )}

              {aiInsights.map((insight) => (
                <div
                  key={insight}
                  className="rounded-xl border border-pink-500/30 bg-[#241628] px-4 py-3 text-sm text-pink-100/90 shadow-md shadow-pink-500/10"
                >
                  {insight}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
