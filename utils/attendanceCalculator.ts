// utils/attendanceCalculator.ts

export interface AttendanceStats {
    attended: number;
    total: number;
    mandateThreshold?: number; // Usually 0.75 (75%)
}

export function calculateAttendanceMargins({ attended, total, mandateThreshold = 0.75 }: AttendanceStats) {
    if (total === 0) {
        return {
            status: 'NO_DATA',
            safeSkips: 0,
            classesToRecover: 0,
            currentPercentage: 0
        };
    }

    const currentPercentage = attended / total;

    // Safe Skip Calculation
    // Formula: (Attended) / (Total + Skips) >= Threshold
    // Skips <= (Attended / Threshold) - Total
    let safeSkips = Math.floor((attended / mandateThreshold) - total);

    // Recovery Calculation
    // Formula: (Attended + Recovery) / (Total + Recovery) >= Threshold
    // Recovery >= (Threshold * Total - Attended) / (1 - Threshold)
    let classesToRecover = Math.ceil((mandateThreshold * total - attended) / (1 - mandateThreshold));

    // Clean up edge cases
    if (safeSkips < 0) safeSkips = 0;
    if (classesToRecover < 0) classesToRecover = 0;

    // Determine status
    let status = 'SAFE';
    if (currentPercentage < mandateThreshold - 0.1) {
        status = 'CRITICAL';
    } else if (currentPercentage < mandateThreshold) {
        status = 'AT_RISK';
    }

    return {
        currentPercentage: Number((currentPercentage * 100).toFixed(1)),
        isSafe: currentPercentage >= mandateThreshold,
        safeSkips,
        classesToRecover,
        status
    };
}

export function getAttendanceColor(percentage: number): string {
    if (percentage >= 75) return '#10b981'; // Green
    if (percentage >= 65) return '#f59e0b'; // Orange
    return '#ef4444'; // Red
}

// Example Usage:
// const stats = calculateAttendanceMargins({ attended: 30, total: 35, mandateThreshold: 0.75 });
// returns: {
//   currentPercentage: 85.7,
//   isSafe: true,
//   safeSkips: 5,
//   classesToRecover: 0,
//   status: 'SAFE'
// }
