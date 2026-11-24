# chronos

# Docker
## launch
- dev
```
docker compose up --build -w
```
- prod
```
docker compose -f compose.yaml -f compose.prod.yaml up --build
```
## finish
```
docker compose down
```

## Test email

Set `ETHEREAL_USER` and `ETHEREAL_PASS` in the root `.env` and check [Ethereal](https://ethereal.email/) → Messages.
The email links to the planned frontend route `/confirm-email#token=…`. Set `FRONTEND_PUBLIC_URL` to override `http://localhost:5173`.
