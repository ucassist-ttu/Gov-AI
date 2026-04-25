# Backend Documentation

## Overview

The backend lives under `api/`. The entrypoint is `api/index.php`, which loads environment variables from `api/.env`, connects to either the local SQLite database or the production MySQL database, and exposes the current JSON endpoints.

In the current frontend, browser requests usually go through `js/api.js`, which calls:

`/api/index.php?route=/your-endpoint`

The route list below describes the logical route values such as `/services` or `/referral`.

## File Layout

- `api/index.php`: Route handling for all public endpoints.
- `api/src/loadenv.php`: Lightweight `.env` loader.
- `api/src/database.php`: Database connection logic and persistence helpers.
- `api/src/api.php`: Request helpers plus prompt/recommendation helpers that build Gemini prompts from service data.
- `api/src/gemini.php`: Raw Gemini API call wrapper.
- `api/src/distance.php`: Haversine distance helper. Present in the codebase, but not currently wired into any route.
- `api/src/UCAssist.db`: Local SQLite database used when the server is running on `localhost` or `127.0.0.1`.

## Core Endpoints

- `POST /prompt`
  - Body: JSON `{"user_input": "<text>"}`
  - Response: JSON array of service objects selected by Gemini from the current services table.

- `POST /recommendations`
  - Body: JSON `{"service_id": <int>}`
  - Response: JSON array of service objects Gemini considers similar to the selected service.

- `GET /recommendations?id=<int>`
  - Query param: `id`
  - Response: JSON array of service objects Gemini considers similar to the selected service.

- `GET /services`
  - Response: JSON array containing every row in `tblServices`.

- `GET /service?id=<int>`
  - Query param: `id`
  - Response: JSON object for the matching service, or an empty array if no row is found.

- `GET /service-coordinates?service_id=<int>`
  - Query param: `service_id` or `id`
  - Response: JSON object with `service_id`, `latitude`, and `longitude`
  - Behavior: returns the stored `tblCoordinates` row for the service, or falls back to the matching county center and stores that as the service coordinate when no service-specific row exists yet

- `GET /monthly-views`
  - Response: JSON array of per-service view counts produced from `tblServices` joined with `tblMonthlyViews`.

- `GET /add-monthly-view?service_id=<int>`
  - Query param: `service_id`
  - Response: JSON object like `{"success": true}` after inserting a row into `tblMonthlyViews`.

- `GET /page-analytics`
  - Response: JSON array of rows from `tblPageAnalytics`

- `POST /add-page-analytics`
  - Body: JSON with fields such as `page`, `timeViewed`, `timeLeft`, `timeSpent`, `maxScoll`, `pageViews`, `clickLogs`, `county`
  - Response: JSON object like `{"success": true}`

- `GET /search-analytics`
  - Response: JSON array of rows from `tblSearchAnalytics`

- `POST /add-search-analytics`
  - Body: JSON with fields such as `searchType`, `timeStamp`, `search`, `results`, `county`, `checked`
  - Response: JSON object like `{"success": true}`

## EmailJS Branch Replacements

These are the only fake-backend replacements kept from the `emailjs` branch work.

- `POST /referral`
  - Body: JSON with either
    `{"firstName","lastName","email","phone","message"}`
    or the original emailjs branch keys
    `{"newFirstName","newLastName","newEmail","newPhone","newMessage"}`
  - Response: referral object with
    `id`, `firstName`, `lastName`, `email`, `phone`, `message`

- `GET /referral?id=<int>`
  - Query param: `id`
  - Response: one referral object

- `GET /create-service?uuid=<request-id>`
- `POST /create-service`
  - Query or body value: `uuid` or `id`
  - Behavior: loads an existing pending create request from `tblServiceRequests`, maps the saved payload into the real `tblServices` schema, inserts the service row, attempts to geocode the service address with the U.S. Census Geocoder, falls back to the first matching county center when geocoding fails, stores the result in `tblCoordinates`, deletes the processed request, and returns the created service object as JSON

There is currently no public route that creates rows in `tblServiceRequests`. `create-service` only consumes an already-existing pending `CREATE` request.

This matches the minimal fake-backend behavior those frontend files were asking for:
- referral creation
- referral lookup by id
- approving a pending service by request id

## Database Behavior

- Local development uses SQLite at `api/src/UCAssist.db`.
- Non-local hosts use MySQL with credentials hardcoded in `api/src/database.php` except for `DB_PASSWORD`, which comes from the environment.
- `tblMonthlyViews`, `tblReferrals`, and `tblServiceRequests` are created automatically if they do not exist.
- `tblCoordinates` is also created automatically if it does not exist.
- The backend expects `tblPageAnalytics` and `tblSearchAnalytics` to already exist.
- `tblCountyCoordinates` is available through `get_county_coordinates()`, but there is currently no public route exposing it.

## Environment Variables

These variables are currently read from `api/.env`:

- `GOOGLE_API_KEY`: Required for `/prompt` and `/recommendations`
- `DB_PASSWORD`: Required for production MySQL connections

## Running the Server

From `Gov-AI/api`:

```bash
php -S localhost:8000 index.php
```
