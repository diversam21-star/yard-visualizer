/* PathStudio · Yard — data. Costs are ESTIMATES (planning ranges), not quotes. Peoria AZ. */
window.YARD = {};
YARD.W = 810; YARD.H = 1440;
YARD.meta = {
  property: 'Private residence, Peoria AZ',
  climate: 'Peoria AZ · summer extreme heat (often 110°F+); nicer weather now for hangouts. Shade + cool paws matter for kids and 4 dogs.',
  backyardDepthFt: 42,
  groundDefaultSqFt: 2200,
  groundSqFtNote: 'Rough open-dirt backyard area (~42 ft deep lot notes). Adjust the sq ft slider — estimate only, not a survey.'
};

YARD.squad = [
  {id:'owner', name:'Owner', emoji:'🧔'},
  {id:'guest1', name:'Guest', emoji:'🧑'},
  {id:'guest2', name:'Guest', emoji:'🧒'}
];

YARD.photos = {
  p_01: {file:'p_01.jpg', cap:'Stucco wall, agave and bikes along the wall (video 0:01)'},
  p_02: {file:'p_02.jpg', cap:'Shade-cloth panel overhead; paver pieces and gate beyond (0:04)'},
  p_03: {file:'p_03.jpg', cap:'Gazebo-type canopy, black iron + wood-slat gate (0:07)'},
  p_04: {file:'p_04.jpg', cap:'Black metal post, iron trellis, stucco planter wall with pots (0:09)'},
  p_05: {file:'p_05.jpg', cap:'Shade cloth over the floor; dumbbells and bar (0:12)'},
  p_06: {file:'p_06.jpg', cap:'Lounger on the slab; bougainvillea beyond the wall (0:14)'},
  p_07: {file:'p_07.jpg', cap:'Block-wall corner, stacked pavers, wire pot stands (0:17)'},
  p_08: {file:'p_08.jpg', cap:'Pink bougainvillea, stacked pavers/flagstone, pots on stands (0:19)'},
  p_09: {file:'p_09.jpg', cap:'Pomegranate-type tree with wire cage; cream wood shed (0:22)'},
  p_10: {file:'p_10.jpg', cap:'Open dirt yard: small white statue, tree, brick edging (0:25)'},
  p_11: {file:'p_11.jpg', cap:'Long concrete walk, ponded water, weeds along the edge (0:27)'},
  p_12: {file:'p_12.jpg', cap:'Walk, toy car, kids\u2019 hoop on black base, white bucket (0:30)'},
  p_13: {file:'p_13.jpg', cap:'Patio: tile-top table and iron chairs, French doors (0:33)'},
  p_14: {file:'p_14.jpg', cap:'Patio edge, iron gate, oleander (0:35)'},
  p_15: {file:'p_15.jpg', cap:'Bare dirt corner with brick edging and shrubs (0:38)'},
  p_16: {file:'p_16.jpg', cap:'Oleander hedge and brick-edged dirt (0:40)'},
  p_17: {file:'p_17.jpg', cap:'Iron + wood-slat gate, close up (0:43)'},
  p_18: {file:'p_18.jpg', cap:'Gate gap with red pavers beyond (0:45)'},
  p_19: {file:'p_19.jpg', cap:'South / sunny side yard: red molded pavers, ladder by the wall (0:48)'},
  p_20: {file:'p_20.jpg', cap:'South / sunny side yard: stucco wall with river-rock strip (0:51)'},
  x_bougain: {file:'x_bougain.jpg', cap:'Bougainvillea over low brick edging, shed behind (0:20)'},
  x_statue:  {file:'x_statue.jpg',  cap:'Statue in the middle of the dirt yard, tree and shed-side hedge (0:24)'},
  x_walk:    {file:'x_walk.jpg',    cap:'Walk with weeds and loose flagstone, toy car far end (0:26)'},
  x_patio:   {file:'x_patio.jpg',   cap:'Lounger on the patio, planter wall (0:16)'}
};

