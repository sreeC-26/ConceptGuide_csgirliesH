const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeType = (type) => {
  if (!type || typeof type !== 'string') return 'Unknown';
  const trimmed = type.trim();
  return trimmed.length > 0 ? trimmed : 'Unknown';
};

export const extractConceptName = (session = {}) => {
  if (session.conceptName && typeof session.conceptName === 'string') {
    return session.conceptName.trim();
  }
  if (session.fullSelectedText && typeof session.fullSelectedText === 'string') {
    return session.fullSelectedText.slice(0, 80).trim();
  }
  if (session.selectedText && typeof session.selectedText === 'string') {
    return session.selectedText.slice(0, 80).trim();
  }
  if (session.pdfName && typeof session.pdfName === 'string') {
    return session.pdfName.trim();
  }
  return 'Unnamed Concept';
};

export function calculateCommonConfusionTypes(sessions = []) {
  if (!Array.isArray(sessions) || sessions.length === 0) {
    return { type: null, count: 0, percentage: 0, frequencyMap: {} };
  }

  const counts = sessions.reduce((acc, session) => {
    const type = normalizeType(session.confusionType);
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  let topType = null;
  let topCount = 0;

  Object.entries(counts).forEach(([type, count]) => {
    if (count > topCount) {
      topType = type;
      topCount = count;
    }
  });

  const percentage = sessions.length > 0 ? Math.round((topCount / sessions.length) * 100) : 0;

  return {
    type: topType,
    count: topCount,
    percentage,
    frequencyMap: counts,
  };
}

export function calculateAverageMasteryByType(sessions = []) {
  if (!Array.isArray(sessions) || sessions.length === 0) {
    return {};
  }

  const aggregates = sessions.reduce((acc, session) => {
    const type = normalizeType(session.confusionType);
    const mastery = toNumber(session.masteryScore, null);

    if (mastery === null) {
      return acc;
    }

    if (!acc[type]) {
      acc[type] = { total: 0, count: 0 };
    }

    acc[type].total += mastery;
    acc[type].count += 1;
    return acc;
  }, {});

  return Object.entries(aggregates).reduce((acc, [type, { total, count }]) => {
    acc[type] = count > 0 ? Math.round((total / count) * 10) / 10 : 0;
    return acc;
  }, {});
}

export function identifyWeakAreas(sessions = []) {
  if (!Array.isArray(sessions) || sessions.length === 0) {
    return [];
  }

  const weakSessions = sessions
    .filter((session) => {
      const mastery = toNumber(session.masteryScore, null);
      return mastery !== null && mastery < 70;
    })
    .map((session) => ({
      concept: extractConceptName(session),
      mastery: Math.round(toNumber(session.masteryScore, 0)),
      confusionType: normalizeType(session.confusionType),
    }));

  return weakSessions.slice(0, 5);
}

export function identifyStrongAreas(sessions = []) {
  if (!Array.isArray(sessions) || sessions.length === 0) {
    return [];
  }

  const strongSessions = sessions
    .filter((session) => {
      const mastery = toNumber(session.masteryScore, null);
      return mastery !== null && mastery >= 85;
    })
    .map((session) => ({
      concept: extractConceptName(session),
      mastery: Math.round(toNumber(session.masteryScore, 0)),
      confusionType: normalizeType(session.confusionType),
    }));

  return strongSessions.slice(0, 5);
}

export function calculateTotalStudyTime(sessions = []) {
  if (!Array.isArray(sessions) || sessions.length === 0) {
    return 0;
  }

  return sessions.reduce((total, session) => total + toNumber(session.timeSpent), 0);
}

const isWithinLastDays = (timestamp, days) => {
  if (!timestamp) return false;
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return false;
  const now = Date.now();
  const diff = now - date.getTime();
  const daysInMs = days * 24 * 60 * 60 * 1000;
  return diff >= 0 && diff <= daysInMs;
};

const averageMastery = (sessions = []) => {
  if (!sessions.length) return null;
  const validScores = sessions
    .map((session) => toNumber(session.masteryScore, null))
    .filter((score) => score !== null);

  if (!validScores.length) return null;

  const total = validScores.reduce((sum, score) => sum + score, 0);
  return Math.round((total / validScores.length) * 10) / 10;
};

export function detectLearningTrends(sessions = []) {
  if (!Array.isArray(sessions) || sessions.length === 0) {
    return {
      recentSessions: [],
      previousSessions: [],
      recentAverageMastery: null,
      previousAverageMastery: null,
      trend: 'steady',
      recentTotalTime: 0,
      previousTotalTime: 0,
    };
  }

  const recentSessions = sessions.filter((session) => isWithinLastDays(session.timestamp, 7));
  const previousSessions = sessions.filter((session) => !isWithinLastDays(session.timestamp, 7));

  const recentAverageMastery = averageMastery(recentSessions);
  const previousAverageMastery = averageMastery(previousSessions);

  let trend = 'steady';
  if (recentAverageMastery !== null && previousAverageMastery !== null) {
    if (recentAverageMastery - previousAverageMastery > 3) {
      trend = 'up';
    } else if (previousAverageMastery - recentAverageMastery > 3) {
      trend = 'down';
    }
  }

  return {
    recentSessions,
    previousSessions,
    recentAverageMastery,
    previousAverageMastery,
    trend,
    recentTotalTime: calculateTotalStudyTime(recentSessions),
    previousTotalTime: calculateTotalStudyTime(previousSessions),
  };
}
