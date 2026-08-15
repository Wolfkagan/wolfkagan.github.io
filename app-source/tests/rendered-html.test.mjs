import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import test from "node:test";

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputRoot = path.resolve(appRoot, "..", "site-dist");
const locales = ["tr", "en", "de"];
const pageSlugs = ["", "technology", "principles", "trust", "about"];
const staticPaths = new Set(locales.flatMap((locale) => pageSlugs.map((slug) => slug ? `/${locale}/${slug}` : `/${locale}`)));

function routePath(locale, slug) {
  return slug ? `/${locale}/${slug}` : `/${locale}`;
}

for (const locale of locales) {
  for (const slug of pageSlugs) {
    const route = slug ? `${locale}/${slug}` : locale;
    test(`renders /${route}`, async () => {
      const html = await readFile(path.join(outputRoot, route, "index.html"), "utf8");
      assert.match(html, new RegExp(`<html lang="${locale}">`));
      assert.equal((html.match(/<h1(?:\s|>)/g) ?? []).length, 1);
      assert.match(html, /ÖTÜKEN AI/);
      assert.match(html, new RegExp(`<link rel="canonical" href="https://otukenai\\.com/${route}"`));
      assert.match(html, /<main id="main">/);
      assert.match(html, /<a class="skip-link" href="#main">/);
      assert.match(html, /data-brand-mark="otuken-ai-sigil-v1"/);
      assert.match(html, /"@type":"Organization"/);
      assert.match(html, /"@type":"WebSite"/);
      assert.doesNotMatch(html, /href=""|href="javascript:/i);

      for (const alternate of locales) {
        assert.match(html, new RegExp(`hreflang="${alternate}"`));
        assert.match(html, new RegExp(`href="${routePath(alternate, slug)}"`));
      }
      for (const destination of pageSlugs) assert.match(html, new RegExp(`href="${routePath(locale, destination)}"`));

      const anchorHrefs = [...html.matchAll(/<a\b[^>]*\bhref="([^"]*)"/gi)].map((match) => match[1]);
      for (const href of anchorHrefs) {
        if (!href.startsWith("/") || href.startsWith("//")) continue;
        assert.ok(staticPaths.has(href), `broken internal link ${href} on /${route}`);
      }

      const headingLevels = [...html.matchAll(/<h([1-6])\b/gi)].map((match) => Number(match[1]));
      assert.equal(headingLevels[0], 1);
      for (let index = 1; index < headingLevels.length; index += 1) {
        assert.ok(headingLevels[index] <= headingLevels[index - 1] + 1, `heading level jumps on /${route}`);
      }

      assert.doesNotMatch(html, /Lorem ipsum|Otuken AI|Otüken Ai|OTUKENAI|OtukenAI|ÖtükenAI/);
      assert.doesNotMatch(html, /google-analytics|googletagmanager|hotjar|mixpanel/i);
    });
  }
}

test("root safely redirects to Turkish", async () => {
  const html = await readFile(path.join(outputRoot, "index.html"), "utf8");
  assert.match(html, /http-equiv="refresh" content="0; url=\/tr"/);
  assert.match(html, /rel="canonical" href="https:\/\/otukenai\.com\/tr"/);
});

test("not-found page reveals no internal detail", async () => {
  const html = await readFile(path.join(outputRoot, "404.html"), "utf8");
  assert.match(html, /noindex,follow/);
  assert.doesNotMatch(html, /[A-Za-z]:\\|\/Users\/|\/home\/|localhost|stack trace|process\.env/i);
});

test("production CSS includes responsive, focus and reduced-motion safeguards", async () => {
  const assetDirectory = path.join(outputRoot, "assets");
  const cssFile = (await readdir(assetDirectory)).find((file) => file.endsWith(".css"));
  assert.ok(cssFile, "production CSS asset missing");
  const css = await readFile(path.join(assetDirectory, cssFile), "utf8");
  assert.match(css, /:focus-visible/);
  assert.match(css, /@media\(max-width:560px\)/);
  assert.match(css, /@media\(prefers-reduced-motion:reduce\)/);
  assert.match(css, /animation-duration:\.01ms!important/);
  assert.doesNotMatch(css, /sourceMappingURL/);
});

test("security policy and search-engine files ship with the public artifact", async () => {
  const headers = await readFile(path.join(outputRoot, "_headers"), "utf8");
  const favicon = await readFile(path.join(outputRoot, "favicon.svg"), "utf8");
  const brandSymbol = await readFile(path.join(outputRoot, "brand", "otuken-ai-symbol.svg"), "utf8");
  const manifest = JSON.parse(await readFile(path.join(outputRoot, "site.webmanifest"), "utf8"));
  const socialImage = await readFile(path.join(outputRoot, "og.png"));
  const robots = await readFile(path.join(outputRoot, "robots.txt"), "utf8");
  const sitemap = await readFile(path.join(outputRoot, "sitemap.xml"), "utf8");
  assert.match(headers, /Content-Security-Policy:/);
  assert.match(headers, /Referrer-Policy:/);
  assert.match(headers, /Permissions-Policy:/);
  assert.match(headers, /X-Content-Type-Options: nosniff/);
  assert.match(headers, /Strict-Transport-Security:/);
  assert.match(favicon, /data-brand-mark="otuken-ai-sigil-v1"/);
  assert.match(brandSymbol, /data-brand-mark="otuken-ai-sigil-v1"/);
  assert.deepEqual(manifest.icons.map((icon) => icon.src), ["/favicon.svg", "/icon-192.png", "/icon-512.png"]);
  assert.ok(socialImage.byteLength < 300_000, "social sharing image should remain optimized");
  for (const asset of ["favicon-32x32.png", "apple-touch-icon.png", "icon-192.png", "icon-512.png"]) {
    assert.ok((await readFile(path.join(outputRoot, asset))).byteLength > 0, `${asset} should ship with the public artifact`);
  }
  assert.match(robots, /Sitemap: https:\/\/otukenai\.com\/sitemap\.xml/);
  assert.equal((sitemap.match(/<url>/g) ?? []).length, 15);
});
