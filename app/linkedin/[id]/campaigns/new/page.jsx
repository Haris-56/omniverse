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
  Loader2,
  Bot,
  ChevronRight
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function NewLinkedInCampaignPage({ params: paramsPromise }) {
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
  const [weeklyLimit, setWeeklyLimit] = useState(100);
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
  const [aiAgents, setAiAgents] = useState([]);
  const [aiCloserId, setAiCloserId] = useState("");
  const [aiAgentTargetType, setAiAgentTargetType] = useState("leads_only");
  const [availableVariables, setAvailableVariables] = useState(["First Name", "Last Name", "Company", "Title"]);

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

  useEffect(() => {
    if (listId) {
      fetchListVariables(listId);
    }
  }, [listId]);

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

  const fetchCampaignToEdit = async () => {
    try {
      const res = await fetch(`/api/linkedin/campaigns?id=${editId}`);
      if (res.ok) {
        const data = await res.json();
        // Pre-fill form
        setName(data.name || "");
        setListId(data.listId || "");
        setMessage(data.message || "");
        setDailyLimit(data.dailyLimit || 20);
        setWeeklyLimit(data.weeklyLimit || 100);
        setMinDelay(data.minDelay || 10);
        setMaxDelay(data.maxDelay || 40);
        setTimezone(data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone);
        setStartTime(data.hours?.start || "09:00");
        setEndTime(data.hours?.end || "17:00");
        setStopOnReply(data.stopOnReply !== false);
        setBlacklist(data.blacklist?.join(", ") || "");
        setFollowUps(data.sequences || []);
        setConnectionNote(data.connectionNote || "");
        setSendAfterAccepted(data.sendAfterAccepted !== false);
        setAiCloserId(data.aiCloserId || "");
        setAiAgentTargetType(data.aiAgentTargetType || "leads_only");
      }
    } catch (error) {
      console.error("Failed to fetch campaign for editing", error);
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

  const fetchAiAgents = async () => {
    try {
      const res = await fetch("/api/ai-agents");
      if (res.ok) {
        const data = await res.json();
        // Filter for LinkedIn agents (case-insensitive)
        setAiAgents(data.filter(a => a.platform?.toLowerCase() === "linkedin"));
      }
    } catch (error) {
      console.error("Failed to fetch AI agents", error);
    }
  };

  const fetchListVariables = async (id) => {
    try {
      const res = await fetch(`/api/contacts?listId=${id}&limit=1`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          const keys = Object.keys(data[0]).filter(k => !["_id", "listId", "createdAt", "updatedAt", "__v"].includes(k));
          setAvailableVariables(keys.map(k => k.replace(/_/g, ' ')));
        }
      }
    } catch (error) {
      console.error("Failed to fetch list variables", error);
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
        weeklyLimit,
        aiCloserId,
        aiAgentTargetType
      };

      const res = await fetch("/api/linkedin/campaigns", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isEdit ? { id: editId, ...payload } : payload)
      });

      if (res.ok) {
        router.push(`/linkedin/${accountId}/campaigns`);
      } else {
        const err = await res.json();
        alert(err.error || `Failed to ${isEdit ? 'update' : 'create'} campaign`);
      }
    } catch (error) {
      console.error("Error creating campaign", error);
      alert("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
     <div className="h-screen w-full flex flex-col items-center justify-center bg-[#FCF8FE] space-y-6 text-center px-10">
        <div className="relative">
           <div className="w-16 h-16 border-4 border-[#8245EF]/10 border-t-[#8245EF] rounded-full animate-spin shadow-sm" />
           <div className="absolute inset-0 flex items-center justify-center">
              <Linkedin size={24} className="text-[#8245EF]" fill="currentColor" />
           </div>
        </div>
         <p className="font-bold text-gray-400">Loading...</p>
     </div>
  );

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-32 px-6 lg:px-20">
      <div className="max-w-[1200px] mx-auto space-y-12">
        
        {/* Header Section */}
        <div className="flex items-center gap-6 border-b border-gray-100 pb-8">
          <Link href={`/linkedin/${accountId}/campaigns`} className="p-3 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-[#8245EF] transition-all shadow-sm">
            <ChevronLeft size={24} />
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-4 mb-4">
               <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-full border border-green-100 flex items-center gap-2">
                 <ShieldCheck size={14} className="opacity-80" />
                 Active
               </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">{isEdit ? "Edit" : "Create"} LinkedIn Campaign</h1>
            <p className="text-gray-500 mt-2 text-lg">Set up your messages and when to send them. Using: <span className="text-[#8245EF] font-bold">{account?.email || account?.username}</span></p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          
          {/* Phase 1: Plan Details */}
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden transition-all hover:shadow-md">
            <div className="p-8 border-b border-gray-50 flex items-center gap-4 bg-gray-50/30">
              <div className="w-12 h-12 bg-white border border-gray-100 text-[#8245EF] rounded-xl flex items-center justify-center shadow-sm">
                <Target size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Campaign Details</h2>
                <p className="text-sm text-gray-500">Set a name for your campaign and choose your target list.</p>
              </div>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 ml-2">Plan Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sales Outreach"
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
            </div>
          </div>

          {/* Phase 2: Settings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             {/* Automation */}
             <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 flex flex-col justify-between hover:shadow-md transition-all">
                <div className="flex items-center gap-4 mb-6">
                   <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                      <ShieldCheck size={24} />
                   </div>
                   <div>
                      <h3 className="text-lg font-bold text-gray-900">Automation</h3>
                      <p className="text-sm text-gray-500">Wait for acceptance.</p>
                   </div>
                </div>
                <div className="flex items-center justify-between p-6 bg-gray-50/50 rounded-2xl border border-gray-100">
                  <div className="pr-4">
                    <p className="font-bold text-gray-900 text-xs">Wait for Accept</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={sendAfterAccepted}
                      onChange={(e) => setSendAfterAccepted(e.target.checked)}
                    />
                    <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500 shadow-sm"></div>
                  </label>
                </div>
             </div>

             {/* AI Closer */}
             <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 flex flex-col justify-between hover:shadow-md transition-all gap-4">
                <div className="flex items-center gap-4 mb-2">
                   <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                      <Bot size={24} />
                   </div>
                   <div>
                      <h3 className="text-lg font-bold text-gray-900">AI Closer</h3>
                      <p className="text-sm text-gray-500">Select an AI agent.</p>
                   </div>
                </div>
                
                <div className="space-y-4">
                   <div className="relative">
                      <select
                        value={aiCloserId}
                        onChange={(e) => setAiCloserId(e.target.value)}
                        className="form-input h-10 py-0 appearance-none pr-10 text-sm"
                      >
                        <option value="">No AI Closer</option>
                        {aiAgents.map(agent => (
                          <option key={agent._id} value={agent._id}>{agent.name}</option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                         <ChevronRight size={14} className="rotate-90" />
                      </div>
                   </div>

                   <div className="relative">
                      <select
                        value={aiAgentTargetType}
                        onChange={(e) => setAiAgentTargetType(e.target.value)}
                        className="form-input h-10 py-0 appearance-none pr-10 text-sm"
                      >
                        <option value="leads_only">Only Leads Chat AI Agent</option>
                        <option value="all_chats">AI Agent for All Chats</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                         <ChevronRight size={14} className="rotate-90" />
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* Invite Message */}
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 md:p-10 space-y-6 hover:shadow-md transition-all">
             <div className="flex items-center justify-between">
                 <div>
                    <h3 className="text-lg font-bold text-gray-900">Connection Note</h3>
                    <p className="text-sm text-gray-500">Add a short message to send with your connection request.</p>
                 </div>
                <div className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-gray-500 text-xs font-bold">
                   {connectionNote.length} / 300
                </div>
             </div>
             
             <div className="flex flex-wrap gap-2">
                 <p className="text-xs font-bold text-gray-400 mr-2 flex items-center uppercase tracking-widest">Insert Tags:</p>
                {availableVariables.map(v => (
                  <button key={v} type="button" onClick={() => insertVariable("note", `[[${v}]]`)} className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-[#8245EF] hover:bg-[#8245EF] hover:text-white transition-all">
                    {v}
                  </button>
                ))}
             </div>

             <textarea
                value={connectionNote}
                onChange={(e) => setConnectionNote(e.target.value)}
                placeholder="Write your note here (max 300 characters)..."
                rows={4}
                maxLength={300}
                className="form-input min-h-[120px] p-6 text-base font-medium"
              />
          </div>

          {/* Main Message */}
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white border border-gray-100 text-[#8245EF] rounded-xl flex items-center justify-center">
                   <Cpu size={24} />
                </div>
                 <div>
                  <h3 className="text-lg font-bold text-gray-900">First Message</h3>
                  <p className="text-sm text-gray-500">What message should we send after they connect?</p>
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
            
            <div className="p-8 space-y-8">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                  
                   <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 ml-2">Add details</label>
                <div className="flex flex-wrap gap-2">
                   {availableVariables.map(v => (
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

               <div className="space-y-2">
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
          </div>

          {/* Execution Schedule */}
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all">
            <div className="p-8 border-b border-gray-50 flex items-center gap-4 bg-gray-50/30">
              <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center">
                <Clock size={24} />
              </div>
               <div>
                <h2 className="text-xl font-bold text-gray-900">Daily Limits</h2>
                <p className="text-sm text-gray-500">Set how many and when to send messages.</p>
              </div>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 ml-2">Limit per day (Max 20)</label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={dailyLimit}
                    onChange={(e) => setDailyLimit(Math.min(20, parseInt(e.target.value) || 0))}
                    className="form-input text-center text-3xl font-bold py-6"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-right opacity-40 pointer-events-none">
                     <span className="text-[10px] font-bold block">messages / day</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 ml-2">Limit per week (Max 100)</label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={weeklyLimit}
                    onChange={(e) => setWeeklyLimit(Math.min(100, parseInt(e.target.value) || 0))}
                    className="form-input text-center text-3xl font-bold py-6"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-right opacity-40 pointer-events-none">
                     <span className="text-[10px] font-bold block">messages / week</span>
                  </div>
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

          {/* Follow Ups */}
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                  <Layers size={24} />
                </div>
                 <div>
                  <h2 className="text-xl font-bold text-gray-900">Sequence Steps</h2>
                  <p className="text-sm text-gray-500">Add follow-up messages to send automatically.</p>
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
            <div className="p-8 space-y-8">
              {followUps.length === 0 ? (
                  <div className="bg-gray-50/50 rounded-[2.5rem] border border-dashed border-gray-200 py-16 flex flex-col items-center justify-center text-center">
                    <Activity size={40} className="text-gray-300 mb-4" />
                    <p className="text-sm font-bold text-gray-400">You haven't added any follow-ups.</p>
                  </div>
              ) : (
                <div className="space-y-8">
                  {followUps.map((step, idx) => (
                    <div key={idx} className="bg-gray-50/50 rounded-3xl border border-gray-100 p-8 relative group/step hover:border-gray-200 transition-all shadow-sm">
                       <button
                        type="button"
                        onClick={() => removeFollowUp(idx)}
                        className="absolute top-6 right-6 p-2 bg-white text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg border border-gray-100 shadow-sm transition-all opacity-0 group-hover/step:opacity-100"
                      >
                        <Trash2 size={18} />
                      </button>
                      <div className="flex flex-col xl:flex-row gap-8 items-center mb-8">
                         <div className="w-16 h-16 bg-white border border-gray-100 rounded-2xl flex items-center justify-center font-bold text-[#8245EF] text-xl shadow-sm">
                            {(idx + 1).toString().padStart(2, '0')}
                         </div>
                         <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                             <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 ml-2">Select Action</label>
                               <div className="relative">
                                  <select
                                    value={step.type || "message"}
                                    onChange={(e) => updateFollowUp(idx, "type", e.target.value)}
                                    className="form-input appearance-none py-3 text-sm bg-white"
                                  >
                                     <option value="message">Send a message</option>
                                    <option value="visit_profile">Visit their profile</option>
                                    <option value="withdraw">Cancel Request</option>
                                  </select>
                                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                     <ArrowRight size={16} />
                                  </div>
                               </div>
                            </div>
                           <div className="flex items-center gap-4">
                              <p className="text-xs font-bold text-gray-400">Wait for</p>
                              <div className="flex items-center gap-3 bg-white border border-gray-100 p-3 rounded-xl shadow-sm">
                                 <input
                                    type="number"
                                    min="1"
                                    value={step.delayDays}
                                    onChange={(e) => updateFollowUp(idx, "delayDays", e.target.value)}
                                    className="bg-transparent text-gray-900 font-bold text-lg w-12 text-center outline-none"
                                  />
                                  <span className="text-[10px] font-bold text-[#8245EF] uppercase">Days</span>
                              </div>
                           </div>
                         </div>
                      </div>
                      {(!step.type || step.type === "message") && (
                        <div className="space-y-4">
                           <div className="flex flex-wrap gap-2">
                              {availableVariables.map(v => (
                                <button
                                  key={v}
                                  type="button"
                                  onClick={() => insertVariable(idx, `[[${v}]]`)}
                                  className="px-3 py-1.5 bg-white border border-gray-100 rounded-lg text-[10px] font-bold text-[#8245EF] hover:text-white hover:bg-[#8245EF] transition-all shadow-sm"
                                >
                                  {v}
                                </button>
                              ))}
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
                      )}
                    </div>
                  ))}
                </div>
               )}
            </div>
          </div>

          {/* Finish Section */}
          <div className="bg-[#8245EF] rounded-[2.5rem] shadow-xl p-12 md:p-16 flex flex-col xl:flex-row items-center justify-between gap-12 relative overflow-hidden group">
             <div className="absolute -bottom-10 -right-10 opacity-5 group-hover:opacity-10 transition-all duration-1000 rotate-12">
                <Linkedin size={240} className="text-white" fill="currentColor" />
             </div>
             
             <div className="flex-1 relative z-10">
                 <div className="flex items-center gap-4 mb-4 text-white/90">
                    <ShieldCheck size={28} />
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">Almost Done</h3>
                 </div>
                 <h2 className="text-4xl font-bold text-white mb-8 tracking-tight">Launch Campaign</h2>
                <div className="flex items-center justify-between p-8 bg-white/10 rounded-[2rem] border border-white/20 max-w-xl backdrop-blur-sm">
                   <div className="pr-8">
                      <p className="text-lg font-bold text-white">Stop if they reply</p>
                      <p className="text-sm text-white/70 mt-1">The computer will stop sending messages to someone if they write back.</p>
                   </div>
                   <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={stopOnReply}
                      onChange={(e) => setStopOnReply(e.target.checked)}
                    />
                    <div className="w-16 h-8 bg-white/20 border border-white/30 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-white peer-checked:after:bg-[#8245EF]"></div>
                  </label>
                </div>
             </div>

              <div className="w-full xl:w-auto flex flex-col sm:flex-row gap-4 shrink-0 relative z-10">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-10 py-5 bg-white text-[#8245EF] font-bold text-lg rounded-2xl hover:bg-gray-50 transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95"
                  >
                    {submitting ? (isEdit ? "Updating..." : "Launching...") : (isEdit ? "Save Changes" : "Launch Campaign")}
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

       {/* Top Static Line Progress */}
       <div className="fixed top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-[#8245EF]/30 to-transparent z-[100]" />
       
       <style jsx>{`
        .form-input {
          width: 100%;
          padding: 1rem 1.5rem;
          background-color: white;
          border: 1px solid #e2e8f0;
          border-radius: 1rem;
          font-weight: 500;
          color: #1e293b;
          outline: none;
          transition: all 0.2s;
          font-size: 1rem;
        }
        .form-input:focus {
          border-color: #8245EF;
          box-shadow: 0 0 0 3px rgba(130, 69, 239, 0.1);
        }
      `}</style>
    </div>
  );
}
