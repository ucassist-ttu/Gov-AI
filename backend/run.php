<?php declare(strict_types=1);

require_once __DIR__ . '/src/helpers/loadenv.php';

loadenv();

$required_variables = [
  'GOOGLE_API_KEY',
  'MAILGUN_API_KEY',
  'MAILGUN_DOMAIN',
  'MAILGUN_FROM'
];

foreach ($required_variables as $required_variable) {
  if (!getenv(name: $required_variable)) {
    throw new Exception(message: "Required environment variable '{$required_variable}' not set.");
  }
}

passthru(command: 'php -S localhost:8000 index.php');
