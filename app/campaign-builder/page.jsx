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
            <div className="flex items-center gap-4 mb-6">
                 <span className="px-5 py-2 bg-[#8245EF]/10 text-[#8245EF] text-[10px] font-black uppercase tracking-[0.4em] rounded-full border border-[#8245EF]/20 flex items-center gap-2 font-mono shadow-sm">
                 <ShieldCheck size={16} className="opacity-80" />
                 Ready to work
               </span>
            </div>
            <h1 className="text-5xl font-black text-[#161932] tracking-tighter uppercase leading-tight">
              Make a <span className="text-[#8245EF]">Big Plan</span>
            </h1>
            <p className="text-[#64748b] mt-4 text-xl font-medium max-w-3xl leading-relaxed">Combine different ways to talk to people and grow your business.</p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="group px-12 py-6 bg-[#8245EF] text-white text-[11px] font-black uppercase tracking-[0.5em] rounded-[1.75rem] hover:bg-[#6d28d9] transition-all shadow-[0_20px_40px_rgba(130, 69, 239,0.3)] flex items-center justify-center gap-4 active:scale-95 border border-white/10 font-mono"
          >
            <Plus size={24} className="group-hover:rotate-90 transition-transform duration-500" />
            Start a Big Plan
          </button>
        </div>

        {/* Toolbar Sector */}
        <div className="bg-white p-10 rounded-[3.5rem] border border-[#8245EF]/10 shadow-sm relative overflow-hidden group">
           <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
              <div className="relative flex-1 max-w-3xl group/search">
                 <input
                   placeholder="SEARCH YOUR PLANS..."
                   className="w-full bg-[#FCF8FE]/50 border border-[#8245EF]/10 rounded-3xl py-6 px-20 text-[12px] font-black text-[#161932] outline-none shadow-inner focus:border-[#8245EF]/40 transition-all placeholder:text-[#94a3b8] font-mono tracking-widest uppercase"
                 />
                 <Search size={28} className="absolute left-8 top-1/2 -translate-y-1/2 text-[#94a3b8] group-focus-within/search:text-[#8245EF] transition-colors" />
              </div>
              
              <button className="px-12 py-5 bg-white border border-[#8245EF]/15 rounded-2xl text-[#64748b] text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-4 hover:border-[#8245EF]/40 hover:text-[#8245EF] transition-all font-mono">
                 <Filter size={20} className="group-hover:rotate-12 transition-transform" />
                 Show Filters
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
             <p className="text-[11px] font-black text-[#94a3b8] uppercase tracking-[0.5em] font-mono">Looking for your plans...</p>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40 bg-white rounded-[4rem] border border-dashed border-[#8245EF]/20 text-center shadow-lg p-20 max-w-4xl mx-auto relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#8245EF]/5 via-transparent to-transparent opacity-50" />
            <div className="relative w-36 h-36 bg-[#FCF8FE] text-[#8245EF] border border-[#8245EF]/15 rounded-[3rem] flex items-center justify-center mb-12 rotate-3 shadow-inner group-hover:rotate-0 transition-transform duration-700">
              <Box size={72} />
            </div>
            <h3 className="text-4xl font-black text-[#161932] mb-6 tracking-tighter relative z-10 uppercase leading-none">No Plans Yet</h3>
            <p className="text-[#64748b] text-xl mb-16 max-w-md relative z-10 font-bold leading-relaxed">
              Start your first big plan to talk to more customers.
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-14 py-6 bg-white border border-[#8245EF]/20 text-[#8245EF] font-black text-[11px] uppercase tracking-[0.4em] rounded-2xl hover:bg-[#FCF8FE] transition-all shadow-md flex items-center gap-5 relative z-10 font-mono active:scale-95"
            >
              <Plus size={24} />
              Make your first plan
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

                  <h3 className="font-black text-3xl text-[#161932] mb-6 tracking-tighter group-hover:text-[#8245EF] transition-colors leading-tight uppercase font-sans">{campaign.name}</h3>
                  
                  <div className="flex items-center gap-4 mb-14">
                    <span className={`text-[9px] font-black uppercase px-6 py-3 rounded-2xl border tracking-[0.3em] font-mono leading-none ${
                      campaign.status === 'Running' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm' : 'bg-[#FCF8FE] text-[#94a3b8] border-[#8245EF]/10'
                    }`}>
                      Status: {campaign.status.toUpperCase()}
                    </span>
                    <span className="text-[9px] font-black uppercase text-[#8245EF] bg-[#8245EF]/10 border border-[#8245EF]/20 px-6 py-3 rounded-2xl tracking-[0.3em] font-mono shadow-inner leading-none">
                       {campaign.platform === 'multi-channel' ? 'ALL CHANNELS' : campaign.platform.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-8 p-10 bg-[#FCF8FE]/50 rounded-[3.5rem] border border-[#8245EF]/10 group-hover:bg-white group-hover:border-[#8245EF]/20 transition-all duration-700 shadow-inner relative overflow-hidden">
                    <div className="text-center">
                      <p className="text-[9px] font-black text-[#94a3b8] uppercase tracking-[0.4em] mb-4 font-mono">Sent</p>
                      <p className="font-black text-[#161932] text-3xl tracking-tighter leading-none">{campaign.stats?.sent || 0}</p>
                    </div>
                    <div className="text-center border-l border-[#8245EF]/10">
                      <p className="text-[9px] font-black text-[#94a3b8] uppercase tracking-[0.4em] mb-4 font-mono">Opened</p>
                      <p className="font-black text-[#161932] text-3xl tracking-tighter leading-none">{campaign.stats?.opened || 0}</p>
                    </div>
                    <div className="text-center border-l border-[#8245EF]/10">
                      <p className="text-[9px] font-black text-[#94a3b8] uppercase tracking-[0.4em] mb-4 font-mono">Replies</p>
                      <p className="font-black text-[#161932] text-3xl tracking-tighter leading-none">{campaign.stats?.replied || 0}</p>
                    </div>
                  </div>
                </div>
                
                <div className="px-14 py-10 bg-[#FCF8FE]/30 border-t border-[#8245EF]/10 flex justify-between items-center group-hover:bg-[#FCF8FE]/70 transition-all relative z-10">
                  <span className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.4em] font-mono flex items-center gap-4">
                    <Calendar size={18} className="text-[#8245EF]/40" />
                    Last worked: {new Date(campaign.updatedAt).toLocaleDateString()}
                  </span>
                  <span className="text-[11px] font-black text-[#8245EF] uppercase tracking-[0.5em] flex items-center gap-4 group-hover:gap-6 transition-all font-mono group-hover:text-[#8245EF]">
                    Settings <ChevronRight size={20} strokeWidth={3} />
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
            
            <h2 className="text-6xl font-black text-[#161932] mb-8 tracking-tighter uppercase leading-[0.9]">New <br/> <span className="text-[#8245EF]">Plan</span></h2>
            <p className="text-[#64748b] font-bold text-2xl mb-16 leading-relaxed border-l-4 border-[#8245EF]/20 pl-10">Give your plan a name to get started.</p>
            
            <form onSubmit={handleCreateCampaign} className="space-y-20">
              <div className="space-y-6">
                <label className="text-[11px] font-black text-[#94a3b8] uppercase tracking-[0.5em] font-mono px-10">Name your plan</label>
                <div className="relative group/input">
                  <input
                    type="text"
                    value={newCampaignName}
                    onChange={(e) => setNewCampaignName(e.target.value)}
                    className="w-full bg-[#FCF8FE] border border-[#8245EF]/15 rounded-[3.5rem] px-14 py-10 outline-none focus:border-[#8245EF]/40 focus:bg-white transition-all font-black text-[#161932] placeholder:text-[#94a3b8]/40 text-4xl shadow-inner uppercase tracking-tighter"
                    placeholder="MY BIG PLAN"
                    autoFocus
                  />
                  <div className="absolute right-12 top-1/2 -translate-y-1/2 text-[#94a3b8] group-focus-within/input:text-[#8245EF] transition-colors">
                     <Target size={40} />
                  </div>
                </div>
              </div>

              <div className="flex gap-10">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 py-10 bg-[#FCF8FE] text-[#94a3b8] font-black text-[12px] uppercase tracking-[0.5em] rounded-[3rem] hover:bg-[#94a3b8] hover:text-white transition-all border border-[#8245EF]/10 font-mono active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newCampaignName}
                  className="flex-[2] py-10 bg-[#8245EF] text-white font-black text-[12px] uppercase tracking-[0.5em] rounded-[3rem] hover:bg-[#6d28d9] shadow-[0_30px_60px_rgba(130, 69, 239,0.3)] transition-all disabled:opacity-50 active:scale-95 font-mono border border-white/10"
                >
                  Save Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
