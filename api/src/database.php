<?php

$services_table = 'tblServices';
$service_coordinates_table = 'tblCoordinates';
$county_coordinates_table = 'tblCountyCoordinates';
$service_requests_table = 'tblServiceRequests';
$referrals_table = 'tblReferrals';
$page_analytics_table = 'tblPageAnalytics';
$search_analytics_table = 'tblSearchAnalytics';
$service_columns = [
    'ID',
    'OrganizationName',
    'OrganizationDescription',
    'Website',
    'MinorityOwned',
    'FaithBasedProvider',
    'NonProfitProvider',
    'ProviderLogo',
    'NameOfService',
    'ServiceDescription',
    'ProgramCriteria',
    'Keywords',
    'CountiesAvailable',
    'TelephoneContact',
    'EmailContact',
    'ServiceAddress',
    'CityStateZip',
    'HoursOfOperation',
];

function db(): PDO
{
    static $pdo = null;

    if ($pdo === null) {
        $serverName = $_SERVER['SERVER_NAME'] ?? $_SERVER['HTTP_HOST'] ?? '';
        $host = strtolower((string) preg_replace('/:\d+$/', '', $serverName));
        $isLocalhost = in_array($host, ['localhost', '127.0.0.1'], true);

        if ($isLocalhost) {
            $dbPath = __DIR__ . '/UCAssist.db';
            $pdo = new PDO('sqlite:' . $dbPath, null, null, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_PERSISTENT => true,
            ]);
        } else {
            $host = 'db5020226499.hosting-data.io';
            $dbname = 'dbs15553563';
            $user = 'dbu2391442';
            $password = getenv('DB_PASSWORD');

            $dsn = "mysql:host=$host;dbname=$dbname;charset=utf8mb4";

            $pdo = new PDO($dsn, $user, $password, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_PERSISTENT => true,
            ]);
        }

        ensure_support_tables($pdo);
    }

    return $pdo;
}

function ensure_support_tables(PDO $pdo): void
{
    static $initialized = false;

    if ($initialized) {
        return;
    }

    $driver = $pdo->getAttribute(PDO::ATTR_DRIVER_NAME);

    if ($driver === 'sqlite') {
        $pdo->exec(
            'CREATE TABLE IF NOT EXISTS tblReferrals (
                ID INTEGER PRIMARY KEY AUTOINCREMENT,
                FirstName TEXT NOT NULL,
                LastName TEXT NOT NULL,
                Email TEXT NOT NULL,
                Phone TEXT NOT NULL,
                Message TEXT NOT NULL,
                CreatedAt INTEGER NOT NULL
            )'
        );
        $pdo->exec(
            'CREATE TABLE IF NOT EXISTS tblServiceRequests (
                ID TEXT NOT NULL PRIMARY KEY,
                Action TEXT NOT NULL,
                Body TEXT NOT NULL,
                Expire INTEGER NOT NULL
            )'
        );
        $pdo->exec(
            'CREATE TABLE IF NOT EXISTS tblMonthlyViews (
                ID INTEGER PRIMARY KEY AUTOINCREMENT,
                service_id INTEGER NOT NULL
            )'
        );
        $pdo->exec(
            'CREATE TABLE IF NOT EXISTS tblCoordinates (
                service_id INTEGER PRIMARY KEY,
                latitude REAL NOT NULL,
                longitude REAL NOT NULL,
                FOREIGN KEY (service_id) REFERENCES tblServices(ID)
            )'
        );
    } else {
        $pdo->exec(
            'CREATE TABLE IF NOT EXISTS tblReferrals (
                ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                FirstName TEXT NOT NULL,
                LastName TEXT NOT NULL,
                Email TEXT NOT NULL,
                Phone TEXT NOT NULL,
                Message TEXT NOT NULL,
                CreatedAt BIGINT NOT NULL
            )'
        );
        $pdo->exec(
            'CREATE TABLE IF NOT EXISTS tblServiceRequests (
                ID VARCHAR(64) NOT NULL PRIMARY KEY,
                Action VARCHAR(16) NOT NULL,
                Body LONGTEXT NOT NULL,
                Expire BIGINT NOT NULL
            )'
        );
        $pdo->exec(
            'CREATE TABLE IF NOT EXISTS tblMonthlyViews (
                ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                service_id INT NOT NULL
            )'
        );
        $pdo->exec(
            'CREATE TABLE IF NOT EXISTS tblCoordinates (
                service_id INT NOT NULL PRIMARY KEY,
                latitude DOUBLE NOT NULL,
                longitude DOUBLE NOT NULL,
                FOREIGN KEY (service_id) REFERENCES tblServices(ID)
            )'
        );
    }

    $initialized = true;
}

