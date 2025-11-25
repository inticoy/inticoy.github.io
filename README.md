## Getting Started

```bash
# install dependencies
pnpm install

# run the dev server
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) and edit files under `app/` or `components/` to iterate. The project uses the Next.js `app` router with `output: 'export'`, so `pnpm build` produces a fully static site inside the `out/` directory.

## Environment variables

Copy `.env.local` and fill in the build-time variables:

```
NOTION_ROOT_PAGE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_ACTIVE_USER= # optional
NOTION_TOKEN_V2=    # optional
```

Local development reads directly from `.env.local`. When deploying with GitHub Actions, define the same keys as repository **Secrets** so the workflow can inject them during `pnpm run build`.

## Deployment (GitHub Pages)

The repo includes `.github/workflows/deploy.yml`, which:

1. Runs on every push to `main` (or manually via *Run workflow*).
2. Installs Node.js 20 and pnpm 9, restores the pnpm cache, and executes `pnpm install --frozen-lockfile` + `pnpm run build`.
3. Uploads the generated `out/` folder and publishes it via `actions/deploy-pages@v4`.

To finish setup:

1. In GitHub → *Settings → Secrets and variables → Actions*, add the secrets `NOTION_ROOT_PAGE_ID` (required) plus the optional Notion credentials if you need them.
2. In *Settings → Pages*, choose **GitHub Actions** as the source.

After that, any push to `main` will trigger a fresh static export and deployment to GitHub Pages.
