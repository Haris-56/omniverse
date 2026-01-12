"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, Filter, MoreHorizontal, PlayCircle, PauseCircle, Trash2, ExternalLink, Zap, Globe, Cpu, Target } from "lucide-react";
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
      console.error("Error creating campaign:", error);
    }
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this campaign?")) return;

    try {
      const res = await fetch(`/api/campaigns/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchCampaigns();
      }
    } catch (error) {
      console.error("Error deleting campaign:", error);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
               <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-wider rounded-full border border-indigo-100 flex items-center gap-1">
                 <Zap size={12} fill="currentColor" />
                 Orchestration Protocol
               </span>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
              Campaign Architect
            </h1>
            <p className="text-gray-500 mt-2 max-w-lg">Design and manage multi-channel automation flows with autonomous agent integration.</p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="group px-6 py-3 bg-indigo-600 text-white text-sm font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            Create Advanced Flow
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
           <div className="relative flex-1 max-w-md group">
              <input
                placeholder="Search global campaigns..."
                className="w-full bg-white border border-gray-200 rounded-[1.25rem] py-3.5 px-12 text-sm font-medium outline-none shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/30 transition-all"
              />
              <Search size={20} className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
           </div>
           
           <button className="px-5 py-3.5 bg-white border border-gray-100 rounded-2xl text-gray-500 text-sm font-bold flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm group">
              <Filter size={18} className="group-hover:text-indigo-600 transition-colors" />
              <span>Filter Logic</span>
           </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
             <div className="animate-spin w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full" />
             <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Scanning Fleet Status...</p>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] border border-dashed border-gray-200 text-center shadow-sm p-8">
            <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mb-6 rotate-3 shadow-inner">
              <Plus size={48} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Architectures Found</h3>
            <p className="text-gray-500 max-w-md mb-8">
              Start by creating an advanced flow that connects multiple platforms and AI agents into a single powerful sequence.
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-8 py-3.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 transition-all shadow-sm flex items-center gap-2"
            >
              <Plus size={20} />
              Launch Initial Flow
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {campaigns.map((campaign) => (
              <Link 
                href={`/campaign-builder/${campaign._id}`} 
                key={campaign._id}
                className="bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group overflow-hidden flex flex-col relative"
              >
                <div className="p-8 pb-6 flex-1">
                  <div className="flex justify-between items-start mb-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 group-hover:scale-110 ${
                      campaign.status === 'Running' ? 'bg-green-500 text-white animate-pulse' : 'bg-gray-900 text-white'
                    }`}>
                      {campaign.status === 'Running' ? <PlayCircle size={28} /> : <Zap size={28} />}
                    </div>
                    <button
                      onClick={(e) => handleDelete(e, campaign._id)}
                      className="text-gray-300 hover:text-red-500 transition-all p-3 hover:bg-red-50 rounded-xl opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                  <h3 className="font-black text-xl text-gray-900 mb-2 tracking-tight group-hover:text-indigo-600 transition-colors">{campaign.name}</h3>
                  
                  <div className="flex items-center gap-3 mb-6">
                    <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border tracking-widest ${
                      campaign.status === 'Running' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-gray-100 text-gray-600 border-gray-200'
                    }`}>
                      {campaign.status}
                    </span>
                    <span className="text-[10px] font-black uppercase text-indigo-500 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full tracking-widest">
                       {campaign.platform === 'multi-channel' ? 'Cross-Platform' : campaign.platform}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 p-4 bg-gray-50 rounded-[1.5rem] border border-gray-100 group-hover:bg-white group-hover:border-indigo-100 transition-all">
                    <div className="text-center">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Delivered</p>
                      <p className="font-black text-gray-900 text-lg">{campaign.stats?.sent || 0}</p>
                    </div>
                    <div className="text-center border-l border-gray-200">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Engaged</p>
                      <p className="font-black text-gray-900 text-lg">{campaign.stats?.opened || 0}</p>
                    </div>
                    <div className="text-center border-l border-gray-200">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Target</p>
                      <p className="font-black text-gray-900 text-lg">{campaign.stats?.replied || 0}</p>
                    </div>
                  </div>
                </div>
                
                <div className="px-8 py-5 bg-gray-50/50 border-t border-gray-50 flex justify-between items-center group-hover:bg-white transition-colors">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Last Access: {new Date(campaign.updatedAt).toLocaleDateString()}</span>
                  <span className="text-xs font-black text-indigo-600 flex items-center gap-2 group-hover:gap-3 transition-all">
                    System Hub <ExternalLink size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-xl flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md p-10 border border-white/20 animate-in zoom-in-95 duration-300">
            <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Initialize Flow</h2>
            <p className="text-gray-500 font-bold text-sm mb-8">Define your master orchestration identifier.</p>
            
            <form onSubmit={handleCreateCampaign} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Flow Identifier</label>
                <input
                  type="text"
                  value={newCampaignName}
                  onChange={(e) => setNewCampaignName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/30 focus:bg-white transition-all font-bold text-gray-900 placeholder-gray-300 shadow-sm"
                  placeholder="e.g., Q1 Hyper-Growth Matrix"
                  autoFocus
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 py-4 bg-gray-50 text-gray-500 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200"
                >
                  Abort
                </button>
                <button
                  type="submit"
                  disabled={!newCampaignName}
                  className="flex-[2] py-4 bg-[#6F3FF5] text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-[#5c2cd9] shadow-xl shadow-purple-200 transition-all disabled:opacity-50 active:scale-95"
                >
                  Construct Architecture
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
