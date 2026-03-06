"use client";

import { useState, useEffect } from "react";
import { 
  Server, Shield, Globe, Activity, Plus, Trash2, 
  CheckCircle, AlertCircle, RefreshCw, Zap
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
    if(!confirm("Remove this node?")) return;
    await fetch(`/api/system/proxies?id=${id}`, { method: "DELETE" });
    fetchProxies();
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-200 p-8 font-sans selection:bg-cyan-500/30">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <Shield className="text-cyan-400" size={32} />
              SYSTEM INFRASTRUCTURE
            </h1>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-2">Network Operations Center • IP Pool Management</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase text-xs tracking-widest px-6 py-4 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/20"
          >
            <Plus size={16} strokeWidth={3} /> Add Node
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-6">
           <StatCard icon={Globe} label="Total IPs" value={proxies.length} sub="Active Nodes" color="text-emerald-400" />
           <StatCard icon={Activity} label="Residential" value={proxies.filter(p => p.type === 'residential').length} sub="High Trust" color="text-purple-400" />
           <StatCard icon={Server} label="Shared Datacenter" value={proxies.filter(p => p.type === 'shared').length} sub="Bulk Ops" color="text-blue-400" />
           <StatCard icon={Zap} label="Load (24h)" value={`${proxies.reduce((a,b) => a + (b.usage?.today || 0), 0)}`} sub="Requests Processed" color="text-yellow-400" />
        </div>

        {/* IP Grid */}
        <div className="bg-[#111625] border border-gray-800 rounded-3xl overflow-hidden">
           <div className="p-6 border-b border-gray-800 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                 <RefreshCw size={18} className="text-gray-500" />
                 Active Proxy Pool
              </h2>
              <span className="text-xs font-mono text-gray-600 bg-gray-900 px-3 py-1 rounded-full">LIVE TELEMETRY</span>
           </div>
           
           {proxies.length === 0 ? (
             <div className="p-12 text-center text-gray-600 font-mono text-sm">NO NODES ONLINE. SYSTEM CRITICAL.</div>
           ) : (
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead className="bg-[#161b2e] text-[10px] font-black uppercase text-gray-500 tracking-widest">
                      <tr>
                         <th className="p-6">Node Endpoint</th>
                         <th className="p-6">Type</th>
                         <th className="p-6">Protocol</th>
                         <th className="p-6">Telemetry (24h)</th>
                         <th className="p-6">Capacity</th>
                         <th className="p-6 text-right">Actions</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-800/50 text-sm font-medium text-gray-400">
                      {proxies.map(p => (
                         <tr key={p._id} className="hover:bg-cyan-900/5 transition-colors group">
                            <td className="p-6 text-gray-200 font-mono">
                               {p.host}:{p.port}
                               <div className="text-[10px] text-gray-600 mt-1 flex items-center gap-1">
                                  {p.auth ? <span className="text-emerald-500">AUTH SECURED</span> : <span className="text-red-500">OPEN</span>}
                               </div>
                            </td>
                            <td className="p-6">
                               <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider ${p.type === 'residential' ? 'bg-purple-900/30 text-purple-400 border border-purple-800/50' : 'bg-blue-900/30 text-blue-400 border border-blue-800/50'}`}>
                                 {p.type}
                               </span>
                            </td>
                            <td className="p-6 uppercase text-xs font-bold text-gray-500">{p.protocol}</td>
                            <td className="p-6">
                               <div className="flex items-center gap-3">
                                  <div className="flex-1 h-1.5 w-24 bg-gray-800 rounded-full overflow-hidden">
                                     <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${Math.min(100, (p.usage.today / p.limits.daily) * 100)}%` }} />
                                  </div>
                                  <span className="text-xs font-mono text-cyan-400">{p.usage.today}</span>
                               </div>
                            </td>
                            <td className="p-6 font-mono text-xs">
                               <span className="text-gray-500">MAX:</span> {p.limits.daily}/day
                            </td>
                            <td className="p-6 text-right">
                               <button onClick={() => removeProxy(p._id)} className="text-gray-600 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
           )}
        </div>
      </div>

      {/* Add Modal */}
      {showModal && (
         <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
            <div className="bg-[#111625] border border-gray-800 rounded-2xl w-full max-w-lg p-8 shadow-2xl">
               <h2 className="text-2xl font-black text-white mb-6">Provision New Node</h2>
               <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Type</label>
                        <select 
                          value={form.type} onChange={e => setForm({...form, type: e.target.value})}
                          className="w-full bg-[#0B0F19] border border-gray-800 rounded-xl p-3 text-sm text-white focus:border-cyan-500 outline-none mt-1"
                        >
                           <option value="residential">Residential (High Trust)</option>
                           <option value="shared">Shared Datacenter</option>
                        </select>
                     </div>
                     <div>
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Protocol</label>
                        <select 
                          value={form.protocol} onChange={e => setForm({...form, protocol: e.target.value})}
                          className="w-full bg-[#0B0F19] border border-gray-800 rounded-xl p-3 text-sm text-white focus:border-cyan-500 outline-none mt-1"
                        >
                           <option value="socks5">SOCKS5</option>
                           <option value="http">HTTP/HTTPS</option>
                        </select>
                     </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                     <div className="col-span-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Host / IP</label>
                        <input required placeholder="192.168.1.1" value={form.host} onChange={e => setForm({...form, host: e.target.value})} className="w-full bg-[#0B0F19] border border-gray-800 rounded-xl p-3 text-sm text-white focus:border-cyan-500 outline-none mt-1 font-mono" />
                     </div>
                     <div>
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Port</label>
                        <input required placeholder="1080" value={form.port} onChange={e => setForm({...form, port: e.target.value})} className="w-full bg-[#0B0F19] border border-gray-800 rounded-xl p-3 text-sm text-white focus:border-cyan-500 outline-none mt-1 font-mono" />
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Username (Optional)</label>
                        <input value={form.username} onChange={e => setForm({...form, username: e.target.value})} className="w-full bg-[#0B0F19] border border-gray-800 rounded-xl p-3 text-sm text-white focus:border-cyan-500 outline-none mt-1" />
                     </div>
                     <div>
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Password (Optional)</label>
                        <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="w-full bg-[#0B0F19] border border-gray-800 rounded-xl p-3 text-sm text-white focus:border-cyan-500 outline-none mt-1" />
                     </div>
                  </div>

                  <div>
                     <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Daily Limit Cap</label>
                     <input type="number" value={form.dailyLimit} onChange={e => setForm({...form, dailyLimit: e.target.value})} className="w-full bg-[#0B0F19] border border-gray-800 rounded-xl p-3 text-sm text-white focus:border-cyan-500 outline-none mt-1 font-mono" />
                  </div>

                  <div className="flex gap-3 pt-4">
                     <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-xl transition-all">Cancel</button>
                     <button type="submit" className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-cyan-900/50">Deploy Node</button>
                  </div>
               </form>
            </div>
         </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="bg-[#111625] border border-gray-800 rounded-3xl p-6 relative overflow-hidden group hover:border-gray-700 transition-all">
       <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
          <Icon size={64} className={color} />
       </div>
       <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-lg bg-gray-900 border border-gray-800 ${color}`}>
             <Icon size={20} />
          </div>
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{label}</span>
       </div>
       <div className="text-3xl font-black text-white tracking-tight font-mono">{value}</div>
       <div className="text-[10px] font-bold text-gray-600 mt-1">{sub}</div>
    </div>
  );
}
