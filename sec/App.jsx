import { useState, useEffect, useRef } from "react";

const C = {
  school: "#00D4FF", practice: "#00FF9D", business: "#FF6B35",
  identity: "#C77DFF", permis: "#FFD166",
};

const PILLARS = [
  { id:"school",   label:"École",    icon:"📚", color:C.school,   desc:"Examens, cours, révisions" },
  { id:"practice", label:"Pratique", icon:"🏥", color:C.practice, desc:"Stage, soins, terrain" },
  { id:"business", label:"Business", icon:"🔥", color:C.business, desc:"TikTok, KDP, finances" },
  { id:"identity", label:"Identité", icon:"⚡", color:C.identity, desc:"Discipline, mindset" },
  { id:"permis",   label:"Permis",   icon:"🚗", color:C.permis,   desc:"Führerschein · fin juillet" },
];

const PHASES = [
  {
    n:1, months:"Mai – Juin", title:"FONDATIONS", sub:"Tu construis la machine",
    school:   ["Révise 1 thème/semaine (neurologie, insuline, AVC...)", "Fiche-méthode: hypothèse pflegefachlich en 3 couches", "1 cas clinique complet par semaine"],
    practice: ["Journal de soins: 1 observation-clé/jour", "Cible 1 geste technique à maîtriser/mois", "Pose 1 question à un Pflegefachmann par semaine"],
    business: ["Poste 3x/semaine sur TikTok (entrepreneurship)", "Finalise 1 livre KDP (Le Secret de Léo)", "Lis 1 livre/mois (Dale Carnegie → suivant)"],
    identity: ["Réveil fixe à 5h30", "AppBlock actif 22h–18h pour réseaux perso", "Journal 5 min le soir: 3 victoires du jour"],
    permis:   ["S'inscrire en Fahrschule dès la semaine 1", "Passer le Erste-Hilfe-Kurs (réserver immédiatement)", "30 min de théorie/jour à 5h30 (app TÜV/DEGENER)", "Passer la Theorieprüfung avant fin juin"],
    kpi:["8h de sommeil fixe","0 film hors quota","Theorieprüfung réussie"],
  },
  {
    n:2, months:"Juil – Août", title:"ACCÉLÉRATION", sub:"La machine tourne à plein régime",
    school:   ["Blocs de révision de 90 min (Pomodoro longue durée)", "Simule des examens écrits chronométrés", "Groupe d'étude ou partenaire de révision"],
    practice: ["Miteinander: demande des responsabilités supplémentaires", "Analyse 1 cas complexe/semaine avec framework SIS", "Documente tes erreurs et corrections"],
    business: ["Monétisation TikTok: affiliation ou formation digitale", "Recherche opportunités marché camerounais (agro, fintech)", "Épargne automatique: % fixe du salaire Miteinander"],
    identity: ["Bloc DEEP WORK: 5h30–7h30 (inviolable)", "1 entraînement physique x3/semaine", "Revue mensuelle: tuer, garder, amplifier"],
    permis:   ["3–4 leçons de conduite par semaine (Überland, Autobahn, Nacht)", "Passer la Fahrprüfung pratique avant fin juillet", "PERMIS EN POCHE ✓"],
    kpi:["Permis obtenu fin juillet","Compte épargne actif","5 vidéos TikTok/semaine"],
  },
  {
    n:3, months:"Sep – Oct", title:"DOMINATION", sub:"Tu deviens la version que tu visais",
    school:   ["Préparation ciblée examen juin 2027: plan sur 12 mois", "Maîtrise totale des frameworks (NIHSS, Barthel, GUSS)", "Deviens la référence dans ta classe"],
    practice: ["Prends l'initiative dans les soins complexes", "Mentor informel pour nouveaux stagiaires", "Portfolio de compétences terrain documenté"],
    business: ["1er revenu passif documenté (KDP ou digital)", "Stratégie d'investissement Cameroun: 1ère décision concrète", "Réseau professionnel: 3 contacts-clés par trimestre"],
    identity: ["Bilan 6 mois: qui es-tu maintenant vs mai?", "Consolide les rituels qui ont marché", "Pose les fondations des 6 mois suivants"],
    kpi:["Juin 2027 dans le viseur","1 income stream supplémentaire","Lecture: 6 livres minimum"],
  },
];

