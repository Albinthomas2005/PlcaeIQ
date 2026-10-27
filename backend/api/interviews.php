<?php
/**
 * Interviews API Endpoint
 * GET, POST, PUT for interview scheduling
 */

require_once __DIR__ . '/../config.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    $id = $_GET['id'] ?? null;
    $studentId = $_GET['studentId'] ?? null;

    if ($id) {
        $stmt = $pdo->prepare("SELECT * FROM interviews WHERE id = :id LIMIT 1");
        $stmt->execute([':id' => $id]);
        $i = $stmt->fetch();
        if ($i) {
            echo json_encode(['success' => true, 'data' => formatInterview($i)]);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Interview not found']);
        }
        exit();
    }

    if ($studentId) {
        $stmt = $pdo->prepare("SELECT * FROM interviews WHERE student_id = :sid ORDER BY date ASC, time ASC");
        $stmt->execute([':sid' => $studentId]);
        $rows = $stmt->fetchAll();
        echo json_encode(['success' => true, 'data' => array_map('formatInterview', $rows)]);
        exit();
    }

    $stmt = $pdo->query("SELECT * FROM interviews ORDER BY date ASC, time ASC");
    $rows = $stmt->fetchAll();
    echo json_encode(['success' => true, 'data' => array_map('formatInterview', $rows)]);
    exit();
}

if ($method === 'POST') {
    $input = getJsonInput();
    $id = $input['id'] ?? ('int-' . round(microtime(true) * 1000));
    $jobId = $input['jobId'] ?? $input['job_id'] ?? null;
    $studentId = $input['studentId'] ?? $input['student_id'] ?? null;
    $studentName = $input['studentName'] ?? 'Candidate';
    $studentRoll = $input['studentRoll'] ?? '';
    $companyName = $input['companyName'] ?? 'Recruitment Partner';
    $roundName = $input['roundName'] ?? 'Technical Assessment';
    $date = $input['date'] ?? date('Y-m-d', strtotime('+3 days'));
    $time = $input['time'] ?? '10:00 AM - 11:00 AM';
    $venueOrLink = $input['venueOrLink'] ?? $input['venue_or_link'] ?? 'Placement Directorate Room 101 / Online';
    $interviewer = $input['interviewer'] ?? 'Technical Evaluation Panel';
    $status = $input['status'] ?? 'Scheduled';
    $instructions = $input['instructions'] ?? 'Bring your resume and technical credentials.';

    // If studentId provided, fetch precise details
    if ($studentId) {
        $stmtS = $pdo->prepare("SELECT name, roll_no FROM students WHERE id = :sid");
        $stmtS->execute([':sid' => $studentId]);
        $sRow = $stmtS->fetch();
        if ($sRow) {
            $studentName = $sRow['name'];
            $studentRoll = $sRow['roll_no'];
        }
    }

    $stmt = $pdo->prepare("
        INSERT INTO interviews (id, job_id, student_id, student_name, student_roll, company_name, round_name, date, time, venue_or_link, interviewer, status, instructions)
        VALUES (:id, :job_id, :student_id, :student_name, :student_roll, :company_name, :round_name, :date, :time, :venue_or_link, :interviewer, :status, :instructions)
    ");

    $stmt->execute([
        ':id' => $id,
        ':job_id' => $jobId,
        ':student_id' => $studentId,
        ':student_name' => $studentName,
        ':student_roll' => $studentRoll,
        ':company_name' => $companyName,
        ':round_name' => $roundName,
        ':date' => $date,
        ':time' => $time,
        ':venue_or_link' => $venueOrLink,
        ':interviewer' => $interviewer,
        ':status' => $status,
        ':instructions' => $instructions
    ]);

    // Also update application status if matched
    if ($studentId && $jobId) {
        $stmtApp = $pdo->prepare("
            UPDATE applications 
            SET status = 'Interview', interview_round = :iround
            WHERE student_id = :sid AND job_id = :jid
        ");
        $stmtApp->execute([
            ':iround' => $roundName,
            ':sid' => $studentId,
            ':jid' => $jobId
        ]);
    }

    $stmtGet = $pdo->prepare("SELECT * FROM interviews WHERE id = :id");
    $stmtGet->execute([':id' => $id]);
    $created = $stmtGet->fetch();

    echo json_encode([
        'success' => true,
        'message' => "Interview scheduled for {$studentName} on {$date}!",
        'data' => formatInterview($created)
    ]);
    exit();
}

if ($method === 'PUT') {
    $input = getJsonInput();
    $id = $input['id'] ?? ($_GET['id'] ?? null);

    if (!$id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Interview ID is required']);
        exit();
    }

    $stmtOld = $pdo->prepare("SELECT * FROM interviews WHERE id = :id");
    $stmtOld->execute([':id' => $id]);
    $current = $stmtOld->fetch();

    if (!$current) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Interview not found']);
        exit();
    }

    $status = $input['status'] ?? $current['status'];
    $date = $input['date'] ?? $current['date'];
    $time = $input['time'] ?? $current['time'];
    $venueOrLink = $input['venueOrLink'] ?? $current['venue_or_link'];
    $instructions = $input['instructions'] ?? $current['instructions'];

    $stmt = $pdo->prepare("
        UPDATE interviews SET
            status = :status,
            date = :date,
            time = :time,
            venue_or_link = :venue,
            instructions = :inst
        WHERE id = :id
    ");

    $stmt->execute([
        ':id' => $id,
        ':status' => $status,
        ':date' => $date,
        ':time' => $time,
        ':venue' => $venueOrLink,
        ':inst' => $instructions
    ]);

    $stmtGet = $pdo->prepare("SELECT * FROM interviews WHERE id = :id");
    $stmtGet->execute([':id' => $id]);
    $updated = $stmtGet->fetch();

    echo json_encode([
        'success' => true,
        'message' => 'Interview schedule updated in database',
        'data' => formatInterview($updated)
    ]);
    exit();
}
