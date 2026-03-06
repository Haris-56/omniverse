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
  Instagram,
  Camera,
  Bot
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewInstagramCampaignPage({ params: paramsPromise }) {
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
  const [isMessageRequest, setIsMessageRequest] = useState(true);
  const [executionPriority, setExecutionPriority] = useState(['story', 'highlight', 'message']);
  const [availableVariables, setAvailableVariables] = useState(["{{firstName}}", "{{lastName}}", "{{company}}", "{{username}}", "{{location}}"]);

  // Templates State
  const [templates, setTemplates] = useState([]);
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [savingTemplate, setSavingTemplate] = useState(false);

  // AI & Automation Triggers
  const [aiAgents, setAiAgents] = useState([]);
  const [enableAiAgent, setEnableAiAgent] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [watchStory, setWatchStory] = useState(false);
  const [watchHighlights, setWatchHighlights] = useState(false);
  const [hourlyLimit, setHourlyLimit] = useState(5);

  useEffect(() => {
    fetchData();
    fetchTemplates();
    fetchAgents();
  }, [accountId]);

  useEffect(() => {
    if (!listId) {
      setAvailableVariables(["{{firstName}}", "{{lastName}}", "{{company}}", "{{username}}", "{{location}}"]);
      return;
    }
    const fetchListVariables = async () => {
      try {
        const res = await fetch(`/api/contacts?listId=${listId}`);
        if (res.ok) {
           const contacts = await res.json();
           if (contacts && contacts.length > 0) {
              const firstContact = contacts[0];
              const excludeKeys = ['_id', 'userId', 'listId', 'createdAt', 'updatedAt', 'segments'];
              const customKeys = Object.keys(firstContact).filter(key => !excludeKeys.includes(key));
              if (customKeys.length > 0) {
                 setAvailableVariables(customKeys.map(k => `{{${k}}}`));
                 return;
              }
           }
        }
      } catch (err) {}
      setAvailableVariables(["{{firstName}}", "{{lastName}}", "{{company}}", "{{username}}", "{{location}}"]);
    };
    fetchListVariables();
  }, [listId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [accRes, listsRes] = await Promise.all([
        fetch(`/api/instagram/accounts/${accountId}`),
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
      const res = await fetch("/api/templates?platform=instagram");
      if (res.ok) setTemplates(await res.json());
    } catch (error) {
      console.error("Failed to fetch templates", error);
    }
  };

  const fetchAgents = async () => {
    try {
      const res = await fetch("/api/ai-agents");
      if (res.ok) setAiAgents(await res.json());
    } catch (error) {
      console.error("Failed to fetch AI agents", error);
    }
  };

  const addFollowUp = () => {
    setFollowUps([...followUps, { delayDays: 1, message: "" }]);
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
          platform: "instagram",
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
        isMessageRequest,
        watchStory,
        watchHighlights,
        enableAiAgent,
        aiAgentId: enableAiAgent ? selectedAgentId : null,
        executionPriority,
        hourlyLimit
      };

      const res = await fetch("/api/instagram/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        router.push(`/instagram/${accountId}/campaigns`);
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
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50/50 space-y-6">
       <div className="animate-spin w-10 h-10 border-4 border-[#E1306C] border-t-transparent rounded-full" />
       <p className="text-gray-400 font-medium text-xs uppercase tracking-wide">Loading...</p>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-gray-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="flex items-center gap-4 mb-10">
          <Link href={`/instagram/${accountId}/campaigns`} className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-gray-900 transition-all shadow-sm">
            <ChevronLeft size={20} />
          </Link>
          <div className="h-10 w-px bg-gray-200 mx-2 hidden md:block" />
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
               <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wide rounded-full border border-blue-100">Instagram</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight truncate">New Campaign</h1>
            <p className="text-gray-500 text-sm font-medium mt-1">Creating campaign for <span className="text-gray-900 font-bold">{account?.email}</span></p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          
          {/* Section 1: Campaign Essentials */}
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/20 overflow-hidden">
            <div className="p-6 md:p-8 border-b border-gray-50 flex items-center gap-4 bg-gray-50/30">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-[#E1306C]">
                <Target size={24} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 tracking-tight">Campaign Details</h2>
                <p className="text-xs font-semibold text-gray-500">Name and target list</p>
              </div>
            </div>
            <div className="p-8 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-700 ml-1">Campaign Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. DM Outreach v1"
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500/30 focus:bg-white transition-all font-bold text-gray-900 placeholder-gray-300"
                  required
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-700 ml-1">Contact List</label>
                <select
                  value={listId}
                  onChange={(e) => setListId(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500/30 focus:bg-white transition-all font-bold text-gray-900 appearance-none"
                  required
                >
                  <option value="">-- Select Master List --</option>
                  {contactLists.map(list => (
                    <option key={list._id} value={list._id}>{list.name} ({list.count} units)</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Strategy Protocol */}
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/20 overflow-hidden">
             <div className="p-6 md:p-8 border-b border-gray-50 flex items-center gap-4 bg-gray-50/30">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-[#E1306C]">
                <Rocket size={24} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 tracking-tight">Outreach Settings</h2>
                <p className="text-xs font-semibold text-gray-500">Delivery method & behavioral settings</p>
              </div>
            </div>
            <div className="p-8 md:p-10 space-y-6">
              
              {/* Execution Priority */}
              <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm md:text-base font-bold text-gray-900">Execution Priority</h4>
                      <p className="text-xs text-gray-500 mt-1 font-medium">Order of fallback methods (drag/select to prioritize)</p>
                    </div>
                 </div>
                 <div className="flex flex-col gap-3">
                    {['story', 'highlight', 'message'].map((method) => {
                      const isActive = executionPriority.includes(method);
                      const priorityIndex = executionPriority.indexOf(method);
                      return (
                        <div 
                          key={method}
                          onClick={() => {
                            if (isActive) {
                                // Keep at least one method active
                                if (executionPriority.length > 1) {
                                    setExecutionPriority(executionPriority.filter(m => m !== method));
                                }
                            } else {
                                setExecutionPriority([...executionPriority, method]);
                            }
                          }}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${isActive ? 'bg-pink-50 border-pink-200' : 'bg-gray-50/50 border-gray-100 hover:bg-gray-50'}`}
                        >
                           <div className="flex items-center gap-3">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isActive ? 'bg-[#E1306C] text-white' : 'bg-gray-200 text-gray-400'}`}>
                                 {isActive ? priorityIndex + 1 : '-'}
                              </div>
                              <span className="font-bold text-gray-900 text-sm capitalize">
                                {method === 'story' ? 'Reply through Story' : method === 'highlight' ? 'Reply through Highlight' : 'Direct Message'}
                              </span>
                           </div>
                           {isActive && <Check size={16} className="text-[#E1306C]" />}
                        </div>
                      )
                    })}
                 </div>
              </div>

              {/* Message Request */}
              <div className="flex items-center justify-between p-6 bg-pink-50/30 rounded-[2rem] border border-pink-50 group hover:bg-pink-50 transition-all duration-300">
                <div className="pr-4">
                  <h4 className="text-sm md:text-base font-bold text-gray-900">Message Request Mode</h4>
                  <p className="text-xs text-gray-500 mt-1 font-medium">Send as 'Message Request' if not following</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={isMessageRequest}
                    onChange={(e) => setIsMessageRequest(e.target.checked)}
                  />
                  <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#E1306C] shadow-inner transition-all border border-transparent peer-checked:border-pink-200"></div>
                </label>
              </div>

              {/* Engagement Triggers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className={`p-6 rounded-[2rem] border transition-all cursor-pointer ${watchStory ? 'bg-pink-50 border-pink-200 shadow-sm' : 'bg-gray-50/50 border-gray-100'}`} onClick={() => setWatchStory(!watchStory)}>
                    <div className="flex items-center justify-between mb-2">
                       <span className="font-bold text-gray-900 text-sm">Watch Stories</span>
                       {watchStory && <Check size={16} className="text-[#E1306C]" />}
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">Engage with user stories to increase visibility before sending DM.</p>
                 </div>
                 
                 <div className={`p-6 rounded-[2rem] border transition-all cursor-pointer ${watchHighlights ? 'bg-pink-50 border-pink-200 shadow-sm' : 'bg-gray-50/50 border-gray-100'}`} onClick={() => setWatchHighlights(!watchHighlights)}>
                    <div className="flex items-center justify-between mb-2">
                       <span className="font-bold text-gray-900 text-sm">Watch Highlights</span>
                       {watchHighlights && <Check size={16} className="text-[#E1306C]" />}
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">Interact with profile highlights to mimic organic interest.</p>
                 </div>
              </div>

            </div>
          </div>

          {/* Section 3: Payload Configuration */}
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/20 overflow-hidden">
            <div className="p-6 md:p-8 border-b border-gray-50 flex items-center gap-4 bg-gray-50/30">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-[#E1306C]">
                <Cpu size={24} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 tracking-tight">Message Content</h2>
                <p className="text-xs font-semibold text-gray-500">Draft your initial message</p>
              </div>
            </div>
            <div className="p-8 md:p-10 space-y-8">
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                 <div className="flex-1 w-full space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Template Preset</label>
                    <select
                      onChange={(e) => handleApplyTemplate(e.target.value)}
                      className="w-full bg-pink-50/50 border border-pink-100 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-pink-500/10 transition-all font-bold text-pink-900 appearance-none text-sm"
                    >
                      <option value="">Manual Entry (No Preset)</option>
                      {templates.map(t => (
                        <option key={t._id} value={t._id}>{t.name}</option>
                      ))}
                    </select>
                 </div>
                 {!showSaveTemplate ? (
                    <button
                      type="button"
                      onClick={() => setShowSaveTemplate(true)}
                      className="whitespace-nowrap flex items-center gap-2 text-[#E1306C] font-bold text-xs uppercase tracking-wider hover:bg-pink-50 px-6 py-4 rounded-2xl border border-dashed border-pink-200 transition-all mt-6 md:mt-7"
                    >
                      <Plus size={16} /> Save Template
                    </button>
                 ) : (
                    <div className="flex-1 w-full p-6 bg-pink-50/30 rounded-3xl border border-pink-50 flex flex-col gap-4 shadow-inner">
                       <input
                        type="text"
                        value={templateName}
                        onChange={(e) => setTemplateName(e.target.value)}
                        placeholder="Template Identifier"
                        className="w-full bg-white border border-pink-100 rounded-xl px-4 py-2 text-sm font-bold outline-none"
                      />
                      <div className="flex gap-2">
                        <button onClick={handleSaveAsTemplate} className="flex-1 bg-[#E1306C] text-white text-xs font-bold uppercase py-2 rounded-lg">Save</button>
                        <button onClick={() => setShowSaveTemplate(false)} className="flex-1 bg-white border border-gray-200 text-gray-500 text-xs font-bold uppercase py-2 rounded-lg">Cancel</button>
                      </div>
                    </div>
                 )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                   <label className="text-sm font-bold text-gray-700 ml-1">Initial Message</label>
                   <div className="flex items-center gap-2 flex-wrap">
                      {availableVariables.map(v => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => insertVariable("main", v)}
                          className="px-3 py-1 bg-white border border-gray-100 rounded-lg text-[10px] font-bold text-[#E1306C] hover:border-pink-200 hover:bg-pink-50 transition-all"
                        >
                          {v}
                        </button>
                      ))}
                   </div>
                </div>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter your message..."
                  rows={6}
                  className="w-full bg-gray-50 border border-gray-100 rounded-[2rem] px-8 py-8 font-medium text-gray-900 focus:bg-white focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500/30 transition-all outline-none resize-none shadow-inner"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 4: Execution Protocol */}
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/20 overflow-hidden">
            <div className="p-6 md:p-8 border-b border-gray-50 flex items-center gap-4 bg-gray-50/30">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-[#E1306C]">
                <Clock size={24} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 tracking-tight">Schedule & Limits</h2>
                <p className="text-xs font-semibold text-gray-500">Daily limits and timezone</p>
              </div>
            </div>
            <div className="p-8 md:p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-700 ml-1">Daily Limit (DMs)</label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={dailyLimit}
                    onChange={(e) => setDailyLimit(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-black outline-none focus:bg-white transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-amber-500 uppercase">Recommended: 20-30</span>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-700 ml-1">Hourly Limit (DMs)</label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={hourlyLimit}
                    onChange={(e) => setHourlyLimit(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-black outline-none focus:bg-white transition-all"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-700 ml-1">Random Delay (Seconds)</label>
                <div className="flex items-center gap-3">
                  <input type="number" min="5" value={minDelay} onChange={(e) => setMinDelay(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-center font-bold" />
                  <span className="text-gray-300 font-black">{"->"}</span>
                  <input type="number" max="120" value={maxDelay} onChange={(e) => setMaxDelay(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-center font-bold" />
                </div>
              </div>
               <div className="space-y-3">
                <label className="text-sm font-bold text-gray-700 ml-1">Timezone</label>
                <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-4 font-bold text-xs appearance-none">
                  <option value="UTC">Universal (UTC)</option>
                  <option value="America/New_York">Eastern (EST)</option>
                  <option value="Asia/Karachi">Karachi (PKT)</option>
                </select>
              </div>
              <div className="space-y-3 col-span-1 md:col-span-2 lg:col-span-1">
                <label className="text-sm font-bold text-gray-700 ml-1">Sending Hours</label>
                <div className="flex items-center gap-3">
                  <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-center font-bold" />
                  <span className="text-gray-300 font-black">{"->"}</span>
                  <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-center font-bold" />
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Sequence Layers */}
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/20 overflow-hidden">
            <div className="p-6 md:p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-[#E1306C]">
                  <Zap size={24} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 tracking-tight">Follow-ups</h2>
                  <p className="text-xs font-semibold text-gray-500">Automated sequences if no reply</p>
                </div>
              </div>
              <button
                type="button"
                onClick={addFollowUp}
                className="px-6 py-3 bg-pink-50 text-[#E1306C] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#E1306C] hover:text-white transition-all flex items-center gap-2"
              >
                <Plus size={16} /> Add Follow-up
              </button>
            </div>
            <div className="p-8 md:p-10 space-y-8">
              {followUps.length === 0 ? (
                <div className="text-center py-10 opacity-30 italic font-medium text-gray-400 text-sm">
                  No follow-ups added.
                </div>
              ) : (
                <div className="space-y-6">
                  {followUps.map((step, idx) => (
                    <div key={idx} className="bg-gray-50/50 rounded-3xl border border-gray-100 p-8 relative group hover:bg-white hover:border-pink-100 transition-all shadow-sm">
                       <button
                        type="button"
                        onClick={() => removeFollowUp(idx)}
                        className="absolute top-6 right-6 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={18} />
                      </button>
                      <div className="flex flex-col md:flex-row gap-6 mb-6 justify-between items-start md:items-center">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-white shadow-sm border border-gray-100 rounded-xl flex items-center justify-center font-black text-[#E1306C]">{idx + 1}</div>
                           <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Delay:</span>
                              <input
                                type="number"
                                min="1"
                                value={step.delayDays}
                                onChange={(e) => updateFollowUp(idx, "delayDays", e.target.value)}
                                className="w-16 bg-white border border-gray-200 rounded-lg py-1 text-center font-bold text-sm outline-none focus:border-pink-300 transition-all"
                              />
                              <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Days after previous</span>
                           </div>
                        </div>
                        <div className="flex items-center gap-1 flex-wrap">
                          {availableVariables.map(v => (
                            <button
                              key={v}
                              type="button"
                              onClick={() => insertVariable(idx, v)}
                              className="px-2 py-1 bg-white border border-gray-100 rounded-lg text-[10px] font-bold text-[#E1306C] hover:border-pink-200 hover:bg-pink-50 transition-all"
                            >
                              {v}
                            </button>
                          ))}
                        </div>
                      </div>
                      <textarea
                        value={step.message}
                        onChange={(e) => updateFollowUp(idx, "message", e.target.value)}
                        placeholder="Enter message..."
                        rows={3}
                        className="w-full bg-white border border-gray-100 rounded-2xl p-6 text-sm font-medium outline-none focus:ring-4 focus:ring-pink-100 transition-all resize-none shadow-sm"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Section 6: AI Intelligence */}
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/20 overflow-hidden">
             <div className="p-6 md:p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-[#E1306C]">
                    <Bot size={24} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 tracking-tight">AI Auto-Reply</h2>
                    <p className="text-xs font-semibold text-gray-500">Hand over to AI after reply</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={enableAiAgent}
                    onChange={(e) => setEnableAiAgent(e.target.checked)}
                  />
                  <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#E1306C] shadow-inner transition-all border border-transparent peer-checked:border-pink-200"></div>
                </label>
             </div>
             
             {enableAiAgent && (
               <div className="p-8 md:p-10 animate-in slide-in-from-top-4 duration-300">
                  <div className="p-6 bg-indigo-50/50 rounded-3xl border border-indigo-100 mb-6">
                     <p className="text-xs font-medium text-indigo-800 leading-relaxed">
                        <Info size={14} className="inline mr-2 -mt-0.5" />
                        Selected AI Agent will take over the conversation after the initial message or reply. Ensure the agent is compatible with your campaign goals.
                     </p>
                  </div>
                  
                  <div className="space-y-3">
                     <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1">Select Persona</label>
                     <select
                       value={selectedAgentId}
                       onChange={(e) => setSelectedAgentId(e.target.value)}
                       className="w-full bg-white border border-gray-200 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/30 transition-all font-bold text-gray-900 appearance-none"
                     >
                       <option value="">-- Choose an Agent --</option>
                       {aiAgents.map(agent => (
                         <option key={agent._id} value={agent._id}>{agent.name}</option>
                       ))}
                     </select>
                  </div>
               </div>
             )}
          </div>

          {/* Section 7: Master Control */}
          <div className="bg-[#1C0912] rounded-[2.5rem] border border-pink-900/30 shadow-2xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-10">
             <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 text-pink-400">
                   <ShieldCheck size={20} />
                   <h3 className="text-xs font-bold uppercase tracking-wide">Stop Settings</h3>
                </div>
                <h2 className="text-xl font-bold text-white mb-4">Stop on Reply</h2>
                <div className="flex items-center justify-between p-6 bg-pink-950/20 rounded-3xl border border-pink-900/30">
                   <div className="pr-4 text-left">
                      <p className="text-sm font-bold text-pink-50">Stop on Reply</p>
                      <p className="text-xs text-pink-400 mt-1 font-medium">Pause follow-ups if contact replies</p>
                   </div>
                   <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={stopOnReply}
                      onChange={(e) => setStopOnReply(e.target.checked)}
                    />
                    <div className="w-14 h-8 bg-pink-900/40 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#E1306C] border border-pink-800 transition-all shadow-inner"></div>
                  </label>
                </div>
             </div>

             <div className="w-full md:w-auto flex flex-col gap-4 shrink-0">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-12 py-5 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] text-white font-bold text-xs uppercase tracking-widest rounded-2xl hover:opacity-90 transition-all shadow-xl shadow-pink-900/40 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                >
                  {submitting ? "Creating..." : "Create Campaign"}
                  <Camera size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-12 py-4 bg-pink-950/20 text-pink-400 font-bold text-xs uppercase tracking-widest rounded-2xl hover:bg-pink-950/40 transition-all flex items-center justify-center border border-pink-900/20"
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
