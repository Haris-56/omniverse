"use client";

import { useState, useEffect, use } from "react";
import { 
  ChevronLeft, Plus, Search, Filter, 
  Settings, Trash2, Play, Pause, 
  Activity, Clock, Mail, ShieldCheck,
  LayoutGrid, List, Target, Send, ArrowRight,
  Loader2, ChevronRight
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function EmailCampaignsPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const accountId = params.id;
  const [account, setAccount] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("list"); // 'grid' or 'list'
  const router = useRouter();

  useEffect(() => {
    fetchAccountDetails();
    fetchCampaigns();
  }, [accountId]);

  const fetchAccountDetails = async () => {
    try {
      const res = await fetch(`/api/email/accounts/${accountId}`);
      if (res.ok) {
        const data = await res.json();
        setAccount(data);
      }
    } catch (error) {
      console.error("Failed to fetch account details", error);
    }
  };

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/email/campaigns?accountId=${accountId}`);
      if (res.ok) {
        const data = await res.json();
        setCampaigns(data);
      }
    } catch (error) {
      console.error("Failed to fetch campaigns", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Paused" : "Active";
    try {
      const res = await fetch("/api/email/campaigns", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus })
      });
      if (res.ok) fetchCampaigns();
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const handleDeleteCampaign = async (id) => {
    if (!confirm("Are you sure you want to delete this plan?")) return;
    try {
      const res = await fetch(`/api/email/campaigns?id=${id}`, {
        method: "DELETE"
      });
      if (res.ok) fetchCampaigns();
      else alert("Failed to delete campaign");
    } catch (error) {
      console.error("Failed to delete campaign", error);
    }
  };

  const filteredCampaigns = campaigns.filter(camp =>
    camp.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-6 duration-1000 font-sans pb-32 p-6 md:p-10 lg:p-12 min-h-screen bg-[#FCF8FE]/50">
      <div className="max-w-[1400px] mx-auto space-y-12">
        
        {/* Navigation & Breadcrumbs */}
        <div className="flex items-center gap-6">
          <Link href="/email" className="p-4 bg-white border border-[#8245EF]/10 rounded-2xl text-[#94a3b8] hover:text-[#8245EF] transition-all shadow-sm hover:bg-[#FCF8FE] group">
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.2em] font-mono text-[#94a3b8]">
             <Link href="/email" className="hover:text-[#8245EF] transition-colors">Email Accounts</Link>
             <span className="opacity-20">/</span>
             <span className="text-[#8245EF]">Sent Messages</span>
          </div>
        </div>

        {/* Header Sector */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 border-b border-[#8245EF]/10 pb-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
               <div className="w-12 h-12 bg-[#8245EF]/10 rounded-[1.25rem] flex items-center justify-center text-[#8245EF] border border-[#8245EF]/20 shadow-sm">
                  <Mail size={24} />
               </div>
               <span className="px-4 py-1.5 bg-[#8245EF]/10 text-[#8245EF] text-[9px] font-black uppercase tracking-[0.2em] rounded-full border border-[#8245EF]/20 flex items-center gap-2 font-mono">
                 <ShieldCheck size={14} className="animate-pulse" />
                 Verified
               </span>
            </div>
            <h1 className="text-3xl font-black text-[#161932] tracking-tighter uppercase leading-tight">
               {account?.email || "Email Plans"}
            </h1>
            <p className="text-[#64748b] mt-3 text-lg font-medium">You have {campaigns.length} plans running here.</p>
          </div>
          
          <div className="flex items-center gap-6">
             <div className="hidden md:flex items-center bg-white border border-[#8245EF]/10 p-2 rounded-[1.25rem] shadow-sm">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-3 rounded-xl transition-all ${viewMode === "grid" ? "bg-[#8245EF] text-white shadow-lg" : "text-[#94a3b8] hover:text-[#8245EF]"}`}
                >
                  <LayoutGrid size={20} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-3 rounded-xl transition-all ${viewMode === "list" ? "bg-[#8245EF] text-white shadow-lg" : "text-[#94a3b8] hover:text-[#8245EF]"}`}
                >
                  <List size={20} />
                </button>
             </div>
             <button
                onClick={() => router.push(`/email/${accountId}/campaigns/new`)}
                className="px-10 py-5 bg-[#8245EF] text-white font-black text-[10px] uppercase tracking-[0.4em] rounded-[1.5rem] transition-all shadow-[0_15px_30px_rgba(130, 69, 239,0.2)] flex items-center justify-center gap-4 active:scale-95 font-mono border border-white/10 hover:bg-[#6d28d9]"
              >
                <Plus size={20} />
                Create New Plan
              </button>
          </div>
        </div>

        {/* Global Search */}
        <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-[#8245EF]/10 shadow-sm relative overflow-hidden group">
          <div className="relative z-10 flex flex-col md:flex-row gap-6">
            <div className="flex-1 relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={20} />
              <input
                type="text"
                placeholder="Search plans by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-[#FCF8FE]/50 border border-[#8245EF]/10 rounded-[1.25rem] text-[11px] font-black text-[#161932] outline-none focus:border-[#8245EF] transition-all shadow-inner font-mono tracking-widest uppercase"
              />
            </div>
            <button className="px-8 py-4 bg-white border border-[#8245EF]/10 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] text-[#64748b] flex items-center justify-center gap-3 hover:text-[#8245EF] hover:bg-[#FCF8FE] transition-all font-mono">
              <Filter size={16} /> Filter
            </button>
          </div>
        </div>

        {loading && campaigns.length === 0 ? (
           <div className="py-40 flex flex-col items-center justify-center space-y-8 animate-pulse text-center">
              <div className="w-12 h-12 border-4 border-[#8245EF]/10 border-t-[#8245EF] rounded-full animate-spin shadow-sm" />
              <p className="text-[9px] font-black text-[#94a3b8] uppercase tracking-[0.3em] font-mono">Loading plans...</p>
           </div>
        ) : campaigns.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] border border-dashed border-[#8245EF]/30 py-32 flex flex-col items-center text-center px-10 shadow-lg p-16 max-w-3xl mx-auto relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#8245EF]/5 to-transparent opacity-50" />
            <div className="relative w-24 h-24 bg-[#FCF8FE] text-[#8245EF] rounded-[1.75rem] flex items-center justify-center mb-10 shadow-inner group-hover:rotate-6 transition-all duration-700 border border-[#8245EF]/10">
               <Send size={44} strokeWidth={1} className="opacity-40" />
            </div>
            <h3 className="text-3xl font-black text-[#161932] tracking-tighter uppercase mb-4 leading-tight relative z-10">No plans yet</h3>
            <p className="text-[#64748b] text-lg font-medium max-w-md mb-12 relative z-10">
              You haven't set up any email plans yet. Start your first one now!
            </p>
            <button
              onClick={() => router.push(`/email/${accountId}/campaigns/new`)}
              className="px-10 py-5 bg-white border border-[#8245EF]/20 text-[#8245EF] text-[10px] font-black uppercase tracking-[0.4em] rounded-[1.25rem] hover:bg-[#8245EF] hover:text-white transition-all shadow-md font-mono active:scale-95 relative z-10"
            >
              Start Now
            </button>
          </div>
        ) : viewMode === "list" ? (
          /* List Matrix */
          <div className="bg-white rounded-[2rem] border border-[#8245EF]/10 overflow-hidden shadow-sm relative">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left">
                <thead className="bg-[#FCF8FE]/50 text-[9px] font-black uppercase text-[#94a3b8] tracking-[0.3em] font-mono border-b border-[#8245EF]/10">
                  <tr>
                    <th className="p-8 pl-10">Plan Name</th>
                    <th className="p-8">Status</th>
                    <th className="p-8 text-center">Outcome</th>
                    <th className="p-8 text-right pr-10">Manage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#8245EF]/5">
                  {filteredCampaigns.map((camp, idx) => (
                    <tr key={camp._id} className="group hover:bg-[#FCF8FE]/30 transition-all cursor-default">
                      <td className="p-8 pl-10">
                        <div className="flex items-center gap-6">
                           <div className="w-12 h-12 bg-[#FCF8FE] border border-[#8245EF]/10 rounded-xl flex items-center justify-center text-[#94a3b8] font-black text-lg group-hover:bg-[#8245EF] group-hover:text-white transition-all shadow-inner font-mono">
                              {(idx + 1).toString().padStart(2, '0')}
                           </div>
                           <div>
                              <p className="text-lg font-black text-[#161932] tracking-tighter uppercase leading-none">{camp.name}</p>
                              <p className="text-[9px] font-black text-[#94a3b8] uppercase tracking-[0.2em] font-mono mt-2">Verified Dispatch</p>
                           </div>
                        </div>
                      </td>
                      <td className="p-8">
                         <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-full border font-mono tracking-widest uppercase text-[9px] font-black transition-all ${camp.status === 'Active' ? 'bg-[#8245EF]/10 border-[#8245EF]/20 text-[#8245EF]' : 'bg-[#94a3b8]/5 border-[#94a3b8]/10 text-[#94a3b8]'}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${camp.status === 'Active' ? 'bg-[#8245EF] animate-pulse' : 'bg-[#94a3b8]'}`} />
                            {camp.status}
                         </div>
                      </td>
                      <td className="p-8">
                         <div className="flex flex-col items-center">
                            <span className="text-2xl font-black text-[#161932] tracking-tighter">{camp.sentCount || 0}</span>
                            <span className="text-[8px] font-black text-[#94a3b8] uppercase tracking-widest font-mono">Emails Sent</span>
                         </div>
                      </td>
                      <td className="p-8 pr-10 text-right">
                         <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500">
                            <button 
                              onClick={() => handleToggleStatus(camp._id, camp.status)}
                              className={`p-3 rounded-lg border transition-all active:scale-90 ${camp.status === 'Active' ? 'text-[#94a3b8] hover:text-[#8245EF] border-[#8245EF]/10' : 'text-[#8245EF] border-[#8245EF]/20 hover:bg-[#8245EF] hover:text-white'}`}
                              title={camp.status === 'Active' ? 'Pause' : 'Start'}
                            >
                              {camp.status === 'Active' ? <Pause size={18} /> : <Play size={18} />}
                            </button>
                            <button
                              onClick={() => router.push(`/email/${accountId}/campaigns/new?edit=${camp._id}`)}
                              className="p-3 bg-white border border-[#8245EF]/10 text-[#94a3b8] rounded-lg hover:text-[#8245EF] hover:bg-[#FCF8FE] transition-all active:scale-90"
                              title="Edit"
                            >
                               <Settings size={18} />
                            </button>
                            <button 
                              onClick={() => handleDeleteCampaign(camp._id)}
                              className="p-3 bg-rose-50 text-rose-500 rounded-lg hover:bg-rose-500 hover:text-white transition-all active:scale-90"
                              title="Delete"
                            >
                               <Trash2 size={18} />
                            </button>
                         </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Grid Matrix */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCampaigns.map((camp) => (
              <div key={camp._id} className="group bg-white rounded-[2.5rem] border border-[#8245EF]/10 transition-all duration-700 flex flex-col relative overflow-hidden h-full shadow-sm hover:shadow-[0_20px_40px_rgba(130, 69, 239,0.08)]">
                <div className={`h-1 w-full absolute top-0 left-0 z-20 ${camp.status === 'Active' ? 'bg-[#8245EF]' : 'bg-[#94a3b8]'} transition-all`} />
                <div className="p-10 pb-8 flex-1 flex flex-col relative z-10">
                   <div className="flex justify-between items-start mb-10">
                      <div className="w-14 h-14 bg-[#FCF8FE] border border-[#8245EF]/10 rounded-2xl flex items-center justify-center text-[#94a3b8] group-hover:text-[#8245EF] group-hover:bg-white transition-all shadow-inner group-hover:scale-110 group-hover:rotate-6 duration-700">
                         <Target size={28} />
                      </div>
                      <div className={`px-4 py-1.5 rounded-full border text-[8px] font-black uppercase tracking-widest font-mono transition-all ${camp.status === 'Active' ? 'bg-[#8245EF]/10 border-[#8245EF]/20 text-[#8245EF]' : 'bg-[#94a3b8]/5 border-[#94a3b8]/10 text-[#94a3b8]'}`}>
                         {camp.status}
                      </div>
                   </div>
                   <div className="mb-8 flex-1">
                      <h3 className="text-xl font-black text-[#161932] tracking-tighter uppercase mb-2 leading-tight group-hover:text-[#8245EF] transition-colors duration-500 line-clamp-1">{camp.name}</h3>
                      <p className="text-[10px] font-black text-[#94a3b8] uppercase tracking-widest font-mono">ID: {camp._id.toString().slice(-8).toUpperCase()}</p>
                   </div>
                   <div className="grid grid-cols-2 gap-4 mt-auto pt-6 border-t border-[#8245EF]/5">
                      <div>
                         <p className="text-[9px] font-black text-[#94a3b8] uppercase tracking-widest font-mono mb-1">Delivered</p>
                         <p className="text-xl font-black text-[#161932]">{camp.sentCount || 0}</p>
                      </div>
                      <div>
                         <p className="text-[9px] font-black text-[#94a3b8] uppercase tracking-widest font-mono mb-1">Status</p>
                         <span className={`text-[10px] font-black uppercase tracking-widest ${camp.status === 'Active' ? 'text-[#8245EF]' : 'text-[#94a3b8]'}`}>{camp.status}</span>
                      </div>
                   </div>
                   <div className="mt-8 pt-6 border-t border-[#8245EF]/10 flex items-center justify-between">
                      <button 
                        onClick={() => router.push(`/email/${accountId}/campaigns/new?edit=${camp._id}`)}
                        className="text-[9px] font-black text-[#8245EF] uppercase tracking-widest font-mono flex items-center gap-2 group/btn"
                      >
                         Configure Plan <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                      <button 
                        onClick={() => handleDeleteCampaign(camp._id)}
                        className="p-2 text-[#94a3b8] hover:text-rose-500 transition-colors"
                      >
                         <Trash2 size={16} />
                      </button>
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
