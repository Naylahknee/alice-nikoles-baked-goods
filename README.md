# Alice & Nikole's Baked Goods

Single-page site for the culinary-school tuition fundraising plan. Static: just `index.html`, no build step.

## Owner access and shared progress

Public visitors receive only the completed-item count, never checklist labels or checkbox state. Verified Google ID tokens are checked on every owner read/write; only the verified accounts listed in the private `OWNER_EMAILS` environment variable can edit. No IP/location rules. Tokens stay in memory; signing out or reloading requires signing in again. Public views refresh every 30 seconds. Financial inputs remain explicitly labeled browser-local planning calculators.

Vercel setup (required before owner access works):
1. Set `OWNER_EMAILS` in Vercel to the two authorized email addresses, separated by a comma. Keep this setting private. Create a Google OAuth **Web application** client in Google Cloud. Add the actual production and preview origins used for sign-in under **Authorized JavaScript origins**. Set its client ID as `GOOGLE_CLIENT_ID` on this Vercel project. No client secret is needed for Google Identity Services ID tokens.
2. Create a **private** Vercel Blob store, connect it to this project, and set its `BLOB_READ_WRITE_TOKEN` (or use the connected store's `BLOB_STORE_ID` with OIDC). Do not use a public store. Each checkbox uses an independent fixed blob path to avoid overwriting another checkbox's change.
3. Deploy this branch, then verify both owner accounts, a non-owner account, signed-out public progress, persistence after reload, and cross-device updates.

Missing storage/sign-in configuration keeps editing locked and reports that progress is unavailable. It does not import browser-local checklist history or publish it automatically; owners must recheck completed items after setup. Existing fundraising plan, math, dates and downloads remain intact.

`node build.js` copies only public assets to `public/`; server checklist labels and source remain outside the served directory. `npm test` checks authorization boundaries, update validation, failure behavior and all animation states. Live Google/Blob integration requires the above configuration.
