# Backend Documentation

## API Endpoints

- `POST /prompt`
  - Body: JSON `{"user_input": "<text>"}`.
  - Response: Array of up to 3 service objects chosen by Gemini using the provided user input.
- `POST /recommendations`
  - Body: JSON `{"service_id": <int>}`.
  - Response: Array of 3 service objects Gemini considers most similar to the given service.
  - Response: Single service for that id.
- `POST /request-create-service`
  - Body: JSON `{"service": {<service fields>}}`.
  - Behavior: Creates a pending service request, emails approval links, and returns an empty response body.
- `POST /request-update-service`
  - Body: JSON `{"service": {<service fields>}}`.
  - Behavior: Creates a pending update request, emails approval links, and returns an empty response body.
- `POST /request-delete-service`
  - Body: JSON `{"id": <int>}`.
  - Behavior: Creates a pending delete request, emails approval links, and returns an empty response body.
- `GET /create-service?uuid=<id>`
  - Query param: `uuid` (service request ID).
  - Behavior: Loads the request from `tblServiceRequests`, inserts the service into `tblServices`, and returns an empty response body.
- `GET /update-service?uuid=<id>`
  - Query param: `uuid` (service request ID).
  - Behavior: Loads the request from `tblServiceRequests`, updates the matching service row by `ID`, and returns an empty response body.
- `GET /delete-service?uuid=<id>`
  - Query param: `uuid` (service request ID).
  - Behavior: Loads the request from `tblServiceRequests`, deletes the matching service row by `ID`, and returns an empty response body.

### Service object shape

All service bodies must include these fields (matching `tblServices` columns):
`ID`, `OrganizationName`, `OrganizationDescription`, `Website`, `MinorityOwned`, `FaithBasedProvider`, `NonProfitProvider`, `ProviderLogo`, `NameOfService`, `ServiceDescription`, `ProgramCriteria`, `Keywords`, `CountiesAvailable`, `TelephoneContact`, `EmailContact`, `ServiceAddress`, `CityStateZip`, `HoursOfOperation`.

### Service request workflow

- `request-*` endpoints create a row in `tblServiceRequests` with a UUID and email all recipients in `email_addresses.txt`.
- Emails contain links to the `GET /create-service`, `GET /update-service`, or `GET /delete-service` endpoints with the UUID.
- The `GET` endpoints execute the requested action immediately with no response body.

### Environment variables

These must be set in `backend/.env` and loaded at runtime:

- `GOOGLE_API_KEY` (Gemini API key used by `/prompt` and `/recommendations`)
- `MAILGUN_API_KEY`, `MAILGUN_DOMAIN`, `MAILGUN_FROM` (Mailgun credentials used to send request-approval emails)

## Running the server

From `Gov-AI/backend`: `php run.php`
