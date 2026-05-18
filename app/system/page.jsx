"use client";

import { useState, useEffect } from "react";
import { 
  Server, Shield, Globe, Activity, Plus, Trash2, 
  CheckCircle, AlertCircle, RefreshCw, Zap, Database, Cpu, Lock, Network, Key, Hexagon
} from "lucide-react";

export default function SystemAdminPage() {
  const [proxies, setProxies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  // Form
  const [form, setForm] = useState({
    host: "", port: "", protocol: "socks5", 
    username: "", password: "", 
    type: "residential", dailyLimit: 1000
  });

  useEffect(() => {
    fetchProxies();
  }, []);

  const fetchProxies = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/system/proxies");
      if (res.ok) setProxies(await res.json());
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/system/proxies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setShowModal(false);
        setForm({ host: "", port: "", protocol: "socks5", username: "", password: "", type: "residential", dailyLimit: 1000 });
        fetchProxies();
      }
    } catch (e) { alert("Failed"); }
  };

  const removeProxy = async (id) => {
    if(!confirm("Are you sure you want to remove this proxy?")) return;
    await fetch(`/api/system/proxies?id=${id}`, { method: "DELETE" });
    fetchProxies();
  };

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-5 duration-700 font-sans pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 mt-8">
        
        {/* Header Sector */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12 border-b border-[#8245EF]/15 pb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
               <span className="px-4 py-1.5 bg-green-50 text-green-600 text-[10px] font-bold uppercase tracking-widest rounded-full border border-green-100 flex items-center gap-2">
                 <Lock size={14} />
                 Secure Admin
               </span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight leading-none">
              Network <span className="text-[#8245EF]">Overview</span>
            </h1>
            <p className="text-gray-500 mt-4 text-base leading-relaxed max-w-xl font-medium">
              Monitor and manage your network proxies and IP pools here.
            </p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="group px-6 py-3 bg-[#8245EF] text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-[#6d28d9] transition-all shadow-lg flex items-center justify-center gap-3 active:scale-95"
          >
            <Plus size={18} /> 
            <span>Add Proxy</span>
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
           <StatCard icon={Globe} label="Total Proxies" value={proxies.length} sub="Active Nodes" active={true} />
           <StatCard icon={Shield} label="Residential" value={proxies.filter(p => p.type === 'residential').length} sub="Verified" active={true} />
           <StatCard icon={Server} label="Shared Proxies" value={proxies.filter(p => p.type === 'shared').length} sub="Standard" active={true} />
           <StatCard icon={Zap} label="Usage Today" value={proxies.reduce((a,b) => a + (b.usage?.today || 0), 0)} sub="Total Signals" active={true} />
        </div>

        {/* IP Registry Sector */}
        <div className="bg-white border-2 border-[#8245EF]/10 rounded-3xl overflow-hidden shadow-sm relative group">
           <div className="p-6 border-b border-[#8245EF]/10 flex flex-col md:flex-row items-center justify-between bg-[#FCF8FE]/30 gap-6">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-white border border-[#8245EF]/15 rounded-xl flex items-center justify-center text-[#8245EF] shadow-sm group-hover:rotate-12 transition-transform duration-500">
                    <Network size={24} />
                 </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 tracking-tight">Proxies</h2>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Live Monitoring</p>
                  </div>
              </div>
              <div className="flex items-center gap-4">
                 <div className="px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-lg text-xs font-bold text-emerald-600 tracking-wider flex items-center gap-3 uppercase leading-none">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    System Stable
                 </div>
              </div>
           </div>
           
           <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left">
                 <thead className="bg-[#FCF8FE]/50 text-[10px] font-bold uppercase text-[#94a3b8] tracking-wider border-b border-[#8245EF]/10">
                     <tr>
                        <th className="p-6">Endpoint</th>
                        <th className="p-6">Type</th>
                        <th className="p-6">Protocol</th>
                        <th className="p-6">Usage</th>
                        <th className="p-6">Limit</th>
                        <th className="p-6 text-right">Actions</th>
                     </tr>
                 </thead>
                 <tbody className="divide-y divide-[#8245EF]/5 text-sm text-[#5E5A59] relative z-10">
                    {proxies.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-16 text-center text-[#94a3b8] font-bold uppercase tracking-widest opacity-60">
                          No Active Nodes
                        </td>
                      </tr>
                    ) : (
                      proxies.map(p => (
                        <tr key={p._id} className="hover:bg-[#FCF8FE]/30 transition-all group/row duration-300">
                           <td className="p-6 focus:bg-[#161932] flex items-center gap-4">
                              <div className="w-10 h-10 bg-[#FCF8FE] rounded-lg flex items-center justify-center border border-[#8245EF]/15 text-[#94a3b8] group-hover/row:text-[#8245EF] group-hover/row:bg-white transition-all shadow-sm">
                                 <Key size={16} />
                              </div>
                               <div>
                                 <span className="font-bold text-sm text-gray-900">{p.host}</span>
                                 <span className="text-gray-400 text-xs"> : {p.port}</span>
                                 <div className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-widest flex items-center gap-2 leading-none">
                                    {p.auth ? <span className="text-green-600">Secured</span> : <span className="text-rose-600">Open</span>}
                                    <span className="opacity-30">•</span>
                                    <span>ID: {p._id.slice(-6).toUpperCase()}</span>
                                 </div>
                              </div>
                           </td>
                           <td className="p-6">
                               <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border leading-none inline-block ${p.type === 'residential' ? 'bg-[#8245EF] text-white border-[#8245EF]' : 'bg-gray-50 text-gray-500 border-gray-100'}`}>
                                 {p.type === 'residential' ? 'Residential' : 'Shared Data'}
                               </span>
                            </td>
                            <td className="p-6 uppercase text-xs font-bold text-gray-400 tracking-widest">{p.protocol}</td>
                           <td className="p-6">
                              <div className="flex items-center gap-4">
                                 <div className="flex-1 h-2 w-32 bg-[#FCF8FE] rounded-full overflow-hidden border border-[#8245EF]/10">
                                    <div className={`h-full rounded-full transition-all duration-1000 ${p.usage.today > p.limits.daily * 0.8 ? 'bg-rose-500' : 'bg-[#8245EF]'}`} style={{ width: `${Math.min(100, (p.usage.today / p.limits.daily) * 100)}%` }} />
                                 </div>
                                 <span className="text-[11px] font-bold text-[#161932]">{p.usage.today}</span>
                              </div>
                           </td>
                           <td className="p-6 text-xs text-gray-900 font-bold">
                               {p.limits.daily} <span className="text-gray-400 ml-1 opacity-50 uppercase tracking-widest text-[10px]">/Day</span>
                           </td>
                           <td className="p-6 text-right">
                              <button onClick={() => removeProxy(p._id)} className="p-2 bg-[#FCF8FE] rounded-lg text-[#94a3b8] hover:text-rose-500 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-all opacity-0 group-hover/row:opacity-100 active:scale-95 shadow-sm">
                                 <Trash2 size={18} />
                              </button>
                           </td>
                        </tr>
                      ))
                    )}
                 </tbody>
              </table>
           </div>
           
           <div className="absolute inset-0 opacity-[0.015] pointer-events-none group-hover:opacity-[0.03] transition-opacity bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        </div>
      </div>

      {/* Provisioning Modal */}
      {showModal && (
         <div className="fixed inset-0 bg-[#FCF8FE]/80 backdrop-blur-md flex items-center justify-center p-6 z-[9999] animate-in fade-in duration-300 overflow-y-auto">
            <div className="bg-white border border-[#8245EF]/15 rounded-3xl w-full max-w-2xl p-8 shadow-2xl relative overflow-hidden font-sans my-auto">
               <div className="absolute -right-24 -top-24 w-64 h-64 bg-[#8245EF]/[0.05] rounded-full blur-[80px]" />
               
               <div className="flex items-center gap-4 mb-8 relative z-10">
                  <div className="w-12 h-12 bg-[#8245EF] rounded-xl flex items-center justify-center text-white shadow-md shadow-[#8245EF]/20">
                     <Plus size={24} />
                  </div>
                   <div>
                    <h2 className="text-xl font-bold text-gray-900 tracking-tight">Add New Proxy</h2>
                    <p className="text-[10px] font-bold text-[#8245EF] uppercase tracking-widest mt-1.5">New Configuration</p>
                  </div>
               </div>

               <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-2">Proxy Type</label>
                        <select 
                          value={form.type} onChange={e => setForm({...form, type: e.target.value})}
                          className="w-full bg-[#FCF8FE]/50 border border-[#8245EF]/15 rounded-xl px-4 py-3 text-sm font-bold text-[#161932] outline-none focus:border-[#8245EF] focus:bg-white transition-all appearance-none cursor-pointer"
                        >
                           <option value="residential">Residential Proxy</option>
                           <option value="shared">Datacenter / Shared</option>
                        </select>
                     </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-2">Protocol</label>
                        <select 
                          value={form.protocol} onChange={e => setForm({...form, protocol: e.target.value})}
                          className="w-full bg-[#FCF8FE]/50 border border-[#8245EF]/15 rounded-xl px-4 py-3 text-sm font-bold text-[#161932] outline-none focus:border-[#8245EF] focus:bg-white transition-all appearance-none cursor-pointer uppercase"
                        >
                           <option value="socks5">SOCKS5</option>
                           <option value="http">HTTP/HTTPS</option>
                        </select>
                     </div>
                  </div>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="md:col-span-3 space-y-2">
                         <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-2">Host Address</label>
                         <input required placeholder="192.168.1.1" value={form.host} onChange={e => setForm({...form, host: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 outline-none focus:border-[#8245EF]/40 focus:bg-white transition-all" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-2">Port</label>
                         <input required placeholder="1080" value={form.port} onChange={e => setForm({...form, port: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 outline-none focus:border-[#8245EF]/40 focus:bg-white transition-all" />
                      </div>
                  </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-2">Username (Optional)</label>
                         <input value={form.username} onChange={e => setForm({...form, username: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 outline-none focus:border-[#8245EF]/40 focus:bg-white transition-all" placeholder="username" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-2">Password (Optional)</label>
                         <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 outline-none focus:border-[#8245EF]/40 focus:bg-white transition-all" placeholder="••••••••" />
                      </div>
                  </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-2">Daily Limit</label>
                      <input type="number" value={form.dailyLimit} onChange={e => setForm({...form, dailyLimit: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 outline-none focus:border-[#8245EF]/40 focus:bg-white transition-all" />
                   </div>

                   <div className="flex flex-col md:flex-row gap-4 pt-6">
                      <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 bg-white text-gray-400 border border-gray-200 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-rose-50 hover:text-rose-500 transition-all active:scale-95">Cancel</button>
                      <button type="submit" className="flex-[2] py-3 bg-[#8245EF] text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-[#6d28d9] transition-all shadow-lg active:scale-95">Add Proxy</button>
                   </div>
               </form>
            </div>
         </div>
      )}

      {/* Global Branding Watermark Removed to prevent overlap */}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, active }) {
  return (
    <div className="group bg-white rounded-3xl border border-[#8245EF]/15 p-6 relative overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-lg hover:border-[#8245EF]/30">
       <div className="absolute inset-0 bg-[#FCF8FE] opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
       
       <div className="flex items-center gap-4 mb-6 relative z-10">
          <div className="p-3 rounded-xl bg-[#FCF8FE] text-[#8245EF] border border-[#8245EF]/10 transition-all duration-500 shadow-sm group-hover:rotate-6 group-hover:scale-105">
             <Icon size={20} />
          </div>
           <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">{label}</span>
              <p className="text-[10px] font-bold text-[#8245EF] mt-1 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-1 group-hover:translate-y-0 leading-none">{sub}</p>
           </div>
       </div>
       <div className="text-3xl font-bold text-[#161932] tracking-tight relative z-10 leading-none">{value}</div>
       
       <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-[#8245EF]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}
