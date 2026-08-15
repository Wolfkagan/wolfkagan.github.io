import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repositoryRoot = path.resolve(appRoot, "..");
const outputRoot = path.join(repositoryRoot, "site-dist");
const ssrEntry = path.join(appRoot, "ssr-dist", "entry-server.js");
const siteUrl = "https://otukenai.com";
const locales = ["tr", "en", "de"];
const pageSlugs = { home: "", technology: "technology", principles: "principles", trust: "trust", about: "about" };

const { render } = await import(pathToFileURL(ssrEntry).href);
const template = await readFile(path.join(outputRoot, "index.html"), "utf8");
const dictionaries = Object.fromEntries(await Promise.all(locales.map(async (locale) => [
  locale,
  JSON.parse(await readFile(path.join(appRoot, "src", "content", `${locale}.json`), "utf8")),
])));

function escapeAttribute(value) {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function routePath(locale, page) {
  const slug = pageSlugs[page];
  return slug ? `/${locale}/${slug}` : `/${locale}`;
}

function replaceMeta(html, attribute, key, value) {
  const pattern = new RegExp(`<meta\\s+${attribute}="${key}"\\s+content="[^"]*"\\s*\\/?>(?![\\s\\S]*<meta\\s+${attribute}="${key}")`, "i");
  return html.replace(pattern, `<meta ${attribute}="${key}" content="${escapeAttribute(value)}" />`);
}

function setPageMetadata(html, locale, page, dictionary, isNotFound = false) {
  const route = routePath(locale, page);
  const metadata = dictionary.meta.pages[page];
  const title = isNotFound ? dictionary.notFound.title : metadata.title;
  const description = isNotFound ? dictionary.notFound.description : metadata.description;
  let result = html
    .replace(/<html lang="[^"]+">/i, `<html lang="${locale}">`)
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`)
    .replace(/<link rel="canonical" href="[^"]+"\s*\/>/i, `<link rel="canonical" href="${siteUrl}${route}" />`);

  result = replaceMeta(result, "name", "description", description);
  result = replaceMeta(result, "name", "robots", isNotFound ? "noindex,follow" : "index,follow");
  result = replaceMeta(result, "property", "og:url", `${siteUrl}${route}`);
  result = replaceMeta(result, "property", "og:locale", dictionary.meta.ogLocale);
  result = replaceMeta(result, "property", "og:title", title);
  result = replaceMeta(result, "property", "og:description", description);
  result = replaceMeta(result, "name", "twitter:title", title);
  result = replaceMeta(result, "name", "twitter:description", description);

  for (const alternate of locales) {
    const alternateUrl = `${siteUrl}${routePath(alternate, page)}`;
    const pattern = new RegExp(`<link rel="alternate" href(?:l|L)ang="${alternate}" href="[^"]+"\\s*\\/>`, "i");
    result = result.replace(pattern, `<link rel="alternate" hreflang="${alternate}" href="${alternateUrl}" />`);
  }
  result = result.replace(/<link rel="alternate" href(?:l|L)ang="x-default" href="[^"]+"\s*\/>/i, `<link rel="alternate" hreflang="x-default" href="${siteUrl}${routePath("tr", page)}" />`);
  return result;
}

const sitemapRoutes = [];
for (const locale of locales) {
  const dictionary = dictionaries[locale];
  for (const page of Object.keys(pageSlugs)) {
    const route = routePath(locale, page);
    const appHtml = render(route);
    let html = template.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
    html = setPageMetadata(html, locale, page, dictionary);
    const directory = path.join(outputRoot, route.slice(1));
    await mkdir(directory, { recursive: true });
    await writeFile(path.join(directory, "index.html"), html, "utf8");
    sitemapRoutes.push(`${siteUrl}${route}`);
  }
}

const notFoundMarkup = render("/tr/not-found");
let notFoundHtml = template.replace('<div id="root"></div>', `<div id="root">${notFoundMarkup}</div>`);
notFoundHtml = setPageMetadata(notFoundHtml, "tr", "home", dictionaries.tr, true);
await writeFile(path.join(outputRoot, "404.html"), notFoundHtml, "utf8");

const redirectHtml = `<!doctype html>
<html lang="tr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta http-equiv="refresh" content="0; url=/tr" />
    <meta name="robots" content="noindex,follow" />
    <link rel="canonical" href="${siteUrl}/tr" />
    <title>ÖTÜKEN AI</title>
  </head>
  <body><a href="/tr">ÖTÜKEN AI</a></body>
</html>
`;
await writeFile(path.join(outputRoot, "index.html"), redirectHtml, "utf8");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapRoutes.map((url) => `  <url><loc>${url}</loc></url>`).join("\n")}
</urlset>
`;
await writeFile(path.join(outputRoot, "sitemap.xml"), sitemap, "utf8");
console.log(`Prerendered ${sitemapRoutes.length} localized routes plus redirect and not-found pages.`);
