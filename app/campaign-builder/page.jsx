"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, Filter, MoreHorizontal, PlayCircle, PauseCircle, Trash2, ExternalLink, Zap, Globe, Cpu, Target, Activity, Calendar, ShieldCheck, Box, SearchIcon, ArrowRight, Hexagon, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CampaignListPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newCampaignName, setNewCampaignName] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/campaigns");
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

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    if (!newCampaignName) return;

    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCampaignName, platform: "multi-channel" }), 
      });

      if (res.ok) {
        const newCampaign = await res.json();
        router.push(`/campaign-builder/${newCampaign._id}/edit`);
      }
    } catch (error) {
      console.error("Error creating plan:", error);
    }
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this plan?")) return;

    try {
      const res = await fetch(`/api/campaigns/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchCampaigns();
      }
    } catch (error) {
      console.error("Error deleting plan:", error);
    }
  };

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-1000 font-sans pb-32">
      <div className="max-w-[1600px] mx-auto space-y-16">
        
        {/* Header Sector */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 border-b border-[#8245EF]/15 pb-10">
          <div>
            <div className="flex items-center gap-4 mb-4">
               <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-full border border-green-100 flex items-center gap-2">
                 <ShieldCheck size={14} className="opacity-80" />
                 Active
               </span>
            </div>
            <h1>My Plans</h1>
            <p className="text-gray-500 mt-2 text-xl">Create plans to message people on different platforms.</p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="group px-8 py-4 bg-[#8245EF] text-white text-xs font-bold rounded-xl hover:bg-[#6d28d9] transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95 border border-white/10"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500" />
            New Plan
          </button>
        </div>

        {/* Toolbar Sector */}
        <div className="bg-white p-10 rounded-[3.5rem] border border-[#8245EF]/10 shadow-sm relative overflow-hidden group">
           <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
               <div className="relative flex-1 max-w-3xl group/search">
                  <input
                    placeholder="Search plans..."
                    className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl py-4 px-16 text-sm font-bold text-gray-900 outline-none focus:border-[#8245EF]/40 transition-all placeholder:text-gray-400"
                  />
                  <Search size={22} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/search:text-[#8245EF] transition-colors" />
               </div>
               
               <button className="px-6 py-3 bg-white border border-gray-100 rounded-xl text-gray-500 text-xs font-bold flex items-center gap-2 hover:border-[#8245EF]/40 hover:text-[#8245EF] transition-all">
                  <Filter size={18} />
                  Filters
               </button>
           </div>
           <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#8245EF]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-56 space-y-12">
             <div className="relative">
                <div className="animate-spin w-24 h-24 border-[5px] border-[#8245EF]/10 border-t-[#8245EF] rounded-full shadow-sm" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <Target size={32} className="text-[#8245EF] animate-pulse" />
                </div>
             </div>
             <p className="text-xs font-bold text-gray-400">Loading...</p>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40 bg-white rounded-[4rem] border border-dashed border-[#8245EF]/20 text-center shadow-lg p-20 max-w-4xl mx-auto relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#8245EF]/5 via-transparent to-transparent opacity-50" />
            <div className="relative w-36 h-36 bg-[#FCF8FE] text-[#8245EF] border border-[#8245EF]/15 rounded-[3rem] flex items-center justify-center mb-12 rotate-3 shadow-inner group-hover:rotate-0 transition-transform duration-700">
              <Box size={72} />
            </div>
             <h3 className="text-2xl font-bold text-gray-900 mb-4">No Plans Yet</h3>
             <p className="text-gray-500 text-lg mb-12 max-w-md relative z-10 font-bold leading-relaxed">
               Create your first plan to message people.
             </p>
             <button
               onClick={() => setIsCreateModalOpen(true)}
               className="px-10 py-5 bg-[#8245EF] text-white font-bold text-xs rounded-xl hover:bg-[#6d28d9] transition-all shadow-lg flex items-center gap-3 relative z-10"
             >
               <Plus size={20} />
               Create Plan
             </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-12">
            {campaigns.map((campaign) => (
              <Link 
                href={`/campaign-builder/${campaign._id}`} 
                key={campaign._id}
                className="group bg-white rounded-[4rem] border border-[#8245EF]/10 transition-all duration-700 flex flex-col relative overflow-hidden hover:shadow-[0_45px_90px_rgba(130, 69, 239,0.08)] hover:-translate-y-3"
              >
                <div className="p-14 pb-12 flex-1 relative z-10">
                  <div className="flex justify-between items-start mb-12">
                    <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center shadow-inner transition-all duration-700 group-hover:scale-110 group-hover:rotate-6 border border-[#8245EF]/10 ${
                      campaign.status === 'Running' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm' : 'bg-[#FCF8FE] text-[#94a3b8]'
                    }`}>
                      {campaign.status === 'Running' ? (
                        <div className="relative">
                          <PlayCircle size={40} />
                          <div className="absolute inset-0 animate-ping bg-emerald-400/20 rounded-full" />
                        </div>
                      ) : (
                        <Zap size={40} />
                      )}
                    </div>
                    <button
                      onClick={(e) => handleDelete(e, campaign._id)}
                      className="text-[#94a3b8] hover:text-rose-500 transition-all p-4 hover:bg-rose-500/5 bg-[#FCF8FE]/30 border border-transparent rounded-2xl opacity-0 group-hover:opacity-100 duration-500 active:scale-90 shadow-sm"
                    >
                      <Trash2 size={24} />
                    </button>
                  </div>

                   <h3 className="font-bold text-2xl text-gray-900 mb-6 group-hover:text-[#8245EF] transition-colors line-clamp-1">{campaign.name}</h3>
                   
                   <div className="flex items-center gap-3 mb-10">
                     <span className={`text-[9px] font-bold uppercase px-4 py-2 rounded-xl border leading-none ${
                       campaign.status === 'Running' ? 'bg-green-50 text-green-600 border-green-100 shadow-sm' : 'bg-gray-50 text-gray-400 border-gray-100'
                     }`}>
                       Status: {campaign.status}
                     </span>
                     <span className="text-[9px] font-bold uppercase text-[#8245EF] bg-[#8245EF]/10 border border-[#8245EF]/20 px-4 py-2 rounded-xl shadow-inner leading-none">
                        {campaign.platform === 'multi-channel' ? 'All Channels' : campaign.platform}
                     </span>
                   </div>

                   <div className="grid grid-cols-3 gap-6 p-8 bg-gray-50/50 rounded-3xl border border-gray-100">
                     <div className="text-center">
                       <p className="text-[10px] font-bold text-gray-400 mb-2">Sent</p>
                       <p className="font-bold text-gray-900 text-2xl leading-none">{campaign.stats?.sent || 0}</p>
                     </div>
                     <div className="text-center border-l border-gray-200">
                       <p className="text-[10px] font-bold text-gray-400 mb-2">Opened</p>
                       <p className="font-bold text-gray-900 text-2xl leading-none">{campaign.stats?.opened || 0}</p>
                     </div>
                     <div className="text-center border-l border-gray-200">
                       <p className="text-[10px] font-bold text-gray-400 mb-2">Replies</p>
                       <p className="font-bold text-gray-900 text-2xl leading-none">{campaign.stats?.replied || 0}</p>
                     </div>
                   </div>
                </div>
                                <div className="px-10 py-6 bg-gray-50/30 border-t border-gray-100 flex justify-between items-center relative z-10">
                   <span className="text-[10px] font-bold text-gray-400 flex items-center gap-2">
                     <Calendar size={16} className="text-[#8245EF]/40" />
                     Last worked: {new Date(campaign.updatedAt).toLocaleDateString()}
                   </span>
                   <span className="text-[10px] font-bold text-[#8245EF] flex items-center gap-2 group-hover:text-[#6d28d9] transition-all">
                     Settings <ChevronRight size={18} />
                   </span>
                 </div>

                <div className="absolute inset-0 opacity-[0.015] pointer-events-none group-hover:opacity-[0.03] transition-opacity bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                <div className="absolute -right-24 -bottom-24 w-80 h-80 bg-[#8245EF]/10 rounded-full blur-[100px] group-hover:scale-125 transition-transform duration-1000" />
              </Link>
            ))}
          </div>
        )}
      </div>

       {/* Global Branding Watermark */}
       <div className="fixed bottom-10 right-10 pointer-events-none opacity-[0.03] select-none z-[-1] grayscale">
         <div className="flex flex-col items-end gap-10">
            <h1 className="text-[14rem] font-black font-sans tracking-tighter uppercase leading-none text-[#8245EF]">PLAN</h1>
            <div className="flex items-center gap-10">
               <Hexagon size={80} strokeWidth={2} className="text-[#8245EF]" />
               <p className="text-4xl font-black uppercase tracking-[1em] text-[#8245EF] font-mono">FLOW</p>
            </div>
         </div>
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[1000] p-8 animate-in fade-in duration-1000">
          <div className="absolute inset-0 bg-[#161932]/60 backdrop-blur-3xl" onClick={() => setIsCreateModalOpen(false)} />
          <div className="bg-white rounded-[5rem] shadow-[0_50px_100px_rgba(0,0,0,0.2)] w-full max-w-3xl p-24 border border-[#8245EF]/20 animate-in zoom-in-95 duration-700 relative z-[1010] overflow-hidden font-sans">
            <div className="absolute -right-40 -top-40 w-[600px] h-[600px] bg-[#8245EF]/[0.05] rounded-full blur-[150px] animate-pulse" />
            
            <div className="w-24 h-24 bg-[#FCF8FE] rounded-[2.5rem] border border-[#8245EF]/15 flex items-center justify-center mb-14 border-[#8245EF]/10 shadow-inner transition-transform hover:rotate-12 duration-700">
               <Cpu size={56} className="text-[#8245EF]" />
            </div>
            
            <h2 className="text-4xl font-bold text-gray-900 mb-6">New Plan</h2>
            <p className="text-gray-500 font-bold text-lg mb-12 leading-relaxed border-l-4 border-[#8245EF]/20 pl-6">Enter a name for your plan.</p>
            
            <form onSubmit={handleCreateCampaign} className="space-y-20">
              <div className="space-y-4">
                <label className="text-xs font-bold text-gray-400 ml-4">Plan Name</label>
                <div className="relative group/input">
                  <input
                    type="text"
                    value={newCampaignName}
                    onChange={(e) => setNewCampaignName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-8 py-6 outline-none focus:border-[#8245EF]/40 focus:bg-white transition-all font-bold text-gray-900 placeholder:text-gray-400 text-2xl shadow-inner"
                    placeholder="Plan Name"
                    autoFocus
                  />
                  <div className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/input:text-[#8245EF] transition-colors">
                     <Target size={28} />
                  </div>
                </div>
              </div>

              <div className="flex gap-6">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 py-5 bg-gray-50 text-gray-400 font-bold text-xs uppercase rounded-xl hover:bg-gray-100 transition-all border border-gray-200 active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newCampaignName}
                  className="flex-[2] py-5 bg-[#8245EF] text-white font-bold text-xs uppercase rounded-xl hover:bg-[#6d28d9] shadow-lg transition-all disabled:opacity-50 active:scale-95 border border-white/10"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
