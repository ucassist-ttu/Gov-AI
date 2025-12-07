<?php declare(strict_types=1);

$services_table = 'tblServices';
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
