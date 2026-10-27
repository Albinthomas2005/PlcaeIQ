<?php
/**
 * Campus Recruitment Drives (Jobs) API Endpoint
 * GET, POST, PUT, DELETE for placement job listings
 */

require_once __DIR__ . '/../config.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    $id = $_GET['id'] ?? null;
    $companyId = $_GET['companyId'] ?? null;

    if ($id) {
        $stmt = $pdo->prepare("SELECT * FROM jobs WHERE id = :id LIMIT 1");
        $stmt->execute([':id' => $id]);
        $j = $stmt->fetch();
        if ($j) {
            echo json_encode(['success' => true, 'data' => formatJob($j)]);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Job listing not found']);
        }
        exit();
    }

    if ($companyId) {
        $stmt = $pdo->prepare("SELECT * FROM jobs WHERE company_id = :cid ORDER BY id DESC");
        $stmt->execute([':cid' => $companyId]);
        $rows = $stmt->fetchAll();
        echo json_encode(['success' => true, 'data' => array_map('formatJob', $rows)]);
        exit();
    }

    $stmt = $pdo->query("SELECT * FROM jobs ORDER BY id ASC");
    $rows = $stmt->fetchAll();
    echo json_encode(['success' => true, 'data' => array_map('formatJob', $rows)]);
    exit();
}

