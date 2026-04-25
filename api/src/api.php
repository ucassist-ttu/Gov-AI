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

function request_value(array $keys, mixed $default = null): mixed
{
  foreach ($keys as $key) {
    if (array_key_exists($key, $_GET)) {
      return $_GET[$key];
    }
  }

  $payload = request_payload();
  foreach ($keys as $key) {
    if (array_key_exists($key, $payload)) {
      return $payload[$key];
    }
  }

  return $default;
}

function json_response(mixed $value, int $status = 200): void
{
  http_response_code(response_code: $status);
  header(header: 'Content-Type: application/json');
  echo json_encode(value: $value);
}

function prompt_db(array $user_location = []): string
{
  return json_encode(value: build_prompt_service_dataset($user_location));
}

function build_prompt_service_dataset(array $user_location = []): array
{
  $dataset = [];

  foreach (get_services() as $service) {
    $service_counties = extract_service_counties($service);
    $coordinates = hydrate_service_coordinates($service, false);

    $record = [
      'ID' => (int) ($service['ID'] ?? 0),
      'NameOfService' => (string) ($service['NameOfService'] ?? ''),
      'OrganizationName' => (string) ($service['OrganizationName'] ?? ''),
      'ServiceDescription' => (string) ($service['ServiceDescription'] ?? ''),
      'ProgramCriteria' => (string) ($service['ProgramCriteria'] ?? ''),
      'Keywords' => $service['Keywords'] ?? '',
      'CountiesAvailable' => $service_counties,
      'ServiceAddress' => (string) ($service['ServiceAddress'] ?? ''),
      'CityStateZip' => (string) ($service['CityStateZip'] ?? ''),
    ];

    if ($coordinates !== []) {
      $record['ServiceCoordinates'] = [
        'latitude' => round((float) $coordinates['latitude'], 6),
        'longitude' => round((float) $coordinates['longitude'], 6),
      ];
    }

    if (($user_location['county'] ?? '') !== '') {
      $record['MatchesUserCounty'] = service_matches_user_county(
        $service_counties,
        (string) $user_location['county']
      );
    }

    if (
      isset($record['ServiceCoordinates']) &&
      isset($user_location['latitude'], $user_location['longitude']) &&
      $user_location['latitude'] !== null &&
      $user_location['longitude'] !== null
    ) {
      $record['DistanceFromUserMiles'] = round(
        haversine(
          lat1: (float) $user_location['latitude'],
          lon1: (float) $user_location['longitude'],
          lat2: (float) $record['ServiceCoordinates']['latitude'],
          lon2: (float) $record['ServiceCoordinates']['longitude']
        ),
        1
      );
    }

    $dataset[] = $record;
  }

  return $dataset;
}

function normalize_request_float(mixed $value): ?float
{
  if (is_int($value) || is_float($value)) {
    return (float) $value;
  }

  $text = trim((string) $value);
  if ($text === '' || !is_numeric($text)) {
    return null;
  }

  return (float) $text;
}

function normalize_county_name(string $value): string
{
  $county = strtolower(trim($value));
  if ($county === '' || in_array($county, ['all', 'null', 'undefined'], true)) {
    return '';
  }

  $county = str_replace(['_', '-'], ' ', $county);
  $county = preg_replace('/\s+county$/', '', $county) ?? $county;
  $county = preg_replace('/\s+/', ' ', $county) ?? $county;

  return trim($county);
}

function service_matches_user_county(array $service_counties, string $user_county): bool
{
  $normalized_user_county = normalize_county_name($user_county);
  if ($normalized_user_county === '') {
    return false;
  }

  foreach ($service_counties as $county) {
    if (normalize_county_name($county) === $normalized_user_county) {
      return true;
    }
  }

  return false;
}

function build_user_location_context(string $user_county, mixed $user_latitude, mixed $user_longitude): array
{
  $normalized_county = normalize_county_name($user_county);
  $latitude = normalize_request_float($user_latitude);
  $longitude = normalize_request_float($user_longitude);
  $source = '';

  if ($latitude !== null && $longitude !== null) {
    $source = 'coordinates';
  } elseif ($normalized_county !== '') {
    $county_coordinates = get_county_coordinate($normalized_county);
    if ($county_coordinates !== []) {
      $latitude = (float) $county_coordinates['latitude'];
      $longitude = (float) $county_coordinates['longitude'];
      $source = 'county-center';
    }
  }

  return [
    'county' => $normalized_county,
    'latitude' => $latitude,
    'longitude' => $longitude,
    'source' => $source,
  ];
}

function get_services_from_user_input(
  string $user_input,
  string $user_county = '',
  mixed $user_latitude = null,
  mixed $user_longitude = null
): array
{
  $user_location = build_user_location_context($user_county, $user_latitude, $user_longitude);
  $location_context = [
    'county' => $user_location['county'] !== '' ? $user_location['county'] : null,
  ];

  if ($user_location['latitude'] !== null && $user_location['longitude'] !== null) {
    $location_context['reference_coordinates'] = [
      'latitude' => round((float) $user_location['latitude'], 6),
      'longitude' => round((float) $user_location['longitude'], 6),
      'source' => $user_location['source'],
    ];
  }

  $prompt = "You will be provided with a database of services, the user's location context, and a prompt from the user. Use the user's request to identify the three services that would best assist them. Prioritize relevance to the stated need first, then use location information to prefer services in the user's county or services that are physically closer when they are still a strong fit. Use MatchesUserCounty and DistanceFromUserMiles when present. If the best topical match is farther away, you may still recommend it, but account for distance in your reasoning. Respond with only a valid, unformatted array of json objects containing the 'id', 'service_name', and a 'reason_for_selection'. Do not include any markdown formatting in your response. User location: " . json_encode(value: $location_context) . " Services: " . prompt_db($user_location) . ' User input: ' . $user_input;

  $services = [];
  $attempts = 0;
  while ($attempts < 3) {
    $services = json_decode(
      json: gemini(google_api_key: getenv(name: 'GOOGLE_API_KEY'), prompt: $prompt),
      associative: true
    );
    if (is_array($services)) {
      break;
    }
    $attempts++;
  }

  if (!is_array($services)) {
    return [];
  }

  $ids = [];
  $seen_ids = [];
  foreach ($services as $service) {
    $service_id = (int) ($service['id'] ?? 0);
    if ($service_id <= 0 || isset($seen_ids[$service_id])) {
      continue;
    }

    $matched_service = get_service(id: $service_id);
    if ($matched_service === []) {
      continue;
    }

    $seen_ids[$service_id] = true;
    $ids[] = $matched_service;
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
