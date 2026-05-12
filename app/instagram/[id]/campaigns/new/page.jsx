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
  Bot,
  Activity,
  Layers,
  ArrowRight,
  Globe,
  Heart,
  Mic,
  UserPlus,
  Loader2
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
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endOnCompletion, setEndOnCompletion] = useState(true);
  const [blacklist, setBlacklist] = useState("");
  const [followUps, setFollowUps] = useState([]); 
  const [isMessageRequest, setIsMessageRequest] = useState(true);
  const [executionPriority, setExecutionPriority] = useState(['story', 'highlight', 'message']);
  const [availableVariables, setAvailableVariables] = useState(["{{firstName}}", "{{lastName}}", "{{company}}", "{{username}}", "{{location}}"]);
  const [media, setMedia] = useState(null);
  const [mediaScanning, setMediaScanning] = useState(false);

  // Templates State
  const [templates, setTemplates] = useState([]);
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [savingTemplate, setSavingTemplate] = useState(false);

  // AI & Automation Triggers
  const [smartDelay, setSmartDelay] = useState(true);
  const [followBehavior, setFollowBehavior] = useState("none");
  const [likeBehavior, setLikeBehavior] = useState("none");
  const [commentBehavior, setCommentBehavior] = useState("none");
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
    setFollowUps([...followUps, { 
      delayValue: 24, 
      delayUnit: "hours", 
      message: "",
      executionPriority: ['story', 'highlight', 'message'],
      mediaUrl: null,
      showAdvanced: false,
      likeBehavior: "none",
      followBehavior: "none",
      commentBehavior: "none",
      mediaScanning: false
    }]);
  };

  const removeFollowUp = (index) => {
    setFollowUps(followUps.filter((_, i) => i !== index));
  };

  const updateFollowUp = (index, field, value) => {
    const newFollowUps = [...followUps];
    newFollowUps[index][field] = value;
    setFollowUps(newFollowUps);
  };

  const handleMediaUpload = async (e, targetIndex = -1) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Limits: Max 100MB for video, 15MB for audio/image
    if (file.type.startsWith('video/') && file.size > 100 * 1024 * 1024) return alert("Video exceeds Instagram 100MB limit.");
    if (!file.type.startsWith('video/') && file.size > 15 * 1024 * 1024) return alert("File exceeds 15MB limit.");

    if (targetIndex === -1) setMediaScanning(true);
    else updateFollowUp(targetIndex, "mediaScanning", true);

    // Simulated Content Moderation Network Delay (18+ NSFW check)
    await new Promise(r => setTimeout(r, 1500)); 
    
    const url = URL.createObjectURL(file);
    const mediaObj = { type: file.type, url, name: file.name };

    // You would map file uploads to a real backend in production.
    if (targetIndex === -1) {
      setMedia(mediaObj);
      setMediaScanning(false);
    } else {
      updateFollowUp(targetIndex, "media", mediaObj);
      updateFollowUp(targetIndex, "mediaScanning", false);
    }
  };

  const hasLink = (text) => /https?:\/\/[^\s]+/.test(text || "");

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
    if (!name || !listId || (!message && !media)) {
      alert("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        accountId,
        name,
        listId,
        message,
        mediaUrl: media?.url || null,
        dailyLimit,
        minDelay,
        maxDelay,
        timezone,
        hours: { start: startTime, end: endTime },
        sequences: followUps.map(f => ({
            delayValue: parseInt(f.delayValue),
            delayUnit: f.delayUnit,
            message: f.message,
            executionPriority: f.executionPriority || ['story', 'highlight', 'message'],
            mediaUrl: f.media?.url || null, 
            likeBehavior: f.likeBehavior,
            followBehavior: f.followBehavior,
            commentBehavior: f.commentBehavior
        })),
        stopOnReply,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        endOnCompletion,
        blacklist: blacklist.split(",").map(s => s.trim()).filter(Boolean),
        isMessageRequest,
        watchStory,
        watchHighlights,
        enableAiAgent,
        aiAgentId: enableAiAgent ? selectedAgentId : null,
        executionPriority,
        hourlyLimit,
        smartDelay,
        followBehavior,
        likeBehavior,
        commentBehavior
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
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#FCF8FE] space-y-6">
       <div className="animate-spin w-10 h-10 border-4 border-[#8245EF] border-t-transparent rounded-full" />
       <p className="text-[#94a3b8] font-black text-[9px] uppercase tracking-[0.3em] font-mono">Syncing...</p>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-[#FCF8FE] p-6 md:p-10 lg:p-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="max-w-[1500px] mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
          <div className="flex items-center gap-8">
            <Link href={`/instagram/${accountId}/campaigns`} className="p-4 bg-white border border-[#8245EF]/10 rounded-[1.5rem] text-[#8245EF] hover:bg-[#8245EF] hover:text-white transition-all shadow-lg group">
              <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </Link>
            <div>
               <div className="flex items-center gap-3 mb-3">
                  <span className="px-4 py-1.5 bg-[#8245EF]/10 text-[#8245EF] text-[9px] font-black uppercase tracking-[0.2em] rounded-full border border-[#8245EF]/20 flex items-center gap-2 font-mono">
                    <Instagram size={12} />
                    New Plan
                  </span>
               </div>
               <h1 className="text-3xl font-black text-[#161932] tracking-tighter uppercase leading-tight">Create Instagram Plan</h1>
               <p className="text-[#64748b] mt-3 text-lg font-medium">Set up your messages and when to send them. Using: <span className="text-[#8245EF] font-black">{account?.username}</span></p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-16">
          
          {/* Phase 1: Details */}
          <div className="bg-white rounded-[2.5rem] border border-[#8245EF]/15 shadow-sm overflow-hidden group hover:shadow-[0_20px_40px_rgba(130, 69, 239,0.05)] transition-all">
            <div className="p-8 border-b border-[#8245EF]/10 flex items-center gap-6 bg-[#FCF8FE]/30">
              <div className="w-12 h-12 bg-[#FCF8FE] border border-[#8245EF]/10 text-[#8245EF] rounded-[1.25rem] flex items-center justify-center shadow-inner group-hover:rotate-12 duration-700">
                <Target size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-[#161932] tracking-tighter uppercase leading-none">Plan Details</h2>
                <p className="text-[9px] font-black text-[#94a3b8] uppercase tracking-[0.3em] font-mono mt-2">Basic name and target list.</p>
              </div>
            </div>
            <div className="p-10 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.2em] font-mono ml-4">Plan Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Plan Name"
                  className="form-input text-lg font-black"
                  required
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.2em] font-mono ml-4">People to Message</label>
                <div className="relative">
                  <select
                    value={listId}
                    onChange={(e) => setListId(e.target.value)}
                    className="form-input appearance-none pr-12 text-lg font-black"
                    required
                  >
                    <option value="">-- Choose List --</option>
                    {contactLists.map(list => (
                      <option key={list._id} value={list._id}>{list.name} ({list.count} people)</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Phase 2: Settings */}
          <div className="bg-white rounded-[2.5rem] border border-[#8245EF]/15 shadow-sm overflow-hidden group hover:shadow-[0_20px_40px_rgba(130, 69, 239,0.05)] transition-all">
             <div className="p-8 border-b border-[#8245EF]/10 flex items-center gap-6 bg-[#FCF8FE]/30">
              <div className="w-12 h-12 bg-[#FCF8FE] border border-[#8245EF]/10 text-[#8245EF] rounded-[1.25rem] flex items-center justify-center shadow-inner group-hover:scale-110 duration-700">
                <Rocket size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-[#161932] tracking-tighter uppercase leading-none">Settings</h2>
                <p className="text-[9px] font-black text-[#94a3b8] uppercase tracking-[0.3em] font-mono mt-2">How you want to reach out.</p>
              </div>
            </div>
            <div className="p-10 md:p-12 space-y-10">
              <div className="space-y-4">
                 <div className="flex items-center justify-between ml-4">
                    <label className="text-[9px] font-black text-[#94a3b8] uppercase tracking-[0.3em] font-mono">Priority Order</label>
                 </div>
                 <div className="flex flex-col xl:flex-row gap-4">
                    {['story', 'highlight', 'message'].map((method) => {
                      const isActive = executionPriority.includes(method);
                      const priorityIndex = executionPriority.indexOf(method);
                      return (
                        <div 
                          key={method}
                          onClick={() => {
                            if (isActive) {
                                if (executionPriority.length > 1) {
                                    setExecutionPriority(executionPriority.filter(m => m !== method));
                                }
                            } else {
                                setExecutionPriority([...executionPriority, method]);
                            }
                          }}
                          className={`flex-1 p-6 rounded-[1.5rem] border transition-all cursor-pointer flex items-center justify-between ${isActive ? 'bg-[#8245EF]/5 border-[#8245EF]/20 shadow-md' : 'bg-[#FCF8FE]/30 border-transparent hover:border-[#8245EF]/10'}`}
                        >
                           <div className="flex items-center gap-4">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black font-mono ${isActive ? 'bg-[#8245EF] text-white' : 'bg-[#94a3b8]/20 text-[#94a3b8]'}`}>
                                 {isActive ? (priorityIndex + 1).toString().padStart(2, '0') : '--'}
                              </div>
                              <span className="font-black text-[#161932] text-[10px] uppercase tracking-widest font-mono">
                                {method === 'story' ? 'Story Reply' : method === 'highlight' ? 'Highlight Reply' : 'Direct Message'}
                              </span>
                           </div>
                           {isActive && <Check size={16} className="text-[#8245EF]" />}
                        </div>
                      )
                    })}
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div onClick={() => setWatchStory(!watchStory)} className={`p-6 rounded-[1.5rem] border-2 transition-all cursor-pointer flex flex-col items-center text-center gap-3 ${watchStory ? 'bg-[#8245EF]/10 border-[#8245EF] shadow-lg' : 'bg-[#FCF8FE]/30 border-transparent hover:border-[#8245EF]/10'}`}>
                   <span className="text-3xl">👁️</span>
                   <div>
                    <h3 className="font-black text-[#161932] text-[10px] uppercase tracking-widest font-mono mb-1">Watch Stories</h3>
                    <p className="text-[8px] font-bold text-[#64748b] uppercase tracking-widest leading-relaxed">Engage before DM.</p>
                   </div>
                </div>

                <div onClick={() => setWatchHighlights(!watchHighlights)} className={`p-6 rounded-[1.5rem] border-2 transition-all cursor-pointer flex flex-col items-center text-center gap-4 ${watchHighlights ? 'bg-[#8245EF]/10 border-[#8245EF] shadow-xl' : 'bg-[#FCF8FE]/30 border-transparent hover:border-[#8245EF]/10'}`}>
                   <span className="text-3xl">🌟</span>
                   <div>
                    <h3 className="font-black text-[#161932] text-[10px] uppercase tracking-widest font-mono mb-1">Watch Highlights</h3>
                    <p className="text-[8px] font-bold text-[#64748b] uppercase tracking-widest leading-relaxed">Mimic organic interest.</p>
                   </div>
                </div>

                <div onClick={() => setEnableAiAgent(!enableAiAgent)} className={`p-6 rounded-[1.5rem] border-2 transition-all cursor-pointer flex flex-col items-center text-center gap-3 ${enableAiAgent ? 'bg-indigo-50 border-indigo-200 shadow-lg' : 'bg-[#FCF8FE]/30 border-transparent hover:border-indigo-400/10'}`}>
                   <span className="text-3xl text-indigo-500"><Bot size={30} /></span>
                   <div>
                    <h3 className="font-black text-[#161932] text-[10px] uppercase tracking-widest font-mono mb-1">AI Auto-Reply</h3>
                    <p className="text-[8px] font-bold text-indigo-600/70 uppercase tracking-widest leading-relaxed">AI take-over on reply.</p>
                   </div>
                </div>
              </div>

              {enableAiAgent && (
                <div className="p-8 bg-indigo-50/30 rounded-[2rem] border border-indigo-100 flex items-center gap-10 animate-in slide-in-from-top-4 duration-500">
                   <div className="flex-1 space-y-4">
                      <label className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.3em] font-mono ml-4">Choose AI Person</label>
                      <select value={selectedAgentId} onChange={(e) => setSelectedAgentId(e.target.value)} className="form-input bg-white border-indigo-200 text-indigo-900 h-14">
                        <option value="">-- Choose Agent --</option>
                        {aiAgents.map(agent => (
                          <option key={agent._id} value={agent._id}>{agent.name}</option>
                        ))}
                      </select>
                   </div>
                   <div className="w-1/3 text-[9px] font-bold text-indigo-400 font-mono tracking-widest leading-loose">
                      AI will automatically engage after handshake.
                   </div>
                </div>
              )}
            </div>
          </div>

          {/* Phase 3: Content */}
          <div className="bg-white rounded-[2.5rem] border border-[#8245EF]/15 shadow-sm overflow-hidden group hover:shadow-[0_20px_40px_rgba(130, 69, 239,0.05)] transition-all">
            <div className="p-8 border-b border-[#8245EF]/10 flex items-center gap-6 bg-[#FCF8FE]/30">
              <div className="w-12 h-12 bg-[#FCF8FE] border border-[#8245EF]/10 text-[#8245EF] rounded-[1.25rem] flex items-center justify-center shadow-inner group-hover:scale-110 duration-700">
                <Cpu size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-[#161932] tracking-tighter uppercase leading-none">Message Body</h2>
                <p className="text-[9px] font-black text-[#94a3b8] uppercase tracking-[0.3em] font-mono mt-2">What you want to say.</p>
              </div>
            </div>
            <div className="p-10 md:p-12 space-y-10">
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                 <div className="flex-1 w-full space-y-3">
                    <label className="text-[9px] font-black text-[#94a3b8] uppercase tracking-[0.3em] font-mono ml-4">Apply Save Template</label>
                    <select
                      onChange={(e) => handleApplyTemplate(e.target.value)}
                      className="form-input bg-[#FCF8FE]/30 text-[#8245EF] h-14"
                    >
                      <option value="">Manual Input</option>
                      {templates.map(t => (
                        <option key={t._id} value={t._id}>{t.name}</option>
                      ))}
                    </select>
                 </div>
                 <div className="flex-1 w-full space-y-3">
                    <label className="text-[9px] font-black text-[#94a3b8] uppercase tracking-[0.3em] font-mono ml-4">Save Template</label>
                    {!showSaveTemplate ? (
                       <button type="button" onClick={() => setShowSaveTemplate(true)} className="form-input h-14 flex items-center justify-center gap-4 text-[#94a3b8] border-dashed border-2 hover:bg-[#8245EF]/5 hover:text-[#8245EF] group/save">
                          <Plus size={18} className="group-hover:rotate-90 transition-transform" /> <span>Save current</span>
                       </button>
                    ) : (
                       <div className="flex gap-4">
                          <input value={templateName} onChange={e => setTemplateName(e.target.value)} placeholder="Name" className="form-input h-14" />
                          <button type="button" onClick={handleSaveAsTemplate} className="px-6 bg-[#8245EF] text-white rounded-[1rem] font-black text-[9px] uppercase tracking-widest">{savingTemplate ? '...' : 'Save'}</button>
                          <button type="button" onClick={() => setShowSaveTemplate(false)} className="px-6 bg-[#FCF8FE] text-[#94a3b8] rounded-[1rem] font-black text-[9px] uppercase tracking-widest text-center">X</button>
                       </div>
                    )}
                 </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between ml-4">
                   <label className="text-[9px] font-black text-[#94a3b8] uppercase tracking-[0.3em] font-mono">Your Message</label>
                   <div className="flex items-center gap-2">
                      {availableVariables.map(v => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => insertVariable("main", v)}
                          className="px-3 py-1.5 bg-white border border-[#8245EF]/10 rounded-lg text-[8px] font-black text-[#8245EF] hover:bg-[#8245EF] hover:text-white transition-all shadow-sm font-mono"
                        >
                          {v}
                        </button>
                      ))}
                   </div>
                </div>
                <textarea
                  value={media ? "" : message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={!!media}
                  placeholder={media ? "Media file attached. Remove it to write text." : "Hello! How are you?"}
                  rows={6}
                  className={`form-input text-lg font-bold min-h-[180px] p-8 ${media ? 'opacity-40 grayscale cursor-not-allowed' : ''} ${hasLink(message) ? 'border-amber-400' : ''}`}
                  required={!media}
                />
                
                {hasLink(message) && (
                  <div className="p-6 bg-amber-50 rounded-[1.5rem] border border-amber-200 flex items-center gap-4">
                    <AlertTriangle size={24} className="text-amber-500 shrink-0" />
                    <div>
                      <h5 className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Warning: URL Found</h5>
                      <p className="text-[9px] font-bold text-amber-500/80 uppercase tracking-widest font-mono">Instagram might block messages with links.</p>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-6 mt-8 bg-[#FCF8FE]/30 p-8 rounded-[2rem] border border-[#8245EF]/10">
                   <div className="flex items-center gap-6">
                      <label className={`relative flex items-center justify-center gap-3 px-8 py-4 rounded-[1.5rem] border-2 border-dashed font-black text-[10px] uppercase tracking-[0.2em] transition-all cursor-pointer font-mono ${message.length > 0 ? 'opacity-30 cursor-not-allowed' : 'bg-white border-[#8245EF] text-[#8245EF] hover:bg-[#8245EF] hover:text-white'}`}>
                         <Mic size={18} /> Voice
                         <input type="file" disabled={message.length > 0} accept="audio/*" className="hidden" onChange={(e) => handleMediaUpload(e, -1)} />
                      </label>
                      <label className={`relative flex items-center justify-center gap-3 px-8 py-4 rounded-[1.5rem] border-2 border-dashed font-black text-[10px] uppercase tracking-[0.2em] transition-all cursor-pointer font-mono ${message.length > 0 ? 'opacity-30 cursor-not-allowed' : 'bg-white border-[#8245EF] text-[#8245EF] hover:bg-[#8245EF] hover:text-white'}`}>
                         <Camera size={18} /> Media
                         <input type="file" disabled={message.length > 0} accept="video/*,image/*" className="hidden" onChange={(e) => handleMediaUpload(e, -1)} />
                      </label>
                   </div>
                   
                   {mediaScanning && (
                      <div className="flex items-center gap-4 text-amber-500 font-black text-[9px] uppercase tracking-widest">
                         <div className="w-5 h-5 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
                         Checking...
                      </div>
                   )}

                   {media && !mediaScanning && (
                      <div className="flex items-center gap-8 bg-white p-6 rounded-[2rem] border border-[#8245EF]/20 w-max shadow-lg animate-in fade-in zoom-in duration-500">
                         <div className="relative group">
                            {media.type.startsWith('audio/') && <div className="p-6 bg-amber-50 rounded-xl"><Mic size={32} className="text-amber-500" /></div>}
                            {media.type.startsWith('video/') && <video src={media.url} className="w-40 rounded-xl border-4 border-white shadow-md" />}
                            {media.type.startsWith('image/') && <img src={media.url} className="w-40 rounded-xl border-4 border-white shadow-md" />}
                            <button type="button" onClick={() => setMedia(null)} className="absolute -top-3 -right-3 w-10 h-10 bg-white text-rose-500 rounded-full border-4 border-rose-50 shadow-xl flex items-center justify-center hover:scale-110">
                               <Trash2 size={20} />
                            </button>
                         </div>
                         <div>
                            <p className="text-lg font-black text-[#161932] tracking-tighter uppercase mb-2">Attached</p>
                            <div className="flex items-center gap-2 text-[9px] font-black text-emerald-500 uppercase tracking-widest">
                               <ShieldCheck size={12} /> Safe
                            </div>
                         </div>
                      </div>
                   )}
                </div>
              </div>
            </div>
          </div>

          {/* Phase 4: Schedule */}
          <div className="bg-white rounded-[2.5rem] border border-[#8245EF]/15 shadow-sm overflow-hidden group hover:shadow-[0_20px_40px_rgba(130, 69, 239,0.05)] transition-all">
            <div className="p-8 border-b border-[#8245EF]/10 flex items-center gap-6 bg-[#FCF8FE]/30">
              <div className="w-12 h-12 bg-[#FCF8FE] border border-[#8245EF]/10 text-amber-500 rounded-[1.25rem] flex items-center justify-center shadow-inner group-hover:scale-110 duration-700">
                <Clock size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-[#161932] tracking-tighter uppercase leading-none">Schedule & Limits</h2>
                <p className="text-[9px] font-black text-[#94a3b8] uppercase tracking-[0.3em] font-mono mt-2">Control when messages go out.</p>
              </div>
            </div>
            
            <div className="p-10 md:p-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
               <div className="space-y-4">
                 <label className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.2em] font-mono ml-4">Daily Limit</label>
                 <div className="relative">
                   <input
                     type="number"
                     min="1"
                     max="50"
                     value={dailyLimit}
                     onChange={(e) => setDailyLimit(e.target.value)}
                     className="form-input text-center text-3xl font-black py-8 bg-[#FCF8FE]/30 h-20"
                   />
                   <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none">
                      <span className="text-[9px] font-black text-[#94a3b8] uppercase tracking-widest font-mono">Day</span>
                   </div>
                 </div>
               </div>

               <div className="space-y-4">
                 <label className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.2em] font-mono ml-4">Hourly Limit</label>
                 <div className="relative">
                   <input
                     type="number"
                     min="1"
                     max="10"
                     value={hourlyLimit}
                     onChange={(e) => setHourlyLimit(e.target.value)}
                     className="form-input text-center text-2xl font-black py-8 bg-[#FCF8FE]/30 h-20"
                   />
                   <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none">
                      <span className="text-[9px] font-black text-[#94a3b8] uppercase tracking-widest font-mono">Hour</span>
                   </div>
                 </div>
               </div>
               
               <div className="space-y-4">
                 <div className="flex items-center justify-between ml-4">
                    <label className="text-[9px] font-black text-[#94a3b8] uppercase tracking-[0.3em] font-mono">Wait Time</label>
                    <label className="flex items-center gap-2 cursor-pointer group/smart transition-colors">
                       <input 
                          type="checkbox" 
                          checked={smartDelay}
                          onChange={(e) => setSmartDelay(e.target.checked)}
                          className="w-4 h-4 rounded-[0.25rem] text-[#8245EF] bg-white border-[#8245EF]/20 focus:ring-[#8245EF]"
                       />
                       <span className="text-[8px] font-black text-[#8245EF] group-hover:text-[#6d28d9] uppercase tracking-widest transition-colors font-mono">Safe</span>
                    </label>
                 </div>
                 <div className="flex items-center gap-4">
                   <input type="number" min="75" value={smartDelay ? 75 : minDelay} onChange={(e) => setMinDelay(e.target.value)} disabled={smartDelay} className={`form-input text-center text-lg font-black h-20 ${smartDelay ? 'opacity-40 grayscale' : 'bg-[#FCF8FE]/30'}`} />
                   <ArrowRight size={20} className="text-[#94a3b8] shrink-0" />
                   <input type="number" max="2000" value={smartDelay ? 1000 : maxDelay} onChange={(e) => setMaxDelay(e.target.value)} disabled={smartDelay} className={`form-input text-center text-lg font-black h-20 ${smartDelay ? 'opacity-40 grayscale' : 'bg-[#FCF8FE]/30'}`} />
                 </div>
               </div>

                <div className="space-y-4">
                 <label className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.2em] font-mono ml-4">Timezone</label>
                 <div className="relative">
                    <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className="form-input appearance-none bg-[#FCF8FE]/30 text-[#8245EF] h-20">
                       {Intl.supportedValuesOf('timeZone').map(tz => (
                          <option key={tz} value={tz}>{tz}</option>
                       ))}
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[#94a3b8]">
                       <Globe size={20} />
                    </div>
                 </div>
               </div>
            </div>

            <div className="p-10 md:p-12 border-t border-[#8245EF]/10 grid grid-cols-1 md:grid-cols-2 gap-10">
               <div className="space-y-4">
                 <label className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.2em] font-mono ml-4">Daily Schedule</label>
                 <div className="flex items-center gap-5">
                    <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="form-input text-center text-xl font-black py-4 bg-[#FCF8FE]/30 h-16" />
                    <span className="text-[#94a3b8] font-black text-sm uppercase tracking-widest font-mono">To</span>
                    <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="form-input text-center text-xl font-black py-4 bg-[#FCF8FE]/30 h-16" />
                 </div>
               </div>

               <div className="space-y-4">
                 <label className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.2em] font-mono ml-4">Blacklist</label>
                 <textarea 
                   placeholder="Usernames to ignore..." 
                   value={blacklist} 
                   onChange={e => setBlacklist(e.target.value)}
                   className="form-input min-h-[100px] text-base font-bold bg-[#FCF8FE]/30 py-4"
                 />
               </div>
            </div>
          </div>

          {/* Phase 5: Automatic Replies */}
          <div className="bg-white rounded-[2.5rem] border border-[#8245EF]/15 shadow-sm overflow-hidden group hover:shadow-[0_20px_40px_rgba(130, 69, 239,0.05)] transition-all">
            <div className="p-8 border-b border-[#8245EF]/10 flex items-center justify-between bg-[#FCF8FE]/30">
              <div className="flex items-center gap-8">
                <div className="w-16 h-16 bg-white border border-[#8245EF]/10 text-purple-500 rounded-[1.5rem] flex items-center justify-center shadow-inner group-hover:rotate-12 duration-700">
                  <Layers size={28} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-[#161932] tracking-tighter uppercase leading-none">Automatic Replies</h2>
                  <p className="text-[9px] font-black text-[#94a3b8] uppercase tracking-[0.3em] font-mono mt-2">Follow up messages.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={addFollowUp}
                className="px-8 py-4 bg-[#8245EF]/10 text-[#8245EF] font-black text-[10px] uppercase tracking-[0.3em] rounded-[1.25rem] hover:bg-[#8245EF] hover:text-white transition-all flex items-center gap-3 font-mono shadow-sm border border-[#8245EF]/10 active:scale-95"
              >
                <Plus size={18} /> Add Follow-up
              </button>
            </div>
            
            <div className="p-10 md:p-12 space-y-10">
               {followUps.length === 0 ? (
                 <div className="bg-[#FCF8FE]/50 rounded-[2.5rem] border border-dashed border-[#8245EF]/30 py-20 flex flex-col items-center justify-center text-center opacity-40">
                   <Activity size={48} className="text-[#94a3b8] mb-6" />
                   <p className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.3em] font-mono">No follow-ups yet</p>
                 </div>
               ) : (
                <div className="space-y-10">
                   {followUps.map((step, idx) => (
                    <div key={idx} className="bg-[#FCF8FE]/30 rounded-[2.5rem] border border-[#8245EF]/10 p-8 relative group/step hover:border-[#8245EF]/30 transition-all shadow-sm">
                       <button
                        type="button"
                        onClick={() => removeFollowUp(idx)}
                        className="absolute top-8 right-8 p-3 bg-white text-[#94a3b8] hover:text-rose-500 hover:bg-rose-50 rounded-xl border border-[#8245EF]/10 shadow-sm transition-all opacity-0 group-hover/step:opacity-100"
                      >
                        <Trash2 size={20} />
                      </button>
                      <div className="flex flex-col xl:flex-row gap-8 items-center mb-10">
                         <div className="w-16 h-16 bg-white border border-[#8245EF]/20 rounded-[1.25rem] flex items-center justify-center font-black text-[#8245EF] text-2xl font-mono">
                            {(idx + 1).toString().padStart(2, '0')}
                         </div>
                         <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                            <div className="space-y-3">
                               <label className="text-[9px] font-black text-[#94a3b8] uppercase tracking-[0.3em] font-mono ml-4">Timing Delay</label>
                               <div className="flex items-center gap-4 bg-white border border-[#8245EF]/10 p-4 rounded-[1.25rem] shadow-sm">
                                  <input
                                    type="number"
                                    min="1"
                                    value={step.delayValue}
                                    onChange={(e) => updateFollowUp(idx, "delayValue", e.target.value)}
                                    className="bg-transparent text-[#161932] font-black text-xl w-16 text-center outline-none"
                                  />
                                  <div className="w-[1px] h-6 bg-[#8245EF]/20" />
                                  <select 
                                    value={step.delayUnit}
                                    onChange={(e) => updateFollowUp(idx, "delayUnit", e.target.value)}
                                    className="bg-transparent border-none text-[10px] font-black text-[#8245EF] outline-none uppercase tracking-widest cursor-pointer"
                                  >
                                    <option value="minutes">Minutes</option>
                                    <option value="hours">Hours</option>
                                    <option value="days">Days</option>
                                  </select>
                               </div>
                            </div>
                            
                            <div className="space-y-3">
                               <label className="text-[9px] font-black text-[#94a3b8] uppercase tracking-[0.3em] font-mono ml-4">Priority</label>
                               <div className="flex gap-2">
                                  {['story', 'highlight', 'message'].map((method) => {
                                    const stepPriority = step.executionPriority || ['story', 'highlight', 'message'];
                                    const isStepActive = stepPriority.includes(method);
                                    const stepIdx = stepPriority.indexOf(method);
                                    return (
                                      <div 
                                        key={method}
                                        onClick={() => {
                                          if (isStepActive) {
                                              if (stepPriority.length > 1) {
                                                  updateFollowUp(idx, "executionPriority", stepPriority.filter(m => m !== method));
                                              }
                                          } else {
                                              updateFollowUp(idx, "executionPriority", [...stepPriority, method]);
                                          }
                                        }}
                                        className={`flex-1 py-3 text-center rounded-lg border transition-all cursor-pointer font-black text-[8px] uppercase tracking-widest ${isStepActive ? 'bg-[#8245EF] border-[#8245EF] text-white' : 'bg-white border-[#8245EF]/10 text-[#94a3b8]'}`}
                                      >
                                         {isStepActive ? (stepIdx + 1) : '--'} {method === 'message' ? 'DM' : method}
                                      </div>
                                    )
                                  })}
                               </div>
                            </div>
                         </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between ml-4">
                           <label className="text-[9px] font-black text-[#94a3b8] uppercase tracking-[0.3em] font-mono">Message Text</label>
                        </div>
                        <textarea
                          value={step.media || step.mediaUrl ? "" : step.message}
                          onChange={(e) => updateFollowUp(idx, "message", e.target.value)}
                          disabled={!!(step.media || step.mediaUrl)}
                          placeholder={step.media || step.mediaUrl ? "Media attached. Remove media to type message." : "Type follow-up message..."}
                          rows={3}
                          className={`form-input p-6 text-base font-bold ${step.media || step.mediaUrl ? 'opacity-40 grayscale cursor-not-allowed' : ''}`}
                        />
                      </div>

                      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mt-8 bg-white/50 p-6 rounded-[2rem] border border-[#8245EF]/5">
                         <div className="flex gap-3">
                            <label className={`flex items-center gap-2 cursor-pointer px-5 py-2.5 rounded-xl border-2 border-dashed font-black text-[9px] uppercase tracking-widest transition-all ${step.message.length > 0 ? 'opacity-20' : 'bg-white border-[#8245EF] text-[#8245EF] hover:bg-[#8245EF] hover:text-white'}`}>
                               🎙️ Voice
                               <input type="file" disabled={step.message.length > 0} accept="audio/*" className="hidden" onChange={(e) => handleMediaUpload(e, idx)} />
                            </label>
                            <label className={`flex items-center gap-2 cursor-pointer px-5 py-2.5 rounded-xl border-2 border-dashed font-black text-[9px] uppercase tracking-widest transition-all ${step.message.length > 0 ? 'opacity-20' : 'bg-white border-[#8245EF] text-[#8245EF] hover:bg-[#8245EF] hover:text-white'}`}>
                               🎥 Media
                               <input type="file" disabled={step.message.length > 0} accept="video/*,image/*" className="hidden" onChange={(e) => handleMediaUpload(e, idx)} />
                            </label>
                         </div>

                         <button
                           type="button"
                           onClick={() => updateFollowUp(idx, "showAdvanced", !step.showAdvanced)}
                           className="flex items-center gap-2 px-6 py-2.5 bg-[#161932] text-white rounded-[1rem] text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-md ml-auto"
                         >
                           <Settings size={14} /> Advanced {step.showAdvanced ? '▴' : '▾'}
                         </button>
                      </div>

                      {step.showAdvanced && (
                        <div className="mt-6 p-8 bg-white border border-[#8245EF]/10 rounded-[2rem] shadow-inner grid grid-cols-1 md:grid-cols-3 gap-6">
                           <div className="space-y-3">
                              <label className="text-[9px] font-black text-[#94a3b8] uppercase tracking-[0.3em] font-mono ml-4">Follow Action</label>
                              <select value={step.followBehavior} onChange={e => updateFollowUp(idx, "followBehavior", e.target.value)} className="form-input bg-[#FCF8FE]/30 text-[10px] h-12">
                                <option value="none">Disabled</option>
                                <option value="before">Before Message</option>
                                <option value="after">After Message</option>
                              </select>
                           </div>
                           <div className="space-y-3">
                              <label className="text-[9px] font-black text-[#94a3b8] uppercase tracking-[0.3em] font-mono ml-4">Like Post</label>
                              <select value={step.likeBehavior} onChange={e => updateFollowUp(idx, "likeBehavior", e.target.value)} className="form-input bg-[#FCF8FE]/30 text-[10px] h-12">
                                <option value="none">Disabled</option>
                                <option value="before">Before Message</option>
                                <option value="after">After Message</option>
                              </select>
                           </div>
                           <div className="space-y-3">
                              <label className="text-[9px] font-black text-[#94a3b8] uppercase tracking-[0.3em] font-mono ml-4">Comment Post</label>
                              <select value={step.commentBehavior} onChange={e => updateFollowUp(idx, "commentBehavior", e.target.value)} className="form-input bg-[#FCF8FE]/30 text-[10px] h-12">
                                <option value="none">Disabled</option>
                                <option value="before">Before Message</option>
                                <option value="after">After Message</option>
                              </select>
                           </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
               )}
            </div>
          </div>

          <div className="bg-[#161932] rounded-[3rem] border border-[#8245EF]/15 shadow-2xl p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden group/footer">
             <div className="absolute top-0 right-0 w-[300px] h-full bg-[#8245EF] opacity-[0.03] -rotate-12 translate-x-20" />
             <div className="flex-1 relative z-10 w-full">
                <div className="flex items-center gap-5 mb-8">
                   <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-[1rem] flex items-center justify-center text-[#8245EF]">
                      <ShieldCheck size={28} />
                   </div>
                   <div>
                      <h3 className="text-2xl font-black text-white tracking-tighter uppercase leading-none">Activate Plan</h3>
                      <p className="text-[9px] font-black text-[#94a3b8] tracking-[0.3em] uppercase mt-2 font-mono">Control Activation</p>
                   </div>
                </div>
                <div className="flex flex-col gap-6 mt-10">
                   <div className="flex items-center justify-between p-8 bg-white/5 rounded-[2rem] border border-white/10 transition-all duration-700">
                    <div className="pr-8 text-left">
                       <p className="text-lg font-black text-white tracking-widest uppercase font-mono">Stop on reply</p>
                       <p className="text-[10px] text-white/70 mt-2 uppercase font-black font-mono tracking-widest leading-relaxed">Auto-stop if they reply.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                     <input 
                       type="checkbox" 
                       className="sr-only peer" 
                       checked={stopOnReply}
                       onChange={(e) => setStopOnReply(e.target.checked)}
                     />
                     <div className="w-16 h-8 bg-white/20 border border-white/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white/60 after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-white peer-checked:after:bg-[#8245EF] shadow-xl"></div>
                   </label>
                  </div>
                </div>
             </div>

             <div className="w-full md:w-auto flex flex-col gap-5 shrink-0 relative z-10 lg:w-[400px]">
                <button
                  type="submit"
                  disabled={submitting}
                  className="group/submit px-12 py-8 bg-[#8245EF] text-white font-black text-xl uppercase tracking-[0.2em] rounded-[2.5rem] hover:bg-[#6d28d9] transition-all shadow-2xl flex flex-col items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                   {submitting ? (
                      <Loader2 className="animate-spin" size={32} />
                   ) : (
                      <div className="flex items-center gap-4">
                         <span>Start Plan</span>
                         <ArrowRight size={24} className="group-hover/submit:translate-x-2 transition-transform duration-700" />
                      </div>
                   )}
                </button>
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-12 py-5 bg-white/5 text-white/50 hover:text-white font-black text-[10px] uppercase tracking-[0.4em] rounded-[2rem] hover:bg-white/10 transition-all flex items-center justify-center border border-white/5 font-mono"
                >
                  Cancel Plan
                </button>
             </div>
          </div>

        </form>
      </div>
    </div>
  );
}
