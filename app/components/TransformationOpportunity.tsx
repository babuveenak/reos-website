import {
  currentStateItems,
  operatingPressures,
  reosStateItems,
  transformationStages,
  transformationStakeholders,
} from "../data/transformation";
import { DEFAULT_LOCALE, localePath, type Locale } from "../i18n/config";
import { ExecutiveSelfAssessment } from "./ExecutiveSelfAssessment";
import { StakeholderValueAccordion } from "./StakeholderValueAccordion";

export function TransformationOpportunity({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  return (
    <section className="section-pad transformation-opportunity" id="transformation-opportunity">
      <div className="transformation-intro">
        <div>
          <span className="eyebrow">TRANSFORMATION OPPORTUNITY</span>
          <h2>The problem isn&apos;t one approval.<br /><em>It&apos;s the operating model around it.</em></h2>
        </div>
        <div>
          <p>Property work crosses organizations, systems, documents and decision boundaries. When every participant manages only their part, the lifecycle becomes difficult to see and harder to operate.</p>
          <p>Disconnected tools do not merely slow a task. They create uncertainty about readiness, ownership, evidence and the next accountable action. REOS exists to connect that operating model around the systems and authorities already in place.</p>
        </div>
      </div>

      <ExecutiveSelfAssessment evaluationHref={localePath(locale, "/demo")} />

      <div className="transformation-comparison" aria-label="Current state compared with the REOS operating model">
        <article className="is-today">
          <header><span>01</span><div><small>CURRENT STATE</small><h3>Before REOS · Today</h3></div></header>
          <ol>{currentStateItems.map(([title, copy], index) => <li key={title}><i>{String(index + 1).padStart(2, "0")}</i><span><b>{title}</b><small>{copy}</small></span></li>)}</ol>
        </article>
        <div className="transformation-bridge" aria-hidden="true"><span>REOS</span><i>→</i><small>CONNECTIVE OPERATING LAYER</small></div>
        <article className="is-reos">
          <header><span>02</span><div><small>TARGET OPERATING MODEL</small><h3>With REOS</h3></div></header>
          <ol>{reosStateItems.map(([title, copy], index) => <li key={title}><i>{String(index + 1).padStart(2, "0")}</i><span><b>{title}</b><small>{copy}</small></span></li>)}</ol>
        </article>
      </div>

      <div className="transformation-breakdown">
        <div>
          <span className="eyebrow">WHY TRADITIONAL APPROACHES BREAK DOWN</span>
          <h2>Digital systems grew.<br /><em>The operating model stayed disconnected.</em></h2>
          <p>Property complexity now spans more participants, dependencies and evidence than any isolated workflow can explain. Individual systems may perform their own function well, while the work between them remains dependent on manual interpretation and follow-up.</p>
        </div>
        <ol>{operatingPressures.map((pressure, index) => <li key={pressure}><span>{String(index + 1).padStart(2, "0")}</span><b>{pressure}</b></li>)}</ol>
        <aside><small>THE REOS ROLE</small><strong>The connective operating layer.</strong><p>REOS links the lifecycle context, case state, evidence, responsibilities and handoffs around existing systems. It coordinates the work without claiming authority that remains with people, organizations and official systems.</p></aside>
      </div>

      <div className="transformation-stakeholders">
        <div className="transformation-section-heading">
          <span className="eyebrow">STAKEHOLDER VALUE EXPANSION</span>
          <h2>One operating model.<br /><em>Different value for every participant.</em></h2>
          <p>These executive operating lenses explain value in practical language; they do not alter the approved twelve-group stakeholder architecture.</p>
        </div>
        <StakeholderValueAccordion stakeholders={transformationStakeholders} />
      </div>

      <div className="transformation-timeline">
        <div className="transformation-section-heading">
          <span className="eyebrow">TRANSFORMATION TIMELINE</span>
          <h2>Adopt the operating model<br /><em>in controlled stages.</em></h2>
          <p>The adoption path uses the existing REOS operating model: understand the context, map the work, prepare the case, operate through controlled execution, and govern the outcome.</p>
        </div>
        <ol>{transformationStages.map(([number, title, copy]) => <li key={title}><span>{number}</span><small>STAGE {number}</small><h3>{title}</h3><p>{copy}</p></li>)}</ol>
      </div>
    </section>
  );
}
