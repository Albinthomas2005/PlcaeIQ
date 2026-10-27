<?php
/**
 * Authentication Endpoint
 * POST: Authenticates against database `users` and `students` tables
 */

require_once __DIR__ . '/../config.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'POST') {
    $input = getJsonInput();
    $rawIdentifier = $input['identifier'] ?? '';
    $rawPassword = $input['password'] ?? '';
    $roleHint = $input['roleHint'] ?? null;

    $clean = strtolower(trim($rawIdentifier));
    $cleanPass = trim($rawPassword);

    if ($clean === '') {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Please enter a valid Login ID.'
        ]);
        exit();
    }

    // 1. TPO Directorate Admin
    if ($clean === 'admin@placement.edu' || $clean === 'admin' || $roleHint === 'officer' || str_contains($clean, 'admin@')) {
        $stmt = $pdo->prepare("SELECT * FROM users WHERE role = 'officer' LIMIT 1");
        $stmt->execute();
        $adminUser = $stmt->fetch();

        echo json_encode([
            'success' => true,
            'role' => 'officer',
            'path' => '/officer',
            'user' => [
                'name' => $adminUser['name'] ?? 'Dr. Aris Thorne',
                'email' => $adminUser['email'] ?? 'admin@placement.edu',
                'role' => 'officer',
                'title' => 'Placement Directorate Head'
            ]
        ]);
        exit();
    }

    // 2. Recruiter Login
    if ($roleHint === 'company' || str_contains($clean, 'google') || str_contains($clean, 'recruiter') || str_contains($clean, 'hiring@')) {
        $stmtCmp = $pdo->prepare("SELECT * FROM companies LIMIT 1");
        $stmtCmp->execute();
        $company = $stmtCmp->fetch();

        echo json_encode([
            'success' => true,
            'role' => 'company',
            'path' => '/company',
            'user' => [
                'name' => $company['name'] ?? 'Google India',
                'email' => $company['email'] ?? 'campus-hiring@google.com',
                'role' => 'company',
                'companyId' => $company['id'] ?? 'cmp-1',
                'tier' => $company['tier'] ?? 'Tier 1 (Dream)'
            ]
        ]);
        exit();
    }

    // 3. Student Authentication: Look up from `users` and `students` tables
    // Check if matching shortcut "1", "2", "3" or "student 1", "student 2", "student 3"
    $targetStudentId = null;
    $expectedPassword = null;

    if ($clean === '1' || $clean === 'student 1' || $clean === 'student1' || $clean === 'std-1' || $roleHint === '1' || $roleHint === 'student-1') {
        $targetStudentId = 'std-1';
        $expectedPassword = '1';
    } elseif ($clean === '2' || $clean === 'student 2' || $clean === 'student2' || $clean === 'std-2' || $roleHint === '2' || $roleHint === 'student-2') {
        $targetStudentId = 'std-2';
        $expectedPassword = '2';
    } elseif ($clean === '3' || $clean === 'student 3' || $clean === 'student3' || $clean === 'std-3' || $roleHint === '3' || $roleHint === 'student-3') {
        $targetStudentId = 'std-3';
        $expectedPassword = '3';
    }

    $matchedStudent = null;
    if ($targetStudentId) {
        $stmt = $pdo->prepare("SELECT * FROM students WHERE id = :id OR roll_no = :roll LIMIT 1");
        $stmt->execute([':id' => $targetStudentId, ':roll' => $expectedPassword]);
        $matchedStudent = $stmt->fetch();
    } else {
        // Query by roll_no, email, id, or name from database
        $stmt = $pdo->prepare("
            SELECT * FROM students 
            WHERE LOWER(roll_no) = :clean 
               OR LOWER(email) = :clean 
               OR LOWER(id) = :clean 
               OR LOWER(name) = :clean
               OR LOWER(name) LIKE :cleanLike
            LIMIT 1
        ");
        $stmt->execute([
            ':clean' => $clean,
            ':cleanLike' => '%' . $clean . '%'
        ]);
        $matchedStudent = $stmt->fetch();

        if ($matchedStudent) {
            if ($matchedStudent['id'] === 'std-1' || $matchedStudent['roll_no'] === '1') {
                $expectedPassword = '1';
            } elseif ($matchedStudent['id'] === 'std-2' || $matchedStudent['roll_no'] === '2') {
                $expectedPassword = '2';
            } elseif ($matchedStudent['id'] === 'std-3' || $matchedStudent['roll_no'] === '3') {
                $expectedPassword = '3';
            }
        }
    }

    if (!$matchedStudent) {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Student record not found in database. Enter 1, 2, or 3.'
        ]);
        exit();
    }

    // Password validation against database/expected
    if ($expectedPassword !== null) {
        if ($cleanPass === '') {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => "Password is required for {$matchedStudent['name']}. Please enter: \"{$expectedPassword}\""
            ]);
            exit();
        }
        if ($cleanPass !== $expectedPassword) {
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'message' => "Incorrect password for {$matchedStudent['name']}! Expected password: \"{$expectedPassword}\""
            ]);
            exit();
        }
    }

    $formatted = formatStudent($matchedStudent);

    echo json_encode([
        'success' => true,
        'role' => 'student',
        'path' => '/student',
        'user' => [
            'name' => $formatted['name'],
            'email' => $formatted['email'],
            'role' => 'student',
            'studentId' => $formatted['id'],
            'cgpa' => $formatted['cgpa'],
            'branch' => $formatted['branchCode'],
            'rollNo' => $formatted['rollNo'],
            'avatar' => $formatted['avatar']
        ]
    ]);
    exit();
}

// Fallback for non-POST
echo json_encode([
    'status' => 'PlaceIQ Auth API ready'
]);
