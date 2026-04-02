import fs from "node:fs";
import path from "node:path";
import { parse } from "node-html-parser";

export const BLOG_LANGS = ["en", "fr", "de", "nl", "it", "es", "pt"] as const;
export type BlogLang = (typeof BLOG_LANGS)[number];

export type NotionBlogItem = {
  title: string;
  url: string;
  summary?: string;
  markdown?: string;
  images?: string[];
};

export type NotionBlog = {
  collectionTitle?: string;
  items: NotionBlogItem[];
};

export type BlogTranslationEntry = {
  title?: string;
  description?: string;
  markdown?: string;
  html?: string;
};

export type BlogTranslations = Record<string, BlogTranslationEntry>;

type BlogImageManifest = {
  generatedAt?: string;
  byUrl?: Record<string, string>;
  bySlug?: Record<string, string[]>;
};

let _imageManifest: BlogImageManifest | null | undefined;
function loadBlogImageManifest(): BlogImageManifest {
  if (_imageManifest !== undefined) return _imageManifest || {};
  const p = path.join(process.cwd(), "public", "blog-assets", "manifest.json");
  if (!fs.existsSync(p)) {
    _imageManifest = null;
    return {};
  }
  try {
    const raw = fs.readFileSync(p, "utf8");
    const json = JSON.parse(raw) as BlogImageManifest;
    _imageManifest = json && typeof json === "object" ? json : null;
    return _imageManifest || {};
  } catch {
    _imageManifest = null;
    return {};
  }
}

