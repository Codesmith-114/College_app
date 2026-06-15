export interface SubjectAttendance {
  id?: string;
  subjectName: string;
  attendedClasses: number;
  totalClasses: number;
  requiredPercentage: number;
}

export interface AttendanceStats {
  currentPercentage: number;
  isEligible: boolean;
  safeSkipCount: number;
  recoveryCount: number;
  status: 'safe' | 'warning' | 'borderline';
  message: string;
}

export function calculateSubjectStats(subject: SubjectAttendance): AttendanceStats {
  const { attendedClasses: attended, totalClasses: total, requiredPercentage: reqPercent } = subject;
  const req = reqPercent / 100;

  if (total === 0) {
    return {
      currentPercentage: 0,
      isEligible: false,
      safeSkipCount: 0,
      recoveryCount: 1,
      status: 'warning',
      message: 'No classes held yet. Attend the first class to start tracking.'
    };
  }

  const currentPercentage = parseFloat(((attended / total) * 100).toFixed(1));
  const isEligible = currentPercentage >= reqPercent;

  // Safeguard if attended is larger than total
  const adjustedAttended = Math.min(attended, total);

  if (isEligible) {
    // A / (T + x) >= R => x <= (A - R*T) / R
    const maxSkip = (adjustedAttended - req * total) / req;
    const safeSkipCount = Math.floor(Math.max(0, maxSkip));

    return {
      currentPercentage,
      isEligible,
      safeSkipCount,
      recoveryCount: 0,
      status: safeSkipCount > 0 ? 'safe' : 'borderline',
      message: safeSkipCount > 0
        ? `You can safely skip the next ${safeSkipCount} class${safeSkipCount > 1 ? 'es' : ''}.`
        : `Borderline! Skipping any class will make you ineligible.`
    };
  } else {
    // (A + y) / (T + y) >= R => y >= (R*T - A) / (1 - R)
    if (req >= 1) {
      return {
        currentPercentage,
        isEligible,
        safeSkipCount: 0,
        recoveryCount: Infinity,
        status: 'warning',
        message: '100% attendance required. Missed classes cannot be recovered.'
      };
    }

    const minRecover = (req * total - adjustedAttended) / (1 - req);
    const recoveryCount = Math.ceil(Math.max(0, minRecover));

    return {
      currentPercentage,
      isEligible,
      safeSkipCount: 0,
      recoveryCount,
      status: 'warning',
      message: `Attend the next ${recoveryCount} class${recoveryCount > 1 ? 'es' : ''} consecutively to recover eligibility.`
    };
  }
}
