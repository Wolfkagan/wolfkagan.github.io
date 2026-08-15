# ÖTÜKEN AI Corporate Website

Public corporate website for **ÖTÜKEN AI** — responsible, traceable and human-centred AI research from Türkiye.

## Public site

- Website: https://otukenai.com
- Turkish: https://otukenai.com/tr
- English: https://otukenai.com/en
- German: https://otukenai.com/de
- Contact: contact@otukenai.com

Each language includes dedicated Technology, Principles, Trust and About pages. Translation copy is maintained centrally in `app-source/src/content/`.

## Technology

- React 19 and TypeScript
- Vite 7
- Server-rendered static output for all 15 localized routes
- Responsive design system with reduced-motion and keyboard support
- Route-specific metadata, canonical URLs, `hreflang`, structured data and sitemap
- Automated translation-parity and public-disclosure audits

## Local development

```bash
cd app-source
npm install
npm run dev
```

## Verification and production build

```bash
cd app-source
npm run verify
```

The verification command runs linting, TypeScript checks, translation parity, the production build, the public-disclosure audit and rendered-route tests. Production output is written to `site-dist/`.

GitHub Actions publishes only the verified `site-dist/` artifact to GitHub Pages.

## Public-content policy

The site intentionally excludes credentials, local paths, operational commands, private infrastructure details, unverified performance claims and private documents. See `docs/PUBLIC_CONTENT_POLICY.md` for the publication rules and review checklist.
