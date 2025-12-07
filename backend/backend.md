# Backend Documentation

## API Endpoints
- `POST /prompt`
  - Body: JSON `{"user_input":<text>}`.
  - Behavior: Returns the 3 most relevant services based on the user input.
- `GET /services`
  - Params: none.
  - Behavior: Returns all services from `tblServices` as an array of objects.
- `GET /service?id=<int>`
  - Query param: `id` (integer).
  - Behavior: Returns one service.

## Runing the server

From Gov-AI/backend: `php -S localhost:8000`
