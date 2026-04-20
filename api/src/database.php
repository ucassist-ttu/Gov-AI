<?php

$services_table = 'tblServices';

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
    }

    return $pdo;
}

// Example helper functions
function get_monthly_views()
{
    $pdo = db();
    $stmt = $pdo->prepare('SELECT s.ID, s.Keywords, s.CountiesAvailable, count(v.service_id) AS view_count FROM tblServices s LEFT JOIN tblMonthlyViews v ON s.ID = v.service_id GROUP BY s.ID');
    $stmt->execute();
    $viewCounts = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $viewCounts;
}

function add_monthly_views(int $service_id)
{
    $pdo = db();
    $stmt = $pdo->prepare('INSERT INTO tblMonthlyViews (service_id) VALUES (:service_id)');
    $stmt->execute([':service_id' => $service_id]);
    return true;
}

function get_services(): array
{
    global $services_table;
    $pdo = db();

    $rows = $pdo->query(query: "SELECT * FROM {$services_table}");
    if ($rows === false)
        return [];

    return $rows ? $rows->fetchAll(mode: PDO::FETCH_ASSOC) : [];
}

function get_service(int $id): array
{
    global $services_table;
    $pdo = db();

    $statement = $pdo->prepare(query: "SELECT * FROM {$services_table} WHERE ID = :ID");
    $statement->execute(params: ['ID' => $id]);

    return $statement->fetch(mode: PDO::FETCH_ASSOC) ?: [];
}

function get_county_coordinates(): array
{
    $pdo = db();

    $rows = $pdo->query(query: 'SELECT * FROM tblCountyCoordinates');
    if ($rows === false)
        return [];

    return $rows ? $rows->fetchAll(mode: PDO::FETCH_ASSOC) : [];
}
