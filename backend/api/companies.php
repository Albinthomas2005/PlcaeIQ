<?php
/**
 * Companies API Endpoint
 * GET, POST, PUT, DELETE operations for partner hiring companies
 */

require_once __DIR__ . '/../config.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    $id = $_GET['id'] ?? null;
    if ($id) {
        $stmt = $pdo->prepare("SELECT * FROM companies WHERE id = :id LIMIT 1");
        $stmt->execute([':id' => $id]);
        $c = $stmt->fetch();
        if ($c) {
            echo json_encode(['success' => true, 'data' => formatCompany($c)]);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Company not found']);
        }
        exit();
    }

    $stmt = $pdo->query("SELECT * FROM companies ORDER BY id ASC");
    $rows = $stmt->fetchAll();
    $data = array_map('formatCompany', $rows);

    echo json_encode(['success' => true, 'data' => $data]);
    exit();
}

if ($method === 'POST') {
    $input = getJsonInput();
    $id = $input['id'] ?? ('cmp-' . round(microtime(true) * 1000));
    $name = $input['name'] ?? 'New Company';
    $industry = $input['industry'] ?? 'Technology';
    $website = $input['website'] ?? 'https://example.com';
    $location = $input['location'] ?? 'Bengaluru / Pan India';
    $hrContact = $input['hrContact'] ?? $input['hr_contact'] ?? 'HR University Relations';
    $email = $input['email'] ?? 'hiring@example.com';
    $tier = $input['tier'] ?? 'Tier 2 (Core)';
    $status = $input['status'] ?? 'Active';
    $logo = $input['logo'] ?? 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg';
    $totalHires = (int)($input['totalHires'] ?? $input['total_hires'] ?? 0);
    $avgPackage = $input['avgPackage'] ?? $input['avg_package'] ?? '10.0 LPA';
    $description = $input['description'] ?? '';

    $stmt = $pdo->prepare("
        INSERT INTO companies (id, name, industry, website, location, hr_contact, email, tier, status, logo, total_hires, avg_package, description)
        VALUES (:id, :name, :industry, :website, :location, :hr_contact, :email, :tier, :status, :logo, :total_hires, :avg_package, :description)
    ");

    $stmt->execute([
        ':id' => $id,
        ':name' => $name,
        ':industry' => $industry,
        ':website' => $website,
        ':location' => $location,
        ':hr_contact' => $hrContact,
        ':email' => $email,
        ':tier' => $tier,
        ':status' => $status,
        ':logo' => $logo,
        ':total_hires' => $totalHires,
        ':avg_package' => $avgPackage,
        ':description' => $description
    ]);

    $stmtGet = $pdo->prepare("SELECT * FROM companies WHERE id = :id");
    $stmtGet->execute([':id' => $id]);
    $created = $stmtGet->fetch();

    echo json_encode([
        'success' => true,
        'message' => "Company {$name} registered in database!",
        'data' => formatCompany($created)
    ]);
    exit();
}

if ($method === 'PUT') {
    $input = getJsonInput();
    $id = $input['id'] ?? ($_GET['id'] ?? null);

    if (!$id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Company ID is required']);
        exit();
    }

    $stmtOld = $pdo->prepare("SELECT * FROM companies WHERE id = :id");
    $stmtOld->execute([':id' => $id]);
    $current = $stmtOld->fetch();

    if (!$current) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Company not found']);
        exit();
    }

    $name = $input['name'] ?? $current['name'];
    $industry = $input['industry'] ?? $current['industry'];
    $website = $input['website'] ?? $current['website'];
    $location = $input['location'] ?? $current['location'];
    $hrContact = $input['hrContact'] ?? $input['hr_contact'] ?? $current['hr_contact'];
    $email = $input['email'] ?? $current['email'];
    $tier = $input['tier'] ?? $current['tier'];
    $status = $input['status'] ?? $current['status'];
    $logo = $input['logo'] ?? $current['logo'];
    $totalHires = isset($input['totalHires']) ? (int)$input['totalHires'] : (int)$current['total_hires'];
    $avgPackage = $input['avgPackage'] ?? $input['avg_package'] ?? $current['avg_package'];
    $description = $input['description'] ?? $current['description'];

    $stmt = $pdo->prepare("
        UPDATE companies SET
            name = :name,
            industry = :industry,
            website = :website,
            location = :location,
            hr_contact = :hr_contact,
            email = :email,
            tier = :tier,
            status = :status,
            logo = :logo,
            total_hires = :total_hires,
            avg_package = :avg_package,
            description = :description
        WHERE id = :id
    ");

    $stmt->execute([
        ':id' => $id,
        ':name' => $name,
        ':industry' => $industry,
        ':website' => $website,
        ':location' => $location,
        ':hr_contact' => $hrContact,
        ':email' => $email,
        ':tier' => $tier,
        ':status' => $status,
        ':logo' => $logo,
        ':total_hires' => $totalHires,
        ':avg_package' => $avgPackage,
        ':description' => $description
    ]);

    $stmtGet = $pdo->prepare("SELECT * FROM companies WHERE id = :id");
    $stmtGet->execute([':id' => $id]);
    $updated = $stmtGet->fetch();

    echo json_encode([
        'success' => true,
        'message' => 'Company details updated in database',
        'data' => formatCompany($updated)
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
        echo json_encode(['success' => false, 'message' => 'Company ID is required']);
        exit();
    }

    $stmt = $pdo->prepare("DELETE FROM companies WHERE id = :id");
    $stmt->execute([':id' => $id]);

    echo json_encode(['success' => true, 'message' => 'Company removed from database']);
    exit();
}
