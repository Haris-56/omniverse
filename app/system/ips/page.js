"use client";

import { useState, useEffect } from "react";
import { 
  Plus, Search, MapPin, 
  Trash2, RefreshCw, User, 
  Tag, Shield, Server,
  AlertTriangle, CheckCircle2,
  MoreHorizontal, Loader2,
  Activity, Globe, Zap, Settings,
  Database, ShieldCheck, Hexagon
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
    if (!confirm("Remove this proxy? This action cannot be undone.")) return;
    try {
      await fetch(`/api/system/proxies?id=${id}`, { method: "DELETE" });
      fetchIPs();
    } catch (e) {
      alert("Failed to remove proxy.");
    }
  };

  const filteredIPs = ips.filter(ip => 
    ip.host?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ip.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ip.protocol?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-1000 font-sans p-4 lg:p-8 pb-32">
      <div className="max-w-full mx-auto space-y-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-[#8245EF]/10 pb-16">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
                 <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-full border border-green-100 flex items-center gap-2">
                 <Hexagon size={14} className="opacity-80" />
                 Proxy Management
               </span>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 tracking-tight">Proxies</h1>
            <p className="text-gray-500 text-xl font-medium">Manage your proxy servers and monitor their performance.</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={fetchIPs}
              className="px-8 py-4 bg-white text-gray-900 font-bold uppercase text-xs tracking-widest rounded-xl flex items-center justify-center gap-3 transition-all shadow-sm hover:bg-gray-50 active:scale-95 border border-gray-100"
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} /> Refresh
            </button>
            <button 
              onClick={() => setShowAddModal(true)}
              className="px-8 py-4 bg-[#8245EF] text-white font-bold uppercase text-xs tracking-widest rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg hover:bg-[#6d28d9] active:scale-95 border border-white/10"
            >
              <Plus size={18} /> Add Proxy
            </button>
          </div>
        </div>

        {/* Metrics Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-full">
          <MetricCard icon={Server} label="Total Proxies" value={ips.length} accent="#8245EF" sub="Active Nodes" />
          <MetricCard icon={Shield} label="Residential" value={ips.filter(i => i.type === 'residential').length} accent="#8245EF" sub="Verified Residential" />
          <MetricCard icon={Activity} label="Success Rate" value="98.4%" accent="#8245EF" sub="Health Multiplier" />
          <MetricCard icon={Zap} label="Daily Usage" value={`${ips.reduce((a,b) => a + (b.usage?.today || 0), 0)}`} accent="#8245EF" sub="Requests" />
        </div>

        {/* Search Matrix */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
              <input 
                type="text" 
                placeholder="Search by host, protocol, or type..." 
                className="w-full pl-16 pr-8 py-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#8245EF]/40 font-bold text-gray-900 transition-all placeholder:text-gray-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
               <div className="relative">
                 <select className="px-6 py-4 bg-white border border-gray-100 rounded-xl outline-none font-bold text-gray-500 text-xs uppercase tracking-widest appearance-none min-w-[200px] hover:border-gray-200 transition-all cursor-pointer">
                   <option>All Proxies</option>
                   <option>Residential</option>
                   <option>Datacenter</option>
                 </select>
                 <Settings size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
               </div>
            </div>
          </div>
        </div>

        {/* IP Nodes Hub */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 space-y-4 text-center">
             <div className="w-16 h-16 border-4 border-gray-100 border-t-[#8245EF] rounded-full animate-spin" />
             <p className="text-xs font-bold text-gray-400">Checking proxies...</p>
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] overflow-hidden relative border border-[#8245EF]/10 shadow-sm max-w-full">
             <div className="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-transparent via-[#8245EF]/30 to-transparent" />
            <div className="overflow-x-auto custom-scrollbar w-full">
              <table className="w-full text-left min-w-[800px]">
                <thead className="bg-gray-50/50 text-[10px] font-bold uppercase text-gray-400 tracking-widest border-b border-gray-100">
                  <tr>
                    <th className="p-8">Server & Protocol</th>
                    <th className="p-8">Type</th>
                    <th className="p-8">Protocol</th>
                    <th className="p-8">Daily Usage</th>
                    <th className="p-8 text-right">Status</th>
                    <th className="p-8 text-right px-12">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#8245EF]/5">
                  {filteredIPs.map((ip) => (
                    <tr key={ip._id} className="hover:bg-[#FCF8FE]/30 transition-all group cursor-default">
                      <td className="p-6 md:p-8">
                        <div className="flex items-center gap-4">
                          <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl text-gray-400 group-hover:text-[#8245EF] transition-all">
                            <MapPin size={20}/>
                          </div>
                          <div>
                            <span className="font-bold text-gray-900 text-base leading-none">{ip.host || ip.ip}</span>
                            <span className="text-gray-400 font-bold text-base"> : {ip.port}</span>
                            {ip.auth && <p className="text-[10px] font-bold text-[#8245EF] uppercase tracking-widest mt-1 flex items-center gap-2">
                               <Shield size={10} /> Encrypted
                            </p>}
                          </div>
                        </div>
                      </td>
                      <td className="p-6 md:p-8">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${
                          ip.type === 'residential' 
                            ? 'bg-[#8245EF]/10 text-[#8245EF] border-[#8245EF]/20' 
                            : 'bg-gray-50 text-gray-500 border-gray-100'
                        }`}>
                          {ip.type}
                        </span>
                      </td>
                      <td className="p-6 md:p-8">
                        <div className="flex items-center gap-3">
                           <Shield size={14} className="text-gray-300" />
                           <span className="font-bold text-gray-500 text-[11px] uppercase tracking-widest">{ip.protocol}</span>
                        </div>
                      </td>
                      <td className="p-6 md:p-8">
                        <div className="flex items-center gap-6">
                           <div className="flex-1 h-2 w-32 bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-[#8245EF] rounded-full transition-all duration-1000" 
                                style={{ width: `${Math.min(100, ((ip.usage?.today || 0) / (ip.limits?.daily || 1000)) * 100)}%` }} 
                              />
                           </div>
                           <span className="text-[11px] font-bold text-gray-900 tracking-wider">{ip.usage?.today || 0} req</span>
                        </div>
                      </td>
                      <td className="p-6 md:p-8 text-right">
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-green-50 text-green-600 text-[10px] font-bold uppercase tracking-widest border border-green-100">
                          <CheckCircle2 size={14} /> Active
                        </span>
                      </td>
                      <td className="p-6 md:p-8 text-right px-8">
                        <button 
                          onClick={() => removeIP(ip._id)} 
                          className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredIPs.length === 0 && (
                    <tr>
                       <td colSpan="6" className="py-48 text-center opacity-30">
                          <div className="flex flex-col items-center gap-8 max-w-sm mx-auto">
                            <Globe size={80} className="text-[#94a3b8]" />
                             <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No proxies found</p>
                          </div>
                       </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Provisioning Manifest (Modal) */}
      {showAddModal && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 lg:p-20 overflow-y-auto custom-scrollbar">
          <div className="fixed inset-0 bg-[#161932]/60 backdrop-blur-xl animate-in fade-in duration-500" onClick={() => setShowAddModal(false)} />
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-xl border border-[#8245EF]/10 relative z-10 overflow-hidden p-10 animate-in zoom-in-95 duration-500 my-auto text-center font-sans">
             <div className="absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r from-transparent via-[#8245EF]/40 to-transparent" />
            
            <div className="mb-10 relative z-10">
                <div className="w-12 h-12 bg-[#FCF8FE] text-[#8245EF] rounded-xl flex items-center justify-center mx-auto mb-4 border border-[#8245EF]/10">
                  <Server size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Add Proxy Server</h2>
                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-2">Connect a new proxy server to the system.</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-8 relative z-10 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormGroup label="Proxy Type">
                    <div className="relative group">
                      <select 
                        value={form.type} 
                        onChange={e => setForm({...form, type: e.target.value})}
                        className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-900 outline-none focus:border-[#8245EF]/40 transition-all appearance-none cursor-pointer"
                      >
                        <option value="residential">Residential Trust</option>
                        <option value="shared">Datacenter Bulk</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                         <Settings size={16} />
                      </div>
                    </div>
                  </FormGroup>
                  <FormGroup label="Protocol">
                     <div className="relative group">
                      <select 
                        value={form.protocol} 
                        onChange={e => setForm({...form, protocol: e.target.value})}
                        className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-900 outline-none focus:border-[#8245EF]/40 transition-all appearance-none cursor-pointer"
                      >
                        <option value="socks5">SOCKS5</option>
                        <option value="http">HTTP SECURE</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                         <Settings size={16} />
                      </div>
                    </div>
                  </FormGroup>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-3">
                  <FormGroup label="Host / IP">
                    <input 
                      required 
                      placeholder="e.g. 0.0.0.0" 
                      value={form.host}
                      onChange={e => setForm({...form, host: e.target.value})}
                      className="form-input" 
                    />
                  </FormGroup>
                </div>
                <div>
                  <FormGroup label="Port">
                    <input 
                      required 
                      placeholder="1080" 
                      value={form.port}
                      onChange={e => setForm({...form, port: e.target.value})}
                      className="form-input text-center" 
                    />
                  </FormGroup>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <FormGroup label="Username">
                  <input 
                    placeholder="Proxy username" 
                    value={form.username}
                    onChange={e => setForm({...form, username: e.target.value})}
                    className="form-input" 
                  />
                </FormGroup>
                <FormGroup label="Password">
                  <input 
                    type="password" 
                    placeholder="••••••••••••" 
                    value={form.password}
                    onChange={e => setForm({...form, password: e.target.value})}
                    className="form-input" 
                  />
                </FormGroup>
              </div>
              </div>

              <div className="pt-8 flex flex-col md:flex-row gap-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-4 bg-gray-50 text-gray-400 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-gray-100 transition-all border border-gray-200">Cancel</button>
                <button type="submit" className="flex-[2] py-4 bg-[#8245EF] text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-[#6d28d9] transition-all shadow-lg active:scale-95 border border-white/10">Save Proxy</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global CSS for Form Inputs */}
      <style jsx>{`
        .form-input {
          width: 100%;
          padding: 0.75rem 1rem;
          background-color: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          font-weight: 600;
          color: #111827;
          outline: none;
          transition: all 0.2s;
          font-size: 0.875rem;
        }
        .form-input:focus {
          border-color: #8245EF;
          background-color: #ffffff;
          box-shadow: 0 0 0 4px rgba(130, 69, 239, 0.1);
        }
        .form-input::placeholder {
            color: #d1d5db;
        }
      `}</style>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, accent, sub }) {
  return (
    <div className="bg-white p-6 rounded-3xl relative overflow-hidden group border border-[#8245EF]/10 shadow-sm transition-all duration-700 hover:-translate-y-2 min-w-0">
      <div className="flex items-center gap-4 relative z-10">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border border-[#8245EF]/10 bg-[#FCF8FE] text-[#8245EF] shadow-inner transition-all duration-700 group-hover:scale-110 group-hover:rotate-6">
          <Icon size={24} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 truncate">{label}</p>
          <p className="text-2xl font-bold text-gray-900 tracking-tight leading-none truncate">{value}</p>
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-2 leading-none truncate">{sub}</p>
        </div>
      </div>
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
    </div>
  );
}

function FormGroup({ label, children }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">{label}</label>
      {children}
    </div>
  );
}
