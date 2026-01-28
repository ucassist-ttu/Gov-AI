<?php declare(strict_types=1);

function email(string $to, string $subject, string $body): void
{
  $api_key = getenv(name: 'MAILGUN_API_KEY');
  $domain = getenv(name: 'MAILGUN_DOMAIN');
  $from = getenv(name: 'MAILGUN_FROM');

  $headers = [
    'Authorization: Basic ' . base64_encode(string: "api:{$api_key}"),
    'Content-Type: application/x-www-form-urlencoded',
  ];
  $payload = http_build_query(data: [
    'from' => $from,
    'to' => $to,
    'subject' => $subject,
    'text' => $body,
  ]);
  $stream_context = stream_context_create(options: [
    'http' => [
      'method' => 'POST',
      'header' => implode(separator: "\r\n", array: $headers),
      'content' => $payload,
    ]
  ]);
  set_time_limit(seconds: 120);
  $response = file_get_contents(
    filename: "https://api.mailgun.net/v3/{$domain}/messages",
    use_include_path: false,
    context: $stream_context
  );
}

function get_email_addresses(): array
{
  return file(filename: 'email_addresses.txt', flags: FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
}
