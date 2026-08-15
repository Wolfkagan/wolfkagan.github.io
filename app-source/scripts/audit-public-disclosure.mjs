import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "site-dist");
const textExtensions = new Set([".html", ".js", ".css", ".json", ".svg", ".xml", ".txt", ".webmanifest", ""]);
const allowedDomains = new Map([
  ["otukenai.com", "Canonical public site origin"],
  ["schema.org", "Structured-data vocabulary namespace"],
  ["www.w3.org", "SVG namespace identifier"],
  ["www.sitemaps.org", "Standard sitemap XML namespace"],
  ["react.dev", "Framework production error-reference namespace"],
]);
const trackingDomains = new Set([
  "google-analytics.com",
  "googletagmanager.com",
  "segment.io",
  "hotjar.com",
  "mixpanel.com",
]);

const checks = [
  ["Windows absolute path", /[A-Za-z]:\\(?:Users|Windows|Program Files|[A-Za-z0-9_.-]+)\\/i],
  ["Unix local path", /\/(?:Users|home|var\/folders|private\/tmp)\/[A-Za-z0-9_.-]+\//i],
  ["Localhost reference", /\b(?:localhost|127\.0\.0\.1|0\.0\.0\.0|::1)(?::\d+)?\b/i],
  ["Private network address", /\b(?:10(?:\.\d{1,3}){3}|192\.168(?:\.\d{1,3}){2}|172\.(?:1[6-9]|2\d|3[01])(?:\.\d{1,3}){2})\b/],
  ["Private key block", /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/i],
  ["Credential assignment", /\b(?:api[_-]?key|secret|password|token)\s*[:=]\s*["'][^"']{8,}["']/i],
  ["Environment access", /\b(?:process\.env|import\.meta\.env|NEXT_PUBLIC_[A-Z0-9_]+|VITE_[A-Z0-9_]+)\b/],
  ["Cookie access", /\bdocument\.cookie\b/],
  ["Local storage access", /\blocalStorage\b/],
  ["Production console log", /\bconsole\.log\s*\(/],
  ["Source or stack trace", /(?:\bsrc\/[A-Za-z0-9_./-]+\.(?:tsx?|jsx?)\b|\bat\s+[A-Za-z0-9_$]+\s*\([^)]*:\d+:\d+\))/],
  ["Operational script reference", /\b[A-Za-z0-9_.-]+\.(?:ps1|bat|cmd)\b/i],
  ["Benchmark-like metric", /(?<![:.])\b\d+(?:\.\d+)?\s*(?:tokens?\/s|tok\/s|ms|GB\/s|TFLOPS|VRAM)\b/i],
  ["Hardware model", /\b(?:RTX|A100|H100|MI300|Xeon|EPYC)\s*[A-Za-z0-9-]*\b/i],
  ["Prohibited marketing claim", /\b(?:AGI|ASI|production-ready|world(?:'|’)?s first|world(?:'|’)?s most advanced|dünyanın ilk|dünyanın en gelişmiş|rakipsiz|kusursuz|hatasız|kırılamaz|sentient)\b/i],
  ["Internal release label", /\b(?:release|internal)[_-]?(?:candidate|rc)?[_-]?\d{1,4}\b/i],
  ["Long hash-like value", /\b[a-f0-9]{40,}\b/i],
];

function findTrackingDomain(hostname) {
  return [...trackingDomains].find((domain) => hostname === domain || hostname.endsWith(`.${domain}`));
}

async function collect(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const resolved = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collect(resolved));
    else if (textExtensions.has(path.extname(entry.name).toLowerCase()) || ["CNAME", "_headers"].includes(entry.name)) files.push(resolved);
  }
  return files;
}

const failures = [];
for (const file of await collect(root)) {
  const text = await readFile(file, "utf8");
  const relative = path.relative(root, file).replaceAll("\\", "/");
  for (const [label, pattern] of checks) {
    const match = text.match(pattern);
    if (match) failures.push(`${relative}: ${label}`);
  }
  for (const match of text.matchAll(/https?:\/\/[^/"'\s<]+(?:\/[^"'\s<]*)?/gi)) {
    const domain = new URL(match[0]).hostname.toLowerCase();
    const trackingDomain = findTrackingDomain(domain);
    if (trackingDomain) failures.push(`${relative}: Tracking domain ${trackingDomain}`);
    else if (!allowedDomains.has(domain)) failures.push(`${relative}: Unexpected external domain ${domain}`);
  }
}

if (failures.length) {
  console.error(`Public disclosure audit failed:\n${[...new Set(failures)].join("\n")}`);
  process.exitCode = 1;
} else {
  console.log(`Public disclosure audit passed. Allowlist entries: ${[...allowedDomains.entries()].map(([domain, reason]) => `${domain} (${reason})`).join(", ")}.`);
}
