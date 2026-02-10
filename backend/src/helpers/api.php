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
    $ids[] = get_service(id: $service['id']);
  }
  return $ids;
}

function get_similar_services(int $id): array
{
  $services = json_encode(value: get_services());
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

function service_request_success_page(string $message): string
{
  return "
  <!DOCTYPE html>
  <html lang='en'>
    <head>
      <meta charset='UTF-8'>
      <meta name='viewport' content='width=device-width, initial-scale=1.0'>
      <title>{$message}</title>
    </head>
    <body style='margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center; text-align: center;'>
      <div>
        <h1>{$message}</h1>
        <a href='https://ucassist-ttu.github.io/Gov-AI/'>Click here to return to website</a>
      </div>
    </body>
</html>";
}
