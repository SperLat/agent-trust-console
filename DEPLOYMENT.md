# Deployment

Agent Trust Console is a plain Node.js app with no build step.

## Recommended Host

Any Node-capable host can run:

```bash
npm start
```

The app reads `PORT` from the environment and defaults to `4321`.

## Environment Variables

Required:

- none

Optional:

- `PORT`: host port.

## Render-Style Setup

- Build command: none
- Start command: `npm start`
- Health check path: `/api/status`

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
- Future production deployment should persist audit events, add authentication, and integrate with a real policy enforcement proxy.
