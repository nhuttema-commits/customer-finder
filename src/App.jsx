import { useState } from "react";

// === DESIGN TOKENS (Homebase DesignBase) ===
const C = {
  purple100:"#f1ecff",purple300:"#cdc0f3",purple400:"#9c7edb",purple500:"#7e3dd4",purple700:"#52258f",purple900:"#1e0b3a",
  mono0:"#fff",mono100:"#f2f2ec",mono300:"#e6e4d6",mono400:"#c0bda2",mono500:"#9e9c88",mono700:"#605f56",mono900:"#1e0b3a",
  red:"#c0392b",green:"#27ae60",amber:"#e67e22",blue:"#2980b9",
};
const SRC_COLORS = {Website:C.blue,LinkedIn:"#0a66c2",Yelp:"#d32323",Amplitude:C.purple500,CRM:C.mono500,Instagram:"#e1306c"};

// === SAMPLE DATA (replace with real API calls) ===
// TODO (Keyvan): Replace PREVIEW_RESULTS with real Databricks query results.
// The frontend sends a `brief` object from handleSubmit with these fields:
//   - goal (string) — the research question
//   - audience (string) — target audience description
//   - context (string) — additional constraints
//   - method (string) — research method (interview, survey, etc.)
//   - touchLevel (string) — interaction history preference
//   - count (string) — number of participants needed
//
// The backend should return an object shaped like:
// {
//   summary: "Found 14 customers matching...",
//   queryPreview: "SELECT * FROM customers WHERE ...",
//   totalMatches: 14,
//   previewCustomers: [ ...first 2 customers ],
//   remainingCustomers: [ ...rest of matches ]
// }
//
// Each customer object shape:
// {
//   name, industry, city, plan, employees, locations, tenure,
//   activeScore, fitScore,
//   tags: [{ l: "Label", s: "Source", c: 0.95 }],
//   contact: { name, title, channel, rate, source },
//   lastContact: { by, daysAgo, reason, channel } | null,
//   matchReason: "Why this customer fits..."
// }

