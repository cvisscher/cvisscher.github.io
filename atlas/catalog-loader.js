'use strict';
let catalogLoaded=false;
async function loadPublishedPopulations(){
 if(catalogLoaded)return;catalogLoaded=true;
 const warnings=[];
 try{
  const response=await fetch('data/supplied-datasets.json',{cache:'no-store'});
  if(!response.ok)throw Error('Additional object populations could not load.');
  datasets=await response.json();
 }catch(e){warnings.push(e.message);datasets=[]}
 try{
  const response=await fetch('data/custom-objects.csv',{cache:'no-store'});
  if(response.ok){const custom=AtlasImport.normalize(AtlasImport.csv(await response.text()),{filename:'custom-objects.csv',label:'Research additions'});if(custom.records.length)datasets.unshift({...custom,permanent:true,id:'custom-file'})}
 }catch(e){warnings.push('Research additions could not load.')}
 try{
  const response=await fetch('data/research-publications.json',{cache:'no-store'});
  if(!response.ok)throw Error('Related publication links could not load.');
  const research=await response.json();
  researchIndex=Object.fromEntries(Object.entries(research.objects).map(([name,entry])=>[AtlasImport.key(name),{...entry,papers:entry.papers.map(id=>research.papers[id]).filter(Boolean)}]));
 }catch(e){warnings.push(e.message)}
 const combined=AtlasImport.combine(baseObjects,datasets);
 catalog.objects=combined.objects.filter(o=>!['bennu','eros'].includes(AtlasImport.key(o.name))&&o.mass>=7.346e22/AtlasImport.constants.earth_mass_kg&&o.radius>=1737.4/AtlasImport.constants.earth_radius_km);
 if(!catalog.objects.some(o=>o.id===selected))selected=catalog.objects[0]?.id;
 const object=catalog.objects.find(o=>o.id===selected);if(object)details(object);
 revision++;await render();
 if(warnings.length)$('message').textContent=warnings.join(' ');
}
document.addEventListener('atlas-ready',loadPublishedPopulations,{once:true});
if(typeof baseObjects!=='undefined'&&baseObjects.length)loadPublishedPopulations();
