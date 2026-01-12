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
  Camera
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
        isMessageRequest
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
       <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-[10px]">Loading Visual Modules...</p>
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
               <span className="px-2 py-0.5 bg-pink-50 text-[#E1306C] text-[9px] font-black uppercase tracking-widest rounded-full border border-pink-100">Visual Engagement Protocol</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight truncate">Initialize DM Orchestration</h1>
            <p className="text-gray-500 text-xs md:text-sm font-medium mt-1">Configuring impact node for <span className="text-[#E1306C] font-bold">{account?.email}</span></p>
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
                <h2 className="text-lg font-black text-gray-900 tracking-tight">Sequence Identity</h2>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Basic identification & targeting</p>
              </div>
            </div>
            <div className="p-8 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Flow Identifier</label>
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
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Contact Population</label>
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
                <h2 className="text-lg font-black text-gray-900 tracking-tight">Outreach Strategy</h2>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Protocol-specific logic</p>
              </div>
            </div>
            <div className="p-8 md:p-10">
              <div className="flex items-center justify-between p-6 bg-pink-50/30 rounded-[2rem] border border-pink-50 group hover:bg-pink-50 transition-all duration-300">
                <div className="pr-4">
                  <h4 className="text-sm md:text-base font-black text-gray-900">Handle as Message Request</h4>
                  <p className="text-[10px] md:text-xs text-gray-500 mt-1 font-medium">Auto-detect followers vs non-followers to optimize delivery protocol.</p>
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
            </div>
          </div>

          {/* Section 3: Payload Configuration */}
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/20 overflow-hidden">
            <div className="p-6 md:p-8 border-b border-gray-50 flex items-center gap-4 bg-gray-50/30">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-[#E1306C]">
                <Cpu size={24} />
              </div>
              <div>
                <h2 className="text-lg font-black text-gray-900 tracking-tight">Sequence Payload</h2>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Visual content & logic</p>
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
                      className="whitespace-nowrap flex items-center gap-2 text-[#E1306C] font-black text-[10px] uppercase tracking-widest hover:bg-pink-50 px-6 py-4 rounded-2xl border border-dashed border-pink-200 transition-all mt-6 md:mt-7"
                    >
                      <Plus size={16} /> Save as New Template
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
                        <button onClick={handleSaveAsTemplate} className="flex-1 bg-[#E1306C] text-white text-[9px] font-black uppercase py-2 rounded-lg">Construct Template</button>
                        <button onClick={() => setShowSaveTemplate(false)} className="flex-1 bg-white border border-gray-200 text-gray-500 text-[9px] font-black uppercase py-2 rounded-lg">Cancel</button>
                      </div>
                    </div>
                 )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Main Direct Payload</label>
                   <div className="flex items-center gap-2">
                      {["$$f_name$$", "$$username$$"].map(v => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => insertVariable("main", v)}
                          className="px-3 py-1 bg-white border border-gray-100 rounded-lg text-[9px] font-black text-[#E1306C] hover:border-pink-200 hover:bg-pink-50 transition-all"
                        >
                          {v}
                        </button>
                      ))}
                   </div>
                </div>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Craft your visual-first direct message..."
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
                <h2 className="text-lg font-black text-gray-900 tracking-tight">Time Protocol</h2>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Scheduling & time-delays</p>
              </div>
            </div>
            <div className="p-8 md:p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Engagement Cap</label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={dailyLimit}
                    onChange={(e) => setDailyLimit(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-black outline-none focus:bg-white transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-amber-500 uppercase">Max 25 Recommended</span>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Handoff Latency (Min)</label>
                <div className="flex items-center gap-3">
                  <input type="number" min="5" value={minDelay} onChange={(e) => setMinDelay(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-center font-bold" />
                  <span className="text-gray-300 font-black">{"->"}</span>
                  <input type="number" max="120" value={maxDelay} onChange={(e) => setMaxDelay(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-center font-bold" />
                </div>
              </div>
               <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Temporal Offset</label>
                <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-4 font-bold text-xs appearance-none">
                  <option value="UTC">Universal (UTC)</option>
                  <option value="America/New_York">Eastern (EST)</option>
                  <option value="Asia/Karachi">Karachi (PKT)</option>
                </select>
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
                  <h2 className="text-lg font-black text-gray-900 tracking-tight">Sequence Layers</h2>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Multi-step visual follow-ups</p>
                </div>
              </div>
              <button
                type="button"
                onClick={addFollowUp}
                className="px-6 py-3 bg-pink-50 text-[#E1306C] font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-[#E1306C] hover:text-white transition-all flex items-center gap-2"
              >
                <Plus size={16} /> Stack DM Node
              </button>
            </div>
            <div className="p-8 md:p-10 space-y-8">
              {followUps.length === 0 ? (
                <div className="text-center py-10 opacity-30 italic font-medium text-gray-400 text-sm">
                  Linear sequence. No follow-up nodes active.
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
                      <div className="flex flex-col md:flex-row gap-6 mb-6">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-white shadow-sm border border-gray-100 rounded-xl flex items-center justify-center font-black text-[#E1306C]">{idx + 1}</div>
                           <div className="flex items-center gap-2">
                             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Latency:</span>
                             <input
                                type="number"
                                min="1"
                                value={step.delayDays}
                                onChange={(e) => updateFollowUp(idx, "delayDays", e.target.value)}
                                className="w-16 bg-white border border-gray-200 rounded-lg py-1 text-center font-black text-sm outline-none focus:border-pink-300 transition-all"
                              />
                              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Days Post-Entry</span>
                           </div>
                        </div>
                      </div>
                      <textarea
                        value={step.message}
                        onChange={(e) => updateFollowUp(idx, "message", e.target.value)}
                        placeholder="Configure layer DM payload..."
                        rows={3}
                        className="w-full bg-white border border-gray-100 rounded-2xl p-6 text-sm font-medium outline-none focus:ring-4 focus:ring-pink-100 transition-all resize-none shadow-sm"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Section 6: Master Control */}
          <div className="bg-[#1C0912] rounded-[2.5rem] border border-pink-900/30 shadow-2xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-10">
             <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 text-pink-400">
                   <ShieldCheck size={20} />
                   <h3 className="text-[10px] font-black uppercase tracking-[0.25em]">Response Protocol</h3>
                </div>
                <h2 className="text-xl font-black text-white mb-4">Engagement Intercept</h2>
                <div className="flex items-center justify-between p-6 bg-pink-950/20 rounded-3xl border border-pink-900/30">
                   <div className="pr-4 text-left">
                      <p className="text-sm font-bold text-pink-50">Halt sequence on DM Reply</p>
                      <p className="text-[10px] text-pink-400 mt-1 uppercase font-black">Pause follow-ups if engagement is detected</p>
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
                  className="px-12 py-5 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] text-white font-black text-[10px] md:text-xs uppercase tracking-[0.2em] rounded-2xl hover:opacity-90 transition-all shadow-xl shadow-pink-900/40 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                >
                  {submitting ? "Initiating Protocol..." : "Deploy Visual Sequence"}
                  <Camera size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-12 py-4 bg-pink-950/20 text-pink-400 font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-pink-950/40 transition-all flex items-center justify-center border border-pink-900/20"
                >
                  Abort Construction
                </button>
             </div>
          </div>

        </form>
      </div>

      <ConnectAccountModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        onAccountConnected={fetchData}
      />

      <AccountDetailsModal
        account={selectedAccount}
        isOpen={!!selectedAccount}
        onClose={() => setSelectedAccount(null)}
      />
    </div>
  );
}
