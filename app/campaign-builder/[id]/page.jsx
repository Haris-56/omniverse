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
  Settings,
  ChevronLeft,
  Cpu,
  Database,
  Globe,
  ZapOff,
  Hexagon,
  ChevronRight,
  Plus
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
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#FCF8FE] space-y-12">
       <div className="relative">
          <div className="animate-spin w-24 h-24 border-[5px] border-[#8245EF]/10 border-t-[#8245EF] rounded-full shadow-sm" />
          <div className="absolute inset-0 flex items-center justify-center">
             <Cpu size={32} className="text-[#8245EF] animate-pulse" />
          </div>
       </div>
       <p className="text-[#94a3b8] font-black uppercase tracking-[0.5em] text-[11px] font-mono italic">Retrieving_Node_Metadata...</p>
    </div>
  );
  
  if (!campaign) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#FCF8FE] p-8 text-center overscroll-contain">
       <div className="w-32 h-32 bg-white text-rose-500 rounded-[3.5rem] flex items-center justify-center mb-10 shadow-lg border border-[#8245EF]/10 rotate-3">
          <ZapOff size={64} />
       </div>
       <h2 className="text-5xl font-black text-[#161932] mb-6 tracking-tighter uppercase leading-none">Logical_Grid_Null</h2>
       <p className="text-[#64748b] max-w-sm mb-16 font-bold text-xl leading-relaxed italic">The requested sequence identifier does not exist within the current sector telemetry.</p>
       <Link href="/campaign-builder" className="px-14 py-7 bg-white border border-[#8245EF]/20 text-[#94a3b8] font-black text-[11px] uppercase tracking-[0.4em] rounded-2xl hover:bg-[#FCF8FE] transition-all shadow-md font-mono active:scale-95">
          Return to Hub_Protocol
       </Link>
    </div>
  );

  return (
    <div className="w-full min-h-screen animate-in fade-in duration-1000 font-sans pb-32">
      
        {/* Header Sector */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 border-b border-[#8245EF]/15 pb-12 mb-20">
          <div className="flex items-center gap-10">
            <Link href="/campaign-builder" className="p-5 bg-white border border-[#8245EF]/20 rounded-2xl shadow-sm hover:border-[#8245EF]/40 transition-all text-[#94a3b8] hover:text-[#8245EF] active:scale-90 group">
              <ChevronLeft size={32} className="group-hover:-translate-x-1 transition-transform" />
            </Link>
            <div>
              <div className="flex items-center gap-5 mb-5 text-center">
                 <span className={`text-[10px] font-black uppercase px-6 py-2.5 rounded-3xl border tracking-[0.3em] font-mono shadow-sm leading-none ${
                    campaign.status === 'Running' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-[#FCF8FE] text-[#94a3b8] border-[#8245EF]/10'
                 }`}>
                    LOG_STATE::{campaign.status.toUpperCase()}
                 </span>
                 <span className="text-[10px] font-black uppercase text-[#8245EF] bg-[#8245EF]/10 border border-[#8245EF]/20 px-6 py-2.5 rounded-3xl tracking-[0.3em] font-mono shadow-inner leading-none">
                    {campaign.platform === 'multi-channel' ? 'UNIFIED_ORBITAL' : `${campaign.platform}_SOLO`}
                 </span>
              </div>
              <h1 className="text-6xl font-black text-[#161932] tracking-tighter uppercase leading-none">{campaign.name}</h1>
              <p className="text-[#94a3b8] font-black text-[10px] tracking-[0.4em] font-mono mt-4 opacity-80 italic uppercase">Sequence_UID: {id.slice(-12).toUpperCase()}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <button 
              onClick={toggleStatus}
              className={`flex-1 lg:flex-none px-12 py-6 rounded-[1.75rem] text-[11px] font-black uppercase tracking-[0.5em] transition-all shadow-[0_20px_40px_rgba(0,0,0,0.05)] flex items-center justify-center gap-5 active:scale-95 border font-mono ${
                 campaign.status === 'Running' 
                 ? 'bg-rose-50 text-rose-500 border-rose-200 hover:bg-rose-100 shadow-rose-500/10' 
                 : 'bg-[#8245EF] text-white border-white/10 hover:bg-[#6d28d9] shadow-[0_20px_40px_rgba(130, 69, 239,0.3)]'
              }`}
            >
              {campaign.status === 'Running' ? <Pause size={24} /> : <Play size={24} />}
              <span>{campaign.status === 'Running' ? 'Terminate_Stream' : 'Initiate_Flow'}</span>
            </button>
            <Link 
              href={`/campaign-builder/${id}/edit`}
              className="flex-1 lg:flex-none px-12 py-6 bg-white text-[#161932] text-[11px] font-black uppercase tracking-[0.5em] rounded-[1.75rem] hover:bg-[#FCF8FE] transition-all shadow-md flex items-center justify-center gap-5 border border-[#8245EF]/15 font-mono active:scale-95 hover:border-[#8245EF]/40"
            >
              <Edit2 size={24} className="text-[#8245EF]" />
              <span>Modify_Matrix</span>
            </Link>
          </div>
        </div>

        {/* Stats Grid Sector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-24">
          {[
            { label: "Throughput", value: campaign.stats?.sent || 0, icon: <Database size={32} />, accent: "#10B981", trend: "+14.2%" },
            { label: "Intelligence", value: campaign.stats?.opened || 0, icon: <Cpu size={32} />, accent: "#3B82F6", trend: "05.1%" },
            { label: "Resonance", value: campaign.stats?.replied || 0, icon: <Activity size={32} />, accent: "#8245EF", trend: "+2.4%" },
            { label: "Conversions", value: campaign.stats?.converted || 0, icon: <Target size={32} />, accent: "#F59E0B", trend: "Stable" }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white rounded-[3.5rem] border border-[#8245EF]/10 p-12 group relative overflow-hidden transition-all duration-700 hover:shadow-[0_45px_90px_rgba(130, 69, 239,0.06)] hover:-translate-y-3">
              <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full blur-[60px] opacity-0 group-hover:opacity-10 transition-opacity duration-1000" style={{ backgroundColor: stat.accent }} />
              
              <div className="flex items-center justify-between mb-12 relative z-10">
                 <div className="p-6 rounded-[2rem] bg-[#FCF8FE] text-[#8245EF] border border-[#8245EF]/10 transition-all duration-700 group-hover:scale-110 group-hover:rotate-6 shadow-inner group-hover:border-[#8245EF]/30">
                    {stat.icon}
                 </div>
                 <div className="px-5 py-2.5 bg-[#FCF8FE] rounded-2xl text-[10px] font-black uppercase text-[#94a3b8] tracking-[0.3em] font-mono border border-[#8245EF]/10 group-hover:bg-white transition-colors leading-none shadow-sm">
                    {stat.trend}
                 </div>
              </div>

              <div className="relative z-10">
                 <p className="text-[11px] font-black text-[#94a3b8] uppercase tracking-[0.5em] mb-4 font-mono italic">{stat.label}</p>
                 <h2 className="text-5xl font-black text-[#161932] tracking-tighter leading-none">{stat.value}</h2>
              </div>
              
              <div className="mt-12 w-full h-1.5 bg-[#FCF8FE] rounded-full overflow-hidden relative z-10 shadow-inner">
                 <div className="h-full rounded-full transition-all duration-1000 group-hover:shadow-[0_0_15px_rgba(130, 69, 239,0.4)]" style={{ width: '65%', backgroundColor: stat.accent }} />
              </div>

              <div className="absolute inset-0 opacity-[0.015] pointer-events-none group-hover:opacity-[0.03] transition-opacity bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            </div>
          ))}
        </div>

        {/* Detailed Analytics Sector */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
           <div className="lg:col-span-2 space-y-16">
              <div className="bg-white rounded-[4.5rem] border border-[#8245EF]/10 overflow-hidden flex flex-col min-h-[550px] shadow-sm relative group">
                 <div className="p-12 border-b border-[#8245EF]/10 flex items-center justify-between bg-[#FCF8FE]/30 relative z-10">
                    <div className="flex items-center gap-6">
                       <div className="w-14 h-14 bg-[#8245EF]/10 rounded-2xl flex items-center justify-center border border-[#8245EF]/20 shadow-sm">
                          <Activity size={28} className="text-[#8245EF]" />
                       </div>
                       <div>
                          <h3 className="text-2xl font-black text-[#161932] tracking-tight uppercase leading-none">Terminal_Logs</h3>
                          <p className="text-[10px] text-[#94a3b8] font-black uppercase tracking-[0.4em] font-mono mt-3 italic leading-none">Real-time Telemetry Data Stream</p>
                       </div>
                    </div>
                    <button className="px-8 py-3 bg-white rounded-2xl text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.3em] hover:text-[#8245EF] transition-all font-mono border border-[#8245EF]/10 shadow-sm active:scale-95">Export_Hex</button>
                 </div>
                 
                 <div className="flex-1 flex flex-col items-center justify-center p-24 text-center relative z-10">
                    <div className="w-28 h-28 bg-[#FCF8FE] text-[#94a3b8]/40 rounded-[3rem] flex items-center justify-center mb-12 border border-[#8245EF]/10 shadow-inner group-hover:rotate-12 transition-transform duration-1000">
                       <Database size={56} />
                    </div>
                    <h4 className="text-2xl font-black text-[#94a3b8] uppercase tracking-[0.2em] font-mono italic">Stream_Synchronizing...</h4>
                    <p className="text-[#64748b] font-bold italic text-base mt-6 max-w-sm leading-relaxed opacity-60">Awaiting next orbital pass for live sequence synchronization.</p>
                 </div>

                 <div className="absolute inset-0 opacity-[0.015] pointer-events-none group-hover:opacity-[0.03] transition-opacity bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
              </div>
           </div>

           <div className="space-y-16">
              <div className="bg-white rounded-[4rem] p-14 text-[#161932] relative overflow-hidden group border border-[#8245EF]/15 shadow-lg">
                 <div className="absolute top-[-20%] right-[-20%] w-[120%] h-[80%] bg-[#8245EF]/[0.05] blur-[130px] rounded-full group-hover:scale-125 transition-transform duration-1000" />
                 <div className="absolute bottom-[-10%] left-[-10%] w-[80%] h-[60%] bg-[#8245EF]/[0.05] blur-[100px] rounded-full group-hover:scale-125 transition-transform duration-1000" />
                 
                 <div className="flex items-center gap-6 mb-12 relative z-10">
                    <div className="w-16 h-16 bg-[#FCF8FE] border border-[#8245EF]/15 rounded-[1.75rem] flex items-center justify-center shadow-inner group-hover:rotate-12 transition-all duration-700">
                       <ShieldCheck size={36} className="text-emerald-500" />
                    </div>
                    <div>
                       <h3 className="text-3xl font-black tracking-tighter uppercase leading-none text-[#161932]">Integrity</h3>
                       <p className="text-[#94a3b8] text-[10px] font-black font-mono tracking-widest uppercase mt-3 italic leading-none">System Operational Status</p>
                    </div>
                 </div>
                 
                 <p className="text-[#64748b] text-base font-bold mb-14 relative z-10 leading-relaxed italic opacity-80 group-hover:opacity-100 transition-opacity">Your multi-channel orchestration node is performing at peak efficiency across all assigned sectors with zero entropy detected.</p>
                 
                 <div className="space-y-6 relative z-10">
                    {[
                      { l: "Uptime_Rate", v: "99.99%", i: <ShieldCheck size={20} />, c: "text-emerald-500" },
                      { l: "Stream_Latency", v: "15ms", i: <Zap size={20} />, c: "text-amber-500" },
                      { l: "Node_Precision", v: "98.2%", i: <Target size={20} />, c: "text-[#8245EF]" }
                    ].map((row, i) => (
                      <div key={i} className="flex items-center justify-between p-7 bg-[#FCF8FE]/50 rounded-[2.5rem] border border-[#8245EF]/10 group-hover:bg-white group-hover:border-[#8245EF]/30 transition-all shadow-inner">
                         <div className="flex items-center gap-5">
                            <div className={row.c}>{row.i}</div>
                            <span className="text-[11px] font-black text-[#94a3b8] uppercase tracking-widest font-mono italic leading-none">{row.l}</span>
                         </div>
                         <span className="font-black text-2xl text-[#161932] font-mono tracking-tighter leading-none">{row.v}</span>
                      </div>
                    ))}
                 </div>
                 
                 <button className="w-full mt-14 py-7 bg-[#8245EF] text-white font-black text-[11px] uppercase tracking-[0.5em] rounded-[2rem] shadow-[0_25px_50px_rgba(130, 69, 239,0.3)] hover:bg-[#6d28d9] transition-all active:scale-95 font-mono border border-white/10 group-hover:shadow-[0_35px_70px_rgba(130, 69, 239,0.4)]">
                    Generate_Sector_Report
                 </button>
              </div>

              <div className="bg-white rounded-[3.5rem] p-12 border border-[#8245EF]/10 shadow-sm group hover:shadow-lg transition-all duration-700 relative overflow-hidden">
                 <div className="flex items-center gap-6 mb-12 relative z-10">
                    <div className="p-5 bg-[#FCF8FE] border border-[#8245EF]/10 text-[#94a3b8] rounded-2xl shadow-inner group-hover:text-[#8245EF] transition-colors group-hover:rotate-6">
                       <Settings size={26} />
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-[#161932] uppercase tracking-tighter leading-none">Architecture</h3>
                       <p className="text-[10px] text-[#94a3b8] font-black uppercase tracking-[0.3em] font-mono mt-3 italic leading-none">Control Subsystems</p>
                    </div>
                 </div>

                 <div className="space-y-8 relative z-10">
                    <div className="flex justify-between items-center text-[11px] border-b border-[#FCF8FE] pb-4">
                       <span className="text-[#94a3b8] font-black uppercase tracking-widest font-mono italic">Platform_Matrix</span>
                       <span className="font-black text-[#8245EF] font-mono tracking-widest uppercase">{campaign.platform === 'multi-channel' ? 'Unified_Orbital' : `${campaign.platform}_Solo`}</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] border-b border-[#FCF8FE] pb-4">
                       <span className="text-[#94a3b8] font-black uppercase tracking-widest font-mono italic">Inducted_Date</span>
                       <span className="font-black text-[#161932] font-mono tracking-widest uppercase">{new Date(campaign.createdAt).toLocaleDateString().replace(/\//g, '.')}</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] border-b border-[#FCF8FE] pb-4">
                       <span className="text-[#94a3b8] font-black uppercase tracking-widest font-mono italic">Node_Origin_ID</span>
                       <span className="font-black text-[#94a3b8] font-mono tracking-widest uppercase truncate max-w-[140px]">{id.toUpperCase()}</span>
                    </div>
                 </div>

                 <button className="w-full mt-10 py-5 bg-[#FCF8FE] border border-[#8245EF]/10 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.4em] text-[#94a3b8] hover:text-[#8245EF] hover:bg-white transition-all font-mono active:scale-95 shadow-sm">
                    Audit_Subsystem
                 </button>

                 <div className="absolute inset-0 opacity-[0.01] pointer-events-none group-hover:opacity-[0.02] transition-opacity bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
              </div>
           </div>
        </div>

       {/* Global Branding Watermark */}
       <div className="fixed bottom-10 right-10 pointer-events-none opacity-[0.03] select-none z-[-1] grayscale">
         <div className="flex flex-col items-end gap-10">
            <h1 className="text-[14rem] font-black font-sans tracking-tighter uppercase leading-none text-[#8245EF]">SEQUENCE</h1>
            <div className="flex items-center gap-10">
               <Hexagon size={80} strokeWidth={2} className="text-[#8245EF]" />
               <p className="text-4xl font-black uppercase tracking-[1em] text-[#8245EF] font-mono">DYNAMIC_NODE</p>
            </div>
         </div>
      </div>
      
    </div>
  );
}
