<?php declare(strict_types=1);

function service_request_success_page(string $message): string
{
  return "
  <!DOCTYPE html>
  <html lang='en'>
    <head>
      <meta charset='UTF-8'>
      <meta name='viewport' content='width=device-width, initial-scale=1.0'>
      <title>{$message}</title>
    </head>
    <body style='margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center; text-align: center;'>
      <div>
        <h1>{$message}</h1>
        <a href='https://ucassist-ttu.github.io/Gov-AI/'>Click here to return to website</a>
      </div>
    </body>
</html>";
}