/* ---------- upgrade catalog (Creative Studio) ---------- */
YARD.opts = {
  /* existing blueprint overlays */
  sail:    {name:'Shade sail', color:'#6cc0ff', phase:'sail', pick:'C', kind:'overlay',
            note:'Sails + posts; check Peoria code Sec. 21-315 before posts.'},
  bed:     {name:'Raised bed', color:'#c98a4b', phase:'beds', pick:'A', kind:'overlay',
            note:'Wood/block bed, soil, drip.'},
  hydro:   {name:'Hydroponic rack', color:'#4fd1a5', phase:'hydro', pick:'A', kind:'overlay',
            note:'Needs GFCI power, shade cloth, reservoir top-off.'},
  tramp:   {name:'Trampoline + 6 ft clear zone', color:'#ff6b6b', phase:'tramp', pick:'C', kind:'overlay',
            note:'Footprint outline only. 12 ft is the safest fit; 14 ft does not clear.'},
  lane:    {name:'Catch lane (21 \u00d7 7.5 ft)', color:'#7ee081', phase:'turf', pick:'C', kind:'overlay',
            note:'Short flag-football lane; sloped concrete walk beside it.'},
  turf:    {name:'Turf strip', color:'#5fc46b', phase:'turf', pick:'C', kind:'overlay',
            note:'Turf needs a base + irrigation on bare dirt.'},
  pavers:  {name:'Pavers remodel', color:'#d9a07a', phase:'pavers', pick:'C', kind:'overlay',
            note:'ESTIMATE: Phoenix paver patio ~$14\u2013$28/sq ft installed (2026 guides). Path strips cost less.'},
  fountain:{name:'Fountain around statue', color:'#4aa8ff', phase:'fountain', pick:'C', kind:'overlay',
            note:'Recirculating basin, shallow/covered for kids; needs GFCI outlet.'},
  ring:    {name:'Mulch + drip ring', color:'#b08a52', phase:'prep', pick:'C', kind:'overlay',
            note:'Drip ring beyond the drip line, keep water off the trunk.'},

  /* Creative Studio wall */
  wallPaint: {name:'Paint CMU wall', color:'#c4b5a0', phase:'wall', pick:'C', kind:'wall',
              note:'Prep + masonry paint. Keeps block; cool light colors help AZ heat.',
              variants:[
                {id:'sand', name:'Desert sand / warm beige', cost:[600,1600]},
                {id:'terracotta', name:'Soft terracotta', cost:[650,1700]},
                {id:'coolgray', name:'Cool light gray', cost:[600,1600]},
                {id:'whitewash', name:'Whitewash / lime look', cost:[700,1900]}
              ]},
  wallFace: {name:'Face / veneer CMU wall', color:'#a89880', phase:'wall', pick:'C', kind:'wall',
             note:'Stone or stucco veneer over existing block. Heavier + permits may apply.',
             variants:[
               {id:'stucco', name:'Stucco face (match house)', cost:[2500,6500]},
               {id:'cultured', name:'Cultured stone veneer', cost:[4000,11000]},
               {id:'thinbrick', name:'Thin brick veneer', cost:[3500,9000]}
             ]},
  wallReplace: {name:'Replace CMU wall section', color:'#8a7a68', phase:'wall', pick:'C', kind:'wall',
                note:'Demo + new masonry. Structural/neighbor/permit checks required. Big ticket.',
                variants:[
                  {id:'partial', name:'Partial rebuild (damaged runs)', cost:[4000,12000]},
                  {id:'fullside', name:'One full side (~rear run)', cost:[9000,22000]}
                ]},

  /* canopy */
  canopy: {name:'Canopy upgrade', color:'#8ec8ff', phase:'canopy', pick:'C', kind:'canopy',
           note:'Replace/upgrade existing gazebo-type canopy. Shade is the #1 summer comfort upgrade.',
           variants:[
             {id:'recloth', name:'Re-cloth existing frame (UV fabric)', cost:[250,700]},
             {id:'sailkit', name:'Add sail panels to frame', cost:[400,1200]},
             {id:'louver', name:'Louvered / adjustable roof insert', cost:[1800,4500]},
             {id:'insulated', name:'Insulated fabric top + side screens', cost:[900,2800]},
             {id:'hardtop', name:'Hardtop patio cover (permit likely)', cost:[3500,12000]}
           ]},

  /* water */
  waterWall: {name:'Water feature along wall', color:'#4aa8ff', phase:'water', pick:'C', kind:'water',
              note:'Recirculating wall spill / trough. GFCI + shallow design for kids + dogs.',
              variants:[
                {id:'spill', name:'Wall spill sheet (short run)', cost:[800,2500]},
                {id:'trough', name:'Low trough along wall', cost:[1200,3500]},
                {id:'bubbler', name:'Bubbler rocks + basin', cost:[600,1800]}
              ],
              plants:['Desert marigold','Angelita daisy','Red yucca (Hesperaloe)','Damianita','Trailing lantana (partial shade)','Agave (out of dog chew reach)']},
  waterPlanter: {name:'Water feature in built-in planter', color:'#5bc0de', phase:'water', pick:'C', kind:'water',
                 note:'Use the existing stucco planter as a basin or planted water pocket. Waterproof liner required.',
                 variants:[
                   {id:'pocket', name:'Planted water pocket (liner + pump)', cost:[500,1600]},
                   {id:'urn', name:'Urn fountain in planter', cost:[350,1100]},
                   {id:'drycreek', name:'Dry creek / rain accent (no pump)', cost:[200,800]}
                 ],
                 plants:['Arizona rosewood (hedge)', 'Texas sage', 'Firecracker penstemon', 'Pink muhly (accent)', 'Succulents in pots for summer move']},

  /* hangout */
  furniture: {name:'Furniture + seating', color:'#e0b070', phase:'hangout', pick:'C', kind:'hangout',
              note:'Powder-coat outdoor sets hold up better in Peoria UV.',
              variants:[
                {id:'bistro', name:'Bistro set (2\u20134 seats)', cost:[200,700]},
                {id:'lounge', name:'Lounge sofa + tables', cost:[800,2500]},
                {id:'dining', name:'Dining set for 6', cost:[600,2000]},
                {id:'kids', name:'Kid picnic table + benches', cost:[150,450]}
              ]},
  grill: {name:'Grill station', color:'#ff8a5c', phase:'hangout', pick:'C', kind:'hangout',
          note:'Keep grill off wood and away from canopy fabric. Propane or charcoal.',
          variants:[
            {id:'portable', name:'Portable gas grill', cost:[200,600]},
            {id:'cart', name:'Cart grill + side shelf', cost:[400,1200]},
            {id:'built', name:'Built-in grill island (big ticket)', cost:[2500,8000]}
          ]},
  lights: {name:'Hanging string lights', color:'#ffd76a', phase:'hangout', pick:'C', kind:'hangout',
           note:'Warm LED café lights for evening hangouts (cooler evenings now). GFCI outdoor circuit.',
           variants:[
             {id:'strand', name:'Simple strand over canopy / patio', cost:[80,250]},
             {id:'criss', name:'Criss-cross yard run', cost:[150,450]},
             {id:'festoon', name:'Festoon + dimmer + posts', cost:[300,900]}
           ]},

  /* shed */
  shed: {name:'Storage shed remodel', color:'#b0a090', phase:'shed', pick:'C', kind:'shed',
         note:'Lights inside; interior video may come later. Keep private — no people in assets.',
         variants:[
           {id:'led', name:'Interior LED + switch (solar or wired)', cost:[120,450]},
           {id:'shelves', name:'Shelves + hooks + floor mat', cost:[150,500]},
           {id:'paint', name:'Exterior refresh paint', cost:[200,600]},
           {id:'roof', name:'Roof / weather seal fix', cost:[300,1200]},
           {id:'full', name:'Full tidy remodel (light + shelves + paint)', cost:[500,2000]}
         ]},

  /* play / shade extras */
  hoop: {name:'Basketball hoop', color:'#ff9f43', phase:'play', pick:'C', kind:'play',
         note:'Portable base preferred on slab; permanent pole needs footing + clear zone.',
         variants:[
           {id:'portable', name:'Portable hoop (fill base)', cost:[150,450]},
           {id:'inground', name:'In-ground hoop', cost:[400,1200]}
         ]},
  umbrellas: {name:'Umbrellas / shade pods', color:'#7ec8ff', phase:'sail', pick:'C', kind:'play',
              note:'Quick shade for kids while bigger sails wait. Weight bases in monsoon season.',
              variants:[
                {id:'market', name:'Market umbrella + base', cost:[80,250]},
                {id:'cantilever', name:'Cantilever umbrella', cost:[250,700]},
                {id:'twin', name:'Twin umbrellas for play zone', cost:[160,500]}
              ]},
  westShade: {name:'West / sunny side-yard shade', color:'#6ad0c0', phase:'sail', pick:'C', kind:'play',
              note:'Brick paver side gets heavy sun. Priority shade for kids before peak summer returns.',
              variants:[
                {id:'sailnarrow', name:'Narrow shade sail over pavers', cost:[500,1600]},
                {id:'awning', name:'Wall awning / drop shade', cost:[400,1400]},
                {id:'vine', name:'Shade vines on trellis (seasonal)', cost:[150,600]},
                {id:'pergola', name:'Slim pergola run (permit check)', cost:[2000,7000]}
              ]},

  /* fix */
  window: {name:'Broken window replace', color:'#9aa8c0', phase:'fix', pick:'C', kind:'fix',
           note:'Fix item — replace broken pane/unit. Measure on site; dual-pane common on 1984 homes.',
           variants:[
             {id:'pane', name:'Single pane / glass only', cost:[150,450]},
             {id:'igunit', name:'Insulated glass unit (IGU)', cost:[350,900]},
             {id:'full', name:'Full sash / window unit', cost:[600,1800]}
           ]}
};

