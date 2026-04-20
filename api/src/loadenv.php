<?php declare(strict_types=1);

function load_env(?string $path = null): void
{
  $path ??= dirname(__DIR__) . '/.env';

  if (!is_readable($path)) {
    return;
  }

  $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
  if ($lines === false) {
    return;
  }

  foreach ($lines as $line) {
    $line = trim($line);

    if ($line === '' || str_starts_with($line, '#')) {
      continue;
    }

    $separator = strpos($line, '=');
    if ($separator === false) {
      continue;
    }

    $name = trim(substr($line, 0, $separator));
    $value = trim(substr($line, $separator + 1));

    if ($name === '') {
      continue;
    }

    if (
      (str_starts_with($value, '"') && str_ends_with($value, '"')) ||
      (str_starts_with($value, "'") && str_ends_with($value, "'"))
    ) {
      $value = substr($value, 1, -1);
    }

    putenv("{$name}={$value}");
    $_ENV[$name] = $value;
    $_SERVER[$name] = $value;
  }
}
