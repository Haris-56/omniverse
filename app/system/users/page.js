"use client";

import { useState, useEffect } from "react";
import { 
  Search, Filter, MoreVertical, 
  UserCheck, UserX, Shield, 
  ExternalLink, Mail, ArrowUpDown,
  History, CreditCard, Network,
  Loader2, CheckCircle2, AlertCircle
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
    <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">User Management</h1>
          <p className="text-slate-500 font-medium mt-1">Control access, monitor usage, and manage member configurations.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchData} className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all flex items-center gap-2 active:scale-95">
            <RefreshCw className={loading ? "animate-spin" : ""} size={16} /> Refresh Fleet
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search users by name, email or ID..." 
            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/20 font-medium text-slate-900 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
           <Loader2 size={40} className="text-indigo-600 animate-spin" />
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scanning Grid Identities...</p>
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 transition-colors">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">User Details</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Plan</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Campaigns</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Joined</th>
                <th className="px-8 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr key={user.id || user._id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-lg uppercase border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        {user.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 text-base">{user.name || "N/A"}</h4>
                        <p className="text-slate-400 font-bold text-xs">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-indigo-500" />
                      <span className="font-bold text-slate-700 text-sm">{user.plan}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${user.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                      {user.status === 'Active' ? <UserCheck size={12} /> : <UserX size={12} />}
                      {user.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-black">
                      {user.stats?.campaigns || 0}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                     <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">
                       {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '---'}
                     </p>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      onClick={() => setSelectedUser(user)}
                      className="px-4 py-2 bg-slate-50 border border-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all active:scale-95 shadow-sm"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                   <td colSpan="6" className="py-24 text-center">
                      <div className="flex flex-col items-center gap-4 max-w-xs mx-auto">
                        <div className="w-20 h-20 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-200">
                          <UserX size={40} />
                        </div>
                        <p className="text-slate-400 font-bold italic">No matching identities found in current perimeter.</p>
                      </div>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {/* User Detail View (Modal) */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in" onClick={() => setSelectedUser(null)} />
          <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-300 max-h-[90vh]">
            
            {/* Left Panel: Profile */}
            <div className="md:w-1/3 bg-slate-50 p-10 flex flex-col items-center border-r border-slate-100 shrink-0">
               <div className="w-24 h-24 bg-white rounded-[2rem] shadow-xl shadow-slate-200 flex items-center justify-center text-3xl font-black text-indigo-600 mb-6 border border-slate-100">
                 {selectedUser.name?.charAt(0)}
               </div>
               <h3 className="text-2xl font-black text-slate-900 mb-1">{selectedUser.name}</h3>
               <p className="text-slate-400 font-bold text-sm mb-8">{selectedUser.email}</p>
               
               <div className="w-full space-y-4 mb-8">
                  <div className="p-5 bg-white rounded-3xl border border-slate-100 shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Subscription Tier</p>
                    <div className="space-y-3">
                      <select 
                        value={selectedUser.planId || ""}
                        disabled={updating}
                        onChange={(e) => handleUpdateUser(selectedUser.id || selectedUser._id, { planId: e.target.value })}
                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black text-indigo-600 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/20 transition-all appearance-none cursor-pointer"
                      >
                        <option value="" disabled>Select User Plan...</option>
                        {plans.length === 0 && <option disabled>Loading protocols...</option>}
                        {plans.map(p => (
                          <option key={p._id} value={p._id}>
                            Tier: {p.name} — ${p.price}/mo
                          </option>
                        ))}
                      </select>
                      {plans.length === 0 && (
                        <p className="text-[10px] font-bold text-red-500 mt-2 flex items-center gap-1">
                          <AlertCircle size={10} /> Plan synchronization failing. Check backend seeding.
                        </p>
                      )}
                      <p className="text-[10px] font-bold text-slate-400 italic px-1">
                        * Upgrading will instantly expand the user's campaign and email limits.
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-5 bg-white rounded-3xl border border-slate-100 shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">System Status</p>
                    <div className="flex gap-2">
                       <button 
                         onClick={() => handleUpdateUser(selectedUser.id || selectedUser._id, { status: "Active" })}
                         className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all ${selectedUser.status === 'Active' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                       >Active</button>
                       <button 
                         onClick={() => handleUpdateUser(selectedUser.id || selectedUser._id, { status: "Suspended" })}
                         className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all ${selectedUser.status === 'Suspended' ? 'bg-red-500 text-white shadow-lg shadow-red-100' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                       >Suspend</button>
                    </div>
                  </div>
               </div>

               <button 
                 onClick={() => setSelectedUser(null)}
                 className="w-full py-4 border border-slate-200 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all mt-auto"
               >
                 Close Manifest
               </button>
            </div>

            {/* Right Panel: Stats & Details */}
            <div className="flex-1 p-10 overflow-y-auto custom-scrollbar">
               <div className="mb-10">
                 <h4 className="text-xl font-black text-slate-900 tracking-tight">Telemetry Overview</h4>
                 <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Resource consumption metrics</p>
               </div>

               <div className="grid grid-cols-2 gap-4 mb-10">
                 <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Campaigns</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-slate-900">{selectedUser.stats?.campaigns || 0}</span>
                      {updating && <Loader2 size={14} className="animate-spin text-indigo-500" />}
                    </div>
                 </div>
                 <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Connected Accounts</p>
                    <span className="text-2xl font-black text-slate-900">{selectedUser.stats?.accounts || 0}</span>
                 </div>
               </div>

               <div className="space-y-6">
                 <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Metadata</h4>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: {selectedUser.id || selectedUser._id}</span>
                 </div>
                 
                 <div className="p-6 bg-amber-50 rounded-[2rem] border border-amber-100 border-dashed relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-4 opacity-10 rotate-12 group-hover:rotate-45 transition-transform duration-700">
                       <Shield size={64} />
                    </div>
                    <h5 className="text-sm font-black text-amber-700 mb-2 flex items-center gap-2 relative z-10">
                      <Shield size={16} /> Admin Authority
                    </h5>
                    <p className="text-xs font-medium text-amber-600/80 mb-6 leading-relaxed relative z-10 max-w-sm">
                      Changes to the plan or status take effect immediately. Ensure user verification before applying "Agency" or "Professional" levels.
                    </p>
                    <div className="flex gap-3 relative z-10">
                       <button className="px-5 py-2.5 bg-amber-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-amber-200/50 hover:bg-amber-700 transition-all active:scale-95">
                         Force Password Reset
                       </button>
                       <button 
                         onClick={() => handleDeleteUser(selectedUser.id || selectedUser._id)}
                         className="px-5 py-2.5 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-red-200/50 hover:bg-red-700 transition-all active:scale-95"
                       >
                         Delete User Record
                       </button>
                    </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RefreshCw(props) {
  return (
    <svg 
      {...props}
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" 
      viewBox="0 0 24 24" 
      fill="none" stroke="currentColor" 
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
      <path d="M21 3v5h-5"/>
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
      <path d="M3 21v-5h5"/>
    </svg>
  );
}
