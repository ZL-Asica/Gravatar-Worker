# Leaderboard design and Free plan budget

## Implementation status

The UI currently reads a manually configured `LEADERBOARD_DATA` array. It does not collect events, query Analytics Engine, or read KV. Workers Logs sampling is separate from leaderboard event collection.

The integration below is a proposed follow-up, not deployed functionality. The public page must not claim live statistics or show deployment instructions to visitors.

## Collection and aggregation

Use **100% application-side collection by default** for avatar GET requests. A fixed 1% sample loses too much information at low traffic: a domain with 100 requests yields only one event on average and has about a 37% chance of yielding none.

- Write one Analytics Engine point per avatar request. Keep only the referrer hostname, response bytes when known, and the observed cache result. Never store email, hash, full URL, IP, or referrer path.
- Run one scheduled SQL query per hour over the last 24 hours, then write one KV snapshot. Public leaderboard requests must never query Analytics Engine.
- Edge-cache the snapshot for one hour using a common key across locales/query strings. Read KV only on a cache miss; cache empty results too. Cache API storage is per location, so KV reads are not limited to 24 per day globally.
- Display the reporting window, last update time, collection rate, and byte coverage. Mark snapshots older than two hours as delayed.
- Keep collection opt-in and isolate failures from avatar delivery. Preserve the last successful snapshot if aggregation fails.

At higher traffic, choose a configurable collection rate from actual account-wide usage and retain a safety margin for other datasets. Sampling reduces expected writes; it is not a strict global cap. Changing rate requires storing an event weight (`1 / collectionRate`). SQL must also apply Analytics Engine's `_sample_interval`, including at 100% application collection, because Cloudflare may sample stored/query data internally.

## Verified quota and usage

[Analytics Engine pricing](https://developers.cloudflare.com/analytics/analytics-engine/pricing/) lists Workers Free allowances of **100,000 written points/day** and **10,000 SQL queries/day**. Each `writeDataPoint()` counts as one write; each SQL API call counts as one read query. Cloudflare currently describes billing as not yet active, but the design budgets against the stated Free allowances.

For example, 1,000 avatar requests/day with full collection adds 1,000 points/day: **1%** of the daily write allowance. Check both the recent average and peak traffic; a rolling 24-hour Worker request count is not an account-wide Analytics Engine usage meter.

Hourly aggregation adds 24 SQL queries/day (**0.24%** of the allowance) and 24 KV writes/day. [KV Free](https://developers.cloudflare.com/kv/platform/pricing/) includes 100,000 reads and 1,000 writes/day. Verify shared account usage again before provisioning or enabling collection.

## Measurement boundaries

Referrer attribution is approximate: the header is optional and client-controlled. Group absent/invalid referrers as direct/unknown and exclude private/local hostnames.

Cache rate covers requests that reach this Worker and are served by its transform or upstream response cache. Browser cache hits never reach the Worker. Unknown cache outcomes should remain unknown, not silently become misses. Response bytes include only known image body lengths; never buffer an image merely for statistics. Show byte coverage so partial counts are not mistaken for complete bandwidth totals.

Full application collection improves small-domain counts but does not make referrer attribution or Cloudflare's internal sampling exact.

## Current snapshot display contract

`LEADERBOARD_DATA` accepts a legacy array (shown with an unknown reporting period), or an object with `entries`, `periodStart`, `periodEnd` and optional `demo: true`. Dates use UTC ISO timestamps, for example `2026-10-01T00:00:00Z`. Supply the actual aggregation interval; the UI never invents a rolling range. `demo: true` explicitly labels sample traffic.

`requests` means avatar GET requests attributed to the domain over that interval, including requests served from the Worker's caches. It is not visitors, page views or browser cache hits. This is a contract for supplied snapshots; collection remains unimplemented.

The leaderboard displays validated hostnames without masking. Its purpose is to compare which sites use the service, and masking makes similar domains indistinguishable without reliably anonymizing them. Only publish intended public hostnames in the supplied snapshot; never include URLs, paths, emails, IP addresses or internal hostnames. Automated collection remains a follow-up and must apply its own publication policy before generating a public snapshot.

Sorting uses descending requests, with domain as a deterministic tie-breaker, and each page shows 10 entries with a global rank. Pagination reads the same configured snapshot and makes no Analytics Engine or KV calls. The old silent top-100 cutoff is removed.