export function slugify(s: string) {
  return String(s)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const TAG_WORDS = new Set(
  [
    // Notion-ish tags in all supported languages
    "guide",
    "guides",
    "inspiration",
    "video",
    "vide",
    "leitfaden",
    "anleitung",
    "guía",
    "guia",
    "artikel",
    "articoli",
    "artículos",
    "artigos",
  ].map((s) => s.toLowerCase()),
);

const MONTH_WORDS = [
  // en
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
  // fr
  "janvier",
  "février",
  "fevrier",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "aout",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
  "decembre",
  // de
  "januar",
  "februar",
  "märz",
  "maerz",
  "april",
  "mai",
  "juni",
  "juli",
  "august",
  "september",
  "oktober",
  "november",
  "dezember",
  // nl
  "januari",
  "februari",
  "maart",
  "april",
  "mei",
  "juni",
  "juli",
  "augustus",
  "september",
  "oktober",
  "november",
  "december",
  // it
  "gennaio",
  "febbraio",
  "marzo",
  "aprile",
  "maggio",
  "giugno",
  "luglio",
  "agosto",
  "settembre",
  "ottobre",
  "novembre",
  "dicembre",
  // es
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
  // pt
  "janeiro",
  "fevereiro",
  "março",
  "marco",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

const monthRe = new RegExp(`\\b(${MONTH_WORDS.join("|")})\\b`, "i");

function isNotionMetaValueLine(line: string) {
  const t = line.trim().replace(/\s+/g, " ");
  if (!t) return false;
  const lower = t.toLowerCase();
  if (TAG_WORDS.has(lower)) return true;
  // Date-ish lines: contains a year and a month word
  if (/\b\d{4}\b/.test(t) && monthRe.test(t)) return true;
  // Time-with-date patterns
  if (/\b\d{1,2}:\d{2}\b/.test(t) && (/\b\d{4}\b/.test(t) || monthRe.test(t))) return true;
  return false;
}

export function cleanNotionMarkdown(md: string | undefined, title?: string) {
  const lines = String(md || "").split(/\r?\n/);
  if (lines[0]?.startsWith("# ")) lines.shift();
  const out: string[] = [];
  for (const l of lines) {
    const t = l.trim();
    if (!t) {
      out.push("");
      continue;
    }
    if (/^Notion utilise des cookies\./i.test(t)) break;
    if (t === "Blog" || t === "Essayer gratuitement" || t === "Modifier les filtres") continue;
    if (t === "Tout accepter" || t === "Tout refuser") continue;
    if (t === "Read more:" || t === "Read More:" || t === "Related Articles" || t === "Similar Articles")
      continue;
    if (t === "Created" || t === "Tags") continue;
    if (title && t === title) continue;
    if (isNotionMetaValueLine(t)) continue;
    if (/^[^\p{L}\p{N}]+$/u.test(t) && t.length <= 4) continue; // emoji-only / decorative
    out.push(l);
  }
  return out.join("\n").trim();
}

export function pickDescription(md: string | undefined) {
  const cleaned = cleanNotionMarkdown(md);
  const first = stripLeadingMetaLines(cleaned.split(/\n+/))
    .map((s) => s.trim())
    .find((s) => s && !/^Purpose:?$/i.test(s) && !/^Context:?$/i.test(s));
  const raw = (first || "").replace(/\s+/g, " ").trim();
  if (!raw) return "Article copié depuis Notion.";
  if (raw.length <= 160) return raw;
  const cut = raw.slice(0, 160);
  return cut.slice(0, cut.lastIndexOf(" ")).trim() || cut;
}

export function loadNotionBlog(): NotionBlog {
  const p = path.join(process.cwd(), "notion_output.json");
  const raw = fs.readFileSync(p, "utf8");
  return JSON.parse(raw) as NotionBlog;
}

export function loadBlogTranslations(lang: BlogLang): BlogTranslations {
  if (lang === "en") return {};
  const p = path.join(process.cwd(), "public", "blog-i18n", `${lang}.json`);
  if (!fs.existsSync(p)) return {};
  try {
    const raw = fs.readFileSync(p, "utf8");
    const json = JSON.parse(raw) as BlogTranslations;
    return json && typeof json === "object" ? json : {};
  } catch {
    return {};
  }
}

export type BlogPost = {
  lang: BlogLang;
  slug: string;
  title: string;
  description: string;
  markdown: string;
  html?: string;
  cleanHtml?: string;
  heroImage?: string;
  images: string[];
  sourceUrl: string;
  sourceLang: BlogLang;
  hasTranslation: boolean;
};

export function injectImagesIntoHtml(
  html: string,
  images: string[],
  opts?: { alt?: string },
): { html: string; used: string[]; unused: string[] } {
  const base = String(html || "");
  const pool = (Array.isArray(images) ? images : []).filter((s) => typeof s === "string" && s.startsWith("/"));
  if (!base || !pool.length) return { html: base, used: [], unused: pool };

  // Skip images already referenced in the body (e.g. via markdown ![alt](src))
  const alreadyInBody = pool.filter((src) => base.includes(src));
  const toInject = pool.filter((src) => !base.includes(src));
  if (!toInject.length) return { html: base, used: alreadyInBody, unused: [] };

  const doc = parse(base);
  const remaining = [...toInject];
  const used: string[] = [...alreadyInBody];

  const figureFor = (src: string) => {
    const alt = opts?.alt ? String(opts.alt) : "";
    return `<figure class="my-6"><img src="${src}" alt="${alt}" loading="lazy" decoding="async" class="w-full rounded-2xl border border-gray-200 bg-white object-cover" /></figure>`;
  };

  // Prefer section-based placement (Notion-like): after the first meaningful block
  // following each H2/H3, rather than right after the heading.
  const headings = doc.querySelectorAll("h2, h3") as any[];
  if (headings?.length) {
    for (const h of headings) {
      if (!remaining.length) break;

      // Find the first block element after heading.
      let target = h?.nextElementSibling as any;
      while (target && target.tagName && ["DIV"].includes(String(target.tagName).toUpperCase())) {
        // Skip wrapper divs that often appear around content.
        const firstChildEl = (target.childNodes || []).find((n: any) => n?.tagName) as any;
        if (firstChildEl) target = firstChildEl;
        else break;
      }

      const src = remaining.shift() as string;
      const fig = figureFor(src);
      if (target && typeof target.insertAdjacentHTML === "function") target.insertAdjacentHTML("afterend", fig);
      else if (h && typeof h.insertAdjacentHTML === "function") h.insertAdjacentHTML("afterend", fig);
      used.push(src);
    }

    return { html: doc.toString(), used, unused: remaining };
  }

  // Fallback: ordered list steps (rare in our Notion exports).
  const firstOl = doc.querySelector("ol") as any;
  if (firstOl) {
    const lis = (firstOl.childNodes || []).filter((n: any) => n?.tagName === "LI") as any[];
    for (const li of lis) {
      if (!remaining.length) break;
      const src = remaining.shift() as string;
      li.appendChild(parse(figureFor(src)));
      used.push(src);
    }
  }

  return { html: doc.toString(), used, unused: remaining };
}

function isMetaLine(line: string) {
  const t = line.trim().replace(/\s+/g, " ");
  if (!t) return true;
  const lower = t.toLowerCase();
  if (TAG_WORDS.has(lower)) return true;
  // Date-ish lines: contains a year and a month word (or "de <month> de" patterns)
  if (/\b\d{4}\b/.test(t) && monthRe.test(t)) return true;
  // Time-only / time-with-date
  if (/\b\d{1,2}:\d{2}\b/.test(t) && (/\b\d{4}\b/.test(t) || monthRe.test(t))) return true;
  // Very short single label lines (often Notion metadata)
  if (t.length <= 14 && /^[\p{L}\p{N}]+$/u.test(t)) return true;
  return false;
}

function stripLeadingMetaLines(lines: string[]) {
  const out = [...lines];
  while (out.length && isMetaLine(out[0] || "")) out.shift();
  return out;
}

function stripLeadingMetaFromHtml(html: string | undefined) {
  const s = String(html || "");
  const open = s.indexOf("<p>");
  const close = s.indexOf("</p>");
  if (open !== 0 || close === -1) return s;
  const inner = s.slice(3, close);
  const lines = inner.split(/\r?\n/);
  const stripped = stripLeadingMetaLines(lines).join("\n").trim();
  const rest = s.slice(close + 4);
  if (!stripped) return rest.trimStart();
  return `<p>${stripped}</p>${rest}`;
}

function pickDescriptionFromHtml(html: string | undefined) {
  const withoutMeta = stripLeadingMetaFromHtml(html);
  const raw = String(withoutMeta || "")
    .replace(/<\/p>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!raw) return "";
  if (raw.length <= 160) return raw;
  const cut = raw.slice(0, 160);
  return cut.slice(0, cut.lastIndexOf(" ")).trim() || cut;
}

export function getBlogPostsForLang(lang: BlogLang) {
  const notion = loadNotionBlog();
  const t = loadBlogTranslations(lang);
  const manifest = loadBlogImageManifest();

  const items = (notion.items || []).map((it) => {
    const slug = slugify(it.title);
    const sourceMd = cleanNotionMarkdown(it.markdown, it.title);
    const entry = t[slug] || {};
    // For SEO safety, we only consider a post translated if it has translated HTML.
    // (Legacy `markdown` entries may exist but can still be English.)
    const hasTranslation = lang === "en" ? true : Boolean(entry.html);
    const md = entry.markdown ? String(entry.markdown) : sourceMd;
    const html = entry.html ? String(entry.html) : undefined;
    const cleanHtml = html ? stripLeadingMetaFromHtml(html) : undefined;
    const title = entry.title ? String(entry.title) : it.title;
    const description =
      entry.description
        ? String(entry.description)
        : cleanHtml
          ? pickDescriptionFromHtml(cleanHtml)
          : html
            ? pickDescriptionFromHtml(html)
            : pickDescription(md);
    const imagesRemote = Array.isArray(it.images)
      ? it.images.filter((s) => typeof s === "string" && s.startsWith("http"))
      : [];
    const imagesLocalFromSlug =
      slug && Array.isArray(manifest?.bySlug?.[slug]) ? (manifest.bySlug?.[slug] as string[]) : null;
    const byUrl = manifest?.byUrl || {};
    const images =
      imagesLocalFromSlug && imagesLocalFromSlug.length
        ? imagesLocalFromSlug
        : imagesRemote.map((u) => byUrl[u] || u).filter((s) => typeof s === "string");
    const heroImage = images[0] || undefined;
    return {
      lang,
      slug,
      title,
      description,
      markdown: md,
      html,
      cleanHtml,
      heroImage,
      images,
      sourceUrl: it.url,
      sourceLang: entry.html ? lang : "en",
      hasTranslation,
    } satisfies BlogPost;
  });

  return { collectionTitle: notion.collectionTitle || "Blog", items };
}

export function getBlogPost(lang: BlogLang, slug: string): BlogPost | null {
  const { items } = getBlogPostsForLang(lang);
  return items.find((it) => it.slug === slug) || null;
}

export function blogUiCopy(lang: BlogLang) {
  return (
    {
      en: {
        blog: "Blog",
        articles: "Articles",
        welcome: "Welcome to the Enrich‑CRM blog.",
        images: "Images",
        readArticle: "Read article →",
        count: (n: number) => `${n} articles`,
        source: "Source",
      },
      fr: {
        blog: "Blog",
        articles: "Articles",
        welcome: "Bienvenue sur le blog d’Enrich‑CRM.",
        images: "Images",
        readArticle: "Lire l’article →",
        count: (n: number) => `${n} articles`,
        source: "Source",
      },
      de: {
        blog: "Blog",
        articles: "Artikel",
        welcome: "Willkommen im Enrich‑CRM Blog.",
        images: "Bilder",
        readArticle: "Artikel lesen →",
        count: (n: number) => `${n} Artikel`,
        source: "Quelle",
      },
      nl: {
        blog: "Blog",
        articles: "Artikelen",
        welcome: "Welkom op de Enrich‑CRM blog.",
        images: "Afbeeldingen",
        readArticle: "Lees artikel →",
        count: (n: number) => `${n} artikelen`,
        source: "Bron",
      },
      it: {
        blog: "Blog",
        articles: "Articoli",
        welcome: "Benvenuto sul blog di Enrich‑CRM.",
        images: "Immagini",
        readArticle: "Leggi l’articolo →",
        count: (n: number) => `${n} articoli`,
        source: "Fonte",
      },
      es: {
        blog: "Blog",
        articles: "Artículos",
        welcome: "Bienvenido al blog de Enrich‑CRM.",
        images: "Imágenes",
        readArticle: "Leer el artículo →",
        count: (n: number) => `${n} artículos`,
        source: "Fuente",
      },
      pt: {
        blog: "Blog",
        articles: "Artigos",
        welcome: "Bem‑vindo ao blog da Enrich‑CRM.",
        images: "Imagens",
        readArticle: "Ler o artigo →",
        count: (n: number) => `${n} artigos`,
        source: "Fonte",
      },
    } as const
  )[lang];
}

export function blogUrlFor(lang: BlogLang, slug?: string) {
  const base = `https://enrich-crm.com/${lang}/blog`;
  return slug ? `${base}/${slug}` : base;
}

export function normalizeBlogMarkdownForHtml(md: string) {
  let s = String(md || "");

  // Fix common CMS artifacts that create ugly spacing.
  // 1) Remove empty headings like "## " (renders big blank blocks).
  s = s.replace(/^\s{0,3}#{1,6}\s*$/gm, "");

  // 2) Convert patterns like:
  //    "##\nPurpose:" -> "## Purpose"
  // (Seen when content is pasted/converted from other editors.)
  s = s.replace(/^##\s*\n([^\n:]{1,60}):\s*$/gm, "## $1");

  // 3) Collapse excessive blank lines.
  s = s.replace(/\n{3,}/g, "\n\n");

  // 4) Avoid giant gaps right after headings.
  s = s.replace(/^(#{1,6} .*)\n{2,}/gm, "$1\n\n");

  return s.trim() + "\n";
}

