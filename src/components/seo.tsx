import { Meta as OnceMeta } from "@once-ui-system/core";
import type { Metadata } from "next";
import { about, baseURL, person, social } from "@/resources";

/*
 * Drop-in replacements for Once UI's `Meta` and `Schema`.
 *
 * Why they exist:
 * - Once UI's Meta only emits <link rel="canonical"> when language alternates are
 *   passed, so no page had a canonical URL. This wrapper always adds one.
 * - Once UI's Schema injects JSON-LD through next/script, which lands in the page
 *   only after hydration. Crawlers that don't run JavaScript (GPTBot, ClaudeBot,
 *   PerplexityBot…) never saw it. This one renders a plain <script> into the HTML,
 *   and links every page to a single Person entity so search and AI engines can
 *   tie the whole site to one identity.
 */

// Where you are, for the Person entity. person.location holds an IANA time zone
// (it drives the header clock), so the human-readable place lives here.
export const place = {
  city: "Pune",
  region: "Maharashtra",
  country: "IN",
  label: "Pune, India",
};

// Topics you want search and AI engines to associate with you.
export const knowsAbout = [
  "Data Engineering",
  "Data Science",
  "Machine Learning",
  "Retrieval-Augmented Generation",
  "Generative AI",
  "AI Agents",
  "Natural Language Processing",
  "Computer Vision",
  "Python",
  "SQL",
  "AWS",
  "Snowflake",
];

const base = baseURL.replace(/\/$/, "");
const personId = `${base}/#person`;
const websiteId = `${base}/#website`;

const absolute = (src: string) =>
  src.startsWith("http") ? src : `${base}${src.startsWith("/") ? src : `/${src}`}`;

const profileLinks = social
  .map((item) => item.link)
  .filter((link): link is string => Boolean(link) && link.startsWith("http"));

type MetaArgs = Parameters<typeof OnceMeta.generate>[0];

export const Meta = {
  generate(args: MetaArgs): Metadata {
    const metadata = OnceMeta.generate(args) as Metadata;
    const path = args.path ? (args.path.startsWith("/") ? args.path : `/${args.path}`) : "/";
    return {
      ...metadata,
      alternates: {
        ...metadata.alternates,
        canonical: args.canonical || `${base}${path === "/" ? "" : path}`,
      },
    };
  },
};

export function personSchema() {
  const currentRole = about.work.experiences[0];
  return {
    "@type": "Person",
    "@id": personId,
    name: person.name,
    alternateName: `${person.firstName} ${person.lastName}`,
    givenName: person.firstName,
    familyName: person.lastName,
    url: base,
    image: absolute(person.avatar),
    jobTitle: person.role,
    ...(currentRole && {
      worksFor: { "@type": "Organization", name: currentRole.company },
    }),
    address: {
      "@type": "PostalAddress",
      addressLocality: place.city,
      addressRegion: place.region,
      addressCountry: place.country,
    },
    alumniOf: about.studies.institutions.slice(0, 2).map((institution) => ({
      "@type": "CollegeOrUniversity",
      name: institution.name,
    })),
    knowsAbout,
    knowsLanguage: person.languages,
    sameAs: profileLinks,
  };
}

function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": websiteId,
    url: base,
    name: person.name,
    description: `Portfolio and blog of ${person.name}, ${person.role} in ${place.label}.`,
    inLanguage: person.locale ?? "en",
    publisher: { "@id": personId },
  };
}

const typeMap = {
  website: "WebSite",
  webPage: "WebPage",
  profilePage: "ProfilePage",
  collectionPage: "CollectionPage",
  blog: "Blog",
  blogPosting: "BlogPosting",
  article: "Article",
  techArticle: "TechArticle",
  organization: "Organization",
} as const;

export interface SchemaProps {
  as: keyof typeof typeMap;
  title: string;
  description: string;
  baseURL?: string;
  path: string;
  datePublished?: string;
  dateModified?: string;
  image?: string;
  sameAs?: string[];
  // Kept for call-site compatibility with Once UI's Schema; every page is
  // attributed to the single site-wide Person instead.
  author?: { name: string; url?: string; image?: string };
}

export function Schema({
  as,
  title,
  description,
  path,
  datePublished,
  dateModified,
  image,
}: SchemaProps) {
  const url = `${base}${path === "/" ? "" : path.startsWith("/") ? path : `/${path}`}`;
  const isArticle = as === "blogPosting" || as === "article" || as === "techArticle";

  const page: Record<string, unknown> = {
    "@type": typeMap[as],
    "@id": `${url}#${isArticle ? "article" : "webpage"}`,
    url,
    name: title,
    description,
    inLanguage: person.locale ?? "en",
    isPartOf: { "@id": websiteId },
    ...(image && { image: absolute(image) }),
  };

  if (isArticle) {
    page.headline = title;
    page.mainEntityOfPage = url;
    page.author = { "@id": personId };
    page.publisher = { "@id": personId };
    if (datePublished) {
      page.datePublished = datePublished;
      page.dateModified = dateModified || datePublished;
    }
  } else if (as === "profilePage") {
    page.mainEntity = { "@id": personId };
  } else {
    page.about = { "@id": personId };
  }

  const graph = {
    "@context": "https://schema.org",
    "@graph": [page, personSchema(), websiteSchema()],
  };

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: static, build-time JSON
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }}
    />
  );
}
