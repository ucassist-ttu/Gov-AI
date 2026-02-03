<?php declare(strict_types=1);

$services_table = 'tblServices';
$service_requests_table = 'tblServiceRequests';
$pdo = new PDO(dsn: 'sqlite:' . __DIR__ . '/UCAssist.db');

$columns = ['ID', 'OrganizationName', 'OrganizationDescription', 'Website', 'MinorityOwned',
    'FaithBasedProvider', 'NonProfitProvider', 'ProviderLogo', 'NameOfSevice',
    'ServiceDescription', 'ProgramCriteria', 'Keywords', 'CountiesAvailable',
    'TelephoneContact', 'EmailContact', 'ServiceAddress', 'CityStateZip', 'HoursOfOperation'];

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
    $services = get_services();
    return $services[$id] ?? [];
}

function create_service(array $service): void
{
    global $services_table, $pdo, $columns;

    $statement = $pdo->prepare(query: "INSERT INTO {$services_table} (" . implode(array: $columns, separator: ', ') . ') VALUES (:' . implode(array: $columns, separator: ', :') . ')');

    $params = [];
    foreach ($columns as $column) {
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

function get_service_request(string $id): array
{
    global $service_requests_table, $pdo;

    $statement = $pdo->prepare(query: "SELECT * FROM {$service_requests_table} WHERE ID = :ID");
    $statement->execute(params: [':ID' => $id]);
    return $statement->fetch(mode: PDO::FETCH_ASSOC) ?: [];
}

function delete_service_request(int $id): void
{
    global $service_requests_table, $pdo;

    $statement = $pdo->prepare(query: "DELETE FROM {$service_requests_table} WHERE ID = :ID");
    $statement->execute(params: [':ID' => $id]);
}

function create_service_request(string $action, string $body, string $message): void
{
    global $service_requests_table, $pdo;

    $id = uuidv4();

    $statement = $pdo->prepare(query: "INSERT INTO {$service_requests_table} (ID, Action, Body) VALUES (:ID, :Action, :Body)");

    $statement->execute(params: [
        ':ID' => $id,
        ':Action' => $action,
        ':Body' => $body,
    ]);

    foreach (get_email_addresses() as $email_address) {
        email(to: $email_address, subject: 'UCAssist Service Request', body: $message . $id);
    }
}

function request_service_creation(array $service): void
{
    create_service_request(action: 'CREATE', body: json_encode(value: $service), message: '/create-service?uuid=');
}

function request_service_update(array $service): void
{
    create_service_request(action: 'UPDATE', body: json_encode(value: $service), message: '/update-service?uuid=');
}

function request_service_deletion(int $id): void
{
    create_service_request(action: 'DELETE', body: json_encode(value: $id), message: '/delete-service?uuid=');
}
