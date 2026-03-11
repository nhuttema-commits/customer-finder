import { useState } from "react";

// === DESIGN TOKENS (Homebase DesignBase) ===
const C = {
  purple100:"#f1ecff",purple300:"#cdc0f3",purple400:"#9c7edb",purple500:"#7e3dd4",purple700:"#52258f",purple900:"#1e0b3a",
  mono0:"#fff",mono100:"#f2f2ec",mono300:"#e6e4d6",mono400:"#c0bda2",mono500:"#9e9c88",mono700:"#605f56",mono900:"#1e0b3a",
  red:"#c0392b",green:"#27ae60",amber:"#e67e22",blue:"#2980b9",
};
const SRC_COLORS = {Website:C.blue,LinkedIn:"#0a66c2",Yelp:"#d32323",Amplitude:C.purple500,CRM:C.mono500,Instagram:"#e1306c",Databricks:"#FF3621"};

// === BRIEF FORM CONFIG ===
const BRIEF_FIELDS = [
  {key:"goal",label:"Research goal",placeholder:"What are you trying to learn?",hint:"e.g., Understand why franchise owners churn after year one",required:true,type:"textarea"},
  {key:"audience",label:"Target audience",placeholder:"Who do you want to talk to?",hint:"e.g., Restaurant franchise owners, multi-location businesses",required:false,type:"input"},
  {key:"context",label:"Additional context",placeholder:"Any constraints or preferences?",hint:"e.g., Avoid anyone contacted in last 30 days, prefer Plus plan customers",required:false,type:"textarea"},
  {key:"method",label:"Research method",placeholder:"",hint:"",required:false,type:"select",options:["Interview (30-60 min)","Survey","Usability test","Diary study","Focus group"]},
  {key:"touchLevel",label:"Interaction history preference",placeholder:"",hint:"Should participants be customers we've had contact with, or fresh leads?",required:false,type:"select",options:["No preference","Low touch (minimal prior contact)","High touch (existing relationship)","Never contacted"]},
  {key:"count",label:"Participants needed",placeholder:"e.g., 5-8",hint:"",required:false,type:"input"},
];

// === COMPONENTS ===

