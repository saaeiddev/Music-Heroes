import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const instruments = [
  {id:'electric-guitar',name:'Electric Guitar',family:'Strings',familyLabel:'String Instrument',origin:'USA, 1930s',range:'4+ Octaves',difficulty:'★★★☆☆',kind:'guitar',tone:164.81,desc:'The electric guitar is a string instrument that uses pickups to convert the vibration of its strings into electrical signals.',learn:'Magnetic pickups translate string vibration into an electrical signal, which can then be shaped by controls, effects and amplification.',parts:['Body','Strings','Pickups','Bridge','Fretboard','Tuning Machines']},
  {id:'violin',name:'Violin',family:'Strings',familyLabel:'String Instrument',origin:'Italy, 1500s',range:'G3–A7',difficulty:'★★★★☆',kind:'violin',tone:659.25,desc:'The violin is a bowed string instrument prized for its bright, agile and expressive voice.',learn:'The bow grips and releases the strings. The bridge transfers vibration to the resonant wooden body.',parts:['Scroll','Fingerboard','Strings','Bridge','F-holes','Tailpiece']},
  {id:'flute',name:'Flute',family:'Woodwind',familyLabel:'Woodwind Instrument',origin:'Ancient; modern form 1800s',range:'C4–C7+',difficulty:'★★★☆☆',kind:'flute',tone:880,desc:'The concert flute produces sound when air is directed across the embouchure hole.',learn:'A focused air stream excites the air column while keys open and close tone holes to change pitch.',parts:['Headjoint','Embouchure','Keys','Body','Footjoint']},
  {id:'drums',name:'Drum Kit',family:'Percussion',familyLabel:'Percussion Instrument',origin:'Global traditions',range:'Non-pitched / tuned',difficulty:'★★★☆☆',kind:'drums',tone:110,desc:'A drum kit combines drums and cymbals into one coordinated percussion instrument.',learn:'Kick, snare, toms, hi-hat and cymbals are coordinated with all four limbs to create groove and dynamics.',parts:['Kick','Snare','Toms','Hi-hat','Cymbals']},
  {id:'cello',name:'Cello',family:'Strings',familyLabel:'String Instrument',origin:'Italy, 1500s',range:'C2–C6+',difficulty:'★★★★☆',kind:'cello',tone:220,desc:'The cello is a bowed string instrument with a warm, resonant register close to the human voice.',learn:'The cello rests on an endpin and is bowed between the knees. Its large body produces a deep singing tone.',parts:['Scroll','Fingerboard','Bridge','F-holes','Tailpiece','Endpin']},
  {id:'saxophone',name:'Saxophone',family:'Woodwind',familyLabel:'Woodwind Instrument',origin:'Belgium, 1840s',range:'Varies by sax',difficulty:'★★★☆☆',kind:'sax',tone:466.16,desc:'The saxophone is a single-reed woodwind known for its rich, flexible and expressive tone.',learn:'A reed vibrates against the mouthpiece and excites the air in a conical metal tube. Keys alter the effective tube length.',parts:['Mouthpiece','Reed','Neck','Keys','Body','Bell']},
  {id:'trumpet',name:'Trumpet',family:'Brass',familyLabel:'Brass Instrument',origin:'Ancient roots; modern valves 1800s',range:'F#3–D6+',difficulty:'★★★☆☆',kind:'trumpet',tone:523.25,desc:'The trumpet is a brass instrument whose bright tone begins with vibrating lips at the mouthpiece.',learn:'Three valves redirect air through extra tubing. Lip tension and air speed also control pitch and tone.',parts:['Mouthpiece','Leadpipe','Valves','Tuning Slide','Bell']},
  {id:'sitar',name:'Sitar',family:'Traditional',familyLabel:'Traditional String Instrument',origin:'South Asia',range:'Variable',difficulty:'★★★★☆',kind:'sitar',tone:293.66,desc:'The sitar is a long-necked plucked instrument known for resonant sympathetic strings and expressive pitch bends.',learn:'Melody strings are plucked with a mizrab while sympathetic strings resonate beneath the frets.',parts:['Gourd','Bridge','Frets','Melody Strings','Sympathetic Strings','Tuning Pegs']},
  {id:'piano',name:'Grand Piano',family:'Keyboard',familyLabel:'Keyboard Instrument',origin:'Italy, 1700s',range:'A0–C8',difficulty:'★★★★☆',kind:'piano',tone:261.63,desc:'The piano is a keyboard instrument in which felt-covered hammers strike strings when keys are pressed.',learn:'Each key triggers an action mechanism that throws a hammer toward a string and lets it rebound so the string can vibrate.',parts:['Keyboard','Action','Hammers','Strings','Soundboard','Pedals']},
  {id:'synth',name:'Synthesizer',family:'Electronic',familyLabel:'Electronic Instrument',origin:'20th century',range:'Configurable',difficulty:'★★★☆☆',kind:'synth',tone:329.63,desc:'A synthesizer creates and shapes electronic sound using oscillators, filters, envelopes and modulation.',learn:'Synthesizers generate or sample waveforms, then shape them with filters, envelopes, modulation and effects.',parts:['Keys','Oscillators','Filter','Envelope','LFO','Controls']},
  {id:'acoustic-guitar',name:'Acoustic Guitar',family:'Strings',familyLabel:'String Instrument',origin:'Europe; modern form 1800s',range:'E2–E6+',difficulty:'★★★☆☆',kind:'acoustic',tone:196,desc:'The acoustic guitar amplifies string vibration through its hollow wooden body and soundboard.',learn:'String vibration travels through the bridge into the top plate. The body and enclosed air reinforce and project the sound.',parts:['Body','Soundhole','Bridge','Strings','Neck','Headstock']}
];

