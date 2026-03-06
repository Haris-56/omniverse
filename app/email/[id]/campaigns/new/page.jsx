"use client";

import { useState, useEffect, use } from "react";
import { 
  ChevronLeft, Info, Settings, Plus, Trash2, 
  Variable, Zap, Save, Check, Type, ShieldCheck, 
  Target, Rocket, Mail, Split, BarChart2, MessageSquare, AlertTriangle, Play, X 
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewEmailCampaignPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const accountId = params.id;
  const router = useRouter();

  const [account, setAccount] = useState(null);
  const [allAccounts, setAllAccounts] = useState([]);
  const [selectedAccountIds, setSelectedAccountIds] = useState([accountId]);
  const [contactLists, setContactLists] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Data for Validation
  const [listKeys, setListKeys] = useState([]); // Available dynamic variables from list

  // Form State
  const [name, setName] = useState("");
  const [listId, setListId] = useState("");
  
  // A/B Testing
  const [abTesting, setAbTesting] = useState(false);
  const [currentVariant, setCurrentVariant] = useState("A"); // 'A' or 'B'
  
  // Variant A Content
  const [subjectA, setSubjectA] = useState("");
  const [messageA, setMessageA] = useState("");
  
  // Variant B Content
  const [subjectB, setSubjectB] = useState("");
  const [messageB, setMessageB] = useState("");

  // Common Settings
  const [dailyLimit, setDailyLimit] = useState(50);
  const [minDelay, setMinDelay] = useState(5);
  const [maxDelay, setMaxDelay] = useState(15);
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState("");
  const [endDateMode, setEndDateMode] = useState("list_end"); // 'manual' or 'list_end'
  
  // Advanced Settings
  const [maxPerHour, setMaxPerHour] = useState(10);
  const [sendJitter, setSendJitter] = useState(true);
  const [businessHoursOnly, setBusinessHoursOnly] = useState(true);
  const [addUnsubscribe, setAddUnsubscribe] = useState(true);
  const [deduplicate, setDeduplicate] = useState(true);
  const [followupHoursEnabled, setFollowupHoursEnabled] = useState(false);
  const [followupStartTime, setFollowupStartTime] = useState("09:00");
  const [followupEndTime, setFollowupEndTime] = useState("17:00");

  // Ramp Up
  const [rampUpEnabled, setRampUpEnabled] = useState(false);
  const [rampStart, setRampStart] = useState(5);
  const [rampEnd, setRampEnd] = useState(20);
  const [rampPeriod, setRampPeriod] = useState(7); // Days to reach max

  // Advanced Logic
  const [stopOnReply, setStopOnReply] = useState(true);
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(false);
  const [autoReplyKeyword, setAutoReplyKeyword] = useState(""); // e.g., "price"
  const [autoReplyMessage, setAutoReplyMessage] = useState(""); // e.g., "Our pricing is..."

  const [followUps, setFollowUps] = useState([]); 

  // Template Save State
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchData();
    fetchTemplates();
    
    // Check for Edit Mode
    if (typeof window !== 'undefined') {
       const urlParams = new URLSearchParams(window.location.search);
       const editParam = urlParams.get('edit');
       if (editParam) {
          setIsEditMode(true);
          setEditId(editParam);
          fetchCampaignForEdit(editParam);
       }
    }
  }, [accountId]);

  // Fetch List Keys when List changes
  useEffect(() => {
    if (listId) {
      fetchListKeys(listId);
    } else {
      setListKeys([]);
    }
  }, [listId]);

  const fetchCampaignForEdit = async (id) => {
    try {
       const res = await fetch(`/api/email/campaigns?id=${id}`);
       if (res.ok) {
          const camp = await res.json();
          setName(camp.name);
          setListId(camp.listId);
          setSelectedAccountIds(camp.accountIds || [camp.accountId]);
          setAbTesting(camp.variants?.active || false);
          setSubjectA(camp.variants?.a?.subject || "");
          setMessageA(camp.variants?.a?.message || "");
          setSubjectB(camp.variants?.b?.subject || "");
          setMessageB(camp.variants?.b?.message || "");
          
          if (camp.settings) {
             setDailyLimit(camp.settings.dailyLimit || 50);
             setMinDelay(camp.delays?.min || 5);
             setMaxDelay(camp.delays?.max || 15);
             setTimezone(camp.settings.timezone || camp.timezone || "UTC");
             setStartTime(camp.settings.startTime || "09:00");
             setEndTime(camp.settings.endTime || "17:00");
             setStartDate(camp.settings.startDate || new Date().toISOString().split('T')[0]);
             setEndDate(camp.settings.endDate || "");
             setEndDateMode(camp.settings.endDateMode || "list_end");
             setMaxPerHour(camp.settings.maxPerHour || 10);
             setSendJitter(camp.settings.sendJitter !== false);
             setBusinessHoursOnly(!!camp.settings.businessHoursOnly);
             setAddUnsubscribe(!!camp.settings.addUnsubscribe);
             setDeduplicate(!!camp.settings.deduplicate);
          }
          if (camp.rampUp) {
             setRampUpEnabled(true);
             setRampStart(camp.rampUp.start);
             setRampEnd(camp.rampUp.end);
             setRampPeriod(camp.rampUp.period);
          }
          setFollowUps(camp.sequences || []);
       }
    } catch (err) {
       console.error("Failed to fetch campaign for edit", err);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [accRes, listsRes] = await Promise.all([
        fetch(`/api/email/accounts`),
        fetch("/api/lists")
      ]);

      if (accRes.ok) {
        const accounts = await accRes.json();
        setAllAccounts(accounts);
        const currentAcc = accounts.find(a => a._id === accountId);
        if (currentAcc) setAccount(currentAcc);
      }
      if (listsRes.ok) setContactLists(await listsRes.json());
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const res = await fetch("/api/email/templates"); // Updated path
      if (res.ok) setTemplates(await res.json());
    } catch (error) {
      console.error("Failed to fetch templates", error);
    }
  };

  // Helper to peek at list structure
  const fetchListKeys = async (id) => {
    try {
      // Fetch 1 contact to infer keys
      const res = await fetch(`/api/contacts?listId=${id}&limit=1`); 
      if (res.ok) {
        const contacts = await res.json();
        if (contacts.length > 0) {
           const keys = Object.keys(contacts[0]).filter(k => 
             !['_id', 'listId', 'userId', 'createdAt', 'updatedAt'].includes(k)
           );
           setListKeys(keys);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addFollowUp = () => {
    setFollowUps([...followUps, { 
      delayDays: 3, 
      subject: "Re: " + (abTesting ? subjectA : (subjectA || "Follow up")), 
      message: "" 
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

  const insertVariable = (target, variable) => {
    const varString = `{{${variable}}}`;
    if (target === "main") {
      if (abTesting && currentVariant === 'B') setMessageB(messageB + varString);
      else setMessageA(messageA + varString);
    } else if (target === "subject") {
      if (abTesting && currentVariant === 'B') setSubjectB(subjectB + varString);
      else setSubjectA(subjectA + varString);
    } else {
      // Followup target is index
      const newFollowUps = [...followUps];
      newFollowUps[target].message += varString;
      setFollowUps(newFollowUps);
    }
  };

  const handleApplyTemplate = (templateId) => {
    const selected = templates.find(t => t._id === templateId);
    if (selected) {
      if ((messageA.length > 5 || messageB.length > 5) && !confirm("Overwrite current message content?")) return;
      
      if (abTesting && currentVariant === 'B') {
        setMessageB(selected.body || selected.message);
        setSubjectB(selected.subject);
      } else {
        setMessageA(selected.body || selected.message);
        setSubjectA(selected.subject);
      }
    }
  };

  const handleSaveAsTemplate = async () => {
    const currentMsg = (abTesting && currentVariant === 'B') ? messageB : messageA;
    const currentSub = (abTesting && currentVariant === 'B') ? subjectB : subjectA;

    if (!templateName || !currentMsg) {
      alert("Template name and message content required");
      return;
    }

    try {
      const res = await fetch("/api/email/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: templateName,
          subject: currentSub,
          body: currentMsg
        })
      });
      if (res.ok) {
        setShowSaveTemplate(false);
        setTemplateName("");
        fetchTemplates();
        alert("Template saved!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Validation Logic
  const validateVariables = (text) => {
    if (!text) return [];
    // Match {{var}} patterns
    const updatedRegex = /\{\{([^}]+)\}\}/g; // Matches {{any_text}}
    let match;
    const errors = [];
    
    // We allow standard ones if list is empty or check specific keys
    // If listKeys is populated, we check against it.
    // Also hardcode some standard global vars if we want
    const standard = ['first_name', 'last_name', 'email', 'company']; 
    const allowed = [...new Set([...standard, ...listKeys])];

    while ((match = updatedRegex.exec(text)) !== null) {
      const variable = match[1].trim();
      if (!allowed.includes(variable) && listKeys.length > 0) {
        errors.push(variable);
      }
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !listId || !subjectA || !messageA) {
      alert("Please complete all required fields.");
      return;
    }
    if (selectedAccountIds.length === 0) {
      alert("Please select at least one sender account.");
      return;
    }

    // Validate Variables
    const contentToValidate = [
      subjectA, messageA, 
      ...(abTesting ? [subjectB, messageB] : []),
      ...followUps.map(f => f.subject + f.message)
    ].join(" ");
    
    // Quick check
    const varErrors = validateVariables(contentToValidate);
    if (varErrors.length > 0) {
       alert(`Error: The following variables are not found in your selected contact list: ${[...new Set(varErrors)].join(", ")}`);
       return;
    }

    setSubmitting(true);
    try {
      const payload = {
        accountId, // primary fallback
        accountIds: selectedAccountIds, // Array of selected sender accounts
        name,
        listId,
        abTesting,
        variantA: { subject: subjectA, message: messageA },
        variantB: abTesting ? { subject: subjectB, message: messageB } : null,
        settings: {
          dailyLimit,
          minDelay: parseFloat(minDelay) || 30, // Default to 30s
          maxDelay: parseFloat(maxDelay) || 120, // Default to 120s
          timezone,
          startTime,
          endTime,
          startDate,
          endDate: endDateMode === 'manual' ? endDate : null,
          endDateMode,
          // New Advanced Fields
          maxPerHour: parseInt(maxPerHour) || 10,
          sendJitter: !!sendJitter,
          businessHoursOnly: !!businessHoursOnly,
          addUnsubscribe: !!addUnsubscribe,
          deduplicate: !!deduplicate,
          followupHours: followupHoursEnabled ? { start: followupStartTime, end: followupEndTime } : null
        },
        rampUp: rampUpEnabled ? { start: rampStart, end: rampEnd, period: rampPeriod } : null,
        stopOnReply,
        autoReply: autoReplyEnabled ? { keyword: autoReplyKeyword, message: autoReplyMessage } : null,
        sequences: followUps,
      };

      if (isEditMode) payload.id = editId;

      const res = await fetch("/api/email/campaigns", {
        method: isEditMode ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        router.push(`/email/${accountId}/campaigns`);
      } else {
        const err = await res.json();
        alert(err.error || "Failed to create campaign");
      }
    } catch (error) {
      console.error(error);
      alert("Submission error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
     <div className="h-screen w-full flex items-center justify-center bg-gray-50/50">
        <div className="animate-spin w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full" />
     </div>
  );

  return (
    <div className="w-full min-h-screen bg-gray-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-5xl mx-auto">
         {/* Navigation */}
         <div className="flex items-center gap-4 mb-8">
            <button onClick={() => router.back()} className="p-3 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all text-gray-500">
               <ChevronLeft size={20} />
            </button>
            <div>
               <h1 className="text-2xl font-black text-gray-900 tracking-tight">{isEditMode ? 'Edit Campaign' : 'New Campaign'}</h1>
               <p className="text-xs font-medium text-gray-500 mt-1">{isEditMode ? 'Live editing' : 'Configure outreach'} for <span className="text-indigo-600 font-bold">{account?.email}</span></p>
            </div>
         </div>

         <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* 1. Campaign Identity & Source */}
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/20 p-8 space-y-6">
               <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                     <Target size={20} />
                  </div>
                  <h2 className="text-lg font-black text-gray-900 tracking-tight">Campaign Strategy</h2>
               </div>
               
               <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Campaign Name</label>
                     <input 
                       required 
                       value={name}
                       onChange={e => setName(e.target.value)}
                       placeholder="e.g. Q1 Outreach"
                       className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 font-bold text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500/10"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Target Contact List</label>
                     <select 
                       required 
                       value={listId}
                       onChange={e => setListId(e.target.value)}
                       className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 font-bold text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500/10 appearance-none"
                     >
                        <option value="">-- Select List --</option>
                        {contactLists.map(list => (
                           <option key={list._id} value={list._id}>{list.name} ({list.count})</option>
                        ))}
                     </select>
                  </div>
                  <div className="space-y-2 md:col-span-2 mt-4 pt-4 border-t border-gray-100">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1 hover:text-indigo-600 transition-colors cursor-help" title="Select multiple accounts to enable automatic round-robin sending.">Sender Accounts (Auto-Rotation)</label>
                     <div className="flex flex-wrap gap-2">
                        {allAccounts.map(acc => (
                           <label key={acc._id} className={`flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer font-bold text-sm transition-all ${selectedAccountIds.includes(acc._id) ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm' : 'bg-gray-50 border-gray-100 text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}>
                              <input 
                                 type="checkbox" 
                                 className="sr-only"
                                 checked={selectedAccountIds.includes(acc._id)}
                                 onChange={(e) => {
                                    if (e.target.checked) setSelectedAccountIds([...selectedAccountIds, acc._id]);
                                    else setSelectedAccountIds(selectedAccountIds.filter(id => id !== acc._id));
                                 }}
                              />
                              <div className={`w-3 h-3 rounded-full border ${selectedAccountIds.includes(acc._id) ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-gray-300'}`}></div>
                              {acc.email}
                           </label>
                        ))}
                     </div>
                  </div>
               </div>

               {/* A/B Switch */}
               <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-3">
                     <Split size={18} className="text-purple-600" />
                     <div>
                        <p className="text-sm font-bold text-gray-900">A/B Split Testing</p>
                        <p className="text-[10px] text-gray-500 font-medium">Test two message variations to optimize engagement.</p>
                     </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={abTesting} onChange={e => setAbTesting(e.target.checked)} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
               </div>
            </div>

            {/* 2. Content Editor */}
            <div className={`bg-white rounded-[2rem] border-2 shadow-xl shadow-gray-200/20 overflow-hidden transition-all ${abTesting ? 'border-purple-100' : 'border-gray-50'}`}>
               <div className="border-b border-gray-100 bg-gray-50/50 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     {abTesting && (
                        <div className="flex gap-2 p-1 bg-white border border-gray-200 rounded-lg mr-4">
                           <button type="button" onClick={() => setCurrentVariant('A')} className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-wider transition-all ${currentVariant === 'A' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>Variant A</button>
                           <button type="button" onClick={() => setCurrentVariant('B')} className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-wider transition-all ${currentVariant === 'B' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>Variant B</button>
                        </div>
                     )}
                     <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Editing: <span className="text-gray-900">{abTesting ? `Variant ${currentVariant}` : 'Main Content'}</span></span>
                  </div>

                  <div className="flex items-center gap-3">
                     <select onChange={e => handleApplyTemplate(e.target.value)} className="bg-white border border-gray-200 text-[10px] font-bold py-2 px-3 rounded-lg outline-none">
                        <option value="">Load Template...</option>
                        {templates.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                     </select>
                     <button type="button" onClick={() => setShowSaveTemplate(true)} className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"><Save size={18} /></button>
                  </div>
               </div>

               {/* Save Template Inline Modal */}
               {showSaveTemplate && (
                  <div className="p-4 bg-indigo-50 border-b border-indigo-100 flex items-center gap-2 animate-in slide-in-from-top">
                     <input 
                       value={templateName} 
                       onChange={e => setTemplateName(e.target.value)} 
                       placeholder="New Template Name" 
                       className="flex-1 px-3 py-2 text-xs font-bold rounded-lg border-none outline-none"
                     />
                     <button type="button" onClick={handleSaveAsTemplate} className="px-3 py-2 bg-indigo-600 text-white text-[10px] uppercase font-black rounded-lg">Save</button>
                     <button type="button" onClick={() => setShowSaveTemplate(false)} className="p-2 text-gray-400"><X size={14} /></button>
                  </div>
               )}

               <div className="p-8 space-y-6">
                  <div className="space-y-2">
                     <div className="flex justify-between">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Subject Line</label>
                        <div className="flex gap-2">
                           {listKeys.slice(0, 3).map(k => (
                              <button key={k} type="button" onClick={() => insertVariable("subject", k)} className="text-[9px] font-bold text-indigo-500 bg-indigo-50 px-2 rounded hover:bg-indigo-100">{"{{" + k + "}}"}</button>
                           ))}
                        </div>
                     </div>
                     <input 
                       value={abTesting && currentVariant === 'B' ? subjectB : subjectA}
                       onChange={e => abTesting && currentVariant === 'B' ? setSubjectB(e.target.value) : setSubjectA(e.target.value)}
                       placeholder="e.g. Quick question regarding {{company}}"
                       className="w-full text-lg font-bold text-gray-900 placeholder-gray-300 border-b-2 border-gray-100 py-2 outline-none focus:border-indigo-500 transition-colors"
                     />
                  </div>

                  <div className="space-y-2">
                     <div className="flex justify-between items-center">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Email Body</label>
                        <div className="flex flex-wrap gap-2 justify-end max-w-md">
                           {listKeys.map(k => (
                              <button key={k} type="button" onClick={() => insertVariable("main", k)} className="text-[9px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded hover:bg-gray-200 border border-gray-200">{"{{" + k + "}}"}</button>
                           ))}
                        </div>
                     </div>
                     <textarea 
                        rows={12}
                        value={abTesting && currentVariant === 'B' ? messageB : messageA}
                        onChange={e => abTesting && currentVariant === 'B' ? setMessageB(e.target.value) : setMessageA(e.target.value)}
                        placeholder="Hi {{first_name}}, ..."
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-6 font-medium text-gray-800 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/30 transition-all resize-none shadow-inner"
                     />
                  </div>
               </div>
            </div>

            {/* 3. Follow-ups */}
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/20 p-8 space-y-6">
                <div className="flex justify-between items-center">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center">
                         <Zap size={20} />
                      </div>
                      <h2 className="text-lg font-black text-gray-900 tracking-tight">Sequence Steps</h2>
                   </div>
                   <button type="button" onClick={addFollowUp} className="px-4 py-2 bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-amber-100">Add Follow-up</button>
                </div>
                
                {followUps.map((step, idx) => (
                   <div key={idx} className="bg-gray-50/50 rounded-2xl border border-gray-100 p-6 relative group">
                      <button onClick={() => removeFollowUp(idx)} className="absolute top-4 right-4 p-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16} /></button>
                      
                      <div className="flex gap-4 mb-4">
                         <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center font-black text-xs text-gray-500">{idx + 1}</div>
                         <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-400 uppercase">Wait</span>
                            <input type="number" value={step.delayDays} onChange={e => updateFollowUp(idx, 'delayDays', e.target.value)} className="w-12 text-center bg-white border border-gray-200 rounded p-1 font-bold text-xs" />
                            <span className="text-xs font-bold text-gray-400 uppercase">Days</span>
                         </div>
                      </div>
                      
                      <div className="space-y-3">
                         <input 
                           value={step.subject} 
                           onChange={e => updateFollowUp(idx, 'subject', e.target.value)} 
                           className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-bold" 
                           placeholder="Subject"
                         />
                         <textarea 
                           rows={4}
                           value={step.message}
                           onChange={e => updateFollowUp(idx, 'message', e.target.value)}
                           className="w-full bg-white border border-gray-200 rounded-xl p-4 text-sm font-medium resize-none focus:ring-2 focus:ring-amber-500/10 outline-none"
                           placeholder="Follow-up message..."
                         />
                      </div>
                   </div>
                ))}
            </div>

            {/* 4. Controls & Limits (Ramp-up, Schedule, Auto-Reply) */}
            <div className="grid md:grid-cols-2 gap-8">
               
               {/* Sending Schedule & Ramp Up */}
               <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/20 p-8 space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                     <BarChart2 size={20} className="text-green-500" />
                     <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">Velocity & Schedule</h2>
                  </div>

                  <div className="space-y-4">
                     <div className="p-4 bg-green-50/30 rounded-2xl border border-green-50">
                        <div className="flex items-center justify-between mb-3">
                           <span className="text-xs font-bold text-gray-900">Warm-up / Ramp-up Mode</span>
                           <input type="checkbox" checked={rampUpEnabled} onChange={e => setRampUpEnabled(e.target.checked)} className="toggle-checkbox" />
                        </div>
                        {rampUpEnabled && (
                           <div className="grid grid-cols-3 gap-2">
                              <div><label className="text-[8px] font-black text-gray-400 uppercase">Start</label><input type="number" value={rampStart} onChange={e => setRampStart(e.target.value)} className="w-full p-2 rounded-lg border border-gray-200 text-xs font-bold text-center" /></div>
                              <div><label className="text-[8px] font-black text-gray-400 uppercase">End (Max)</label><input type="number" value={rampEnd} onChange={e => setRampEnd(e.target.value)} className="w-full p-2 rounded-lg border border-gray-200 text-xs font-bold text-center" /></div>
                              <div><label className="text-[8px] font-black text-gray-400 uppercase">Days</label><input type="number" value={rampPeriod} onChange={e => setRampPeriod(e.target.value)} className="w-full p-2 rounded-lg border border-gray-200 text-xs font-bold text-center" /></div>
                           </div>
                        )}
                        <p className="text-[9px] text-gray-400 mt-2 font-medium">Gradually increases daily volume from {rampStart} to {rampEnd} over {rampPeriod} days.</p>
                     </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                           <label className="text-[9px] font-black text-gray-400 uppercase">Min Delay (Seconds)</label>
                           <input type="number" step="0.001" value={minDelay} onChange={e => setMinDelay(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold" />
                        </div>
                        <div className="space-y-1">
                           <label className="text-[9px] font-black text-gray-400 uppercase">Max Delay (Seconds)</label>
                           <input type="number" step="0.001" value={maxDelay} onChange={e => setMaxDelay(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                           <label className="text-[9px] font-black text-gray-400 uppercase">Daily Global Limit</label>
                           <input type="number" value={dailyLimit} onChange={e => setDailyLimit(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold" />
                        </div>
                        <div className="space-y-1">
                           <label className="text-[9px] font-black text-gray-400 uppercase">Max Send Per Hour</label>
                           <input type="number" value={maxPerHour} onChange={e => setMaxPerHour(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold" />
                        </div>
                      </div>

                     <div className="grid grid-cols-1 gap-4">
                          <div className="space-y-1">
                            <label className="text-[9px] font-black text-gray-400 uppercase">System Timezone (Full Selection)</label>
                            <select value={timezone} onChange={e => setTimezone(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold appearance-none">
                               <option value="UTC">UTC (Universal Time)</option>
                               <option value="America/New_York">America/New York (EST/EDT)</option>
                               <option value="America/Chicago">America/Chicago (CST/CDT)</option>
                               <option value="America/Denver">America/Denver (MST/MDT)</option>
                               <option value="America/Los_Angeles">America/Los Angeles (PST/PDT)</option>
                               <option value="Europe/London">Europe/London (GMT/BST)</option>
                               <option value="Europe/Paris">Europe/Paris (CET/CEST)</option>
                               <option value="Asia/Karachi">Asia/Karachi (PKT)</option>
                               <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                               <option value="Asia/Singapore">Asia/Singapore (SGT)</option>
                               <option value="Australia/Sydney">Australia/Sydney (AEST/AEDT)</option>
                            </select>
                         </div>
                     </div>

                     <div className="space-y-3">
                        <label className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 cursor-pointer hover:bg-white transition-all">
                           <div>
                              <p className="text-xs font-bold text-gray-900">Randomized Daily Jitter</p>
                              <p className="text-[10px] text-gray-400">Vary sending counts by +/- 10% daily to simulate human behavior.</p>
                           </div>
                           <input type="checkbox" checked={sendJitter} onChange={e => setSendJitter(e.target.checked)} className="h-4 w-4 accent-indigo-600" />
                        </label>

                        <label className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 cursor-pointer hover:bg-white transition-all">
                           <div>
                              <p className="text-xs font-bold text-gray-900">Strict Business Hours (Mon-Fri)</p>
                              <p className="text-[10px] text-gray-400">Automatically pause all sending on Saturdays and Sundays.</p>
                           </div>
                           <input type="checkbox" checked={businessHoursOnly} onChange={e => setBusinessHoursOnly(e.target.checked)} className="h-4 w-4 accent-indigo-600" />
                        </label>

                        <label className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 cursor-pointer hover:bg-white transition-all">
                           <div>
                              <p className="text-xs font-bold text-gray-900">Smart Deduplication</p>
                              <p className="text-[10px] text-gray-400">Never send to the same email twice across this campaign.</p>
                           </div>
                           <input type="checkbox" checked={deduplicate} onChange={e => setDeduplicate(e.target.checked)} className="h-4 w-4 accent-indigo-600" />
                        </label>
                        
                        <label className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 cursor-pointer hover:bg-white transition-all">
                           <div>
                              <p className="text-xs font-bold text-gray-900">1-Click Unsubscribe Link</p>
                              <p className="text-[10px] text-gray-400">Include a professional unsubscribe footer to maintain health.</p>
                           </div>
                           <input type="checkbox" checked={addUnsubscribe} onChange={e => setAddUnsubscribe(e.target.checked)} className="h-4 w-4 accent-indigo-600" />
                        </label>
                     </div>

                     <div className="pt-2 border-t border-gray-100">
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-1">
                              <label className="text-[9px] font-black text-gray-400 uppercase">Start Time</label>
                              <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold" />
                           </div>
                           <div className="space-y-1">
                              <label className="text-[9px] font-black text-gray-400 uppercase">End Time</label>
                              <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold" />
                           </div>
                        </div>
                     </div>

                     <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                        <div className="flex items-center justify-between mb-3">
                           <span className="text-xs font-bold text-gray-900">Custom Follow-up Window</span>
                           <input type="checkbox" checked={followupHoursEnabled} onChange={e => setFollowupHoursEnabled(e.target.checked)} className="h-4 w-4" />
                        </div>
                        {followupHoursEnabled && (
                           <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top">
                              <div className="space-y-1">
                                 <label className="text-[8px] font-black text-gray-400 uppercase">Followup Start</label>
                                 <input type="time" value={followupStartTime} onChange={e => setFollowupStartTime(e.target.value)} className="w-full p-2 rounded-lg border border-gray-200 text-xs font-bold" />
                              </div>
                              <div className="space-y-1">
                                 <label className="text-[8px] font-black text-gray-400 uppercase">Followup End</label>
                                 <input type="time" value={followupEndTime} onChange={e => setFollowupEndTime(e.target.value)} className="w-full p-2 rounded-lg border border-gray-200 text-xs font-bold" />
                              </div>
                           </div>
                        )}
                     </div>

                     <div className="pt-2">
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-1">
                              <label className="text-[9px] font-black text-gray-400 uppercase">Start Date</label>
                              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold" />
                           </div>
                           <div className="space-y-1">
                              <label className="text-[9px] font-black text-gray-400 uppercase">End Date (Optional)</label>
                              <div className="flex gap-2">
                                 <input type="date" disabled={endDateMode === 'list_end'} value={endDate} onChange={e => setEndDate(e.target.value)} className={`w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold ${endDateMode === 'list_end' ? 'opacity-50' : ''}`} />
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                 <input type="checkbox" checked={endDateMode === 'list_end'} onChange={e => setEndDateMode(e.target.checked ? 'list_end' : 'manual')} className="h-3 w-3" />
                                 <span className="text-[9px] font-bold text-gray-400">Or stop when list finishes</span>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* advanced Reply Logic */}
               <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/20 p-8 space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                     <MessageSquare size={20} className="text-blue-500" />
                     <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">Reply Handling</h2>
                  </div>
                  
                  <div className="space-y-4">
                     <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <span className="text-xs font-bold text-gray-700">Stop sequence on reply</span>
                        <input type="checkbox" checked={stopOnReply} onChange={e => setStopOnReply(e.target.checked)} className="h-4 w-4" />
                     </div>

                     <div className="p-4 bg-blue-50/30 rounded-2xl border border-blue-50">
                         <div className="flex items-center justify-between mb-3">
                           <span className="text-xs font-bold text-gray-900">Auto-Reply on Keyword</span>
                           <input type="checkbox" checked={autoReplyEnabled} onChange={e => setAutoReplyEnabled(e.target.checked)} className="h-4 w-4" />
                        </div>
                        {autoReplyEnabled && (
                           <div className="space-y-2 animate-in slide-in-from-top">
                              <input 
                                value={autoReplyKeyword} 
                                onChange={e => setAutoReplyKeyword(e.target.value)} 
                                placeholder="Keyword (e.g. 'price')" 
                                className="w-full p-2 text-xs font-bold border border-blue-100 rounded-lg placeholder-blue-300"
                              />
                              <textarea 
                                value={autoReplyMessage} 
                                onChange={e => setAutoReplyMessage(e.target.value)} 
                                placeholder="Auto-response message..." 
                                rows={3}
                                className="w-full p-2 text-xs font-medium border border-blue-100 rounded-lg resize-none placeholder-blue-300"
                              />
                           </div>
                        )}
                     </div>
                  </div>
               </div>

            </div>

             {/* Footer Actions */}
            <div className="flex justify-end gap-4">
               <button 
                  type="button" 
                  onClick={() => router.back()} 
                  className="px-8 py-4 bg-white border border-gray-200 text-gray-500 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-gray-50 transition-all"
               >
                  Cancel
               </button>
                     <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-5 bg-indigo-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                     >
                        {submitting ? (
                           <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                           isEditMode ? <Check size={18} /> : <Rocket size={18} />
                        )}
                        {submitting ? 'Submitting...' : (isEditMode ? 'Save Changes' : 'Launch Campaign')}
                     </button>
            </div>
         </form>
      </div>
    </div>
   );
}
