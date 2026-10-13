/* PathStudio · Yard — vanilla JS, offline. PRIVATE. Concept art only, not to scale. */
(function(){
'use strict';
var Y = window.YARD, W = Y.W, H = Y.H, KEY = 'pathstudio.yard.v2', NS = 'http://www.w3.org/2000/svg';
var $ = function(id){return document.getElementById(id);};
var areasById = {}; Y.areas.forEach(function(a){areasById[a.id]=a;});

var S = {
  area:'north', photoIdx:{}, layouts:{}, variants:{}, opacity:100, map:'C',
  sel:null, spot:null, opt:null, variant:null,
  tab:'live', groundId:'hybrid', groundSqFt: Y.meta.groundDefaultSqFt||2200
};
var persist = true, saveTimer = null;

function load(){
  try{
    var raw = localStorage.getItem(KEY); if(!raw){
      /* migrate v1 layouts if present */
      var old = localStorage.getItem('pathstudio.yard.v1');
      if(old){ try{ applyData(JSON.parse(old)); }catch(e){} }
      return;
    }
    applyData(JSON.parse(raw));
  }catch(e){}
}
function applyData(d){
  if(!d || typeof d!=='object') throw new Error('bad data');
  var lay = d.layouts || {};
  var clean = {};
  Object.keys(lay).forEach(function(k){
    var v = lay[k]; if(!v || typeof v!=='object') return;
    clean[k] = {};
    Object.keys(v).forEach(function(o){
      if(!Y.opts[o]) return; var q = v[o]; if(!q) return;
      clean[k][o] = {on:!!q.on, x:+q.x, y:+q.y, s:+q.s, variant:q.variant||null};
    });
  });
  S.layouts = clean;
  if(d.variants && typeof d.variants==='object') S.variants = d.variants;
  if(d.area && areasById[d.area]) S.area = d.area;
  if(d.photoIdx && typeof d.photoIdx==='object') S.photoIdx = d.photoIdx;
  if(d.opacity) S.opacity = Math.max(20,Math.min(100,+d.opacity));
  if(d.groundId && Y.ground.some(function(g){return g.id===d.groundId;})) S.groundId = d.groundId;
  if(d.groundSqFt) S.groundSqFt = Math.max(200, Math.min(8000, +d.groundSqFt));
}
function dataObj(){
  return {v:2, savedAt:new Date().toISOString(), area:S.area, photoIdx:S.photoIdx, opacity:S.opacity,
    layouts:S.layouts, variants:S.variants, groundId:S.groundId, groundSqFt:S.groundSqFt};
}
function setStatus(t,bad){var s=$('status'); s.textContent=t; s.style.color=bad?'#ff9c9c':'';}
function save(now){
  if(!persist) return;
  clearTimeout(saveTimer);
  var go = function(){
    try{ localStorage.setItem(KEY, JSON.stringify(dataObj())); setStatus('Saved '+new Date().toLocaleTimeString()); }
    catch(e){ setStatus('Not saved (storage blocked) — use Export JSON', true); }
    renderLayout(); renderGroundTotal();
  };
  if(now) go(); else saveTimer = setTimeout(go, 250);
}

function curArea(){return areasById[S.area];}
function curPhoto(){var a=curArea(); var i=S.photoIdx[a.id]||0; if(i>=a.photos.length) i=0; return a.photos[i];}
function keyOf(areaId, photoId){return areaId+'|'+photoId;}
function getOv(areaId, ph, o){
  var d = (ph.ov && ph.ov[o]) || defaultPos(o);
  var st = (S.layouts[keyOf(areaId,ph.id)]||{})[o];
  var base = {on:false, x:d[0], y:d[1], s:(o==='tramp'?12:100), variant:null};
  if(st){ if(isFinite(st.x)) base.x=st.x; if(isFinite(st.y)) base.y=st.y; if(isFinite(st.s)) base.s=st.s; base.on=!!st.on; if(st.variant) base.variant=st.variant; }
  return base;
}
function defaultPos(o){
  /* fallback when opt enabled from hotspot but no ov entry */
  return [0.5, 0.55, 0.4];
}
function setOv(areaId, ph, o, patch){
  var k = keyOf(areaId, ph.id); S.layouts[k] = S.layouts[k]||{};
  var cur = getOv(areaId, ph, o);
  for(var p in patch) cur[p]=patch[p];
  S.layouts[k][o] = cur;
}
function money(n){return '$'+Math.round(n).toLocaleString('en-US');}
function range(r){return r? money(r[0])+'\u2013'+money(r[1]).slice(1) : '\u2014';}
function el(tag, attrs, html){var e=document.createElement(tag); if(attrs) for(var k in attrs){ if(k==='class') e.className=attrs[k]; else e.setAttribute(k, attrs[k]); } if(html!=null) e.innerHTML=html; return e;}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function photoSrc(id){return 'assets/photos/'+Y.photos[id].file;}
function variantCost(o, vid){
  var m=Y.opts[o]; if(!m||!m.variants) return null;
  for(var i=0;i<m.variants.length;i++) if(m.variants[i].id===vid) return m.variants[i].cost;
  return m.variants[0]?m.variants[0].cost:null;
}
function variantName(o, vid){
  var m=Y.opts[o]; if(!m||!m.variants) return '';
  for(var i=0;i<m.variants.length;i++) if(m.variants[i].id===vid) return m.variants[i].name;
  return m.variants[0]?m.variants[0].name:'';
}

/* ---------- overlay shapes ---------- */
function poly(pts, extra){return '<polygon points="'+pts.map(function(p){return p[0].toFixed(1)+','+p[1].toFixed(1);}).join(' ')+'" '+(extra||'')+'/>';}
function ell(cx,cy,rx,ry,extra){return '<ellipse cx="'+cx.toFixed(1)+'" cy="'+cy.toFixed(1)+'" rx="'+rx.toFixed(1)+'" ry="'+ry.toFixed(1)+'" '+(extra||'')+'/>';}
function trap(cx,cy,nw,fw,dep){return [[cx-nw/2,cy+dep/2],[cx+nw/2,cy+dep/2],[cx+fw/2,cy-dep/2],[cx-fw/2,cy-dep/2]];}
function label(cx,y,txt){return '<text x="'+cx.toFixed(1)+'" y="'+y.toFixed(1)+'" text-anchor="middle">'+esc(txt)+'</text>';}
var VE = ' vector-effect="non-scaling-stroke"';
function shape(o, cx, cy, s, t, size, variant){
  var g='', vn = variant?variantName(o,variant):'';
  if(o==='tramp'){
    var d = size, sIn = s*d/12, rx = sIn/2, ry = rx*t*1.1, rz = (s/2)*((d+12)/12), rzy = rz*t*1.1;
    g += ell(cx,cy,rz,rzy,'fill="rgba(255,90,90,.16)" stroke="#ff6b6b" stroke-width="2.5" stroke-dasharray="9 6"'+VE);
    g += ell(cx,cy+rx*0.12,rx,ry,'fill="rgba(0,0,0,.35)"');
    g += ell(cx,cy,rx,ry,'fill="rgba(25,25,28,.72)" stroke="#111" stroke-width="5"'+VE);
    g += ell(cx,cy,rx*.82,ry*.82,'fill="rgba(70,72,80,.7)" stroke="#9aa" stroke-width="1.5"'+VE);
    for(var i=0;i<8;i++){var a=Math.PI+ (i/7)*Math.PI; var px=cx+Math.cos(a)*rx, py=cy+Math.sin(a)*ry; g+='<line x1="'+px.toFixed(1)+'" y1="'+py.toFixed(1)+'" x2="'+px.toFixed(1)+'" y2="'+(py-rx*.7).toFixed(1)+'" stroke="rgba(230,230,235,.5)" stroke-width="1.5"'+VE+'/>';}
    g += label(cx, cy+rzy+26, d+' ft trampoline + 6 ft clear');
    return g;
  }
  if(o==='fountain' || o==='waterWall' || o==='waterPlanter'){
    var rx2=s/2, ry2=rx2*t*1.15;
    g += ell(cx,cy,rx2,ry2,'fill="rgba(60,150,230,.42)" stroke="#9fd2ff" stroke-width="3"'+VE);
    g += ell(cx,cy,rx2*.78,ry2*.78,'fill="rgba(90,190,255,.35)" stroke="#d6efff" stroke-width="1.5"'+VE);
    for(var j=0;j<7;j++){var aa=Math.PI+ (j/6)*Math.PI; var ex=cx+Math.cos(aa)*rx2*.7, ey=cy+Math.sin(aa)*ry2*.7; var mx=(ex+cx)/2, my=Math.min(ey,cy)-rx2*.55;
      g+='<path d="M'+ex.toFixed(1)+' '+ey.toFixed(1)+' Q'+mx.toFixed(1)+' '+my.toFixed(1)+' '+cx.toFixed(1)+' '+(cy-rx2*.28).toFixed(1)+'" fill="none" stroke="#dff3ff" stroke-width="2.2" stroke-linecap="round" stroke-dasharray="1 5"'+VE+'/>';}
    g += label(cx, cy+ry2+26, vn|| (o==='fountain'?'Fountain basin':(o==='waterPlanter'?'Planter water':'Wall water')));
    return g;
  }
  if(o==='ring'){
    var rx3=s/2, ry3=rx3*t*1.15;
    g += ell(cx,cy,rx3,ry3,'fill="rgba(150,105,55,.38)" stroke="#d6b27a" stroke-width="2.5" stroke-dasharray="3 6"'+VE);
    g += ell(cx,cy,rx3*.45,ry3*.45,'fill="none" stroke="#7cc0ff" stroke-width="2" stroke-dasharray="2 5"'+VE);
    g += label(cx, cy+ry3+26, 'Mulch + drip ring');
    return g;
  }
  if(o==='bed'){
    var dep=s*t*1.1, fh=s*.16, tp=trap(cx,cy,s*.88,s,dep);
    g += poly([[cx-s/2,cy+dep/2],[cx+s/2,cy+dep/2],[cx+s/2,cy+dep/2+fh],[cx-s/2,cy+dep/2+fh]],'fill="rgba(160,105,50,.7)" stroke="#e1b27a" stroke-width="2"'+VE);
    g += poly(tp,'fill="rgba(70,45,25,.75)" stroke="#e1b27a" stroke-width="2"'+VE);
    for(var m=1;m<5;m++){var fx=cx-s/2+s*m/5; g+='<circle cx="'+fx.toFixed(1)+'" cy="'+(cy+dep*0.05).toFixed(1)+'" r="'+(s*.025).toFixed(1)+'" fill="rgba(110,200,100,.8)"/>';}
    g += label(cx, cy+dep/2+fh+26, 'Raised bed');
    return g;
  }
  if(o==='hydro'){
    var hh=s*2.1, x0=cx-s/2, y0=cy-hh/2;
    g += '<rect x="'+x0.toFixed(1)+'" y="'+y0.toFixed(1)+'" width="'+s.toFixed(1)+'" height="'+hh.toFixed(1)+'" fill="rgba(79,209,165,.12)" stroke="#4fd1a5" stroke-width="3"'+VE+'/>';
    for(var r=0;r<4;r++){var yy=y0+hh*(0.12+r*.22); g+='<line x1="'+x0.toFixed(1)+'" y1="'+yy.toFixed(1)+'" x2="'+(x0+s).toFixed(1)+'" y2="'+yy.toFixed(1)+'" stroke="#4fd1a5" stroke-width="2.5"'+VE+'/>';
      for(var q=0;q<3;q++) g+='<circle cx="'+(x0+s*(.2+q*.3)).toFixed(1)+'" cy="'+(yy-s*.09).toFixed(1)+'" r="'+(s*.075).toFixed(1)+'" fill="rgba(90,220,110,.85)"/>';}
    g += '<rect x="'+(x0+s*.1).toFixed(1)+'" y="'+(y0+hh*.9).toFixed(1)+'" width="'+(s*.8).toFixed(1)+'" height="'+(hh*.08).toFixed(1)+'" fill="rgba(60,140,230,.75)"/>';
    g += label(cx, y0+hh+26, 'Hydro rack');
    return g;
  }
  if(o==='sail' || o==='canopy' || o==='westShade' || o==='umbrellas'){
    var p1=[cx-s/2,cy-s*.1], p2=[cx+s/2,cy-s*.2], p3=[cx+s*.42,cy+s*.2], p4=[cx-s*.4,cy+s*.22];
    var pd='M'+p1+' Q'+(cx)+' '+(cy-s*.22)+' '+p2+' Q'+(cx+s*.5)+' '+(cy+s*.05)+' '+p3+' Q'+(cx)+' '+(cy+s*.12)+' '+p4+' Q'+(cx-s*.5)+' '+(cy+s*.06)+' '+p1+'Z';
    [p1,p2,p3,p4].forEach(function(p){g+='<line x1="'+p[0].toFixed(1)+'" y1="'+p[1].toFixed(1)+'" x2="'+p[0].toFixed(1)+'" y2="'+(p[1]+s*.6).toFixed(1)+'" stroke="rgba(190,225,255,.75)" stroke-width="3" stroke-dasharray="7 5"'+VE+'/>';});
    g += '<path d="'+pd+'" fill="rgba(110,190,255,.38)" stroke="#9fd6ff" stroke-width="3"'+VE+'/>';
    var lab = vn || (o==='canopy'?'Canopy upgrade':(o==='westShade'?'Side-yard shade':(o==='umbrellas'?'Umbrellas':'Shade sail')));
    g += label(cx, cy+s*.4, lab);
    return g;
  }
  if(o==='lane' || o==='turf' || o==='pavers'){
    var dep2=s*t*(o==='lane'?1.9:1.5), nw=s, fw=s*(o==='lane'?.55:.7), tp2=trap(cx,cy,nw,fw,dep2);
    var fill = o==='pavers' ? 'url(#pvPat)' : (o==='lane' ? 'rgba(90,205,100,.5)' : 'url(#tfPat)');
    var strk = o==='pavers' ? '#e8b896' : '#a8f0a8';
    g += poly(tp2,'fill="'+fill+'" stroke="'+strk+'" stroke-width="2.5"'+VE);
    if(o==='lane'){
      for(var z=1;z<4;z++){var f=z/4; var yy2=cy+dep2/2-dep2*f; var wd=nw+(fw-nw)*f; g+='<line x1="'+(cx-wd/2).toFixed(1)+'" y1="'+yy2.toFixed(1)+'" x2="'+(cx+wd/2).toFixed(1)+'" y2="'+yy2.toFixed(1)+'" stroke="rgba(255,255,255,.7)" stroke-width="2"'+VE+'/>';}
      g += label(cx, cy+dep2/2+26, 'Catch lane 21 \u00d7 7.5 ft');
    } else g += label(cx, cy+dep2/2+26, o==='turf'?'Turf strip':(vn||'Pavers remodel'));
    return g;
  }
  if(o==='wallPaint' || o==='wallFace' || o==='wallReplace'){
    var ww=s*1.4, wh=s*.55;
    g += '<rect x="'+(cx-ww/2).toFixed(1)+'" y="'+(cy-wh/2).toFixed(1)+'" width="'+ww.toFixed(1)+'" height="'+wh.toFixed(1)+'" fill="rgba(196,181,160,.45)" stroke="#e8d5b8" stroke-width="3"'+VE+'/>';
    for(var wi=0;wi<5;wi++) g+='<line x1="'+(cx-ww/2+ww*(wi+1)/6).toFixed(1)+'" y1="'+(cy-wh/2).toFixed(1)+'" x2="'+(cx-ww/2+ww*(wi+1)/6).toFixed(1)+'" y2="'+(cy+wh/2).toFixed(1)+'" stroke="rgba(255,255,255,.25)" stroke-width="1.5"'+VE+'/>';
    g += label(cx, cy+wh/2+26, vn||Y.opts[o].name);
    return g;
  }
  if(o==='lights'){
    for(var li=0;li<8;li++){var lx=cx-s/2+s*(li/7), ly=cy+Math.sin(li)*s*.08; g+='<circle cx="'+lx.toFixed(1)+'" cy="'+ly.toFixed(1)+'" r="'+(s*.04).toFixed(1)+'" fill="rgba(255,220,100,.9)" stroke="#ffe9a0" stroke-width="1"'+VE+'/>';
      if(li<7) g+='<line x1="'+lx.toFixed(1)+'" y1="'+ly.toFixed(1)+'" x2="'+(cx-s/2+s*((li+1)/7)).toFixed(1)+'" y2="'+(cy+Math.sin(li+1)*s*.08).toFixed(1)+'" stroke="rgba(255,230,150,.55)" stroke-width="2"'+VE+'/>';}
    g += label(cx, cy+s*.25, vn||'String lights');
    return g;
  }
  if(o==='furniture' || o==='grill'){
    var fw2=s*(o==='grill'?.45:.7), fh2=s*(o==='grill'?.35:.35);
    g += '<rect x="'+(cx-fw2/2).toFixed(1)+'" y="'+(cy-fh2/2).toFixed(1)+'" width="'+fw2.toFixed(1)+'" height="'+fh2.toFixed(1)+'" rx="8" fill="'+(o==='grill'?'rgba(255,120,70,.45)':'rgba(224,176,112,.45)')+'" stroke="'+(o==='grill'?'#ffb090':'#f0d0a0')+'" stroke-width="2.5"'+VE+'/>';
    g += label(cx, cy+fh2/2+26, vn||Y.opts[o].name);
    return g;
  }
  if(o==='shed'){
    var sw=s*.9, sh=s*1.1;
    g += '<rect x="'+(cx-sw/2).toFixed(1)+'" y="'+(cy-sh/2).toFixed(1)+'" width="'+sw.toFixed(1)+'" height="'+sh.toFixed(1)+'" fill="rgba(176,160,144,.4)" stroke="#d4c4b4" stroke-width="3"'+VE+'/>';
    g += '<polygon points="'+(cx-sw/2-8).toFixed(1)+','+(cy-sh/2).toFixed(1)+' '+cx.toFixed(1)+','+(cy-sh/2-s*.25).toFixed(1)+' '+(cx+sw/2+8).toFixed(1)+','+(cy-sh/2).toFixed(1)+'" fill="rgba(140,120,100,.55)" stroke="#d4c4b4" stroke-width="2"'+VE+'/>';
    g += '<circle cx="'+cx.toFixed(1)+'" cy="'+(cy-sh*.1).toFixed(1)+'" r="'+(s*.06).toFixed(1)+'" fill="rgba(255,230,120,.85)"/>';
    g += label(cx, cy+sh/2+26, vn||'Shed remodel');
    return g;
  }
  if(o==='hoop'){
    g += '<line x1="'+cx.toFixed(1)+'" y1="'+(cy+s*.5).toFixed(1)+'" x2="'+cx.toFixed(1)+'" y2="'+(cy-s*.45).toFixed(1)+'" stroke="#ccc" stroke-width="4"'+VE+'/>';
    g += '<rect x="'+(cx-s*.18).toFixed(1)+'" y="'+(cy-s*.55).toFixed(1)+'" width="'+(s*.36).toFixed(1)+'" height="'+(s*.22).toFixed(1)+'" fill="rgba(240,240,245,.5)" stroke="#fff" stroke-width="2"'+VE+'/>';
    g += ell(cx, cy-s*.4, s*.1, s*.08, 'fill="none" stroke="#ff9f43" stroke-width="3"'+VE);
    g += label(cx, cy+s*.55, vn||'Basketball hoop');
    return g;
  }
  if(o==='window'){
    var wx=s*.7, wy=s*.55;
    g += '<rect x="'+(cx-wx/2).toFixed(1)+'" y="'+(cy-wy/2).toFixed(1)+'" width="'+wx.toFixed(1)+'" height="'+wy.toFixed(1)+'" fill="rgba(140,180,220,.35)" stroke="#9aa8c0" stroke-width="3"'+VE+'/>';
    g += '<line x1="'+cx.toFixed(1)+'" y1="'+(cy-wy/2).toFixed(1)+'" x2="'+cx.toFixed(1)+'" y2="'+(cy+wy/2).toFixed(1)+'" stroke="#9aa8c0" stroke-width="2"'+VE+'/>';
    g += '<line x1="'+(cx-wx/2).toFixed(1)+'" y1="'+cy.toFixed(1)+'" x2="'+(cx+wx/2).toFixed(1)+'" y2="'+cy.toFixed(1)+'" stroke="#9aa8c0" stroke-width="2"'+VE+'/>';
    g += label(cx, cy+wy/2+26, vn||'Window replace (fix)');
    return g;
  }
  /* generic badge */
  g += ell(cx,cy,s/2,s/2*t,'fill="rgba(122,167,255,.3)" stroke="#7aa7ff" stroke-width="2.5"'+VE);
  g += label(cx, cy+s/2*t+26, vn|| (Y.opts[o]?Y.opts[o].name:o));
  return g;
}
function defs(){
  return '<defs>'+
  '<pattern id="pvPat" width="26" height="18" patternUnits="userSpaceOnUse"><rect width="26" height="18" fill="rgba(185,100,80,.55)"/><path d="M0 0H26M0 9H26M13 0V9M0 9V18M26 9V18" stroke="rgba(255,225,205,.7)" stroke-width="1.5" fill="none"/></pattern>'+
  '<pattern id="tfPat" width="16" height="16" patternUnits="userSpaceOnUse"><rect width="16" height="16" fill="rgba(70,185,80,.5)"/><rect width="16" height="8" fill="rgba(120,220,120,.2)"/></pattern></defs>';
}

/* ---------- dual viewers ---------- */
function makeViewer(prefix){
  var stage = $('stage'+prefix), world = $('world'+prefix), photoEl = $('photo'+prefix), bgb = $('bgb'+prefix), zLabel = $('zLabel'+prefix);
  var V = {k:1, tx:0, ty:0, fit:1};
  function applyView(){
    world.style.transform = 'translate('+V.tx.toFixed(1)+'px,'+V.ty.toFixed(1)+'px) scale('+V.k.toFixed(4)+')';
    zLabel.textContent = Math.round(V.k/V.fit*100)+'%';
  }
  function stageSize(){return {w:stage.clientWidth, h:stage.clientHeight};}
  function fitView(){
    var z=stageSize(); V.fit = Math.min(z.w/W, z.h/H); V.k=V.fit; V.tx=(z.w-W*V.k)/2; V.ty=(z.h-H*V.k)/2; applyView();
  }
  function focusView(){
    var ph = curPhoto(); fitView();
    if(ph.focus){ var z=stageSize(); V.k = V.fit*ph.focus[2]; V.tx = z.w/2 - ph.focus[0]*W*V.k; V.ty = z.h/2 - ph.focus[1]*H*V.k; applyView(); }
  }
  function zoomAt(f, px, py){
    var nk = Math.max(V.fit*0.7, Math.min(V.fit*10, V.k*f)); f = nk/V.k;
    V.tx = px - (px-V.tx)*f; V.ty = py - (py-V.ty)*f; V.k = nk; applyView();
  }
  function toImg(ev){
    var r = stage.getBoundingClientRect();
    return {x:(ev.clientX-r.left-V.tx)/V.k, y:(ev.clientY-r.top-V.ty)/V.k};
  }
  stage.addEventListener('wheel', function(e){
    e.preventDefault(); var r=stage.getBoundingClientRect();
    zoomAt(e.deltaY<0?1.15:1/1.15, e.clientX-r.left, e.clientY-r.top);
  },{passive:false});
  var ptrs = {}, drag = null, pinch = null;
  stage.addEventListener('pointerdown', function(e){
    if(e.target.closest && e.target.closest('.pin')) return; /* pins handle their own clicks */
    stage.setPointerCapture && stage.setPointerCapture(e.pointerId);
    ptrs[e.pointerId] = {x:e.clientX, y:e.clientY};
    var ids = Object.keys(ptrs);
    if(ids.length===2){
      var a=ptrs[ids[0]], b=ptrs[ids[1]];
      pinch = {d:Math.hypot(a.x-b.x,a.y-b.y)}; drag=null; return;
    }
    var g = e.target.closest && e.target.closest('.ovg');
    if(g && prefix==='Cre'){
      var o = g.getAttribute('data-opt'); S.sel = o; renderOpts(); renderPins();
      var ph=curPhoto(), cur=getOv(S.area, ph, o), p=toImg(e);
      drag = {type:'ov', o:o, dx:cur.x*W-p.x, dy:cur.y*H-p.y};
    } else {
      drag = {type:'pan', sx:e.clientX, sy:e.clientY, tx:V.tx, ty:V.ty}; stage.classList.add('pan');
    }
  });
  stage.addEventListener('pointermove', function(e){
    if(ptrs[e.pointerId]) ptrs[e.pointerId] = {x:e.clientX, y:e.clientY};
    var ids = Object.keys(ptrs);
    if(pinch && ids.length>=2){
      var a=ptrs[ids[0]], b=ptrs[ids[1]], d=Math.hypot(a.x-b.x,a.y-b.y), r=stage.getBoundingClientRect();
      zoomAt(d/pinch.d, (a.x+b.x)/2-r.left, (a.y+b.y)/2-r.top); pinch.d=d; return;
    }
    if(!drag) return;
    if(drag.type==='pan'){ V.tx = drag.tx + (e.clientX-drag.sx); V.ty = drag.ty + (e.clientY-drag.sy); applyView(); }
    else if(prefix==='Cre'){
      var p=toImg(e), ph=curPhoto();
      setOv(S.area, ph, drag.o, {x:Math.max(0,Math.min(1,(p.x+drag.dx)/W)), y:Math.max(0,Math.min(1,(p.y+drag.dy)/H)), on:true});
      renderOverlays(); save();
    }
  });
  function endPtr(e){delete ptrs[e.pointerId]; if(Object.keys(ptrs).length<2) pinch=null; if(Object.keys(ptrs).length===0){drag=null; stage.classList.remove('pan');}}
  stage.addEventListener('pointerup', endPtr); stage.addEventListener('pointercancel', endPtr);
  stage.addEventListener('dblclick', function(e){ if(e.target.closest&&e.target.closest('.pin')) return; var r=stage.getBoundingClientRect(); zoomAt(1.8, e.clientX-r.left, e.clientY-r.top);});
  return {V:V, stage:stage, world:world, photoEl:photoEl, bgb:bgb, fitView:fitView, focusView:focusView, zoomAt:zoomAt, applyView:applyView, stageSize:stageSize};
}
var liveV = makeViewer('Live');
var creV = makeViewer('Cre');

document.querySelectorAll('[data-z]').forEach(function(btn){
  btn.onclick = function(){
    var v = btn.getAttribute('data-viewer')==='live' ? liveV : creV;
    var z = v.stageSize();
    var op = btn.getAttribute('data-z');
    if(op==='in') v.zoomAt(1.3,z.w/2,z.h/2);
    else if(op==='out') v.zoomAt(1/1.3,z.w/2,z.h/2);
    else if(op==='fit') v.fitView();
    else v.focusView();
  };
});
window.addEventListener('resize', function(){
  if(S.tab==='live') liveV.focusView();
  if(S.tab==='creative') creV.focusView();
});

/* ---------- Squad ---------- */
function renderSquad(){
  var box=$('squad'); box.innerHTML='';
  Y.squad.forEach(function(m){
    box.appendChild(el('div',{class:'squad-slot', title:m.name+' — emoji placeholder only'},
      '<span class="em" aria-hidden="true">'+m.emoji+'</span><span class="nm">'+esc(m.name)+'</span>'));
  });
}

/* ---------- areas / photos ---------- */
function renderAreas(boxId, mode){
  var box = $(boxId); box.innerHTML='';
  Y.areas.forEach(function(a){
    var b = el('button',{class:'acard'+(a.id===S.area?' on':''), 'data-area':a.id, type:'button'},
      '<img src="'+photoSrc(a.thumb)+'" alt=""><span class="t"><span class="n">'+a.n+'</span>'+esc(a.name)+'</span>');
    b.onclick = function(){selectArea(a.id);};
    box.appendChild(b);
  });
}
function selectArea(id, photoIndex){
  if(!areasById[id]) return;
  S.area = id; if(photoIndex!=null) S.photoIdx[id]=photoIndex;
  S.sel=null; S.spot=null; S.opt=null; S.variant=null;
  renderAreas('areasLive'); renderAreas('areasCreative');
  renderLive(); renderCreative(); save();
}
function selectPhoto(i){
  S.photoIdx[S.area]=i; S.sel=null; S.spot=null; S.opt=null; S.variant=null;
  renderLive(); renderCreative(); save();
}

function renderLive(){
  var a=curArea(), ph=curPhoto();
  var idx = a.photos.indexOf(ph);
  $('vAreaLive').textContent = a.n+'. '+a.name;
  $('vCapLive').textContent = '\u00b7 '+Y.photos[ph.id].cap;
  $('aNameLive').textContent = a.n+'. '+a.name;
  $('aSeenLive').innerHTML = a.seen.map(function(t){return '<li>'+esc(t)+'</li>';}).join('');
  $('aUpLive').innerHTML = a.upgrades.map(function(t){return '<li>'+esc(t)+'</li>';}).join('');
  $('heatTip').textContent = Y.meta.climate;
  var th=$('thumbsLive'); th.innerHTML='';
  a.photos.forEach(function(p,i){
    var b=el('button',{class:i===idx?'on':'', type:'button', title:Y.photos[p.id].cap},'<img src="'+photoSrc(p.id)+'" alt="">');
    b.onclick=function(){selectPhoto(i);}; th.appendChild(b);
  });
  var src = photoSrc(ph.id);
  liveV.photoEl.onload = function(){ if(S.tab==='live') liveV.focusView(); };
  if(liveV.photoEl.getAttribute('src')!==src) liveV.photoEl.setAttribute('src', src);
  liveV.bgb.style.backgroundImage='url("'+src+'")';
  if(S.tab==='live') liveV.focusView();
}

function renderCreative(){
  var a=curArea(), ph=curPhoto();
  var idx = a.photos.indexOf(ph);
  $('vAreaCre').textContent = a.n+'. '+a.name;
  $('vCapCre').textContent = '\u00b7 '+Y.photos[ph.id].cap;
  $('aNameCre').textContent = a.n+'. '+a.name;
  $('aUpCre').innerHTML = a.upgrades.map(function(t){return '<li>'+esc(t)+'</li>';}).join('');
  var rows='<tr><th>Phase</th><th>A</th><th>B</th><th>C</th></tr>';
  a.phases.forEach(function(p){var q=Y.phases[p]; if(!q) return; rows+='<tr><td>'+esc(q.name)+'</td><td>'+range(q.A)+'</td><td>'+range(q.B)+'</td><td>'+range(q.C)+'</td></tr>';});
  $('costTbl').innerHTML = rows;
  $('opacity').value = S.opacity;
  var th=$('thumbsCre'); th.innerHTML='';
  a.photos.forEach(function(p,i){
    var b=el('button',{class:i===idx?'on':'', type:'button', title:Y.photos[p.id].cap},'<img src="'+photoSrc(p.id)+'" alt="">');
    b.onclick=function(){selectPhoto(i);}; th.appendChild(b);
  });
  var src = photoSrc(ph.id);
  creV.photoEl.onload = function(){ if(S.tab==='creative') creV.focusView(); };
  if(creV.photoEl.getAttribute('src')!==src) creV.photoEl.setAttribute('src', src);
  creV.bgb.style.backgroundImage='url("'+src+'")';
  if(S.tab==='creative') creV.focusView();
  renderPins(); renderOverlays(); renderOpts(); renderSpotPanel();
}

function renderPins(){
  var ph=curPhoto(), box=$('pins'); box.innerHTML='';
  var spots = ph.spots || [];
  spots.forEach(function(sp){
    var on = S.spot===sp.id;
    var b = el('button',{class:'pin'+(on?' on':''), type:'button', style:'left:'+(sp.x*100)+'%;top:'+(sp.y*100)+'%', title:sp.label});
    b.innerHTML = '<span class="dot"></span><span class="lab">'+esc(sp.label)+'</span>';
    b.onclick = function(e){ e.stopPropagation(); S.spot=sp.id; S.opt=null; S.variant=null; S.sel=null; renderPins(); renderSpotPanel(); renderOpts(); };
    box.appendChild(b);
  });
}

function renderSpotPanel(){
  var ph=curPhoto(), panel=$('spotPanel');
  var spots = ph.spots || [];
  var sp = null; for(var i=0;i<spots.length;i++) if(spots[i].id===S.spot) sp=spots[i];
  if(!sp){ panel.hidden=true; $('variantBox').hidden=true; return; }
  panel.hidden=false;
  $('spotTitle').textContent = 'Hotspot · '+sp.label;
  $('spotHint').textContent = 'Tap an upgrade, pick a variant, then Apply. Costs are estimates only.';
  var box=$('spotOpts'); box.innerHTML='';
  sp.opts.forEach(function(o){
    if(!Y.opts[o]) return;
    var m=Y.opts[o], v=getOv(S.area, ph, o);
    var row=el('div',{class:'opt'+(S.opt===o?' sel':'')+(v.on?' lit':'')});
    row.innerHTML='<span class="sw" style="background:'+m.color+'"></span><span class="nm">'+esc(m.name)+(v.on?' \u2713':'')+'</span>';
    row.onclick=function(){ S.opt=o; S.variant = v.variant || (m.variants&&m.variants[0]?m.variants[0].id:null); renderSpotPanel(); };
    box.appendChild(row);
  });
  renderVariantBox();
}

function renderVariantBox(){
  var vb=$('variantBox'), o=S.opt, ph=curPhoto();
  if(!o || !Y.opts[o]){ vb.hidden=true; return; }
  var m=Y.opts[o]; vb.hidden=false;
  $('varName').textContent = m.name;
  $('varNote').textContent = m.note + ' Concept art, not to scale.';
  var list=$('varList'); list.innerHTML='';
  if(m.variants && m.variants.length){
    m.variants.forEach(function(vr){
      var row=el('div',{class:'var'+(S.variant===vr.id?' on':'')});
      row.innerHTML='<span>'+esc(vr.name)+'</span><span class="vc">'+range(vr.cost)+'</span>';
      row.onclick=function(){ S.variant=vr.id; renderVariantBox(); };
      list.appendChild(row);
    });
    var c = variantCost(o, S.variant); $('varCost').textContent = c ? range(c)+' EST.' : 'ESTIMATE';
  } else {
    list.innerHTML='<p class="mut small">Toggle on to place overlay.</p>';
    $('varCost').textContent='ESTIMATE';
  }
  var pl=$('varPlants');
  if(m.plants && m.plants.length){
    pl.hidden=false;
    pl.innerHTML='<b>AZ plant / grow ideas</b><ul>'+m.plants.map(function(p){return '<li>'+esc(p)+'</li>';}).join('')+'</ul>';
  } else pl.hidden=true;
}

$('varApply').onclick = function(){
  var o=S.opt; if(!o) return; var ph=curPhoto();
  var pos = (ph.ov && ph.ov[o]) ? ph.ov[o] : (function(){
    var spots=ph.spots||[]; for(var i=0;i<spots.length;i++) if(spots[i].id===S.spot) return [spots[i].x, spots[i].y, 0.4];
    return [0.5,0.55,0.4];
  })();
  /* ensure ov entry exists for drag/resize by writing into a synthetic cache via setOv */
  if(!ph.ov) ph.ov = {};
  if(!ph.ov[o]) ph.ov[o] = [pos[0], pos[1], pos[2]||0.4];
  setOv(S.area, ph, o, {on:true, x:pos[0], y:pos[1], s:(o==='tramp'?12:100), variant:S.variant||null});
  S.sel=o; renderOverlays(); renderOpts(); renderSpotPanel(); save();
};
$('varOff').onclick = function(){
  var o=S.opt; if(!o) return;
  setOv(S.area, curPhoto(), o, {on:false}); S.sel=null; renderOverlays(); renderOpts(); renderSpotPanel(); save();
};

function activeOptsOnPhoto(ph){
  var keys = {};
  if(ph.ov) Object.keys(ph.ov).forEach(function(o){keys[o]=1;});
  /* also any layout keys turned on */
  var st = S.layouts[keyOf(S.area, ph.id)]||{};
  Object.keys(st).forEach(function(o){ if(st[o]&&st[o].on) keys[o]=1; });
  return Object.keys(keys);
}

function renderOverlays(){
  var ph=curPhoto(), out=defs();
  activeOptsOnPhoto(ph).forEach(function(o){
    if(!Y.opts[o]) return;
    var v=getOv(S.area, ph, o); if(!v.on) return;
    var baseW = (ph.ov && ph.ov[o]) ? ph.ov[o][2]*W : 0.4*W;
    var s = (o==='tramp') ? baseW : baseW*v.s/100;
    out += '<g class="ovg ovl'+(S.sel===o?' sel':'')+'" data-opt="'+o+'">'+shape(o, v.x*W, v.y*H, s, ph.t||0.3, v.s, v.variant)+'</g>';
  });
  var ovSvg = $('ov');
  ovSvg.innerHTML = out; ovSvg.style.opacity = S.opacity/100;
  var g = ovSvg.querySelector('.ovg.sel');
  if(g){ try{ var bb=g.getBBox(); var r=document.createElementNS(NS,'rect'); r.setAttribute('x',bb.x-6); r.setAttribute('y',bb.y-6); r.setAttribute('width',bb.width+12); r.setAttribute('height',bb.height+12); r.setAttribute('fill','none'); r.setAttribute('stroke','#fff'); r.setAttribute('stroke-width','1.5'); r.setAttribute('stroke-dasharray','5 4'); r.setAttribute('vector-effect','non-scaling-stroke'); r.setAttribute('pointer-events','none'); ovSvg.appendChild(r);}catch(e){} }
}

function renderOpts(){
  var ph=curPhoto(), box=$('opts'); box.innerHTML='';
  var keys=activeOptsOnPhoto(ph).filter(function(o){return getOv(S.area,ph,o).on;});
  if(!keys.length){ box.innerHTML='<p class="mut small">No upgrades applied yet. Tap a hotspot pin on the photo.</p>'; $('selBox').hidden=true; return; }
  keys.forEach(function(o){
    var v=getOv(S.area, ph, o), m=Y.opts[o];
    var extra = v.variant ? ' · '+variantName(o,v.variant) : '';
    var cost = v.variant ? variantCost(o,v.variant) : null;
    var row=el('div',{class:'opt'+(S.sel===o?' sel':'')});
    row.innerHTML='<input type="checkbox" checked><span class="sw" style="background:'+m.color+'"></span><span class="nm">'+esc(m.name+extra)+'</span>'+(cost?'<span class="cost">'+range(cost)+'</span>':'');
    var cb=row.querySelector('input');
    cb.onchange=function(){ setOv(S.area, ph, o, {on:cb.checked}); if(!cb.checked && S.sel===o) S.sel=null; renderOpts(); renderOverlays(); renderSpotPanel(); save(); };
    row.onclick=function(e){ if(e.target===cb) return; S.sel=o; S.opt=o; S.variant=v.variant; renderOpts(); renderOverlays(); renderSpotPanel(); };
    box.appendChild(row);
  });
  var sb=$('selBox'), o=S.sel;
  if(o && getOv(S.area, ph, o).on){
    var v2=getOv(S.area, ph, o), sl=$('selSize'); sb.hidden=false;
    $('selName').textContent = Y.opts[o].name + (v2.variant?' · '+variantName(o,v2.variant):'');
    if(o==='tramp'){ sl.min=10; sl.max=14; sl.step=0.5; sl.value=v2.s; $('selVal').textContent=v2.s+' ft \u2192 '+(v2.s+12)+' ft zone'; }
    else { sl.min=30; sl.max=250; sl.step=5; sl.value=v2.s; $('selVal').textContent=Math.round(v2.s)+'%'; }
    $('selNote').textContent = Y.opts[o].note + ' Concept art, not to scale.';
  } else sb.hidden=true;
}

$('selSize').oninput = function(){
  var o=S.sel; if(!o) return; var ph=curPhoto(); var v=parseFloat(this.value);
  setOv(S.area, ph, o, {s:v, on:true});
  $('selVal').textContent = o==='tramp' ? v+' ft \u2192 '+(v+12)+' ft zone' : Math.round(v)+'%';
  renderOverlays(); save();
};
$('selReset').onclick = function(){
  var o=S.sel; if(!o) return; var ph=curPhoto();
  var d = (ph.ov&&ph.ov[o])||[0.5,0.55,0.4];
  setOv(S.area, ph, o, {x:d[0], y:d[1], s:(o==='tramp'?12:100)}); renderOpts(); renderOverlays(); save();
};
$('selOff').onclick = function(){var o=S.sel; if(!o) return; setOv(S.area, curPhoto(), o, {on:false}); S.sel=null; renderOpts(); renderOverlays(); renderSpotPanel(); save();};
$('opacity').oninput = function(){S.opacity=+this.value; $('ov').style.opacity=S.opacity/100; save();};
$('toCreative').onclick = function(){showTab('creative');};

/* ---------- map / blueprint ---------- */
function buildMap(){
  var seg=$('mapSeg'); seg.innerHTML='';
  ['A','B','C'].forEach(function(k){
    var b=el('button',{class:k===S.map?'on':'', type:'button'},'Option '+k); b.onclick=function(){S.map=k; buildMap();}; seg.appendChild(b);
  });
  $('mapImg').src = Y.maps[S.map]; $('mapTitle').textContent = Y.mapTitle[S.map];
  var m=$('map'); Array.prototype.slice.call(m.querySelectorAll('.hs')).forEach(function(n){m.removeChild(n);});
  Y.hot.forEach(function(h){
    var a=areasById[h.area], r=h.r;
    var d=el('div',{class:'hs', title:a.name, role:'button', tabindex:'0', 'data-area':a.id});
    d.style.left=(r[0]/Y.mapW*100)+'%'; d.style.top=(r[1]/Y.mapH*100)+'%'; d.style.width=((r[2]-r[0])/Y.mapW*100)+'%'; d.style.height=((r[3]-r[1])/Y.mapH*100)+'%';
    d.innerHTML='<b>'+a.n+'</b><i>'+esc(a.n+'. '+a.name)+' \u2192 LIVE</i>';
    d.onclick=function(){showTab('live'); selectArea(a.id, 0);};
    d.onkeydown=function(e){if(e.key==='Enter'||e.key===' ') d.onclick();};
    m.appendChild(d);
  });
}

/* ---------- ground cover ---------- */
function groundById(id){ for(var i=0;i<Y.ground.length;i++) if(Y.ground[i].id===id) return Y.ground[i]; return Y.ground[0]; }
function renderGround(){
  $('groundNote').textContent = Y.meta.groundSqFtNote + ' Verified-ish 2026 Phoenix/Peoria web ranges where noted; still ESTIMATES, not quotes.';
  $('groundSqFt').value = S.groundSqFt;
  var tbl=$('groundTbl');
  var head = '<tr><th>Option</th><th>$ / sq ft <span class="tag">EST.</span></th><th>AZ heat</th><th>Dog waste cleanup</th><th>Water</th><th>Pros</th><th>Cons</th><th></th></tr>';
  var body = Y.ground.map(function(g){
    var pick = g.id===S.groundId;
    return '<tr class="'+(pick?'pick':'')+'">'+
      '<td><b>'+esc(g.name)+'</b></td>'+
      '<td>'+range(g.costSf)+'</td>'+
      '<td>'+esc(g.heat)+'</td>'+
      '<td>'+esc(g.cleanup)+'</td>'+
      '<td>'+esc(g.water)+'</td>'+
      '<td><ul>'+g.pros.map(function(p){return '<li>'+esc(p)+'</li>';}).join('')+'</ul></td>'+
      '<td><ul>'+g.cons.map(function(p){return '<li>'+esc(p)+'</li>';}).join('')+'</ul></td>'+
      '<td><button type="button" class="pickbtn'+(pick?' pri':'')+'" data-g="'+g.id+'">'+(pick?'Selected':'Select')+'</button></td></tr>';
  }).join('');
  tbl.innerHTML = head+body;
  Array.prototype.forEach.call(tbl.querySelectorAll('[data-g]'), function(btn){
    btn.onclick=function(){ S.groundId=btn.getAttribute('data-g'); renderGround(); save(); };
  });
  var seg=$('groundSeg'); seg.innerHTML='';
  Y.ground.forEach(function(g){
    var b=el('button',{class:g.id===S.groundId?'on':'', type:'button'}, g.name);
    b.onclick=function(){S.groundId=g.id; renderGround(); save();};
    seg.appendChild(b);
  });
  renderGroundTotal();
}
function renderGroundTotal(){
  var g=groundById(S.groundId), sf=S.groundSqFt;
  var low=g.costSf[0]*sf, high=g.costSf[1]*sf;
  $('groundTotal').innerHTML = '<b>'+esc(g.name)+'</b> · ~'+sf.toLocaleString('en-US')+' sq ft · rough total <b>'+range([low,high])+'</b> <span class="tag">ESTIMATE</span><br><span class="mut small">Install only; excludes permits, demo surprises, shade structures, and ongoing water/mowing.</span>';
}
$('groundSqFt').onchange = $('groundSqFt').oninput = function(){
  S.groundSqFt = Math.max(200, Math.min(8000, +this.value||2200));
  renderGroundTotal(); save();
};

/* ---------- layout / export ---------- */
function chosen(){
  var out=[];
  Y.areas.forEach(function(a){ a.photos.forEach(function(ph){
    var st=S.layouts[keyOf(a.id,ph.id)]; if(!st) return;
    Object.keys(st).forEach(function(o){
      if(!Y.opts[o]) return; var v=getOv(a.id, ph, o); if(!v.on) return;
      var item={area:a.id, areaName:a.name, photo:ph.id, option:o, name:Y.opts[o].name, x:+v.x.toFixed(4), y:+v.y.toFixed(4), size:+v.s, sizeUnit:(o==='tramp'?'ft diameter':'percent of default'), clearZoneFt: o==='tramp'?6:undefined, variant:v.variant||null, variantName:v.variant?variantName(o,v.variant):null, variantCost:v.variant?variantCost(o,v.variant):null};
      out.push(item);
    });
  });});
  return out;
}
function tally(list){
  var used={}, low=0, high=0, rows=[];
  var variantLow=0, variantHigh=0, varRows=[];
  list.forEach(function(c){
    var m=Y.opts[c.option];
    if(c.variantCost){ variantLow+=c.variantCost[0]; variantHigh+=c.variantCost[1]; varRows.push({name:c.name+(c.variantName?' · '+c.variantName:''), low:c.variantCost[0], high:c.variantCost[1]}); }
    else if(m.phase && Y.phases[m.phase] && (Y.phases[m.phase][m.pick]||Y.phases[m.phase].C||Y.phases[m.phase].A)) used[m.phase]=m.pick||'C';
  });
  Object.keys(used).forEach(function(p){
    var ph=Y.phases[p], r=ph[used[p]] || ph.C || ph.A || ph.B;
    if(r){low+=r[0]; high+=r[1]; rows.push({phase:p, name:ph.name, option:used[p], low:r[0], high:r[1]});}
  });
  var g=groundById(S.groundId);
  var gLow=g.costSf[0]*S.groundSqFt, gHigh=g.costSf[1]*S.groundSqFt;
  return {rows:rows, varRows:varRows, low:low+variantLow+gLow, high:high+variantHigh+gHigh, ground:{name:g.name, low:gLow, high:gHigh, sqft:S.groundSqFt}};
}
function exportObj(){
  var list=chosen(), t=tally(list);
  return {
    app:'PathStudio Yard', version:2, exportedAt:new Date().toISOString(),
    property:Y.meta.property,
    source:'Frames from Jul 25, 2026 walkthrough video. Overlays are concept art, not to scale.',
    disclaimer:'All costs are planning ESTIMATES (incl. 2026 Phoenix/Peoria web ranges for ground cover), not quotes.',
    climate:Y.meta.climate,
    choices:list,
    groundCover:{id:S.groundId, name:groundById(S.groundId).name, sqFt:S.groundSqFt, estimateUSD:[t.ground.low, t.ground.high]},
    phasesNeeded:t.rows,
    creativeVariants:t.varRows,
    roughTotalUSD:{low:t.low, high:t.high, note:'Phases once + variant estimates + ground cover; estimate only.'},
    state:dataObj()
  };
}
function renderLayout(){
  var list=chosen(), box=$('summary');
  if(!list.length){ box.innerHTML='<p class="mut">Nothing selected yet. Tap hotspots in Creative Studio.</p>'; }
  else {
    var by={}; list.forEach(function(c){(by[c.areaName]=by[c.areaName]||[]).push(c);});
    box.innerHTML = Object.keys(by).map(function(n){
      return '<h4>'+esc(n)+'</h4><ul>'+by[n].map(function(c){
        return '<li>'+esc(c.name)+(c.variantName?' · '+esc(c.variantName):'')+' <span class="mut small">on '+c.photo+(c.variantCost?' · '+range(c.variantCost):'')+'</span></li>';
      }).join('')+'</ul>';
    }).join('');
  }
  var t=tally(list), h='<table class="tally">';
  t.rows.forEach(function(r){h+='<tr><td>'+esc(r.name)+' <span class="mut small">(Option '+r.option+')</span></td><td>'+range([r.low,r.high])+'</td></tr>';});
  t.varRows.forEach(function(r){h+='<tr><td>'+esc(r.name)+' <span class="mut small">(Creative)</span></td><td>'+range([r.low,r.high])+'</td></tr>';});
  h+='<tr><td>Ground cover · '+esc(t.ground.name)+' <span class="mut small">(~'+t.ground.sqft.toLocaleString()+' sq ft)</span></td><td>'+range([t.ground.low,t.ground.high])+'</td></tr>';
  h+= '<tr class="tot"><td>Rough total (estimate)</td><td>'+range([t.low,t.high])+'</td></tr>';
  $('tally').innerHTML = h+'</table>';
  $('jsonPre').textContent = JSON.stringify(exportObj(), null, 2);
}
$('bSave').onclick = function(){save(true);};
$('bExport').onclick = function(){
  var blob=new Blob([JSON.stringify(exportObj(),null,2)],{type:'application/json'});
  var a=document.createElement('a'); a.href=URL.createObjectURL(blob); var dn=new Date(); a.download='yard-layout-'+dn.getFullYear()+'-'+('0'+(dn.getMonth()+1)).slice(-2)+'-'+('0'+dn.getDate()).slice(-2)+'.json';
  document.body.appendChild(a); a.click(); setTimeout(function(){URL.revokeObjectURL(a.href); a.remove();},500); setStatus('Exported JSON');
};
$('bCopy').onclick = function(){
  var txt=JSON.stringify(exportObj(),null,2);
  function fb(){var ta=document.createElement('textarea'); ta.value=txt; document.body.appendChild(ta); ta.select(); try{document.execCommand('copy'); setStatus('JSON copied');}catch(e){setStatus('Copy failed — use Export',true);} ta.remove();}
  if(navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(function(){setStatus('JSON copied');}, fb); else fb();
};
$('bImport').onclick = function(){$('fImport').click();};
$('fImport').onchange = function(){
  var f=this.files[0]; if(!f) return; var r=new FileReader();
  r.onload=function(){ try{ var d=JSON.parse(r.result); applyData(d.state||d); S.sel=null; S.spot=null; renderAreas('areasLive'); renderAreas('areasCreative'); renderLive(); renderCreative(); renderGround(); save(true); setStatus('Imported'); }catch(e){ setStatus('Import failed: not a Yard JSON',true);} };
  r.readAsText(f); this.value='';
};
$('bClear').onclick = function(){ if(!confirm('Clear all saved Yard choices?')) return; S.layouts={}; S.variants={}; S.sel=null; S.spot=null; S.opt=null; renderCreative(); renderGround(); save(true); };

/* ---------- tabs ---------- */
function showTab(t){
  S.tab=t;
  Array.prototype.forEach.call(document.querySelectorAll('.tab'), function(b){b.classList.toggle('on', b.getAttribute('data-tab')===t);});
  ['live','blueprint','creative'].forEach(function(n){$('tab-'+n).classList.toggle('on', n===t);});
  if(t==='live') setTimeout(function(){liveV.focusView();}, 0);
  if(t==='creative'){ setTimeout(function(){creV.focusView();}, 0); renderLayout(); }
  if(t==='blueprint') buildMap();
}
Array.prototype.forEach.call(document.querySelectorAll('.tab'), function(b){b.onclick=function(){showTab(b.getAttribute('data-tab'));};});

/* ---------- init ---------- */
load();
var hq={}; location.hash.replace(/^#/,'').split('&').forEach(function(kv){var p=kv.split('='); if(p[0]) hq[p[0]]=decodeURIComponent(p[1]||'');});
if(hq.a && areasById[hq.a]) S.area=hq.a;
if(hq.p!=null && hq.p!=='') S.photoIdx[S.area]=+hq.p||0;
if(hq.opt && Y.maps[hq.opt]) S.map=hq.opt;
renderSquad();
renderAreas('areasLive'); renderAreas('areasCreative');
buildMap(); renderLive(); renderCreative(); renderGround(); renderLayout();
showTab(hq.tab||'live');
if(persist && !localStorage.getItem(KEY)) setStatus('Private · nothing saved yet');
})();
