<?php declare(strict_types=1);

require_once __DIR__ . '/src/loadenv.php';
require_once __DIR__ . '/src/database.php';
require_once __DIR__ . '/src/distance.php';
require_once __DIR__ . '/src/api.php';
require_once __DIR__ . '/src/gemini.php';

load_env();

// TODO: Replace wildcard CORS with an explicit allowlist before production hardening.
header(header: 'Access-Control-Allow-Origin: *');
header(header: 'Access-Control-Allow-Methods: GET, POST, OPTIONS');
header(header: 'Access-Control-Allow-Headers: Content-Type');

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'OPTIONS') {
    http_response_code(response_code: 204);
    exit;
}

$path = $_GET['route'] ?? parse_url(url: $_SERVER['REQUEST_URI'], component: PHP_URL_PATH);

if ($path === '/prompt' && $method === 'POST') {
    json_response(get_services_from_user_input(
        user_input: request_body(key: 'user_input'),
        user_county: (string) request_value(['user_county', 'county'], ''),
        user_latitude: request_value(['user_latitude', 'latitude', 'lat']),
        user_longitude: request_value(['user_longitude', 'longitude', 'lng', 'lon']),
    ));
    exit;
}

if ($path === '/recommendations' && ($method === 'GET' || $method === 'POST')) {
    $service_id = (int) request_value(['service_id', 'id'], 0);
    if ($service_id <= 0) {
        json_response(['error' => 'Missing service id.'], 400);
        exit;
    }

    json_response(get_similar_services(id: $service_id));
    exit;
}

// Database endpoints

if ($path === '/services' && $method === 'GET') {
    json_response(get_services());
    exit;
}

if ($path === '/service' && $method === 'GET') {
    json_response(get_service(id: (int) ($_GET['id'] ?? 0)));
    exit;
}

if ($path === '/service-coordinates' && $method === 'GET') {
    $service_id = (int) request_value(['service_id', 'id'], 0);
    if ($service_id <= 0) {
        json_response(['error' => 'Missing service id.'], 400);
        exit;
    }

    $service = get_service($service_id);
    if ($service === []) {
        json_response(['error' => 'Service not found.'], 404);
        exit;
    }

    $coordinates = hydrate_service_coordinates($service, false);
    if ($coordinates === []) {
        json_response(['error' => 'Service coordinates not found.'], 404);
        exit;
    }

    json_response($coordinates);
    exit;
}

if ($path === '/monthly-views' && $method === 'GET') {
    json_response(get_monthly_views());
    exit;
}

if ($path === '/add-monthly-view' && $method === 'GET') {
    $success = add_monthly_views((int) $_GET['service_id']);

    json_response(['success' => $success]);
    exit;
}

if ($path === '/page-analytics' && $method === 'GET') {
    json_response(get_page_analytics());
    exit;
}

if ($path === '/add-page-analytics' && $method === 'POST') {
    $success = add_page_analytics(request_payload());

    json_response(['success' => $success]);
    exit;
}

if ($path === '/search-analytics' && $method === 'GET') {
    json_response(get_search_analytics());
    exit;
}

if ($path === '/add-search-analytics' && $method === 'POST') {
    $success = add_search_analytics(request_payload());

    json_response(['success' => $success]);
    exit;
}

// Minimal emailjs-branch replacements

if ($path === '/referral' && $method === 'POST') {
    json_response(create_referral(request_payload()), 201);
    exit;
}

if ($path === '/referral' && $method === 'GET') {
    $referral = get_referral((int) request_value(['id'], 0));
    if ($referral === []) {
        json_response(['error' => 'Referral not found.'], 404);
        exit;
    }

    json_response($referral);
    exit;
}

if ($path === '/create-service' && ($method === 'GET' || $method === 'POST')) {
    $id = (string) request_value(['id', 'uuid'], '');
    if ($id === '') {
        json_response(['error' => 'Missing pending service id.'], 400);
        exit;
    }

    $service_request = get_service_request($id);
    if ($service_request === []) {
        json_response(['error' => 'Pending service not found.'], 404);
        exit;
    }

    $created_service = approve_service_request($id);
    if ($created_service === []) {
        json_response(['error' => 'Pending service could not be created.'], 422);
        exit;
    }

    json_response($created_service);
    exit;
}

json_response(['error' => 'Route not found.'], 404);
