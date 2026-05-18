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
  Hexagon,
  Bot,
  ChevronRight
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function NewFacebookCampaignPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const accountId = params.id;
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("editId");
  const isEdit = !!editId;

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
  const [aiAgents, setAiAgents] = useState([]);
  const [aiCloserId, setAiCloserId] = useState("");
  const [aiAgentTargetType, setAiAgentTargetType] = useState("leads_only");

  // Templates State
  const [templates, setTemplates] = useState([]);
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [savingTemplate, setSavingTemplate] = useState(false);

  useEffect(() => {
    fetchData();
    fetchTemplates();
    fetchAiAgents();
    if (isEdit) fetchCampaignToEdit();
  }, [accountId, editId]);

  const fetchCampaignToEdit = async () => {
    try {
      const res = await fetch(`/api/facebook/campaigns?id=${editId}`);
      if (res.ok) {
        const data = await res.json();
        setName(data.name || "");
        setListId(data.listId || "");
        setMessage(data.message || "");
        setDailyLimit(data.dailyLimit || 20);
        setMinDelay(data.minDelay || 10);
        setMaxDelay(data.maxDelay || 40);
        setTimezone(data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone);
        setStartTime(data.hours?.start || "09:00");
        setEndTime(data.hours?.end || "17:00");
        setStopOnReply(data.stopOnReply !== false);
        setBlacklist(data.blacklist?.join(", ") || "");
        setFollowUps(data.sequences || []);
        setAiCloserId(data.aiCloserId || "");
        setAiAgentTargetType(data.aiAgentTargetType || "leads_only");
      }
    } catch (error) {
      console.error("Failed to fetch campaign for editing", error);
    }
  };

  const fetchAiAgents = async () => {
    try {
      const res = await fetch("/api/ai-agents");
      if (res.ok) {
        const data = await res.json();
        // Allow all agents for dynamic robustness, or filtered by facebook
        setAiAgents(data.filter(a => !a.platform || a.platform.toLowerCase() === "facebook"));
      }
    } catch (error) {
      console.error("Failed to fetch AI agents", error);
    }
  };

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
        blacklist: blacklist.split(",").map(s => s.trim()).filter(Boolean),
        aiCloserId,
        aiAgentTargetType
      };

      const res = await fetch("/api/facebook/campaigns", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isEdit ? { id: editId, ...payload } : payload)
      });

      if (res.ok) {
        router.push(`/facebook/${accountId}/campaigns`);
      } else {
        const err = await res.json();
        alert(err.error || `Failed to ${isEdit ? 'update' : 'create'} plan`);
      }
    } catch (error) {
      console.error("Error creating plan", error);
      alert("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
     <div className="h-screen w-full flex flex-col items-center justify-center bg-[#FCF8FE] space-y-10 text-center px-10 font-sans">
        <div className="relative">
           <div className="w-20 h-20 border-4 border-[#8245EF]/10 border-t-[#8245EF] rounded-full animate-spin shadow-sm" />
           <div className="absolute inset-0 flex items-center justify-center">
              <Facebook size={32} className="text-[#8245EF]" />
           </div>
        </div>
        <p className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.5em] font-mono">Loading...</p>
     </div>
  );

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-1000 font-sans pb-32 px-6 lg:px-20">
      <div className="max-w-[1700px] mx-auto space-y-16">
        
        {/* Header Sector */}
        <div className="flex items-center gap-10 border-b border-[#8245EF]/15 pb-12">
          <Link href={`/facebook/${accountId}/campaigns`} className="p-5 bg-white border border-[#8245EF]/10 rounded-[1.5rem] text-[#94a3b8] hover:text-[#8245EF] transition-all shadow-sm hover:bg-[#FCF8FE] group">
            <ChevronLeft size={28} className="group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-4 mb-4">
               <span className="px-4 py-1.5 bg-green-50 text-green-600 text-[10px] font-bold rounded-full border border-green-100 flex items-center gap-2">
                 <ShieldCheck size={14} className="opacity-80" />
                 Active
               </span>
            </div>
            <h1>{isEdit ? "Edit" : "Create"} Facebook Plan</h1>
            <p className="text-gray-500 mt-2 text-xl">Set up your messages and when to send them. Using: <span className="text-[#8245EF] font-bold">{account?.email}</span></p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-16">
          
          {/* Section 1: Plan Details */}
          <div className="bg-white rounded-[4rem] border border-[#8245EF]/15 shadow-sm overflow-hidden relative group transition-all hover:shadow-[0_40px_80px_rgba(130, 69, 239,0.05)]">
            <div className="p-12 border-b border-[#8245EF]/10 flex items-center gap-8 bg-[#FCF8FE]/30">
              <div className="w-16 h-16 bg-[#FCF8FE] border border-[#8245EF]/10 text-[#8245EF] rounded-[1.75rem] flex items-center justify-center shadow-inner group-hover:scale-110 duration-700">
                <Target size={32} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Plan Name</h2>
                <p className="text-sm text-gray-500">Give your plan a name and pick who to message.</p>
              </div>
            </div>
            <div className="p-12 md:p-16 grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 ml-2">Plan Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Plan Name"
                  className="form-input h-12"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 ml-2">People to Message</label>
                <div className="relative">
                  <select
                    value={listId}
                    onChange={(e) => setListId(e.target.value)}
                    className="form-input appearance-none cursor-pointer pr-12 h-12"
                    required
                  >
                    <option value="" disabled>-- Choose List --</option>
                    {contactLists.map(list => (
                      <option key={list._id} value={list._id}>{list.name} ({list.count} people)</option>
                    ))}
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <Layers size={18} />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 ml-2">AI Closer Agent</label>
                <div className="relative">
                  <select
                    value={aiCloserId}
                    onChange={(e) => setAiCloserId(e.target.value)}
                    className="form-input appearance-none cursor-pointer pr-12 h-12"
                  >
                    <option value="">No AI Closer Agent</option>
                    {aiAgents.map(agent => (
                      <option key={agent._id} value={agent._id}>{agent.name}</option>
                    ))}
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <Bot size={18} />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 ml-2">AI Closer Mode</label>
                <div className="relative">
                  <select
                    value={aiAgentTargetType}
                    onChange={(e) => setAiAgentTargetType(e.target.value)}
                    className="form-input appearance-none cursor-pointer pr-12 h-12"
                  >
                    <option value="leads_only">Only Leads Chat AI Agent</option>
                    <option value="all_chats">AI Agent for All Chats</option>
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <ChevronRight size={18} className="rotate-90" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: The Message */}
          <div className="bg-white rounded-[4rem] border border-[#8245EF]/15 shadow-sm overflow-hidden group hover:shadow-[0_40px_80px_rgba(130, 69, 239,0.05)] transition-all">
            <div className="p-12 border-b border-[#8245EF]/10 flex items-center justify-between bg-[#FCF8FE]/30">
              <div className="flex items-center gap-10">
                <div className="w-16 h-16 bg-[#FCF8FE] border border-[#8245EF]/10 text-[#8245EF] rounded-[1.75rem] flex items-center justify-center shadow-inner group-hover:rotate-12 duration-700">
                  <Cpu size={32} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Your Message</h2>
                  <p className="text-sm text-gray-500">Write what you want to send.</p>
                </div>
              </div>
              {!showSaveTemplate ? (
                  <button
                    type="button"
                    onClick={() => setShowSaveTemplate(true)}
                    className="px-6 py-3 bg-gray-50 border border-dashed border-gray-200 text-gray-400 font-bold text-xs rounded-xl hover:text-[#8245EF] hover:border-[#8245EF]/50 transition-all flex items-center gap-2"
                  >
                    <Save size={18} /> Save this message
                  </button>
              ) : (
                  <div className="flex items-center gap-2 animate-in slide-in-from-right duration-500">
                     <input
                       type="text"
                       value={templateName}
                       onChange={(e) => setTemplateName(e.target.value)}
                       placeholder="Name"
                       className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold text-gray-900 outline-none focus:border-[#8245EF]"
                     />
                     <button type="button" onClick={handleSaveAsTemplate} className="px-5 py-2 bg-[#8245EF] text-white text-xs font-bold rounded-lg shadow-md">Save</button>
                     <button type="button" onClick={() => setShowSaveTemplate(false)} className="px-5 py-2 bg-white text-gray-400 text-xs font-bold rounded-lg">Cancel</button>
                  </div>
              )}
            </div>
            <div className="p-12 md:p-16 space-y-12">
               <div className="flex flex-col lg:flex-row gap-12">
                   <div className="flex-1 space-y-2">
                      <label className="text-xs font-bold text-gray-400 ml-2">Use a saved message</label>
                      <div className="relative">
                         <select
                           onChange={(e) => handleApplyTemplate(e.target.value)}
                           className="form-input appearance-none cursor-pointer pr-12 bg-gray-50/50 h-12"
                         >
                           <option value="">Manual Input</option>
                           {templates.map(t => (
                             <option key={t._id} value={t._id}>{t.name}</option>
                           ))}
                         </select>
                         <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            <Layers size={18} />
                         </div>
                      </div>
                   </div>
                  <div className="flex-1 space-y-2">
                      <label className="text-xs font-bold text-gray-400 ml-2">Add details</label>
                      <div className="flex flex-wrap gap-2">
                         {["First Name", "Last Name", "Company"].map(v => (
                           <button
                             key={v}
                             type="button"
                             onClick={() => insertVariable("main", `[[${v}]]`)}
                             className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold text-[#8245EF] hover:text-white hover:bg-[#8245EF] transition-all"
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
                  className="form-input min-h-[200px] p-6 text-base font-medium"
                  required
                />
            </div>
          </div>

          {/* Section 3: When to send */}
          <div className="bg-white rounded-[4rem] border border-gray-100 shadow-sm overflow-hidden group transition-all">
            <div className="p-12 border-b border-gray-100 flex items-center gap-8 bg-gray-50/50">
              <div className="w-16 h-16 bg-white border border-gray-100 text-amber-500 rounded-[1.75rem] flex items-center justify-center shadow-inner group-hover:scale-110 duration-700">
                <Clock size={32} />
              </div>
               <div>
                <h2 className="text-xl font-bold text-gray-900">When to send</h2>
                <p className="text-sm text-gray-500">Pick the speed and timezone.</p>
              </div>
            </div>
            <div className="p-12 md:p-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                <div className="space-y-2">
                 <label className="text-xs font-bold text-gray-400 ml-2">How many per day</label>
                 <div className="relative">
                   <input
                     type="number"
                     min="1"
                     max="100"
                     value={dailyLimit}
                     onChange={(e) => setDailyLimit(e.target.value)}
                     className="form-input text-center text-3xl font-bold py-6 bg-gray-50/50"
                   />
                 </div>
               </div>
               <div className="space-y-2">
                 <label className="text-xs font-bold text-gray-400 ml-2">Time between messages</label>
                 <div className="flex items-center gap-4">
                   <input type="number" min="10" value={minDelay} onChange={(e) => setMinDelay(e.target.value)} className="form-input text-center text-lg font-bold py-4 bg-gray-50/50" />
                   <ArrowRight size={20} className="text-gray-300 shrink-0" />
                   <input type="number" max="600" value={maxDelay} onChange={(e) => setMaxDelay(e.target.value)} className="form-input text-center text-lg font-bold py-4 bg-gray-50/50" />
                 </div>
               </div>
               <div className="space-y-2">
                 <label className="text-xs font-bold text-gray-400 ml-2">Your Timezone</label>
                 <div className="relative">
                    <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className="form-input appearance-none pr-12 bg-gray-50/50 text-[#8245EF] h-14">
                       {Intl.supportedValuesOf('timeZone').map(tz => (
                          <option key={tz} value={tz}>{tz}</option>
                       ))}
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                       <Globe size={20} />
                    </div>
                 </div>
               </div>
            </div>
          </div>

          {/* Section 4: Follow up messages */}
          <div className="bg-white rounded-[4rem] border border-gray-100 shadow-sm overflow-hidden group transition-all">
            <div className="p-12 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-10">
                <div className="w-16 h-16 bg-white border border-gray-100 text-purple-500 rounded-[1.75rem] flex items-center justify-center shadow-inner group-hover:rotate-12 duration-700">
                  <Zap size={32} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Follow-up Messages</h2>
                  <p className="text-sm text-gray-500">Messages to send if they don't reply.</p>
                </div>
              </div>
               <button
                type="button"
                onClick={addFollowUp}
                className="px-6 py-3 bg-[#8245EF]/10 text-[#8245EF] font-bold text-xs rounded-xl hover:bg-[#8245EF] hover:text-white transition-all flex items-center gap-2 border border-[#8245EF]/10 active:scale-95"
              >
                <Plus size={18} /> Add a follow-up
              </button>
            </div>
            <div className="p-12 md:p-16 space-y-12">
               {followUps.length === 0 ? (
                  <div className="bg-gray-50/50 rounded-[2.5rem] border border-dashed border-gray-200 py-16 flex flex-col items-center justify-center text-center">
                    <Activity size={40} className="text-gray-300 mb-4" />
                    <p className="text-sm font-bold text-gray-400">You haven't added any follow-ups.</p>
                  </div>
               ) : (
                 <div className="space-y-10">
                    {followUps.map((step, idx) => (
                      <div key={idx} className="bg-gray-50/30 rounded-[3.5rem] border border-gray-100 p-10 relative group/step hover:border-gray-200 transition-all shadow-sm">
                        <button
                         type="button"
                         onClick={() => removeFollowUp(idx)}
                         className="absolute top-10 right-10 p-4 bg-white text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl border border-gray-100 shadow-sm transition-all opacity-0 group-hover/step:opacity-100"
                        >
                          <Trash2 size={24} />
                        </button>
                        <div className="flex flex-col md:flex-row gap-10 items-center mb-10">
                         <div className="w-16 h-16 bg-white border border-gray-100 rounded-2xl flex items-center justify-center font-bold text-[#8245EF] text-xl shadow-sm">
                            {(idx + 1).toString().padStart(2, '0')}
                         </div>
                           <div className="flex items-center gap-4">
                              <p className="text-xs font-bold text-gray-400">Wait for</p>
                              <div className="flex items-center gap-3 bg-white border border-gray-100 p-3 rounded-xl shadow-sm">
                                 <input
                                    type="number"
                                    min="1"
                                    value={step.delayValue || step.delayDays}
                                    onChange={(e) => updateFollowUp(idx, "delayValue", e.target.value)}
                                    className="bg-transparent text-gray-900 font-bold text-lg w-12 text-center outline-none"
                                  />
                                  <span className="text-xs font-bold text-[#8245EF]">Days</span>
                              </div>
                           </div>
                        </div>
                         <textarea
                          value={step.message}
                          onChange={(e) => updateFollowUp(idx, "message", e.target.value)}
                          placeholder="What should this follow-up message say?"
                          rows={4}
                          className="form-input bg-white border-gray-100 min-h-[120px] p-6 text-base font-medium"
                          required
                        />
                      </div>
                    ))}
                 </div>
               )}
            </div>
          </div>

          {/* Section 5: Start now */}
          <div className="bg-[#8245EF] rounded-[4rem] shadow-[0_40px_100px_rgba(130, 69, 239,0.2)] p-12 md:p-20 flex flex-col xl:flex-row items-center justify-between gap-16 relative overflow-hidden group">
             <div className="absolute -bottom-20 -right-20 p-10 opacity-10 grayscale group-hover:grayscale-0 transition-all duration-1000 rotate-12">
                <Hexagon size={300} className="text-white" />
             </div>
             <div className="flex-1 relative z-10 w-full xl:w-auto">
                 <div className="flex items-center gap-4 mb-4 text-white/90">
                    <ShieldCheck size={28} />
                    <h3 className="text-xs font-bold uppercase">Ready to start?</h3>
                 </div>
                 <h2 className="text-5xl font-bold text-white uppercase mb-10">Activate Plan</h2>
                 <div className="flex items-center justify-between p-8 bg-white/10 rounded-[2rem] border border-white/20 max-w-xl backdrop-blur-sm">
                    <div className="pr-10">
                       <p className="text-lg font-bold text-white uppercase">Stop on reply</p>
                       <p className="text-sm text-white/60 mt-1">Auto-stop if they message you back.</p>
                    </div>
                   <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={stopOnReply}
                      onChange={(e) => setStopOnReply(e.target.checked)}
                    />
                    <div className="w-16 h-9 bg-white/20 border border-white/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white/50 after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-white peer-checked:after:bg-[#8245EF] shadow-xl"></div>
                  </label>
                </div>
             </div>

              <div className="w-full xl:w-auto flex flex-col sm:flex-row gap-4 shrink-0 relative z-10">
                 <button
                   type="submit"
                   disabled={submitting}
                   className="px-10 py-5 bg-white text-[#8245EF] font-bold text-lg rounded-2xl hover:bg-gray-50 transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
                 >
                   {submitting ? (isEdit ? "Saving..." : "Starting...") : (isEdit ? "Save Changes" : "Start Plan")}
                   <Rocket size={20} />
                 </button>
                 <button
                   type="button"
                   onClick={() => router.back()}
                   className="px-10 py-5 text-white/50 hover:text-white font-bold text-sm uppercase transition-all"
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
