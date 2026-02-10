<?php declare(strict_types=1);

require_once __DIR__ . '/src/database/database.php';
require_once __DIR__ . '/src/helpers/api.php';
require_once __DIR__ . '/src/helpers/email.php';
require_once __DIR__ . '/src/helpers/gemini.php';
require_once __DIR__ . '/src/helpers/loadenv.php';
require_once __DIR__ . '/src/helpers/uuidv4.php';

loadenv();

$path = parse_url(url: $_SERVER['REQUEST_URI'], component: PHP_URL_PATH);

try {
    header(header: 'Access-Control-Allow-Origin: *');
    header(header: 'Access-Control-Allow-Methods: *');
    header(header: 'Access-Control-Allow-Headers: *');
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
        echo json_encode(value: get_services());
        exit;
    }

    if ($path === '/service' && $_SERVER['REQUEST_METHOD'] === 'GET') {
        echo json_encode(value: get_service(id: (int) $_GET['id']));
        exit;
    }

    if ($path === '/create-service' && $_SERVER['REQUEST_METHOD'] === 'GET') {
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

    if ($path === '/delete-service' && $_SERVER['REQUEST_METHOD'] === 'GET') {
        header(header: 'Content-Type: text/html; charset=UTF-8');
        $service_request = get_service_request(id: $_GET['uuid']);
        if ($service_request) {
            delete_service(id: (int) $service_request['Body']);
            delete_service_request(id: $_GET['uuid']);
            echo service_request_success_page(message: 'Serivce successfully deleted!');
        } else {
            echo service_request_success_page(message: 'Sorry, the service deletion request has expired.');
        }
        clean_service_requests();
        exit;
    }

    if ($path === '/update-service' && $_SERVER['REQUEST_METHOD'] === 'GET') {
        header(header: 'Content-Type: text/html; charset=UTF-8');
        $service_request = get_service_request(id: $_GET['uuid']);
        if ($service_request) {
            update_service(service: json_decode(json: $service_request['Body'], associative: true));
            delete_service_request(id: $_GET['uuid']);
            echo service_request_success_page(message: 'Serivce successfully updated!');
        } else {
            echo service_request_success_page(message: 'Sorry, the service update request has expired.');
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

    if ($path === '/request-update-service' && $_SERVER['REQUEST_METHOD'] === 'POST') {
        header(header: 'Content-Type: application/json');
        request_service_update(service: request_body(key: 'service'));
        clean_service_requests();
        exit;
    }

    if ($path === '/request-delete-service' && $_SERVER['REQUEST_METHOD'] === 'POST') {
        header(header: 'Content-Type: application/json');
        request_service_deletion(id: request_body(key: 'id'));
        clean_service_requests();
        exit;
    }
} catch (Exception $exception) {
    echo 'Sorry, something went wrong.';
    error_log(message: $exception->getMessage());
}
