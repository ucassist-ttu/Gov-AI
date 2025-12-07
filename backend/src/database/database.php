<?php declare(strict_types=1);

$services_table = 'tblServices';
$pdo = new PDO(dsn: 'sqlite:' . __DIR__ . '/UCAssist.db');

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
    global $services_table, $pdo;

    $columns = ['ID', 'OrganizationName', 'OrganizationDescription', 'Website', 'MinorityOwned',
        'FaithBasedProvider', 'NonProfitProvider', 'ProviderLogo', 'NameOfSevice',
        'ServiceDescription', 'ProgramCriteria', 'Keywords', 'CountiesAvailable',
        'TelephoneContact', 'EmailContact', 'ServiceAddress', 'CityStateZip', 'HoursOfOperation'];

    $statement = $pdo->prepare(query: "INSERT INTO {$services_table} (" . implode(array: $columns, separator: ', ') . ') VALUES (:' . implode(array: $columns, separator: ', :') . ')');

    $params = [];
    foreach ($columns as $column) {
        $params[":{$column}"] = $service[$column];
    }
    $statement->execute(params: $params);
}
