<?php declare(strict_types=1);

$path = parse_url(url: $_SERVER['REQUEST_URI'], component: PHP_URL_PATH);

if ($path === '/prompt' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    header(header: 'Content-Type: application/json');
    echo json_encode(value: get_services_from_user_input(user_input: request_body(key: 'user_input')));
    exit;
}

if ($path === '/recommendations' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    header(header: 'Content-Type: application/json');
    echo json_encode(value: get_similar_services(id: request_body(key: 'service_id')));
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
    create_service(service: request_body(key: 'service'));
    exit;
}

if ($path === '/delete-service' && $_SERVER['REQUEST_METHOD'] === 'DELETE') {
    delete_service(id: (int) request_body(key: 'id'));
    exit;
}

if ($path === '/update-service' && $_SERVER['REQUEST_METHOD'] === 'PUT') {
    update_service(service: request_body(key: 'service'));
    exit;
}