const PERMIS = [
  { week:"Sem. 1–2", label:"ADMIN & INSCRIPTION", tasks:[
    "S'inscrire dans une Fahrschule à Lingen (comparer prix: ~1500–2500€)",
    "Passer la visite médicale (Sehtest) chez un opticien ou médecin",
    "Passer le Erste-Hilfe-Kurs (1 journée, ~30€) — réserver immédiatement",
    "Commander le Führerscheinantrag à la Bürgeramt",
    "Télécharger l'app officielle TÜV Rheinland ou DEGENER",
  ]},
  { week:"Sem. 3–5", label:"THÉORIE INTENSIVE", tasks:[
    "30 min de théorie/jour à 5h30 (avant le Deep Work)",
    "Viser 100% sur les questions de base de l'app",
    "Assister aux cours théoriques de la Fahrschule (obligatoires)",
    "Passer le test blanc interne: objectif 0 faute éliminatoire",
    "Passer la Theorieprüfung au TÜV/DEKRA — objectif: 1er essai",
  ]},
  { week:"Sem. 6–8", label:"CONDUITE PRATIQUE", tasks:[
    "Planifier 20–25 leçons de conduite (3–4/semaine minimum)",
    "Valider les leçons obligatoires: Überland, Autobahn, Nachtfahrt",
    "Demander un feedback précis après chaque leçon: 1 point à corriger",
    "Simuler l'examen pratique avec le Fahrlehrer avant la vraie date",
    "Passer la Fahrprüfung — objectif: 1er essai",
  ]},
  { week:"Fin Juillet", label:"PERMIS EN POCHE", tasks:[
    "Récupérer le permis à la Bürgeramt (ou après l'examen selon Fahrschule)",
    "Budget total: prévoir 1800–2500€ (théorie + pratique + taxes)",
    "Optionnel: souscrire une assurance auto si achat véhicule prévu",
  ]},
];

const RULES = [
  { title:"LA RÈGLE DU BLOC SACRÉ", body:"5h30–7h30 = inviolable. Pas de WhatsApp, pas de TikTok, pas d'exception. C'est là que tu construis ta vie." },
  { title:"1 FILM / SEMAINE MAX", body:"Tu l'as décidé. Tiens-le. Chaque heure de film non regardée est une heure investie en toi." },
  { title:"LE QUOTA DE DÉCISION", body:"Décide le dimanche ce que tu feras toute la semaine. Pendant la semaine, tu exécutes — tu ne décides plus." },
  { title:"LA LOI DU DIMANCHE", body:"Revue hebdo obligatoire: qu'est-ce qui a marché? Qu'est-ce qu'on ajuste? Qu'est-ce qu'on supprime?" },
  { title:"ZÉRO DETTE D'ATTENTION", body:"Si une tâche prend moins de 2 min, fais-la maintenant. Les petites dettes d'attention détruisent la concentration." },
  { title:"LE PRINCIPE DU CAMEROUN", body:"Chaque compétence acquise ici = impact futur là-bas. Ce n'est pas de l'ambition. C'est une mission." },
];

const DAILY = [
  { time:"05:30", label:"Réveil + eau + no phone", type:"identity" },
  { time:"05:45", label:"DEEP WORK #1 — École (révision / cas clinique)", type:"school" },
  { time:"07:30", label:"Sport ou marche 20 min", type:"identity" },
  { time:"08:00", label:"École / Pratique (selon planning)", type:"practice" },
  { time:"12:00", label:"Pause + lecture 15 min", type:"identity" },
  { time:"17:00", label:"DEEP WORK #2 — Business (TikTok, KDP, recherche)", type:"business" },
  { time:"19:00", label:"Repas + déconnexion intentionnelle", type:"identity" },
  { time:"21:00", label:"Journal du soir (3 victoires, 1 amélioration)", type:"identity" },
  { time:"22:00", label:"Extinction des écrans → sommeil", type:"identity" },
];

