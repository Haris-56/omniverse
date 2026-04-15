"use client";

import { useState, useEffect, use } from "react";
import { 
  ChevronLeft, Info, Settings, Plus, Trash2, 
  Variable, Zap, Save, Check, Type, ShieldCheck, 
  Target, Rocket, Mail, Split, BarChart2, MessageSquare, AlertTriangle, Play, X,
  Cpu, Activity, Layers, ArrowRight, Globe, Clock, UserPlus, Send, Loader2, Hexagon
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
  const [listKeys, setListKeys] = useState([]); 

  // Form State
  const [name, setName] = useState("");
  const [listId, setListId] = useState("");
  
  // A/B Testing
  const [abTesting, setAbTesting] = useState(false);
  const [currentVariant, setCurrentVariant] = useState("A"); 
  
  // Variant A Content
  const [subjectA, setSubjectA] = useState("");
  const [messageA, setMessageA] = useState("");
  
  // Variant B Content
  const [subjectB, setSubjectB] = useState("");
  const [messageB, setMessageB] = useState("");

  // Settings
  const [dailyLimit, setDailyLimit] = useState(50);
  const [minDelay, setMinDelay] = useState(5);
  const [maxDelay, setMaxDelay] = useState(15);
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [stopOnReply, setStopOnReply] = useState(true);

  const [followUps, setFollowUps] = useState([]); 

  // Template Save State
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchData();
    fetchTemplates();
    
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
             setTimezone(camp.settings.timezone || camp.timezone || "UTC");
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
      const res = await fetch("/api/email/templates"); 
      if (res.ok) setTemplates(await res.json());
    } catch (error) {
      console.error("Failed to fetch templates", error);
    }
  };

  const fetchListKeys = async (id) => {
    try {
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
      subject: "Re: " + (abTesting ? subjectA : (subjectA || "Hello")), 
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
      const newFollowUps = [...followUps];
      newFollowUps[target].message += varString;
      setFollowUps(newFollowUps);
    }
  };

  const handleApplyTemplate = (templateId) => {
    const selected = templates.find(t => t._id === templateId);
    if (selected) {
      if ((messageA.length > 5 || messageB.length > 5) && !confirm("This will replace what you wrote. Is that okay?")) return;
      
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
      alert("Please enter a name.");
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
        alert("Saved!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !listId || !subjectA || !messageA) {
      alert("Please fill in all the blanks.");
      return;
    }
    if (selectedAccountIds.length === 0) {
      alert("Please pick at least one account.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        accountId, 
        accountIds: selectedAccountIds, 
        name,
        listId,
        abTesting,
        variantA: { subject: subjectA, message: messageA },
        variantB: abTesting ? { subject: subjectB, message: messageB } : null,
        settings: {
          dailyLimit,
          timezone,
          stopOnReply
        },
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
        alert(err.error || "Something went wrong.");
      }
    } catch (error) {
       console.error(error);
       alert("Error sending.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
     <div className="h-screen w-full flex flex-col items-center justify-center bg-[#F8F4F2] space-y-6 text-center px-10 font-sans">
        <div className="animate-spin w-10 h-10 border-4 border-[#B78D7D] border-t-transparent rounded-full shadow-sm" />
        <p className="text-[9px] font-black text-[#B2AAA6] uppercase tracking-[0.3em] font-mono">Loading...</p>
     </div>
  );

  return (
    <div className="w-full min-h-screen animate-in fade-in slide-in-from-bottom-8 duration-1000 font-sans p-6 md:p-10 lg:p-16 bg-[#F8F4F2]">
      <div className="max-w-[1500px] mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
          <div className="flex items-center gap-8">
            <button onClick={() => router.back()} className="p-4 bg-white border border-[#B78D7D]/10 rounded-[1.5rem] text-[#B78D7D] hover:bg-[#B78D7D] hover:text-white transition-all shadow-lg group">
              <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <div>
               <div className="flex items-center gap-3 mb-3">
                  <span className="px-4 py-1.5 bg-[#B78D7D]/10 text-[#B78D7D] text-[9px] font-black uppercase tracking-[0.2em] rounded-full border border-[#B78D7D]/20 flex items-center gap-2 font-mono">
                    <Mail size={12} />
                    {isEditMode ? 'Edit Plan' : 'New Plan'}
                  </span>
               </div>
               <h1 className="text-3xl font-black text-[#3E3A39] tracking-tighter uppercase leading-tight">{isEditMode ? 'Update Email Plan' : 'Create Email Plan'}</h1>
               <p className="text-[#8E7A70] mt-3 text-lg font-medium">Set up your email sequence. Sending from: <span className="text-[#B78D7D] font-black">{account?.email}</span></p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-16">
           <div className="bg-white rounded-[2.5rem] border border-[#B78D7D]/15 p-10 md:p-12 space-y-12 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                 <div className="space-y-4">
                    <label className="text-[9px] font-black text-[#B2AAA6] uppercase tracking-[0.3em] font-mono ml-4">Plan Name</label>
                    <input type="text" required value={name} onChange={e => setName(e.target.value)} className="form-input text-lg font-black" placeholder="e.g. My First Plan" />
                 </div>
                 <div className="space-y-4">
                    <label className="text-[9px] font-black text-[#B2AAA6] uppercase tracking-[0.3em] font-mono ml-4">Target People</label>
                    <select required value={listId} onChange={e => setListId(e.target.value)} className="form-input bg-[#F8F4F2]/30 text-lg font-black cursor-pointer">
                       <option value="" disabled>Select a list...</option>
                       {contactLists.map(list => <option key={list._id} value={list._id}>{list.name.toUpperCase()} ({list.count} people)</option>)}
                    </select>
                 </div>
              </div>
              
              <div className="pt-10 border-t border-[#B78D7D]/10">
                 <label className="text-[9px] font-black text-[#B2AAA6] uppercase tracking-[0.3em] font-mono mb-8 block ml-4">Accounts to use</label>
                 <div className="flex flex-wrap gap-4">
                    {allAccounts.map(acc => (
                       <label key={acc._id} className={`flex items-center gap-3 px-6 py-3 rounded-xl border cursor-pointer font-black text-[9px] uppercase tracking-widest font-mono transition-all ${selectedAccountIds.includes(acc._id) ? 'bg-[#B78D7D]/10 border-[#B78D7D]/30 text-[#B78D7D]' : 'bg-[#F8F4F2]/50 border-[#B78D7D]/10 text-[#B2AAA6]'}`}>
                          <input type="checkbox" className="sr-only" checked={selectedAccountIds.includes(acc._id)} onChange={(e) => {
                             if (e.target.checked) setSelectedAccountIds([...selectedAccountIds, acc._id]);
                             else if (selectedAccountIds.length > 1) setSelectedAccountIds(selectedAccountIds.filter(id => id !== acc._id));
                          }} />
                          <div className={`w-3 h-3 rounded-full border-2 ${selectedAccountIds.includes(acc._id) ? 'bg-[#B78D7D] border-[#B78D7D]' : 'bg-white border-[#B2AAA6]/20'}`}></div>
                          {acc.email}
                       </label>
                    ))}
                 </div>
              </div>
           </div>

           <div className="bg-white rounded-[2.5rem] border border-[#B78D7D]/15 overflow-hidden shadow-sm">
              <div className="p-8 border-b border-[#B78D7D]/10 bg-[#F8F4F2]/30 flex items-center justify-between">
                 <h2 className="text-xl font-black text-[#3E3A39] tracking-tighter uppercase leading-none">Draft your message</h2>
                 <div className="flex gap-4">
                    <button type="button" onClick={() => setAbTesting(!abTesting)} className={`px-6 py-3 rounded-lg text-[9px] font-black uppercase tracking-widest font-mono border transition-all ${abTesting ? 'bg-[#B78D7D] border-transparent text-white shadow-md' : 'bg-white border-[#B78D7D]/20 text-[#B2AAA6]'}`}>
                       {abTesting ? 'A/B Test: ON' : 'Try A/B Test'}
                    </button>
                 </div>
              </div>
              <div className="p-10 md:p-12 space-y-10">
                 {abTesting && (
                    <div className="flex gap-3 mb-2">
                       <button type="button" onClick={() => setCurrentVariant('A')} className={`px-6 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest font-mono transition-all ${currentVariant === 'A' ? 'bg-[#B78D7D] text-white' : 'bg-[#F8F4F2] text-[#B2AAA6]'}`}>Email A</button>
                       <button type="button" onClick={() => setCurrentVariant('B')} className={`px-6 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest font-mono transition-all ${currentVariant === 'B' ? 'bg-[#B78D7D] text-white' : 'bg-[#F8F4F2] text-[#B2AAA6]'}`}>Email B</button>
                    </div>
                 )}
                 <div className="space-y-4">
                    <label className="text-[9px] font-black text-[#B2AAA6] uppercase tracking-[0.3em] font-mono ml-4">The Subject Line</label>
                    <input value={abTesting && currentVariant === 'B' ? subjectB : subjectA} onChange={e => abTesting && currentVariant === 'B' ? setSubjectB(e.target.value) : setSubjectA(e.target.value)} className="form-input text-lg font-black" placeholder="Hello!" />
                 </div>
                 <div className="space-y-4">
                    <label className="text-[9px] font-black text-[#B2AAA6] uppercase tracking-[0.3em] font-mono ml-4">Message Body</label>
                    <textarea rows={8} value={abTesting && currentVariant === 'B' ? messageB : messageA} onChange={e => abTesting && currentVariant === 'B' ? setMessageB(e.target.value) : setMessageA(e.target.value)} className="form-input min-h-[250px] text-base font-bold" placeholder="Write your message here..." />
                 </div>
              </div>
           </div>

            {/* Email Timing & Limits */}
            <div className="bg-white rounded-[2.5rem] border border-[#B78D7D]/15 overflow-hidden group shadow-sm">
               <div className="p-8 border-b border-[#B78D7D]/10 bg-[#F8F4F2]/30">
                  <h2 className="text-xl font-black text-[#3E3A39] tracking-tighter uppercase leading-none">Timing & Limits</h2>
                  <p className="text-[9px] font-black text-[#B2AAA6] uppercase tracking-[0.3em] mt-2 font-mono">Control your sending volume.</p>
               </div>
               <div className="p-10 md:p-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  <div className="space-y-4">
                     <label className="text-[9px] font-black text-[#B2AAA6] uppercase tracking-[0.3em] font-mono ml-4">Emails per Day</label>
                     <input type="number" value={dailyLimit} onChange={e => setDailyLimit(e.target.value)} className="form-input text-2xl font-black py-6 text-center h-20" />
                  </div>
                  <div className="space-y-4">
                     <label className="text-[9px] font-black text-[#B2AAA6] uppercase tracking-[0.3em] font-mono ml-4">Wait Time (SEC)</label>
                     <div className="flex items-center gap-4">
                        <input type="number" value={minDelay} onChange={e => setMinDelay(e.target.value)} className="form-input text-center h-20 text-lg font-black" placeholder="Min" />
                        <ArrowRight size={20} className="text-[#B2AAA6]" />
                        <input type="number" value={maxDelay} onChange={e => setMaxDelay(e.target.value)} className="form-input text-center h-20 text-lg font-black" placeholder="Max" />
                     </div>
                  </div>
                  <div className="space-y-4">
                     <label className="text-[9px] font-black text-[#B2AAA6] uppercase tracking-[0.3em] font-mono ml-4">Timezone</label>
                     <select value={timezone} onChange={e => setTimezone(e.target.value)} className="form-input bg-[#F8F4F2]/30 h-20 text-lg font-black cursor-pointer">
                        {Intl.supportedValuesOf('timeZone').map(tz => (
                           <option key={tz} value={tz}>{tz}</option>
                        ))}
                     </select>
                  </div>
               </div>
               <div className="p-10 border-t border-[#B78D7D]/10 flex items-center justify-between bg-[#F8F4F2]/5">
                  <div>
                     <p className="text-lg font-black text-[#3E3A39] uppercase tracking-tighter">Stop if they reply</p>
                     <p className="text-[10px] font-bold text-[#8E7A70] italic">We will pause if they write back.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                     <input type="checkbox" className="sr-only peer" checked={stopOnReply} onChange={e => setStopOnReply(e.target.checked)} />
                     <div className="w-16 h-8 bg-[#F8F4F2] border border-[#B78D7D]/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-[#B2AAA6] after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#B78D7D] peer-checked:after:bg-white shadow-sm"></div>
                  </label>
               </div>
            </div>

            <div className="flex justify-end pt-8">
               <button type="submit" disabled={submitting} className="group/submit px-12 py-6 bg-[#B78D7D] text-white font-black text-xl uppercase tracking-[0.3em] rounded-[1.5rem] hover:bg-[#A37B6D] transition-all shadow-2xl flex items-center justify-center gap-6 active:scale-95 disabled:opacity-70 font-mono">
                  {submitting ? <Loader2 className="animate-spin" size={32} /> : <div className="flex items-center gap-4"><span>{isEditMode ? 'Save Changes' : 'Start Plan'}</span> <ArrowRight size={24} className="group-hover/submit:translate-x-2 transition-transform duration-700" /></div>}
               </button>
            </div>
        </form>
      </div>
    </div>
  );
}
