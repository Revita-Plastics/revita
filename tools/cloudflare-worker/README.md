Cloudflare Worker to accept admin publish requests and forward to GitHub

## Purpose

This small Cloudflare Worker receives a POST with products and settings payload from the admin UI and forwards a repository_dispatch request to GitHub. The worker holds a GitHub Personal Access Token (PAT) in its environment (secret), so the browser never needs to see the PAT.

## Security notes

- Store the PAT as a secret bound to the Worker (e.g., `GH_PAGES_PAT`).
- Protect the endpoint by a simple shared secret `ADMIN_PUBLISH_SECRET` (also stored as a Worker secret) submitted from the admin page (you can rotate it).
- For production consider stronger auth (JWTs, OAuth, or IP restriction).

## How it works

1. Admin page POSTs to the worker at `/save-data` with JSON body { products, settings, secret }.
2. Worker validates `secret` header/body, then calls GitHub API `POST /repos/{owner}/{repo}/dispatches` with Authorization: `token <PAT>`.
3. Worker returns 200/202 if the dispatch was accepted.

## Deployment

Use `wrangler` to deploy the worker. Example steps:

1. Install wrangler: `npm i -g wrangler` (or follow Cloudflare docs)
2. Login: `wrangler login`
3. Create Worker route or site and set secrets:
   - `wrangler secret put GH_PAGES_PAT`
   - `wrangler secret put ADMIN_PUBLISH_SECRET`
4. Deploy: `wrangler publish`

Example code is provided in `worker.js`.
