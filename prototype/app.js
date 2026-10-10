const OUT=["The Hindu","Indian Express","Dainik Jagran","NDTV","The Wire"],LG={"Dainik Jagran":"HI"},CL=["#2f8a82","#c0503f","#4a78b8","#c28f2c","#8e63a3"];
const AX=[["Government","Questions govt","Backs govt"],["Culture","Cosmopolitan","Traditionalist"],["Federal","State-first","Centre-first"],["Economic","Welfare-led","Market-led"],["Caste","Not mentioned","Foregrounded"],["Tone","Neutral","Outrage-driven"]];
const EX=["How far the wording leans toward or against the government.","Whether the story uses cosmopolitan or traditionalist cultural cues.","Whether it is told from the Centre's or the states' point of view.","Whether it stresses welfare and subsidies or markets and growth.","How much caste is brought in, from absent to central.","How emotional the wording is, from plain reporting to outrage."];
const S=[
{id:"tax",tag:"Politics",kw:"tax income slab budget salary",t:"New income-tax slabs announced",th:"नए आयकर स्लैब की घोषणा",ab:["Impact on salaried class above ₹15 lakh",["Dainik Jagran"]],
 f:"New slabs were announced in the Budget and take effect next financial year.",d:"Some lead with the relief, others with who still pays more.",
 o:{"The Hindu":["Tax slabs widened; relief mostly for mid-income earners",55],"Indian Express":["What the new slabs mean for your take-home pay",48],"Dainik Jagran":["मध्यम वर्ग को बड़ी सौगात, टैक्स में राहत",84],"NDTV":["Budget fine print: higher earners see little change",34],"The Wire":["Tax 'relief' leaves most workers outside the net",16]}},
{id:"msp",tag:"Economy",kw:"msp farm farmer crop agriculture",t:"Farm support prices revised before sowing",th:"बुवाई से पहले एमएसपी में संशोधन",ab:["Farmer union reaction",["Dainik Jagran","The Hindu"]],
 f:"Support prices for major crops were raised ahead of the sowing season.",d:"Framing splits between 'historic hike' and 'below input-cost growth'.",
 o:{"The Hindu":["MSP raised for 14 crops; unions want legal guarantee",50],"Indian Express":["Explained: how MSP is fixed, and what changed",46],"Dainik Jagran":["किसानों को तोहफ़ा, एमएसपी में रिकॉर्ड बढ़ोतरी",86],"The Wire":["Farmers say hike trails rising input costs",20]}},
{id:"air",tag:"Environment",kw:"air pollution aqi smog delhi",t:"Delhi-NCR air quality turns severe",th:"दिल्ली-एनसीआर की हवा 'गंभीर' श्रेणी में",ab:["Health data from city hospitals",["Dainik Jagran","Indian Express"]],
 f:"Air quality index crossed the severe mark for the third day.",d:"Blame is placed on stubble burning, vehicles or slow official action.",
 o:{"The Hindu":["Severe air: curbs kick in as AQI crosses 450",42],"Indian Express":["Why Delhi's air is worst at this time of year",38],"Dainik Jagran":["प्रदूषण पर सख़्ती, सरकार ने उठाए कड़े कदम",72],"NDTV":["Hospitals see spike in breathing complaints",30],"The Wire":["Pollution plan is late again, experts say",14]}},
{id:"gst",tag:"Federal",kw:"gst federal states tax dues centre",t:"Centre and states clash over GST dues",th:"जीएसटी बकाये पर केंद्र-राज्य टकराव",ab:["Finance Ministry's dues figure",["NDTV"]],
 f:"Several states say compensation dues are pending; the Centre disputes the amount.",d:"Outlets differ on whose figures to treat as the starting point.",
 o:{"The Hindu":["States press Centre on pending GST compensation",50],"Indian Express":["The numbers behind the GST dues dispute",44],"Dainik Jagran":["केंद्र का दावा: राज्यों को समय पर मिला हिस्सा",80],"NDTV":["Opposition-ruled states walk out of council meet",28],"The Wire":["States are being squeezed, finance ministers warn",12]}},
{id:"bcci",tag:"Sports",kw:"cricket bcci sports contract",t:"Cricket board unveils new central contracts",th:"बीसीसीआई के नए केंद्रीय अनुबंध",ab:["Women players' pay comparison",["Dainik Jagran","NDTV"]],
 f:"New contract tiers and retainers were announced for the season.",d:"Mostly agreement; differences show up in tone and omissions.",
 o:{"The Hindu":["Central contracts: who moves up, who drops out",50],"Indian Express":["New retainers: a tier-by-tier look",50],"Dainik Jagran":["नए अनुबंध में युवाओं पर भरोसा",56],"NDTV":["Star names retained in A+ list",48]}},
{id:"cjp",tag:"Politics",kw:"cjp protest cockroach janta party election commission gyanesh kumar sir voter 23000 capf metro janpath",t:"CJP Delhi Protest: 23,000 security personnel deployed amid demand for CEC resignation",th:"सीजेपी दिल्ली प्रदर्शन: 23,000 सुरक्षा बल तैनात, सीईसी के इस्तीफे की मांग",ab:["Election Commission SIR audit deletion logs",["Dainik Jagran","Times of India"]],
 f:"Delhi Police deploy 23,000 CAPF personnel and shut 45 metro stations as youth-led Cockroach Janta Party protests outside Nirvachan Sadan over SIR voter deletions.",d:"Framing splits between unauthorized law-and-order agitation and democratic push against electoral roll irregularities.",
 o:{"The Hindu":["23,000 CAPF troops deployed as CJP march on Election Commission stopped",42],"Indian Express":["CEC Gyanesh Kumar security upgraded as CJP steps up SIR protests",48],"Dainik Jagran":["नई दिल्ली में प्रदर्शन का प्रयास विफल: सुरक्षा कड़ी, 45 मेट्रो स्टेशन बंद",78],"NDTV":["Traffic snarls as central Delhi cordoned off amid CJP demonstration",35],"The Wire":["Mass detentions and metro closures as state throttles CJP youth protest",14]}},
{id:"rail",tag:"Regional",kw:"rail railway land protest corridor",t:"Land acquisition protests along new rail corridor",th:"नए रेल कॉरिडोर पर भूमि अधिग्रहण विरोध",ab:["Compensation rates offered",["The Hindu"]],
 f:"Villagers gathered at three sites over land rates for the corridor.",d:"Only some outlets covered it, and they disagree on who started the standoff.",
 o:{"The Hindu":["Villagers protest land rates for rail corridor",44],"Indian Express":["Corridor stalls as farmers refuse survey",40],"Dainik Jagran":["विकास परियोजना में बाधा, प्रदर्शनकारियों पर केस",76]}}
];
const I={en:{h1a:"Same news.",h1b:"Two views.",sub:"One event, many outlets. See who framed it how, and what each one left out. Drag the slider.",fh:"Top stories",eh:"Try the engine",ep:"Type a topic. We replay the six-step pipeline on sample data. Demo mode: no live Gemini call.",go:"Analyze",all:"All",blind:"Blindspots",q:"Search stories",empty:"No stories match. Clear the search or pick another topic.",bs:"Blindspot",brief:"Perspective Prep brief",cov:"Covered by",of:"of"},
hi:{h1a:"एक ख़बर.",h1b:"दो नज़र.",sub:"एक घटना, कई अख़बार। देखिए किसने कैसे दिखाया और क्या छोड़ दिया। स्लाइडर खींचिए।",fh:"मुख्य ख़बरें",eh:"इंजन आज़माएँ",ep:"कोई विषय लिखिए। हम सैंपल डेटा पर छह चरणों की प्रक्रिया दोहराते हैं। डेमो मोड: लाइव Gemini कॉल नहीं।",go:"विश्लेषण करें",all:"सभी",blind:"ब्लाइंडस्पॉट",q:"ख़बरें खोजें",empty:"कोई ख़बर नहीं मिली। खोज हटाएँ या दूसरा विषय चुनें।",bs:"ब्लाइंडस्पॉट",brief:"पर्सपेक्टिव प्रेप ब्रीफ़",cov:"कवर किया",of:"में से"}};
const FAV=["big gift","tax break","relief","historic","record","सौगात","तोहफ़ा","रिकॉर्ड","सख़्ती","कड़े","भरोसा","राहत"],CRI=["fine print","'relief'","squeezed","late again","stalls","refuse","trails","walk out","little change","outside the net","rising","बाधा"];
const RX=new RegExp([...FAV,...CRI].sort((a,b)=>b.length-a.length).map(w=>w.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).join("|"),"gi");
const hl=t=>t.replace(RX,m=>`<mark class="${FAV.includes(m.toLowerCase())?"f":"c"}">${m}</mark>`);
let L="en",tag="All",term="";const D={k:0,n:0,s:0},readS=new Set();
const $=s=>document.querySelector(s),T=k=>I[L][k];
const hs=s=>{let x=0;for(const c of s)x=(x*31+c.charCodeAt(0))>>>0;return x};
const score=(st,o,a)=>{const g=st.o[o][1];return a?Math.round(.35*g+.65*(15+hs(st.id+o+a)%70)):g};
const cnt=st=>{const v=Object.values(st.o).map(x=>x[1]);return{k:v.filter(x=>x<45).length,n:v.filter(x=>x>=45&&x<=65).length,s:v.filter(x=>x>65).length,t:v.length}};
const isBlind=st=>Object.keys(st.o).length<=3;
const lean=g=>g<45?"k":g>65?"s":"n";

