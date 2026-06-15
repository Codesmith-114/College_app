/**
 * Utility functions for calculating safe skip limits and class recovery margins.
 */

export interface AttendanceAnalytics {
  subjectName: string;
  attendedClasses: number;
  totalClasses: number;
  requiredPercentage: number;
  currentPercentage: number;
  status: 'safe' | 'bunk_warning' | 'borderline';
  safeSkipCount: number; // How many classes can be skipped safely
  recoveryCount: number; // How many consecutive classes must be attended to recover
  message: string;
}

/**
 * Calculates attendance analytics for a single subject.
 */
export function calculateAttendanceStats(
  subjectName: string,
  attended: number,
  total: number,
  requiredPercent: number = 75
): AttendanceAnalytics {
  const req = requiredPercent / 100;
  
  // Edge Case 1: Total classes is 0
  if (total === 0) {
    return {
      subjectName,
      attendedClasses: attended,
      totalClasses: total,
      requiredPercentage: requiredPercent,
      currentPercentage: 0,
      status: 'bunk_warning',
      safeSkipCount: 0,
      recoveryCount: 1, // Must attend at least 1 class to initialize
      message: 'No classes held yet. Attend the first class to start tracking.'
    };
  }

  const currentPercent = (attended / total) * 100;

  // Edge Case 2: Attended classes is somehow greater than total classes
  const adjustedAttended = Math.min(attended, total);
  const percentage = (adjustedAttended / total);

  let safeSkipCount = 0;
  let recoveryCount = 0;
  let status: 'safe' | 'bunk_warning' | 'borderline' = 'borderline';
  let message = '';

  if (percentage >= req) {
    // We are above or at the threshold. Calculate Safe Skip Count
    // A / (T + x) >= R => x <= (A - R*T) / R
    // We use the adjustedAttended to avoid infinite skippings if attended > total
    const maxSkip = (adjustedAttended - req * total) / req;
    safeSkipCount = Math.floor(Math.max(0, maxSkip));
    
    if (safeSkipCount > 0) {
      status = 'safe';
      message = `You can safely skip next ${safeSkipCount} class${safeSkipCount > 1 ? 'es' : ''}.`;
    } else {
      status = 'borderline';
      message = `You cannot skip any classes. Doing so will drop you below ${requiredPercent}%.`;
    }
  } else {
    // We are below the threshold. Calculate Recovery Margin
    // (A + y) / (T + y) >= R => y >= (R*T - A) / (1 - R)
    if (req >= 1) {
      // If university demands 100% attendance and we missed a class, we can never recover to 100%!
      recoveryCount = Infinity;
      status = 'bunk_warning';
      message = `100% attendance required. You have already missed a class and cannot recover.`;
    } else {
      const minRecover = (req * total - adjustedAttended) / (1 - req);
      recoveryCount = Math.ceil(Math.max(0, minRecover));
      status = 'bunk_warning';
      message = `Attend next ${recoveryCount} class${recoveryCount > 1 ? 'es' : ''} consecutively to reach ${requiredPercent}%.`;
    }
  }

  return {
    subjectName,
    attendedClasses: attended,
    totalClasses: total,
    requiredPercentage: requiredPercent,
    currentPercentage: parseFloat(currentPercent.toFixed(2)),
    status,
    safeSkipCount,
    recoveryCount,
    message
  };
}

/**
 * Calculates aggregate stats across multiple subjects.
 */
export function calculateOverallStats(subjects: { attendedClasses: number; totalClasses: number }[], requiredPercent: number = 75) {
  let totalAttended = 0;
  let totalHeld = 0;

  subjects.forEach(s => {
    totalAttended += s.attendedClasses;
    totalHeld += s.totalClasses;
  });

  const percentage = totalHeld > 0 ? (totalAttended / totalHeld) * 100 : 0;

  return {
    totalAttended,
    totalHeld,
    percentage: parseFloat(percentage.toFixed(2)),
    isEligible: percentage >= requiredPercent
  };
}
