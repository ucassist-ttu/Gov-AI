<?php declare(strict_types=1);

function gemini(string $google_api_key, string $prompt): string
{
  $headers = ["x-goog-api-key: {$google_api_key}", 'Content-Type: application/json'];
  $body = json_encode(value: ['contents' => ['parts' => ['text' => $prompt]]]);
  $stream_context = stream_context_create(options: [
    'http' => [
      'method' => 'POST',
      'header' => implode(separator: "\r\n", array: $headers),
      'content' => $body,
    ]
  ]);
  set_time_limit(seconds: 120);
  $response = file_get_contents(filename: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent', use_include_path: false, context: $stream_context);
  if ($response === false) {
    exit;
  }
  $response = json_decode(json: $response, associative: true);

  if ($http_response_header[0] === 'HTTP/1.1 200 OK')
    return $response['candidates'][0]['content']['parts'][0]['text'];
  return 'Sorry, something went wrong.';
}