function CustomerCard({c}) {
  const [open, setOpen] = useState(false);
  const responseRate = c.contact.rate;
  return (
    <div style={{background:C.mono0,borderRadius:12,border:`1.5px solid ${C.mono300}`,overflow:"hidden",marginBottom:8}}>
      <div onClick={()=>setOpen(!open)} style={{padding:"16px 18px",cursor:"pointer"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
          <div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
              <span style={{fontWeight:700,fontSize:15,color:C.mono900}}>{c.name}</span>
              <span style={{fontSize:12,color:C.mono500}}>{c.industry}</span>
            </div>
            <div className="card-meta">
              <span>{c.city}</span><span>{c.employees} employees</span><span>{c.locations} loc</span><span>{c.plan}</span><span>{c.tenure}</span>
            </div>
          </div>
          <div style={{textAlign:"right",flexShrink:0,marginLeft:16}}>
            <div style={{fontSize:10,color:C.mono500,marginBottom:1}}>Fit score</div>
            <div style={{fontSize:22,fontWeight:700,color:c.fitScore>85?C.green:c.fitScore>65?C.amber:C.mono500}}>{c.fitScore}</div>
          </div>
        </div>
        <div className="card-contact">
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:32,height:32,borderRadius:"50%",background:C.purple300,display:"flex",alignItems:"center",justifyContent:"center",color:C.purple900,fontWeight:700,fontSize:12}}>
              {c.contact.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
            </div>
            <div>
              <div style={{fontSize:13,fontWeight:600,color:C.mono900}}>{c.contact.name}</div>
              <div style={{fontSize:11,color:C.mono500}}>{c.contact.title} · Prefers {c.contact.channel.toLowerCase()}</div>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            {responseRate !== null ? (
              <>
                <span style={{fontSize:11,color:C.mono500}}>Response rate:</span>
                <span style={{fontSize:13,fontWeight:700,color:responseRate>70?C.green:responseRate>40?C.amber:C.red}}>{responseRate}%</span>
              </>
            ) : (
              <span style={{fontSize:11,color:C.mono500}}>Response rate: N/A</span>
            )}
            <span style={{fontSize:10,color:C.mono400,display:"flex",alignItems:"center",gap:3,marginLeft:4}}>
              <span style={{width:6,height:6,borderRadius:"50%",background:SRC_COLORS[c.contact.source]||C.mono500}} />via {c.contact.source}
            </span>
          </div>
        </div>
        <div style={{fontSize:11,color:C.green,marginBottom:8}}>● Never contacted by Homebase — fresh lead</div>
        <div style={{display:"flex",gap:4,flexWrap:"wrap",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
            {c.tags.map((t,i)=>(
              <span key={i} style={{fontSize:10,padding:"3px 8px",borderRadius:12,background:C.mono100,color:C.mono700,border:`1px solid ${C.mono300}`,display:"flex",alignItems:"center",gap:4}}>
                <span style={{width:5,height:5,borderRadius:"50%",background:SRC_COLORS[t.s]||C.mono500}} />{t.l}
              </span>
            ))}
          </div>
          <span style={{fontSize:11,color:C.mono400}}>{open?"▲":"▼"}</span>
        </div>
      </div>
      {open && (
        <div style={{padding:"0 18px 18px",borderTop:`1px solid ${C.mono300}`}}>
          <div style={{padding:"12px 14px",background:C.purple100,borderRadius:8,marginTop:12,marginBottom:12}}>
            <div style={{fontSize:10,fontWeight:700,color:C.purple700,textTransform:"uppercase",letterSpacing:.5,marginBottom:4}}>Why this customer matches</div>
            <div style={{fontSize:13,color:C.purple900,lineHeight:1.5}}>{c.matchReason}</div>
          </div>
          <div style={{fontSize:10,fontWeight:700,color:C.mono500,textTransform:"uppercase",letterSpacing:.5,marginBottom:6}}>Enriched attributes</div>
          <div style={{display:"flex",flexDirection:"column",gap:4}}>
            {c.tags.map((t,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 10px",background:C.mono100,borderRadius:6}}>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <span style={{width:7,height:7,borderRadius:"50%",background:SRC_COLORS[t.s]||C.mono500}} />
                  <span style={{fontSize:12,color:C.mono900}}>{t.l}</span>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <span style={{fontSize:10,color:C.mono500}}>via {t.s}</span>
                  <span style={{fontSize:10,color:C.mono700,background:C.mono0,padding:"1px 5px",borderRadius:3,border:`1px solid ${C.mono300}`}}>{Math.round(t.c*100)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// === MAIN APP ===

export default function App() {
  const [phase, setPhase] = useState("brief"); // brief | searching | preview | allResults | error
  const [brief, setBrief] = useState({goal:"",audience:"",context:"",method:"",touchLevel:"",count:""});
  const [thinkingStep, setThinkingStep] = useState(0);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [exporting, setExporting] = useState(false);

  const canSubmit = brief.goal.trim().length > 0;

  const searchSteps = [
    "Parsing research brief...",
    "Generating customer query from criteria...",
    "Querying Databricks warehouse...",
    "Filtering by engagement and eligibility...",
    "Ranking by fit score...",
  ];

  const handleSubmit = async () => {
    setPhase("searching");
    setThinkingStep(0);
    setErrorMsg(null);

    // Animate steps while waiting for API
    const stepInterval = setInterval(() => {
      setThinkingStep(prev => prev < searchSteps.length ? prev + 1 : prev);
    }, 800);

    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(brief),
      });

      clearInterval(stepInterval);
      setThinkingStep(searchSteps.length);

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(err.error || 'Search failed');
      }

      const data = await res.json();
      setResult(data);
      // Brief pause so final step is visible
      await new Promise(r => setTimeout(r, 400));
      setPhase("preview");
    } catch (err) {
      clearInterval(stepInterval);
      setErrorMsg(err.message);
      setPhase("error");
    }
  };

  const handleViewAll = () => {
    setPhase("allResults");
  };

  const handleReset = () => {
    setPhase("brief");
    setBrief({goal:"",audience:"",context:"",method:"",touchLevel:"",count:""});
    setResult(null);
    setErrorMsg(null);
  };

  const handleExport = async () => {
    if (!result) return;
    setExporting(true);
    try {
      const allCustomers = [...result.previewCustomers, ...result.remainingCustomers];
      const res = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customers: allCustomers, brief }),
      });
      const data = await res.json();
      if (data.csv) {
        const blob = new Blob([data.csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = data.filename || 'customer-research-export.csv';
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      alert('Export failed: ' + err.message);
    } finally {
      setExporting(false);
    }
  };

  const allCustomers = result ? [...result.previewCustomers, ...result.remainingCustomers] : [];

  return (
    <div style={{fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",background:C.mono100,minHeight:"100vh"}}>
      {/* Header */}
      <div className="header" style={{background:C.mono0,borderBottom:`1px solid ${C.mono300}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:1.5,color:C.purple500,textTransform:"uppercase",marginBottom:2}}>Homebase Research</div>
          <h1 style={{margin:0,fontSize:20,fontWeight:700,color:C.mono900}}>Customer finder</h1>
        </div>
        {phase!=="brief" && (
          <button onClick={handleReset} style={{padding:"8px 16px",borderRadius:8,border:`1.5px solid ${C.mono300}`,background:C.mono0,color:C.mono700,fontSize:13,fontWeight:500,cursor:"pointer"}}>New brief</button>
        )}
      </div>

      {/* BRIEF */}
      {phase==="brief" && (
        <div style={{maxWidth:600,margin:"0 auto",padding:"32px 24px"}}>
          <div style={{textAlign:"center",marginBottom:28}}>
            <h2 style={{margin:"0 0 6px",fontSize:20,fontWeight:700,color:C.mono900}}>Describe who you're looking for</h2>
            <p style={{margin:0,fontSize:13,color:C.mono500}}>We'll query Databricks across engaged customers and return the best matches.</p>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:18}}>
            {BRIEF_FIELDS.map(f=>(
              <div key={f.key}>
                <label style={{display:"flex",alignItems:"center",gap:6,fontSize:13,fontWeight:600,color:C.mono900,marginBottom:4}}>
                  {f.label}
                  {f.required && <span style={{fontSize:10,color:C.purple500,fontWeight:500}}>Required</span>}
                </label>
                {f.hint && <div style={{fontSize:12,color:C.mono500,marginBottom:4}}>{f.hint}</div>}
                {f.type==="textarea" ? (
                  <textarea value={brief[f.key]} onChange={e=>setBrief(prev=>({...prev,[f.key]:e.target.value}))} placeholder={f.placeholder}
                    rows={f.key==="goal"?3:2}
                    style={{width:"100%",padding:"10px 14px",borderRadius:8,border:`1.5px solid ${brief[f.key]?C.purple500:C.mono300}`,background:brief[f.key]?C.purple100:C.mono0,color:C.mono900,fontSize:14,outline:"none",boxSizing:"border-box",resize:"vertical",fontFamily:"inherit"}} />
                ) : f.type==="select" ? (
                  <div className="brief-select-row">
                    {f.options.map(o=>(
                      <button key={o} onClick={()=>setBrief(prev=>({...prev,[f.key]:prev[f.key]===o?"":o}))}
                        style={{padding:"7px 14px",borderRadius:8,fontSize:12,fontWeight:500,cursor:"pointer",
                          border:`1.5px solid ${brief[f.key]===o?C.purple500:C.mono300}`,
                          background:brief[f.key]===o?C.purple100:C.mono0,
                          color:brief[f.key]===o?C.purple700:C.mono700,
                        }}>{o}</button>
                    ))}
                  </div>
                ) : (
                  <input value={brief[f.key]} onChange={e=>setBrief(prev=>({...prev,[f.key]:e.target.value}))} placeholder={f.placeholder}
                    style={{width:"100%",padding:"10px 14px",borderRadius:8,border:`1.5px solid ${brief[f.key]?C.purple500:C.mono300}`,background:brief[f.key]?C.purple100:C.mono0,color:C.mono900,fontSize:14,outline:"none",boxSizing:"border-box"}} />
                )}
              </div>
            ))}
          </div>
          <button onClick={handleSubmit} disabled={!canSubmit}
            style={{width:"100%",marginTop:24,padding:"14px 0",borderRadius:8,border:"none",
              background:canSubmit?C.purple500:C.mono300,color:canSubmit?"#fff":C.mono500,
              fontWeight:600,fontSize:14,cursor:canSubmit?"pointer":"not-allowed"}}>
            Find customers
          </button>
        </div>
      )}

      {/* SEARCHING */}
      {phase==="searching" && (
        <div style={{maxWidth:480,margin:"0 auto",padding:"80px 24px",textAlign:"center"}}>
          <div style={{width:48,height:48,borderRadius:12,background:C.purple100,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",fontSize:20}}>
            <span style={{animation:"spin 1.5s linear infinite",display:"inline-block"}}>⚡</span>
          </div>
          <h3 style={{margin:"0 0 6px",fontSize:17,fontWeight:700,color:C.mono900}}>Searching your customer base...</h3>
          <p style={{margin:"0 0 20px",fontSize:12,color:C.mono500}}>First query may take 1-2 min while the warehouse warms up.</p>
          <div style={{display:"flex",flexDirection:"column",gap:8,textAlign:"left"}}>
            {searchSteps.map((t,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 14px",borderRadius:8,background:i<thinkingStep?C.purple100:C.mono0,border:`1px solid ${i<thinkingStep?C.purple300:C.mono300}`,transition:"all 0.3s"}}>
                <span style={{fontSize:13}}>{i<thinkingStep?"✅":"⏳"}</span>
                <span style={{fontSize:13,color:i<thinkingStep?C.purple700:C.mono500,fontWeight:i<thinkingStep?500:400}}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ERROR */}
      {phase==="error" && (
        <div style={{maxWidth:480,margin:"0 auto",padding:"80px 24px",textAlign:"center"}}>
          <div style={{fontSize:32,marginBottom:16}}>⚠️</div>
          <h3 style={{margin:"0 0 8px",fontSize:17,fontWeight:700,color:C.mono900}}>Search failed</h3>
          <p style={{margin:"0 0 20px",fontSize:13,color:C.mono500}}>{errorMsg}</p>
          <button onClick={handleReset} style={{padding:"10px 24px",borderRadius:8,border:"none",background:C.purple500,color:"#fff",fontWeight:600,fontSize:14,cursor:"pointer"}}>Try again</button>
        </div>
      )}

      {/* PREVIEW */}
      {phase==="preview" && result && (
        <div style={{maxWidth:680,margin:"0 auto",padding:"24px 24px"}}>
          <div style={{padding:14,background:C.mono0,borderRadius:10,border:`1px solid ${C.mono300}`,marginBottom:16}}>
            <div style={{fontSize:10,fontWeight:700,color:C.purple700,textTransform:"uppercase",letterSpacing:.5,marginBottom:4}}>Your brief</div>
            <div style={{fontSize:14,fontWeight:600,color:C.mono900,marginBottom:2}}>{brief.goal}</div>
            <div style={{display:"flex",gap:10,fontSize:12,color:C.mono500,flexWrap:"wrap"}}>
              {brief.audience && <span>Audience: {brief.audience}</span>}
              {brief.method && <span>Method: {brief.method}</span>}
              {brief.touchLevel && <span>Touch: {brief.touchLevel}</span>}
              {brief.count && <span>Need: {brief.count}</span>}
            </div>
          </div>
          <div style={{padding:12,background:C.mono900,borderRadius:8,marginBottom:16,fontFamily:"'SF Mono',Monaco,Consolas,monospace"}}>
            <div style={{fontSize:10,color:C.purple400,marginBottom:6,fontFamily:"-apple-system,sans-serif",fontWeight:600,textTransform:"uppercase",letterSpacing:.5}}>Generated query</div>
            <div style={{fontSize:11,color:C.purple300,lineHeight:1.5,wordBreak:"break-all",whiteSpace:"pre-wrap"}}>{result.queryPreview}</div>
          </div>
          <div style={{fontSize:14,color:C.mono700,marginBottom:16,lineHeight:1.5}}>{result.summary}</div>
          <div className="preview-banner">
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:16}}>👀</span>
              <div>
                <div style={{fontSize:13,fontWeight:600,color:C.purple900}}>Showing top 2 of {result.totalMatches} matches</div>
                <div style={{fontSize:12,color:C.purple700}}>This is a preview — view all matches to see the full list</div>
              </div>
            </div>
            <span className="preview-badge" style={{fontSize:12,fontWeight:600,color:C.purple500,background:C.mono0,padding:"4px 12px",borderRadius:6,border:`1px solid ${C.purple300}`}}>Preview</span>
          </div>
          <div style={{marginBottom:20}}>
            {result.previewCustomers.map((c,i)=><CustomerCard key={i} c={c} />)}
          </div>
          {result.remainingCustomers.length > 0 && (
            <div style={{padding:"16px",background:C.mono0,borderRadius:10,border:`1.5px dashed ${C.mono400}`,marginBottom:20,textAlign:"center"}}>
              <div style={{fontSize:14,fontWeight:600,color:C.mono700,marginBottom:4}}>+{result.remainingCustomers.length} more customers match your criteria</div>
              <div style={{fontSize:12,color:C.mono500}}>View all matches to see the complete list with fit scores and contact details</div>
            </div>
          )}
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {result.remainingCustomers.length > 0 && (
              <button onClick={handleViewAll} style={{width:"100%",padding:"14px 0",borderRadius:8,border:"none",background:C.purple500,color:"#fff",fontWeight:600,fontSize:14,cursor:"pointer"}}>
                View all {result.totalMatches} matches
              </button>
            )}
            <div className="btn-row">
              <button onClick={handleExport} disabled={exporting}
                style={{flex:1,padding:"11px 0",borderRadius:8,border:`1.5px solid ${C.mono300}`,background:C.mono0,color:C.mono700,fontWeight:600,fontSize:13,cursor:exporting?"wait":"pointer"}}>
                {exporting ? "Exporting..." : "Export to CSV"}
              </button>
              <button onClick={handleReset} style={{flex:1,padding:"11px 0",borderRadius:8,border:`1.5px solid ${C.mono300}`,background:C.mono0,color:C.mono500,fontWeight:500,fontSize:13,cursor:"pointer"}}>
                Refine brief
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ALL RESULTS */}
      {phase==="allResults" && result && (
        <div style={{maxWidth:680,margin:"0 auto",padding:"24px 24px"}}>
          <div style={{padding:14,background:C.mono0,borderRadius:10,border:`1px solid ${C.mono300}`,marginBottom:16}}>
            <div style={{fontSize:10,fontWeight:700,color:C.purple700,textTransform:"uppercase",letterSpacing:.5,marginBottom:4}}>Your brief</div>
            <div style={{fontSize:14,fontWeight:600,color:C.mono900,marginBottom:2}}>{brief.goal}</div>
            <div style={{display:"flex",gap:10,fontSize:12,color:C.mono500,flexWrap:"wrap"}}>
              {brief.audience && <span>Audience: {brief.audience}</span>}
              {brief.method && <span>Method: {brief.method}</span>}
              {brief.touchLevel && <span>Touch: {brief.touchLevel}</span>}
              {brief.count && <span>Need: {brief.count}</span>}
            </div>
          </div>
          <div style={{padding:12,background:C.mono900,borderRadius:8,marginBottom:16,fontFamily:"'SF Mono',Monaco,Consolas,monospace"}}>
            <div style={{fontSize:10,color:C.purple400,marginBottom:6,fontFamily:"-apple-system,sans-serif",fontWeight:600,textTransform:"uppercase",letterSpacing:.5}}>Generated query</div>
            <div style={{fontSize:11,color:C.purple300,lineHeight:1.5,wordBreak:"break-all",whiteSpace:"pre-wrap"}}>{result.queryPreview}</div>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div style={{fontSize:14,fontWeight:600,color:C.mono900}}>All {allCustomers.length} matches</div>
            <div style={{fontSize:12,color:C.mono500}}>Sorted by fit score</div>
          </div>
          <div style={{marginBottom:20}}>
            {allCustomers.map((c,i)=><CustomerCard key={i} c={c} />)}
          </div>
          <div className="btn-row">
            <button onClick={handleExport} disabled={exporting}
              style={{flex:1,padding:"11px 0",borderRadius:8,border:`1.5px solid ${C.mono300}`,background:C.mono0,color:C.mono700,fontWeight:600,fontSize:13,cursor:exporting?"wait":"pointer"}}>
              {exporting ? "Exporting..." : "Export to CSV"}
            </button>
            <button onClick={handleReset} style={{flex:1,padding:"11px 0",borderRadius:8,border:`1.5px solid ${C.mono300}`,background:C.mono0,color:C.mono500,fontWeight:500,fontSize:13,cursor:"pointer"}}>
              Refine brief
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
