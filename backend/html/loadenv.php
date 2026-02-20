<?php

function loadenv(): void
{
    $envPath = __DIR__ . '/.env';  // <-- same directory as this script
    if (!file_exists($envPath)) {
        error_log("Env file not found at $envPath");
        return;
    }

    foreach (file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        $line = trim($line);
        if ($line === '' || $line[0] === '#') continue; // skip empty lines and comments
        putenv($line);
    }

    error_log("GOOGLE_API_KEY=" . getenv('GOOGLE_API_KEY')); // confirm key loaded
}

