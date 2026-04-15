"use client";

import { useState, useEffect } from "react";
import { 
  Search, Filter, MoreVertical, 
  UserCheck, UserX, Shield, 
  ExternalLink, Mail, ArrowUpDown,
  History, CreditCard, Network,
  Loader2, CheckCircle2, AlertCircle, RefreshCw,
  Cpu, Zap, Globe, ShieldCheck, Trash2,
  Hexagon, Settings, Activity
} from "lucide-react";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [uRes, pRes] = await Promise.all([
        fetch("/api/system/users"),
        fetch("/api/system/plans")
      ]);
      if (uRes.ok) setUsers(await uRes.json());
      if (pRes.ok) setPlans(await pRes.json());
    } catch (e) {
      console.error("Fetch Data Error:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (userId, updates) => {
    setUpdating(true);
    try {
      const res = await fetch("/api/system/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ...updates })
      });
      if (res.ok) {
        if (selectedUser?.id === userId || selectedUser?._id === userId) {
          setSelectedUser(prev => ({ ...prev, ...updates }));
        }
        fetchData();
      } else {
        const err = await res.json();
        alert(err.error || "Update failed");
      }
    } catch (e) {
      console.error(e);
      alert("Network error during update");
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm("Are you sure you want to permanently delete this user? This action cannot be undone.")) return;
    
    setUpdating(true);
    try {
      const res = await fetch(`/api/system/users?userId=${userId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        if (selectedUser?.id === userId || selectedUser?._id === userId) {
          setSelectedUser(null);
        }
        fetchData();
      } else {
        const err = await res.json();
        alert(err.error || "Delete failed");
      }
    } catch (e) {
      console.error(e);
      alert("Network error during delete");
    } finally {
      setUpdating(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-1000 font-sans p-4 lg:p-0 pb-32">
      <div className="max-w-full mx-auto space-y-20">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-[#B78D7D]/10 pb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
               <span className="px-5 py-2 bg-[#B78D7D]/10 text-[#B78D7D] text-[10px] font-black uppercase tracking-[0.4em] rounded-full border border-[#B78D7D]/20 flex items-center gap-3 font-mono">
                 <ShieldCheck size={16} className="opacity-80" />
                 Authority_Center::Active
               </span>
            </div>
            <h1 className="text-7xl font-black text-[#3E3A39] tracking-tighter uppercase leading-none">
              User <span className="text-[#B78D7D]">Registry</span>
            </h1>
            <p className="text-[#8E7A70] text-2xl font-medium max-w-3xl leading-relaxed italic">Administer high-fidelity identity nodes and modulate neural access hierarchies.</p>
          </div>
          <button 
            onClick={fetchData}
            className="group px-12 py-6 bg-white text-[#3E3A39] font-black uppercase text-[11px] tracking-[0.4em] rounded-[2rem] flex items-center justify-center gap-5 transition-all shadow-sm hover:bg-[#F8F4F2] active:scale-95 font-mono border border-[#B78D7D]/15"
          >
            <RefreshCw size={22} className={loading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-700"} /> 
            Sync_Fleet
          </button>
        </div>

        {/* Global Search Interface */}
        <div className="bg-white p-12 rounded-[4rem] border border-[#B78D7D]/15 shadow-sm relative overflow-hidden group">
          <div className="relative z-10">
            <label className="text-[11px] font-black text-[#B2AAA6] uppercase tracking-[0.4em] font-mono ml-8 mb-6 block leading-none">Search_Matrix</label>
            <div className="relative">
              <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-[#B2AAA6]" size={28} />
              <input 
                type="text" 
                placeholder="Identify user by name, email or secure ID token..." 
                className="w-full pl-20 pr-8 py-7 bg-[#F8F4F2]/50 border border-[#B78D7D]/10 rounded-[2.5rem] outline-none focus:border-[#B78D7D] font-bold text-[#3E3A39] transition-all shadow-sm italic placeholder:text-[#B2AAA6]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Grid Display */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-48 space-y-10 animate-pulse text-center">
             <div className="relative">
                <div className="w-24 h-24 border-8 border-[#F8F4F2] border-t-[#B78D7D] rounded-full animate-spin shadow-inner" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <Hexagon size={40} className="text-[#B78D7D]" />
                </div>
             </div>
             <p className="text-[11px] font-black text-[#B2AAA6] uppercase tracking-[0.6em] font-mono">Decoding_Neural_Nodes...</p>
          </div>
        ) : (
          <div className="bg-white rounded-[4rem] overflow-hidden relative border border-[#B78D7D]/10 shadow-sm">
             <div className="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-transparent via-[#B78D7D]/30 to-transparent" />
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left">
                <thead className="bg-[#F8F4F2]/50 text-[11px] font-black uppercase text-[#B2AAA6] tracking-[0.4em] font-mono border-b border-[#B78D7D]/10">
                  <tr>
                    <th className="p-12">Identity_Node</th>
                    <th className="p-12">Tier_Hierarchy</th>
                    <th className="p-12">Subsystem_Status</th>
                    <th className="p-12 text-center">Load</th>
                    <th className="p-12">Induction_ST</th>
                    <th className="p-12 text-right px-16">Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#B78D7D]/5">
                  {filteredUsers.map((user) => (
                    <tr key={user.id || user._id} className="hover:bg-[#F8F4F2]/30 transition-all group cursor-default">
                      <td className="p-12">
                        <div className="flex items-center gap-8">
                          <div className="w-20 h-20 bg-[#F8F4F2] border border-[#B78D7D]/10 text-[#B78D7D] rounded-[2rem] flex items-center justify-center font-black text-3xl shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
                            {user.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <h4 className="font-black text-[#3E3A39] text-2xl tracking-tighter uppercase leading-none">{user.name || "UNIDENTIFIED"}</h4>
                            <p className="text-[#8E7A70] font-black text-[11px] mt-4 font-mono group-hover:text-[#B78D7D] transition-colors uppercase tracking-widest italic">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-12">
                        <div className="flex items-center gap-4">
                          <div className="w-3 h-3 rounded-full bg-[#B78D7D] shadow-[0_0_12px_rgba(183,141,125,0.4)]" />
                          <span className="font-black text-[#8E7A70] text-[12px] uppercase tracking-[0.2em] font-mono">Plan::{user.plan}</span>
                        </div>
                      </td>
                      <td className="p-12">
                        <span className={`inline-flex items-center gap-4 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] font-mono border ${user.status === 'Active' ? 'bg-[#B78D7D]/10 text-[#B78D7D] border-[#B78D7D]/20' : 'bg-rose-50 text-rose-500 border-rose-200'} shadow-sm`}>
                          <div className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-[#B78D7D] animate-pulse' : 'bg-rose-500'}`} />
                          {user.status}
                        </span>
                      </td>
                      <td className="p-12 text-center">
                        <span className="px-6 py-3 bg-[#F8F4F2] border border-[#B78D7D]/10 text-[#8E7A70] rounded-[1.25rem] text-[11px] font-black font-mono shadow-sm group-hover:text-[#B78D7D] transition-colors uppercase tracking-widest">
                          {user.stats?.campaigns || 0} U
                        </span>
                      </td>
                      <td className="p-12">
                         <p className="text-[#B2AAA6] font-black text-[11px] uppercase tracking-[0.3em] font-mono group-hover:text-[#8E7A70] transition-colors italic">
                           {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '---'}
                         </p>
                      </td>
                      <td className="p-12 text-right px-16">
                        <button 
                          onClick={() => setSelectedUser(user)}
                          className="px-10 py-5 bg-white border border-[#B78D7D]/20 text-[#B2AAA6] rounded-[2rem] text-[11px] font-black uppercase tracking-[0.4em] hover:bg-[#B78D7D] hover:text-white transition-all active:scale-95 font-mono shadow-sm"
                        >
                          Calibrate_Node
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                       <td colSpan="6" className="py-48 text-center opacity-30">
                          <div className="flex flex-col items-center gap-10 max-w-sm mx-auto">
                            <div className="w-28 h-28 bg-[#F8F4F2] rounded-[3.5rem] border border-[#B78D7D]/10 flex items-center justify-center text-[#B2AAA6] shadow-sm">
                              <UserX size={56} />
                            </div>
                            <p className="text-[12px] font-black text-[#B2AAA6] uppercase tracking-[0.6em] font-mono italic">Zero_Result_Set</p>
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

      {/* User Manifest Overlay (Modal) */}
      {selectedUser && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 lg:p-8 overflow-y-auto custom-scrollbar">
          <div className="fixed inset-0 bg-[#3E3A39]/60 backdrop-blur-xl animate-in fade-in duration-500" onClick={() => setSelectedUser(null)} />
          
          <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-[#B78D7D]/10 relative z-10 overflow-hidden flex flex-col xl:flex-row animate-in zoom-in-95 duration-500 my-auto">
             <div className="absolute inset-x-0 bottom-0 h-1bg-gradient-to-r from-transparent via-[#B78D7D]/40 to-transparent" />
            
            {/* Left Sector: Core Identity */}
            <div className="xl:w-2/5 bg-[#F8F4F2]/50 p-10 flex flex-col items-center border-r border-[#B78D7D]/10 shrink-0 relative">
               <div className="w-24 h-24 bg-white rounded-2xl shadow-sm flex items-center justify-center text-4xl font-black text-[#B78D7D] mb-6 border border-[#B78D7D]/10 group relative transition-all duration-700 hover:scale-105">
                  <div className="absolute inset-0 bg-[#B78D7D]/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative z-10">{selectedUser.name?.charAt(0)}</span>
               </div>
               
               <h3 className="text-3xl font-black text-[#3E3A39] mb-2 tracking-tighter uppercase text-center leading-tight">{selectedUser.name}</h3>
               <p className="text-[#8E7A70] font-bold text-[10px] mb-8 uppercase tracking-widest font-mono italic">{selectedUser.email}</p>
               
               <div className="w-full space-y-6 mb-8">
                  <div className="p-6 bg-white rounded-2xl border border-[#B78D7D]/10 shadow-sm transition-all hover:border-[#B78D7D]/30">
                    <p className="text-[10px] font-bold text-[#B2AAA6] uppercase tracking-wider mb-4 font-mono leading-none">Authorization Tier</p>
                    <div className="space-y-4">
                      <div className="relative group">
                        <select 
                          value={selectedUser.planId || ""}
                          disabled={updating}
                          onChange={(e) => handleUpdateUser(selectedUser.id || selectedUser._id, { planId: e.target.value })}
                          className="w-full p-4 bg-[#F8F4F2]/50 border border-[#B78D7D]/10 rounded-xl text-[11px] font-bold text-[#3E3A39] outline-none focus:border-[#B78D7D] transition-all appearance-none cursor-pointer font-mono tracking-widest uppercase shadow-sm"
                        >
                          <option value="" disabled>IDENT PLAN SELECTOR...</option>
                          {plans.map(p => (
                            <option key={p._id} value={p._id}>
                              NODE::{p.name.toUpperCase()} — ${p.price}/LC
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#B2AAA6]">
                           <Settings size={16} />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 bg-white rounded-2xl border border-[#B78D7D]/10 shadow-sm transition-all hover:border-[#B78D7D]/30">
                    <p className="text-[10px] font-bold text-[#B2AAA6] uppercase tracking-wider mb-4 font-mono leading-none">Mission State</p>
                    <div className="flex gap-4">
                       <button 
                         onClick={() => handleUpdateUser(selectedUser.id || selectedUser._id, { status: "Active" })}
                         disabled={updating}
                         className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all font-mono border ${selectedUser.status === 'Active' ? 'bg-[#B78D7D]/10 text-[#B78D7D] border-[#B78D7D]/30 shadow-sm' : 'bg-[#F8F4F2] text-[#B2AAA6] border-[#B78D7D]/10 hover:border-[#B78D7D]/30'}`}
                       >Active Link</button>
                       <button 
                         onClick={() => handleUpdateUser(selectedUser.id || selectedUser._id, { status: "Suspended" })}
                         disabled={updating}
                         className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all font-mono border ${selectedUser.status === 'Suspended' ? 'bg-rose-50 text-rose-500 border-rose-200 shadow-sm' : 'bg-[#F8F4F2] text-[#B2AAA6] border-[#B78D7D]/10 hover:border-[#B78D7D]/30'}`}
                       >Decommission</button>
                    </div>
                  </div>
               </div>

               <button 
                 onClick={() => setSelectedUser(null)}
                 className="w-full py-4 bg-white text-[#B2AAA6] rounded-xl font-bold text-[10px] uppercase tracking-widest hover:text-[#3E3A39] hover:bg-[#F8F4F2] transition-all mt-auto font-mono border border-[#B78D7D]/15 shadow-sm"
               >
                 Close Manifest Registry
               </button>
            </div>

            {/* Right Sector: Telemetry & Records */}
            <div className="flex-1 p-10 overflow-y-auto custom-scrollbar relative">
               <div className="mb-10 relative z-10 flex justify-between items-end">
                 <div>
                    <h4 className="text-2xl font-bold text-[#3E3A39] tracking-tight uppercase leading-none">Neural Telemetry</h4>
                    <p className="text-[#8E7A70] font-bold text-[10px] uppercase tracking-widest mt-3 font-mono flex items-center gap-3">
                       <Activity size={14} className="text-[#B78D7D]" />
                       Operational Resource Metrics
                    </p>
                 </div>
                 {updating && <Loader2 size={24} className="animate-spin text-[#B78D7D] opacity-60" />}
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 relative z-10">
                 <div className="p-8 bg-[#F8F4F2]/30 rounded-3xl border border-[#B78D7D]/10 shadow-sm group hover:bg-white hover:border-[#B78D7D]/30 transition-all duration-500">
                    <p className="text-[10px] font-bold text-[#B2AAA6] uppercase tracking-wider mb-4 font-mono leading-none">Neural Chains</p>
                    <div className="flex items-baseline gap-3">
                      <span className="text-5xl font-black text-[#3E3A39] tracking-tighter leading-none">{selectedUser.stats?.campaigns || 0}</span>
                      <span className="text-[10px] font-bold text-[#B2AAA6] uppercase tracking-widest font-mono">Units</span>
                    </div>
                 </div>
                 <div className="p-8 bg-[#F8F4F2]/30 rounded-3xl border border-[#B78D7D]/10 shadow-sm group hover:bg-white hover:border-[#B78D7D]/30 transition-all duration-500">
                    <p className="text-[10px] font-bold text-[#B2AAA6] uppercase tracking-wider mb-4 font-mono leading-none">Identity Links</p>
                    <div className="flex items-baseline gap-3">
                      <span className="text-5xl font-black text-[#3E3A39] tracking-tighter leading-none">{selectedUser.stats?.accounts || 0}</span>
                      <span className="text-[10px] font-bold text-[#B2AAA6] uppercase tracking-widest font-mono">Nodes</span>
                    </div>
                 </div>
               </div>

               <div className="space-y-8 relative z-10">
                 <div className="flex items-center justify-between border-b border-[#B78D7D]/10 pb-6">
                    <h4 className="text-[10px] font-bold text-[#3E3A39] uppercase tracking-wider font-mono leading-none">Node Metadata Signature</h4>
                    <span className="text-[10px] font-bold text-[#B2AAA6] uppercase tracking-wider font-mono select-all bg-[#F8F4F2] px-3 py-1.5 rounded-lg border border-[#B78D7D]/5 shadow-inner">UUID: {selectedUser.id || selectedUser._id}</span>
                 </div>
                 
                 <div className="p-8 bg-rose-50 rounded-3xl border border-rose-200 relative overflow-hidden group shadow-sm">
                    <div className="flex items-center gap-4 mb-6">
                       <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-rose-500 border border-rose-200 shadow-sm transition-transform duration-700 group-hover:rotate-6">
                          <Trash2 size={24} />
                       </div>
                       <h5 className="text-xl font-bold text-rose-500 uppercase tracking-tighter leading-none">Destructive Commands</h5>
                    </div>
                    <p className="text-sm font-medium text-[#8E7A70] mb-8 leading-relaxed max-w-lg italic opacity-70">
                      "Execute terminal deletion of this identity record. Action results in immediate cluster disconnection."
                    </p>
                    <div className="flex flex-wrap gap-4">
                       <button className="px-6 py-3 bg-white hover:bg-rose-50 text-[#8E7A70] rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all active:scale-95 border border-rose-200 font-mono shadow-sm">
                         Trigger Password Reset
                       </button>
                       <button 
                         onClick={() => handleDeleteUser(selectedUser.id || selectedUser._id)}
                         className="px-6 py-3 bg-rose-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider shadow-md hover:bg-rose-600 transition-all active:scale-95 border border-white/10 font-mono"
                       >
                         Execute Purge
                       </button>
                    </div>
                 </div>
               </div>
            </div>
            
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          </div>
        </div>
      )}
    </div>
  );
}