function chips(){const tags=["All",...new Set(S.map(s=>s.tag)),"Blindspots"];
 $("#chips").innerHTML=tags.map(g=>`<button class="pill" data-g="${g}" aria-pressed="${g===tag}">${g==="All"?T("all"):g==="Blindspots"?T("blind"):g}</button>`).join("")}
function grid(){const list=S.filter(s=>(tag==="All"||(tag==="Blindspots"?isBlind(s):s.tag===tag))&&(s.t+s.th).toLowerCase().includes(term.toLowerCase()));
 $("#grid").innerHTML=list.length?list.map(s=>{const c=cnt(s);return`<button class="card" data-cur="OPEN" data-id="${s.id}">${isBlind(s)?`<span class="stk">${T("bs")}</span>`:""}
 <small>${s.tag}</small><h3 class="d">${L==="hi"?s.th:s.t}</h3>
 <div class="bar" role="img" aria-label="${c.k} critical, ${c.n} neutral, ${c.s} supportive"><i class="k" style="flex:${c.k}"></i><i class="n" style="flex:${c.n}"></i><i class="s" style="flex:${c.s}"></i></div>
 <small>${T("cov")} ${c.t} ${T("of")} 5 · ${c.k} critical · ${c.n} neutral · ${c.s} supportive</small></button>`}).join(""):`<div class="empty">${T("empty")}</div>`;obs()}

