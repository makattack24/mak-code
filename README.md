# Tech_With_Mak

An Angular 19 web app deployed on [Netlify](https://www.netlify.com/).

---

## How the Project Works

This is a **Single Page App (SPA)**. The entire site is one `index.html` file, and Angular's router handles showing different pages in the browser.

### Key files

| File | Purpose |
|---|---|
| `src/` | All your source code (TypeScript, HTML, SCSS) |
| `angular.json` | Tells Angular where your source code is and how to build it |
| `package.json` | Lists dependencies and defines scripts like `start` and `build` |
| `netlify.toml` | Tells Netlify how to build and where the output is |
| `public/_redirects` | SPA redirect rule so Angular routing works on Netlify |
| `netlify/functions/` | Serverless functions (login, users, logs) that run on Netlify |
| `dist/myweb/browser/` | The compiled output folder (only exists after a build) |

---

## Local Development

### Option 1: Angular only (no Netlify functions)

```bash
ng serve
```

Opens at `http://localhost:4200/`. Hot reloads when you save files. Does **not** run Netlify functions.

### Option 2: Full Netlify environment (recommended)

```bash
netlify dev
```

This runs `ng serve` behind the scenes **plus** your Netlify functions and `_redirects` rules. Opens at `http://localhost:8888/`.

Use this if your app calls any Netlify functions (e.g. login, users).

> **You do NOT need to run `npm run build` before `netlify dev`.** It uses your source files directly — no `dist` folder needed for local dev.

---

## Building for Production

```bash
npm run build
```

This compiles everything into `dist/myweb/browser/` — a folder of static files (`.js`, `.css`, `.html`, assets like `.mp3`) that any web server can host.

You only need to run this manually if you want to inspect the production output locally. **Netlify runs this automatically on every deploy.**

---

## Deploying to Netlify

When you push to your connected Git branch, Netlify automatically:

1. Runs the build command (`npm run build`) on its servers
2. Takes the publish directory (`dist/myweb/browser/`) and hosts those files
3. Makes your Netlify functions (`netlify/functions/`) available as API endpoints

This is configured in `netlify.toml`:

```toml
[build]
publish = "dist/myweb/browser"
command = "npm run build"
```

---

## The `_redirects` File

Located at `public/_redirects`, this gets copied into the build output.

```
/*    /index.html   200
```

**What it does:** If someone requests a URL that doesn't match a real file, Netlify serves `index.html` instead. Then Angular's router shows the correct page.

**Important:** Do **NOT** add `!` at the end (`200!`). The `!` is a force flag that makes Netlify serve `index.html` for *everything* — including `.js`, `.css`, and `.mp3` files — which breaks the entire site with MIME type errors.

---

## Netlify Functions

Netlify Functions are **serverless backend functions** that run on Netlify's servers. They let you run server-side code (like database queries, password hashing, API calls) without managing your own backend server.

### How they work

1. You write a TypeScript function in `netlify/functions/`
2. Each file becomes an API endpoint at `/.netlify/functions/<filename>`
3. Your Angular app calls these endpoints with `HttpClient` like any other API

### Your functions

| File | Endpoint | What it does |
|---|---|---|
| `netlify/functions/login.ts` | `/.netlify/functions/login` | Authenticates a user — checks email/password against the Neon database |
| `netlify/functions/users.ts` | `/.netlify/functions/users` | Full CRUD for users (GET, POST, PUT, DELETE) — used by the admin panel |
| `netlify/functions/logs.ts` | `/.netlify/functions/logs` | Logs visitor info (IP, user agent) to Neon DB and sends a Discord notification |

### How they're called from Angular

In your Angular code, you call functions like regular API requests:

```typescript
// In app.component.ts — log a visitor
this.http.get('/.netlify/functions/logs').subscribe();

// In admin.component.ts — fetch all users
this.http.get('/.netlify/functions/users').subscribe();
```

The `/.netlify/functions/` prefix is what tells Netlify to route the request to your serverless function instead of looking for a static file.

### Database & Environment Variables

The functions use:
- **`@netlify/neon`** — connects to a Neon PostgreSQL database (configured in Netlify's dashboard)
- **`bcryptjs`** — hashes and compares passwords securely
- **Environment variables** (like `DISCORD_WEBHOOK_URL`) — set these in Netlify's dashboard under Site Settings → Environment Variables. They're automatically available to your functions via `process.env`.

### Testing functions locally

Functions **only** work with `netlify dev`, not with `ng serve`. If you use `ng serve`, any calls to `/.netlify/functions/...` will fail.

---

## Code Scaffolding

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Running Unit Tests

```bash
ng test
```

## Quick Reference

| What you want to do | Command |
|---|---|
| Local dev (Angular only) | `ng serve` |
| Local dev (with Netlify functions) | `netlify dev` |
| Production build | `npm run build` |
| Deploy | Push to Git (Netlify auto-deploys) |
| Generate a component | `ng generate component name` |
| Run tests | `ng test` |

## Additional Resources

- [Angular CLI Docs](https://angular.dev/tools/cli)
- [Netlify Redirects Docs](https://docs.netlify.com/routing/redirects/)
- [Netlify Functions Docs](https://docs.netlify.com/functions/overview/)