function get_monthly_views(): array
{
    $pdo = db();
    $stmt = $pdo->prepare('SELECT s.ID, s.Keywords, s.CountiesAvailable, count(v.service_id) AS view_count FROM tblServices s LEFT JOIN tblMonthlyViews v ON s.ID = v.service_id GROUP BY s.ID');
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function add_monthly_views(int $service_id): bool
{
    $pdo = db();
    $stmt = $pdo->prepare('INSERT INTO tblMonthlyViews (service_id) VALUES (:service_id)');
    $stmt->execute([':service_id' => $service_id]);
    return true;
}

function get_page_analytics(): array
{
    global $page_analytics_table;
    $pdo = db();

    $rows = $pdo->query(query: "SELECT * FROM {$page_analytics_table}");
    if ($rows === false) {
        return [];
    }

    return $rows->fetchAll(mode: PDO::FETCH_ASSOC) ?: [];
}

function add_page_analytics(array $page_analytics): bool
{
    global $page_analytics_table;
    $pdo = db();

    $stmt = $pdo->prepare(
        "INSERT INTO {$page_analytics_table}
        (page, timeViewed, timeLeft, timeSpent, maxScoll, pageViews, clickLogs, county)
        VALUES
        (:page, :timeViewed, :timeLeft, :timeSpent, :maxScoll, :pageViews, :clickLogs, :county)"
    );

    $stmt->execute([
        ':page' => $page_analytics['page'] ?? null,
        ':timeViewed' => $page_analytics['timeViewed'] ?? null,
        ':timeLeft' => $page_analytics['timeLeft'] ?? null,
        ':timeSpent' => $page_analytics['timeSpent'] ?? null,
        ':maxScoll' => $page_analytics['maxScoll'] ?? null,
        ':pageViews' => $page_analytics['pageViews'] ?? null,
        ':clickLogs' => isset($page_analytics['clickLogs']) ? json_encode($page_analytics['clickLogs']) : null,
        ':county' => $page_analytics['county'] ?? null,
    ]);

    return true;
}

function get_search_analytics(): array
{
    global $search_analytics_table;
    $pdo = db();

    $rows = $pdo->query(query: "SELECT * FROM {$search_analytics_table}");
    if ($rows === false) {
        return [];
    }

    return $rows->fetchAll(mode: PDO::FETCH_ASSOC) ?: [];
}

function add_search_analytics(array $search_analytics): bool
{
    global $search_analytics_table;
    $pdo = db();

    $stmt = $pdo->prepare(
        "INSERT INTO {$search_analytics_table}
        (searchType, timeStamp, search, results, county, checked)
        VALUES
        (:searchType, :timeStamp, :search, :results, :county, :checked)"
    );

    $stmt->execute([
        ':searchType' => $search_analytics['searchType'] ?? null,
        ':timeStamp' => $search_analytics['timeStamp'] ?? null,
        ':search' => $search_analytics['search'] ?? null,
        ':results' => $search_analytics['results'] ?? null,
        ':county' => $search_analytics['county'] ?? null,
        ':checked' => isset($search_analytics['checked']) ? json_encode($search_analytics['checked']) : null,
    ]);

    return true;
}

function get_services(): array
{
    global $services_table;
    $pdo = db();

    $rows = $pdo->query(query: "SELECT * FROM {$services_table}");
    if ($rows === false) {
        return [];
    }

    return $rows->fetchAll(mode: PDO::FETCH_ASSOC) ?: [];
}

function get_service(int $id): array
{
    global $services_table;
    $pdo = db();

    $statement = $pdo->prepare(query: "SELECT * FROM {$services_table} WHERE ID = :ID");
    $statement->execute(params: ['ID' => $id]);

    return $statement->fetch(mode: PDO::FETCH_ASSOC) ?: [];
}

function create_service(array $service): array
{
    global $services_table, $service_columns;
    $pdo = db();

    $insert_columns = array_values(array_filter($service_columns, static fn(string $column): bool => $column !== 'ID'));
    $statement = $pdo->prepare(
        "INSERT INTO {$services_table} (" . implode(', ', $insert_columns) . ') VALUES (:' . implode(', :', $insert_columns) . ')'
    );

    $params = [];
    foreach ($insert_columns as $column) {
        $params[":{$column}"] = $service[$column] ?? '';
    }

    $statement->execute($params);

    $created_service = get_service((int) $pdo->lastInsertId());
    hydrate_service_coordinates($created_service, true);

    return $created_service;
}

function get_service_coordinates(int $service_id): array
{
    global $service_coordinates_table;
    $pdo = db();

    $id_column = get_service_coordinates_id_column();
    $statement = $pdo->prepare(query: "SELECT {$id_column} AS service_id, latitude, longitude FROM {$service_coordinates_table} WHERE {$id_column} = :service_id");
    $statement->execute(params: [':service_id' => $service_id]);
    $row = $statement->fetch(mode: PDO::FETCH_ASSOC) ?: [];

    if ($row === []) {
        return [];
    }

    return [
        'service_id' => (int) ($row['service_id'] ?? 0),
        'latitude' => (float) ($row['latitude'] ?? 0),
        'longitude' => (float) ($row['longitude'] ?? 0),
    ];
}

function upsert_service_coordinates(int $service_id, float $latitude, float $longitude): array
{
    global $service_coordinates_table;
    $pdo = db();
    $driver = $pdo->getAttribute(PDO::ATTR_DRIVER_NAME);
    $id_column = get_service_coordinates_id_column();

    if ($driver === 'sqlite') {
        $statement = $pdo->prepare(
            "INSERT INTO {$service_coordinates_table} ({$id_column}, latitude, longitude)
             VALUES (:service_id, :latitude, :longitude)
             ON CONFLICT({$id_column}) DO UPDATE SET
                latitude = excluded.latitude,
                longitude = excluded.longitude"
        );
    } else {
        $statement = $pdo->prepare(
            "INSERT INTO {$service_coordinates_table} ({$id_column}, latitude, longitude)
             VALUES (:service_id, :latitude, :longitude)
             ON DUPLICATE KEY UPDATE
                latitude = VALUES(latitude),
                longitude = VALUES(longitude)"
        );
    }

    $statement->execute([
        ':service_id' => $service_id,
        ':latitude' => $latitude,
        ':longitude' => $longitude,
    ]);

    return get_service_coordinates($service_id);
}

function get_service_coordinates_id_column(): string
{
    global $service_coordinates_table;

    static $cached = null;
    if ($cached !== null) {
        return $cached;
    }

    $pdo = db();
    $driver = $pdo->getAttribute(PDO::ATTR_DRIVER_NAME);
    $columns = [];

    if ($driver === 'sqlite') {
        $rows = $pdo->query("PRAGMA table_info({$service_coordinates_table})");
        $columns = $rows === false ? [] : array_map(
            static fn(array $row): string => strtolower((string) ($row['name'] ?? '')),
            $rows->fetchAll(mode: PDO::FETCH_ASSOC) ?: []
        );
    } else {
        $rows = $pdo->query("SHOW COLUMNS FROM {$service_coordinates_table}");
        $columns = $rows === false ? [] : array_map(
            static fn(array $row): string => strtolower((string) ($row['Field'] ?? '')),
            $rows->fetchAll(mode: PDO::FETCH_ASSOC) ?: []
        );
    }

    if (in_array('service_id', $columns, true)) {
        $cached = 'service_id';
        return $cached;
    }

    if (in_array('id', $columns, true)) {
        $cached = 'id';
        return $cached;
    }

    $cached = 'service_id';
    return $cached;
}

function hydrate_service_coordinates(array $service, bool $attempt_geocode = false): array
{
    $service_id = (int) ($service['ID'] ?? 0);
    if ($service_id <= 0) {
        return [];
    }

    $coordinates = get_service_coordinates($service_id);
    if ($coordinates !== []) {
        return $coordinates;
    }

    if ($attempt_geocode) {
        $coordinates = geocode_service_address_with_census($service);
    }

    if ($coordinates === []) {
        $coordinates = fallback_service_coordinates_from_county($service);
    }

    if ($coordinates === []) {
        return [];
    }

    return upsert_service_coordinates(
        $service_id,
        (float) $coordinates['latitude'],
        (float) $coordinates['longitude']
    );
}

function get_county_coordinates(): array
{
    global $county_coordinates_table;
    $pdo = db();

    $rows = $pdo->query(query: "SELECT * FROM {$county_coordinates_table}");
    if ($rows === false) {
        return [];
    }

    return $rows->fetchAll(mode: PDO::FETCH_ASSOC) ?: [];
}

function create_referral(array $referral): array
{
    global $referrals_table;
    $pdo = db();

    $statement = $pdo->prepare(
        "INSERT INTO {$referrals_table}
        (FirstName, LastName, Email, Phone, Message, CreatedAt)
        VALUES
        (:FirstName, :LastName, :Email, :Phone, :Message, :CreatedAt)"
    );

    $statement->execute([
        ':FirstName' => resolve_string_value($referral, ['firstName', 'newFirstName', 'first_name']),
        ':LastName' => resolve_string_value($referral, ['lastName', 'newLastName', 'last_name']),
        ':Email' => resolve_string_value($referral, ['email', 'newEmail']),
        ':Phone' => resolve_string_value($referral, ['phone', 'newPhone']),
        ':Message' => resolve_string_value($referral, ['message', 'newMessage']),
        ':CreatedAt' => time(),
    ]);

    return get_referral((int) $pdo->lastInsertId());
}

function get_referral(int $id): array
{
    global $referrals_table;
    $pdo = db();

    $statement = $pdo->prepare(query: "SELECT * FROM {$referrals_table} WHERE ID = :ID");
    $statement->execute(params: [':ID' => $id]);
    $row = $statement->fetch(mode: PDO::FETCH_ASSOC) ?: [];

    return $row ? referral_api_shape($row) : [];
}

function get_service_request(string $id): array
{
    global $service_requests_table;
    $pdo = db();

    clean_service_requests();

    $statement = $pdo->prepare(query: "SELECT * FROM {$service_requests_table} WHERE ID = :ID");
    $statement->execute(params: [':ID' => $id]);
    $row = $statement->fetch(mode: PDO::FETCH_ASSOC) ?: [];

    if ($row === [] || normalize_service_request_action((string) ($row['Action'] ?? '')) !== 'CREATE') {
        return [];
    }

    return service_request_api_shape($row);
}

function approve_service_request(string $id): array
{
    $request = get_service_request($id);
    if ($request === []) {
        return [];
    }

    $payload = is_array($request['payload']) ? $request['payload'] : [];
    $created_service = create_service(build_service_record($payload));

    delete_service_request($id);

    return $created_service;
}

function delete_service_request(string $id): bool
{
    global $service_requests_table;
    $pdo = db();

    $statement = $pdo->prepare(query: "DELETE FROM {$service_requests_table} WHERE ID = :ID");
    $statement->execute(params: [':ID' => $id]);

    return $statement->rowCount() > 0;
}

function clean_service_requests(): void
{
    global $service_requests_table;
    $pdo = db();

    $statement = $pdo->prepare(query: "DELETE FROM {$service_requests_table} WHERE Expire < :Expire");
    $statement->execute(params: [':Expire' => time()]);
}

function referral_api_shape(array $row): array
{
    return [
        'id' => (int) ($row['ID'] ?? 0),
        'firstName' => (string) ($row['FirstName'] ?? ''),
        'lastName' => (string) ($row['LastName'] ?? ''),
        'email' => (string) ($row['Email'] ?? ''),
        'phone' => (string) ($row['Phone'] ?? ''),
        'message' => (string) ($row['Message'] ?? ''),
    ];
}

function service_request_api_shape(array $row): array
{
    return [
        'id' => (string) ($row['ID'] ?? ''),
        'payload' => decode_service_request_body((string) ($row['Body'] ?? '')),
        'expiresAt' => (int) ($row['Expire'] ?? 0),
    ];
}

function build_service_record(array $payload): array
{
    global $service_columns;

    $record = [];
    foreach ($service_columns as $column) {
        $record[$column] = '';
    }

    $record['OrganizationName'] = resolve_string_value($payload, ['OrganizationName', 'company_name', 'organization_name']);
    $record['OrganizationDescription'] = resolve_string_value($payload, ['OrganizationDescription', 'organization_description']);
    $record['Website'] = resolve_string_value($payload, ['Website', 'website']);
    $record['MinorityOwned'] = resolve_yes_no_value($payload, ['MinorityOwned', 'minorityOwned', 'minority_owned'], 'No');
    $record['FaithBasedProvider'] = resolve_yes_no_value($payload, ['FaithBasedProvider', 'faithBasedProvider', 'faith_based_provider'], 'No');
    $record['NonProfitProvider'] = resolve_yes_no_value($payload, ['NonProfitProvider', 'nonProfitProvider', 'non_profit_provider'], 'No');
    $record['ProviderLogo'] = resolve_string_value($payload, ['ProviderLogo', 'logo_file', 'provider_logo']);
    $record['NameOfService'] = resolve_string_value($payload, ['NameOfService', 'service_name', 'name_of_service']);
    $record['ServiceDescription'] = resolve_string_value($payload, ['ServiceDescription', 'service_description']);
    $record['ProgramCriteria'] = resolve_string_value($payload, ['ProgramCriteria', 'service_criteria', 'program_criteria']);
    $record['Keywords'] = resolve_list_value($payload, ['Keywords', 'service_keywords', 'keywords'], '[]');
    $record['CountiesAvailable'] = resolve_list_value($payload, ['CountiesAvailable', 'counties_available', 'counties'], '[]');
    $record['TelephoneContact'] = resolve_string_value($payload, ['TelephoneContact', 'service_phone', 'phone', 'primary_phone']);
    $record['EmailContact'] = resolve_string_value($payload, ['EmailContact', 'primary_email', 'email', 'secondary_email']);
    $record['ServiceAddress'] = resolve_string_value($payload, ['ServiceAddress', 'service_address_street', 'service_address', 'address1', 'physical_address']);
    $record['CityStateZip'] = build_city_state_zip($payload);
    $record['HoursOfOperation'] = resolve_hours_value($payload, ['HoursOfOperation', 'service_hours', 'hours_of_operation', 'org_hours']);

    return $record;
}

function resolve_string_value(array $payload, array $keys, string $default = ''): string
{
    foreach ($keys as $key) {
        if (array_key_exists($key, $payload)) {
            return stringify_value($payload[$key]);
        }
    }

    return $default;
}

function resolve_yes_no_value(array $payload, array $keys, string $default = 'No'): string
{
    foreach ($keys as $key) {
        if (!array_key_exists($key, $payload)) {
            continue;
        }

        $value = strtolower(trim(stringify_value($payload[$key])));
        if ($value === '') {
            return $default;
        }
        if (in_array($value, ['1', 'true', 'yes', 'y'], true)) {
            return 'Yes';
        }
        if (in_array($value, ['0', 'false', 'no', 'n'], true)) {
            return 'No';
        }

        return ucfirst($value);
    }

    return $default;
}

function resolve_list_value(array $payload, array $keys, string $default = '[]'): string
{
    foreach ($keys as $key) {
        if (array_key_exists($key, $payload)) {
            return format_list_value($payload[$key]);
        }
    }

    return $default;
}

function resolve_hours_value(array $payload, array $keys, string $default = ''): string
{
    foreach ($keys as $key) {
        if (!array_key_exists($key, $payload)) {
            continue;
        }

        $value = $payload[$key];
        if (is_array($value)) {
            $json = json_encode($value, JSON_UNESCAPED_SLASHES);
            return $json === false ? $default : $json;
        }

        return stringify_value($value);
    }

    return $default;
}

function build_city_state_zip(array $payload, string $default = ''): string
{
    $combined = resolve_string_value($payload, ['CityStateZip', 'city_state_zip']);
    if ($combined !== '') {
        return $combined;
    }

    $city = resolve_string_value($payload, ['service_city', 'city_public', 'city']);
    $state = resolve_string_value($payload, ['service_state', 'state_public', 'state']);
    $zip = resolve_string_value($payload, ['service_zip', 'zip_public', 'zip']);

    $city_state = trim(implode(', ', array_values(array_filter([$city, $state], static fn(string $part): bool => $part !== ''))));
    $combined = trim(implode(' ', array_values(array_filter([$city_state, $zip], static fn(string $part): bool => $part !== ''))));

    return $combined !== '' ? $combined : $default;
}

function stringify_value(mixed $value): string
{
    if (is_string($value)) {
        return trim($value);
    }

    if (is_bool($value)) {
        return $value ? 'true' : 'false';
    }

    if ($value === null) {
        return '';
    }

    if (is_scalar($value)) {
        return trim((string) $value);
    }

    $json = json_encode($value, JSON_UNESCAPED_SLASHES);
    return $json === false ? '' : $json;
}

function format_list_value(mixed $value): string
{
    if (is_string($value)) {
        $trimmed = trim($value);
        if ($trimmed === '') {
            return '[]';
        }
        if (str_starts_with($trimmed, '[')) {
            return $trimmed;
        }
        $value = array_map('trim', explode(',', $trimmed));
    }

    if (!is_array($value)) {
        $value = [$value];
    }

    $items = [];
    foreach ($value as $item) {
        $text = stringify_value($item);
        if ($text === '') {
            continue;
        }
        $items[] = "'" . str_replace("'", "\\'", $text) . "'";
    }

    return '[' . implode(', ', $items) . ']';
}

function decode_service_request_body(string $body): array
{
    $decoded = json_decode($body, true);

    return is_array($decoded) ? $decoded : [];
}

function normalize_service_request_action(string $action): string
{
    $normalized = strtoupper(trim($action));

    return $normalized === 'CREATE' ? 'CREATE' : '';
}

function geocode_service_address_with_census(array $service): array
{
    $address = build_census_lookup_address($service);
    if ($address === '') {
        return [];
    }

    $query = http_build_query([
        'address' => $address,
        'benchmark' => 'Public_AR_Current',
        'format' => 'json',
    ]);

    $response = fetch_json_response('https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?' . $query);
    $coordinates = $response['result']['addressMatches'][0]['coordinates'] ?? null;

    if (!is_array($coordinates)) {
        return [];
    }

    $longitude = $coordinates['x'] ?? null;
    $latitude = $coordinates['y'] ?? null;

    if (!is_numeric($latitude) || !is_numeric($longitude)) {
        return [];
    }

    return [
        'latitude' => (float) $latitude,
        'longitude' => (float) $longitude,
    ];
}

function fallback_service_coordinates_from_county(array $service): array
{
    foreach (extract_service_counties($service) as $county) {
        $coordinates = get_county_coordinate($county);
        if ($coordinates !== []) {
            return [
                'latitude' => (float) $coordinates['latitude'],
                'longitude' => (float) $coordinates['longitude'],
            ];
        }
    }

    return [];
}

function get_county_coordinate(string $county): array
{
    global $county_coordinates_table;
    $pdo = db();

    $statement = $pdo->prepare(
        query: "SELECT county, latitude, longitude
                FROM {$county_coordinates_table}
                WHERE LOWER(county) = LOWER(:county)
                LIMIT 1"
    );
    $statement->execute(params: [':county' => trim($county)]);
    $row = $statement->fetch(mode: PDO::FETCH_ASSOC) ?: [];

    if ($row === []) {
        return [];
    }

    return [
        'county' => (string) ($row['county'] ?? ''),
        'latitude' => (float) ($row['latitude'] ?? 0),
        'longitude' => (float) ($row['longitude'] ?? 0),
    ];
}

function extract_service_counties(array $service): array
{
    $value = $service['CountiesAvailable'] ?? [];
    if (is_array($value)) {
        return array_values(array_filter(array_map('stringify_value', $value), static fn(string $county): bool => $county !== ''));
    }

    $text = trim((string) $value);
    if ($text === '' || $text === '[]') {
        return [];
    }

    $decoded = json_decode(str_replace("'", '"', $text), true);
    if (is_array($decoded)) {
        return array_values(array_filter(array_map('stringify_value', $decoded), static fn(string $county): bool => $county !== ''));
    }

    $counties = [];
    foreach (explode(',', trim($text, '[]')) as $county) {
        $clean = trim($county, " \t\n\r\0\x0B'\"");
        if ($clean !== '') {
            $counties[] = $clean;
        }
    }

    return $counties;
}

function build_census_lookup_address(array $service): string
{
    $street = sanitize_address_component((string) ($service['ServiceAddress'] ?? ''));
    $city_state_zip = sanitize_address_component((string) ($service['CityStateZip'] ?? ''));

    if ($street === '' || $city_state_zip === '') {
        return '';
    }

    if (!preg_match('/\d/', $street)) {
        return '';
    }

    return "{$street}, {$city_state_zip}";
}

function sanitize_address_component(string $value): string
{
    $value = trim($value);
    if ($value === '') {
        return '';
    }

    $normalized = strtolower($value);
    if (in_array($normalized, ['n/a', 'na', 'none'], true)) {
        return '';
    }
    if (str_contains($normalized, 'call for specifics')) {
        return '';
    }

    return $value;
}

function fetch_json_response(string $url): array
{
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        if ($ch === false) {
            return [];
        }

        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CONNECTTIMEOUT => 5,
            CURLOPT_TIMEOUT => 10,
            CURLOPT_HTTPHEADER => [
                'Accept: application/json',
                'User-Agent: Gov-AI/1.0',
            ],
        ]);

        $body = curl_exec($ch);
        $status = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
        curl_close($ch);

        if (!is_string($body) || $status < 200 || $status >= 300) {
            return [];
        }
    } else {
        $context = stream_context_create([
            'http' => [
                'method' => 'GET',
                'timeout' => 10,
                'header' => "Accept: application/json\r\nUser-Agent: Gov-AI/1.0\r\n",
            ],
        ]);

        $body = @file_get_contents($url, false, $context);
        if (!is_string($body) || $body === '') {
            return [];
        }
    }

    $decoded = json_decode($body, true);
    return is_array($decoded) ? $decoded : [];
}
