<?php declare(strict_types=1);

$services_table = 'tblServices';
$service_requests_table = 'tblServiceRequests';
$pdo = new PDO(dsn: 'sqlite:' . __DIR__ . '/UCAssist.db');

$columns = ['ID', 'OrganizationName', 'OrganizationDescription', 'Website', 'MinorityOwned',
    'FaithBasedProvider', 'NonProfitProvider', 'ProviderLogo', 'NameOfService',
    'ServiceDescription', 'ProgramCriteria', 'Keywords', 'CountiesAvailable',
    'TelephoneContact', 'EmailContact', 'ServiceAddress', 'CityStateZip', 'HoursOfOperation'];

function decode_list_string(mixed $value): array
{
    if (!is_string(value: $value) || trim(string: $value) === '') {
        return [];
    }

    $trimmed = trim(string: $value);

    $decoded = json_decode(json: $trimmed, associative: true);
    if (is_array(value: $decoded)) {
        return $decoded;
    }

    if (str_starts_with(haystack: $trimmed, needle: '[') && str_ends_with(haystack: $trimmed, needle: ']')) {
        $inner = trim(string: substr(string: $trimmed, offset: 1, length: - 1));
        if ($inner === '') {
            return [];
        }

        $parts = preg_split(pattern: '/\s*,\s*/', subject: $inner) ?: [];
        $result = [];
        foreach ($parts as $part) {
            $item = trim(string: $part, characters: " \t\n\r\0\v'\"");
            if ($item !== '') {
                $result[] = $item;
            }
        }
        return $result;
    }

    return [$trimmed];
}

function get_services(): array
{
    global $services_table, $pdo;

    $rows = $pdo->query(query: "SELECT * FROM {$services_table}");
    if ($rows === false)
        return [];

    return $rows ? $rows->fetchAll(mode: PDO::FETCH_ASSOC) : [];
}

function get_service(int $id): array
{
    global $services_table, $pdo;

    $statement = $pdo->prepare(query: "SELECT * FROM {$services_table} WHERE ID = :ID");
    $statement->execute(params: ['ID' => $id]);

    return $statement->fetch(mode: PDO::FETCH_ASSOC) ?: [];
}

function filter_services_by_keyword(string $keyword, array $services = []): array
{
    if (!$services) {
        $services = get_services();
    }
    $filtered_services = [];
    foreach ($services as $service) {
        foreach (decode_list_string(value: $service['Keywords'] ?? null) as $k) {
            if ($keyword == $k) {
                $filtered_services[] = $service;
                break;
            }
        }
    }
    return $filtered_services;
}

function filter_services_by_county(string $county, array $services = []): array
{
    if (!$services) {
        $services = get_services();
    }
    $filtered_services = [];
    foreach ($services as $service) {
        foreach (decode_list_string(value: $service['CountiesAvailable'] ?? null) as $county_available) {
            if ($county == $county_available) {
                $filtered_services[] = $service;
                break;
            }
        }
    }
    return $filtered_services;
}

function create_service(array $service): void
{
    global $services_table, $pdo, $columns;
    $new_columns = array_values(array: array_diff($columns, ['ID']));

    $statement = $pdo->prepare(query: "INSERT INTO {$services_table} (" . implode(array: $new_columns, separator: ', ') . ') VALUES (:' . implode(array: $new_columns, separator: ', :') . ')');

    $params = [];
    foreach ($new_columns as $column) {
        $params[":{$column}"] = $service[$column];
    }
    $statement->execute(params: $params);
}

function update_service(array $service): void
{
    global $services_table, $pdo, $columns;

    $set_parts = [];
    foreach ($columns as $column) {
        $set_parts[] = "{$column} = :{$column}";
    }

    $statement = $pdo->prepare(query: "UPDATE {$services_table} SET " . implode(array: $set_parts, separator: ', ') . ' WHERE ID = :ID');

    $params = [':ID' => $service['ID']];
    foreach ($columns as $column) {
        $params[":{$column}"] = $service[$column];
    }

    $statement->execute(params: $params);
}

function delete_service(int $id): void
{
    global $services_table, $pdo;

    $statement = $pdo->prepare(query: "DELETE FROM {$services_table} WHERE ID = :ID");
    $statement->execute(params: [':ID' => $id]);
}

function get_service_requests(): array
{
    global $service_requests_table, $pdo;

    $rows = $pdo->query(query: "SELECT * FROM {$service_requests_table}");

    return $rows->fetchAll(mode: PDO::FETCH_ASSOC) ?: [];
}

function get_service_request(string $id): array
{
    global $service_requests_table, $pdo;

    $statement = $pdo->prepare(query: "SELECT * FROM {$service_requests_table} WHERE ID = :ID");
    $statement->execute(params: [':ID' => $id]);
    return $statement->fetch(mode: PDO::FETCH_ASSOC) ?: [];
}

function delete_service_request(string $id): void
{
    global $service_requests_table, $pdo;

    $statement = $pdo->prepare(query: "DELETE FROM {$service_requests_table} WHERE ID = :ID");
    $statement->execute(params: [':ID' => $id]);
}

function clean_service_requests(): void
{
    foreach (get_service_requests() as $service_request) {
        if ((int) $service_request['Expire'] < time()) {
            delete_service_request(id: $service_request['ID']);
        }
    }
}

function create_service_request(string $action, string $body, string $message): void
{
    global $service_requests_table, $pdo;

    $id = uuidv4();

    $statement = $pdo->prepare(query: "INSERT INTO {$service_requests_table} (ID, Action, Body, Expire) VALUES (:ID, :Action, :Body, :Expire)");

    $statement->execute(params: [
        ':ID' => $id,
        ':Action' => $action,
        ':Body' => $body,
        ':Expire' => time() + 259200
    ]);

    foreach (get_email_addresses() as $email_address) {
        email(to: $email_address, subject: 'UCAssist Service Request', body: $message . $id . "\nThis link will expire in 72 hours.");
    }
}

function request_service_creation(array $service): void
{
    $message = "A new service has been requested for creation:\n\n";
    foreach ($service as $key => $value) {
        $message .= "{$key}: {$value}\n";
    }
    $message .= "\nPaste this link in your browser: /create-service?uuid=";
    create_service_request(action: 'CREATE', body: json_encode(value: $service), message: $message);
}

function request_service_update(array $service): void
{
    $message = "An update has been requested for the following service:\n\n";
    $old_service = get_service(id: (int) $service['ID']);
    foreach ($old_service as $key => $value) {
        $new_value = $service[$key];
        $message .= "{$key}: {$value}";
        if (!($new_value == $value)) {
            $message .= " ---> {$new_value}";
        }
        $message .= "\n";
    }
    $message .= "\nPaste this link in your browser: /update-service?uuid=";
    create_service_request(action: 'UPDATE', body: json_encode(value: $service), message: $message);
}

function request_service_deletion(int $id): void
{
    $message = "The following service has been requested for deletion:\n\n";
    foreach (get_service(id: $id) as $key => $value) {
        $message .= "{$key}: {$value}\n";
    }
    $message .= "\nPaste this link in your browser: /delete-service?uuid=";
    create_service_request(action: 'DELETE', body: json_encode(value: $id), message: $message);
}
