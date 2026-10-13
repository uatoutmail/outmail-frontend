# Running OutMail Frontend

OutMail's frontend uses Next.js 16, React 19, and Tailwind CSS 4. It connects to the separate OutMail backend for authentication, dashboard data, and other API features.

## Prerequisites

- Node.js 22 (the version used by CI) and npm.
- A running OutMail backend for features that use the API. See the [backend setup instructions](../outmail-backend/README.md).

Run the following commands from this repository's root.

## 1. Install dependencies

```bash
npm ci
```

This installs the versions recorded in `package-lock.json` and sets up Husky Git hooks.

## 2. Configure the environment

Create `.env.local`, or update your existing file, with:

```dotenv
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
```

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | Base URL for Axios API requests and the production Content Security Policy's allowed API origin. |
| `NEXT_PUBLIC_BACKEND_URL` | Backend origin for Google sign-in links and other backend URLs. |
| `NEXT_PUBLIC_FRONTEND_URL` | Frontend origin used for canonical URLs, sitemap, robots, and structured data. |
| `NEXT_PUBLIC_SENTRY_DSN` | Optional browser error reporting. |
| `SENTRY_DSN` | Optional server error reporting; falls back to the public DSN. |

Set both backend variables to the backend **origin**, without an `/api` suffix; request paths already include `/api`. All `NEXT_PUBLIC_` values are visible in the browser, so do not put secrets in them.

For local Google sign-in, configure the backend with:

```dotenv
FRONTEND_URL=http://localhost:3000
APP_BASE_URL=http://localhost:3000
CORS_ORIGINS=http://localhost:3000
GOOGLE_REDIRECT_URI=http://localhost:8080/api/auth/google/callback
```

The backend also needs valid Google OAuth credentials, and its redirect URI must match the authorized redirect URI configured for that client. Keep the backend's `APP_ENV=development` for local development.

## 3. Start development

Start the backend in a separate terminal, then run:

```bash
npm run dev
```

Open `http://localhost:3000`. The development server uses Turbopack and reloads when you edit files. Stop it with Ctrl+C.

To use a different frontend port:

```bash
npm run dev -- --port 3001
```

Update the frontend origin and backend frontend/CORS settings to match. Restart the development server after changing environment variables.

## Production build

Configure the environment for the intended deployment before building:

```bash
npm run build
npm start
```

`npm start` serves the built application on port 3000 by default and requires a successful build first. Public environment variables are embedded during the build; rebuild after changing them.

## Tests and checks

Run the complete frontend CI checks before pushing:

```bash
npm run ci
```

This runs lint, a production build with a placeholder API URL, and unit/component tests. It does not run the backend checks or Playwright tests. The placeholder build is for validation; rebuild with your real API configuration before serving a production build.

Individual commands:

```bash
npm run lint
npm test
npm run test:watch
npm run format:check
```

Use `npm test` instead of invoking Vitest directly: the npm script sets the localStorage option required by the test setup. `npm run format` applies formatting across the repository.

### Browser tests

Install Playwright's Chromium browser once:

```bash
npx playwright install chromium
```

With the local backend running, execute:

```bash
E2E_API_BASE_URL=http://localhost:8080 npm run test:e2e
```

Playwright starts the frontend on port 3100 and points its API requests at the selected backend. These tests use a real backend. If `E2E_API_BASE_URL` is omitted, the configured default is the UAT backend, rather than localhost.

For the interactive runner:

```bash
E2E_API_BASE_URL=http://localhost:8080 npm run test:e2e:ui
```

Set `E2E_PORT` to change the browser-test frontend port. Stop an existing server on that port if it uses a different API configuration, because Playwright can reuse an existing server.

## Troubleshooting

- **API requests fail:** verify the backend is running and both public backend URLs point to its origin. Check `http://localhost:8080/api/health`.
- **Google sign-in fails:** check `NEXT_PUBLIC_BACKEND_URL`, the backend's Google credentials and callback URI, and its `FRONTEND_URL`.
- **CORS errors:** ensure the backend allows the frontend's actual origin in `CORS_ORIGINS`.
- **Port already in use:** stop the existing process or select another port and update the corresponding URL settings.
- **Environment changes do not appear:** restart development, or rebuild before running `npm start`.
- **Tests fail around localStorage:** use Node.js 22 and the provided npm test scripts.
