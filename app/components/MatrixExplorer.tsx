"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Gateway, MatrixCell, StakeholderGroup } from "../data/gateways";

export function MatrixExplorer({gateways,groups,cells,initialGateway="all"}:{gateways:Gateway[];groups:StakeholderGroup[];cells:MatrixCell[];initialGateway?:string}) {
  const [gateFilter,setGateFilter]=useState(gateways.some((gateway)=>gateway.id===initialGateway)?initialGateway:"all");
  const [groupFilter,setGroupFilter]=useState("all");
  const [selected,setSelected]=useState(cells[0].id);
  const visible=useMemo(()=>cells.filter((cell)=>(gateFilter==="all"||cell.gatewayId===gateFilter)&&(groupFilter==="all"||cell.groupId===groupFilter)),[cells,gateFilter,groupFilter]);
  const active=visible.find((cell)=>cell.id===selected)??visible[0];
  const gateway=active?gateways.find((item)=>item.id===active.gatewayId):undefined;
  const group=active?groups.find((item)=>item.id===active.groupId):undefined;
  return <div className="matrix-explorer">
    <div className="matrix-filters" aria-label="Matrix filters"><label>Lifecycle stage<select value={gateFilter} onChange={(event)=>setGateFilter(event.target.value)}><option value="all">All seven stages</option>{gateways.map((item,index)=><option value={item.id} key={item.id}>Stage {index+1} · {item.name}</option>)}</select></label><label>Stakeholder group<select value={groupFilter} onChange={(event)=>setGroupFilter(event.target.value)}><option value="all">All twelve</option>{groups.map((item)=><option value={item.id} key={item.id}>{item.displayId} · {item.name}</option>)}</select></label><span aria-live="polite">{visible.length} of 84 cells</span></div>
    <div className="matrix-layout">
      <div className="matrix-scroll" role="region" aria-label="Lifecycle stage by stakeholder group matrix">
        <table><caption className="visually-hidden">All mandatory lifecycle-stage and stakeholder-group connections</caption><thead><tr><th scope="col">Stakeholder</th>{gateways.filter((item)=>gateFilter==="all"||item.id===gateFilter).map((item,index)=><th scope="col" key={item.id}><span>Stage {gateFilter==="all"?index+1:gateways.findIndex((gateway)=>gateway.id===item.id)+1}</span>{item.name}</th>)}</tr></thead><tbody>{groups.filter((item)=>groupFilter==="all"||item.id===groupFilter).map((item)=><tr key={item.id}><th scope="row"><span>{item.displayId}</span>{item.name}</th>{gateways.filter((gate)=>gateFilter==="all"||gate.id===gateFilter).map((gate)=>{const cell=cells.find((candidate)=>candidate.gatewayId===gate.id&&candidate.groupId===item.id)!;const isActive=active?.id===cell.id;return <td key={cell.id}><button type="button" className={isActive?"is-selected":""} onClick={()=>setSelected(cell.id)} aria-pressed={isActive}><i aria-hidden="true" />{cell.outcome}<small>{cell.stepIds.join(", ")}</small></button></td>})}</tr>)}</tbody></table>
      </div>
      {active&&gateway&&group&&<aside className="matrix-detail" aria-live="polite"><span className="gateway-kicker">CONTROLLED CELL · {gateway.id} × {group.displayId}</span><h2>{gateway.name} × {group.name}</h2><p>{active.outcome}</p><dl><div><dt>Participating stakeholder</dt><dd>{active.responsibleRole}</dd></div><div><dt>Accountable party</dt><dd>{active.accountableRole}</dd></div><div><dt>Input</dt><dd>{active.inputIds.join(", ")}</dd></div><div><dt>Output</dt><dd>{active.outputIds.join(", ")}</dd></div><div><dt>Evidence</dt><dd>{active.evidenceIds.join(", ")}</dd></div><div><dt>Confirmation</dt><dd><span className="matrix-state"><i />{active.confirmationState}</span></dd></div></dl><div className="matrix-detail-actions"><Link href={`/steps/${active.stepIds[0]}`}>Open controlled step →</Link><Link href={`/groups/${group.displayId}`}>Open stakeholder group</Link></div></aside>}
    </div>
  </div>;
}
