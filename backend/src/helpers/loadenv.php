<?php declare(strict_types=1);

function loadenv(): void
{
    foreach (file(filename: dirname(path: __DIR__, levels: 2) . '/.env', flags: FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        if ($line[0] === '#')
            continue;
        putenv(assignment: $line);
    }
}
