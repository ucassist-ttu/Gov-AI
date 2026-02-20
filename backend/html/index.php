<?php declare(strict_types=1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/database.php';
require_once __DIR__ . '/gemini.php';
require_once __DIR__ . '/loadenv.php';
require_once __DIR__ . '/email.php';
require_once __DIR__ . '/api.php';
loadenv();

function request_body(string $key): string
{
    return json_decode(json: file_get_contents(filename: 'php://input'), associative: true)[$key] ?? '';
}

function get_services_from_user_input(string $user_input): array
{
    $services = get_services();
    if (!$services)
        return [];

    $prompt = "Based on the user input, respond with exactly 3 services that most closely represent the user's needs. Respond with an integer array of service ids. Services: " . $services . ' User input: ' . $user_input;
    $ids = json_decode(json: gemini(google_api_key: getenv(name: 'GOOGLE_API_KEY'), prompt: $prompt), associative: true) ?: [];

    $services = [];
    foreach ($ids as $id) {
        $services[] = get_service(id: $id);
    }

    return $services;
}
function get_similar_services(int $id): array
{
  $services = json_encode(value: get_services());
  if (!$services)
    return [];

  $service = json_encode(value: get_service(id: $id));
  $prompt = 'Respond with only an integer array of the three most similar services in the database for the following service: ' . $service . '. Database: ' . $services;

  $ids = json_decode(json: gemini(google_api_key: getenv(name: 'GOOGLE_API_KEY'), prompt: $prompt), associative: true) ?: [];

  $services = [];
  foreach ($ids as $id) {
    $services[] = get_service(id: $id);
  }

  return $services;
}

$path = parse_url(url: $_SERVER['REQUEST_URI'], component: PHP_URL_PATH);

if ($path === '/prompt' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    header('Content-Type: application/json');

    try {
        $user_input = request_body('user_input');
        if (!$user_input) {
            throw new RuntimeException("user_input is required");
        }

        $services = get_services_from_user_input($user_input);

        echo json_encode([
            'success' => true,
            'services' => $services
        ]);

    } catch (Throwable $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => $e->getMessage()
        ]);
    }

    exit;
}
if ($path === '/recommendations' && $_SERVER['REQUEST_METHOD'] === 'GET') {
   echo json_encode(value: get_similar_services(id: (int) $_GET['id']));
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

if ($path === '/create-service' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    header(header: 'Content-Type: text/html; charset=UTF-8');
    $service_request = get_service_request(id: $_GET['uuid']);
    if ($service_request) {
        create_service(service: json_decode(json: $service_request['Body'], associative: true));
        delete_service_request(id: $_GET['uuid']);
        echo service_request_success_page(message: 'Serivce successfully created!');
    } else {
        echo service_request_success_page(message: 'Sorry, the service creation request has expired.');
    }
   clean_service_requests();
    exit;
}
if ($path === '/request-create-service' && $_SERVER['REQUEST_METHOD'] === 'POST') {
   header(header: 'Content-Type: application/json');
   request_service_creation(service: request_body(key: 'service'));
   clean_service_requests();
   exit;
}

if ($path === '/delete-service' && $_SERVER['REQUEST_METHOD'] === 'DELETE') {
    exit;
}

if ($path === '/update-service' && $_SERVER['REQUEST_METHOD'] === 'UPDATE') {
    exit;
}
if ($path === '/monthly-views' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    echo json_encode(value: get_monthly_views());
    exit;
}
if ($path === '/add-monthly-view' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    $success = add_monthly_views((int) $_GET['service_id']);

    echo json_encode(['success' => $success]);
    exit;
}


//if ($path === '/get-location' && $_SERVER['REQUEST_METHOD'] === 'POST') {
//	header('Content-Type: application/json');
//
//    try {
//        $latitude = request_body('latitude');
//        if (!$latitude) {
//            throw new RuntimeException("latitude is required");
//        }

//       	$longitude = request_body('longitude');
//        if (!$longitude) {
//            throw new RuntimeException("longitude is required");
//        }
//	$location = get_location($latitude, $longitude);
//        echo json_encode([
//            'success' => true,
//	    'location' => $location
//        ]);

//    } catch (Throwable $e) {
//        http_response_code(500);
//        echo json_encode([
//            'success' => false,
//            'error' => $e->getMessage()
//        ]);
//    }

//    exit;
//}

//function get_location(string $latitude, string $longitude): array
//{
//    $api_key = getenv(name: 'GOOGLE_API_KEY');

//    $url = "https://maps.googleapis.com/maps/api/geocode/json?latlng={$latitude},{$longitude}&key={$api_key}";
//    $location = file_get_contents($url);

//    if (!$location)
//        return [];

//    $data = json_decode($location, true);
//    return $data ?: [];

//}