/* phase cost ranges — ESTIMATES */
YARD.phases = {
  prep:    {name:'Phase 1 · Prep, gravel paths, drip main + timer, tree basin', A:[1500,3500], B:[1800,4200], C:[1500,3800]},
  sail:    {name:'Phase 2 · Shade sails / umbrellas / side-yard shade', A:[1200,3500], B:[1500,4000], C:[1200,3500]},
  tramp:   {name:'Trampoline, net, anchors, mulch (A 13 ft · C 12 ft · none in B)', A:[700,2400], B:null, C:[550,2000]},
  fountain:{name:'Fountain basin, statue base, GFCI, benches, plants (B full · C compact)', A:null, B:[950,3500], C:[600,2200]},
  beds:    {name:'Raised beds + soil + drip (A: 3 beds · B/C: 2 beds + compact hydro)', A:[600,1700], B:[1000,2800], C:[900,2600]},
  hydro:   {name:'Hydro/aeroponic towers + reservoir + shade cloth (A; bundled with beds in B/C)', A:[700,2100], B:null, C:null},
  turf:    {name:'Turf catch strip / field + workout pad/gear', A:[1500,3600], B:[3000,7200], C:[1300,3600]},
  workout: {name:'Workout pad on slab + gear (B)', A:null, B:[300,1200], C:null},
  wall:    {name:'CMU wall paint / face / replace (Creative)', A:null, B:null, C:[600,22000]},
  canopy:  {name:'Canopy upgrade (Creative)', A:null, B:null, C:[250,12000]},
  water:   {name:'Water feature — wall or planter (Creative)', A:null, B:null, C:[200,3500]},
  hangout: {name:'Furniture + grill + string lights (Creative)', A:null, B:null, C:[280,3650]},
  shed:    {name:'Shed remodel + interior lights (Creative)', A:null, B:null, C:[120,2000]},
  play:    {name:'Hoop / play extras (Creative)', A:null, B:null, C:[150,1200]},
  pavers:  {name:'Pavers remodel (Creative; ~$14–$28/sq ft patio guides)', A:null, B:null, C:[800,6000]},
  fix:     {name:'Broken window replace (fix)', A:null, B:null, C:[150,1800]},
  ground:  {name:'Main-yard ground cover (selected)', A:null, B:null, C:null}
};