const P={bal:["The Dwi-Drishti Reader","You read both sides. That is the whole point.","Try a Blindspot story next."],s:["The Steady Reader","Most of your reading backs the official line.","Try the critical view on a story you know."],k:["The Questioner","Most of your reading challenges the official line.","Try the supportive view to see what it stresses."],n:["The Fact Finder","You favour plain, neutral reporting.","Check the framing axes to see what even neutral outlets leave out."]};
function diet(){const t=D.k+D.n+D.s,el=$("#diet");
 if(!t){el.innerHTML=`<h3 class="d">Your reading diet</h3><p>Open a story and tap "Read at source". We'll show which perspectives you keep seeing.</p>`;return}
 const m=Math.max(D.k,D.n,D.s),dom=D.k===m?"k":D.s===m?"s":"n",nm={k:"critical",n:"neutral",s:"supportive"},pct=Math.round(m/t*100);
 let nudge="";if(t>=2&&pct>=60&&dom!=="n"){const want=dom==="s"?"k":"s",tg=S.find(s=>!readS.has(s.id)&&cnt(s)[want]>0)||S[0];
  nudge=` Balance it out: <button class="pill" data-nudge="${tg.id}">${tg.t}</button>`}
 el.innerHTML=`<h3 class="d">Your reading diet</h3><div class="bar" role="img" aria-label="Reading diet"><i class="k" style="flex:${D.k}"></i><i class="n" style="flex:${D.n}"></i><i class="s" style="flex:${D.s}"></i></div><p>${pct}% of what you've read leans ${nm[dom]}.${nudge}</p>${t>=2?`<div class="persona" ><small>Discover your news persona</small><h3 class="d">${P[pct<60?"bal":dom][0]}</h3><p>${P[pct<60?"bal":dom][1]} ${P[pct<60?"bal":dom][2]}</p></div>`:""}`}

