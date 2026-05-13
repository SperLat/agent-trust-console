# Deployment

Agent Trust Console is a plain Node.js app with no build step and no external service dependency.

## Recommended Host

Any Node-capable host can run:

```bash
npm start
```

The app reads `PORT` from the environment and defaults to `4321`. It binds to `HOST`, defaulting to `0.0.0.0` for public web-service hosts.

## Environment Variables

Required:

- none

Optional:

- `PORT`: host port.
- `HOST`: bind host, default `0.0.0.0`.

## Render Blueprint

This repo includes `render.yaml`. In Render, create a Blueprint from the GitHub repo and use:

- Blueprint path: `render.yaml`
- Health check path: `/api/status`
- Start command: `npm start`

Render's docs specify that web services should bind to a public host/port and that `healthCheckPath` can be set in `render.yaml` for HTTP readiness checks.

## Manual Node Setup

- Runtime: Node.js 22 or newer.
- Build command: `npm install`
- Start command: `npm start`
- Health check path: `/api/status`

## Docker Setup

This repo also includes a `Dockerfile` for hosts that prefer container deploys:

```bash
docker build -t agent-trust-console .
docker run --rm -p 4321:4321 -e PORT=4321 agent-trust-console
```

## Verification

Run:

```bash
npm run verify
```

The verification script starts a temporary server, checks the app shell, validates the status API, runs an inspection, and shuts the server down.

## Security Notes

- This demo runs a local policy engine and does not transmit prompts to external services.
- Audit events are kept in memory only.
- No credentials are required for the current demo.
- Future production deployment should persist audit events, add authentication, and optionally call a configured Lobster Trap binary or proxy endpoint.
