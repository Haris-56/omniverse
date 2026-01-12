"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Edit2, 
  Play, 
  Pause, 
  BarChart2, 
  Users, 
  Mail, 
  MessageSquare, 
  Zap, 
  Activity, 
  Target, 
  Clock, 
  ShieldCheck,
  TrendingUp,
  Settings
} from "lucide-react";
import { useParams } from "next/navigation";

export default function CampaignDetailsPage() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchCampaign();
  }, [id]);

  const fetchCampaign = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/campaigns/${id}`);
      if (res.ok) {
        const data = await res.json();
        setCampaign(data);
      }
    } catch (error) {
      console.error("Failed to fetch campaign", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async () => {
    if (!campaign) return;
    const newStatus = campaign.status === 'Running' ? 'Paused' : 'Running';
    try {
      const res = await fetch(`/api/campaigns/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...campaign, status: newStatus })
      });
      if (res.ok) {
        setCampaign({ ...campaign, status: newStatus });
      }
    } catch (error) {
      console.error("Failed to toggle status", error);
    }
  };

  if (loading) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#FAFBFF] space-y-4">
       <div className="animate-spin w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full" />
       <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Retrieving Flow Metadata...</p>
    </div>
  );
  
  if (!campaign) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#FAFBFF] p-8 text-center">
       <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-[2rem] flex items-center justify-center mb-6 shadow-inner">
          <Zap size={40} />
       </div>
       <h2 className="text-2xl font-black text-gray-900 mb-2">Node Not Found</h2>
       <p className="text-gray-500 max-w-sm mb-8">The requested campaign identifier does not exist in the current sector.</p>
       <Link href="/campaign-builder" className="px-8 py-3.5 bg-[#6F3FF5] text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl shadow-purple-200 hover:shadow-2xl transition-all">
          Return to Hub
       </Link>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-gray-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-6">
            <Link href="/campaign-builder" className="p-3 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all text-gray-500">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                 <span className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full border tracking-widest ${
                    campaign.status === 'Running' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-gray-100 text-gray-400 border-transparent'
                 }`}>
                    {campaign.status}
                 </span>
                 <span className="text-gray-300">•</span>
                 <span className="text-[9px] font-black uppercase text-indigo-500 tracking-widest">
                    {campaign.platform === 'multi-channel' ? 'Cross-Platform Node' : `${campaign.platform} solo`}
                 </span>
              </div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{campaign.name}</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleStatus}
              className="flex-1 md:flex-none px-6 py-3.5 bg-white border border-gray-200 text-gray-700 text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-gray-50 transition-all shadow-sm flex items-center justify-center gap-2"
            >
              {campaign.status === 'Running' ? <Pause size={18} /> : <Play size={18} />}
              <span>{campaign.status === 'Running' ? 'Halt Flow' : 'Resume Flow'}</span>
            </button>
            <Link 
              href={`/campaign-builder/${id}/edit`}
              className="flex-1 md:flex-none px-6 py-3.5 bg-[#6F3FF5] text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-[#5c2cd9] transition-all shadow-xl shadow-purple-200 flex items-center justify-center gap-2"
            >
              <Edit2 size={18} />
              <span>Modify Architecture</span>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {[
            { label: "Total Dispatched", value: campaign.stats?.sent || 0, icon: <Mail size={22} />, color: "bg-indigo-50 text-indigo-600 border-indigo-100", trend: "+14.2%" },
            { label: "Engagement Hub", value: campaign.stats?.opened || 0, icon: <Activity size={22} />, color: "bg-purple-50 text-purple-600 border-purple-100", trend: "05.1%" },
            { label: "Response Nodes", value: campaign.stats?.replied || 0, icon: <MessageSquare size={22} />, color: "bg-green-50 text-green-600 border-green-100", trend: "+2.4%" },
            { label: "Core Conversions", value: campaign.stats?.converted || 0, icon: <Target size={22} />, color: "bg-amber-50 text-amber-600 border-amber-100", trend: "Stable" }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white p-7 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
              <div className="flex items-center justify-between mb-6">
                 <div className={`p-3.5 rounded-2xl border ${stat.color} group-hover:scale-110 transition-transform`}>
                    {stat.icon}
                 </div>
                 <div className="px-3 py-1 bg-gray-50 rounded-lg text-[10px] font-black uppercase text-gray-400 tracking-widest">
                    {stat.trend}
                 </div>
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">{stat.value}</h2>
              <div className="mt-4 w-full h-1 bg-gray-50 rounded-full overflow-hidden">
                 <div className={`h-full opacity-60 rounded-full ${stat.color.split(' ')[1].replace('text-', 'bg-')}`} style={{ width: '45%' }} />
              </div>
            </div>
          ))}
        </div>

        {/* Action History / Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                 <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                    <div>
                       <h3 className="text-lg font-black text-gray-900 tracking-tight">System Logs</h3>
                       <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Real-time operation history</p>
                    </div>
                    <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">Download Feed</button>
                 </div>
                 <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-3xl flex items-center justify-center mx-auto mb-6">
                       <Clock size={32} />
                    </div>
                    <p className="text-sm font-bold text-gray-400 italic">Synchronizing with live nodes... No recent events detected.</p>
                 </div>
              </div>
           </div>

           <div className="space-y-8">
              <div className="bg-[#6F3FF5] rounded-[2rem] p-8 text-white relative overflow-hidden group">
                 <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[40%] bg-purple-400/30 blur-3xl rounded-full" />
                 <h3 className="text-xl font-black mb-2 relative z-10 tracking-tight">Node Integrity</h3>
                 <p className="text-indigo-200 text-xs font-bold mb-8 relative z-10 leading-relaxed">Your multi-channel orchestration is performing at optimal efficiency.</p>
                 
                 <div className="space-y-5 relative z-10">
                    {[
                      { l: "Uptime", v: "99.99%", i: <ShieldCheck size={16} /> },
                      { l: "Sync Rate", v: "15ms", i: <Zap size={16} /> },
                      { l: "AI Precision", v: "98.2%", i: <Target size={16} /> }
                    ].map((row, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/5 group-hover:border-white/20 transition-all">
                         <div className="flex items-center gap-3">
                            <div className="text-indigo-200">{row.i}</div>
                            <span className="text-[10px] font-black uppercase tracking-widest">{row.l}</span>
                         </div>
                         <span className="font-black text-sm">{row.v}</span>
                      </div>
                    ))}
                 </div>
                 
                 <button className="w-full mt-8 py-4 bg-white text-[#6F3FF5] font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl shadow-purple-900/20 hover:scale-[1.02] transition-all">
                    Generate Sector Report
                 </button>
              </div>

              <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm">
                 <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                       <Settings size={18} />
                    </div>
                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Configuration</h3>
                 </div>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center text-xs">
                       <span className="text-gray-400 font-bold uppercase tracking-widest">Platform Matrix</span>
                       <span className="font-black text-indigo-600">{campaign.platform === 'multi-channel' ? 'Multi-Node' : 'Solo-Node'}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                       <span className="text-gray-400 font-bold uppercase tracking-widest">Initialized</span>
                       <span className="font-black text-gray-900">{new Date(campaign.createdAt).toLocaleDateString()}</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