function rad(s,cov){const pt=(i,v)=>{const a=(-90+60*i)*Math.PI/180;return[(150+Math.cos(a)*v).toFixed(1),(150+Math.sin(a)*v).toFixed(1)]};
 return`<svg class="radar" viewBox="0 0 300 300" role="img" aria-label="Radar chart of six framing axes per outlet">${[33,66,100].map(v=>`<polygon class="rg" points="${AX.map((_,i)=>pt(i,v)).join(" ")}"/>`).join("")}
 ${AX.map((a,i)=>`<line class="rg" x1="150" y1="150" x2="${pt(i,100)[0]}" y2="${pt(i,100)[1]}"/><text class="rt" x="${pt(i,124)[0]}" y="${pt(i,124)[1]}" text-anchor="middle" dominant-baseline="middle">${a[0]}</text>`).join("")}
 ${cov.map(o=>{const c=CL[OUT.indexOf(o)];return`<polygon data-o="${o}" points="${AX.map((_,i)=>pt(i,score(s,o,i))).join(" ")}" fill="${c}" fill-opacity=".14" stroke="${c}" stroke-width="2.5" stroke-linejoin="round"/>`}).join("")}</svg>`}

function open(id){const s=S.find(x=>x.id===id),d=$("#dlg"),a=AX[0],cov=OUT.filter(o=>s.o[o]),n=cov.length,m=s.ab[1].length;
 const rows=OUT.map(o=>{const e=s.o[o];if(!e)return`<div class="skip">${o}: did not cover this story</div>`;
  return`<div class="row" data-o="${o}"><div class="top"><span>${o}<span class="lg">${LG[o]||"EN"}</span></span><span class="sc">${e[1]}</span></div>
  <div class="trk"><b style="left:${e[1]}%"></b></div><p class="${LG[o]?"hi":""}">${hl(e[0])}</p>
  ${s.ab[1].includes(o)?`<span class="flag">Absent here: ${s.ab[0]}</span>`:""}
  <button class="pill rd" data-read="${o}">Read at source</button></div>`}).join("");
 d.dataset.id=id;
 d.innerHTML=`<button class="x" aria-label="Close" onclick="this.closest('dialog').close()">✕</button>
 <small>${s.tag}</small><h2 class="d">${L==="hi"?s.th:s.t}</h2>
 <div class="viz">${rad(s,cov)}<div class="leg" role="group" aria-label="Show or hide outlets">${cov.map(o=>`<button class="pill lgb" data-leg="${o}" aria-pressed="true"><i style="background:${CL[OUT.indexOf(o)]}"></i>${o}</button>`).join("")}</div></div>
 <div class="axes" role="group" aria-label="Framing axis">${AX.map((x,i)=>`<button class="pill" data-ax="${i}" aria-pressed="${i===0}">${x[0]}</button>`).join("")}</div>
 <div class="ends"><span id="e1">← ${a[1]}</span><span id="e2">${a[2]} →</span></div>
 <p class="ex" id="ex"><b>How to read:</b> farther from the centre means stronger on that axis. ${EX[0]}</p>
 <p class="gh">Bias goggles on: lime is favourable-loaded wording, orange is critical-loaded wording.</p>${rows}
 <p style="color:var(--mut);margin-top:12px">Evidence: "${s.ab[0]}" appears in ${n-m} of ${n} reports and is missing from ${s.ab[1].join(", ")}.</p>
 <button class="pill" data-brief="1" aria-pressed="false" style="margin-top:8px">${T("brief")}</button>
 <div class="brief" hidden><p><b>All outlets agree:</b> ${s.f}</p><p><b>Where framing splits:</b> ${s.d}</p><p><b>Practice question:</b> Critically examine how media framing of "${s.t.toLowerCase()}" can shape public opinion. (150 words)</p></div>`;
 document.body.classList.add("modal");if(!d.open)d.showModal()}

