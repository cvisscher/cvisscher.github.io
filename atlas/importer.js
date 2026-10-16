/* Local table normalization. No network or file writes. */
(function(root){
'use strict';
const C={earth_mass_kg:5.97217e24,earth_radius_km:6371.0084,jupiter_mass_kg:1.89813e27,jupiter_radius_km:71492,solar_mass_kg:1.98847e30,solar_radius_km:695700};
const clean=v=>String(v??'').normalize('NFKC').replace(/[−–]/g,'-').trim();
const key=v=>clean(v).toLowerCase().replace(/\s+/g,'');
const head=v=>clean(v).toLowerCase().replace(/\s+/g,'');
function number(v){if(typeof v==='number')return Number.isFinite(v)?v:null;const s=clean(v);return /^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(s)?Number(s):null}
function measurement(v){const s=clean(v);if(s.includes('±')){const parts=s.split('±');if(parts.length!==2)return null;const value=number(parts[0]),e=number(parts[1]);return value!==null&&e!==null&&e>=0?{value,error:[e,e]}:null}const n=number(v);return n===null?null:{value:n,error:null}}
function factor(unit,kind){const u=clean(unit).toLowerCase();if(['earth','me','re','mearth','rearth','m⊕','r⊕'].includes(u))return 1;if(['jupiter','mj','rj','mjup','rjup'].includes(u))return kind==='mass'?C.jupiter_mass_kg/C.earth_mass_kg:C.jupiter_radius_km/C.earth_radius_km;if(['sun','solar','msun','rsun'].includes(u))return kind==='mass'?C.solar_mass_kg/C.earth_mass_kg:C.solar_radius_km/C.earth_radius_km;if(kind==='mass'&&u==='kg')return 1/C.earth_mass_kg;if(kind==='radius'&&u==='km')return 1/C.earth_radius_km;return null}
function csv(text){const rows=[];let row=[],cell='',quoted=false;text=text.replace(/^\uFEFF/,'');for(let i=0;i<text.length;i++){const c=text[i];if(c==='"'){if(quoted&&text[i+1]==='"'){cell+='"';i++}else if(!quoted&&cell!=='')throw Error('Unexpected quote in CSV');else quoted=!quoted}else if(c===','&&!quoted){row.push(cell);cell=''}else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&text[i+1]==='\n')i++;row.push(cell);rows.push(row);row=[];cell=''}else cell+=c}if(quoted)throw Error('Unclosed quote in CSV');if(cell||row.length){row.push(cell);rows.push(row)}return rows}
function normalize(rows,options={}){
 const headerIndex=rows.findIndex(r=>r.some(v=>['name','objectname','pl_name'].includes(head(v)))&&r.some(v=>['mbd/mj','mass(mj)','pl_massj','mass','mass_earth','mass_jupiter'].includes(head(v))));
 if(headerIndex<0)throw Error('No recognized header. Use the CSV template, NASA pl_massj/pl_radj, Carmichael MBD/MJ and RBD/RJ, or the research-list headers.');
 const h=rows[headerIndex].map(head),idx=(...names)=>h.findIndex(v=>names.includes(v)),get=(r,...names)=>{const i=idx(...names);return i<0?null:r[i]};
 const profile=h.includes('mbd/mj')?'carmichael':h.includes('pl_massj')?'nasa':h.includes('objectname')?'research':'custom';
 const nameIndex=idx('name','objectname','pl_name'),mi=idx('mass_earth','mass_jupiter','mass(mj)','mbd/mj','pl_massj','mass'),ri=idx('radius_earth','radius_jupiter','radius(rj)','rbd/rj','pl_radj','radius');
 if(mi<0||ri<0)throw Error('Both mass and radius columns are required.');
 const assumed=profile==='custom'?'Earth':'Jupiter';const inferred=(i,kind)=>h[i].endsWith('_earth')?'Earth':h[i].endsWith('_jupiter')?'Jupiter':assumed;
 const records=[],skipped=[],warnings=[],seen=new Set();const label=options.label||options.filename||'Custom data';const refs=rows.find(r=>clean(r[0]).startsWith('Note. References:'))?.[0]||'';
 for(let i=headerIndex+1;i<rows.length;i++){
  const r=rows[i],name=clean(r[nameIndex]);if(!r.some(v=>clean(v)))continue;
  if(name.startsWith('Note.'))continue;
  const reject=reason=>skipped.push({row:i+1,name,reason});
  if(!name){reject('Missing object name');continue}
  const ml=get(r,'pl_massjlim','mass_limit'),rl=get(r,'pl_radjlim','radius_limit');
  if([ml,rl].some(v=>clean(v)!==''&&number(v)!==0)){reject('Mass/radius limit or invalid limit flag; not plotted as a measurement');continue}
  const m=measurement(r[mi]),rad=measurement(r[ri]);if(!m||!rad||m.value<=0||rad.value<=0){reject('Missing, ambiguous, or nonpositive mass/radius');continue}
  const mu=clean(get(r,'mass_unit'))||inferred(mi,'mass'),ru=clean(get(r,'radius_unit'))||inferred(ri,'radius');const mf=factor(mu,'mass'),rf=factor(ru,'radius');if(!mf||!rf){reject('Unrecognized unit');continue}
  function errors(kind,inline){if(inline)return inline;const upper=get(r,kind+'_error_plus',kind==='mass'?'pl_massjerr1':'pl_radjerr1'),lower=get(r,kind+'_error_minus',kind==='mass'?'pl_massjerr2':'pl_radjerr2');if(clean(upper)===''&&clean(lower)==='')return null;const u=number(upper),l=number(lower);if(u===null||l===null||u<0){warnings.push({row:i+1,name,reason:kind+' uncertainty incomplete/invalid; omitted'});return null}return [Math.abs(l),u]}
  let me=errors('mass',m.error),re=errors('radius',rad.error);
  if(me&&me[0]>=m.value){warnings.push({row:i+1,name,reason:'Mass lower error reaches zero; mass error bars omitted'});me=null}
  if(re&&re[0]>=rad.value){warnings.push({row:i+1,name,reason:'Radius lower error reaches zero; radius error bars omitted'});re=null}
  if(profile!=='nasa'&&seen.has(key(name))){reject('Duplicate name within this dataset; first row retained');continue}seen.add(key(name));
  const type=clean(get(r,'objecttype','category'));let category=type;
  const known=['Asteroids','Solar System planets','Solar System objects','Exoplanets','Brown dwarfs','Low-mass stars','Moons','Substellar companions','Other objects'];
  if(profile==='carmichael')category='Substellar companions';
  else if(profile==='nasa')category='Exoplanets';
  else if(profile==='research')category=/\bbd\b|^[LTY]\d/i.test(type)?'Brown dwarfs':type==='satellite'?'Moons':type==='planet'?'Solar System planets':'Exoplanets';
  else if(!known.includes(category))category='Other objects';
  const papers=r.filter((v,j)=>h[j]==='papers'&&clean(v)).map(clean);const sourceTitle=clean(get(r,'source','source_title'))||(profile==='nasa'?'NASA Exoplanet Archive':label);let sourceUrl=clean(get(r,'source_url'))||(profile==='nasa'?'https://exoplanetarchive.ipac.caltech.edu/':'');if(sourceUrl&&!/^https?:\/\//i.test(sourceUrl)){warnings.push({row:i+1,name,reason:'Source URL is not http(s); kept as text only'});sourceUrl=''}
  const reference=clean(get(r,'ref.'));let note=clean(get(r,'note'));if(profile==='nasa')note+=' NASA Exoplanet Archive table: measurement methods, mass provenance and publication references were not included; model-derived values cannot be excluded from these columns.';
  if(profile==='research')note+=' Personal research list: paper associations are preserved, but are not verified as the sources of these mass/radius values. Measurement methods and uncertainties were not supplied.';
  if(profile==='carmichael')note+=' Table includes brown dwarfs and very low-mass stars; grouped by source rather than imposing a mass boundary.';
  records.push({id:'import-'+key(name),name,category,mass:m.value*mf,radius:rad.value*rf,mass_error:me?.map(v=>v*mf)||null,radius_error:re?.map(v=>v*rf)||null,source:'import',sourceTitle,sourceUrl,papers,personal:!!options.personal||profile==='research'||/^(true|yes|1)$/i.test(clean(get(r,'personal'))),method:clean(get(r,'method'))||(profile==='carmichael'?'transiting companion table':'method unspecified in supplied file'),note:note.trim(),original:{mass:r[mi],radius:r[ri],mass_unit:mu,radius_unit:ru},provenance:{filename:options.filename||label,sheet:options.sheet||'',row:i+1,reference,original_type:type},referenceNotes:reference?clean(refs):''});
 }
 let normalized=records;
 let aggregation=null;
 if(profile==='nasa'){
  const grouped=new Map();for(const o of records){const k=key(o.name);if(!grouped.has(k))grouped.set(k,[]);grouped.get(k).push(o)}
  normalized=[...grouped.values()].map(group=>{
   if(group.length===1)return {...group[0],measurement_count:1};
   const first=group[0],mass=median(group.map(o=>o.mass)),radius=median(group.map(o=>o.radius));
   return {...first,mass,radius,mass_error:null,radius_error:null,measurement_count:group.length,
    method:'unweighted coordinate medians across eligible archive rows',
    note:`Median mass and median radius from ${group.length} eligible archive rows. Density is calculated from these medians, not a median of reported densities. Aggregate uncertainty is not estimated. `+first.note,
    original:{mass:median(group.map(o=>measurement(o.original.mass).value)),radius:median(group.map(o=>measurement(o.original.radius).value)),mass_unit:first.original.mass_unit,radius_unit:first.original.radius_unit},
    provenance:{...first.provenance,rows:group.map(o=>o.provenance.row),aggregation:'unweighted median mass and radius'},
    measurements:group.map(o=>({row:o.provenance.row,mass:o.mass,radius:o.radius,mass_error:o.mass_error,radius_error:o.radius_error,original:o.original}))};
  });
  aggregation={eligible_rows:records.length,unique_objects:normalized.length,combined_rows:records.length-normalized.length,method:'unweighted medians of mass and radius from positive non-limit paired rows; density derived from aggregate coordinates'};
 }
 return {label,profile,records:normalized,skipped,warnings,aggregation,filename:options.filename||label,sheet:options.sheet||'',enabled:true};
}
function carmichaelHosts(rows,options={}){
 const hi=rows.findIndex(r=>r.some(v=>head(v)==='mbd/mj'));if(hi<0)throw Error('Carmichael header not found');
 const h=rows[hi].map(head),mi=h.indexOf('m⋆/m⊙'),ri=h.indexOf('r⋆/r⊙'),ni=h.indexOf('name');
 if(mi<0||ri<0||ni<0)throw Error('Host mass and radius columns in solar units are required');
 const records=[],skipped=[];
 for(let i=hi+1;i<rows.length;i++){
  const row=rows[i],companion=clean(row[ni]);if(!companion||companion.startsWith('Note.'))continue;
  const m=measurement(row[mi]),r=measurement(row[ri]);
  if(!m||!r||m.value<=0||r.value<=0){skipped.push({row:i+1,name:companion,reason:'Missing or invalid host mass/radius'});continue}
  const mf=factor('Sun','mass'),rf=factor('Sun','radius');
  records.push({id:'host-of-'+key(companion),name:'Host of '+companion,category:'Host stars',mass:m.value*mf,radius:r.value*rf,
   mass_error:m.error&&m.error[0]<m.value?m.error.map(e=>e*mf):null,radius_error:r.error&&r.error[0]<r.value?r.error.map(e=>e*rf):null,
   source:'import',sourceTitle:'Carmichael companion table · host-star columns',sourceUrl:'',papers:[],personal:false,
   method:'published host-star parameters',note:`Host star for ${companion}; mass and radius read from the solar-unit stellar columns. This population includes stars more massive than low-mass dwarfs.`,
   original:{mass:row[mi],radius:row[ri],mass_unit:'Sun',radius_unit:'Sun'},
   provenance:{filename:options.filename||'Carmichael table',sheet:options.sheet||'',row:i+1,columns:{mass:'M⋆/M⊙',radius:'R⋆/R⊙'},companion},host_of:companion});
 }
 return {id:'carmichael-hosts',label:'Carmichael host stars',profile:'carmichael-hosts',records,skipped,warnings:[],enabled:true,supplied:true,filename:options.filename||'Carmichael table',sheet:options.sheet||''};
}
function median(values){const sorted=values.slice().sort((a,b)=>a-b),n=sorted.length;if(!n)throw Error('Median requires data');return n%2?sorted[(n-1)/2]:(sorted[n/2-1]+sorted[n/2])/2}
function combine(base,datasets){const seen=new Set(),objects=[],duplicates=[],personal=new Set(datasets.filter(d=>d.enabled).flatMap(d=>d.records.filter(o=>o.personal).map(o=>key(o.name))));for(const dataset of [...datasets.filter(d=>d.enabled),{label:'Starter catalog',records:base}])for(const row of dataset.records){const k=key(row.name);if(seen.has(k)){duplicates.push({name:row.name,dataset:dataset.label});continue}seen.add(k);objects.push({...row,personal:personal.has(k)||!!row.personal,dataset:dataset.label})}return {objects,duplicates}}
function displayCategory(o){
 const c=o.category;
 if(c==='Sun'||key(o.name)==='sun')return 'Sun';
 if(['Asteroids','Solar System planets','Solar System objects','Moons'].includes(c))return 'Solar System objects';
 if(c==='Low-mass stars')return 'Low-mass stars';
 if(c==='Host stars')return 'Host stars';
 return o.mass>=1000?'Brown dwarfs':'Exoplanets';
}
const api={normalize,csv,key,combine,displayCategory,median,carmichaelHosts,constants:C};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.AtlasImport=api;
})(typeof window!=='undefined'?window:globalThis);