function pKey(n, pillar, j) { return `p${n}-${pillar}-${j}`; }
function permisKey(i, j) { return `pm-${i}-${j}`; }

function loadLS(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch(_) { return fallback; }
}
function saveLS(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch(_) {}
}

function Confetti({ onDone }) {
  const ref = useRef();
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext("2d");
    cv.width = window.innerWidth; cv.height = window.innerHeight;
    const cols = ["#00D4FF","#00FF9D","#FF6B35","#C77DFF","#FFD166","#fff"];
    const pts = Array.from({length:120}, () => ({
      x:Math.random()*cv.width, y:-20,
      vx:(Math.random()-0.5)*7, vy:Math.random()*5+2,
      w:Math.random()*8+3, h:Math.random()*12+4,
      rot:Math.random()*360, rv:(Math.random()-0.5)*8,
      col:cols[Math.floor(Math.random()*cols.length)], a:1,
    }));
    let f=0, raf;
    const draw = () => {
      ctx.clearRect(0,0,cv.width,cv.height);
      pts.forEach(p => {
        p.x+=p.vx; p.y+=p.vy; p.vy+=0.12; p.rot+=p.rv;
        if (f>70) p.a=Math.max(0,p.a-0.018);
        ctx.save(); ctx.globalAlpha=p.a;
        ctx.translate(p.x,p.y); ctx.rotate(p.rot*Math.PI/180);
        ctx.fillStyle=p.col; ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);
        ctx.restore();
      });
      f++;
      if (f<130) raf=requestAnimationFrame(draw); else onDone&&onDone();
    };
    draw();
    return ()=>cancelAnimationFrame(raf);
  },[]);
  return <canvas ref={ref} style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:9999}} />;
}

