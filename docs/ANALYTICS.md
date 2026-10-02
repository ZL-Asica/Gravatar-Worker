# Low-quota leaderboard design

The leaderboard is designed for the Cloudflare Workers Free plan. It must not write to a database on every avatar request and it must never query Analytics Engine from a public request.

## Recommended production setup

- Workers Analytics Engine receives a 1% sample only when `ANALYTICS_ENABLED=true`.
- Each sampled point stores the referrer hostname, a weighted request count, weighted known response bytes, and weighted cache-hit count. The weight is `1 / sampleRate`.
- One Cron Trigger runs hourly. It executes one 24-hour Analytics Engine SQL query and writes one JSON snapshot to Workers KV.
- `/leaderboard` reads one KV snapshot and edge-caches it for one hour. It never calls the Analytics Engine SQL API.
- At 100,000 avatar requests/day this is approximately 1,000 Analytics Engine writes and 24 SQL reads/day, below the documented Workers Free quotas of 100,000 writes/day and 10,000 reads/day.

The snapshot can be stale for roughly two hours when the KV or edge cache is refreshed just before the hourly job. The UI should display the snapshot timestamp and mark snapshots older than two hours as delayed.

## Privacy and accuracy

Only a normalized referrer hostname is stored. Referrer attribution is approximate because the header is optional and client-controlled; private/local suffixes should be excluded before production. Direct or unknown traffic is grouped as `direct`.

The cache rate measures requests reaching this Worker that were served from the transform or upstream response cache. Browser-cache hits never reach the Worker and are not included. Response bytes are estimated only when `Content-Length` is known; each row should show its byte coverage.

Analytics is opt-in and failure-isolated. If a binding, KV read, scheduled query, or cache operation fails, avatar delivery continues and the last successful snapshot remains visible.

## Bindings

Provision these bindings only when enabling the feature:

```jsonc
{
  "analytics_engine_datasets": [
    { "binding": "AVATAR_ANALYTICS", "dataset": "gravatar_usage" }
  ],
  "kv_namespaces": [
    { "binding": "LEADERBOARD_KV", "id": "<namespace-id>" }
  ],
  "triggers": { "crons": ["0 * * * *"] }
}
```

Store `ANALYTICS_API_TOKEN` as a Wrangler secret with only Account Analytics read permission. Keep `ANALYTICS_ENABLED=false` until both bindings and the secret are configured.
