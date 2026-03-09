<?php declare(strict_types=1);

function haversine(float $lat1, float $lon1, float $lat2, float $lon2): float
{
  $lat1 = deg2rad(num: $lat1);
  $lon1 = deg2rad(num: $lon1);
  $lat2 = deg2rad(num: $lat2);
  $lon2 = deg2rad(num: $lon2);

  $earth_radius = 3958.7613;  // miles
  $dlat = $lat2 - $lat1;
  $dlon = $lon2 - $lon1;
  $a = sin(num: $dlat / 2) ** 2 + cos(num: $lat1) * cos(num: $lat2) * sin(num: $dlon / 2) ** 2;
  $central_angle = 2 * atan2(y: sqrt(num: $a), x: sqrt(num: 1 - $a));
  $distance = $earth_radius * $central_angle;
  return $distance;
}
