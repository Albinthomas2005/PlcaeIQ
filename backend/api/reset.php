<?php
/**
 * Reset API Endpoint
 * Re-seeds the database to factory recruitment state and returns all synchronized data
 */

require_once __DIR__ . '/../config.php';

// Include seed script
ob_start();
require __DIR__ . '/../seed.php';
$output = ob_get_clean();

// Fetch fresh synchronized data
$students = array_map('formatStudent', $pdo->query("SELECT * FROM students ORDER BY id ASC")->fetchAll());
$companies = array_map('formatCompany', $pdo->query("SELECT * FROM companies ORDER BY id ASC")->fetchAll());
$jobs = array_map('formatJob', $pdo->query("SELECT * FROM jobs ORDER BY id ASC")->fetchAll());
$applications = array_map('formatApplication', $pdo->query("SELECT * FROM applications ORDER BY applied_date DESC")->fetchAll());
$interviews = array_map('formatInterview', $pdo->query("SELECT * FROM interviews ORDER BY date ASC, time ASC")->fetchAll());

echo json_encode([
    'success' => true,
    'message' => 'Database successfully synchronized and reset to baseline placement directory!',
    'data' => [
        'students' => $students,
        'companies' => $companies,
        'jobs' => $jobs,
        'applications' => $applications,
        'interviews' => $interviews
    ]
]);