/* Ground cover comparison — 4 dogs + dirt/poop. Costs labeled ESTIMATE from 2026 Phoenix/Peoria guides. */
YARD.ground = [
  {id:'dirt', name:'Keep dirt / bare DG',
   costSf:[0, 0.5], water:'None (dust control optional)',
   heat:'Hot and dusty in summer; weeds after monsoon. Cooler evenings now are the easy hangout window.',
   cleanup:'Poop sits on dirt; urine soaks. Muddy paws after rain. Digging easy for dogs.',
   pros:['$0 install','No irrigation','Familiar to dogs now'],
   cons:['Dirt tracked indoors','Weeds','Looks unfinished','Dust in dry heat']},
  {id:'rock', name:'Rock / gravel / DG refresh',
   costSf:[1.5, 4], water:'None (occasional rinse)',
   heat:'Rock and dark gravel get very hot in direct Peoria sun. Prefer light buff DG + shade. Rounded pea gravel friendlier on paws than sharp crush.',
   cleanup:'Scoop waste ok; urine drains. Debris blows in — leaf blower. Weeds need fabric + pre-emergent.',
   pros:['Low water','Desert-native look','Durable','Cheaper than turf'],
   cons:['Hot underfoot mid-day','Can be hard on paws if sharp','Dogs may scatter rock','Not soft for kids play']},
  {id:'turf', name:'Artificial turf (pet-grade)',
   costSf:[7, 15], water:'No irrigation; hose rinse for odor',
   heat:'Can exceed 160°F+ in full summer sun unshaded. Needs shade sails + cooling rinse. Pet turf with good drainage/infill recommended for 4 dogs.',
   cleanup:'Scoop solids; rinse urine zones. Periodic enzyme sanitize. No mud — big win vs dirt.',
   pros:['No mud','Green look year-round','Good play surface','No mowing'],
   cons:['Highest install $','Hot without shade','Odor if drainage poor','Not usually rebate-eligible']},
  {id:'grass', name:'Real Bermuda grass',
   costSf:[1.5, 3.5], water:'High — ~1–1.5 in/week summer; winter rye if you want green',
   heat:'Living grass stays cooler than turf/rock when irrigated, but burns huge water in Peoria summers.',
   cleanup:'Scoop waste; urine spots brown. Muddy after rain. Digging destroys patches with 4 dogs.',
   pros:['Cooler when watered','Soft for kids','Lower install $ than turf'],
   cons:['High water bill','Mowing + fertilize','Brown spots from dogs','Overseed cost each winter']},
  {id:'hybrid', name:'Hybrid: light DG + turf play pads',
   costSf:[3, 9], water:'Low — drip only on plants; turf pads rinsed',
   heat:'Best compromise: turf only under sails / play zones; light DG elsewhere. Shade is still required for summer.',
   cleanup:'Scoop on both surfaces. Potty zone on DG or dedicated pee-pad turf with max drainage.',
   pros:['Balances cost + comfort','Targets soft play where kids need it','Lower water than full lawn'],
   cons:['Two surface types to maintain','Edges need good transitions','Still needs shade plan']}
];

