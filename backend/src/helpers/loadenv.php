<?php declare(strict_types=1);

function loadenv(): void
{
    // Candidate locations to check (ordered)
    $candidates = [
        // project root .env (if loadenv.php is in src/helpers)
        dirname(__DIR__, 2) . DIRECTORY_SEPARATOR . '.env',
        // backend/.env (if your .env sits in backend/)
        dirname(__DIR__, 2) . DIRECTORY_SEPARATOR . 'backend' . DIRECTORY_SEPARATOR . '.env',
        // fallback: one level up from helpers (rare)
        dirname(__DIR__, 1) . DIRECTORY_SEPARATOR . '.env',
    ];

    $found = false;
    foreach ($candidates as $envPath) {
        if (file_exists($envPath)) {
            $found = $envPath;
            break;
        }
    }

    if (!$found) {
        // For safety: don't print secret values. Use logging if needed.
        error_log("[loadenv] .env not found. Checked: " . implode(', ', $candidates));
        return;
    }

    $lines = file($found, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#')) {
            continue;
        }
        // split only on first '=' to allow '=' in value
        $parts = explode('=', $line, 2);
        if (count($parts) !== 2) continue;
        $name = trim($parts[0]);
        $value = trim($parts[1]);

        // remove surrounding quotes if present
        if ((str_starts_with($value, '"') && str_ends_with($value, '"')) ||
            (str_starts_with($value, "'") && str_ends_with($value, "'"))) {
            $value = substr($value, 1, -1);
        }

        putenv("{$name}={$value}");
        $_ENV[$name] = $value;
        $_SERVER[$name] = $value;
    }
}
