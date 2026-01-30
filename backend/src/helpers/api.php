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

  $prompt = "You will be provided with a database of services and a prompt from the user. Use the user's request to search the database and identify the three services that would best assist the user with the issue they are having. Respond with only a valid, unformatted array of json objects containing the 'id', 'service_name', and a 'reason_for_selection' of why you believe that service would be helpful to them. Do not include any markdown formatting in your response. Services: " . $services . ' User input: ' . $user_input;
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
    $ids[] = $service['id'];
  }

  return $ids;
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