/* areas. photos[].ov = overlay defaults; photos[].spots = Creative Studio hotspots {id,label,x,y,opts:[...]} */
YARD.areas = [
 {id:'north', n:1, name:'North side-yard canopy', thumb:'p_03',
  seen:['Gazebo-type canopy: tan fabric top, shade-cloth panels, black metal posts, concrete floor','Raised stucco planter wall with pots; iron trellis','Black iron + wood-slat gate','Agave and bikes along a stucco wall'],
  upgrades:['Upgrade canopy style','Water feature in built-in planter OR along wall','String lights for hangouts','Furniture + grill','Raised beds / hydro in shade'],
  phases:['canopy','water','hangout','sail','beds','hydro'],
  photos:[
   {id:'p_03', t:.3,
    ov:{sail:[.5,.28,.8], hydro:[.72,.68,.2], bed:[.3,.93,.45], canopy:[.5,.22,.85], waterPlanter:[.78,.78,.22], lights:[.5,.35,.7], furniture:[.45,.82,.4]},
    spots:[
     {id:'canopy', label:'Canopy', x:.50, y:.18, opts:['canopy','sail','lights']},
     {id:'planter', label:'Built-in planter', x:.82, y:.78, opts:['waterPlanter','bed','waterWall']},
     {id:'floor', label:'Hangout floor', x:.45, y:.85, opts:['furniture','grill','lights','pavers']}
    ]},
   {id:'p_04', t:.3,
    ov:{sail:[.5,.17,.8], hydro:[.82,.47,.18], bed:[.35,.92,.5], canopy:[.5,.14,.85], waterPlanter:[.75,.85,.25], lights:[.5,.3,.7]},
    spots:[
     {id:'canopy', label:'Canopy', x:.50, y:.12, opts:['canopy','sail','lights']},
     {id:'planter', label:'Planter wall', x:.70, y:.88, opts:['waterPlanter','bed','waterWall']},
     {id:'trellis', label:'Trellis / wall', x:.55, y:.45, opts:['wallPaint','wallFace']}
    ]},
   {id:'p_02', t:.3, ov:{sail:[.5,.28,.9], hydro:[.8,.76,.14], bed:[.45,.9,.5], canopy:[.5,.22,.9], lights:[.5,.32,.8]},
    spots:[{id:'canopy', label:'Shade cloth', x:.50, y:.22, opts:['canopy','sail','lights']}]},
   {id:'p_05', t:.3, ov:{sail:[.5,.3,.9], bed:[.6,.92,.5], furniture:[.5,.75,.45], grill:[.75,.8,.2]},
    spots:[{id:'floor', label:'Workout / hangout', x:.55, y:.80, opts:['furniture','grill','lights','pavers']}]},
   {id:'p_01', t:.3, ov:{hydro:[.8,.38,.22], bed:[.5,.72,.5], wallPaint:[.5,.4,.7]},
    spots:[{id:'wall', label:'Stucco / wall', x:.55, y:.35, opts:['wallPaint','wallFace','bed']}]}
  ]},
 {id:'bougain', n:2, name:'Bougainvillea corner', thumb:'p_08',
  seen:['Pink bougainvillea on a gray concrete-block wall','Stacked pavers / flagstone, wire pot stands, white pots','Low brick edging along the dirt'],
  upgrades:['Paint / face / replace CMU wall','Pavers remodel','Water feature along wall','Raised bed / hydro'],
  phases:['wall','pavers','water','sail','beds','hydro','prep'],
  photos:[
   {id:'x_bougain', t:.3,
    ov:{bed:[.62,.8,.5], hydro:[.88,.62,.16], sail:[.7,.25,.6], pavers:[.65,.92,.6], wallPaint:[.55,.35,.7], waterWall:[.55,.55,.5]},
    spots:[
     {id:'wall', label:'CMU wall', x:.50, y:.30, opts:['wallPaint','wallFace','wallReplace','waterWall']},
     {id:'pavers', label:'Stacked stone', x:.65, y:.88, opts:['pavers','bed']},
     {id:'edge', label:'Brick edge', x:.40, y:.75, opts:['bed','pavers']}
    ]},
   {id:'p_08', t:.3,
    ov:{bed:[.5,.92,.45], hydro:[.15,.6,.18], sail:[.5,.15,.8], pavers:[.5,.8,.5], wallPaint:[.55,.4,.75], waterWall:[.55,.55,.55]},
    spots:[
     {id:'wall', label:'CMU + bougainvillea', x:.55, y:.35, opts:['wallPaint','wallFace','wallReplace','waterWall']},
     {id:'ground', label:'Pavers / beds', x:.50, y:.85, opts:['pavers','bed','hydro']}
    ]},
   {id:'p_07', t:.3, ov:{bed:[.65,.9,.5], hydro:[.3,.5,.16], sail:[.5,.15,.7], wallPaint:[.6,.35,.6]},
    spots:[{id:'corner', label:'Block corner', x:.55, y:.40, opts:['wallPaint','wallFace','bed']}]}
  ]},
 {id:'main', n:3, name:'Main yard dirt', thumb:'p_15',
  seen:['Bare dirt / decomposed granite, sparse weeds, loose flagstone pieces','Low brick edging; oleander and shrubs along the walls','No turf and no gravel in the main yard today','4 dogs — dirt/poop tracking is the core ground-cover problem'],
  upgrades:['Pick ground cover (see comparison)','Trampoline footprint','Turf catch strip','Hoop / umbrellas','Pavers path','String lights over hangout'],
  phases:['ground','tramp','turf','play','pavers','hangout','beds','prep'],
  photos:[
   {id:'p_15', t:.3,
    ov:{tramp:[.5,.72,.6], lane:[.5,.88,.55], turf:[.5,.62,.8], bed:[.2,.48,.25], pavers:[.75,.55,.35], umbrellas:[.35,.45,.3], lights:[.5,.25,.7]},
    spots:[
     {id:'dirt', label:'Main dirt', x:.50, y:.70, opts:['turf','pavers','tramp','lane','umbrellas']},
     {id:'wall', label:'Perimeter wall', x:.50, y:.28, opts:['wallPaint','wallFace','waterWall']},
     {id:'lights', label:'Hangout lights', x:.50, y:.20, opts:['lights','umbrellas']}
    ]},
   {id:'p_10', t:.3,
    ov:{tramp:[.33,.68,.5], lane:[.45,.52,.4], turf:[.4,.82,.7], pavers:[.2,.55,.3], wallPaint:[.5,.32,.85], hoop:[.7,.55,.2], umbrellas:[.55,.45,.28]},
    spots:[
     {id:'dirt', label:'Open dirt', x:.40, y:.65, opts:['turf','tramp','pavers','lane']},
     {id:'wall', label:'CMU wall', x:.55, y:.30, opts:['wallPaint','wallFace','wallReplace','waterWall']},
     {id:'play', label:'Play zone', x:.70, y:.55, opts:['hoop','umbrellas','tramp']},
     {id:'statue', label:'Statue area', x:.25, y:.38, opts:['fountain','pavers']}
    ]},
   {id:'p_16', t:.3, ov:{turf:[.5,.85,.8], pavers:[.5,.7,.6], bed:[.3,.92,.4], wallPaint:[.5,.35,.8]},
    spots:[{id:'corner', label:'Dirt corner', x:.50, y:.75, opts:['turf','pavers','bed','wallPaint']}]}
  ]},
 {id:'pom', n:4, name:'Pomegranate + shed', thumb:'p_09',
  seen:['Pomegranate-type tree (about 9 ft) with a wire cage at its base','Cream wood prefab shed nearby','Bare dirt around the tree'],
  upgrades:['Shed remodel + interior lights (interior video later)','Mulch + drip ring','Hydro rack beside shed','Shade sail'],
  phases:['shed','prep','hydro','sail'],
  photos:[
   {id:'p_09', t:.3,
    ov:{ring:[.68,.63,.55], hydro:[.17,.76,.2], sail:[.3,.28,.7], bed:[.4,.92,.45], shed:[.2,.55,.35]},
    spots:[
     {id:'shed', label:'Storage shed', x:.18, y:.55, opts:['shed','sail','hydro']},
     {id:'tree', label:'Pomegranate', x:.68, y:.50, opts:['ring','bed']},
     {id:'shade', label:'Shed-side shade', x:.35, y:.25, opts:['sail','umbrellas']}
    ]},
   {id:'x_statue', t:.3, focus:[.62,.35,2.2], ov:{ring:[.62,.35,.24]},
    spots:[{id:'tree', label:'Tree zone', x:.62, y:.35, opts:['ring']}]}
  ]},
 {id:'statue', n:5, name:'Statue', thumb:'x_statue',
  seen:['Small white statue on a pedestal in the middle of the dirt yard, near the walk (about 24 ft E, 36 ft N by estimate)'],
  upgrades:['Fountain basin around the statue','Pavers or turf approach','Shade sail over a quiet corner'],
  phases:['fountain','water','sail','prep'],
  photos:[
   {id:'x_statue', t:.3, focus:[.44,.4,2.2],
    ov:{fountain:[.44,.385,.3], pavers:[.45,.52,.5], turf:[.5,.72,.7], sail:[.6,.17,.5], bed:[.12,.58,.2]},
    spots:[
     {id:'statue', label:'Statue fountain', x:.44, y:.38, opts:['fountain','waterWall']},
     {id:'approach', label:'Approach', x:.45, y:.55, opts:['pavers','turf']}
    ]},
   {id:'p_10', t:.3, focus:[.25,.37,2.5],
    ov:{fountain:[.25,.37,.14], pavers:[.3,.5,.35], sail:[.3,.15,.3]},
    spots:[{id:'statue', label:'Statue', x:.25, y:.37, opts:['fountain','pavers']}]}
  ]},
 {id:'walk', n:6, name:'Long walk', thumb:'p_12',
  seen:['Long concrete sidewalk with cracks and ponded water after rain','Weeds and loose flagstone along the dirt edge; low brick edging','Toy car, kids\u2019 hoop on a black base (movable), white bucket','Block wall with tall hedge and palms behind'],
  upgrades:['Turf strip or catch lane beside the walk','Basketball hoop upgrade','Pavers/gravel edge; check slope and drainage','CMU wall paint'],
  phases:['prep','turf','play','wall','pavers'],
  photos:[
   {id:'x_walk', t:.3,
    ov:{turf:[.26,.76,.4], lane:[.3,.58,.35], pavers:[.14,.92,.28], hoop:[.55,.55,.18], wallPaint:[.7,.35,.4]},
    spots:[
     {id:'edge', label:'Dirt edge', x:.25, y:.70, opts:['turf','lane','pavers']},
     {id:'hoop', label:'Kids hoop', x:.55, y:.55, opts:['hoop','umbrellas']},
     {id:'wall', label:'Block wall', x:.75, y:.35, opts:['wallPaint','wallFace','waterWall']}
    ]},
   {id:'p_12', t:.3,
    ov:{turf:[.2,.78,.3], lane:[.22,.5,.25], pavers:[.2,.92,.3], hoop:[.45,.55,.2]},
    spots:[
     {id:'edge', label:'Walk edge', x:.22, y:.70, opts:['turf','lane','pavers']},
     {id:'hoop', label:'Hoop', x:.45, y:.55, opts:['hoop']}
    ]},
   {id:'p_11', t:.3, ov:{turf:[.18,.72,.35], lane:[.22,.5,.3], pavers:[.2,.92,.3]},
    spots:[{id:'edge', label:'Weedy edge', x:.20, y:.70, opts:['turf','pavers']}]}
  ]},
 {id:'patio', n:7, name:'Patio', thumb:'p_13',
  seen:['Concrete patio with glass French doors','Rectangular tile-top table with iron chairs; a lounger','Dumbbells/bar, umbrella base, folded green cover','Cracks and ponded water after rain'],
  upgrades:['Furniture + grill refresh','String lights','Shade sail / canopy','Broken window replace (fix)','Hydro rack against wall'],
  phases:['hangout','sail','canopy','fix','workout','hydro'],
  photos:[
   {id:'p_13', t:.3,
    ov:{sail:[.55,.18,.9], hydro:[.1,.45,.14], furniture:[.55,.55,.45], grill:[.85,.6,.18], lights:[.5,.22,.8], window:[.55,.28,.25]},
    spots:[
     {id:'doors', label:'French doors / window', x:.55, y:.28, opts:['window','lights']},
     {id:'table', label:'Patio seating', x:.55, y:.58, opts:['furniture','grill','lights']},
     {id:'shade', label:'Overhead shade', x:.50, y:.12, opts:['sail','canopy','umbrellas']}
    ]},
   {id:'x_patio', t:.3,
    ov:{sail:[.5,.12,.95], hydro:[.1,.68,.16], furniture:[.5,.7,.45], lights:[.5,.2,.85]},
    spots:[
     {id:'lounge', label:'Lounger zone', x:.50, y:.70, opts:['furniture','grill','lights']},
     {id:'shade', label:'Shade', x:.50, y:.12, opts:['sail','canopy']}
    ]},
   {id:'p_06', t:.3, ov:{sail:[.5,.1,.9], hydro:[.88,.5,.14], furniture:[.4,.7,.4]},
    spots:[{id:'lounge', label:'Lounger', x:.40, y:.70, opts:['furniture','lights']}]},
   {id:'p_14', t:.3, ov:{sail:[.5,.1,.9], bed:[.45,.46,.45], hydro:[.82,.5,.12], window:[.4,.25,.2]},
    spots:[{id:'gate', label:'Patio edge', x:.50, y:.40, opts:['bed','sail','window']}]}
  ]},
 {id:'south', n:8, name:'Sunny side-yard (west exposure)', thumb:'p_19',
  seen:['Red molded brick pavers, ladder against the stucco wall','River-rock strip along the wall','Second iron + wood-slat gate','Heavy afternoon sun — priority shade for kids','Oleander hedge and brick-edged dirt in the SW corner'],
  upgrades:['West / sunny side-yard shade for kids','Pavers remodel / re-level','Narrow bed or planter','Compact hydro','Wall paint'],
  phases:['sail','pavers','beds','hydro','prep','wall'],
  photos:[
   {id:'p_19', t:.45,
    ov:{bed:[.4,.85,.5], hydro:[.9,.3,.14], sail:[.5,.08,.8], westShade:[.5,.2,.85], pavers:[.5,.7,.7], umbrellas:[.35,.45,.3]},
    spots:[
     {id:'shade', label:'Heavy-sun shade', x:.50, y:.18, opts:['westShade','sail','umbrellas']},
     {id:'pavers', label:'Brick pavers', x:.50, y:.75, opts:['pavers','bed']},
     {id:'wall', label:'Stucco wall', x:.70, y:.40, opts:['wallPaint','wallFace','westShade']}
    ]},
   {id:'p_20', t:.3,
    ov:{bed:[.5,.82,.7], hydro:[.75,.5,.25], westShade:[.5,.15,.8], wallPaint:[.5,.4,.7]},
    spots:[
     {id:'rock', label:'River-rock strip', x:.50, y:.75, opts:['bed','pavers','waterWall']},
     {id:'shade', label:'Sun shade', x:.50, y:.20, opts:['westShade','sail','umbrellas']}
    ]},
   {id:'p_17', t:.3, ov:{},
    spots:[{id:'gate', label:'Gate', x:.50, y:.50, opts:['wallPaint']}]},
   {id:'p_18', t:.3, ov:{pavers:[.5,.6,.5]},
    spots:[{id:'pavers', label:'Red pavers beyond', x:.55, y:.55, opts:['pavers','westShade']}]}
  ]}
];