const leftIds=['violin','electric-guitar','flute','drums'];
const rightIds=['cello','saxophone','trumpet','sitar'];
const families=[['Keyboard','keyboard'],['Strings','strings'],['Brass','brass'],['Woodwind','woodwind'],['Percussion','percussion'],['Traditional','traditional'],['Electronic','electronic']];
const heroes=[
  ['Jimi Hendrix','Electric Guitar','Expanded the electric guitar vocabulary through feedback, effects and studio experimentation.','electric-guitar'],
  ['Yo-Yo Ma','Cello','Known for lyrical cello performance and cross-cultural projects connecting classical and global traditions.','cello'],
  ['Louis Armstrong','Trumpet','A foundational jazz voice whose trumpet phrasing and improvisation transformed popular music.','trumpet'],
  ['John Coltrane','Saxophone','Pushed saxophone improvisation toward new harmonic, rhythmic and spiritual dimensions.','saxophone'],
  ['Ravi Shankar','Sitar','Introduced generations of listeners around the world to Hindustani classical sitar.','sitar'],
  ['Herbie Hancock','Keyboard & Synthesizer','Bridged acoustic jazz, funk and electronic music through adventurous keyboard work.','synth']
];

const $=s=>document.querySelector(s);
const $$=s=>Array.from(document.querySelectorAll(s));
const byId=id=>instruments.find(i=>i.id===id);
let selected='electric-guitar',soundEnabled=true,audioCtx=null,activeOsc=null,explore=false;
let renderer,scene,camera,controls,modelRoot,resizeObserver;

