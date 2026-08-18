import type { Metadata } from "next";
import Link from "next/link";
import { Assistant } from "../components/Assistant";
import { AnswerCard, VisitorTurn } from "../components/Knowledge";
import { Page, SectionIntro, StatusTag } from "../components/SiteShell";
import { DEFAULT_LOCALE, type Locale } from "../i18n/config";
import { getDict } from "../i18n/dictionary";
import { newConversation } from "./contracts";
import { mockAnswer, WORKED_EXAMPLES } from "./mock-ai";
import { buildSnapshot } from "./snapshot";

export const metadata: Metadata = {
  title: "Ask About the UAE Property Journey | REOS Assistant",
  description:
    "Ask how property is bought, developed, financed, built, registered, handed over and managed in the UAE. The assistant shows where you are in the journey, who is involved and where the answer came from.",
};

export function View({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const d = getDict(locale);
  const a = d.assistant;
  const snapshot = buildSnapshot(locale);
  const L = (path: string) => (locale === DEFAULT_LOCALE ? path : `/ar${path}`);

  /**
   * The worked examples are rendered on the server, from the same mock the
   * client uses. Three reasons, in order of importance:
   *   1. The page says something useful with JavaScript disabled.
   *   2. The mock, its citations and its concurrency handling become testable
   *      in the existing rendered-HTML harness — a client-only assistant would
   *      be untestable until a browser-driving test rig exists.
   *   3. It shows a visitor what the assistant does before they type anything.
   */
  const examples = WORKED_EXAMPLES[locale].map((question) => ({
    question,
    response: mockAnswer({ question, language: locale, state: newConversation(locale, "example") }, snapshot),
  }));

  return (
    <Page className="assistant-page" locale={locale} dock={false}>
      <section className="inner-hero">
        <span className="eyebrow">{a.eyebrow}</span>
        <h1>{a.title}<br /><em>{a.titleEm}</em></h1>
        <p>{a.lede}</p>
      </section>

      <section className="section-pad" aria-labelledby="ask-heading">
        {/* Named for assistive technology; the hero h1 above is the visual
            heading, so repeating it on screen would be noise. */}
        <h2 id="ask-heading" className="visually-hidden">{a.composerHeading}</h2>
        <Assistant snapshot={snapshot} locale={locale} variant="full" />
      </section>

      <section className="section-pad example-band">
        <SectionIntro
          label={a.exampleLabel}
          title={<>{a.exampleTitle}<br /><em>{a.exampleTitleEm}</em></>}
          copy={a.exampleCopy}
        />
        <p className="example-status">
          <StatusTag status="Illustrative" locale={locale} />
        </p>
        <div className="example-grid" aria-label={a.transcriptLabel}>
          {examples.map(({ question, response }) => (
            <div className="example-thread" key={question}>
              <VisitorTurn text={question} locale={locale} />
              <AnswerCard response={response} locale={locale} />
            </div>
          ))}
        </div>
      </section>

      <section className="section-pad">
        <p className="assistant-more">
          <Link className="button ghost" href={L("/journey")}>{d.nav.journey}</Link>{" "}
          <Link className="button ghost" href={L("/ecosystem")}>{d.nav.ecosystem}</Link>{" "}
          <Link className="button ghost" href={L("/glossary")}>{d.nav.glossary}</Link>
        </p>
        <p className="fineprint">{d.footer.fineprint}</p>
      </section>
    </Page>
  );
}

export default function AssistantPage() {
  return <View locale={DEFAULT_LOCALE} />;
}
