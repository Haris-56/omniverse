"use client";

import { useState, useEffect, use } from "react";
import { 
  ChevronLeft, 
  Info, 
  UserPlus, 
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
  Facebook,
  Activity,
  Layers,
  ArrowRight,
  Globe,
  Hexagon
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewFacebookCampaignPage({ params: paramsPromise }) {
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

  // Templates State
  const [templates, setTemplates] = useState([]);
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [savingTemplate, setSavingTemplate] = useState(false);

  useEffect(() => {
    fetchData();
    fetchTemplates();
  }, [accountId]);

  const fetchTemplates = async () => {
    try {
      const res = await fetch("/api/templates?platform=facebook");
      if (res.ok) setTemplates(await res.json());
    } catch (error) {
      console.error("Failed to fetch templates", error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [accRes, listsRes] = await Promise.all([
        fetch(`/api/facebook/accounts/${accountId}`),
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

  const addFollowUp = () => {
    setFollowUps([...followUps, { delayValue: 2, delayUnit: "days", message: "" }]);
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
      alert("Please enter a name for your template.");
      return;
    }
    setSavingTemplate(true);
    try {
      const res = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: templateName,
          platform: "facebook",
          message: message
        })
      });
      if (res.ok) {
        setShowSaveTemplate(false);
        setTemplateName("");
        fetchTemplates();
        alert("Template saved!");
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
      alert("Please fill in all the details.");
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
        blacklist: blacklist.split(",").map(s => s.trim()).filter(Boolean)
      };

      const res = await fetch("/api/facebook/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        router.push(`/facebook/${accountId}/campaigns`);
      } else {
        const err = await res.json();
        alert(err.error || "Failed to create plan");
      }
    } catch (error) {
      console.error("Error creating plan", error);
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
              <Facebook size={32} className="text-[#B78D7D]" />
           </div>
        </div>
        <p className="text-[10px] font-black text-[#B2AAA6] uppercase tracking-[0.5em] font-mono">Loading...</p>
     </div>
  );

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-1000 font-sans pb-32 px-6 lg:px-20">
      <div className="max-w-[1700px] mx-auto space-y-16">
        
        {/* Header Sector */}
        <div className="flex items-center gap-10 border-b border-[#B78D7D]/15 pb-12">
          <Link href={`/facebook/${accountId}/campaigns`} className="p-5 bg-white border border-[#B78D7D]/10 rounded-[1.5rem] text-[#B2AAA6] hover:text-[#B78D7D] transition-all shadow-sm hover:bg-[#F8F4F2] group">
            <ChevronLeft size={28} className="group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-4 mb-4">
               <span className="px-5 py-2 bg-[#B78D7D]/10 text-[#B78D7D] text-[10px] font-black uppercase tracking-[0.4em] rounded-full border border-[#B78D7D]/20 flex items-center gap-2 font-mono">
                 <ShieldCheck size={14} className="opacity-80" />
                 Ready to go
               </span>
            </div>
            <h1 className="text-5xl font-black text-[#3E3A39] tracking-tighter uppercase leading-tight">Make a Plan</h1>
            <p className="text-[#8E7A70] mt-4 text-xl font-medium">Create a new way to talk to people on Facebook using <span className="text-[#B78D7D] font-black">{account?.email}</span></p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-16">
          
          {/* Section 1: Plan Details */}
          <div className="bg-white rounded-[4rem] border border-[#B78D7D]/15 shadow-sm overflow-hidden relative group transition-all hover:shadow-[0_40px_80px_rgba(183,141,125,0.05)]">
            <div className="p-12 border-b border-[#B78D7D]/10 flex items-center gap-8 bg-[#F8F4F2]/30">
              <div className="w-16 h-16 bg-[#F8F4F2] border border-[#B78D7D]/10 text-[#B78D7D] rounded-[1.75rem] flex items-center justify-center shadow-inner group-hover:scale-110 duration-700">
                <Target size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-[#3E3A39] tracking-tighter uppercase leading-none">Plan Details</h2>
                <p className="text-[10px] font-black text-[#B2AAA6] uppercase tracking-[0.4em] font-mono mt-3">Pick a name and a list of people.</p>
              </div>
            </div>
            <div className="p-12 md:p-16 grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-[#B2AAA6] uppercase tracking-[0.4em] font-mono ml-4">Name your plan</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. My Big Outreach Plan"
                  className="form-input"
                  required
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-[#B2AAA6] uppercase tracking-[0.4em] font-mono ml-4">Who are we talking to?</label>
                <div className="relative">
                  <select
                    value={listId}
                    onChange={(e) => setListId(e.target.value)}
                    className="form-input appearance-none cursor-pointer pr-16"
                    required
                  >
                    <option value="" disabled>Select a list of people...</option>
                    {contactLists.map(list => (
                      <option key={list._id} value={list._id}>{list.name.toUpperCase()} — [{list.count} people]</option>
                    ))}
                  </select>
                  <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-[#B2AAA6]">
                    <Layers size={22} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: The Message */}
          <div className="bg-white rounded-[4rem] border border-[#B78D7D]/15 shadow-sm overflow-hidden group hover:shadow-[0_40px_80px_rgba(183,141,125,0.05)] transition-all">
            <div className="p-12 border-b border-[#B78D7D]/10 flex items-center justify-between bg-[#F8F4F2]/30">
              <div className="flex items-center gap-10">
                <div className="w-16 h-16 bg-[#F8F4F2] border border-[#B78D7D]/10 text-[#B78D7D] rounded-[1.75rem] flex items-center justify-center shadow-inner group-hover:rotate-12 duration-700">
                  <Cpu size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-[#3E3A39] tracking-tighter uppercase leading-none">The Message</h2>
                  <p className="text-[10px] font-black text-[#B2AAA6] uppercase tracking-[0.4em] font-mono mt-3">What do you want to say?</p>
                </div>
              </div>
              {!showSaveTemplate ? (
                 <button
                   type="button"
                   onClick={() => setShowSaveTemplate(true)}
                   className="px-8 py-4 bg-white border border-dashed border-[#B78D7D]/30 text-[#B2AAA6] font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl hover:text-[#B78D7D] hover:border-[#B78D7D]/50 transition-all font-mono flex items-center gap-4"
                 >
                   <Save size={18} /> Save as template
                 </button>
              ) : (
                 <div className="flex items-center gap-4 animate-in slide-in-from-right duration-500">
                    <input
                      type="text"
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                      placeholder="Template Name"
                      className="px-6 py-3 bg-[#F8F4F2]/50 border border-[#B78D7D]/10 rounded-xl text-[10px] font-black text-[#3E3A39] font-mono uppercase tracking-widest outline-none focus:border-[#B78D7D]"
                    />
                    <button type="button" onClick={handleSaveAsTemplate} className="px-6 py-3 bg-[#B78D7D] text-white text-[10px] font-black uppercase rounded-xl shadow-lg font-mono">Save</button>
                    <button type="button" onClick={() => setShowSaveTemplate(false)} className="px-6 py-3 bg-white text-[#B2AAA6] text-[10px] font-black uppercase rounded-xl font-mono">Cancel</button>
                 </div>
              )}
            </div>
            <div className="p-12 md:p-16 space-y-12">
               <div className="flex flex-col lg:flex-row gap-12">
                  <div className="flex-1 space-y-4">
                     <label className="text-[10px] font-black text-[#B2AAA6] uppercase tracking-[0.4em] font-mono ml-4">Use a saved message</label>
                     <div className="relative">
                        <select
                          onChange={(e) => handleApplyTemplate(e.target.value)}
                          className="form-input appearance-none cursor-pointer pr-16 bg-[#F8F4F2]/30"
                        >
                          <option value="">Start from scratch...</option>
                          {templates.map(t => (
                            <option key={t._id} value={t._id}>{t.name.toUpperCase()}</option>
                          ))}
                        </select>
                        <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-[#B2AAA6]">
                           <Layers size={22} />
                        </div>
                     </div>
                  </div>
                  <div className="flex-1 space-y-4">
                     <label className="text-[10px] font-black text-[#B2AAA6] uppercase tracking-[0.4em] font-mono ml-4">Insert details</label>
                     <div className="flex flex-wrap gap-3">
                        {["First Name", "Last Name", "Company"].map(v => (
                          <button
                            key={v}
                            type="button"
                            onClick={() => insertVariable("main", `[[${v}]]`)}
                            className="px-6 py-3 bg-[#F8F4F2]/50 border border-[#B78D7D]/10 rounded-xl text-[10px] font-black text-[#B78D7D] hover:text-white hover:bg-[#B78D7D] transition-all font-mono"
                          >
                            {v}
                          </button>
                        ))}
                     </div>
                  </div>
               </div>
               <textarea
                 value={message}
                 onChange={(e) => setMessage(e.target.value)}
                 placeholder="Write your message here..."
                 rows={6}
                 className="form-input min-h-[250px] pt-10 text-lg font-bold tracking-tight"
                 required
               />
            </div>
          </div>

          {/* Section 3: When to send */}
          <div className="bg-white rounded-[4rem] border border-[#B78D7D]/15 shadow-sm overflow-hidden group hover:shadow-[0_40px_80px_rgba(183,141,125,0.05)] transition-all">
            <div className="p-12 border-b border-[#B78D7D]/10 flex items-center gap-8 bg-[#F8F4F2]/30">
              <div className="w-16 h-16 bg-[#F8F4F2] border border-[#B78D7D]/10 text-amber-500 rounded-[1.75rem] flex items-center justify-center shadow-inner group-hover:scale-110 duration-700">
                <Clock size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-[#3E3A39] tracking-tighter uppercase leading-none">When to send</h2>
                <p className="text-[10px] font-black text-[#B2AAA6] uppercase tracking-[0.4em] font-mono mt-3">Pick the speed and timezone.</p>
              </div>
            </div>
            <div className="p-12 md:p-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
               <div className="space-y-4">
                <label className="text-[10px] font-black text-[#B2AAA6] uppercase tracking-[0.4em] font-mono ml-4">Daily message limit</label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={dailyLimit}
                    onChange={(e) => setDailyLimit(e.target.value)}
                    className="form-input text-center text-4xl font-black py-8 bg-[#F8F4F2]/30"
                  />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[9px] font-black text-[#B78D7D] uppercase tracking-widest font-mono opacity-40">Limit</span>
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-[#B2AAA6] uppercase tracking-[0.4em] font-mono ml-4">Wait between messages (Sec)</label>
                <div className="flex items-center gap-6">
                  <input type="number" min="10" value={minDelay} onChange={(e) => setMinDelay(e.target.value)} className="form-input text-center text-xl font-black py-5 bg-[#F8F4F2]/30" />
                  <ArrowRight size={24} className="text-[#B2AAA6] shrink-0" />
                  <input type="number" max="600" value={maxDelay} onChange={(e) => setMaxDelay(e.target.value)} className="form-input text-center text-xl font-black py-5 bg-[#F8F4F2]/30" />
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-[#B2AAA6] uppercase tracking-[0.4em] font-mono ml-4">Your Timezone</label>
                <div className="relative">
                   <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className="form-input appearance-none pr-16 bg-[#F8F4F2]/30 text-[#B78D7D]">
                      {Intl.supportedValuesOf('timeZone').map(tz => (
                         <option key={tz} value={tz}>{tz.toUpperCase()}</option>
                      ))}
                   </select>
                   <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-[#B2AAA6]">
                      <Globe size={22} />
                   </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Follow up messages */}
          <div className="bg-white rounded-[4rem] border border-[#B78D7D]/15 shadow-sm overflow-hidden group hover:shadow-[0_40px_80px_rgba(183,141,125,0.05)] transition-all">
            <div className="p-12 border-b border-[#B78D7D]/10 flex items-center justify-between bg-[#F8F4F2]/30">
              <div className="flex items-center gap-10">
                <div className="w-16 h-16 bg-[#F8F4F2] border border-[#B78D7D]/10 text-purple-500 rounded-[1.75rem] flex items-center justify-center shadow-inner group-hover:rotate-12 duration-700">
                  <Zap size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-[#3E3A39] tracking-tighter uppercase leading-none">Follow up</h2>
                  <p className="text-[10px] font-black text-[#B2AAA6] uppercase tracking-[0.4em] font-mono mt-3">Send more messages automatically.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={addFollowUp}
                className="px-10 py-5 bg-[#B78D7D]/10 text-[#B78D7D] font-black text-[10px] uppercase tracking-[0.5em] rounded-2xl hover:bg-[#B78D7D] hover:text-white transition-all flex items-center gap-4 font-mono shadow-sm active:scale-95"
              >
                <Plus size={18} /> Add a follow up
              </button>
            </div>
            <div className="p-12 md:p-16 space-y-12">
               {followUps.length === 0 ? (
                 <div className="bg-[#F8F4F2]/50 rounded-[3.5rem] border border-dashed border-[#B78D7D]/30 py-24 flex flex-col items-center justify-center text-center opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
                   <Activity size={60} className="text-[#B2AAA6] mb-8" />
                   <p className="text-[10px] font-black text-[#B2AAA6] uppercase tracking-[0.5em] font-mono">No follow up messages yet</p>
                 </div>
               ) : (
                 <div className="space-y-10">
                    {followUps.map((step, idx) => (
                      <div key={idx} className="bg-[#F8F4F2]/30 rounded-[3.5rem] border border-[#B78D7D]/10 p-10 relative group/step hover:border-[#B78D7D]/30 transition-all shadow-sm">
                        <button
                         type="button"
                         onClick={() => removeFollowUp(idx)}
                         className="absolute top-10 right-10 p-4 bg-white text-[#B2AAA6] hover:text-rose-500 hover:bg-rose-50 rounded-2xl border border-[#B78D7D]/10 shadow-sm transition-all opacity-0 group-hover/step:opacity-100"
                        >
                          <Trash2 size={24} />
                        </button>
                        <div className="flex flex-col md:flex-row gap-10 items-center mb-10">
                           <div className="w-20 h-20 bg-white border border-[#B78D7D]/20 rounded-[2rem] flex items-center justify-center font-black text-[#B78D7D] text-2xl font-mono shadow-md">
                              {(idx + 1).toString().padStart(2, '0')}
                           </div>
                           <div className="flex items-center gap-6">
                              <p className="text-[10px] font-black text-[#B2AAA6] uppercase tracking-[0.5em] font-mono">Wait for:</p>
                              <div className="flex items-center gap-4 bg-white border border-[#B78D7D]/10 p-4 rounded-2xl shadow-sm">
                                 <input
                                    type="number"
                                    min="1"
                                    value={step.delayValue || step.delayDays}
                                    onChange={(e) => updateFollowUp(idx, "delayValue", e.target.value)}
                                    className="bg-transparent text-[#3E3A39] font-black text-xl w-16 text-center outline-none"
                                  />
                                  <span className="text-[10px] font-black text-[#B78D7D] uppercase tracking-widest font-mono">Days</span>
                              </div>
                           </div>
                        </div>
                        <textarea
                          value={step.message}
                          onChange={(e) => updateFollowUp(idx, "message", e.target.value)}
                          placeholder="What should this follow up message say?"
                          rows={4}
                          className="form-input bg-white border-[#B78D7D]/10 focus:bg-white min-h-[150px] pt-8 text-lg shadow-sm"
                          required
                        />
                      </div>
                    ))}
                 </div>
               )}
            </div>
          </div>

          {/* Section 5: Start now */}
          <div className="bg-[#B78D7D] rounded-[4rem] shadow-[0_40px_100px_rgba(183,141,125,0.2)] p-12 md:p-20 flex flex-col xl:flex-row items-center justify-between gap-16 relative overflow-hidden group">
             <div className="absolute -bottom-20 -right-20 p-10 opacity-10 grayscale group-hover:grayscale-0 transition-all duration-1000 rotate-12">
                <Hexagon size={300} className="text-white" />
             </div>
             
             <div className="flex-1 relative z-10 w-full xl:w-auto">
                <div className="flex items-center gap-4 mb-4 text-white/90">
                   <ShieldCheck size={32} />
                   <h3 className="text-[11px] font-black uppercase tracking-[0.5em] font-mono">Everything looks good</h3>
                </div>
                <h2 className="text-5xl font-black text-white tracking-tighter uppercase mb-10 leading-none">Start Now</h2>
                <div className="flex items-center justify-between p-10 bg-white/10 rounded-[2.5rem] border border-white/20 max-w-xl backdrop-blur-sm">
                   <div className="pr-10">
                      <p className="text-lg font-black text-white tracking-widest uppercase font-mono leading-none">Stop if they reply</p>
                      <p className="text-[10px] text-white/70 mt-3 uppercase font-black font-mono tracking-widest leading-relaxed">Stop sending messages if they write back to you.</p>
                   </div>
                   <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={stopOnReply}
                      onChange={(e) => setStopOnReply(e.target.checked)}
                    />
                    <div className="w-16 h-9 bg-white/20 border border-white/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white/50 after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-white peer-checked:after:bg-[#B78D7D] shadow-xl"></div>
                  </label>
                </div>
             </div>

             <div className="w-full xl:w-auto flex flex-col sm:flex-row gap-6 shrink-0 relative z-10">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-14 py-7 bg-white text-[#B78D7D] font-black text-[12px] uppercase tracking-[0.4em] rounded-[1.75rem] hover:bg-[#F8F4F2] transition-all shadow-2xl flex items-center justify-center gap-5 active:scale-95 disabled:opacity-50 font-mono"
                >
                  {submitting ? "Starting..." : "Run the Plan"}
                  <Rocket size={24} />
                </button>
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-14 py-7 bg-white/10 text-white/80 font-black text-[12px] uppercase tracking-[0.4em] rounded-[1.75rem] hover:bg-white/20 transition-all font-mono border border-white/20"
                >
                  Cancel
                </button>
             </div>
          </div>

        </form>
      </div>
    </div>
  );
}
