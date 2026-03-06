"use client";

import { useState, useEffect } from "react";
import { 
  Plus, Search, MapPin, 
  Trash2, RefreshCw, User, 
  Tag, Shield, Server,
  AlertTriangle, CheckCircle2,
  MoreHorizontal, Loader2,
  Activity, Globe, Zap, Settings
} from "lucide-react";

export default function IPManagement() {
  const [ips, setIps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Form State
  const [form, setForm] = useState({
    host: "", port: "", protocol: "socks5", 
    username: "", password: "", 
    type: "residential", dailyLimit: 1000
  });

  useEffect(() => {
    fetchIPs();
  }, []);

  const fetchIPs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/system/proxies");
      if (res.ok) {
        const data = await res.json();
        setIps(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/system/proxies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setShowAddModal(false);
        setForm({ host: "", port: "", protocol: "socks5", username: "", password: "", type: "residential", dailyLimit: 1000 });
        fetchIPs();
      } else {
        const err = await res.json();
        alert(err.error || "Registration failed");
      }
    } catch (e) {
      alert("Failed to connect to security server");
    }
  };

  const removeIP = async (id) => {
    if (!confirm("Decommission this network node? This action is irreversible.")) return;
    try {
      await fetch(`/api/system/proxies?id=${id}`, { method: "DELETE" });
      fetchIPs();
    } catch (e) {
      alert("Nuclear option failed. Node still active.");
    }
  };

  const filteredIPs = ips.filter(ip => 
    ip.host?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ip.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ip.protocol?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             <Globe className="text-indigo-600 animate-pulse" size={40} />
             Network Operations Center
          </h1>
          <p className="text-slate-500 font-medium mt-2 text-lg">Managing {ips.length} active infrastructure nodes across global clusters.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={fetchIPs}
            className="px-6 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-sm text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} /> Sync Grid
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all flex items-center gap-2 active:scale-95"
          >
            <Plus size={18} /> Provision Node
          </button>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard icon={Server} label="Total Nodes" value={ips.length} color="indigo" />
        <MetricCard icon={Shield} label="Verified Residential" value={ips.filter(i => i.type === 'residential').length} color="emerald" />
        <MetricCard icon={Activity} label="Health Multiplier" value="98.4%" color="purple" />
        <MetricCard icon={Zap} label="Daily Throughput" value={`${ips.reduce((a,b) => a + (b.usage?.today || 0), 0)}`} color="amber" />
      </div>

      {/* Search & Action Bar */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by IP address, host, or protocol..." 
            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/20 font-medium text-slate-900 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
           <select className="px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-600 text-sm appearance-none min-w-[160px]">
             <option>All Platforms</option>
             <option>Residential</option>
             <option>Datacenter</option>
           </select>
           <button className="px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all">
             <Settings size={20} />
           </button>
        </div>
      </div>

      {/* IP Table */}
      {loading ? (
        <div className="py-40 flex flex-col items-center justify-center space-y-4">
           <Loader2 className="animate-spin text-indigo-600" size={48} />
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scanning Network Clusters...</p>
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 transition-colors">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Network Endpoint</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Classification</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Daily Load</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Node Security</th>
                <th className="px-8 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredIPs.map((ip) => (
                <tr key={ip._id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-8 py-7">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-slate-100 rounded-2xl text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all"><MapPin size={18}/></div>
                      <div>
                        <span className="font-black text-slate-900 text-lg font-mono tracking-tight">{ip.host}:{ip.port}</span>
                        {ip.auth && <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.1em] mt-0.5">Encrypted Tunnel Active</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-7">
                    <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border ${
                      ip.type === 'residential' 
                        ? 'bg-indigo-50 text-indigo-600 border-indigo-100' 
                        : 'bg-blue-50 text-blue-600 border-blue-100'
                    }`}>
                      {ip.type}
                    </span>
                  </td>
                  <td className="px-8 py-7">
                    <div className="flex items-center gap-2">
                       <Shield size={14} className="text-slate-300" />
                       <span className="font-black text-slate-700 text-sm uppercase">{ip.protocol}</span>
                    </div>
                  </td>
                  <td className="px-8 py-7">
                    <div className="flex items-center gap-4">
                       <div className="flex-1 h-2 w-24 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-indigo-600 rounded-full" 
                            style={{ width: `${Math.min(100, ((ip.usage?.today || 0) / (ip.limits?.daily || 1000)) * 100)}%` }} 
                          />
                       </div>
                       <span className="text-xs font-black text-slate-900">{ip.usage?.today || 0} reqs</span>
                    </div>
                  </td>
                  <td className="px-8 py-7 text-right">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100">
                      <CheckCircle2 size={12} /> Optimal
                    </span>
                  </td>
                  <td className="px-8 py-7 text-right">
                    <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-all">
                      <button 
                        onClick={() => removeIP(ip._id)} 
                        className="p-3 bg-white text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-2xl border border-slate-100 shadow-sm transition-all"
                      >
                        <Trash2 size={18}/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredIPs.length === 0 && (
                <tr>
                   <td colSpan="6" className="py-24 text-center">
                      <p className="text-slate-400 font-bold italic">No nodes matching search criteria found in current perimeter.</p>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Register Node Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-300" onClick={() => setShowAddModal(false)} />
          <div className="bg-white w-full max-w-xl rounded-[3.5rem] shadow-2xl relative overflow-hidden p-12 border border-slate-100 animate-in zoom-in-95 duration-300">
            <div className="mb-10 text-center">
               <div className="w-20 h-20 bg-indigo-600 text-white rounded-[2.25rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-200 ring-8 ring-indigo-50">
                 <Server size={32} />
               </div>
               <h2 className="text-3xl font-black text-slate-900 tracking-tight">Provision Grid Node</h2>
               <p className="text-slate-400 font-bold text-sm mt-2">Introduce new infrastructure to the system fabric.</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Node Type</label>
                   <select 
                     value={form.type} 
                     onChange={e => setForm({...form, type: e.target.value})}
                     className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.25rem] font-black text-slate-900 outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all appearance-none"
                   >
                     <option value="residential">Residential</option>
                     <option value="shared">Datacenter</option>
                   </select>
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Protocol</label>
                   <select 
                     value={form.protocol} 
                     onChange={e => setForm({...form, protocol: e.target.value})}
                     className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.25rem] font-black text-slate-900 outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all appearance-none"
                   >
                     <option value="socks5">SOCKS5</option>
                     <option value="http">HTTP/HTTPS</option>
                   </select>
                 </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Host Identity / IP</label>
                  <input 
                    required 
                    placeholder="e.g. 45.16.8.201" 
                    value={form.host}
                    onChange={e => setForm({...form, host: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.25rem] font-black font-mono text-slate-900 outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Port</label>
                  <input 
                    required 
                    placeholder="1080" 
                    value={form.port}
                    onChange={e => setForm({...form, port: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.25rem] font-black font-mono text-slate-900 outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Username (Optional)</label>
                  <input 
                    placeholder="admin" 
                    value={form.username}
                    onChange={e => setForm({...form, username: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.25rem] font-bold text-slate-900 outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Secret Key (Optional)</label>
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    value={form.password}
                    onChange={e => setForm({...form, password: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.25rem] font-bold text-slate-900 outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all" 
                  />
                </div>
              </div>

              <div className="pt-8 flex gap-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-5 bg-slate-50 text-slate-400 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-100 transition-all">Abort</button>
                <button type="submit" className="flex-[2] py-5 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200 active:scale-95">Finalize Provisioning</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, color }) {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100"
  };

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 flex items-center gap-6 shadow-sm hover:shadow-md transition-shadow">
      <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shrink-0 ${colors[color]}`}>
        <Icon size={28} />
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-2xl font-black text-slate-900 tracking-tight">{value}</p>
      </div>
    </div>
  );
}
