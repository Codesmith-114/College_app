import math

def calculate_attendance_stats(subject_name, attended, total, required_percent=75):
    req = required_percent / 100.0
    
    if total == 0:
        return {
            'subject_name': subject_name,
            'attended_classes': attended,
            'total_classes': total,
            'required_percentage': required_percent,
            'current_percentage': 0,
            'status': 'bunk_warning',
            'safe_skip_count': 0,
            'recovery_count': 1,
            'message': 'No classes held yet. Attend the first class to start tracking.'
        }

    current_percent = (attended / total) * 100.0
    adjusted_attended = min(attended, total)
    percentage = (adjusted_attended / total)

    safe_skip_count = 0
    recovery_count = 0
    status = 'borderline'
    message = ''

    if percentage >= req:
        max_skip = (adjusted_attended - req * total) / req
        safe_skip_count = math.floor(max(0.0, max_skip))
        
        if safe_skip_count > 0:
            status = 'safe'
            message = f"You can safely skip next {safe_skip_count} class{'es' if safe_skip_count > 1 else ''}."
        else:
            status = 'borderline'
            message = f"You cannot skip any classes. Doing so will drop you below {required_percent}%."
    else:
        if req >= 1.0:
            recovery_count = float('inf')
            status = 'bunk_warning'
            message = f"100% attendance required. You have already missed a class and cannot recover."
        else:
            min_recover = (req * total - adjusted_attended) / (1.0 - req)
            recovery_count = math.ceil(max(0.0, min_recover))
            status = 'bunk_warning'
            message = f"Attend next {recovery_count} class{'es' if recovery_count > 1 else ''} consecutively to reach {required_percent}%."

    return {
        'subject_name': subject_name,
        'attended_classes': attended,
        'total_classes': total,
        'required_percentage': required_percent,
        'current_percentage': round(current_percent, 2),
        'status': status,
        'safe_skip_count': safe_skip_count,
        'recovery_count': recovery_count,
        'message': message
    }

def run_tests():
    print('==================================================')
    print('STARTING PYTHON ATTENDANCE CALCULATOR VERIFICATION')
    print('==================================================\n')

    passed_tests = 0
    failed_tests = 0

    def assert_test(condition, test_name, failure_details=None):
        nonlocal passed_tests, failed_tests
        if condition:
            print(f'[PASS] {test_name}')
            passed_tests += 1
        else:
            print(f'[FAIL] {test_name}')
            if failure_details:
                print(f'       Detail: {failure_details}')
            failed_tests += 1

    # Test Case 1: Zero classes held
    try:
        stats = calculate_attendance_stats('Computer Networks', 0, 0, 75)
        assert_test(
            stats['current_percentage'] == 0 and stats['safe_skip_count'] == 0 and stats['recovery_count'] == 1,
            'Test Case 1: Handle Zero Classes Held (Attended: 0, Total: 0, Required: 75%)',
            f"Expected % = 0, skips = 0, recovery = 1. Got % = {stats['current_percentage']}, skips = {stats['safe_skip_count']}, recovery = {stats['recovery_count']}"
        )
    except Exception as e:
        assert_test(False, 'Test Case 1: Handle Zero Classes Held', str(e))

    # Test Case 2: Above threshold with room to skip (Attended: 80, Total: 100, Required: 75%)
    try:
        stats = calculate_attendance_stats('Software Engineering', 80, 100, 75)
        assert_test(
            stats['current_percentage'] == 80 and stats['safe_skip_count'] == 6 and stats['recovery_count'] == 0 and stats['status'] == 'safe',
            'Test Case 2: Skip limits when attendance is high (Attended: 80, Total: 100, Required: 75%)',
            f"Expected skips = 6. Got skips = {stats['safe_skip_count']}, status = {stats['status']}"
        )
    except Exception as e:
        assert_test(False, 'Test Case 2: Skip limits when attendance is high', str(e))

    # Test Case 3: Exactly on the required percentage (Attended: 75, Total: 100, Required: 75%)
    try:
        stats = calculate_attendance_stats('Discrete Mathematics', 75, 100, 75)
        assert_test(
            stats['current_percentage'] == 75 and stats['safe_skip_count'] == 0 and stats['recovery_count'] == 0 and stats['status'] == 'borderline',
            'Test Case 3: Boundary attendance (Attended: 75, Total: 100, Required: 75%)',
            f"Expected skips = 0, recovery = 0, status = borderline. Got skips = {stats['safe_skip_count']}, recovery = {stats['recovery_count']}, status = {stats['status']}"
        )
    except Exception as e:
        assert_test(False, 'Test Case 3: Boundary attendance', str(e))

    # Test Case 4: Below threshold requiring recovery (Attended: 70, Total: 100, Required: 75%)
    try:
        stats = calculate_attendance_stats('Automata Theory', 70, 100, 75)
        assert_test(
            stats['current_percentage'] == 70 and stats['safe_skip_count'] == 0 and stats['recovery_count'] == 20 and stats['status'] == 'bunk_warning',
            'Test Case 4: Recovery margin when attendance is low (Attended: 70, Total: 100, Required: 75%)',
            f"Expected recovery = 20. Got recovery = {stats['recovery_count']}, status = {stats['status']}"
        )
    except Exception as e:
        assert_test(False, 'Test Case 4: Recovery margin when attendance is low', str(e))

    # Test Case 5: 100% requirement with a missed class (Attended: 9, Total: 10, Required: 100%)
    try:
        stats = calculate_attendance_stats('Ethics', 9, 10, 100)
        assert_test(
            stats['current_percentage'] == 90 and stats['recovery_count'] == float('inf') and stats['status'] == 'bunk_warning',
            'Test Case 5: Impossible recovery when 100% required (Attended: 9, Total: 10, Required: 100%)',
            f"Expected recovery = inf. Got recovery = {stats['recovery_count']}"
        )
    except Exception as e:
        assert_test(False, 'Test Case 5: Impossible recovery when 100% required', str(e))

    print('\n==================================================')
    print(f'VERIFICATION RESULT: {passed_tests} PASSED, {failed_tests} FAILED')
    print('==================================================')

if __name__ == '__main__':
    run_tests()
