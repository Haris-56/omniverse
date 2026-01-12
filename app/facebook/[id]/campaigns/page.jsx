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
  Target
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

  if (loading && campaigns.length === 0) return (
     <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50/50 space-y-6">
       <div className="animate-spin w-10 h-10 border-4 border-[#1877F2] border-t-transparent rounded-full" />
       <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-[10px]">Syncing Monitoring Cluster...</p>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-gray-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto">
        
        {/* Breadcrumbs & Navigation */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/facebook" className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-gray-900 transition-all shadow-sm">
            <ChevronLeft size={18} />
          </Link>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
             <Link href="/facebook" className="hover:text-[#1877F2] transition-colors">Nodes</Link>
             <span>/</span>
             <span className="text-gray-900">Campaign Cluster</span>
          </div>
        </div>

        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
               <div className="w-10 h-10 bg-[#1877F2] rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                  <Facebook size={20} fill="currentColor" />
               </div>
               <span className="px-3 py-1 bg-blue-50 text-[#1877F2] text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-100">Orchestration Active</span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight lowercase">
               {account?.email || "Control Panel"}
            </h1>
            <p className="text-gray-500 text-sm font-medium mt-1">Managing {campaigns.length} sequence nodes for this endpoint.</p>
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
                onClick={() => router.push(`/facebook/${accountId}/campaigns/new`)}
                className="flex-1 lg:flex-none px-8 py-4 bg-[#1877F2] text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-[#166fe5] transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3"
              >
                <Plus size={18} />
                Initialize New Sequence
              </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
           <div className="relative flex-1 w-full group">
              <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1877F2] transition-colors" />
              <input
                type="text"
                placeholder="Find sequence identifier..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-white border border-gray-100 rounded-[2rem] text-sm font-bold text-gray-900 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 transition-all shadow-sm group-hover:shadow-md"
              />
           </div>
           <button className="w-full md:w-auto px-6 py-4 bg-white border border-gray-100 rounded-[2rem] text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center justify-center gap-2 hover:bg-gray-50 hover:text-gray-900 transition-all shadow-sm">
              <Filter size={16} /> Filters
           </button>
        </div>

        {campaigns.length === 0 && !loading ? (
          <div className="bg-white rounded-[3rem] border border-dashed border-gray-200 py-32 flex flex-col items-center text-center px-6 shadow-sm">
            <div className="w-24 h-24 bg-blue-50 text-[#1877F2] rounded-[2rem] flex items-center justify-center mb-8 animate-pulse">
              <Activity size={40} />
            </div>
            <h3 className="text-2xl font-black text-gray-900 tracking-tight lowercase mb-3">No clusters found</h3>
            <p className="text-gray-500 text-sm font-medium max-w-sm mb-10 lowercase tracking-tight">
              initialize your first orchestration sequence to begin impacting this node.
            </p>
            <button
              onClick={() => router.push(`/facebook/${accountId}/campaigns/new`)}
              className="px-10 py-5 bg-[#1877F2] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-[#166fe5] transition-all shadow-xl shadow-blue-500/20"
            >
              Start First Orchestration
            </button>
          </div>
        ) : viewMode === "list" ? (
          /* List View (Premium Table) */
          <div className="bg-white rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-left bg-gray-50/50 border-b border-gray-100">
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Sequence Identity</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Protocol Status</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Impact Units</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Temporal Node</th>
                    <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredCampaigns.map((camp, idx) => (
                    <tr key={camp._id} className="group hover:bg-gray-50/30 transition-all duration-300">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-[#1877F2]/40 font-black text-xs group-hover:bg-blue-50 group-hover:text-[#1877F2] transition-all">
                              {idx + 1}
                           </div>
                           <div>
                              <p className="text-sm font-black text-gray-900 lowercase tracking-tight">{camp.name}</p>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5 group-hover:text-blue-500/50 transition-colors">ID: {camp._id.toString().slice(-6)}</p>
                           </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                         <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${camp.status === 'Active' ? 'bg-green-50/50 border-green-100' : 'bg-gray-50 border-gray-100'}`}>
                            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${camp.status === 'Active' ? 'bg-green-500' : 'bg-gray-300'}`} />
                            <span className={`text-[10px] font-black uppercase tracking-widest ${camp.status === 'Active' ? 'text-green-600' : 'text-gray-400'}`}>
                               {camp.status}
                            </span>
                         </div>
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex items-center gap-2">
                            <span className="text-base font-black text-gray-900">{camp.sentCount || 0}</span>
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Delivered</span>
                         </div>
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex items-center gap-2 text-gray-400 group-hover:text-gray-900 transition-colors">
                            <Clock size={12} />
                            <span className="text-[10px] font-black uppercase tracking-widest">UT: {camp.timezone || 'UTC'}</span>
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
                              onClick={() => handleDeleteCampaign(camp._id)}
                              className="p-2.5 bg-red-50 border border-red-100 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
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
              <div key={camp._id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/20 p-8 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500 group">
                <div className="flex justify-between items-start mb-8">
                   <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-[#1877F2]/30 group-hover:bg-blue-50 group-hover:text-[#1877F2] transition-all">
                      <Target size={24} />
                   </div>
                   <div className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${camp.status === 'Active' ? 'bg-green-50/50 border-green-100 text-green-600' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
                      {camp.status}
                   </div>
                </div>

                <div className="mb-8">
                   <h3 className="text-xl font-black text-gray-900 tracking-tight lowercase truncate mb-2">{camp.name}</h3>
                   <p className="text-xs text-gray-500 font-medium line-clamp-2 leading-relaxed h-8">{camp.message}</p>
                </div>

                <div className="flex items-center justify-between p-6 bg-gray-50/50 rounded-3xl border border-gray-50 mb-8">
                   <div>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Impact Units</p>
                      <p className="text-xl font-black text-gray-900">{camp.sentCount || 0}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Node Status</p>
                      <span className="text-xs font-black text-[#1877F2]">Verified</span>
                   </div>
                </div>

                <div className="flex items-center gap-3">
                   <button 
                    onClick={() => handleToggleStatus(camp._id, camp.status)}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${camp.status === 'Active' ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
                  >
                    {camp.status === 'Active' ? <Pause size={14} /> : <Play size={14} />}
                    {camp.status === 'Active' ? 'Pause Node' : 'Initialize Node'}
                  </button>
                  <button 
                     onClick={() => handleDeleteCampaign(camp._id)}
                     className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all"
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