function iconSvg(kind){
  const c='#d6a451', fill='#17120d';
  const head='<svg viewBox="0 0 120 90" aria-hidden="true"><g fill="'+fill+'" stroke="'+c+'" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">';
  const tail='</g></svg>';
  const shapes={
    guitar:'<path d="M46 56c-12-9-9-26 3-31 7-3 12 1 16 0 6-2 9-13 18-9 10 5 4 18-4 23-4 2-6 6-5 10 2 11-15 24-28 7Z"/><path d="M71 36 103 8M95 14l9 9M83 22l8 8"/><circle cx="57" cy="43" r="4"/>',
    violin:'<path d="M57 24c-9 4-12 12-8 20-7 7-7 20 2 24 7 3 12-3 14-8 3 5 8 11 15 8 9-4 9-17 2-24 4-8 1-16-8-20-6-3-12 1-17 0Z"/><path d="M65 24V7M60 8h10M65 65v17"/><path d="M39 78 93 12"/>',
    flute:'<path d="M15 52 105 35"/><circle cx="35" cy="48" r="4"/><circle cx="52" cy="45" r="4"/><circle cx="69" cy="42" r="4"/><circle cx="86" cy="39" r="4"/>',
    drums:'<ellipse cx="59" cy="53" rx="24" ry="19"/><ellipse cx="31" cy="35" rx="15" ry="8"/><ellipse cx="88" cy="34" rx="17" ry="8"/><path d="M31 43v17M88 42v18M35 60 22 81M83 62l14 19M24 20v14M98 18v15"/><path d="M12 19h25M86 17h25"/>',
    sax:'<path d="M50 13c19 5 20 25 7 33-13 8-12 27 7 27 16 0 23-13 17-25"/><path d="M78 48c15 6 22 15 17 27-4 10-19 10-28 2"/><circle cx="51" cy="29" r="3"/><circle cx="48" cy="39" r="3"/>',
    trumpet:'<path d="M14 48h66"/><path d="M80 34 108 22v52L80 61Z"/><path d="M36 35v26M48 34v28M60 34v28"/><circle cx="36" cy="32" r="4"/><circle cx="48" cy="31" r="4"/><circle cx="60" cy="31" r="4"/>',
    sitar:'<circle cx="47" cy="61" r="22"/><circle cx="78" cy="20" r="10"/><path d="M55 44 77 25M58 48 82 27M69 35l10 9"/><path d="M73 15 99 5"/>',
    keyboard:'<path d="M15 32h90v43H15z"/><path d="M23 39v28M36 39v28M49 39v28M62 39v28M75 39v28M88 39v28"/><path d="M29 39v15M42 39v15M68 39v15M81 39v15M94 39v15"/>',
    electronic:'<path d="M15 26h90v48H15z"/><path d="M25 57h68M29 57v12M40 57v12M51 57v12M62 57v12M73 57v12M84 57v12"/><circle cx="30" cy="39" r="5"/><circle cx="49" cy="39" r="5"/><path d="M65 35h28M65 43h28"/>'
  };
  return head+(shapes[kind]||shapes.guitar)+tail;
}

function renderRails(){
  function make(ids,target){
    target.innerHTML=ids.map(id=>{
      const i=byId(id);
      return '<button class="rail-item '+(id===selected?'active':'')+'" data-inst="'+id+'" aria-label="View '+i.name+'"><span class="rail-thumb"><span class="thumb-icon">'+iconSvg(i.kind)+'</span></span><span>'+i.name.replace('Electric ','')+'</span></button>';
    }).join('');
  }
  make(leftIds,$('#leftRail')); make(rightIds,$('#rightRail'));
  $$('[data-inst]').forEach(b=>b.addEventListener('click',()=>selectInstrument(b.dataset.inst)));
}
function renderFamilies(){
  $('#familyNav').innerHTML=families.map(f=>{
    const kind=f[1]==='strings'?'guitar':f[1]==='brass'?'trumpet':f[1]==='woodwind'?'sax':f[1]==='percussion'?'drums':f[1]==='traditional'?'sitar':f[1]==='electronic'?'electronic':'keyboard';
    return '<button class="family-item '+(f[0]===current().family?'active':'')+'" data-family="'+f[0]+'"><span class="family-icon">'+iconSvg(kind)+'</span><span>'+f[0]+'</span></button>';
  }).join('');
  $$('[data-family]').forEach(b=>b.addEventListener('click',()=>{
    const match=instruments.find(i=>i.family===b.dataset.family); if(match) selectInstrument(match.id);
  }));
}
function current(){return byId(selected)||instruments[0]}
function updateCopy(){
  const i=current();
  $('#instrumentTitle').textContent=i.name.toUpperCase();
  $('#instrumentDescription').textContent=i.desc;
  $('#familyPill').textContent=i.familyLabel.toUpperCase()+' ›';
  $('#metaFamily').textContent=i.family;
  $('#metaOrigin').textContent=i.origin;
  $('#metaRange').textContent=i.range;
  $('#metaDifficulty').textContent=i.difficulty;
  renderRails(); renderFamilies();
}

