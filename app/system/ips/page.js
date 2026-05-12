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
    <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-1000 font-sans p-4 lg:p-8 pb-32">
      <div className="max-w-full mx-auto space-y-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-[#8245EF]/10 pb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
                 <span className="px-5 py-2 bg-[#8245EF]/10 text-[#8245EF] text-[10px] font-black uppercase tracking-[0.4em] rounded-full border border-[#8245EF]/20 flex items-center gap-3 font-mono">
                 <Hexagon size={16} className="opacity-80" />
                 Network_Grid::Authorized
               </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-[#161932] tracking-tighter uppercase leading-none">
              IP <span className="text-[#8245EF]">Registry</span>
            </h1>
            <p className="text-[#64748b] text-lg md:text-xl font-medium max-w-3xl leading-relaxed italic">Administer secure inbound proxy clusters and modulate geo-location distribution.</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={fetchIPs}
              className="px-6 md:px-10 py-4 md:py-6 bg-white text-[#161932] font-black uppercase text-[11px] tracking-[0.3em] rounded-[1.75rem] flex items-center justify-center gap-5 transition-all shadow-sm hover:bg-[#FCF8FE] active:scale-95 font-mono border border-[#8245EF]/10"
            >
              <RefreshCw size={20} className={loading ? "animate-spin" : ""} /> Sync_Grid
            </button>
            <button 
              onClick={() => setShowAddModal(true)}
              className="px-6 md:px-12 py-4 md:py-6 bg-[#8245EF] text-white font-black uppercase text-[11px] tracking-[0.4em] rounded-[2rem] flex items-center justify-center gap-5 transition-all shadow-xl hover:bg-[#6d28d9] active:scale-95 font-mono border border-white/10"
            >
              <Plus size={20} /> Provision_Node
            </button>
          </div>
        </div>

        {/* Metrics Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-full">
          <MetricCard icon={Server} label="Grid_Clusters" value={ips.length} accent="#8245EF" sub="Active Nodes" />
          <MetricCard icon={Shield} label="Safe_Residency" value={ips.filter(i => i.type === 'residential').length} accent="#8245EF" sub="Verified Residential" />
          <MetricCard icon={Activity} label="Pulse_Sync" value="98.4%" accent="#8245EF" sub="Health Multiplier" />
          <MetricCard icon={Zap} label="Load_Balance" value={`${ips.reduce((a,b) => a + (b.usage?.today || 0), 0)}`} accent="#8245EF" sub="Daily Requests" />
        </div>

        {/* Search Matrix */}
        <div className="bg-white p-6 md:p-8 rounded-[3rem] border border-[#8245EF]/15 shadow-sm relative overflow-hidden group">
          <div className="relative z-10 flex flex-col md:flex-row gap-8">
            <div className="flex-1 relative">
              <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={28} />
              <input 
                type="text" 
                placeholder="Locate node by host signature, protocol, or tag..." 
                className="w-full pl-20 pr-8 py-7 bg-[#FCF8FE]/50 border border-[#8245EF]/10 rounded-[2.5rem] outline-none focus:border-[#8245EF] font-bold text-[#161932] transition-all shadow-sm italic placeholder:text-[#94a3b8]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-6">
               <div className="relative">
                 <select className="px-6 md:px-10 py-5 bg-white border border-[#8245EF]/15 rounded-[1.75rem] outline-none font-black text-[#64748b] text-[11px] uppercase tracking-widest font-mono appearance-none min-w-[200px] hover:border-[#8245EF]/30 transition-all cursor-pointer shadow-sm">
                   <option>Filter::All_Nodes</option>
                   <option>Filter::Residential</option>
                   <option>Filter::Datacenter</option>
                 </select>
                 <Settings size={18} className="absolute right-8 top-1/2 -translate-y-1/2 text-[#94a3b8] pointer-events-none" />
               </div>
            </div>
          </div>
        </div>

        {/* IP Nodes Hub */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-48 space-y-10 animate-pulse text-center">
             <div className="w-24 h-24 border-8 border-[#FCF8FE] border-t-[#8245EF] rounded-full animate-spin shadow-inner" />
             <p className="text-[11px] font-black text-[#94a3b8] uppercase tracking-[0.6em] font-mono">Verifying_Optical_Links...</p>
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] overflow-hidden relative border border-[#8245EF]/10 shadow-sm max-w-full">
             <div className="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-transparent via-[#8245EF]/30 to-transparent" />
            <div className="overflow-x-auto custom-scrollbar w-full">
              <table className="w-full text-left min-w-[800px]">
                <thead className="bg-[#FCF8FE]/50 text-[11px] font-black uppercase text-[#94a3b8] tracking-[0.4em] font-mono border-b border-[#8245EF]/10">
                  <tr>
                    <th className="p-6 md:p-8">Endpoint_Protocol</th>
                    <th className="p-6 md:p-8">Classification</th>
                    <th className="p-6 md:p-8">Type</th>
                    <th className="p-6 md:p-8">Usage_Load</th>
                    <th className="p-6 md:p-8 text-right">Integrity</th>
                    <th className="p-6 md:p-8 text-right px-8">Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#8245EF]/5">
                  {filteredIPs.map((ip) => (
                    <tr key={ip._id} className="hover:bg-[#FCF8FE]/30 transition-all group cursor-default">
                      <td className="p-6 md:p-8">
                        <div className="flex items-center gap-4">
                          <div className="p-4 bg-[#FCF8FE] border border-[#8245EF]/10 rounded-2xl text-[#94a3b8] group-hover:text-[#8245EF] group-hover:border-[#8245EF]/30 transition-all font-mono shadow-sm">
                            <MapPin size={22}/>
                          </div>
                          <div>
                            <span className="font-black text-[#161932] text-base md:text-lg font-mono tracking-tighter leading-none break-all">{ip.host || ip.ip}</span>
                            <span className="text-[#94a3b8] font-mono text-base md:text-lg"> : {ip.port}</span>
                            {ip.auth && <p className="text-[10px] font-black text-[#8245EF] uppercase tracking-widest mt-2 font-mono flex items-center gap-3">
                               <Shield size={12} /> Secure_Handshake_Enabled
                            </p>}
                          </div>
                        </div>
                      </td>
                      <td className="p-6 md:p-8">
                        <span className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] font-mono border ${
                          ip.type === 'residential' 
                            ? 'bg-[#8245EF]/10 text-[#8245EF] border-[#8245EF]/20' 
                            : 'bg-white text-[#64748b] border-[#8245EF]/10'
                        } shadow-sm`}>
                          {ip.type}
                        </span>
                      </td>
                      <td className="p-6 md:p-8">
                        <div className="flex items-center gap-4">
                           <Shield size={16} className="text-[#94a3b8]" />
                           <span className="font-black text-[#64748b] text-[12px] uppercase tracking-widest font-mono">{ip.protocol}</span>
                        </div>
                      </td>
                      <td className="p-6 md:p-8">
                        <div className="flex items-center gap-8">
                           <div className="flex-1 h-3.5 w-40 bg-[#FCF8FE] rounded-full overflow-hidden border border-[#8245EF]/10 shadow-inner">
                              <div 
                                className="h-full bg-[#8245EF] rounded-full transition-all duration-1000" 
                                style={{ width: `${Math.min(100, ((ip.usage?.today || 0) / (ip.limits?.daily || 1000)) * 100)}%` }} 
                              />
                           </div>
                           <span className="text-[12px] font-black font-mono text-[#161932] tracking-widest">{ip.usage?.today || 0} U</span>
                        </div>
                      </td>
                      <td className="p-6 md:p-8 text-right">
                        <span className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-[#FCF8FE] text-[#8245EF] text-[11px] font-black uppercase tracking-widest border border-[#8245EF]/10 shadow-sm font-mono">
                          <CheckCircle2 size={16} /> Synchronized
                        </span>
                      </td>
                      <td className="p-6 md:p-8 text-right px-8">
                        <button 
                          onClick={() => removeIP(ip._id)} 
                          className="px-6 py-3 bg-[#FCF8FE] text-[#94a3b8] hover:text-white hover:bg-rose-500 rounded-2xl border border-[#8245EF]/10 hover:border-rose-600 transition-all opacity-0 group-hover:opacity-100 uppercase text-[10px] font-black font-mono tracking-widest"
                        >
                          <Trash2 size={24} className="mx-auto" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredIPs.length === 0 && (
                    <tr>
                       <td colSpan="6" className="py-48 text-center opacity-30">
                          <div className="flex flex-col items-center gap-8 max-w-sm mx-auto">
                            <Globe size={80} className="text-[#94a3b8]" />
                            <p className="text-[12px] font-black text-[#94a3b8] uppercase tracking-[0.6em] font-mono italic">Void_Cluster_Identified</p>
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
               <div className="w-16 h-16 bg-[#FCF8FE] text-[#8245EF] rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 shadow-sm border border-[#8245EF]/10">
                 <Server size={32} />
               </div>
               <h2 className="text-3xl font-bold text-[#161932] tracking-tight uppercase leading-none">Provision Grid Node</h2>
               <p className="text-[#64748b] font-bold text-xs uppercase tracking-wider mt-4">Identify and bridge new infrastructure fabric.</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-8 relative z-10 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <FormGroup label="Node Classification">
                   <div className="relative group">
                     <select 
                       value={form.type} 
                       onChange={e => setForm({...form, type: e.target.value})}
                       className="w-full p-4 bg-[#FCF8FE]/50 border border-[#8245EF]/10 rounded-xl text-sm font-bold text-[#161932] outline-none focus:border-[#8245EF] transition-all appearance-none cursor-pointer tracking-wider uppercase shadow-sm"
                     >
                       <option value="residential">Residential Trust</option>
                       <option value="shared">Datacenter Bulk</option>
                     </select>
                     <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#94a3b8]">
                        <Settings size={18} />
                     </div>
                   </div>
                 </FormGroup>
                 <FormGroup label="Handshake Protocol">
                    <div className="relative group">
                     <select 
                       value={form.protocol} 
                       onChange={e => setForm({...form, protocol: e.target.value})}
                       className="w-full p-4 bg-[#FCF8FE]/50 border border-[#8245EF]/10 rounded-xl text-sm font-bold text-[#161932] outline-none focus:border-[#8245EF] transition-all appearance-none cursor-pointer tracking-wider uppercase shadow-sm"
                     >
                       <option value="socks5">SOCKS5</option>
                       <option value="http">HTTP SECURE</option>
                     </select>
                     <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#94a3b8]">
                        <Settings size={18} />
                     </div>
                   </div>
                 </FormGroup>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-3">
                  <FormGroup label="Access_Endpoint / Host">
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
                <FormGroup label="Operator Identity">
                  <input 
                    placeholder="Admin ID" 
                    value={form.username}
                    onChange={e => setForm({...form, username: e.target.value})}
                    className="form-input text-sm px-4 py-3 rounded-xl" 
                  />
                </FormGroup>
                <FormGroup label="Security Key">
                  <input 
                    type="password" 
                    placeholder="••••••••••••" 
                    value={form.password}
                    onChange={e => setForm({...form, password: e.target.value})}
                    className="form-input text-sm px-4 py-3 rounded-xl" 
                  />
                </FormGroup>
              </div>

              <div className="pt-8 flex flex-col md:flex-row gap-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-4 bg-[#FCF8FE] text-[#94a3b8] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#e2e8f0] transition-all border border-[#8245EF]/10 shadow-sm">Cancel</button>
                <button type="submit" className="flex-[2] py-4 bg-[#8245EF] text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#6d28d9] transition-all shadow-md active:scale-95 border border-white/10">Execute Provisioning</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global CSS for Form Inputs */}
      <style jsx>{`
        .form-input {
          width: 100%;
          padding: 1.5rem 2rem;
          background-color: rgba(248, 244, 242, 0.5);
          border: 1px solid rgba(130, 69, 239, 0.2);
          border-radius: 2rem;
          font-weight: 800;
          color: #161932;
          outline: none;
          transition: all 0.3s;
          font-family: monospace;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          font-size: 0.9rem;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
        }
        .form-input:focus {
          border-color: #8245EF;
          background-color: #ffffff;
          box-shadow: 0 4px 20px rgba(130, 69, 239, 0.1);
        }
        .form-input::placeholder {
            color: #94a3b8;
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
          <p className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.3em] mb-2 font-mono leading-none truncate">{label}</p>
          <p className="text-2xl font-black text-[#161932] tracking-tighter leading-none truncate">{value}</p>
          <p className="text-[9px] font-black text-[#64748b] uppercase tracking-widest mt-2 font-mono leading-none italic truncate">{sub}</p>
        </div>
      </div>
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
    </div>
  );
}

function FormGroup({ label, children }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-[#94a3b8] uppercase tracking-wider ml-1">{label}</label>
      {children}
    </div>
  );
}
