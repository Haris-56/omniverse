"use client";

import { useState, useEffect, use } from "react";
import { 
  Search, 
  Plus, 
  Instagram, 
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
  Camera,
  Heart,
  Pencil,
  CheckCircle
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function InstagramCampaignsPage({ params: paramsPromise }) {
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
      const res = await fetch(`/api/instagram/accounts/${accountId}`);
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
      const res = await fetch(`/api/instagram/campaigns?accountId=${accountId}`);
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
      const res = await fetch("/api/instagram/campaigns", {
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
      const res = await fetch(`/api/instagram/campaigns?id=${id}`, {
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

  if (loading && campaigns.length === 0) return (
     <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50/50 space-y-6">
       <div className="animate-spin w-10 h-10 border-4 border-[#E1306C] border-t-transparent rounded-full" />
       <p className="text-gray-400 font-medium text-xs uppercase tracking-wide">Loading Campaigns...</p>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-gray-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto">
        
        {/* Breadcrumbs & Navigation */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/instagram" className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-gray-900 transition-all shadow-sm">
            <ChevronLeft size={18} />
          </Link>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
             <Link href="/instagram" className="hover:text-[#E1306C] transition-colors">Instagram</Link>
             <span>/</span>
             <span className="text-gray-900">Campaigns</span>
          </div>
        </div>

        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
               <div className="w-10 h-10 bg-gradient-to-tr from-[#FFB75E] to-[#ED8F03] rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
                  <Camera size={20} />
               </div>
               <span className="px-3 py-1 bg-pink-50 text-[#E1306C] text-xs font-semibold rounded-full border border-pink-100 mb-2 inline-block">Active</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
               {account?.email || "Campaigns"}
            </h1>
            <p className="text-gray-500 text-sm font-medium mt-1">Managing {campaigns.length} campaigns for this account.</p>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="hidden md:flex items-center bg-white border border-gray-100 p-1.5 rounded-2xl shadow-sm">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-xl transition-all ${viewMode === "grid" ? "bg-gray-900 text-white shadow-lg" : "text-gray-400 hover:text-gray-600"}`}
                >
                  <LayoutGrid size={18} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-xl transition-all ${viewMode === "list" ? "bg-gray-900 text-white shadow-lg" : "text-gray-400 hover:text-gray-600"}`}
                >
                  <List size={18} />
                </button>
             </div>
             <button
                onClick={() => router.push(`/instagram/${accountId}/campaigns/new`)}
                className="flex-1 lg:flex-none px-8 py-4 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-xl shadow-pink-500/20 flex items-center justify-center gap-3 hover:opacity-90 active:scale-95"
              >
                <Plus size={18} />
                Create Campaign
              </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
           <div className="relative flex-1 w-full group">
              <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#E1306C] transition-colors" />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-white border border-gray-100 rounded-[2rem] text-sm font-bold text-gray-900 outline-none focus:ring-4 focus:ring-pink-500/5 focus:border-pink-500/20 transition-all shadow-sm group-hover:shadow-md"
              />
           </div>
           <button className="w-full md:w-auto px-6 py-4 bg-white border border-gray-100 rounded-[2rem] text-xs font-bold uppercase tracking-wide text-gray-500 flex items-center justify-center gap-2 hover:bg-gray-50 hover:text-gray-900 transition-all shadow-sm">
              <Filter size={16} /> Filter
           </button>
        </div>

        {campaigns.length === 0 && !loading ? (
          <div className="bg-white rounded-[3rem] border border-dashed border-gray-200 py-32 flex flex-col items-center text-center px-6 shadow-sm">
            <div className="w-24 h-24 bg-pink-50 text-[#E1306C] rounded-[2.5rem] flex items-center justify-center mb-8 animate-pulse shadow-inner">
              <Heart size={40} fill="currentColor" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 tracking-tight lowercase mb-3">No campaigns found</h3>
            <p className="text-gray-500 text-sm font-medium max-w-sm mb-10 lowercase tracking-tight">
              Create your first campaign to get started.
            </p>
            <button
              onClick={() => router.push(`/instagram/${accountId}/campaigns/new`)}
              className="px-10 py-5 bg-gradient-to-r from-[#833AB4] to-[#FD1D1D] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl shadow-pink-500/20 active:scale-95"
            >
              Create Campaign
            </button>
          </div>
        ) : viewMode === "list" ? (
          /* List View (Premium Table) */
          <div className="bg-white rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-left bg-gray-50/50 border-b border-gray-100">
                    <th className="px-8 py-6 text-xs font-bold uppercase tracking-wide text-gray-400">Campaign Name</th>
                    <th className="px-8 py-6 text-xs font-bold uppercase tracking-wide text-gray-400">Status</th>
                    <th className="px-8 py-6 text-xs font-bold uppercase tracking-wide text-gray-400">Sent Count</th>
                    <th className="px-8 py-6 text-xs font-bold uppercase tracking-wide text-gray-400">Timezone</th>
                    <th className="px-8 py-6 text-right text-xs font-bold uppercase tracking-wide text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredCampaigns.map((camp, idx) => (
                    <tr key={camp._id} className="group hover:bg-gray-50/30 transition-all duration-300">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-[#E1306C]/60 font-bold text-xs group-hover:bg-pink-50 group-hover:text-[#E1306C] transition-all">
                              {idx + 1}
                           </div>
                           <div>
                              <p className="text-sm font-bold text-gray-900 tracking-tight">{camp.name}</p>
                              <p className="text-xs font-semibold text-gray-400 mt-0.5 group-hover:text-[#E1306C]/50 transition-colors italic">ID: {camp._id.toString().slice(-4)}</p>
                           </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                         <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${camp.status === 'Active' ? 'bg-pink-50/50 border-pink-100' : 'bg-gray-50 border-gray-100'}`}>
                            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${camp.status === 'Active' ? 'bg-[#E1306C]' : 'bg-gray-300'}`} />
                            <span className={`text-xs font-bold uppercase tracking-wide ${camp.status === 'Active' ? 'text-[#E1306C]' : 'text-gray-400'}`}>
                               {camp.status}
                            </span>
                         </div>
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex items-center gap-2">
                            <span className="text-base font-black text-gray-900">{camp.sentCount || 0}</span>
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">DMs Sent</span>
                         </div>
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex items-center gap-2 text-gray-400 group-hover:text-gray-900 transition-colors lowercase">
                            <Clock size={12} />
                            <span className="text-[10px] font-black uppercase tracking-widest">{camp.timezone || 'UTC'}</span>
                         </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                         <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <button 
                              onClick={() => handleToggleStatus(camp._id, camp.status)}
                              className={`p-2.5 rounded-xl border transition-all ${camp.status === 'Active' ? 'bg-amber-50 border-amber-100 text-amber-500' : 'bg-green-50 border-green-100 text-green-500'}`}
                            >
                              {camp.status === 'Active' ? <Pause size={16} /> : <Play size={16} />}
                            </button>
                            <button
                              onClick={() => router.push(`/instagram/${accountId}/campaigns/${camp._id}/edit`)}
                              className="p-2.5 bg-blue-50 border border-blue-100 text-blue-500 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                            >
                              <Pencil size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteCampaign(camp._id)}
                              className="p-2.5 bg-red-50 border border-red-100 text-red-500 rounded-xl hover:bg-[#E1306C] hover:text-white transition-all shadow-sm hover:shadow-pink-500/20"
                            >
                               <Trash2 size={16} />
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
          /* Grid View (High-Fidelity Cards) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCampaigns.map((camp) => (
              <div key={camp._id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/20 p-8 hover:shadow-2xl hover:shadow-[#E1306C]/5 transition-all duration-500 group">
                <div className="flex justify-between items-start mb-8">
                   <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-[#E1306C]/30 group-hover:bg-pink-50 group-hover:text-[#E1306C] transition-all">
                      <Zap size={24} />
                   </div>
                   <div className={`px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wide ${camp.status === 'Active' ? 'bg-pink-50/50 border-pink-100 text-[#E1306C]' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
                      {camp.status}
                   </div>
                </div>

                <div className="mb-8">
                   <h3 className="text-xl font-bold text-gray-900 tracking-tight truncate mb-2">{camp.name}</h3>
                   <p className="text-xs text-gray-500 font-medium line-clamp-2 leading-relaxed h-8">{camp.message}</p>
                </div>

                <div className="flex items-center justify-between p-6 bg-gray-50/50 rounded-3xl border border-gray-50 mb-8 shadow-inner">
                   <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Sent Count</p>
                      <p className="text-xl font-bold text-gray-900">{camp.sentCount || 0}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Connection</p>
                      <span className="text-xs font-bold text-[#E1306C]">Verified</span>
                   </div>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                      onClick={() => camp.status !== 'Completed' && handleToggleStatus(camp._id, camp.status)}
                      disabled={camp.status === 'Completed'}
                      className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-xs uppercase tracking-wide transition-all ${
                          camp.status === 'Completed' ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none' :
                          camp.status === 'Active' ? 'bg-amber-50 text-amber-600 hover:bg-amber-100 shadow-sm' : 
                          'bg-green-50 text-green-600 hover:bg-green-100 shadow-sm'
                      }`}
                  >
                    {camp.status === 'Completed' ? <CheckCircle size={14} /> : camp.status === 'Active' ? <Pause size={14} /> : <Play size={14} />}
                    {camp.status === 'Completed' ? 'Completed' : camp.status === 'Active' ? 'Pause' : 'Resume'}
                  </button>
                  <button
                     onClick={() => camp.status !== 'Completed' && router.push(`/instagram/${accountId}/campaigns/${camp._id}/edit`)}
                     disabled={camp.status === 'Completed'}
                     className={`p-4 rounded-2xl transition-all ${
                         camp.status === 'Completed' ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none' :
                         'bg-blue-50 text-blue-500 hover:bg-blue-600 hover:text-white shadow-sm'
                     }`}
                  >
                     <Pencil size={16} />
                  </button>
                  <button 
                     onClick={() => handleDeleteCampaign(camp._id)}
                     className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-[#E1306C] hover:text-white transition-all shadow-sm hover:shadow-pink-500/20"
                  >
                     <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