function mat(color,metal=.2,rough=.35){return new THREE.MeshStandardMaterial({color,metalness:metal,roughness:rough})}
function addMesh(parent,geo,material,pos,rot,scale){
  const m=new THREE.Mesh(geo,material);
  m.position.set(pos[0],pos[1],pos[2]); if(rot)m.rotation.set(rot[0],rot[1],rot[2]); if(scale)m.scale.set(scale[0],scale[1],scale[2]);
  m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;
}
function makeGuitar(acoustic=false){
  const g=new THREE.Group(), black=mat(acoustic?0x6b351d:0x080808,.35,.2), ivory=mat(0xeee6d3,.15,.35), wood=mat(0xc58a4b,.05,.5), metal=mat(0xb9b7ad,.85,.18);
  addMesh(g,new THREE.SphereGeometry(1,32,20),black,[0,-.55,0],[0,0,0],[.9,1.05,.22]);
  addMesh(g,new THREE.SphereGeometry(1,32,20),black,[.02,.35,0],[0,0,0],[.62,.78,.2]);
  if(acoustic){
    addMesh(g,new THREE.TorusGeometry(.22,.045,16,32),mat(0x15100d,.1,.6),[0,.05,.23],[Math.PI/2,0,0]);
  }else{
    addMesh(g,new THREE.BoxGeometry(.75,1.15,.08),ivory,[.02,-.02,.23],[0,0,-.08]);
    [-.28,0,.28].forEach(y=>addMesh(g,new THREE.BoxGeometry(.42,.08,.08),metal,[.02,y+.02,.31]));
  }
  addMesh(g,new THREE.BoxGeometry(.24,2.65,.16),wood,[0,1.75,0]);
  addMesh(g,new THREE.BoxGeometry(.42,.58,.16),wood,[0,3.32,0],[0,0,-.1]);
  for(let k=0;k<6;k++) addMesh(g,new THREE.CylinderGeometry(.006,.006,4.2,6),metal,[-.08+k*.032,1.18,.18],[0,0,0]);
  for(let k=0;k<6;k++) addMesh(g,new THREE.CylinderGeometry(.035,.035,.18,8),metal,[k<3?-.28:.28,3.15+(k%3)*.18,0],[0,0,Math.PI/2]);
  g.rotation.z=-.18; return g;
}
function makeBowed(cello=false){
  const g=new THREE.Group(), wood=mat(cello?0x6d2b16:0x8e3b1d,.05,.38), dark=mat(0x17100b,.15,.4), metal=mat(0xc7c5bd,.75,.2), s=cello?1.25:.85;
  addMesh(g,new THREE.SphereGeometry(1,28,18),wood,[0,-.45,0],[0,0,0],[.65*s,.82*s,.2*s]);
  addMesh(g,new THREE.SphereGeometry(1,28,18),wood,[0,.32,0],[0,0,0],[.52*s,.66*s,.18*s]);
  addMesh(g,new THREE.BoxGeometry(.16,2.05,.11),dark,[0,1.65,0],null,[s,s,s]);
  addMesh(g,new THREE.SphereGeometry(.24,18,12),wood,[0,2.85,0],null,[s,s,s]);
  for(let k=0;k<4;k++) addMesh(g,new THREE.CylinderGeometry(.006,.006,3.15,6),metal,[-.045+k*.03,.95,.14],[0,0,0], [s,s,s]);
  if(cello)addMesh(g,new THREE.CylinderGeometry(.018,.018,1,8),metal,[0,-1.65,0]);
  return g;
}
function makeFlute(){
  const g=new THREE.Group(), metal=mat(0xd4d1c6,.95,.12);
  addMesh(g,new THREE.CylinderGeometry(.12,.12,4.5,24),metal,[0,0,0],[0,0,Math.PI/2]);
  for(let x=-1.5;x<=1.5;x+=.45)addMesh(g,new THREE.TorusGeometry(.16,.025,10,20),metal,[x,.02,.02],[Math.PI/2,0,0]);
  g.rotation.z=.18;return g;
}
function makeDrums(){
  const g=new THREE.Group(), shell=mat(0x2f2117,.35,.3), skin=mat(0xd8cfbb,.1,.5), metal=mat(0xbda66f,.8,.22);
  addMesh(g,new THREE.CylinderGeometry(.72,.72,.85,28),shell,[0,-.55,0],[Math.PI/2,0,0]); addMesh(g,new THREE.CircleGeometry(.7,28),skin,[0,-.55,.43]);
  [[-1,.2,.3],[.9,.35,.2],[0,.65,-.2]].forEach(p=>addMesh(g,new THREE.CylinderGeometry(.45,.45,.42,24),shell,p,[Math.PI/2,0,0]));
  [[-1.15,1.15,-.1],[1.2,1.15,-.2]].forEach(p=>{addMesh(g,new THREE.CylinderGeometry(.58,.58,.035,32),metal,p);addMesh(g,new THREE.CylinderGeometry(.025,.025,1.9,8),metal,[p[0],.2,p[2]])});
  g.rotation.y=-.3;return g;
}
function makeHorn(sax=false){
  const g=new THREE.Group(), gold=mat(0xd7a02f,.9,.18), dark=mat(0x3b2914,.4,.35);
  if(sax){
    const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(0,1.7,0),new THREE.Vector3(-.4,.9,0),new THREE.Vector3(-.3,-.4,0),new THREE.Vector3(.3,-1.25,0),new THREE.Vector3(.85,-.65,0)]);
    addMesh(g,new THREE.TubeGeometry(curve,48,.13,12,false),gold,[0,0,0]);
    addMesh(g,new THREE.ConeGeometry(.42,.7,24,1,true),gold,[1.05,-.45,0],[0,0,-Math.PI/2]);
    for(let y=-.55;y<1.15;y+=.35)addMesh(g,new THREE.SphereGeometry(.07,12,8),dark,[.05,y,.15]);
    g.rotation.z=-.12;
  }else{
    addMesh(g,new THREE.CylinderGeometry(.12,.12,2.5,20),gold,[0,0,0],[0,0,Math.PI/2]);
    addMesh(g,new THREE.ConeGeometry(.62,1.15,28,1,true),gold,[1.55,0,0],[0,0,-Math.PI/2]);
    for(let x=-.45;x<=.45;x+=.45){addMesh(g,new THREE.CylinderGeometry(.06,.06,.7,14),gold,[x,.35,0]);addMesh(g,new THREE.SphereGeometry(.09,12,8),dark,[x,.75,0])}
  } return g;
}
function makeSitar(){
  const g=new THREE.Group(), wood=mat(0x7b3e19,.15,.38), gold=mat(0xc69039,.55,.28), metal=mat(0xb9b7ad,.8,.2);
  addMesh(g,new THREE.SphereGeometry(.75,28,18),wood,[0,-1.15,0],null,[1,1.08,.48]);
  addMesh(g,new THREE.BoxGeometry(.27,3.2,.15),wood,[0,.65,0]);
  addMesh(g,new THREE.SphereGeometry(.33,20,14),wood,[0,2.4,0],null,[1,1,.55]);
  for(let y=-.4;y<1.95;y+=.24)addMesh(g,new THREE.TorusGeometry(.25,.016,8,16,Math.PI),gold,[0,y,.08],[Math.PI/2,0,0]);
  for(let k=0;k<5;k++)addMesh(g,new THREE.CylinderGeometry(.005,.005,3.7,6),metal,[-.06+k*.03,.55,.16]);
  g.rotation.z=.1;return g;
}
function makePiano(synth=false){
  const g=new THREE.Group(), black=mat(0x090909,.4,.18), white=mat(0xe9e5dc,.1,.35), metal=mat(0xc49a4a,.65,.28);
  if(synth){
    addMesh(g,new THREE.BoxGeometry(3.7,.45,1.15),black,[0,0,0]);
    for(let k=0;k<18;k++)addMesh(g,new THREE.BoxGeometry(.16,.08,.65),white,[-1.45+k*.17,-.25,.18]);
    for(let k=0;k<6;k++)addMesh(g,new THREE.CylinderGeometry(.07,.07,.07,14),metal,[-1.3+k*.35,.25,-.2],[Math.PI/2,0,0]);
  }else{
    addMesh(g,new THREE.BoxGeometry(2.65,.45,1.4),black,[0,.1,0]); addMesh(g,new THREE.BoxGeometry(2.2,.16,1.1),black,[.65,.65,-.15],[0,0,-.15]);
    for(let k=0;k<16;k++)addMesh(g,new THREE.BoxGeometry(.13,.08,.62),white,[-1.02+k*.14,-.18,.38]);
    [-.9,.9].forEach(x=>addMesh(g,new THREE.CylinderGeometry(.07,.08,1.5,10),black,[x,-.85,0]));
  } return g;
}
function buildModel(){
  if(!modelRoot)return;
  while(modelRoot.children.length){modelRoot.remove(modelRoot.children[0])}
  const i=current(); let m;
  if(i.kind==='guitar')m=makeGuitar(false);
  else if(i.kind==='acoustic')m=makeGuitar(true);
  else if(i.kind==='violin')m=makeBowed(false);
  else if(i.kind==='cello')m=makeBowed(true);
  else if(i.kind==='flute')m=makeFlute();
  else if(i.kind==='drums')m=makeDrums();
  else if(i.kind==='sax')m=makeHorn(true);
  else if(i.kind==='trumpet')m=makeHorn(false);
  else if(i.kind==='sitar')m=makeSitar();
  else if(i.kind==='piano')m=makePiano(false);
  else m=makePiano(true);
  m.scale.setScalar(i.kind==='cello'?.8:i.kind==='piano'||i.kind==='synth'?.85:1);
  modelRoot.add(m); $('#loading').style.display='none'; renderHotspots();
}
function init3D(){
  const canvas=$('#scene');
  try{
    renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'high-performance'});
  }catch(e){$('#loading').style.display='none';$('#webglFallback').hidden=false;return}
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.8));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;
  scene=new THREE.Scene();
  camera=new THREE.PerspectiveCamera(34,1,.1,100);camera.position.set(0,.65,7.2);
  controls=new OrbitControls(camera,canvas);controls.enableDamping=true;controls.dampingFactor=.06;controls.enablePan=false;controls.minDistance=4.5;controls.maxDistance=9;controls.target.set(0,.55,0);controls.autoRotate=!matchMedia('(prefers-reduced-motion: reduce)').matches;controls.autoRotateSpeed=.55;
  scene.add(new THREE.HemisphereLight(0xffe2a3,0x120c07,1.8));
  const key=new THREE.SpotLight(0xffd18b,80,14,.58,.5,1.4);key.position.set(-3,6,5);key.castShadow=true;scene.add(key);
  const rim=new THREE.SpotLight(0xd68a36,45,12,.65,.65,1.5);rim.position.set(4,3,-3);scene.add(rim);
  const floor=addMesh(scene,new THREE.CylinderGeometry(2.8,3.1,.25,64),mat(0x15100b,.45,.28),[0,-2.05,0]);floor.receiveShadow=true;
  const ring=addMesh(scene,new THREE.TorusGeometry(2.65,.025,8,96),new THREE.MeshBasicMaterial({color:0xd58d33}),[0,-1.91,0],[Math.PI/2,0,0]);
  modelRoot=new THREE.Group();modelRoot.position.y=-.1;scene.add(modelRoot);buildModel();
  const resize=()=>{const r=canvas.getBoundingClientRect();if(!r.width||!r.height)return;renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix()};
  resize();resizeObserver=new ResizeObserver(resize);resizeObserver.observe(canvas);
  renderer.setAnimationLoop(()=>{controls.update();renderer.render(scene,camera)});
  canvas.addEventListener('pointerdown',()=>controls.autoRotate=false,{passive:true});
}
function renderHotspots(){
  const box=$('#hotspots'); box.innerHTML='';
  if(!explore||selected!=='electric-guitar')return;
  const points=[['Body','46%','68%'],['Pickups','51%','57%'],['Bridge','51%','67%'],['Fretboard','57%','37%'],['Tuning Machines','67%','13%']];
  points.forEach(p=>{const b=document.createElement('button');b.className='hotspot';b.textContent=p[0];b.style.left=p[1];b.style.top=p[2];b.addEventListener('click',()=>showToast(p[0]+': '+partText(p[0])));box.appendChild(b)});
}
function partText(p){
  const map={Body:'The solid body anchors hardware and strongly affects sustain and balance.',Pickups:'Magnetic pickups sense string motion and turn it into an electrical signal.',Bridge:'The bridge anchors the strings and transfers vibration into the instrument.',Fretboard:'Frets divide the vibrating string into repeatable pitches.',Strings:'Strings are the primary vibrating source.',Tuning Machines:'Machine heads adjust string tension and pitch.'};
  return map[p]||'An important part of the '+current().name+'.';
}
function selectInstrument(id){
  if(!byId(id))return;selected=id;stopTone();updateCopy();$('#loading').style.display='grid';setTimeout(buildModel,120);
}
function audio(){if(!audioCtx)audioCtx=new (window.AudioContext||window.webkitAudioContext)();return audioCtx}
function playTone(){
  if(!soundEnabled){showToast('Sound is muted');return} stopTone();
  const ctx=audio();ctx.resume();const i=current(),o=ctx.createOscillator(),g=ctx.createGain(),f=ctx.createBiquadFilter();
  o.type=i.family==='Electronic'?'sawtooth':i.family==='Percussion'?'square':i.family==='Brass'?'sawtooth':'triangle';o.frequency.value=i.tone;f.type='lowpass';f.frequency.value=i.family==='Woodwind'?2300:i.family==='Brass'?1800:1450;
  g.gain.setValueAtTime(.0001,ctx.currentTime);g.gain.exponentialRampToValueAtTime(.13,ctx.currentTime+.035);g.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+1.05);
  o.connect(f).connect(g).connect(ctx.destination);o.start();o.stop(ctx.currentTime+1.08);activeOsc=o;$('#playBtn').textContent='■';o.onended=()=>{activeOsc=null;$('#playBtn').textContent='▶'};
}
function stopTone(){if(activeOsc){try{activeOsc.stop()}catch(e){}activeOsc=null}if($('#playBtn'))$('#playBtn').textContent='▶'}
function showToast(text){const t=$('#toast');t.textContent=text;t.classList.add('show');clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>t.classList.remove('show'),1900)}
function openLearn(){
  const i=current();$('#dialogContent').innerHTML='<p style="color:#d6a451;letter-spacing:.18em;font-size:11px">LEARN</p><h2>'+i.name+'</h2><p>'+i.learn+'</p><div class="grid">'+i.parts.map(p=>'<div class="card"><b>'+p+'</b><p>'+partText(p)+'</p></div>').join('')+'</div>';$('#panelDialog').showModal();
}
function openSound(){
  const i=current();$('#dialogContent').innerHTML='<p style="color:#d6a451;letter-spacing:.18em;font-size:11px">SOUND</p><h2>'+i.name+'</h2><p>Play a short synthesized demonstration inspired by this instrument. Audio starts only after your click.</p><button id="dialogPlay" class="family-pill">PLAY DEMONSTRATION</button>';$('#panelDialog').showModal();setTimeout(()=>$('#dialogPlay')&&$('#dialogPlay').addEventListener('click',playTone),0);
}
function openPanel(type){
  if(type==='home'){try{$('#panelDialog').close()}catch(e){}return}
  let html='';
  if(type==='instruments')html='<p style="color:#d6a451;letter-spacing:.18em;font-size:11px">COLLECTION</p><h2>Explore Instruments</h2><div class="grid">'+instruments.map(i=>'<button class="card search-result" data-dialog-inst="'+i.id+'"><b>'+i.name+'</b><p>'+i.family+'</p></button>').join('')+'</div>';
  else if(type==='heroes')html='<p style="color:#d6a451;letter-spacing:.18em;font-size:11px">INSPIRATION</p><h2>Music Heroes</h2><div class="grid">'+heroes.map(h=>'<div class="card"><b>'+h[0]+'</b><p style="color:#d6a451">'+h[1]+'</p><p>'+h[2]+'</p><button class="family-pill" data-dialog-inst="'+h[3]+'">EXPLORE INSTRUMENT</button></div>').join('')+'</div>';
  else if(type==='contact')html='<p style="color:#d6a451;letter-spacing:.18em;font-size:11px">CONTACT</p><h2>Start a conversation</h2><p>This static GitHub Pages version does not pretend to have a server-side form handler.</p><form id="contactForm" style="display:grid;gap:12px"><input required name="name" placeholder="Name" style="padding:12px;border-radius:8px;border:1px solid #715331;background:#0f0d0b;color:white"><input required type="email" name="email" placeholder="Email" style="padding:12px;border-radius:8px;border:1px solid #715331;background:#0f0d0b;color:white"><input required name="subject" placeholder="Subject" style="padding:12px;border-radius:8px;border:1px solid #715331;background:#0f0d0b;color:white"><textarea required name="message" rows="5" placeholder="Message" style="padding:12px;border-radius:8px;border:1px solid #715331;background:#0f0d0b;color:white"></textarea><button class="family-pill" type="submit">OPEN IN EMAIL APP</button></form>';
  else html='<p style="color:#d6a451;letter-spacing:.18em;font-size:11px">ABOUT</p><h2>Music you can explore</h2><p>MUSIC HEROES is an interactive music-learning exhibition built around real-time 3D interaction, concise instrument stories and synthesized sound demonstrations.</p><div class="grid"><div class="card"><b>See</b><p>Rotate instruments in a cinematic digital gallery.</p></div><div class="card"><b>Hear</b><p>Trigger sound only after a user gesture.</p></div><div class="card"><b>Learn</b><p>Explore instrument families, history and important parts.</p></div><div class="card"><b>Credit</b><p>Created by Amir Saeid Dehghan.</p></div></div>';
  $('#dialogContent').innerHTML=html;$('#panelDialog').showModal();
  $$('[data-dialog-inst]').forEach(b=>b.addEventListener('click',()=>{try{$('#panelDialog').close()}catch(e){}selectInstrument(b.dataset.dialogInst)}));
  const form=$('#contactForm');if(form)form.addEventListener('submit',e=>{e.preventDefault();const f=new FormData(form);location.href='mailto:?subject='+encodeURIComponent(f.get('subject'))+'&body='+encodeURIComponent('From: '+f.get('name')+' <'+f.get('email')+'>\n\n'+f.get('message'))});
}
function renderSearch(q){
  q=q.toLowerCase().trim();const arr=instruments.filter(i=>!q||(i.name+' '+i.family+' '+i.desc).toLowerCase().includes(q));
  $('#searchResults').innerHTML=arr.map(i=>'<button class="search-result" data-search-inst="'+i.id+'"><b>'+i.name+'</b><span style="float:right;color:#d6a451">'+i.family+'</span></button>').join('')||'<p>No matching instruments.</p>';
  $$('[data-search-inst]').forEach(b=>b.addEventListener('click',()=>{$('#searchDialog').close();selectInstrument(b.dataset.searchInst)}));
}
function bind(){
  $('#prevBtn').addEventListener('click',()=>{let n=(instruments.findIndex(i=>i.id===selected)-1+instruments.length)%instruments.length;selectInstrument(instruments[n].id)});
  $('#nextBtn').addEventListener('click',()=>{let n=(instruments.findIndex(i=>i.id===selected)+1)%instruments.length;selectInstrument(instruments[n].id)});
  $('#playBtn').addEventListener('click',()=>activeOsc?stopTone():playTone());
  $('#soundAction').addEventListener('click',openSound);$('#learnAction').addEventListener('click',openLearn);
  $('#exploreAction').addEventListener('click',()=>{explore=!explore;$('#exploreAction').classList.toggle('active',explore);if(controls)controls.autoRotate=explore&&!matchMedia('(prefers-reduced-motion: reduce)').matches;renderHotspots();showToast(explore?'Explore mode on':'Explore mode off')});
  $('#familyPill').addEventListener('click',()=>openPanel('instruments'));
  $('#dialogClose').addEventListener('click',()=>$('#panelDialog').close());
  $('#searchBtn').addEventListener('click',()=>{renderSearch('');$('#searchDialog').showModal();setTimeout(()=>$('#searchInput').focus(),0)});
  $('#searchClose').addEventListener('click',()=>$('#searchDialog').close());$('#searchInput').addEventListener('input',e=>renderSearch(e.target.value));
  $('#soundToggle').textContent='◖))';$('#soundToggle').setAttribute('aria-pressed','true');
  $('#soundToggle').addEventListener('click',()=>{soundEnabled=!soundEnabled;$('#soundToggle').textContent=soundEnabled?'◖))':'◖×';$('#soundToggle').setAttribute('aria-pressed',String(soundEnabled));if(!soundEnabled)stopTone();showToast(soundEnabled?'Sound on':'Sound muted')});
  $('#menuBtn').addEventListener('click',()=>openPanel('about'));
  $$('[data-panel]').forEach(b=>b.addEventListener('click',()=>{$$('[data-panel]').forEach(x=>x.classList.toggle('active',x===b));openPanel(b.dataset.panel)}));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')stopTone()});
}
updateCopy();bind();init3D();