export default function App() {
  const [tab, setTab]       = useState("overview");
  const [phase, setPhase]   = useState(0);
  const [tasks, setTasks]   = useState(() => loadLS("nx-tasks", {}));
  const [rules, setRules]   = useState(() => loadLS("nx-rules", {}));
  const [toast, setToast]   = useState(null);
  const [confetti, setConfetti] = useState(false);
  const [dayPct, setDayPct] = useState(0);
  const bgRef = useRef();

  useEffect(() => {
    const h = new Date().getHours() + new Date().getMinutes()/60;
    setDayPct(Math.max(0,Math.min(100,((h-5.5)/(22-5.5))*100)));
  }, []);

  useEffect(() => {
    const cv = bgRef.current; if (!cv) return;
    const ctx = cv.getContext("2d");
    const resize = () => { cv.width=cv.offsetWidth; cv.height=cv.offsetHeight; };
    resize();
    const pts = Array.from({length:50},()=>({
      x:Math.random()*cv.width, y:Math.random()*cv.height,
      vx:(Math.random()-0.5)*0.3, vy:(Math.random()-0.5)*0.3,
      r:Math.random()*1.5+0.5,
      col:["#00D4FF18","#00FF9D18","#FF6B3518","#C77DFF18"][Math.floor(Math.random()*4)],
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0,0,cv.width,cv.height);
      pts.forEach(p=>{
        p.x+=p.vx; p.y+=p.vy;
        if(p.x<0||p.x>cv.width) p.vx*=-1;
        if(p.y<0||p.y>cv.height) p.vy*=-1;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=p.col; ctx.fill();
      });
      raf=requestAnimationFrame(draw);
    };
    draw(); return ()=>cancelAnimationFrame(raf);
  }, []);

  const toggle = (key, sectionKeys, msg, col) => {
    setTasks(prev => {
      const next = {...prev, [key]: !prev[key]};
      saveLS("nx-tasks", next);
      if (next[key] && sectionKeys.every(k=>next[k])) {
        setToast({msg, col}); setConfetti(true);
      }
      return next;
    });
  };

  const toggleRule = (i) => {
    setRules(prev => {
      const next = {...prev, [i]: !prev[i]};
      saveLS("nx-rules", next);
      if (next[i] && RULES.every((_,j)=>next[j])) {
        setToast({msg:"⚡ Contrat signé — tu es engagé !", col:"#00FF9D"}); setConfetti(true);
      }
      return next;
    });
  };

  const allPhaseTasks = PHASES.flatMap(ph =>
    PILLARS.flatMap(p => ph[p.id] ? ph[p.id].map((_,j)=>pKey(ph.n,p.id,j)) : [])
  );
  const allPermisTasks = PERMIS.flatMap((s,i)=>s.tasks.map((_,j)=>permisKey(i,j)));
  const totalT = allPhaseTasks.length + allPermisTasks.length;
  const doneT  = [...allPhaseTasks,...allPermisTasks].filter(k=>tasks[k]).length;
  const globalPct = totalT > 0 ? Math.round(doneT/totalT*100) : 0;

  const pillarStats = PILLARS.map(p => {
    const keys = p.id==="permis" ? allPermisTasks :
      PHASES.flatMap(ph => ph[p.id] ? ph[p.id].map((_,j)=>pKey(ph.n,p.id,j)) : []);
    return {...p, total:keys.length, done:keys.filter(k=>tasks[k]).length};
  });

  const ph = PHASES[phase];
  const TABS = [
    {id:"overview",label:"Vue d'ensemble"},
    {id:"phases",  label:"3 Phases"},
    {id:"day",     label:"Journée"},
    {id:"permis",  label:"🚗 Permis"},
    {id:"rules",   label:"Lois de vie"},
  ];

  return (
    <div style={{minHeight:"100vh",background:"#050810",color:"#E8EAFF",fontFamily:"'DM Mono','Courier New',monospace",position:"relative",overflow:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Bebas+Neue&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:#050810}
        ::-webkit-scrollbar{width:3px} ::-webkit-scrollbar-thumb{background:#333;border-radius:2px}
        .ti{cursor:pointer;transition:background 0.15s} .ti:hover{background:rgba(255,255,255,0.04)!important}
        .rc{cursor:pointer;transition:all 0.2s} .rc:hover{transform:translateX(3px)}
        .pb{transition:all 0.2s;cursor:pointer} .pb:hover{transform:translateY(-2px)}
        .si{animation:si 0.3s ease} @keyframes si{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
        .toast{animation:ta 0.35s cubic-bezier(.17,.67,.35,1.4)} @keyframes ta{from{opacity:0;transform:translateY(20px) scale(0.92)}to{opacity:1;transform:none}}
      `}</style>

      <canvas ref={bgRef} style={{position:"fixed",inset:0,width:"100%",height:"100%",zIndex:0,pointerEvents:"none"}}/>
      {confetti && <Confetti onDone={()=>setConfetti(false)}/>}

      {toast && (
        <div className="toast" style={{position:"fixed",bottom:28,left:"50%",transform:"translateX(-50%)",zIndex:9998,padding:"12px 22px",background:"#0d0d18",border:`1px solid ${toast.col}55`,borderRadius:40,display:"flex",alignItems:"center",gap:10,boxShadow:`0 0 24px ${toast.col}22`,whiteSpace:"nowrap"}}>
          <span style={{fontSize:13,color:toast.col,fontFamily:"'Bebas Neue',sans-serif",letterSpacing:2}}>{toast.msg}</span>
          <button onClick={()=>setToast(null)} style={{background:"none",border:"none",color:"#555",cursor:"pointer",fontSize:18,lineHeight:1,padding:"0 2px"}}>×</button>
        </div>
      )}

      <div style={{position:"relative",zIndex:1,maxWidth:820,margin:"0 auto",padding:"22px 14px 80px"}}>

        {/* Header */}
        <div style={{textAlign:"center",marginBottom:24}}>
          <div style={{fontSize:10,letterSpacing:6,color:C.school,marginBottom:6,opacity:0.6}}>SYSTÈME DE TRANSFORMATION</div>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(44px,9vw,72px)",lineHeight:0.9,letterSpacing:2,background:"linear-gradient(135deg,#fff 30%,#00D4FF 70%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
            NOUVELLE<br/>VERSION
          </div>
          <div style={{fontSize:11,color:"#555",marginTop:10,letterSpacing:3}}>MAI → OCTOBRE 2026 · 6 MOIS</div>

          <div style={{marginTop:20,display:"inline-flex",flexDirection:"column",alignItems:"center",gap:6}}>
            <svg width="88" height="88" viewBox="0 0 88 88">
              <circle cx="44" cy="44" r="36" fill="none" stroke="#0f0f1a" strokeWidth="7"/>
              <circle cx="44" cy="44" r="36" fill="none" stroke={C.school} strokeWidth="7"
                strokeDasharray={`${2*Math.PI*36}`}
                strokeDashoffset={`${2*Math.PI*36*(1-globalPct/100)}`}
                strokeLinecap="round" transform="rotate(-90 44 44)"
                style={{transition:"stroke-dashoffset 0.6s ease"}}/>
              <text x="44" y="50" textAnchor="middle" fill="#fff" fontSize="20" fontFamily="'Bebas Neue',sans-serif">{globalPct}%</text>
            </svg>
            <div style={{fontSize:10,color:"#444",letterSpacing:3}}>{doneT}/{totalT} TÂCHES</div>
          </div>

          <div style={{maxWidth:300,margin:"14px auto 0"}}>
            <div style={{fontSize:9,color:"#444",letterSpacing:2,marginBottom:5,display:"flex",justifyContent:"space-between"}}>
              <span>05:30</span><span style={{color:C.school}}>JOURNÉE EN COURS</span><span>22:00</span>
            </div>
            <div style={{height:3,background:"#111",borderRadius:2,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${dayPct}%`,background:`linear-gradient(90deg,${C.school},${C.identity})`,transition:"width 1s"}}/>
            </div>
          </div>
        </div>

        {/* Pillar cards */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:24}}>
          {pillarStats.map(p => {
            const pct = p.total>0 ? Math.round(p.done/p.total*100) : 0;
            return (
              <div key={p.id} style={{border:`1px solid ${p.color}20`,borderLeft:`3px solid ${p.color}`,background:`${p.color}07`,padding:"11px 12px",borderRadius:5}}>
                <div style={{fontSize:15,marginBottom:2}}>{p.icon}</div>
                <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:15,color:p.color,letterSpacing:2}}>{p.label}</div>
                <div style={{height:2,background:"#111",borderRadius:1,overflow:"hidden",margin:"7px 0 4px"}}>
                  <div style={{height:"100%",width:`${pct}%`,background:p.color,transition:"width 0.4s"}}/>
                </div>
                <div style={{fontSize:9,color:"#444",letterSpacing:1}}>{p.done}/{p.total}</div>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div style={{overflowX:"auto",borderBottom:"1px solid #111",marginBottom:22,scrollbarWidth:"none",WebkitOverflowScrolling:"touch"}}>
          <div style={{display:"flex",minWidth:"max-content"}}>
            {TABS.map(t => {
              const active = tab===t.id;
              const col = t.id==="permis" ? C.permis : C.school;
              return (
                <button key={t.id} onClick={()=>setTab(t.id)} style={{
                  background:"none",border:"none",cursor:"pointer",padding:"9px 13px",
                  fontSize:10,letterSpacing:1.5,whiteSpace:"nowrap",
                  color:active?col:"#3a3a4a",
                  borderBottom:active?`2px solid ${col}`:"2px solid transparent",
                  marginBottom:-1,transition:"color 0.2s",fontFamily:"'DM Mono',monospace",
                }}>{t.label.toUpperCase()}</button>
              );
            })}
          </div>
        </div>

        {/* TAB: Overview */}
        {tab==="overview" && (
          <div className="si">
            {PHASES.map((p,i)=>(
              <div key={i} style={{border:"1px solid #13151f",background:"#0a0c16",borderRadius:6,padding:"18px 20px",display:"flex",alignItems:"center",gap:18,marginBottom:8}}>
                <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:44,color:"#ffffff08",lineHeight:1,minWidth:44}}>0{p.n}</div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:3}}>
                    <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:20,letterSpacing:2}}>{p.title}</span>
                    <span style={{fontSize:9,color:"#444",letterSpacing:2}}>{p.months}</span>
                  </div>
                  <div style={{fontSize:11,color:C.school,letterSpacing:1}}>{p.sub}</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:5,marginTop:8}}>
                    {p.kpi.map((k,j)=><span key={j} style={{fontSize:9,padding:"2px 9px",border:"1px solid #1f1f2e",borderRadius:20,color:"#666"}}>{k}</span>)}
                  </div>
                </div>
                <button onClick={()=>{setPhase(i);setTab("phases");}} style={{background:"none",border:"1px solid #1f1f2e",color:"#444",fontSize:10,padding:"7px 12px",borderRadius:4,cursor:"pointer",fontFamily:"'DM Mono',monospace",whiteSpace:"nowrap"}}>VOIR →</button>
              </div>
            ))}
            <div style={{marginTop:18,padding:"18px 20px",border:`1px solid ${C.school}20`,background:`${C.school}05`,borderRadius:6}}>
              <div style={{fontSize:9,letterSpacing:4,color:C.school,marginBottom:10}}>OBJECTIF TERMINAL</div>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:26,letterSpacing:2,marginBottom:6}}>JUIN 2027 — EXAMEN FINAL</div>
              <div style={{fontSize:11,color:"#555",lineHeight:1.9}}>Pflegefachmann certifié · Permis obtenu · Revenue business actif · Retour au Cameroun · 12 livres lus · Identité reconstruite</div>
            </div>
          </div>
        )}

        {/* TAB: Phases */}
        {tab==="phases" && (
          <div className="si">
            <div style={{display:"flex",gap:6,marginBottom:18}}>
              {PHASES.map((p,i)=>(
                <button key={i} className="pb" onClick={()=>setPhase(i)} style={{
                  flex:1,background:phase===i?C.school:"#0a0c16",
                  border:`1px solid ${phase===i?C.school:"#13151f"}`,
                  color:phase===i?"#000":"#444",padding:"9px 0",borderRadius:4,cursor:"pointer",
                  fontFamily:"'Bebas Neue',sans-serif",fontSize:14,letterSpacing:2,
                }}>{p.title}</button>
              ))}
            </div>
            <div style={{marginBottom:14,padding:"14px 18px",background:"#0a0c16",borderRadius:6,border:"1px solid #111"}}>
              <div style={{fontSize:9,color:"#444",letterSpacing:3}}>{ph.months}</div>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,letterSpacing:2}}>{ph.title}</div>
              <div style={{fontSize:12,color:C.school}}>{ph.sub}</div>
            </div>
            {PILLARS.map(pil => {
              if (!ph[pil.id]) return null;
              const sKeys = ph[pil.id].map((_,j)=>pKey(ph.n,pil.id,j));
              const doneC = sKeys.filter(k=>tasks[k]).length;
              const pct   = Math.round(doneC/sKeys.length*100);
              return (
                <div key={pil.id} style={{marginBottom:10,border:`1px solid ${pil.color}15`,background:"#080810",borderRadius:6,overflow:"hidden"}}>
                  <div style={{padding:"11px 15px",borderBottom:`1px solid ${pil.color}15`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontSize:14}}>{pil.icon}</span>
                      <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:15,letterSpacing:2,color:pil.color}}>{pil.label}</span>
                    </div>
                    <span style={{fontSize:10,color:pct===100?pil.color:"#333",fontFamily:"'Bebas Neue',sans-serif"}}>{doneC}/{sKeys.length}</span>
                  </div>
                  <div style={{height:2,background:"#0d0d14"}}>
                    <div style={{height:"100%",width:`${pct}%`,background:pil.color,transition:"width 0.35s"}}/>
                  </div>
                  {ph[pil.id].map((task,j)=>{
                    const k=pKey(ph.n,pil.id,j); const done=!!tasks[k];
                    return (
                      <div key={j} className="ti" onClick={()=>toggle(k,sKeys,`${pil.icon} ${pil.label} — Phase ${ph.n} complétée !`,pil.color)}
                        style={{padding:"11px 15px",borderBottom:"1px solid #0c0c12",display:"flex",alignItems:"flex-start",gap:11,background:done?`${pil.color}07`:"transparent"}}>
                        <div style={{width:17,height:17,border:`1px solid ${done?pil.color:"#2a2a35"}`,borderRadius:3,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1,background:done?pil.color:"transparent",transition:"all 0.18s"}}>
                          {done&&<span style={{fontSize:10,color:"#000",fontWeight:800}}>✓</span>}
                        </div>
                        <span style={{fontSize:12,color:done?pil.color:"#777",lineHeight:1.6,textDecoration:done?"line-through":"none",transition:"color 0.18s"}}>{task}</span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}

        {/* TAB: Day */}
        {tab==="day" && (
          <div className="si">
            <div style={{fontSize:10,color:"#444",letterSpacing:3,marginBottom:18}}>TEMPLATE · JOURS D'ÉCOLE + TRAVAIL</div>
            <div style={{position:"relative"}}>
              <div style={{position:"absolute",left:56,top:0,bottom:0,width:1,background:"#0f0f18"}}/>
              {DAILY.map((item,i)=>(
                <div key={i} style={{display:"flex",gap:14,marginBottom:3,alignItems:"flex-start"}}>
                  <div style={{width:42,fontSize:10,color:"#3a3a4a",fontFamily:"'Bebas Neue',sans-serif",letterSpacing:1,paddingTop:14,textAlign:"right",flexShrink:0}}>{item.time}</div>
                  <div style={{paddingTop:17,flexShrink:0}}>
                    <div style={{width:9,height:9,borderRadius:"50%",background:C[item.type],boxShadow:`0 0 6px ${C[item.type]}55`,position:"relative",zIndex:1}}/>
                  </div>
                  <div style={{flex:1,padding:"11px 13px",border:`1px solid ${C[item.type]}15`,borderLeft:`2px solid ${C[item.type]}40`,background:`${C[item.type]}04`,borderRadius:"0 5px 5px 0",marginBottom:4}}>
                    <div style={{fontSize:12,color:"#bbb",lineHeight:1.5}}>{item.label}</div>
                    <div style={{fontSize:9,color:C[item.type],marginTop:2,letterSpacing:2,opacity:0.6}}>{PILLARS.find(p=>p.id===item.type)?.label.toUpperCase()}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{marginTop:22,padding:"14px 18px",background:"#150800",border:`1px solid ${C.business}30`,borderRadius:6}}>
              <div style={{fontSize:9,color:C.business,letterSpacing:3,marginBottom:6}}>⚠ RÈGLE ABSOLUE</div>
              <div style={{fontSize:12,color:"#bbb",lineHeight:1.8}}>Le bloc 5h30–7h30 ne se négocie pas. Malade, fatigué, peu motivé — <span style={{color:C.business}}>tu te lèves quand même.</span></div>
            </div>
          </div>
        )}

        {/* TAB: Permis */}
        {tab==="permis" && (
          <div className="si">
            <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:18}}>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:34,letterSpacing:2,color:C.permis}}>FÜHRERSCHEIN</div>
              <div style={{padding:"3px 11px",border:`1px solid ${C.permis}40`,borderRadius:20,fontSize:9,color:C.permis,letterSpacing:2}}>MAI → FIN JUILLET</div>
            </div>
            {PERMIS.map((step,i)=>{
              const keys=step.tasks.map((_,j)=>permisKey(i,j));
              const doneC=keys.filter(k=>tasks[k]).length;
              const pct=Math.round(doneC/keys.length*100);
              return (
                <div key={i} style={{marginBottom:10,border:`1px solid ${C.permis}15`,background:"#080810",borderRadius:6,overflow:"hidden"}}>
                  <div style={{padding:"13px 16px",borderBottom:`1px solid ${C.permis}15`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <div style={{display:"flex",alignItems:"center",gap:11}}>
                      <div style={{width:26,height:26,borderRadius:"50%",border:`2px solid ${pct===100?C.permis:"#2a2a35"}`,background:pct===100?`${C.permis}20`:"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:C.permis,fontFamily:"'Bebas Neue',sans-serif",flexShrink:0}}>
                        {pct===100?"✓":i+1}
                      </div>
                      <div>
                        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:15,letterSpacing:2,color:C.permis}}>{step.label}</div>
                        <div style={{fontSize:9,color:"#444",letterSpacing:2}}>{step.week}</div>
                      </div>
                    </div>
                    <span style={{fontSize:10,color:pct===100?C.permis:"#333",fontFamily:"'Bebas Neue',sans-serif"}}>{doneC}/{keys.length}</span>
                  </div>
                  <div style={{height:3,background:"#0d0d14"}}>
                    <div style={{height:"100%",width:`${pct}%`,background:C.permis,transition:"width 0.35s"}}/>
                  </div>
                  {step.tasks.map((task,j)=>{
                    const k=permisKey(i,j); const done=!!tasks[k];
                    return (
                      <div key={j} className="ti" onClick={()=>toggle(k,keys,`🚗 ${step.label} — étape validée !`,C.permis)}
                        style={{padding:"11px 16px",borderBottom:"1px solid #0c0c12",display:"flex",alignItems:"flex-start",gap:11,background:done?`${C.permis}07`:"transparent"}}>
                        <div style={{width:17,height:17,border:`1px solid ${done?C.permis:"#2a2a35"}`,borderRadius:3,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1,background:done?C.permis:"transparent",transition:"all 0.18s"}}>
                          {done&&<span style={{fontSize:10,color:"#000",fontWeight:800}}>✓</span>}
                        </div>
                        <span style={{fontSize:12,color:done?C.permis:"#777",lineHeight:1.6,textDecoration:done?"line-through":"none",transition:"color 0.18s"}}>{task}</span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
            <div style={{marginTop:18,padding:"16px 18px",background:`${C.permis}08`,border:`1px solid ${C.permis}25`,borderRadius:6,textAlign:"center"}}>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:20,letterSpacing:3,color:C.permis}}>OBJECTIF: FIN JUILLET 2026</div>
              <div style={{fontSize:10,color:"#555",marginTop:5}}>2 mois et demi · Theorieprüfung + Fahrprüfung · 1er essai</div>
            </div>
          </div>
        )}

        {/* TAB: Rules */}
        {tab==="rules" && (
          <div className="si">
            <div style={{fontSize:10,color:"#444",letterSpacing:3,marginBottom:18}}>TES LOIS PERSONNELLES · CLIQUE POUR VALIDER</div>
            {RULES.map((r,i)=>{
              const on=!!rules[i];
              return (
                <div key={i} className="rc" onClick={()=>toggleRule(i)} style={{
                  marginBottom:8,padding:"16px 18px",
                  border:`1px solid ${on?"#00FF9D35":"#111"}`,
                  background:on?"#00FF9D07":"#080810",
                  borderRadius:6,
                  borderLeft:`3px solid ${on?"#00FF9D":"#1a1a28"}`,
                }}>
                  <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
                    <div style={{width:20,height:20,border:`1px solid ${on?"#00FF9D":"#2a2a35"}`,borderRadius:3,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,background:on?"#00FF9D":"transparent",marginTop:1,transition:"all 0.18s"}}>
                      {on&&<span style={{fontSize:11,color:"#000",fontWeight:800}}>✓</span>}
                    </div>
                    <div>
                      <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:15,letterSpacing:2,color:on?"#00FF9D":"#bbb",marginBottom:3}}>{r.title}</div>
                      <div style={{fontSize:11,color:"#555",lineHeight:1.7}}>{r.body}</div>
                    </div>
                  </div>
                </div>
              );
            })}
            {RULES.every((_,i)=>rules[i]) && (
              <div style={{marginTop:18,padding:"18px",background:"linear-gradient(135deg,#00FF9D10,#00D4FF10)",border:"1px solid #00FF9D35",borderRadius:6,textAlign:"center"}}>
                <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:26,letterSpacing:3,color:"#00FF9D"}}>CONTRAT SIGNÉ</div>
                <div style={{fontSize:11,color:"#666",marginTop:5}}>Tu as accepté toutes les lois. La transformation commence maintenant.</div>
              </div>
            )}
          </div>
        )}

        <div style={{marginTop:44,textAlign:"center",fontSize:9,color:"#1a1a28",letterSpacing:4}}>RICHEZ · SYSTÈME V1.0 · MAI 2026</div>
      </div>
    </div>
  );
}