YARD.mapW = 1024; YARD.mapH = 1024*1650/2550;
YARD.hot = [
 {area:'main',   r:[320,150,565,320]},
 {area:'main',   r:[410,366,565,392]},
 {area:'north',  r:[58,97,152,177]},
 {area:'bougain',r:[236,78,282,116]},
 {area:'pom',    r:[447,396,550,490]},
 {area:'pom',    r:[512,83,583,153]},
 {area:'walk',   r:[303,125,332,270]},
 {area:'patio',  r:[303,270,388,532]},
 {area:'south',  r:[30,562,296,600]},
 {area:'statue', r:[448,322,504,366]}
];
YARD.maps = {A:'assets/maps/blueprint-optionA-v2.png', B:'assets/maps/blueprint-optionB-v2.png', C:'assets/maps/blueprint-optionC-v2.png'};
YARD.mapTitle = {A:'Option A · family play + garden', B:'Option B · “Living Water” prayer corner', C:'Option C · mix (recommended starting point)'};

YARD.azPlants = [
  'Desert marigold — tough bloom, low water',
  'Red yucca (Hesperaloe) — hummingbirds, heat-proof',
  'Texas sage — purple bloom after monsoon',
  'Damianita — low yellow ground shrub',
  'Trailing lantana — color in partial shade',
  'Agave / aloe in pots (move from dog chew zones)',
  'Pomegranate drip ring — already on site; keep water off trunk'
];
