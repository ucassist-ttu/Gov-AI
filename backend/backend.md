# Backend Documentation

## API Endpoints

- `POST /prompt`
  - Body: JSON `{"user_input": "<text>"}`.
  - Response: Array of up to 3 service objects chosen by Gemini using the provided user input.
- `GET /services`
  - Params: none.
  - Response: Array of all services from `tblServices`.
- `GET /service?id=<int>`
  - Query param: `id` (integer).
  - Response: Single service at that index from the full services array.
- `PUT /create-service`
  - Body: JSON `{"service": {<service fields>}}`.
  - Behavior: Inserts a new service row; no body is returned.
- `PUT /update-service`
  - Body: JSON `{"service": {<service fields including ID>}}`.
  - Behavior: Updates the matching row (matched on `ID`); no body is returned.
- `DELETE /delete-service`
  - Body: JSON `{"id": <int>}`.
  - Behavior: Deletes the matching row by `ID`; no body is returned.

### Service object shape

All service bodies must include these fields (matching `tblServices` columns):
`ID`, `OrganizationName`, `OrganizationDescription`, `Website`, `MinorityOwned`, `FaithBasedProvider`, `NonProfitProvider`, `ProviderLogo`, `NameOfSevice`, `ServiceDescription`, `ProgramCriteria`, `Keywords`, `CountiesAvailable`, `TelephoneContact`, `EmailContact`, `ServiceAddress`, `CityStateZip`, `HoursOfOperation`.

## Running the server

From `Gov-AI/backend`: `php -S localhost:8000`
