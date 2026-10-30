This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Cloudflare Pages

This project is deployed to the Cloudflare Pages project `nisab-today-nextjs` using `@cloudflare/next-on-pages`.

The adapter runs `vercel build` internally to create the `.vercel/output` files that it converts for Cloudflare Pages. This does not deploy the app to Vercel and does not require a Vercel account.

For the first deploy from a new computer, install dependencies and authenticate Wrangler:

```sh
npm install
npx wrangler login
```

Then build and deploy with:

```sh
npm run pages:deploy
```

The command builds the Next.js app for Cloudflare Pages and uploads it to `nisab-today-nextjs`. Run the same command whenever you want to redeploy manually. If the Cloudflare Pages project is connected to the production Git branch, pushing a commit to that branch also triggers a deployment automatically.

## Currency and country pages

- `/currency/eur`, `/currency/usd`, etc.: latest gold/silver thresholds and historical chart.
- `/country/italy`, `/country/united-kingdom`, etc.: country-specific title, copy and links to the appropriate currency.
- `/countries`: server-rendered directory; the landing page also links to currency detail pages.
- `/sitemap.xml` and `/robots.txt`: discovery, self-canonical metadata and breadcrumb JSON-LD. All new content remains in English. Localized content/hreflang can be added later; no Italian-language SEO guarantees are implied.

Prices and explanatory content are rendered on the server. A single responsive SVG chart loads history through `/api/history/[currency]`; the Cloudflare API key stays on the server. Choose gold/silver and 1M, 3M, 1Y or All. Date windows are relative to today in UTC; an empty recent window is shown honestly if collection has stopped. Hover/touch or use the keyboard-accessible date slider; an expandable table exposes the underlying values. The chart does not fill in missing days.

The country catalogue derives from the existing currency data, with explicit handling for ambiguous mappings and exclusions for retired currencies, crypto and units of account. Croatia and Bulgaria use EUR. Currency archives remain separately accessible, including legacy codes; country/currency mappings should be reviewed when currencies change. Source: [ECB, Bulgaria](https://www.ecb.europa.eu/press/pr/date/2026/html/ecb.pr260101~c830245e42.en.html), [ECB, Croatia](https://www.ecb.europa.eu/euro/changeover/croatia/html/index.en.html).

### Configuration and rollout

Copy `.env.example` to `.env.local` only when creating a new environment. Preserve the existing API key in configured environments:

- `NISAB_API_KEY`: existing server-side API key.
- `NISAB_API_URL`: optional API origin; defaults to `https://api.nisabtoday.org`.

Deploy the Cloudflare backend first, then this frontend. The new backend endpoint reads existing KV snapshots directly; no migration or backfill is required. Until the backend is deployed, the historical chart displays an unavailable state and retry button. Current prices and history handle errors independently.

`@cloudflare/next-on-pages` is pinned to `1.13.2` because newer releases have incompatible Next.js peer requirements. Next.js and `eslint-config-next` are pinned to the patched `14.2.35` release. The adapter uses Vercel CLI to create its build output, but deploys to Cloudflare Pages through Wrangler.

### Checks

```sh
npx tsc --noEmit
npm run build
```

No production deployment was performed. The browser preview uses synthetic observations in a local Worker, not fabricated additions to the real database.