function setAx(d,ax){const s=S.find(x=>x.id===d.dataset.id);
 d.querySelectorAll("[data-ax]").forEach(b=>b.setAttribute("aria-pressed",+b.dataset.ax===ax));
 d.querySelector("#e1").textContent="← "+AX[ax][1];d.querySelector("#e2").textContent=AX[ax][2]+" →";d.querySelector("#ex").innerHTML="<b>How to read:</b> farther from the centre means stronger on that axis. "+EX[ax];
 d.querySelectorAll(".row").forEach(r=>{const v=score(s,r.dataset.o,ax);r.querySelector(".sc").textContent=v;r.querySelector(".trk b").style.left=v+"%"})}

const esc=t=>t,sleep=ms=>new Promise(r=>setTimeout(r,matchMedia("(prefers-reduced-motion: reduce)").matches?60:ms));
function match(q){const w=q.toLowerCase().split(/\s+/).filter(x=>x.length>2);return S.find(s=>w.some(x=>(s.t+" "+s.tag+" "+s.th+" "+s.kw).toLowerCase().includes(x)))||S[hs(q)%S.length]}
async function run(){const go=$("#go"),log=$("#log"),pb=$("#pb"),q=$("#topic").value.trim()||"air quality",st=match(q),n=24+hs(q)%31;
 go.disabled=true;pb.style.width="0";log.textContent=`$ analyze "${q}"\n`;
 const steps=[["Fetch feeds","RSS x5 + NewsData.io"],["Clean text","BeautifulSoup, "+n+" articles"],["Cluster by event","Gemini, English + Hindi, 1 event"],["Score framing","6 Indian axes, low temperature"],["Detect omissions","checking: "+st.ab[0]],["Build dashboard","verbatim evidence attached"]];
 for(let i=0;i<steps.length;i++){log.textContent+=`▸ ${steps[i][0]} ... ${steps[i][1]}\n`;pb.style.width=(i+1)/steps.length*100+"%";await sleep(650)}
 log.textContent+=`✓ Cluster ready: ${st.t}\n`;await sleep(500);go.disabled=false;open(st.id)}

function lang(){document.documentElement.lang=L;document.querySelectorAll("[data-t]").forEach(e=>e.textContent=T(e.dataset.t));$("#q").placeholder=T("q");$("#lang").setAttribute("aria-pressed",L==="hi");chips();grid()}
const goggles=()=>$("#gg").setAttribute("aria-pressed",document.body.classList.toggle("gg"));

$("#chips").onclick=e=>{const g=e.target.closest("[data-g]");if(g){tag=g.dataset.g;chips();grid()}};
$("#grid").onclick=e=>{const c=e.target.closest("[data-id]");if(c)open(c.dataset.id)};
$("#diet").onclick=e=>{const c=e.target.closest("[data-nudge]");if(c)open(c.dataset.nudge)};
$("#q").oninput=e=>{term=e.target.value;grid()};
$("#lang").onclick=()=>{L=L==="en"?"hi":"en";lang()};
$("#gg").onclick=goggles;
addEventListener("keydown",e=>{if(e.key.toLowerCase()==="g"&&!e.metaKey&&!e.ctrlKey&&!/INPUT|TEXTAREA/.test(e.target.tagName))goggles()});
$("#th").onclick=()=>{const r=document.documentElement,dark=r.dataset.theme?r.dataset.theme==="dark":matchMedia("(prefers-color-scheme: dark)").matches;r.dataset.theme=dark?"light":"dark";window.glCol&&glCol()};
$("#go").onclick=run;$("#topic").onkeydown=e=>{if(e.key==="Enter")run()};
$("#sug").innerHTML=["air quality","GST dues","MSP","income tax","rail corridor"].map(x=>`<button class="pill" data-s="${x}">${x}</button>`).join("");
$("#sug").onclick=e=>{const b=e.target.closest("[data-s]");if(b){$("#topic").value=b.dataset.s;run()}};
const dl=$("#dlg");dl.addEventListener("close",()=>document.body.classList.remove("modal"));
dl.onclick=e=>{const t=e.target;if(t===dl){dl.close();return}
 const a=t.closest("[data-ax]"),b=t.closest("[data-brief]"),g=t.closest("[data-leg]"),r=t.closest("[data-read]");
 if(a)setAx(dl,+a.dataset.ax);
 if(b){const br=dl.querySelector(".brief");br.hidden=!br.hidden;b.setAttribute("aria-pressed",!br.hidden)}
 if(g){const on=g.getAttribute("aria-pressed")!=="true";g.setAttribute("aria-pressed",on);dl.querySelector(`polygon[data-o="${g.dataset.leg}"]`).style.display=on?"":"none"}
 if(r){const id=dl.dataset.id,st=S.find(x=>x.id===id);D[lean(st.o[r.dataset.read][1])]++;readS.add(id);r.textContent="Added to your reading diet ✓";r.disabled=true;diet()}};

