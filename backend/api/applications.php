<?php
/**
 * Applications API Endpoint
 * GET, POST, PUT for student job applications
 */

require_once __DIR__ . '/../config.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    $id = $_GET['id'] ?? null;
    $studentId = $_GET['studentId'] ?? null;
    $jobId = $_GET['jobId'] ?? null;

    if ($id) {
        $stmt = $pdo->prepare("SELECT * FROM applications WHERE id = :id LIMIT 1");
        $stmt->execute([':id' => $id]);
        $a = $stmt->fetch();
        if ($a) {
            echo json_encode(['success' => true, 'data' => formatApplication($a)]);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Application not found']);
        }
        exit();
    }

    if ($studentId) {
        $stmt = $pdo->prepare("SELECT * FROM applications WHERE student_id = :sid ORDER BY applied_date DESC");
        $stmt->execute([':sid' => $studentId]);
        $rows = $stmt->fetchAll();
        echo json_encode(['success' => true, 'data' => array_map('formatApplication', $rows)]);
        exit();
    }

    if ($jobId) {
        $stmt = $pdo->prepare("SELECT * FROM applications WHERE job_id = :jid ORDER BY applied_date DESC");
        $stmt->execute([':jid' => $jobId]);
        $rows = $stmt->fetchAll();
        echo json_encode(['success' => true, 'data' => array_map('formatApplication', $rows)]);
        exit();
    }

    $stmt = $pdo->query("SELECT * FROM applications ORDER BY applied_date DESC");
    $rows = $stmt->fetchAll();
    echo json_encode(['success' => true, 'data' => array_map('formatApplication', $rows)]);
    exit();
}

if ($method === 'POST') {
    $input = getJsonInput();
    $jobId = $input['jobId'] ?? $input['job_id'] ?? null;
    $studentId = $input['studentId'] ?? $input['student_id'] ?? null;
    $notes = $input['note'] ?? $input['notes'] ?? 'Application submitted via student portal';

    if (!$jobId || !$studentId) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Both jobId and studentId are required']);
        exit();
    }

    // Check duplicate
    $stmtCheck = $pdo->prepare("SELECT id FROM applications WHERE job_id = :jid AND student_id = :sid");
    $stmtCheck->execute([':jid' => $jobId, ':sid' => $studentId]);
    if ($stmtCheck->fetch()) {
        http_response_code(409);
        echo json_encode(['success' => false, 'message' => 'Application already registered for this job']);
        exit();
    }

    // Fetch Job & Student details
    $stmtJob = $pdo->prepare("SELECT * FROM jobs WHERE id = :jid");
    $stmtJob->execute([':jid' => $jobId]);
    $job = $stmtJob->fetch();

    $stmtStd = $pdo->prepare("SELECT * FROM students WHERE id = :sid");
    $stmtStd->execute([':sid' => $studentId]);
    $std = $stmtStd->fetch();

    if (!$job || !$std) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Job or Student not found in database']);
        exit();
    }

    $id = 'app-' . round(microtime(true) * 1000);
    $appliedDate = date('Y-m-d');
    $status = 'Applied';
    $interviewRound = 'Application Under Review';

    $stmt = $pdo->prepare("
        INSERT INTO applications (id, job_id, student_id, student_name, student_roll, student_branch, student_cgpa, company_id, company_name, job_title, applied_date, status, offered_package, notes, interview_round)
        VALUES (:id, :job_id, :student_id, :student_name, :student_roll, :student_branch, :student_cgpa, :company_id, :company_name, :job_title, :applied_date, :status, :offered_package, :notes, :interview_round)
    ");

    $stmt->execute([
        ':id' => $id,
        ':job_id' => $job['id'],
        ':student_id' => $std['id'],
        ':student_name' => $std['name'],
        ':student_roll' => $std['roll_no'],
        ':student_branch' => $std['branch_code'],
        ':student_cgpa' => $std['cgpa'],
        ':company_id' => $job['company_id'],
        ':company_name' => $job['company_name'],
        ':job_title' => $job['title'],
        ':applied_date' => $appliedDate,
        ':status' => $status,
        ':offered_package' => null,
        ':notes' => $notes,
        ':interview_round' => $interviewRound
    ]);

    $stmtGet = $pdo->prepare("SELECT * FROM applications WHERE id = :id");
    $stmtGet->execute([':id' => $id]);
    $created = $stmtGet->fetch();

    echo json_encode([
        'success' => true,
        'message' => "Application submitted successfully for {$job['title']}!",
        'data' => formatApplication($created)
    ]);
    exit();
}

if ($method === 'PUT') {
    $input = getJsonInput();
    $id = $input['id'] ?? ($_GET['id'] ?? null);
    $newStatus = $input['status'] ?? null;
    $offeredPackage = $input['offeredPackage'] ?? null;

    if (!$id || !$newStatus) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Application ID and status are required']);
        exit();
    }

    $stmtOld = $pdo->prepare("SELECT * FROM applications WHERE id = :id");
    $stmtOld->execute([':id' => $id]);
    $current = $stmtOld->fetch();

    if (!$current) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Application not found']);
        exit();
    }

    $interviewRound = $current['interview_round'];
    if ($newStatus === 'Offered') {
        $interviewRound = 'Final HR / Offer Extended';
        if (!$offeredPackage) {
            $stmtJ = $pdo->prepare("SELECT package_display FROM jobs WHERE id = :jid");
            $stmtJ->execute([':jid' => $current['job_id']]);
            $jRow = $stmtJ->fetch();
            $offeredPackage = $jRow['package_display'] ?? 'Offer Confirmed';
        }
        // Also update student status to Placed
        $stmtUpStd = $pdo->prepare("UPDATE students SET status = 'Placed', placed_company = :pcomp, placed_package = :ppkg WHERE id = :sid");
        $stmtUpStd->execute([
            ':pcomp' => $current['company_name'],
            ':ppkg' => $offeredPackage,
            ':sid' => $current['student_id']
        ]);
    }

    $stmt = $pdo->prepare("
        UPDATE applications SET
            status = :status,
            offered_package = :pkg,
            interview_round = :iround
        WHERE id = :id
    ");

    $stmt->execute([
        ':id' => $id,
        ':status' => $newStatus,
        ':pkg' => $offeredPackage,
        ':iround' => $interviewRound
    ]);

    $stmtGet = $pdo->prepare("SELECT * FROM applications WHERE id = :id");
    $stmtGet->execute([':id' => $id]);
    $updated = $stmtGet->fetch();

    echo json_encode([
        'success' => true,
        'message' => "Candidate status updated to {$newStatus}",
        'data' => formatApplication($updated)
    ]);
    exit();
}
