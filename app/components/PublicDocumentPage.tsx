import Link from "next/link";
import { CONTACT_EMAIL } from "../data/site";
import { getPublicDocument, type PublicDocumentKey } from "../data/publicDocuments";
import { DEFAULT_LOCALE, localePath, type Locale } from "../i18n/config";
import { Page } from "./SiteShell";

export function PublicDocumentPage({
  document,
  locale = DEFAULT_LOCALE,
}: {
  document: PublicDocumentKey;
  locale?: Locale;
}) {
  const content = getPublicDocument(locale, document);
  const homeHref = localePath(locale, "/");

  return (
    <Page className="inner-page public-document-page" locale={locale}>
      <header className="public-document-hero">
        <div>
          <span className="eyebrow">{content.eyebrow}</span>
          <h1>{content.title}</h1>
          <p>{content.description}</p>
          <Link className="text-link" href={homeHref}>{content.backLabel} <span aria-hidden="true">↗</span></Link>
        </div>
        <dl>
          <div><dt>{content.updatedLabel}</dt><dd>{content.updated}</dd></div>
          <div><dt>{locale === "ar" ? "الجهة المشغّلة" : "Website operator"}</dt><dd>RESO</dd></div>
        </dl>
      </header>

      <div className="public-document-layout">
        <nav className="public-document-toc" aria-label={content.contentsLabel}>
          <h2>{content.contentsLabel}</h2>
          <ol>
            {content.sections.map((section) => <li key={section.id}><a href={`#${section.id}`}>{section.title}</a></li>)}
          </ol>
        </nav>

        <article className="public-document-content">
          {content.sections.map((section) => (
            <section id={section.id} key={section.id}>
              <h2>{section.title}</h2>
              {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {section.bullets ? <ul>{section.bullets.map((item) => <li key={item}>{item}</li>)}</ul> : null}
              {section.source ? <a className="public-document-source" href={section.source.href} target="_blank" rel="noreferrer">{section.source.label} <span aria-hidden="true">↗</span></a> : null}
              {section.id === "changes-contact" || section.id === "law-changes-contact" ? (
                <a className="public-document-contact" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              ) : null}
            </section>
          ))}
        </article>
      </div>
    </Page>
  );
}
