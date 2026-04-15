"use client";

import { useState, useEffect, use } from "react";
import { 
  ChevronLeft, 
  Info, 
  MessageSquare, 
  Clock, 
  Settings, 
  Plus, 
  Trash2, 
  Variable,
  AlertTriangle,
  Zap,
  Save,
  Check,
  ShieldCheck,
  Cpu,
  Target,
  Rocket,
  UserPlus,
  Linkedin,
  Briefcase,
  Layers,
  Activity,
  ArrowRight,
  Globe,
  Loader2
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewLinkedInCampaignPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const accountId = params.id;
  const router = useRouter();

  const [account, setAccount] = useState(null);
  const [contactLists, setContactLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [listId, setListId] = useState("");
  const [message, setMessage] = useState("");
  const [dailyLimit, setDailyLimit] = useState(20);
  const [minDelay, setMinDelay] = useState(10);
  const [maxDelay, setMaxDelay] = useState(40);
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [stopOnReply, setStopOnReply] = useState(true);
  const [blacklist, setBlacklist] = useState("");
  const [followUps, setFollowUps] = useState([]); 
  
  // LinkedIn Specific
  const [connectionNote, setConnectionNote] = useState("");
  const [sendAfterAccepted, setSendAfterAccepted] = useState(true);
  const [runWithoutProxy, setRunWithoutProxy] = useState(false);

  // Templates State
  const [templates, setTemplates] = useState([]);
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [savingTemplate, setSavingTemplate] = useState(false);

  useEffect(() => {
    fetchData();
    fetchTemplates();
  }, [accountId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [accRes, listsRes] = await Promise.all([
        fetch(`/api/linkedin/accounts/${accountId}`),
        fetch("/api/lists")
      ]);

      if (accRes.ok) setAccount(await accRes.json());
      if (listsRes.ok) setContactLists(await listsRes.json());
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const res = await fetch("/api/templates?platform=linkedin");
      if (res.ok) setTemplates(await res.json());
    } catch (error) {
      console.error("Failed to fetch templates", error);
    }
  };

  const addFollowUp = () => {
    setFollowUps([...followUps, { delayDays: 1, type: "message", message: "" }]);
  };

  const removeFollowUp = (index) => {
    setFollowUps(followUps.filter((_, i) => i !== index));
  };

  const updateFollowUp = (index, field, value) => {
    const newFollowUps = [...followUps];
    newFollowUps[index][field] = value;
    setFollowUps(newFollowUps);
  };

  const insertVariable = (target, variable) => {
    if (target === "main") {
      setMessage(message + variable);
    } else if (target === "note") {
      setConnectionNote(connectionNote + variable);
    } else {
      const newFollowUps = [...followUps];
      newFollowUps[target].message += variable;
      setFollowUps(newFollowUps);
    }
  };

  const handleApplyTemplate = (templateId) => {
    const selected = templates.find(t => t._id === templateId);
    if (selected) {
      if (message && !confirm("This will overwrite your current message. Continue?")) return;
      setMessage(selected.message);
    }
  };

  const handleSaveAsTemplate = async () => {
    if (!templateName || !message) {
      alert("Template name and message are required");
      return;
    }
    setSavingTemplate(true);
    try {
      const res = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: templateName,
          platform: "linkedin",
          message: message
        })
      });
      if (res.ok) {
        setShowSaveTemplate(false);
        setTemplateName("");
        fetchTemplates();
        alert("Template saved successfully!");
      }
    } catch (error) {
      console.error("Error saving template", error);
    } finally {
      setSavingTemplate(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !listId || !message) {
      alert("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        accountId,
        name,
        listId,
        message,
        dailyLimit,
        minDelay,
        maxDelay,
        timezone,
        hours: { start: startTime, end: endTime },
        sequences: followUps,
        stopOnReply,
        blacklist: blacklist.split(",").map(s => s.trim()).filter(Boolean),
        connectionNote,
        sendAfterAccepted,
        runWithoutProxy
      };

      const res = await fetch("/api/linkedin/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        router.push(`/linkedin/${accountId}/campaigns`);
      } else {
        const err = await res.json();
        alert(err.error || "Failed to create campaign");
      }
    } catch (error) {
      console.error("Error creating campaign", error);
      alert("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
     <div className="h-screen w-full flex flex-col items-center justify-center bg-[#F8F4F2] space-y-10 text-center px-10 font-sans">
        <div className="relative">
           <div className="w-20 h-20 border-4 border-[#B78D7D]/10 border-t-[#B78D7D] rounded-full animate-spin shadow-sm" />
           <div className="absolute inset-0 flex items-center justify-center">
              <Linkedin size={32} className="text-[#B78D7D]" fill="currentColor" />
           </div>
        </div>
        <p className="text-[10px] font-black text-[#B2AAA6] uppercase tracking-[0.5em] font-mono">Initializing_Sequence_Inception...</p>
     </div>
  );

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-1000 font-sans pb-32 px-6 lg:px-20">
      <div className="max-w-[1700px] mx-auto space-y-16">
        
        {/* Header Sector */}
        <div className="flex items-center gap-10 border-b border-[#B78D7D]/15 pb-12">
          <Link href={`/linkedin/${accountId}/campaigns`} className="p-5 bg-white border border-[#B78D7D]/10 rounded-[1.5rem] text-[#B2AAA6] hover:text-[#B78D7D] transition-all shadow-sm hover:bg-[#F8F4F2] group">
            <ChevronLeft size={28} className="group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-4 mb-4">
               <span className="px-5 py-2 bg-[#B78D7D]/10 text-[#B78D7D] text-[10px] font-black uppercase tracking-[0.4em] rounded-full border border-[#B78D7D]/20 flex items-center gap-2 font-mono">
                 <Briefcase size={14} className="opacity-80" />
                 LinkedIn_Sector::Sequence_Deployment
               </span>
            </div>
            <h1 className="text-5xl font-black text-[#3E3A39] tracking-tighter uppercase leading-tight">Create_New_Sequence</h1>
            <p className="text-[#8E7A70] mt-4 text-xl font-medium italic">Configuring autonomous outreach for handler: <span className="text-[#B78D7D] font-black">{account?.email}</span></p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-16">
          
          {/* Phase 1: Core Target Identity */}
          <div className="bg-white rounded-[4rem] border border-[#B78D7D]/15 shadow-sm overflow-hidden relative group hover:shadow-[0_40px_80px_rgba(183,141,125,0.05)] transition-all">
            <div className="p-12 border-b border-[#B78D7D]/10 flex items-center gap-8 bg-[#F8F4F2]/30">
              <div className="w-16 h-16 bg-[#F8F4F2] border border-[#B78D7D]/10 text-[#B78D7D] rounded-[1.75rem] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-700">
                <Target size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-[#3E3A39] tracking-tighter uppercase leading-none">Sequence_Registry</h2>
                <p className="text-[10px] font-black text-[#B2AAA6] uppercase tracking-[0.4em] font-mono mt-3 italic">Core Designation & Targeting</p>
              </div>
            </div>
            <div className="p-12 md:p-16 grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-[#B2AAA6] uppercase tracking-[0.4em] font-mono ml-4">Designation_UID</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. HIGH_TRUST_OUTREACH_V1"
                  className="form-input"
                  required
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-[#B2AAA6] uppercase tracking-[0.4em] font-mono ml-4">Authorized_Contact_List</label>
                <div className="relative">
                  <select
                    value={listId}
                    onChange={(e) => setListId(e.target.value)}
                    className="form-input appearance-none cursor-pointer pr-16"
                    required
                  >
                    <option value="" disabled>SELECT_IDENTITY_LIST...</option>
                    {contactLists.map(list => (
                      <option key={list._id} value={list._id}>{list.name.toUpperCase()} — [{list.count} UNITS]</option>
                    ))}
                  </select>
                  <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-[#B2AAA6]">
                    <Layers size={22} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Phase 2: Handshake Protocol */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
             <div className="bg-white rounded-[3.5rem] border border-[#B78D7D]/15 shadow-sm p-12 flex flex-col justify-between group hover:shadow-[0_20px_40px_rgba(183,141,125,0.05)] transition-all">
                <div className="flex items-center gap-8 mb-10">
                   <div className="w-16 h-16 bg-[#F8F4F2] border border-[#B78D7D]/10 text-emerald-500 rounded-[1.75rem] flex items-center justify-center shadow-inner">
                      <ShieldCheck size={32} />
                   </div>
                   <div>
                      <h4 className="text-xl font-black text-[#3E3A39] tracking-tighter uppercase">Connection_Logic</h4>
                      <p className="text-[10px] font-black text-[#B2AAA6] uppercase tracking-[0.3em] font-mono mt-2 italic">Wait For Handshake Acceptance</p>
                   </div>
                </div>
                <div className="flex items-center justify-between p-10 bg-[#F8F4F2]/30 rounded-[2.5rem] border border-[#B78D7D]/10 hover:border-emerald-500/20 transition-all shadow-inner">
                  <div className="pr-8">
                    <p className="text-[11px] font-black text-[#3E3A39] uppercase tracking-widest font-mono">Conditional_Broadcasting</p>
                    <p className="text-[9px] text-[#8E7A70] font-black mt-3 uppercase tracking-widest font-mono italic leading-relaxed">Only execute messages post verification.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={sendAfterAccepted}
                      onChange={(e) => setSendAfterAccepted(e.target.checked)}
                    />
                    <div className="w-16 h-8 bg-white border border-[#B78D7D]/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-[#B2AAA6] after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 peer-checked:after:bg-white shadow-sm"></div>
                  </label>
                </div>
             </div>

             <div className="bg-white rounded-[3.5rem] border border-[#B78D7D]/15 shadow-sm p-12 flex flex-col justify-between group hover:shadow-[0_20px_40px_rgba(183,141,125,0.05)] transition-all">
                <div className="flex items-center gap-8 mb-10">
                   <div className="w-16 h-16 bg-[#F8F4F2] border border-[#B78D7D]/10 text-rose-500 rounded-[1.75rem] flex items-center justify-center shadow-inner">
                      <Zap size={32} />
                   </div>
                   <div>
                      <h4 className="text-xl font-black text-[#3E3A39] tracking-tighter uppercase">Bypass_Matrix</h4>
                      <p className="text-[10px] font-black text-[#B2AAA6] uppercase tracking-[0.3em] font-mono mt-2 italic">Execute Insecure Local Route</p>
                   </div>
                </div>
                <div className="flex items-center justify-between p-10 bg-[#F8F4F2]/30 rounded-[2.5rem] border border-[#B78D7D]/10 hover:border-rose-500/20 transition-all shadow-inner">
                  <div className="pr-8">
                    <p className="text-[11px] font-black text-[#3E3A39] uppercase tracking-widest font-mono">Infrastructure_Bypass</p>
                    <p className="text-[9px] text-[#8E7A70] font-black mt-3 uppercase tracking-widest font-mono italic leading-relaxed">Run operations from host platform IP.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={runWithoutProxy}
                      onChange={(e) => setRunWithoutProxy(e.target.checked)}
                    />
                    <div className="w-16 h-8 bg-white border border-[#B78D7D]/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-[#B2AAA6] after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500 peer-checked:after:bg-white shadow-sm"></div>
                  </label>
                </div>
             </div>
          </div>

          <div className="bg-white rounded-[4rem] border border-[#B78D7D]/15 shadow-sm p-12 md:p-16 space-y-12 group hover:shadow-[0_40px_80px_rgba(183,141,125,0.05)] transition-all">
             <div className="flex items-center justify-between pl-4">
                <div>
                   <h4 className="text-2xl font-black text-[#3E3A39] uppercase tracking-[0.2em] font-mono">Handshake_Inception_Note</h4>
                   <p className="text-[10px] font-black text-[#B2AAA6] uppercase tracking-[0.4em] font-mono mt-4 italic">Optional message during node connection</p>
                </div>
                <div className="px-8 py-3 bg-[#F8F4F2] border border-[#B78D7D]/15 rounded-2xl font-mono text-[#B78D7D] text-[12px] font-black shadow-inner">
                   {connectionNote.length} / 300
                </div>
             </div>
             
             <div className="flex flex-wrap gap-4 pl-4">
                {["$$f_name$$", "$$full_name$$"].map(v => (
                  <button key={v} type="button" onClick={() => insertVariable("note", v)} className="px-10 py-4 bg-[#F8F4F2]/50 border border-[#B78D7D]/10 rounded-2xl text-[10px] font-black text-[#B78D7D] hover:text-white hover:bg-[#B78D7D] transition-all font-mono uppercase tracking-widest shadow-sm">
                    {v}
                  </button>
                ))}
             </div>

             <textarea
              value={connectionNote}
              onChange={(e) => setConnectionNote(e.target.slice(0, 300))}
              placeholder="Inject introduction note for handshake request..."
              rows={5}
              className="form-input bg-[#F8F4F2]/20 border-[#B78D7D]/15 min-h-[150px] pt-10 text-lg italic active-input shadow-inner"
            />
          </div>

          {/* Phase 3: Payload Construction */}
          <div className="bg-white rounded-[4.5rem] border border-[#B78D7D]/15 shadow-sm overflow-hidden group hover:shadow-[0_40px_80px_rgba(183,141,125,0.05)] transition-all">
            <div className="p-12 border-b border-[#B78D7D]/10 flex items-center justify-between bg-[#F8F4F2]/30">
              <div className="flex items-center gap-10">
                <div className="w-20 h-20 bg-white border border-[#B78D7D]/10 text-[#B78D7D] rounded-[2.5rem] flex items-center justify-center shadow-inner group-hover:scale-110 duration-700">
                   <Cpu size={40} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-[#3E3A39] tracking-tighter uppercase leading-none">Sequence_Payload</h2>
                  <p className="text-[10px] font-black text-[#B2AAA6] uppercase tracking-[0.4em] font-mono mt-4 italic">Core Broadcaster Configuration</p>
                </div>
              </div>
              
              {!showSaveTemplate ? (
                 <button
                   type="button"
                   onClick={() => setShowSaveTemplate(true)}
                   className="px-10 py-5 bg-white border border-dashed border-[#B78D7D]/30 text-[#B2AAA6] font-black text-[10px] uppercase tracking-[0.3em] rounded-[1.5rem] hover:text-[#B78D7D] hover:border-[#B78D7D]/50 transition-all font-mono flex items-center gap-4 shadow-sm"
                 >
                   <Save size={18} /> Cache_As_Preset
                 </button>
              ) : (
                 <div className="flex items-center gap-6 animate-in slide-in-from-right duration-500">
                    <input
                      type="text"
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                      placeholder="PRESET_ID"
                      className="px-8 py-4 bg-[#F8F4F2]/50 border border-[#B78D7D]/10 rounded-2xl text-[10px] font-black text-[#3E3A39] font-mono uppercase tracking-widest outline-none focus:border-[#B78D7D] w-48 shadow-inner"
                    />
                    <div className="flex gap-4">
                      <button type="button" onClick={handleSaveAsTemplate} className="px-8 py-4 bg-[#B78D7D] text-white text-[10px] font-black uppercase rounded-xl shadow-lg font-mono">Commit</button>
                      <button type="button" onClick={() => setShowSaveTemplate(false)} className="px-8 py-4 bg-white text-[#B2AAA6] text-[10px] font-black uppercase rounded-xl font-mono border border-[#B78D7D]/10">Cancel</button>
                    </div>
                 </div>
              )}
            </div>
            
            <div className="p-12 md:p-20 space-y-16">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-[#B2AAA6] uppercase tracking-[0.4em] font-mono ml-4">Neural_Presets</label>
                     <div className="relative">
                        <select
                          onChange={(e) => handleApplyTemplate(e.target.value)}
                          className="form-input appearance-none cursor-pointer pr-16 bg-[#F8F4F2]/30"
                        >
                          <option value="">MANUAL_ENTRY_PROTOCOL...</option>
                          {templates.map(t => (
                            <option key={t._id} value={t._id}>LOAD_PRESET::{t.name.toUpperCase()}</option>
                          ))}
                        </select>
                        <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-[#B2AAA6]">
                           <MessageSquare size={22} />
                        </div>
                     </div>
                  </div>
                  
                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-[#B2AAA6] uppercase tracking-[0.4em] font-mono ml-4">Variable_Injection</label>
                     <div className="flex flex-wrap gap-4">
                        {["$$f_name$$", "$$full_name$$", "$$company$$"].map(v => (
                          <button
                            key={v}
                            type="button"
                            onClick={() => insertVariable("main", v)}
                            className="px-8 py-4 bg-[#F8F4F2]/50 border border-[#B78D7D]/10 rounded-2xl text-[10px] font-black text-[#B78D7D] hover:text-white hover:bg-[#B78D7D] transition-all font-mono uppercase tracking-widest shadow-sm"
                          >
                            {v}
                          </button>
                        ))}
                     </div>
                  </div>
               </div>

               <div className="space-y-4">
                 <textarea
                   value={message}
                   onChange={(e) => setMessage(e.target.value)}
                   placeholder="Enter main sequence broadcasting payload..."
                   rows={8}
                   className="form-input min-h-[300px] pt-12 text-lg font-bold italic active-input shadow-inner"
                   required
                 />
               </div>
            </div>
          </div>

          {/* Phase 4: Chronos & Load Protocols */}
          <div className="bg-white rounded-[4rem] border border-[#B78D7D]/15 shadow-sm overflow-hidden group hover:shadow-[0_40px_80px_rgba(183,141,125,0.05)] transition-all">
            <div className="p-12 border-b border-[#B78D7D]/10 flex items-center gap-8 bg-[#F8F4F2]/30">
              <div className="w-16 h-16 bg-[#F8F4F2] border border-[#B78D7D]/10 text-amber-500 rounded-[1.75rem] flex items-center justify-center shadow-inner group-hover:scale-110 duration-700">
                <Clock size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-[#3E3A39] tracking-tighter uppercase leading-none">Execution_Schedule</h2>
                <p className="text-[10px] font-black text-[#B2AAA6] uppercase tracking-[0.4em] font-mono mt-3 italic">Temporal Filters & Load Management</p>
              </div>
            </div>
            <div className="p-12 md:p-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-[#B2AAA6] uppercase tracking-[0.4em] font-mono ml-4">Node_Inbound_Limit</label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="40"
                    value={dailyLimit}
                    onChange={(e) => setDailyLimit(e.target.value)}
                    className="form-input text-center text-5xl font-black py-12 bg-[#F8F4F2]/30"
                  />
                  <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col items-end opacity-40 pointer-events-none">
                     <span className="text-[9px] font-black text-[#B78D7D] uppercase tracking-widest font-mono">Safe_Limit</span>
                     <span className="text-[10px] font-black text-[#B2AAA6] uppercase tracking-widest font-mono">UNITS/D</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-[#B2AAA6] uppercase tracking-[0.4em] font-mono ml-4">Interstitial_Delay (Sec)</label>
                <div className="flex items-center gap-8">
                  <div className="flex-1 relative">
                    <input type="number" min="5" value={minDelay} onChange={(e) => setMinDelay(e.target.value)} className="form-input text-center text-xl font-black font-mono shadow-inner bg-[#F8F4F2]/30" />
                    <span className="absolute left-1/2 -bottom-6 -translate-x-1/2 text-[8px] font-black text-[#B2AAA6] uppercase font-mono">MIN_ST</span>
                  </div>
                  <ArrowRight size={24} className="text-[#B2AAA6] shrink-0" />
                  <div className="flex-1 relative">
                     <input type="number" max="180" value={maxDelay} onChange={(e) => setMaxDelay(e.target.value)} className="form-input text-center text-xl font-black font-mono shadow-inner bg-[#F8F4F2]/30" />
                     <span className="absolute left-1/2 -bottom-6 -translate-x-1/2 text-[8px] font-black text-[#B2AAA6] uppercase font-mono">MAX_ST</span>
                  </div>
                </div>
              </div>
               <div className="space-y-4">
                <label className="text-[10px] font-black text-[#B2AAA6] uppercase tracking-[0.4em] font-mono ml-4">Neural_Grid_Timezone</label>
                <div className="relative">
                   <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className="form-input appearance-none pr-16 bg-[#F8F4F2]/30 text-[#B78D7D]">
                     {Intl.supportedValuesOf('timeZone').map(tz => (
                         <option key={tz} value={tz}>SECTOR::{tz.toUpperCase()}</option>
                      ))}
                   </select>
                   <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-[#B2AAA6]">
                      <Globe size={22} />
                   </div>
                </div>
              </div>
            </div>
          </div>

          {/* Phase 5: Layered Sequences */}
          <div className="bg-white rounded-[4.5rem] border border-[#B78D7D]/15 shadow-sm overflow-hidden group hover:shadow-[0_40px_80px_rgba(183,141,125,0.05)] transition-all">
            <div className="p-12 border-b border-[#B78D7D]/10 flex items-center justify-between bg-[#F8F4F2]/30">
              <div className="flex items-center gap-10">
                <div className="w-20 h-20 bg-white border border-[#B78D7D]/10 text-purple-500 rounded-[2.5rem] flex items-center justify-center shadow-inner group-hover:rotate-12 duration-700">
                  <Layers size={40} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-[#3E3A39] tracking-tighter uppercase leading-none">Neural_Follow_Ups</h2>
                  <p className="text-[10px] font-black text-[#B2AAA6] uppercase tracking-[0.4em] font-mono mt-4 italic">Recursive Multi-Phase Cycles</p>
                </div>
              </div>
              <button
                type="button"
                onClick={addFollowUp}
                className="px-12 py-6 bg-[#B78D7D]/10 text-[#B78D7D] font-black text-[11px] uppercase tracking-[0.5em] rounded-[2rem] hover:bg-[#B78D7D] hover:text-white transition-all flex items-center gap-4 font-mono shadow-sm border border-[#B78D7D]/10 active:scale-95"
              >
                <Plus size={24} /> Add_Recursive_Cycle
              </button>
            </div>
            <div className="p-12 md:p-20 space-y-16">
              {followUps.length === 0 ? (
                <div className="bg-[#F8F4F2]/50 rounded-[4rem] border border-dashed border-[#B78D7D]/30 py-32 flex flex-col items-center justify-center text-center opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
                  <Activity size={72} className="text-[#B2AAA6] mb-10" />
                  <p className="text-[11px] font-black text-[#B2AAA6] uppercase tracking-[0.6em] font-mono italic">Zero_Recursive_Layers_Active</p>
                </div>
              ) : (
                <div className="space-y-12">
                  {followUps.map((step, idx) => (
                    <div key={idx} className="bg-[#F8F4F2]/30 rounded-[4rem] border border-[#B78D7D]/10 p-12 relative group/step hover:border-[#B78D7D]/30 transition-all shadow-sm animate-in slide-in-from-left duration-500">
                       <button
                        type="button"
                        onClick={() => removeFollowUp(idx)}
                        className="absolute top-12 right-12 p-5 bg-white text-[#B2AAA6] hover:text-rose-500 hover:bg-rose-50 rounded-2xl border border-[#B78D7D]/10 shadow-sm transition-all opacity-0 group-hover/step:opacity-100 active:scale-90"
                      >
                        <Trash2 size={24} />
                      </button>
                      <div className="flex flex-col xl:flex-row gap-12 items-center mb-12">
                         <div className="w-24 h-24 bg-white border border-[#B78D7D]/20 rounded-[2.5rem] flex items-center justify-center font-black text-[#B78D7D] text-3xl shadow-md ring-8 ring-[#B78D7D]/5 group-hover/step:scale-110 transition-transform duration-500 font-mono">
                            {(idx + 1).toString().padStart(2, '0')}
                         </div>
                         <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-10 w-full">
                            <div className="space-y-4">
                               <label className="text-[10px] font-black text-[#B2AAA6] uppercase tracking-[0.5em] font-mono ml-6">Modular_Action</label>
                               <div className="relative">
                                  <select
                                    value={step.type || "message"}
                                    onChange={(e) => updateFollowUp(idx, "type", e.target.value)}
                                    className="form-input appearance-none py-5 text-[11px] bg-white border-[#B78D7D]/10 pr-16 shadow-sm"
                                  >
                                    <option value="message">BROADCAST_MESSAGE</option>
                                    <option value="visit_profile">NETWORK_NODE_VISIT</option>
                                    <option value="withdraw">WITHDRAW_HANDSHAKE</option>
                                  </select>
                                  <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-[#B78D7D]">
                                     <ArrowRight size={20} />
                                  </div>
                               </div>
                            </div>
                            <div className="space-y-4">
                               <label className="text-[10px] font-black text-[#B2AAA6] uppercase tracking-[0.5em] font-mono ml-6">Temporal_Shift</label>
                               <div className="flex items-center gap-8 bg-white border border-[#B78D7D]/10 p-5 rounded-[1.75rem] shadow-sm">
                                  <div className="flex-1 relative">
                                    <input
                                      type="number"
                                      min="1"
                                      value={step.delayDays}
                                      onChange={(e) => updateFollowUp(idx, "delayDays", e.target.value)}
                                      className="bg-transparent text-[#3E3A39] font-black text-2xl w-full text-center outline-none font-mono"
                                    />
                                  </div>
                                  <div className="w-[1px] h-8 bg-[#B78D7D]/20" />
                                  <span className="text-[10px] font-black text-[#B78D7D] uppercase tracking-widest font-mono whitespace-nowrap pr-4">{step.type === 'withdraw' ? 'Days_Post_Connect' : 'Days_Post_Accept'}</span>
                               </div>
                            </div>
                         </div>
                      </div>
                      {(!step.type || step.type === "message") && (
                        <textarea
                          value={step.message}
                          onChange={(e) => updateFollowUp(idx, "message", e.target.value)}
                          placeholder="Inject recursive message payload..."
                          rows={5}
                          className="form-input bg-white border-[#B78D7D]/10 focus:bg-white min-h-[200px] pt-10 text-lg italic shadow-sm"
                        />
                      )}
                    </div>
                  ))}
                </div>
               )}
            </div>
          </div>

          {/* Phase 6: Subsystem Termination & Submission */}
          <div className="bg-[#B78D7D] rounded-[4rem] shadow-[0_40px_100px_rgba(183,141,125,0.2)] p-12 md:p-24 flex flex-col xl:flex-row items-center justify-between gap-20 relative overflow-hidden group">
             <div className="absolute -bottom-20 -right-20 p-10 opacity-10 grayscale group-hover:grayscale-0 transition-all duration-1000 rotate-12">
                <Linkedin size={320} className="text-white" fill="currentColor" />
             </div>
             
             <div className="flex-1 relative z-10">
                <div className="flex items-center gap-6 mb-6 text-white/90">
                   <ShieldCheck size={36} className="animate-pulse" />
                   <h3 className="text-[12px] font-black uppercase tracking-[0.6em] font-mono">End-To-End_Authority_Verification</h3>
                </div>
                <h2 className="text-6xl font-black text-white tracking-tighter uppercase mb-12 leading-none">Mission_Finalization</h2>
                <div className="flex items-center justify-between p-12 bg-white/10 rounded-[3rem] border border-white/20 max-w-2xl backdrop-blur-sm transition-all hover:bg-white/15">
                   <div className="pr-12 text-left">
                      <p className="text-xl font-black text-white tracking-widest uppercase font-mono">Reply_Inhibitor</p>
                      <p className="text-[11px] text-white/70 mt-3 uppercase font-black font-mono tracking-widest italic leading-relaxed">Instantly pause sequence if neural interaction is detected from terminal.</p>
                   </div>
                   <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={stopOnReply}
                      onChange={(e) => setStopOnReply(e.target.checked)}
                    />
                    <div className="w-20 h-10 bg-white/20 border border-white/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white/60 after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-white peer-checked:after:bg-[#B78D7D] shadow-xl"></div>
                  </label>
                </div>
             </div>

             <div className="w-full xl:w-auto flex flex-col gap-8 shrink-0 relative z-10 items-center">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full xl:w-[480px] px-20 py-10 bg-white text-[#B78D7D] font-black text-xl uppercase tracking-[0.5em] rounded-[2.5rem] hover:scale-[1.02] transition-all shadow-2xl flex items-center justify-center gap-8 active:scale-95 disabled:opacity-70 font-mono border border-white/20 group/submit shadow-[0_30px_60px_rgba(0,0,0,0.1)]"
                >
                  {submitting ? (
                     <div className="flex items-center gap-6">
                        <Loader2 size={32} className="animate-spin" />
                        <span>Broadcasting...</span>
                     </div>
                  ) : (
                     <div className="flex items-center gap-6">
                        <span>Execute_Sequence</span>
                        <Rocket size={32} className="group-hover/submit:translate-x-2 group-hover/submit:-translate-y-2 transition-transform duration-700" />
                     </div>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="text-white/60 hover:text-white transition-all text-[11px] font-black uppercase tracking-[0.5em] font-mono italic underline-offset-8 hover:underline"
                >
                  Terminate_Initialization_Sequence
                </button>
             </div>
          </div>

        </form>
      </div>

       {/* Top Static Line Progress */}
       <div className="fixed top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-[#B78D7D]/30 to-transparent z-[100]" />
       
       <style jsx>{`
        .form-input {
          width: 100%;
          padding: 1.75rem 2.5rem;
          background-color: white;
          border: 1px solid #B78D7D25;
          border-radius: 2rem;
          font-weight: 800;
          color: #3E3A39;
          outline: none;
          transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
          font-family: inherit;
          letter-spacing: 0.05em;
          box-shadow: 0 4px 10px rgba(183,141,125,0.02), inset 0 2px 4px rgba(0,0,0,0.01);
          font-size: 1rem;
        }
        .form-input:focus {
          border-color: #B78D7D80;
          background-color: #F8F4F230;
          box-shadow: 0 20px 40px rgba(183,141,125,0.04), inset 0 2px 4px rgba(0,0,0,0.01);
          transform: translateY(-2px);
        }
        .active-input {
           border-color: #B78D7D40;
           background-color: #F8F4F220;
        }
      `}</style>
    </div>
  );
}
