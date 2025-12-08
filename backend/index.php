<?php declare(strict_types=1);

require_once __DIR__ . '/src/database/database.php';
require_once __DIR__ . '/src/helpers/gemini.php';
require_once __DIR__ . '/src/helpers/loadenv.php';

loadenv();


header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

function request_body(string $key): string
{
    return json_decode(json: file_get_contents(filename: 'php://input'), associative: true)[$key] ?? '';
}

function get_services_from_user_input(string $user_input): array
{
    $services = get_services();
    if (!$services)
        return [];

    $prompt = "Based on the user input, respond with exactly 3 services that most closely represent the user's needs. Respond with an integer array of service ids. Services: " . json_encode($services) . ' User input: ' . $user_input;
    $ids = json_decode(json: gemini(google_api_key: getenv(name: 'GOOGLE_API_KEY'), prompt: $prompt), associative: true) ?: [];

    $services = [];
    foreach ($ids as $id) {
        $services[] = get_service(id: $id);
    }

    return $services;
}

$path = parse_url(url: $_SERVER['REQUEST_URI'], component: PHP_URL_PATH);

if ($path === '/prompt' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    header(header: 'Content-Type: application/json');
    echo json_encode(
        value: get_services_from_user_input(user_input: request_body(key: 'user_input')),
        flags: JSON_PRETTY_PRINT
    );
    exit;
}

// Database endpoints

if ($path === '/services' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    echo json_encode(value: get_services());
    exit;
}

if ($path === '/service' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    echo json_encode(value: get_service(id: (int) $_GET['id']));
    exit;
}

if ($path === '/create-service' && $_SERVER['REQUEST_METHOD'] === 'PUT') {
    exit;
}

if ($path === '/delete-service' && $_SERVER['REQUEST_METHOD'] === 'DELETE') {
    exit;
}

if ($path === '/update-service' && $_SERVER['REQUEST_METHOD'] === 'UPDATE') {
    exit;
}
