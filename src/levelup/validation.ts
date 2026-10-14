import {WORLDS} from './catalog';
/** Simple deterministic structural checks; run without a model or network. */
export function validateCatalog(){
 const seen=new Set<string>();
 for(const w of WORLDS){
  if(seen.has(w.id)) throw new Error(`Duplicate world: ${w.id}`);
  seen.add(w.id);
  if(w.missions.length<3)throw new Error(`Too few missions: ${w.id}`);
  const ids=new Set<string>();
  for(const m of w.missions){
   if(ids.has(m.id))throw new Error(`Duplicate mission: ${w.id}/${m.id}`);
   ids.add(m.id);
   if(m.choices.length<2)throw new Error(`No meaningful decision: ${m.id}`);
   if(!m.parentPrompt||!m.reflect)throw new Error(`Missing follow-up: ${m.id}`);
   if(new Set(m.choices.map(c=>c.id)).size!==m.choices.length)throw new Error(`Duplicate option: ${m.id}`);
  }
 }
 return {worlds:WORLDS.length,missions:WORLDS.reduce((a,w)=>a+w.missions.length,0),choices:WORLDS.reduce((a,w)=>a+w.missions.reduce((b,m)=>b+m.choices.length,0),0)};
}
