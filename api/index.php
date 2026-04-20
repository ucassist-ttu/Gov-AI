<?php declare(strict_types=1);

require_once __DIR__ . '/src/loadenv.php';
require_once __DIR__ . '/src/database.php';
require_once __DIR__ . '/src/api.php';
require_once __DIR__ . '/src/gemini.php';

load_env();

// TODO: Replace wildcard CORS with an explicit allowlist before production hardening.
header(header: 'Access-Control-Allow-Origin: *');
header(header: 'Access-Control-Allow-Methods: GET, POST, OPTIONS');
header(header: 'Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(response_code: 204);
    exit;
}

$path = $_GET['route'] ?? parse_url(url: $_SERVER['REQUEST_URI'], component: PHP_URL_PATH);

if ($path === '/prompt' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    header(header: 'Content-Type: application/json');
    echo json_encode(value: get_services_from_user_input(user_input: request_body(key: 'user_input')));
    exit;
}

if ($path === '/recommendations' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    header(header: 'Content-Type: application/json');
    echo json_encode(value: get_similar_services(id: (int) request_body(key: 'service_id')));
    exit;
}

// Database endpoints

if ($path === '/services' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    header(header: 'Content-Type: application/json');
    echo json_encode(value: get_services());
    exit;
}

if ($path === '/service' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    header(header: 'Content-Type: application/json');
    echo json_encode(value: get_service(id: (int) $_GET['id']));
}
if ($path === '/monthly-views' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    header(header: 'Content-Type: application/json');
    echo json_encode(value: get_monthly_views());
    exit;
}
if ($path === '/add-monthly-view' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    $success = add_monthly_views((int) $_GET['service_id']);

    header(header: 'Content-Type: application/json');
    echo json_encode(['success' => $success]);
    exit;
}
if ($path === '/page-analytics' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    header(header: 'Content-Type: application/json');
    echo json_encode(value: get_page_analytics());
    exit;
}
if ($path === '/add-page-analytics' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $success = add_page_analytics(request_payload());

    header(header: 'Content-Type: application/json');
    echo json_encode(['success' => $success]);
    exit;
}
if ($path === '/search-analytics' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    header(header: 'Content-Type: application/json');
    echo json_encode(value: get_search_analytics());
    exit;
}
if ($path === '/add-search-analytics' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $success = add_search_analytics(request_payload());

    header(header: 'Content-Type: application/json');
    echo json_encode(['success' => $success]);
    exit;
}
