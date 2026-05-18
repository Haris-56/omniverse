"use client";

import { useState, useEffect, use } from "react";
import { 
  Search, 
  Plus, 
  Linkedin, 
  LayoutGrid, 
  List, 
  Play, 
  Pause, 
  ChevronLeft, 
  Trash2,
  Filter,
  Activity,
  Zap,
  Clock,
  Target,
  Briefcase,
  UserPlus,
  Shield,
  ShieldCheck,
  Cpu,
  Hexagon,
  Edit3
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LinkedInCampaignsPage({ params: paramsPromise }) {
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
      const res = await fetch(`/api/linkedin/accounts/${accountId}`);
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
      const res = await fetch(`/api/linkedin/campaigns?accountId=${accountId}`);
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
      const res = await fetch("/api/linkedin/campaigns", {
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
      const res = await fetch(`/api/linkedin/campaigns?id=${id}`, {
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
          <Link href="/linkedin" className="p-4 bg-white border border-[#8245EF]/10 rounded-2xl text-[#94a3b8] hover:text-[#8245EF] transition-all shadow-sm hover:bg-[#FCF8FE] group">
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
             <Link href="/linkedin" className="hover:text-[#8245EF] transition-colors">LinkedIn Accounts</Link>
             <span className="opacity-20">/</span>
             <span className="text-[#8245EF]">Campaigns</span>
          </div>
        </div>

        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 border-b border-[#8245EF]/10 pb-12">
          <div>
            <div className="flex items-center gap-4 mb-4">
               <div className="w-12 h-12 bg-[#8245EF]/10 rounded-xl flex items-center justify-center text-[#8245EF] border border-[#8245EF]/20 shadow-sm">
                  <Linkedin size={24} fill="currentColor" />
               </div>
               <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-full border border-green-100 flex items-center gap-2">
                 <ShieldCheck size={14} />
                 Connected
               </span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
               {account?.email || "Account"}
            </h1>
            <p className="text-gray-500 mt-2 text-xl font-medium">Managing {campaigns.length} active outreach campaigns on this account.</p>
          </div>
          
          <div className="flex items-center gap-6">
             <div className="hidden md:flex items-center bg-white border border-[#8245EF]/10 p-2 rounded-[1.5rem] shadow-sm">
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
                onClick={() => router.push(`/linkedin/${accountId}/campaigns/new`)}
                className="px-8 py-4 bg-[#8245EF] text-white font-bold uppercase text-xs tracking-widest rounded-xl transition-all shadow-lg flex items-center justify-center gap-3 active:scale-95 border border-white/10 hover:bg-[#6d28d9]"
              >
                <Plus size={20} />
                New Campaign
              </button>
          </div>
        </div>

        {/* Global Search Matrix */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-16 pr-8 py-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-900 outline-none focus:border-[#8245EF]/40 transition-all placeholder:text-gray-300"
              />
            </div>
            <button className="px-8 py-4 bg-white border border-gray-100 rounded-xl text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center justify-center gap-3 hover:border-gray-200 transition-all">
              <Filter size={16} /> Filter
            </button>
          </div>
        </div>

        {loading ? (
           <div className="py-40 flex flex-col items-center justify-center space-y-4 text-center">
              <div className="w-12 h-12 border-4 border-gray-100 border-t-[#8245EF] rounded-full animate-spin" />
              <p className="text-xs font-bold text-gray-400">Loading campaigns...</p>
           </div>
        ) : campaigns.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-gray-200 py-24 flex flex-col items-center text-center px-10 max-w-2xl mx-auto relative group">
            <div className="w-24 h-24 bg-gray-50 text-gray-300 rounded-3xl flex items-center justify-center mb-8 border border-gray-100 group-hover:scale-105 transition-all duration-500">
               <Briefcase size={40} strokeWidth={1} />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 tracking-tight mb-4">No Campaigns Found</h3>
            <p className="text-gray-500 text-lg font-medium max-w-md mb-12">
              You haven't created any campaigns for this account yet. Start your first outreach campaign now.
            </p>
            <button
              onClick={() => router.push(`/linkedin/${accountId}/campaigns/new`)}
              className="px-10 py-4 bg-[#8245EF] text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-[#6d28d9] transition-all shadow-lg active:scale-95"
            >
              Create Campaign
            </button>
          </div>
        ) : viewMode === "list" ? (
          /* List Matrix (Premium Terminal) */
          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 text-xs font-bold uppercase text-gray-400 tracking-widest border-b border-gray-100">
                  <tr>
                    <th className="p-8 pl-12">Campaign Name</th>
                    <th className="p-8">Status</th>
                    <th className="p-8">Activity</th>
                    <th className="p-8">Timezone</th>
                    <th className="p-8 pr-12 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#8245EF]/5">
                  {filteredCampaigns.map((camp, idx) => (
                    <tr key={camp._id} className="group hover:bg-[#FCF8FE]/30 transition-all cursor-default">
                      <td className="p-8 pl-12">
                        <div className="flex items-center gap-6">
                           <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 font-bold group-hover:bg-[#8245EF] group-hover:text-white transition-all">
                              {(idx + 1).toString().padStart(2, '0')}
                           </div>
                           <div>
                              <p className="text-lg font-bold text-gray-900 group-hover:text-[#8245EF] transition-colors">{camp.name}</p>
                              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">ID: {camp._id.toString().slice(-12).toUpperCase()}</p>
                           </div>
                        </div>
                      </td>
                      <td className="p-8">
                         <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border tracking-widest uppercase text-xs font-bold transition-all ${camp.status === 'Active' ? 'bg-green-50 border-green-100 text-green-600' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${camp.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`} />
                            {camp.status}
                         </div>
                      </td>
                      <td className="p-8">
                         <div className="flex items-center gap-4">
                            <span className="text-2xl font-bold text-gray-900">{camp.sentCount || 0}</span>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Sent</span>
                         </div>
                      </td>
                      <td className="p-8">
                         <div className="flex items-center gap-2 text-gray-400 font-bold tracking-widest text-xs">
                            <Clock size={14} className="opacity-60" />
                            {camp.timezone || 'UTC'}
                         </div>
                      </td>
                      <td className="p-8 pr-12 text-right">
                         <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                            <button 
                               onClick={() => router.push(`/linkedin/${accountId}/campaigns/new?editId=${camp._id}`)}
                               className="p-2 text-[#8245EF] hover:bg-[#8245EF] hover:text-white rounded-lg transition-all"
                               title="Edit Campaign"
                             >
                                <Edit3 size={18} />
                             </button>
                            <button 
                              onClick={() => handleToggleStatus(camp._id, camp.status)}
                              className="p-2 text-[#8245EF] hover:bg-[#8245EF] hover:text-white rounded-lg transition-all"
                            >
                              {camp.status === 'Active' ? <Pause size={18} /> : <Play size={18} />}
                            </button>
                            <button 
                              onClick={() => handleDeleteCampaign(camp._id)}
                              className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
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
            {/* Texture */}
            <div className="absolute inset-0 opacity-[0.01] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          </div>
        ) : (
          /* Grid Matrix (High-Fidelity Neural Cards) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {filteredCampaigns.map((camp) => (
              <div key={camp._id} className="group bg-white rounded-3xl border border-[#8245EF]/10 transition-all duration-700 flex flex-col relative overflow-hidden h-full shadow-sm hover:shadow-xl">
                <div className={`h-1.5 w-full absolute top-0 left-0 z-20 ${camp.status === 'Active' ? 'bg-[#8245EF]' : 'bg-[#94a3b8]'} transition-all duration-500`} />
                
                <div className="p-12 pb-14 flex-1 flex flex-col relative z-10">
                   <div className="flex justify-between items-start mb-12">
                      <div className="w-16 h-16 bg-[#FCF8FE] border border-[#8245EF]/10 rounded-2xl flex items-center justify-center text-[#94a3b8] group-hover:text-[#8245EF] group-hover:bg-white transition-all shadow-inner group-hover:scale-105 duration-700">
                         <Target size={32} />
                      </div>
                      <div className={`px-5 py-2 rounded-full border text-xs font-bold uppercase tracking-widest transition-all ${camp.status === 'Active' ? 'bg-[#8245EF]/10 border-[#8245EF]/20 text-[#8245EF]' : 'bg-[#94a3b8]/5 border-[#94a3b8]/10 text-[#94a3b8]'}`}>
                         {camp.status}
                      </div>
                   </div>
 
                   <div className="mb-12 flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 tracking-tight mb-4 group-hover:text-[#8245EF] transition-colors duration-500 line-clamp-1">{camp.name}</h3>
                      <p className="text-sm text-gray-500 font-medium line-clamp-2 leading-relaxed h-10 italic">"{camp.message}"</p>
                   </div>
 
                   <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-100 mb-8">
                      <div>
                         <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Activity</p>
                         <p className="text-3xl font-bold text-gray-900 tracking-tight">{camp.sentCount || 0}</p>
                      </div>
                      <div className="text-right">
                         <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Weekly Limit</p>
                         <span className="text-xl font-bold text-[#8245EF]">{camp.weeklyLimit || 100}</span>
                      </div>
                   </div>
 
                   <div className="flex items-center gap-3">
                      <button 
                       onClick={() => handleToggleStatus(camp._id, camp.status)}
                       className="flex-1 flex items-center justify-center gap-2 py-4 bg-gray-50 text-gray-500 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#8245EF] hover:text-white transition-all active:scale-95 border border-gray-100"
                     >
                       {camp.status === 'Active' ? <Pause size={16} /> : <Play size={16} />}
                       {camp.status === 'Active' ? 'Pause' : 'Start'}
                     </button>
                      <button 
                         onClick={() => router.push(`/linkedin/${accountId}/campaigns/new?editId=${camp._id}`)}
                         className="p-4 bg-gray-50 text-gray-400 rounded-xl hover:bg-[#8245EF] hover:text-white transition-all active:scale-95 border border-gray-100"
                         title="Edit Campaign"
                      >
                         <Edit3 size={18} />
                      </button>
                     <button 
                        onClick={() => handleDeleteCampaign(camp._id)}
                        className="p-4 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all active:scale-95 border border-rose-100"
                     >
                        <Trash2 size={18} />
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
          <div className="flex items-center gap-6">
             <Hexagon size={80} strokeWidth={1} className="text-[#8245EF]" />
             <h1 className="text-[8rem] font-bold -ml-4 tracking-tighter uppercase whitespace-nowrap text-[#8245EF]">LINKED</h1>
          </div>
      </div>
    </div>
  );
}
