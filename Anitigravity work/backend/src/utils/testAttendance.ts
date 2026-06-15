import { calculateAttendanceStats } from './attendanceCalculator';

function runTests() {
  console.log('==================================================');
  console.log('STARTING ATTENDANCE CALCULATOR VERIFICATION SUITE');
  console.log('==================================================\n');

  let passedTests = 0;
  let failedTests = 0;

  function assert(condition: boolean, testName: string, failureDetails?: string) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passedTests++;
    } else {
      console.error(`[FAIL] ${testName}`);
      if (failureDetails) console.error(`       Detail: ${failureDetails}`);
      failedTests++;
    }
  }

  // Test Case 1: Zero classes held
  try {
    const stats = calculateAttendanceStats('Computer Networks', 0, 0, 75);
    assert(
      stats.currentPercentage === 0 && stats.safeSkipCount === 0 && stats.recoveryCount === 1,
      'Test Case 1: Handle Zero Classes Held (Attended: 0, Total: 0, Required: 75%)',
      `Expected % = 0, skips = 0, recovery = 1. Got % = ${stats.currentPercentage}, skips = ${stats.safeSkipCount}, recovery = ${stats.recoveryCount}`
    );
  } catch (err) {
    assert(false, 'Test Case 1: Handle Zero Classes Held', (err as Error).message);
  }

  // Test Case 2: Above threshold with room to skip (Attended: 80, Total: 100, Required: 75%)
  try {
    const stats = calculateAttendanceStats('Software Engineering', 80, 100, 75);
    assert(
      stats.currentPercentage === 80 && stats.safeSkipCount === 6 && stats.recoveryCount === 0 && stats.status === 'safe',
      'Test Case 2: Skip limits when attendance is high (Attended: 80, Total: 100, Required: 75%)',
      `Expected skips = 6. Got skips = ${stats.safeSkipCount}, status = ${stats.status}`
    );
  } catch (err) {
    assert(false, 'Test Case 2: Skip limits when attendance is high', (err as Error).message);
  }

  // Test Case 3: Exactly on the required percentage (Attended: 75, Total: 100, Required: 75%)
  try {
    const stats = calculateAttendanceStats('Discrete Mathematics', 75, 100, 75);
    assert(
      stats.currentPercentage === 75 && stats.safeSkipCount === 0 && stats.recoveryCount === 0 && stats.status === 'borderline',
      'Test Case 3: Boundary attendance (Attended: 75, Total: 100, Required: 75%)',
      `Expected skips = 0, recovery = 0, status = borderline. Got skips = ${stats.safeSkipCount}, recovery = ${stats.recoveryCount}, status = ${stats.status}`
    );
  } catch (err) {
    assert(false, 'Test Case 3: Boundary attendance', (err as Error).message);
  }

  // Test Case 4: Below threshold requiring recovery (Attended: 70, Total: 100, Required: 75%)
  try {
    const stats = calculateAttendanceStats('Automata Theory', 70, 100, 75);
    assert(
      stats.currentPercentage === 70 && stats.safeSkipCount === 0 && stats.recoveryCount === 20 && stats.status === 'bunk_warning',
      'Test Case 4: Recovery margin when attendance is low (Attended: 70, Total: 100, Required: 75%)',
      `Expected recovery = 20. Got recovery = ${stats.recoveryCount}, status = ${stats.status}`
    );
  } catch (err) {
    assert(false, 'Test Case 4: Recovery margin when attendance is low', (err as Error).message);
  }

  // Test Case 5: 100% requirement with a missed class (Attended: 9, Total: 10, Required: 100%)
  try {
    const stats = calculateAttendanceStats('Ethics', 9, 10, 100);
    assert(
      stats.currentPercentage === 90 && stats.recoveryCount === Infinity && stats.status === 'bunk_warning',
      'Test Case 5: Impossible recovery when 100% required (Attended: 9, Total: 10, Required: 100%)',
      `Expected recovery = Infinity. Got recovery = ${stats.recoveryCount}`
    );
  } catch (err) {
    assert(false, 'Test Case 5: Impossible recovery when 100% required', (err as Error).message);
  }

  console.log('\n==================================================');
  console.log(`VERIFICATION RESULT: ${passedTests} PASSED, ${failedTests} FAILED`);
  console.log('==================================================');
}

// Execute tests
runTests();
