<?php

function db() : PDO
{
    static $pdo = null;

    if ($pdo === null) {
        $host = "127.0.0.1";
        $dbname = "UCASSIST";
        $user = "Olivia";
        $password = "Mickey2025!";

        $dsn = "mysql:host=$host;dbname=$dbname;charset=utf8mb4";

        $pdo = new PDO($dsn, $user, $password, [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_PERSISTENT         => true, // similar to a connection pool
        ]);
    }

    return $pdo;
}

// Example helper functions
function get_services() {
    $pdo = db();
    $stmt = $pdo->query("SELECT * FROM tblServices");
    return $stmt->fetchAll();
}

function get_service(int $id) {
    $pdo = db();
    $stmt = $pdo->prepare("SELECT * FROM tblServices WHERE ID = ?");
    $stmt->execute([$id]);
    return $stmt->fetch();
}

function get_monthly_views() {
    $pdo = db();
    $stmt = $pdo->prepare("SELECT s.ID, s.Keywords, s.CountiesAvailable, count(v.service_id) AS view_count FROM tblServices s LEFT JOIN tblMonthlyViews v ON s.ID = v.service_id GROUP BY s.ID");
    $stmt->execute();
    $viewCounts = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $viewCounts;
}
function add_monthly_views(int $service_id) {
    $pdo = db();
    $stmt = $pdo->prepare("INSERT INTO tblMonthlyViews (service_id) VALUES (:service_id)");
    $stmt->execute([':service_id' => $service_id]);
    return true;
}
function create_service(array $service): void {
    global $services_table, $pdo, $columns;
    $new_columns = array_values(array: array_diff($columns, ['ID']));

    $statement = $pdo->prepare(query: "INSERT INTO {$services_table} (" . implode(array: $new_columns, separator: ', ') . ') VALUES (:' . implode(array: $new_columns, separator: ', :') . ')');

    $params = [];
    foreach ($new_columns as $column) {
        $params[":{$column}"] = $service[$column];
    }
    $statement->execute(params: $params);
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
function request_service_creation(array $service): void
{
    $message = "A new service has been requested for creation:\n\n";
    foreach ($service as $key => $value) {
        $message .= "{$key}: {$value}\n";
    }
    $message .= "\nPaste this link in your browser: /create-service?uuid=";
    create_service_request(action: 'CREATE', body: json_encode(value: $service), message: $message);
}
