<?php declare(strict_types=1);

$services_table = 'tblServices';
$pdo = new PDO(dsn: 'sqlite:' . __DIR__ . '/../../UCAssist.db');

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