const nums=[...document.querySelectorAll("[data-n]")],reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
new IntersectionObserver((es,ob)=>es.forEach(en=>{if(!en.isIntersecting)return;ob.disconnect();if(reduce)return;const t0=performance.now();
 const f=t=>{const p=Math.min((t-t0)/1300,1),e=1-Math.pow(1-p,3);nums.forEach(n=>n.textContent=Math.round(+n.dataset.n*e)+n.dataset.s);if(p<1)requestAnimationFrame(f)};requestAnimationFrame(f)}),{threshold:.4}).observe($("#imp"));
const names=[...OUT,...OUT,...OUT,...OUT].map(o=>`<span class="d">${o}</span>`).join("");$("#tk").innerHTML=names+names;
const LS=[
{n:"Framing",w:"Every story is told from an angle. The frame decides which fact you meet first and what feeling comes with it.",a:"Budget hands the middle class a tax break",b:"The fine print: who still pays more",tip:"Ask: what does this headline want me to feel first?"},
{n:"Omission",w:"What a story leaves out can shape opinion more than what it says. You only see it when you compare outlets.",a:"Hospitals see spike in breathing complaints",b:"Pollution plan is late again, experts say",tip:"Look for the orange Absent here flag.",act:["Open the air quality story","air"]},
{n:"Loaded words",w:"Some words carry a verdict. Relief feels kind. Relief in quotes feels doubtful. Same word, opposite signal.",a:"Tax slabs widened; relief mostly for mid-income earners",b:"Tax 'relief' leaves most workers outside the net",tip:"Switch on the goggles and see the highlights.",act:["Turn on bias goggles","gg"]},
{n:"Source mix",w:"One outlet is one frame. Reading across outlets rebuilds the full picture. Check how balanced your own reading is.",tip:"Read 3 stories, then check your diet bar.",act:["Go to my reading diet","diet"]}];
let LI=0;const NM={k:"critical of the government",n:"neutral",s:"supportive of the government"};
function lesson(){const x=LS[LI];
 $("#lt").innerHTML=LS.map((l,i)=>`<button class="pill" data-l="${i}" aria-pressed="${i===LI}">${i+1}. ${l.n}</button>`).join("");
 $("#lpn").innerHTML=`<h3 class="d">${x.n}</h3><p>${x.w}</p>${x.a?`<p><b>Frame A:</b> ${x.n==="Loaded words"?hl(x.a):x.a}<br><b>Frame B:</b> ${x.n==="Loaded words"?hl(x.b):x.b}</p>`:""}<p class="note">${x.tip}</p>${x.act?`<button class="pill" data-act="${x.act[1]}">${x.act[0]}</button>`:""}`}
const QP=S.flatMap(s=>Object.entries(s.o).filter(([o])=>!LG[o]).map(([o,e])=>({h:e[0],g:e[1],s:s.t})));
let Q;
function qStart(){Q={i:0,sc:0,ans:false,set:[...QP].sort(()=>Math.random()-.5).slice(0,5)};qDraw()}
function qDraw(){const el=$("#quiz"),x=Q.set[Q.i];Q.ans=false;
 if(!x){el.innerHTML=`<p class="qh">You scored ${Q.sc} out of 5.</p><p>${Q.sc>=4?"Sharp eye. You read past the framing.":Q.sc>=2?"Good start. Switch on bias goggles and try again.":"Framing is subtle. Try again with the goggles on."}</p><button class="pill" data-qr="1">Play again</button>`;return}
 el.innerHTML=`<small>Question ${Q.i+1} of 5 · ${x.s}</small><p class="qh" id="qh">“${x.h}”</p><p>Which way does this headline lean on the government?</p><div class="qo">${[["k","Critical"],["n","Neutral"],["s","Supportive"]].map(([k,t])=>`<button class="pill" data-qa="${k}" aria-pressed="false">${t}</button>`).join("")}</div><div id="qf" aria-live="polite"></div>`}
