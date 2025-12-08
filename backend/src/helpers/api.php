<?php declare(strict_types=1);

function request_body(string $key): mixed
{
    return json_decode(json: file_get_contents(filename: 'php://input'), associative: true)[$key] ?? '';
}

function get_services_from_user_input(string $user_input): array
{
    $services = json_encode(value: get_services());
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
