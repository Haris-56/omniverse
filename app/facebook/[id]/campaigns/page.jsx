"use client";

import { useState, useEffect, use } from "react";
import { 
  Search, 
  Plus, 
  Facebook, 
  LayoutGrid, 
  List, 
  MoreVertical, 
  Play, 
  Pause, 
  ChevronLeft, 
  Trash2,
  Filter,
  Activity,
  Zap,
  Clock,
  ExternalLink,
  Target,
  Hexagon
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AccountCampaignsPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const accountId = params.id;
  const router = useRouter();

  const [campaigns, setCampaigns] = useState([]);
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("list"); // 'grid' | 'list'

  useEffect(() => {
    fetchAccountDetails();
    fetchCampaigns();
  }, [accountId]);

  const fetchAccountDetails = async () => {
    try {
      const res = await fetch(`/api/facebook/accounts/${accountId}`);
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
      const res = await fetch(`/api/facebook/campaigns?accountId=${accountId}`);
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
      const res = await fetch("/api/facebook/campaigns", {
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
    if (!confirm("Are you sure you want to delete this campaign?")) return;
    try {
      const res = await fetch(`/api/facebook/campaigns?id=${id}`, {
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
    <div className="w-full animate-in fade-in slide-in-from-bottom-6 duration-1000 font-sans pb-32">
      <div className="max-w-[1600px] mx-auto space-y-16">
        
        {/* Navigation & Breadcrumbs */}
        <div className="flex items-center gap-6">
          <Link href="/facebook" className="p-4 bg-white border border-[#B78D7D]/10 rounded-2xl text-[#B2AAA6] hover:text-[#B78D7D] transition-all shadow-sm hover:bg-[#F8F4F2] group">
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] font-mono text-[#B2AAA6]">
             <Link href="/facebook" className="hover:text-[#B78D7D] transition-colors">Social_Infrastructure</Link>
             <span className="opacity-20">/</span>
             <span className="text-[#B78D7D]">Outreach_Sequences</span>
          </div>
        </div>

        {/* Header Sector */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 border-b border-[#B78D7D]/10 pb-12">
          <div>
            <div className="flex items-center gap-4 mb-6">
               <div className="w-14 h-14 bg-[#B78D7D]/10 rounded-2xl flex items-center justify-center text-[#B78D7D] border border-[#B78D7D]/20 shadow-sm">
                  <Facebook size={28} fill="currentColor" />
               </div>
               <span className="px-5 py-2 bg-[#B78D7D]/10 text-[#B78D7D] text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-[#B78D7D]/20 flex items-center gap-2 font-mono">
                 <Target size={14} className="animate-pulse" />
                 Facebook_Status::Linked
               </span>
            </div>
            <h1 className="text-5xl font-black text-[#3E3A39] tracking-tighter uppercase leading-tight">
               {account?.email || "Unknown_Handler"}
            </h1>
            <p className="text-[#8E7A70] mt-4 text-xl font-medium">Overseeing {campaigns.length} autonomous outreach sequences on this node.</p>
          </div>
          
          <div className="flex items-center gap-6">
             <div className="hidden md:flex items-center bg-white border border-[#B78D7D]/10 p-2 rounded-[1.5rem] shadow-sm">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-3 rounded-xl transition-all ${viewMode === "grid" ? "bg-[#B78D7D] text-white shadow-lg" : "text-[#B2AAA6] hover:text-[#B78D7D]"}`}
                >
                  <LayoutGrid size={20} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-3 rounded-xl transition-all ${viewMode === "list" ? "bg-[#B78D7D] text-white shadow-lg" : "text-[#B2AAA6] hover:text-[#B78D7D]"}`}
                >
                  <List size={20} />
                </button>
             </div>
             <button
                onClick={() => router.push(`/facebook/${accountId}/campaigns/new`)}
                className="px-12 py-6 bg-[#B78D7D] text-white font-black text-[11px] uppercase tracking-[0.5em] rounded-[2rem] transition-all shadow-[0_20px_40px_rgba(183,141,125,0.3)] flex items-center justify-center gap-4 active:scale-95 font-mono border border-white/10 hover:bg-[#A37B6D]"
              >
                <Plus size={22} />
                Initialize_Sequence
              </button>
          </div>
        </div>

        {/* Global Search Matrix */}
        <div className="bg-white p-10 rounded-[3.5rem] border border-[#B78D7D]/10 shadow-sm relative overflow-hidden group">
          <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#B78D7D]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <div className="relative z-10 flex flex-col md:flex-row gap-8">
            <div className="flex-1 relative">
              <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-[#B2AAA6]" size={24} />
              <input
                type="text"
                placeholder="Locate sequence by designation or signature..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-20 pr-8 py-6 bg-[#F8F4F2]/50 border border-[#B78D7D]/10 rounded-[2.25rem] text-sm font-black text-[#3E3A39] outline-none focus:border-[#B78D7D] transition-all shadow-inner font-mono tracking-widest uppercase"
              />
            </div>
            <button className="px-12 py-5 bg-white border border-[#B78D7D]/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-[#8E7A70] flex items-center justify-center gap-4 hover:text-[#B78D7D] hover:bg-[#F8F4F2] transition-all font-mono">
              <Filter size={18} /> Protocol_Filter
            </button>
          </div>
        </div>

        {loading && campaigns.length === 0 ? (
           <div className="py-48 flex flex-col items-center justify-center space-y-10 animate-pulse text-center">
              <div className="w-20 h-20 border-4 border-[#B78D7D]/10 border-t-[#B78D7D] rounded-full animate-spin shadow-sm" />
              <p className="text-[10px] font-black text-[#B2AAA6] uppercase tracking-[0.5em] font-mono">Reading_History_Matrix...</p>
           </div>
        ) : campaigns.length === 0 ? (
          <div className="bg-white rounded-[4rem] border border-dashed border-[#B78D7D]/30 py-32 flex flex-col items-center text-center px-10 shadow-sm p-20 max-w-4xl mx-auto relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#B78D7D]/5 to-transparent opacity-50" />
            <div className="relative w-36 h-36 bg-[#F8F4F2] text-[#B78D7D] rounded-[3.5rem] flex items-center justify-center mb-12 rotate-3 shadow-lg group-hover:rotate-0 transition-all duration-700 border border-[#B78D7D]/10">
               <Activity size={72} strokeWidth={1} className="opacity-40" />
            </div>
            <h3 className="text-5xl font-black text-[#3E3A39] tracking-tighter uppercase mb-6 leading-tight relative z-10">Null_Sequence_Cache</h3>
            <p className="text-[#8E7A70] text-xl font-medium max-w-lg mb-16 leading-relaxed relative z-10">
              No autonomous sequences detected for this handler node. Initialize your first Facebook outreach protocol.
            </p>
            <button
              onClick={() => router.push(`/facebook/${accountId}/campaigns/new`)}
              className="px-14 py-6 bg-white border border-[#B78D7D]/20 text-[#B78D7D] text-[11px] font-black uppercase tracking-[0.4em] rounded-[1.75rem] hover:bg-[#B78D7D] hover:text-white transition-all shadow-md font-mono active:scale-95 relative z-10"
            >
              Start_Inception
            </button>
          </div>
        ) : viewMode === "list" ? (
          /* List Matrix (Premium Terminal) */
          <div className="bg-white rounded-[4rem] border border-[#B78D7D]/10 overflow-hidden shadow-sm relative">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left">
                <thead className="bg-[#F8F4F2]/50 text-[10px] font-black uppercase text-[#B2AAA6] tracking-[0.4em] font-mono border-b border-[#B78D7D]/10">
                  <tr>
                    <th className="p-10 pl-14">Sequence_Designation</th>
                    <th className="p-10">Operational_Status</th>
                    <th className="p-10">Sent / Leads</th>
                    <th className="p-10">Time_Anchor</th>
                    <th className="p-10 pr-14 text-right">Ops</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#B78D7D]/5">
                  {filteredCampaigns.map((camp, idx) => (
                    <tr key={camp._id} className="group hover:bg-[#F8F4F2]/30 transition-all cursor-default">
                      <td className="p-10 pl-14 relative">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#B78D7D] opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex items-center gap-8">
                           <div className="w-16 h-16 bg-[#F8F4F2] border border-[#B78D7D]/10 rounded-[1.5rem] flex items-center justify-center text-[#B2AAA6] font-black text-xl group-hover:bg-[#B78D7D] group-hover:text-white transition-all shadow-inner font-mono">
                              {(idx + 1).toString().padStart(2, '0')}
                           </div>
                           <div>
                              <p className="text-xl font-black text-[#3E3A39] tracking-tighter uppercase leading-none">{camp.name}</p>
                              <p className="text-[10px] font-black text-[#B2AAA6] uppercase tracking-[0.3em] font-mono mt-3 italic">UID:: {camp._id.toString().slice(-12).toUpperCase()}</p>
                           </div>
                        </div>
                      </td>
                      <td className="p-10">
                         <div className={`inline-flex items-center gap-4 px-6 py-2.5 rounded-full border font-mono tracking-widest uppercase text-[10px] font-black transition-all ${camp.status === 'Active' ? 'bg-[#B78D7D]/10 border-[#B78D7D]/20 text-[#B78D7D]' : 'bg-[#B2AAA6]/5 border-[#B2AAA6]/10 text-[#B2AAA6]'}`}>
                            <div className={`w-2 h-2 rounded-full ${camp.status === 'Active' ? 'bg-[#B78D7D] animate-pulse shadow-[0_0_10px_rgba(183,141,125,0.6)]' : 'bg-[#B2AAA6]'}`} />
                            {camp.status}
                         </div>
                      </td>
                      <td className="p-10">
                         <div className="flex items-center gap-5">
                            <span className="text-3xl font-black text-[#3E3A39] tracking-tighter font-sans">{camp.sentCount || 0}</span>
                            <span className="text-[10px] font-black text-[#B2AAA6] uppercase tracking-[0.3em] font-mono">Success_Nodes</span>
                         </div>
                      </td>
                      <td className="p-10">
                         <div className="flex items-center gap-4 text-[#B2AAA6] font-mono tracking-widest text-[10px] font-black">
                            <Clock size={16} className="opacity-60" />
                            {camp.timezone || 'UTC_GRID'}
                         </div>
                      </td>
                      <td className="p-10 pr-14 text-right">
                         <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500">
                            <button 
                              onClick={() => handleToggleStatus(camp._id, camp.status)}
                              className={`p-4 rounded-xl border transition-all active:scale-90 ${camp.status === 'Active' ? 'bg-[#B78D7D]/10 border-[#B78D7D]/20 text-[#B78D7D] hover:bg-[#B78D7D] hover:text-white shadow-sm' : 'bg-[#B78D7D]/5 border-[#B78D7D]/10 text-[#B78D7D] hover:bg-[#B78D7D] hover:text-white shadow-sm'}`}
                            >
                              {camp.status === 'Active' ? <Pause size={20} /> : <Play size={20} />}
                            </button>
                            <button 
                              onClick={() => handleDeleteCampaign(camp._id)}
                              className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all active:scale-90 shadow-sm"
                            >
                               <Trash2 size={20} />
                            </button>
                         </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Texture */}
            <div className="absolute inset-0 opacity-[0.01] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          </div>
        ) : (
          /* Grid Matrix (High-Fidelity Neural Cards) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {filteredCampaigns.map((camp) => (
              <div key={camp._id} className="group bg-white rounded-[3.5rem] border border-[#B78D7D]/10 transition-all duration-700 flex flex-col relative overflow-hidden h-full shadow-sm hover:shadow-[0_40px_80px_rgba(183,141,125,0.08)]">
                <div className={`h-1.5 w-full absolute top-0 left-0 z-20 ${camp.status === 'Active' ? 'bg-[#B78D7D] shadow-[0_2px_15px_rgba(183,141,125,0.4)]' : 'bg-[#B2AAA6]'} transition-all duration-500`} />
                
                <div className="p-12 pb-14 flex-1 flex flex-col relative z-10">
                   <div className="flex justify-between items-start mb-12">
                      <div className="w-16 h-16 bg-[#F8F4F2] border border-[#B78D7D]/10 rounded-[1.75rem] flex items-center justify-center text-[#B2AAA6] group-hover:text-[#B78D7D] group-hover:bg-white transition-all shadow-inner group-hover:scale-110 group-hover:rotate-6 duration-700">
                         <Target size={32} />
                      </div>
                      <div className={`px-5 py-2 rounded-full border text-[10px] font-black uppercase tracking-[0.2em] font-mono transition-all ${camp.status === 'Active' ? 'bg-[#B78D7D]/10 border-[#B78D7D]/20 text-[#B78D7D]' : 'bg-[#B2AAA6]/5 border-[#B2AAA6]/10 text-[#B2AAA6]'}`}>
                         {camp.status}
                      </div>
                   </div>
 
                   <div className="mb-12 flex-1">
                      <h3 className="text-2xl font-black text-[#3E3A39] tracking-tighter uppercase mb-4 leading-tight group-hover:text-[#B78D7D] transition-colors duration-500 line-clamp-1">{camp.name}</h3>
                      <p className="text-sm text-[#8E7A70] font-bold line-clamp-2 leading-relaxed h-10 italic">"{camp.message}"</p>
                   </div>
 
                   <div className="flex items-center justify-between p-8 bg-[#F8F4F2]/50 rounded-[2.5rem] border border-[#B78D7D]/10 mb-12 shadow-inner group-hover:border-[#B78D7D]/20 transition-all">
                      <div>
                         <p className="text-[9px] font-black text-[#B2AAA6] uppercase tracking-[0.3em] font-mono mb-2 leading-none">Resource_Load</p>
                         <p className="text-3xl font-black text-[#3E3A39] tracking-tighter leading-none">{camp.sentCount || 0}</p>
                      </div>
                      <div className="text-right">
                         <p className="text-[9px] font-black text-[#B2AAA6] uppercase tracking-[0.3em] font-mono mb-2 leading-none">Security</p>
                         <span className="text-[10px] font-black text-[#B78D7D] uppercase tracking-widest font-mono">Node_Verified</span>
                      </div>
                   </div>
 
                   <div className="flex items-center gap-4">
                      <button 
                       onClick={() => handleToggleStatus(camp._id, camp.status)}
                       className={`flex-1 flex items-center justify-center gap-3 py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.3em] transition-all font-mono active:scale-95 border ${camp.status === 'Active' ? 'bg-[#B78D7D]/10 border-[#B78D7D]/20 text-[#B78D7D] hover:bg-[#B78D7D] hover:text-white' : 'bg-[#B78D7D]/5 border-[#B78D7D]/10 text-[#B78D7D] hover:bg-[#B78D7D] hover:text-white'}`}
                     >
                       {camp.status === 'Active' ? <Pause size={18} /> : <Play size={18} />}
                       {camp.status === 'Active' ? 'Pause_Core' : 'Start_Sync'}
                     </button>
                     <button 
                        onClick={() => handleDeleteCampaign(camp._id)}
                        className="p-5 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-[1.5rem] hover:bg-rose-500 hover:text-white transition-all active:scale-95 shadow-sm"
                     >
                        <Trash2 size={20} />
                     </button>
                   </div>
                </div>
                {/* Texture */}
                <div className="absolute inset-0 opacity-[0.01] pointer-events-none group-hover:opacity-[0.02] transition-opacity bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
              </div>
            ))}
          </div>
        )}
      </div>
 
      {/* Background Watermark */}
      <div className="fixed bottom-10 right-10 pointer-events-none opacity-[0.03] select-none z-0 hidden lg:block grayscale">
         <div className="flex items-center gap-8">
            <Hexagon size={120} strokeWidth={1} className="text-[#B78D7D]" />
            <h1 className="text-[10rem] font-black font-sans -ml-8 tracking-tighter uppercase whitespace-nowrap text-[#B78D7D]">FACEBOOK</h1>
         </div>
      </div>
    </div>
  );
}