const PREVIEW_RESULTS = {
  churn: {
    summary: "Found 14 customers matching your criteria.",
    queryPreview: "SELECT * FROM customers WHERE is_franchise = true AND tenure_months BETWEEN 8 AND 18 AND churn_risk_score > 0.6 ORDER BY fit_score DESC",
    previewCustomers: [
      {
        name:"Subway - Phoenix #3",industry:"Restaurant",city:"Phoenix, AZ",plan:"Plus",employees:18,locations:3,tenure:"11 months",activeScore:32,fitScore:94,
        tags:[{l:"Franchise",s:"LinkedIn",c:.95},{l:"Seasonal",s:"Amplitude",c:.78},{l:"At-risk",s:"Amplitude",c:.88},{l:"Multi-location",s:"Website",c:.92}],
        contact:{name:"Maria Garcia",title:"Franchise Owner",channel:"Email",rate:78,source:"CRM"},
        lastContact:{by:"Sarah L.",daysAgo:95,reason:"NPS follow-up call",channel:"Zoom"},
        matchReason:"Churned at month 11. Usage dropped 80% in final 3 months across all 3 locations. Never adopted payroll despite being on Plus plan.",
      },
      {
        name:"Anytime Fitness - Austin",industry:"Fitness",city:"Austin, TX",plan:"Essentials",employees:12,locations:1,tenure:"13 months",activeScore:28,fitScore:89,
        tags:[{l:"Franchise",s:"LinkedIn",c:.95},{l:"Growing fast",s:"Amplitude",c:.72},{l:"Tech-savvy",s:"Website",c:.81},{l:"High social presence",s:"Instagram",c:.77}],
        contact:{name:"Sarah Johnson",title:"Owner",channel:"Phone",rate:82,source:"CRM"},
        lastContact:null,
        matchReason:"Churned at month 13. Was initially a power user — daily logins for first 6 months, then steep drop-off around month 8. Never contacted by Homebase.",
      },
    ],
    remainingCustomers: [
      {name:"Great Clips - Denver #2",industry:"Beauty",city:"Denver, CO",plan:"Plus",employees:9,locations:2,tenure:"9 months",activeScore:22,fitScore:87,
        tags:[{l:"Franchise",s:"LinkedIn",c:.95},{l:"Multi-location",s:"Website",c:.88}],
        contact:{name:"David Chen",title:"District Manager",channel:"LinkedIn",rate:65,source:"LinkedIn"},
        lastContact:{by:"Alex T.",daysAgo:110,reason:"Feature discovery research",channel:"Email"},
        matchReason:"Churned at month 9. Never adopted payroll module. Last support ticket cited setup complexity."},
      {name:"Planet Fitness - Miami",industry:"Fitness",city:"Miami, FL",plan:"Essentials",employees:14,locations:1,tenure:"10 months",activeScore:35,fitScore:83,
        tags:[{l:"Franchise",s:"LinkedIn",c:.95},{l:"Tech-savvy",s:"Website",c:.79},{l:"High social presence",s:"Instagram",c:.84}],
        contact:{name:"Amanda Brown",title:"General Manager",channel:"Email",rate:55,source:"CRM"},
        lastContact:null,
        matchReason:"Activity dropped 60% between months 7-10. Only using 2 of 6 available features. Pattern matches pre-churn signals."},
      {name:"Sport Clips - Portland",industry:"Beauty",city:"Portland, OR",plan:"Basic",employees:7,locations:1,tenure:"8 months",activeScore:19,fitScore:81,
        tags:[{l:"Franchise",s:"LinkedIn",c:.95},{l:"Seasonal",s:"Amplitude",c:.65}],
        contact:{name:"Kevin Taylor",title:"Store Manager",channel:"Phone",rate:70,source:"CRM"},
        lastContact:{by:"Casey D.",daysAgo:140,reason:"Onboarding interview",channel:"Zoom"},
        matchReason:"Churned at month 8. Very short tenure. Minimal feature adoption — only used basic scheduling."},
      {name:"Jersey Mike's - Chicago",industry:"Restaurant",city:"Chicago, IL",plan:"Plus",employees:22,locations:3,tenure:"12 months",activeScore:38,fitScore:80,
        tags:[{l:"Franchise",s:"LinkedIn",c:.95},{l:"Enterprise behavior",s:"CRM",c:.72},{l:"Multi-location",s:"Website",c:.90}],
        contact:{name:"Tom Williams",title:"Regional Director",channel:"Email",rate:71,source:"LinkedIn"},
        lastContact:{by:"Keyvan M.",daysAgo:45,reason:"Payroll research study",channel:"Zoom"},
        matchReason:"Usage declining steadily. Down 45% over last 2 months. Still active on scheduling but dropped payroll entirely."},
      {name:"Supercuts - Atlanta",industry:"Beauty",city:"Atlanta, GA",plan:"Basic",employees:6,locations:1,tenure:"11 months",activeScore:25,fitScore:78,
        tags:[{l:"Franchise",s:"LinkedIn",c:.95},{l:"At-risk",s:"Amplitude",c:.82}],
        contact:{name:"Rachel Martinez",title:"Owner",channel:"Email",rate:62,source:"CRM"},
        lastContact:null,
        matchReason:"Churned at month 11. Only ever used time tracking. Never explored scheduling or payroll features."},
      {name:"Orangetheory - Seattle",industry:"Fitness",city:"Seattle, WA",plan:"Essentials",employees:10,locations:1,tenure:"14 months",activeScore:30,fitScore:77,
        tags:[{l:"Franchise",s:"LinkedIn",c:.95},{l:"High social presence",s:"Instagram",c:.88},{l:"Modern website",s:"Website",c:.75}],
        contact:{name:"Jordan Lee",title:"Studio Manager",channel:"Phone",rate:74,source:"CRM"},
        lastContact:{by:"Morgan W.",daysAgo:80,reason:"Expansion pilot outreach",channel:"Email"},
        matchReason:"Churned at month 14. Had strong initial engagement but cited 'outgrowing the platform' in exit survey."},
      {name:"Massage Envy - Dallas",industry:"Services",city:"Dallas, TX",plan:"Plus",employees:16,locations:2,tenure:"10 months",activeScore:27,fitScore:76,
        tags:[{l:"Franchise",s:"LinkedIn",c:.95},{l:"Multi-location",s:"Website",c:.85},{l:"Scheduling heavy",s:"Amplitude",c:.71}],
        contact:{name:"Nicole Harris",title:"Operations Manager",channel:"Email",rate:68,source:"CRM"},
        lastContact:null,
        matchReason:"Churned at month 10. Was a heavy scheduling user but never adopted other modules. Multi-location complexity may have been a factor."},
      {name:"Kumon - Charlotte",industry:"Education",city:"Charlotte, NC",plan:"Basic",employees:5,locations:1,tenure:"9 months",activeScore:20,fitScore:74,
        tags:[{l:"Franchise",s:"LinkedIn",c:.95},{l:"Independent",s:"CRM",c:.60}],
        contact:{name:"Pat Clark",title:"Center Director",channel:"Email",rate:58,source:"CRM"},
        lastContact:{by:"Riley S.",daysAgo:130,reason:"NPS follow-up call",channel:"Phone"},
        matchReason:"Churned at month 9. Education franchise — different use case than typical HB customer. Worth understanding if product-market fit was the issue."},
      {name:"European Wax Center - Austin",industry:"Beauty",city:"Austin, TX",plan:"Essentials",employees:11,locations:1,tenure:"12 months",activeScore:33,fitScore:73,
        tags:[{l:"Franchise",s:"LinkedIn",c:.95},{l:"High Yelp rating",s:"Yelp",c:.91}],
        contact:{name:"Sam Young",title:"Owner",channel:"Phone",rate:76,source:"CRM"},
        lastContact:null,
        matchReason:"Churned right at the 12-month mark. Good Yelp reputation suggests a successful business that chose to leave — product issue, not business issue."},
      {name:"Jiffy Lube - Phoenix",industry:"Automotive",city:"Phoenix, AZ",plan:"Basic",employees:8,locations:1,tenure:"8 months",activeScore:18,fitScore:71,
        tags:[{l:"Franchise",s:"LinkedIn",c:.95},{l:"At-risk",s:"Amplitude",c:.77}],
        contact:{name:"Alex Garcia",title:"Store Manager",channel:"Phone",rate:52,source:"CRM"},
        lastContact:{by:"Sarah L.",daysAgo:160,reason:"Churn risk check-in",channel:"Phone"},
        matchReason:"Churned at month 8. Automotive franchise — niche vertical. Was flagged as at-risk early but intervention didn't prevent churn."},
      {name:"Subway - Denver",industry:"Restaurant",city:"Denver, CO",plan:"Plus",employees:20,locations:4,tenure:"13 months",activeScore:31,fitScore:70,
        tags:[{l:"Franchise",s:"LinkedIn",c:.95},{l:"Multi-location",s:"Website",c:.93},{l:"Enterprise behavior",s:"CRM",c:.68}],
        contact:{name:"Mike Martinez",title:"Franchise Owner",channel:"LinkedIn",rate:60,source:"LinkedIn"},
        lastContact:{by:"Casey D.",daysAgo:110,reason:"NPS follow-up call",channel:"Zoom"},
        matchReason:"Churned at month 13. 4-location operation. Explored Homebase payroll but didn't activate — franchise corporate may mandate a different provider."},
    ],
    totalMatches: 14,
  },
  payroll: {
    summary: "Found 22 customers matching your criteria.",
    queryPreview: "SELECT * FROM customers WHERE payroll_setup_started = true AND payroll_setup_completed = false AND plan IN ('Plus','Enterprise') ORDER BY fit_score DESC",
    previewCustomers: [
      {name:"Peak Performance Gym",industry:"Fitness",city:"Denver, CO",plan:"Plus",employees:12,locations:2,tenure:"16 months",activeScore:76,fitScore:94,
        tags:[{l:"Multi-location",s:"Website",c:.91},{l:"Tech-savvy",s:"Website",c:.85},{l:"High engagement",s:"Amplitude",c:.82},{l:"Scheduling heavy",s:"Amplitude",c:.88}],
        contact:{name:"Rachel Davis",title:"Owner",channel:"Email",rate:82,source:"CRM"},lastContact:null,
        matchReason:"Got to step 3 of 5 in payroll setup. Has 12 employees on scheduling but processes payroll externally. Never contacted — fresh lead."},
      {name:"The Cutting Edge",industry:"Beauty",city:"Seattle, WA",plan:"Plus",employees:8,locations:1,tenure:"10 months",activeScore:68,fitScore:88,
        tags:[{l:"High social presence",s:"Instagram",c:.83},{l:"Growing fast",s:"Amplitude",c:.71},{l:"Independent",s:"CRM",c:1}],
        contact:{name:"Nicole White",title:"Store Manager",channel:"Phone",rate:68,source:"CRM"},
        lastContact:{by:"Jordan P.",daysAgo:75,reason:"Onboarding interview",channel:"Zoom"},
        matchReason:"Started payroll setup twice, abandoned both times at tax configuration step. The double attempt signals interest but a specific blocker."},
    ],
    remainingCustomers: [
      {name:"Blue Sky Dental",industry:"Healthcare",city:"San Francisco, CA",plan:"Plus",employees:14,locations:1,tenure:"14 months",activeScore:72,fitScore:86,
        tags:[{l:"Enterprise behavior",s:"CRM",c:.78},{l:"Scheduling heavy",s:"Amplitude",c:.82},{l:"Tech-savvy",s:"Website",c:.80}],
        contact:{name:"Sarah Johnson",title:"Operations Manager",channel:"Email",rate:75,source:"CRM"},lastContact:null,
        matchReason:"Plus plan for 14 months. Heavy scheduling and time tracking user but zero payroll interaction. Likely doesn't know it's included."},
      {name:"Bright Smiles Pediatric",industry:"Healthcare",city:"Austin, TX",plan:"Plus",employees:12,locations:1,tenure:"8 months",activeScore:65,fitScore:82,
        tags:[{l:"Growing fast",s:"Amplitude",c:.74},{l:"Hiring actively",s:"LinkedIn",c:.69}],
        contact:{name:"Chris Anderson",title:"Owner",channel:"Phone",rate:70,source:"CRM"},
        lastContact:{by:"Morgan W.",daysAgo:30,reason:"Expansion pilot outreach",channel:"Email"},
        matchReason:"Recently grew from 5 to 12 employees. Active hiring signals a payroll need that isn't being met on-platform."},
    ],
    totalMatches: 22,
  },
  scheduling: {
    summary: "Found 18 customers matching your criteria.",
    queryPreview: "SELECT * FROM customers WHERE scheduling_usage_tier = 'power' AND employee_count > 10 ORDER BY fit_score DESC",
    previewCustomers: [
      {name:"Mama's Kitchen",industry:"Restaurant",city:"San Francisco, CA",plan:"Enterprise",employees:15,locations:1,tenure:"24 months",activeScore:96,fitScore:95,
        tags:[{l:"Power user",s:"Amplitude",c:.94},{l:"Tech-savvy",s:"Website",c:.88},{l:"High Yelp rating",s:"Yelp",c:.97},{l:"Uses online ordering",s:"Website",c:.85}],
        contact:{name:"Lisa Anderson",title:"Owner",channel:"Phone",rate:90,source:"CRM"},
        lastContact:{by:"Nick R.",daysAgo:65,reason:"Feature discovery research",channel:"Zoom"},
        matchReason:"Uses auto-scheduling for 15 employees. Logs in 6x/day. Adopted every new scheduling feature within a week of release."},
      {name:"The Grill House",industry:"Restaurant",city:"Portland, OR",plan:"Plus",employees:22,locations:2,tenure:"14 months",activeScore:84,fitScore:89,
        tags:[{l:"Growing fast",s:"Amplitude",c:.79},{l:"Multi-location",s:"Website",c:.93},{l:"Recently expanded",s:"LinkedIn",c:.72},{l:"Hiring actively",s:"LinkedIn",c:.68}],
        contact:{name:"Kevin Taylor",title:"General Manager",channel:"Email",rate:72,source:"LinkedIn"},lastContact:null,
        matchReason:"Manages 2 locations with complex rotating schedules. Highest shift-swap usage in the dataset. Recently opened second location — never contacted."},
    ],
    remainingCustomers: [
      {name:"Ember & Oak BBQ",industry:"Restaurant",city:"Chicago, IL",plan:"Plus",employees:18,locations:1,tenure:"20 months",activeScore:88,fitScore:86,
        tags:[{l:"High social presence",s:"Instagram",c:.85},{l:"High Yelp rating",s:"Yelp",c:.92},{l:"Tech-savvy",s:"Website",c:.80}],
        contact:{name:"Dan Thomas",title:"Owner",channel:"Email",rate:68,source:"CRM"},
        lastContact:{by:"Sarah L.",daysAgo:40,reason:"Scheduling feedback session",channel:"Zoom"},
        matchReason:"Built custom schedule templates. Only restaurant using labor cost forecasting feature."},
    ],
    totalMatches: 18,
  },
  default: {
    summary: "Found 26 customers matching your criteria.",
    queryPreview: "SELECT * FROM customers WHERE active_score > 50 ORDER BY fit_score DESC",
    previewCustomers: [
      {name:"Subway - San Francisco",industry:"Restaurant",city:"San Francisco, CA",plan:"Enterprise",employees:24,locations:5,tenure:"18 months",activeScore:92,fitScore:91,
        tags:[{l:"Franchise",s:"LinkedIn",c:.95},{l:"Multi-location",s:"Website",c:.96},{l:"Power user",s:"Amplitude",c:.88},{l:"High social presence",s:"Instagram",c:.81}],
        contact:{name:"Jessica Rodriguez",title:"Franchise Owner",channel:"Phone",rate:88,source:"CRM"},
        lastContact:{by:"Nick R.",daysAgo:60,reason:"Beta testing invitation",channel:"Email"},
        matchReason:"Highly engaged across all product areas. Expanded from 2 to 5 locations on platform. Strong response history."},
      {name:"Peak Performance Gym",industry:"Fitness",city:"Denver, CO",plan:"Plus",employees:12,locations:2,tenure:"16 months",activeScore:76,fitScore:87,
        tags:[{l:"Multi-location",s:"Website",c:.91},{l:"Tech-savvy",s:"Website",c:.85},{l:"High engagement",s:"Amplitude",c:.82}],
        contact:{name:"Rachel Davis",title:"Owner",channel:"Email",rate:82,source:"CRM"},lastContact:null,
        matchReason:"Active multi-location customer with strong engagement. Never contacted — high-value fresh lead."},
    ],
    remainingCustomers: [
      {name:"Great Clips - Seattle",industry:"Beauty",city:"Seattle, WA",plan:"Plus",employees:11,locations:4,tenure:"24 months",activeScore:85,fitScore:86,
        tags:[{l:"Franchise",s:"LinkedIn",c:.95},{l:"Tech-savvy",s:"Website",c:.83},{l:"Growing fast",s:"Amplitude",c:.78}],
        contact:{name:"Chris Miller",title:"Owner",channel:"LinkedIn",rate:73,source:"LinkedIn"},lastContact:null,
        matchReason:"24 months in. Highest engagement score among franchises. Could reveal what stickiness looks like."},
    ],
    totalMatches: 26,
  },
};

