# Fellacoo Site Delivery Worker

This Worker is the public delivery layer for published Fellacoo websites.

## Public URL

Published sites use:

https://<business-slug>.fellacoo.xyz

The R2 bucket remains internal storage:

sites/<business-slug>/index.html

The CDN/R2 URL is not the customer-facing URL.

## Request mapping

- / → sites/<slug>/index.html
- /about/ → sites/<slug>/about/index.html
- /about → 308 redirect to /about/
- Future static assets such as /assets/logo.png → sites/<slug>/assets/logo.png

## Cloudflare setup

The Wrangler config creates the wildcard Worker route:

*.fellacoo.xyz/*

Cloudflare requires a proxied DNS record for wildcard subdomain routing. Create this DNS record in the fellacoo.xyz zone:

- Type: A
- Name: *
- IPv4: 192.0.2.1
- Proxy status: Proxied

The address is a reserved documentation address. Cloudflare intercepts the request at the edge and the Worker handles the response.

## Deploy

From the repository root:

npx wrangler deploy --config cloudflare/site-delivery/wrangler.jsonc

The Cloudflare API token used by Wrangler needs permission to deploy the Worker, manage the route, and access the R2 bucket.

## Important

The Worker only serves subdomains under fellacoo.xyz. It does not replace the Next.js application at the apex domain.
