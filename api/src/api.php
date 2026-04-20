<?php declare(strict_types=1);

function request_payload(): array
{
  static $payload = null;

  if ($payload === null) {
    $payload = json_decode(json: file_get_contents(filename: 'php://input'), associative: true) ?? [];
  }

  return is_array($payload) ? $payload : [];
}

function request_body(string $key): mixed
{
  return request_payload()[$key] ?? '';
}

function prompt_db(): string
{
  $services = ['Columns' => [], 'Rows' => []];
  foreach (get_services()[0] as $key => $value) {
    $services['Columns'][] = $key;
  }
  foreach (get_services() as $service) {
    $row = [];
    foreach ($service as $key => $value) {
      $row[] = $value;
    }
    $services['Rows'][] = $row;
  }
  return json_encode(value: $services);
}

function get_services_from_user_input(string $user_input): array
{
  $prompt = "You will be provided with a database of services and a prompt from the user. Use the user's request to search the database and identify the three services that would best assist the user with the issue they are having. Respond with only a valid, unformatted array of json objects containing the 'id', 'service_name', and a 'reason_for_selection' of why you believe that service would be helpful to them. Do not include any markdown formatting in your response. Services: " . prompt_db() . ' User input: ' . $user_input;
  $services = gemini(google_api_key: getenv(name: 'GOOGLE_API_KEY'), prompt: $prompt);
  $services = json_decode(json: $services, associative: true);

  $ids = [];
  foreach ($services as $service) {
    $ids[] = get_service(id: $service['id']);
  }
  return $ids;
}

function get_similar_services(int $id): array
{
  $services = ['Columns' => [], 'Rows' => []];
  foreach (get_services()[0] as $key => $value) {
    $services['Columns'][] = $key;
  }
  foreach (get_services() as $service) {
    $row = [];
    foreach ($service as $key => $value) {
      $row[] = $value;
    }
    $services['Rows'][] = $row;
  }
  $services = json_encode(value: $services);

  if (!$services)
    return [];

  $service = json_encode(value: get_service(id: $id));
  $prompt = "You will be provided with a database of services and a selected service from the user. Use the given service to search the database and identify the three services that are most similar to the given service. Respond with only a valid, unformatted array of json objects containing the 'id', 'service_name', and a 'reason_for_selection' of why you believe that service would be helpful to them. Do not include any markdown formatting in your response. Services: " . $services . 'Selected service: ' . $service;

  $attempts = 0;
  while ($attempts < 3) {
    $services = gemini(google_api_key: getenv(name: 'GOOGLE_API_KEY'), prompt: $prompt);
    $services = json_decode(json: $services, associative: true);
    if ($services) {
      break;
    }
    $attempts++;
  }

  $ids = [];
  foreach ($services as $service) {
    $ids[] = get_service(id: $service['id']);
  }
  return $ids;
}