function matchResult(goal, audience, context) {
  const all = `${goal} ${audience} ${context}`.toLowerCase();
  if(all.includes("churn")||all.includes("leave")||all.includes("cancel")||all.includes("retain")) return "churn";
  if(all.includes("payroll")||all.includes("pay run")) return "payroll";
  if(all.includes("schedul")||all.includes("shift")) return "scheduling";
  return "default";
}

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
  return (
    <div style={{background:C.mono0,borderRadius:12,border:`1.5px solid ${C.mono300}`,overflow:"hidden",marginBottom:8}}>
      <div onClick={()=>setOpen(!open)} style={{padding:"16px 18px",cursor:"pointer"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
          <div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
              <span style={{fontWeight:700,fontSize:15,color:C.mono900}}>{c.name}</span>
              <span style={{fontSize:12,color:C.mono500}}>{c.industry}</span>
            </div>
            <div style={{display:"flex",gap:10,fontSize:12,color:C.mono500}}>
              <span>{c.city}</span><span>{c.employees} employees</span><span>{c.locations} loc</span><span>{c.plan}</span><span>{c.tenure}</span>
            </div>
          </div>
          <div style={{textAlign:"right",flexShrink:0,marginLeft:16}}>
            <div style={{fontSize:10,color:C.mono500,marginBottom:1}}>Fit score</div>
            <div style={{fontSize:22,fontWeight:700,color:c.fitScore>85?C.green:c.fitScore>65?C.amber:C.mono500}}>{c.fitScore}</div>
          </div>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 12px",background:C.mono100,borderRadius:8,marginBottom:8}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:32,height:32,borderRadius:"50%",background:C.purple300,display:"flex",alignItems:"center",justifyContent:"center",color:C.purple900,fontWeight:700,fontSize:12}}>
              {c.contact.name.split(" ").map(n=>n[0]).join("")}
            </div>
            <div>
              <div style={{fontSize:13,fontWeight:600,color:C.mono900}}>{c.contact.name}</div>
              <div style={{fontSize:11,color:C.mono500}}>{c.contact.title} · Prefers {c.contact.channel.toLowerCase()}</div>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <span style={{fontSize:11,color:C.mono500}}>Response rate:</span>
            <span style={{fontSize:13,fontWeight:700,color:c.contact.rate>70?C.green:c.contact.rate>40?C.amber:C.red}}>{c.contact.rate}%</span>
            <span style={{fontSize:10,color:C.mono400,display:"flex",alignItems:"center",gap:3,marginLeft:4}}>
              <span style={{width:6,height:6,borderRadius:"50%",background:SRC_COLORS[c.contact.source]}} />via {c.contact.source}
            </span>
          </div>
        </div>
        {c.lastContact ? (
          <div style={{display:"flex",alignItems:"center",gap:6,fontSize:11,color:C.mono500,marginBottom:8}}>
            <span style={{color:c.lastContact.daysAgo<30?C.amber:C.mono500}}>●</span>
            Last contacted {c.lastContact.daysAgo}d ago by <span style={{fontWeight:600,color:C.mono700}}>{c.lastContact.by}</span> — {c.lastContact.reason} via {c.lastContact.channel}
          </div>
        ) : (
          <div style={{fontSize:11,color:C.green,marginBottom:8}}>● Never contacted by Homebase — fresh lead</div>
        )}
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
                  <span style={{width:7,height:7,borderRadius:"50%",background:SRC_COLORS[t.s]}} />
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
  const [phase, setPhase] = useState("brief"); // brief | searching | preview | loadingAll | allResults
  const [brief, setBrief] = useState({goal:"",audience:"",context:"",method:"",touchLevel:"",count:""});
  const [thinkingStep, setThinkingStep] = useState(0);
  const [result, setResult] = useState(null);
  const [loadingAllStep, setLoadingAllStep] = useState(0);

  const canSubmit = brief.goal.trim().length > 0;

  const searchSteps = [
    "Parsing research brief...",
    "Generating customer query from criteria...",
    "Querying customer database (200k customers)...",
    "Enriching results with external data...",
    "Ranking by fit score...",
  ];

  const loadAllSteps = [
    "Loading remaining customer matches...",
    "Enriching contact information...",
    "Calculating fit scores...",
  ];

  // TODO (Keyvan): Replace the mock data lookup below with a real API call.
  // Send `brief` object to your backend, which runs the Databricks query
  // and returns the result in the shape described at the top of this file.
  const handleSubmit = () => {
    setPhase("searching");
    setThinkingStep(0);
    searchSteps.forEach((_,i)=>{
      setTimeout(()=>setThinkingStep(i+1), (i+1)*700);
    });
    setTimeout(()=>{
      const key = matchResult(brief.goal, brief.audience, brief.context);
      setResult(PREVIEW_RESULTS[key]);
      setPhase("preview");
    }, searchSteps.length*700+400);
  };

  const handleViewAll = () => {
    setPhase("loadingAll");
    setLoadingAllStep(0);
    loadAllSteps.forEach((_,i)=>{
      setTimeout(()=>setLoadingAllStep(i+1), (i+1)*600);
    });
    setTimeout(()=>{
      setPhase("allResults");
    }, loadAllSteps.length*600+400);
  };

  const handleReset = () => {
    setPhase("brief");
    setBrief({goal:"",audience:"",context:"",method:"",touchLevel:"",count:""});
    setResult(null);
    setLoadingAllStep(0);
  };

  const allCustomers = result ? [...result.previewCustomers, ...result.remainingCustomers] : [];

  return (
    <div style={{fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",background:C.mono100,minHeight:"100vh"}}>
      {/* Header */}
      <div style={{background:C.mono0,padding:"16px 28px",borderBottom:`1px solid ${C.mono300}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
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
            <p style={{margin:0,fontSize:13,color:C.mono500}}>We'll query across 200k customers and return a preview of the best matches.</p>
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
                  <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
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
          <h3 style={{margin:"0 0 20px",fontSize:17,fontWeight:700,color:C.mono900}}>Searching your customer base...</h3>
          <div style={{display:"flex",flexDirection:"column",gap:8,textAlign:"left"}}>
            {searchSteps.map((t,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 14px",borderRadius:8,background:i<thinkingStep?C.purple100:C.mono0,border:`1px solid ${i<thinkingStep?C.purple300:C.mono300}`,transition:"all 0.3s"}}>
                <span style={{fontSize:13}}>{i<thinkingStep?"✅":"⏳"}</span>
                <span style={{fontSize:13,color:i<thinkingStep?C.purple700:C.mono500,fontWeight:i<thinkingStep?500:400}}>{t}</span>
              </div>
            ))}
          </div>
          <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
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
            <div style={{fontSize:11,color:C.purple300,lineHeight:1.5,wordBreak:"break-all"}}>{result.queryPreview}</div>
          </div>
          <div style={{fontSize:14,color:C.mono700,marginBottom:16,lineHeight:1.5}}>{result.summary}</div>
          <div style={{padding:"12px 16px",background:C.purple100,borderRadius:10,border:`1px solid ${C.purple300}`,marginBottom:12,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:16}}>👀</span>
              <div>
                <div style={{fontSize:13,fontWeight:600,color:C.purple900}}>Showing top 2 of {result.totalMatches} matches</div>
                <div style={{fontSize:12,color:C.purple700}}>This is a preview — view all matches to see the full list</div>
              </div>
            </div>
            <span style={{fontSize:12,fontWeight:600,color:C.purple500,background:C.mono0,padding:"4px 12px",borderRadius:6,border:`1px solid ${C.purple300}`}}>Preview</span>
          </div>
          <div style={{marginBottom:20}}>
            {result.previewCustomers.map((c,i)=><CustomerCard key={i} c={c} />)}
          </div>
          <div style={{padding:"16px",background:C.mono0,borderRadius:10,border:`1.5px dashed ${C.mono400}`,marginBottom:20,textAlign:"center"}}>
            <div style={{fontSize:14,fontWeight:600,color:C.mono700,marginBottom:4}}>+{result.totalMatches - 2} more customers match your criteria</div>
            <div style={{fontSize:12,color:C.mono500}}>View all matches to see the complete list with fit scores and contact details</div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            <button onClick={handleViewAll} style={{width:"100%",padding:"14px 0",borderRadius:8,border:"none",background:C.purple500,color:"#fff",fontWeight:600,fontSize:14,cursor:"pointer"}}>
              View all {result.totalMatches} matches
            </button>
            <div style={{display:"flex",gap:8}}>
              <button style={{flex:1,padding:"11px 0",borderRadius:8,border:`1.5px solid ${C.purple500}`,background:C.mono0,color:C.purple500,fontWeight:600,fontSize:13,cursor:"pointer"}}>
                Contact all {result.totalMatches} customers
              </button>
              <button style={{flex:1,padding:"11px 0",borderRadius:8,border:`1.5px solid ${C.mono300}`,background:C.mono0,color:C.mono700,fontWeight:600,fontSize:13,cursor:"pointer"}}>
                Export to Google Sheets
              </button>
            </div>
            <button onClick={handleReset} style={{width:"100%",padding:"10px 0",borderRadius:8,border:`1.5px solid ${C.mono300}`,background:C.mono0,color:C.mono500,fontWeight:500,fontSize:12,cursor:"pointer"}}>
              Refine brief
            </button>
          </div>
        </div>
      )}

      {/* LOADING ALL */}
      {phase==="loadingAll" && (
        <div style={{maxWidth:480,margin:"0 auto",padding:"80px 24px",textAlign:"center"}}>
          <div style={{width:48,height:48,borderRadius:12,background:C.purple100,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",fontSize:20}}>
            <span style={{animation:"spin 1.5s linear infinite",display:"inline-block"}}>📋</span>
          </div>
          <h3 style={{margin:"0 0 20px",fontSize:17,fontWeight:700,color:C.mono900}}>Loading all {result?.totalMatches} matches...</h3>
          <div style={{display:"flex",flexDirection:"column",gap:8,textAlign:"left"}}>
            {loadAllSteps.map((t,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 14px",borderRadius:8,background:i<loadingAllStep?C.purple100:C.mono0,border:`1px solid ${i<loadingAllStep?C.purple300:C.mono300}`,transition:"all 0.3s"}}>
                <span style={{fontSize:13}}>{i<loadingAllStep?"✅":"⏳"}</span>
                <span style={{fontSize:13,color:i<loadingAllStep?C.purple700:C.mono500,fontWeight:i<loadingAllStep?500:400}}>{t}</span>
              </div>
            ))}
          </div>
          <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
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
            <div style={{fontSize:11,color:C.purple300,lineHeight:1.5,wordBreak:"break-all"}}>{result.queryPreview}</div>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div style={{fontSize:14,fontWeight:600,color:C.mono900}}>All {allCustomers.length} matches</div>
            <div style={{fontSize:12,color:C.mono500}}>Sorted by fit score</div>
          </div>
          <div style={{marginBottom:20}}>
            {allCustomers.map((c,i)=><CustomerCard key={i} c={c} />)}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            <button style={{width:"100%",padding:"14px 0",borderRadius:8,border:"none",background:C.purple500,color:"#fff",fontWeight:600,fontSize:14,cursor:"pointer"}}>
              Contact all {allCustomers.length} customers
            </button>
            <div style={{display:"flex",gap:8}}>
              <button style={{flex:1,padding:"11px 0",borderRadius:8,border:`1.5px solid ${C.mono300}`,background:C.mono0,color:C.mono700,fontWeight:600,fontSize:13,cursor:"pointer"}}>
                Export to Google Sheets
              </button>
              <button onClick={handleReset} style={{flex:1,padding:"11px 0",borderRadius:8,border:`1.5px solid ${C.mono300}`,background:C.mono0,color:C.mono500,fontWeight:500,fontSize:13,cursor:"pointer"}}>
                Refine brief
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}