$("#learn").onclick=e=>{const t=e.target,l=t.closest("[data-l]"),a=t.closest("[data-act]"),qa=t.closest("[data-qa]");
 if(l){LI=+l.dataset.l;lesson()}
 if(a){const k=a.dataset.act;if(k==="air")open("air");else if(k==="gg"){document.body.classList.add("gg");$("#gg").setAttribute("aria-pressed","true")}else $("#diet").scrollIntoView({behavior:"smooth",block:"center"})}
 if(t.closest("[data-qr]"))qStart();
 if(t.closest("[data-qn]")){Q.i++;qDraw()}
 if(qa&&!Q.ans){Q.ans=true;const x=Q.set[Q.i],c=lean(x.g),ok=qa.dataset.qa===c;if(ok)Q.sc++;
  document.querySelectorAll("[data-qa]").forEach(b=>{b.disabled=true;if(b.dataset.qa===c)b.setAttribute("aria-pressed","true")});if(!ok)qa.classList.add("bad");
  $("#qh").innerHTML="“"+hl(x.h)+"”";const m=x.h.match(RX);
  $("#qf").innerHTML=`<p><b>${ok?"Correct.":"Not quite."}</b> Sample score ${x.g}/100: ${NM[c]}. ${m?"Loaded words are highlighted.":"No loaded words here. The lean comes from what the story chooses to stress."}</p><button class="pill" data-qn="1">${Q.i<4?"Next":"See score"}</button>`}};
const rio="IntersectionObserver"in window&&!reduce?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");rio.unobserve(e.target)}}),{threshold:.12}):null;
function obs(){document.querySelectorAll(".card:not(.in)").forEach((c,i)=>{c.style.setProperty("--d",(i%3)*90+"ms");rio?rio.observe(c):c.classList.add("in")})}
lesson();qStart();
$("#dt").textContent=new Date().toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long",year:"numeric"});
lang();diet();


(function(){const sec=$("#scrolly"),sp=$("#split"),bar=$("#sp"),k=$("#sk"),t=$("#st");
 const ST=[["Step 1 of 4 · The event","A Budget announcement changes the income-tax slabs. One event, two headlines."],["Step 2 of 4 · Outlet A","Outlet A leads with the relief."],["Step 3 of 4 · Outlet B","Outlet B leads with the fine print."],["Step 4 of 4 · The gap","Same facts, two frames. Next: see who left what out."]];
 let cur=-1;const c=v=>Math.min(1,Math.max(0,v));
 function upd(){const r=sec.getBoundingClientRect(),p=c(-r.top/(r.height-innerHeight));
  sp.style.setProperty("--x",(100-c((p-.4)/.3)*100)+"%");bar.style.width=p*100+"%";
  const i=p<.15?0:p<.4?1:p<.85?2:3;
  if(i!==cur){cur=i;k.textContent=ST[i][0];t.textContent=ST[i][1];t.classList.remove("sw");void t.offsetWidth;t.classList.add("sw")}}
 addEventListener("scroll",upd,{passive:true});addEventListener("resize",upd);upd()})();
$("#intro").addEventListener("animationend",e=>{if(e.animationName==="up")e.currentTarget.remove()});

(function(){const st=document.getElementById("stage");if(!st)return;let t=0,touched=false;
 const set=v=>st.style.setProperty("--mx",Math.min(96,Math.max(4,v))+"%");
 st.addEventListener("pointermove",e=>{touched=true;const r=st.getBoundingClientRect();set((e.clientX-r.left)/r.width*100)});
 st.addEventListener("pointerleave",()=>{touched=false});
 if(reduce)return;(function f(){t+=.012;if(!touched)set(50+34*Math.sin(t));requestAnimationFrame(f)})()})();
