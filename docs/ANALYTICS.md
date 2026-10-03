# Leaderboard design and Free plan budget

## Implementation status

The Worker now collects lightweight, anonymous avatar-request events in the `LEADERBOARD_KV` namespace. An hourly cron trigger aggregates those events into one snapshot. The public page reads that snapshot with a five-minute KV and Edge Cache TTL. `LEADERBOARD_DATA` remains a safe fallback for local development and deployments without a populated snapshot.

The integration below is a proposed follow-up, not deployed functionality. The public page must not claim live statistics or show deployment instructions to visitors.

## Collection and aggregation

Use **100% collection while traffic remains within the KV Free tier**. A fixed 1% sample loses too much information at low traffic: a domain with 100 requests yields only one event on average and has about a 37% chance of yielding none.

- Write one short-lived KV event per avatar request that includes only the validated `Referer` hostname, response bytes when known, cache result, and timestamp.
- Do not store email, hash, full URL, IP, or referrer path. Requests without a valid public hostname are ignored.
- Run one scheduled aggregation per hour. It lists the retained events, reads them in KV bulk batches, and writes one snapshot containing the `1d`, `3d`, `7d`, and `30d` ranges.
- Public leaderboard requests read only the snapshot. KV uses a five-minute `cacheTtl`, and the HTML has the existing five-minute Edge Cache policy.
- Collection failures never affect avatar delivery. If KV is unavailable, the page falls back to `LEADERBOARD_DATA`.

## Verified quota and usage

[KV Free](https://developers.cloudflare.com/kv/platform/pricing/) includes 100,000 reads and 1,000 writes/day. Collection therefore stays enabled while attributed avatar traffic is comfortably below roughly 1,000 requests/day; the hourly snapshot adds one write and a bounded number of bulk reads. Check account-wide KV usage before raising the collection volume or retention window.

## Measurement boundaries

Referrer attribution is approximate: the header is optional and client-controlled. Group absent/invalid referrers as direct/unknown and exclude private/local hostnames.

Cache rate covers requests that reach this Worker and are served by its transform or upstream response cache. Browser cache hits never reach the Worker. Response bytes include only known image body lengths; the Worker never buffers an image solely for statistics.

Full application collection improves small-domain counts but does not make referrer attribution or Cloudflare's internal sampling exact.

## Current snapshot display contract

`LEADERBOARD_DATA` accepts a legacy array (shown with an unknown reporting period), or an object with `entries`, `periodStart`, `periodEnd` and optional `demo: true`. Dates use UTC ISO timestamps, for example `2026-10-01T00:00:00Z`. Supply the actual aggregation interval; the UI never invents a rolling range. `demo: true` explicitly labels sample traffic.

`requests` means avatar GET requests with a valid referring hostname over that interval, including requests served from the Worker's caches. It is not visitors, page views, or browser cache hits. Referrer attribution is optional and client-controlled, so the leaderboard is directional rather than a complete traffic census.

The UI exposes precomputed `1d`, `3d`, `7d` and `30d` range snapshots from one KV envelope. Selecting a range or page is handled in the browser and does not query Analytics Engine or list event keys. Leaderboard HTML is marked public and edge-cacheable for five minutes (`s-maxage`); the development server bypasses this cache so local edits appear immediately.

All ranges arrive in one HTML response. Missing ranges are disabled; legacy arrays have no range selector. The month option means a rolling 30 days. Cache keys ignore range and page, but retain locale and `Accept-Language` variants. Cache API entries are local to a data center and may be evicted.

The leaderboard displays validated hostnames without masking. Its purpose is to compare which sites use the service. Only publish intended public hostnames in the supplied snapshot; never include URLs, paths, emails, IP addresses or internal hostnames. Automated collection remains a follow-up and must apply its own publication policy before generating a public snapshot.

Sorting uses descending requests, with domain as a deterministic tie-breaker, and each page shows 10 entries with a global rank. Pagination reads the same configured snapshot and makes no Analytics Engine or KV calls. The old silent top-100 cutoff is removed.
