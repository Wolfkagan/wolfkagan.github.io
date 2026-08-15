import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const locales = ["tr", "en", "de"];
const approvedBrandCopy = {
  tr: {
    slogan: "İnsanlığın kökü, bilgisayarın zihni.",
    secondaryTagline: "Topraktan gelen zekâ, geleceği kuran sistem.",
    valueLine: "Daima daha iyisi için. Daima insanlık için.",
    statusTitle: "Araştırma ve mühendislik devam ediyor",
  },
  en: {
    slogan: "Humanity’s roots. The mind of the machine.",
    secondaryTagline: "Intelligence with deep roots. A system built for the future.",
    valueLine: "Always for better. Always for humanity.",
    statusTitle: "Research and engineering in progress",
  },
  de: {
    slogan: "Die Wurzeln der Menschheit. Der Geist der Maschine.",
    secondaryTagline: "Intelligenz mit tiefen Wurzeln. Ein System für die Zukunft.",
    valueLine: "Immer für das Bessere. Immer für die Menschheit.",
    statusTitle: "Forschung und Entwicklung laufen",
  },
};

function shape(value, prefix = "root", output = []) {
  if (Array.isArray(value)) {
    output.push(`${prefix}[]:${value.length}`);
    value.forEach((item, index) => shape(item, `${prefix}[${index}]`, output));
  } else if (value && typeof value === "object") {
    for (const key of Object.keys(value).sort()) shape(value[key], `${prefix}.${key}`, output);
  } else {
    output.push(`${prefix}:${typeof value}`);
  }
  return output;
}

function assertNoEmptyStrings(value, prefix = "root") {
  if (Array.isArray(value)) value.forEach((item, index) => assertNoEmptyStrings(item, `${prefix}[${index}]`));
  else if (value && typeof value === "object") {
    for (const [key, item] of Object.entries(value)) assertNoEmptyStrings(item, `${prefix}.${key}`);
  } else if (typeof value === "string" && !value.trim()) throw new Error(`${prefix}: empty translation value`);
}

const dictionaries = {};
for (const locale of locales) {
  const file = path.join(root, "src", "content", `${locale}.json`);
  dictionaries[locale] = JSON.parse(await readFile(file, "utf8"));
  if (dictionaries[locale].locale !== locale) throw new Error(`${locale}: locale field mismatch`);
  assertNoEmptyStrings(dictionaries[locale]);
}

const reference = shape(dictionaries.tr).join("\n");
for (const locale of locales.slice(1)) {
  const current = shape(dictionaries[locale]).join("\n");
  if (current !== reference) throw new Error(`${locale}: translation structure differs from tr`);
}

const forbiddenBrandForms = ["Otuken AI", "Otüken Ai", "OTUKENAI", "OtukenAI", "ÖtükenAI"];
for (const locale of locales) {
  const dictionary = dictionaries[locale];
  const serialized = JSON.stringify(dictionaries[locale]);
  const match = forbiddenBrandForms.find((variant) => serialized.includes(variant));
  if (match) throw new Error(`${locale}: forbidden brand form detected: ${match}`);
  if (dictionary.brand.name !== "ÖTÜKEN AI") throw new Error(`${locale}: brand name mismatch`);
  for (const [key, expected] of Object.entries(approvedBrandCopy[locale])) {
    const actual = key === "statusTitle" ? dictionary.shared.status.title : dictionary.brand[key];
    if (actual !== expected) throw new Error(`${locale}: approved copy mismatch at ${key}`);
  }
  if (dictionary.home.hero.title !== approvedBrandCopy[locale].slogan) throw new Error(`${locale}: hero slogan mismatch`);
  if (dictionary.shared.approach.items.length !== 5) throw new Error(`${locale}: expected five approach cards`);
  if (dictionary.shared.system.items.length !== 5) throw new Error(`${locale}: expected five public system layers`);
  if (dictionary.shared.principleSet.items.length !== 4) throw new Error(`${locale}: expected four source principles`);
  if (dictionary.shared.trustSet.items.length !== 4) throw new Error(`${locale}: expected four trust pillars`);
}

console.log("Translation parity audit passed for tr, en and de.");