if ($method === 'POST') {
    $input = getJsonInput();
    $id = $input['id'] ?? ('job-' . round(microtime(true) * 1000));
    $companyId = $input['companyId'] ?? $input['company_id'] ?? 'cmp-1';
    $companyName = $input['companyName'] ?? $input['company_name'] ?? 'Google India';
    $title = $input['title'] ?? 'Software Engineer';
    $type = $input['type'] ?? 'Full-time';
    $role = $input['role'] ?? 'Engineering';
    $location = $input['location'] ?? 'Bengaluru';
    $packageCtc = (float)($input['packageCtc'] ?? $input['package_ctc'] ?? 15.0);
    $packageDisplay = $input['packageDisplay'] ?? $input['package_display'] ?? ('₹' . $packageCtc . ' LPA');
    $stipend = $input['stipend'] ?? null;
    $minCgpa = (float)($input['minCgpa'] ?? $input['min_cgpa'] ?? 6.5);
    $allowedBranches = is_array($input['allowedBranches'] ?? null) ? json_encode($input['allowedBranches']) : json_encode(['CSE', 'IT', 'ECE']);
    $maxBacklogs = (int)($input['maxBacklogs'] ?? $input['max_backlogs'] ?? 0);
    $deadline = $input['deadline'] ?? date('Y-m-d', strtotime('+30 days'));
    $postedDate = $input['postedDate'] ?? $input['posted_date'] ?? date('Y-m-d');
    $status = $input['status'] ?? 'Open';
    $vacancies = (int)($input['vacancies'] ?? 10);
    $rounds = is_array($input['rounds'] ?? null) ? json_encode($input['rounds']) : json_encode(['Online Test', 'Technical Round', 'HR Interview']);
    $description = $input['description'] ?? '';

    $stmt = $pdo->prepare("
        INSERT INTO jobs (id, company_id, company_name, title, type, role, location, package_ctc, package_display, stipend, min_cgpa, allowed_branches, max_backlogs, deadline, posted_date, status, vacancies, rounds, description)
        VALUES (:id, :company_id, :company_name, :title, :type, :role, :location, :package_ctc, :package_display, :stipend, :min_cgpa, :allowed_branches, :max_backlogs, :deadline, :posted_date, :status, :vacancies, :rounds, :description)
    ");

    $stmt->execute([
        ':id' => $id,
        ':company_id' => $companyId,
        ':company_name' => $companyName,
        ':title' => $title,
        ':type' => $type,
        ':role' => $role,
        ':location' => $location,
        ':package_ctc' => $packageCtc,
        ':package_display' => $packageDisplay,
        ':stipend' => $stipend,
        ':min_cgpa' => $minCgpa,
        ':allowed_branches' => $allowedBranches,
        ':max_backlogs' => $maxBacklogs,
        ':deadline' => $deadline,
        ':posted_date' => $postedDate,
        ':status' => $status,
        ':vacancies' => $vacancies,
        ':rounds' => $rounds,
        ':description' => $description
    ]);

    $stmtGet = $pdo->prepare("SELECT * FROM jobs WHERE id = :id");
    $stmtGet->execute([':id' => $id]);
    $created = $stmtGet->fetch();

    echo json_encode([
        'success' => true,
        'message' => "Drive published: {$title}!",
        'data' => formatJob($created)
    ]);
    exit();
}

if ($method === 'PUT') {
    $input = getJsonInput();
    $id = $input['id'] ?? ($_GET['id'] ?? null);

    if (!$id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Job ID is required']);
        exit();
    }

    $stmtOld = $pdo->prepare("SELECT * FROM jobs WHERE id = :id");
    $stmtOld->execute([':id' => $id]);
    $current = $stmtOld->fetch();

    if (!$current) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Job listing not found']);
        exit();
    }

    $title = $input['title'] ?? $current['title'];
    $type = $input['type'] ?? $current['type'];
    $role = $input['role'] ?? $current['role'];
    $location = $input['location'] ?? $current['location'];
    $packageCtc = isset($input['packageCtc']) ? (float)$input['packageCtc'] : (float)$current['package_ctc'];
    $packageDisplay = $input['packageDisplay'] ?? $input['package_display'] ?? ('₹' . $packageCtc . ' LPA');
    $stipend = array_key_exists('stipend', $input) ? $input['stipend'] : $current['stipend'];
    $minCgpa = isset($input['minCgpa']) ? (float)$input['minCgpa'] : (float)$current['min_cgpa'];
    $allowedBranches = isset($input['allowedBranches']) ? (is_array($input['allowedBranches']) ? json_encode($input['allowedBranches']) : $input['allowedBranches']) : $current['allowed_branches'];
    $maxBacklogs = isset($input['maxBacklogs']) ? (int)$input['maxBacklogs'] : (int)$current['max_backlogs'];
    $deadline = $input['deadline'] ?? $current['deadline'];
    $status = $input['status'] ?? $current['status'];
    $vacancies = isset($input['vacancies']) ? (int)$input['vacancies'] : (int)$current['vacancies'];
    $rounds = isset($input['rounds']) ? (is_array($input['rounds']) ? json_encode($input['rounds']) : $input['rounds']) : $current['rounds'];
    $description = $input['description'] ?? $current['description'];

    $stmt = $pdo->prepare("
        UPDATE jobs SET
            title = :title,
            type = :type,
            role = :role,
            location = :location,
            package_ctc = :package_ctc,
            package_display = :package_display,
            stipend = :stipend,
            min_cgpa = :min_cgpa,
            allowed_branches = :allowed_branches,
            max_backlogs = :max_backlogs,
            deadline = :deadline,
            status = :status,
            vacancies = :vacancies,
            rounds = :rounds,
            description = :description
        WHERE id = :id
    ");

    $stmt->execute([
        ':id' => $id,
        ':title' => $title,
        ':type' => $type,
        ':role' => $role,
        ':location' => $location,
        ':package_ctc' => $packageCtc,
        ':package_display' => $packageDisplay,
        ':stipend' => $stipend,
        ':min_cgpa' => $minCgpa,
        ':allowed_branches' => $allowedBranches,
        ':max_backlogs' => $maxBacklogs,
        ':deadline' => $deadline,
        ':status' => $status,
        ':vacancies' => $vacancies,
        ':rounds' => $rounds,
        ':description' => $description
    ]);

    $stmtGet = $pdo->prepare("SELECT * FROM jobs WHERE id = :id");
    $stmtGet->execute([':id' => $id]);
    $updated = $stmtGet->fetch();

    echo json_encode([
        'success' => true,
        'message' => 'Job listing updated in database',
        'data' => formatJob($updated)
    ]);
    exit();
}

if ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!$id) {
        $input = getJsonInput();
        $id = $input['id'] ?? null;
    }

    if (!$id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Job ID is required']);
        exit();
    }

    $stmt = $pdo->prepare("DELETE FROM jobs WHERE id = :id");
    $stmt->execute([':id' => $id]);

    echo json_encode(['success' => true, 'message' => 'Job listing archived']);
    exit();
}
