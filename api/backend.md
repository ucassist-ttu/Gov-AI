# Backend Documentation

## Overview

The backend now lives under `api/`. The entrypoint is `api/index.php`, which loads environment variables from `api/.env`, connects to either the local SQLite database or the production MySQL database, and exposes a small set of JSON endpoints.

## File Layout

- `api/index.php`: Route handling for all public endpoints.
- `api/src/loadenv.php`: Lightweight `.env` loader.
- `api/src/database.php`: Database connection logic and query helpers.
- `api/src/api.php`: Prompt/recommendation helpers that build Gemini prompts from service data.
- `api/src/gemini.php`: Raw Gemini API call wrapper.
- `api/src/distance.php`: Haversine distance helper. Present in the codebase, but not currently wired into any route.
- `api/src/UCAssist.db`: Local SQLite database used when the server is running on `localhost` or `127.0.0.1`.

## API Endpoints

- `POST /prompt`
  - Body: JSON `{"user_input": "<text>"}`
  - Response: JSON array of service objects selected by Gemini from the current services table.

- `POST /recommendations`
  - Body: JSON `{"service_id": <int>}`
  - Response: JSON array of service objects Gemini considers similar to the selected service.

- `GET /services`
  - Response: JSON array containing every row in `tblServices`.

- `GET /service?id=<int>`
  - Query param: `id`
  - Response: JSON object for the matching service, or an empty array if no row is found.

- `GET /monthly-views`
  - Response: JSON array of per-service view counts produced from `tblServices` joined with `tblMonthlyViews`.

- `GET /add-monthly-view?service_id=<int>`
  - Query param: `service_id`
  - Response: JSON object like `{"success": true}` after inserting a row into `tblMonthlyViews`.

## Service Object Shape

The service payloads come directly from `tblServices`. The current checked-in SQLite schema includes these columns:

`ID`, `OrganizationName`, `OrganizationDescription`, `Website`, `MinorityOwned`, `FaithBasedProvider`, `NonProfitProvider`, `ProviderLogo`, `NameOfService`, `ServiceDescription`, `ProgramCriteria`, `Keywords`, `CountiesAvailable`, `TelephoneContact`, `EmailContact`, `ServiceAddress`, `CityStateZip`, `HoursOfOperation`

## Database Behavior

- Local development uses SQLite at `api/src/UCAssist.db`.
- Non-local hosts use MySQL with credentials hardcoded in `api/src/database.php` except for `DB_PASSWORD`, which comes from the environment.
- `tblCountyCoordinates` is available through `get_county_coordinates()`, but there is currently no public route exposing it.
- The code expects a `tblMonthlyViews` table for the monthly views endpoints.

## Environment Variables

These variables are currently read from `api/.env`:

- `GOOGLE_API_KEY`: Required for `/prompt` and `/recommendations`
- `DB_PASSWORD`: Required for production MySQL connections

## Removed From Current Backend

The old documentation referenced request approval endpoints such as `request-create-service`, `request-update-service`, `request-delete-service`, and the corresponding approval links. Those routes are not present in the current `api/index.php` and are no longer part of the active backend.

## Running the Server

From `Gov-AI/api`:

```bash
php -S localhost:8000 index.php
```
