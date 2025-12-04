<?php declare(strict_types=1);

$services_table = 'tblServices';
$pdo = new PDO(dsn: 'sqlite:' . __DIR__ . '/../../UCAssist.db');

function get_services(): string
{
    global $services_table, $pdo;

    $rows = $pdo->query(query: "SELECT * FROM {$services_table}");
    if ($rows === false)
        return '';

    return json_encode(value: $rows->fetchAll(mode: PDO::FETCH_ASSOC)) ?: '';
}
