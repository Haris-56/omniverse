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
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-[#8245EF]/10 pb-16">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
               <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-full border border-green-100 flex items-center gap-2">
                 <ShieldCheck size={14} className="opacity-80" />
                 Admin Panel
               </span>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 tracking-tight">Users</h1>
            <p className="text-gray-500 text-xl font-medium">Manage users and their account permissions.</p>
          </div>
          <button 
            onClick={fetchData}
            className="group px-8 py-4 bg-white text-gray-900 font-bold uppercase text-xs tracking-widest rounded-xl flex items-center justify-center gap-3 transition-all shadow-sm hover:bg-gray-50 active:scale-95 border border-gray-100"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-700"} /> 
            Refresh
          </button>
        </div>

        {/* Global Search Interface */}
          <div className="relative z-10">
            <label className="text-xs font-bold text-gray-400 ml-4 mb-4 block">Search Users</label>
            <div className="relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
              <input 
                type="text" 
                placeholder="Search by name, email, or ID..." 
                className="w-full pl-16 pr-8 py-5 bg-gray-50/50 border border-gray-100 rounded-2xl outline-none focus:border-[#8245EF]/40 font-bold text-gray-900 transition-all shadow-sm placeholder:text-gray-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

        {/* Grid Display */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-48 space-y-10 animate-pulse text-center">
             <div className="relative">
                <div className="w-24 h-24 border-8 border-[#FCF8FE] border-t-[#8245EF] rounded-full animate-spin shadow-inner" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <Hexagon size={40} className="text-[#8245EF]" />
                </div>
             </div>
             <p className="text-xs font-bold text-gray-400">Loading users...</p>
          </div>
        ) : (
          <div className="bg-white rounded-[4rem] overflow-hidden relative border border-[#8245EF]/10 shadow-sm">
             <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 text-[10px] font-bold uppercase text-gray-400 tracking-widest border-b border-gray-100">
                  <tr>
                    <th className="p-8">User</th>
                    <th className="p-8">Plan</th>
                    <th className="p-8">Status</th>
                    <th className="p-8 text-center">Activity</th>
                    <th className="p-8">Joined</th>
                    <th className="p-8 text-right px-12">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#8245EF]/5">
                  {filteredUsers.map((user) => (
                    <tr key={user.id || user._id} className="hover:bg-[#FCF8FE]/30 transition-all group cursor-default">
                      <td className="p-12">
                        <div className="flex items-center gap-8">
                          <div className="w-16 h-16 bg-gray-50 border border-gray-100 text-[#8245EF] rounded-2xl flex items-center justify-center font-bold text-2xl shadow-sm group-hover:scale-105 transition-all duration-500">
                            {user.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 text-lg leading-none">{user.name || "User"}</h4>
                            <p className="text-gray-400 font-bold text-[11px] mt-2 group-hover:text-[#8245EF] transition-colors">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-12">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-[#8245EF]" />
                          <span className="font-bold text-gray-500 text-[11px] uppercase tracking-wider">{user.plan}</span>
                        </div>
                      </td>
                      <td className="p-12">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${user.status === 'Active' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-rose-50 text-rose-500 border-rose-100'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-green-500' : 'bg-rose-500'}`} />
                          {user.status}
                        </span>
                      </td>
                      <td className="p-12 text-center">
                        <span className="px-3 py-1 bg-gray-50 border border-gray-100 text-gray-500 rounded-lg text-[10px] font-bold uppercase">
                          {user.stats?.campaigns || 0} Plans
                        </span>
                      </td>
                      <td className="p-12">
                         <p className="text-gray-400 font-bold text-[11px] uppercase tracking-wider">
                           {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '---'}
                         </p>
                      </td>
                      <td className="p-12 text-right px-16">
                        <button 
                          onClick={() => setSelectedUser(user)}
                          className="px-6 py-2 bg-white border border-gray-100 text-gray-400 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-[#8245EF] hover:text-white transition-all active:scale-95"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                       <td colSpan="6" className="py-48 text-center opacity-30">
                          <div className="flex flex-col items-center gap-10 max-w-sm mx-auto">
                            <div className="w-28 h-28 bg-[#FCF8FE] rounded-[3.5rem] border border-[#8245EF]/10 flex items-center justify-center text-[#94a3b8] shadow-sm">
                              <UserX size={56} />
                            </div>
                             <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No users found</p>
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
          <div className="fixed inset-0 bg-[#161932]/60 backdrop-blur-xl animate-in fade-in duration-500" onClick={() => setSelectedUser(null)} />
          
          <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-purple-500/10 relative z-10 overflow-hidden flex flex-col xl:flex-row animate-in zoom-in-95 duration-500 my-auto">
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
            
            {/* Left Sector: Core Identity */}
            <div className="xl:w-2/5 bg-purple-50/50 p-10 flex flex-col items-center border-r border-purple-500/10 shrink-0 relative">
              <div className="w-24 h-24 bg-white rounded-2xl shadow-sm flex items-center justify-center text-4xl font-black text-purple-600 mb-6 border border-purple-500/10 group relative">
                <span className="relative z-10">{selectedUser.name?.charAt(0)}</span>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedUser.name}</h3>
              <p className="text-gray-400 font-bold text-xs mb-8">{selectedUser.email}</p>
              
              <div className="w-full space-y-6 mb-8">
                <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">User Plan</p>
                  <div className="relative group">
                    <select 
                      value={selectedUser.planId || ""}
                      disabled={updating}
                      onChange={(e) => handleUpdateUser(selectedUser.id || selectedUser._id, { planId: e.target.value })}
                      className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-900 outline-none focus:border-purple-500/40 transition-all appearance-none cursor-pointer"
                    >
                      <option value="" disabled>Select Plan...</option>
                      {plans.map(p => (
                        <option key={p._id} value={p._id}>
                          {p.name.toUpperCase()} — ${p.price}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <Settings size={16} />
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Account Status</p>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => handleUpdateUser(selectedUser.id || selectedUser._id, { status: "Active" })}
                      disabled={updating}
                      className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border ${selectedUser.status === 'Active' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-gray-50 text-gray-400 border-gray-100'}`}
                    >Active</button>
                    <button 
                      onClick={() => handleUpdateUser(selectedUser.id || selectedUser._id, { status: "Suspended" })}
                      disabled={updating}
                      className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border ${selectedUser.status === 'Suspended' ? 'bg-rose-50 text-rose-500 border-rose-200' : 'bg-gray-50 text-gray-400 border-gray-100'}`}
                    >Suspend</button>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setSelectedUser(null)}
                className="w-full py-4 bg-white text-gray-400 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:text-gray-900 hover:bg-gray-50 transition-all mt-auto border border-gray-100"
              >
                Close
              </button>
            </div>

            {/* Right Sector: Activity */}
            <div className="flex-1 p-10 overflow-y-auto custom-scrollbar relative">
              <div className="mb-10 flex justify-between items-end">
                <div>
                  <h4 className="text-2xl font-bold text-gray-900">User Activity</h4>
                  <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-2 flex items-center gap-2">
                    <Activity size={14} className="text-purple-600" />
                    Usage Stats
                  </p>
                </div>
                {updating && <Loader2 size={24} className="animate-spin text-purple-600 opacity-60" />}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100 shadow-sm">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Plans</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-gray-900">{selectedUser.stats?.campaigns || 0}</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Total</span>
                  </div>
                </div>
                <div className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100 shadow-sm">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Accounts</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-gray-900">{selectedUser.stats?.accounts || 0}</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Nodes</span>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <h4 className="text-[10px] font-bold text-gray-900 uppercase tracking-widest leading-none">User ID</h4>
                  <span className="text-[10px] font-bold text-gray-400 select-all bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">{selectedUser.id || selectedUser._id}</span>
                </div>
                <div className="p-6 bg-rose-50 rounded-2xl border border-rose-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-rose-500 border border-rose-100">
                      <Trash2 size={20} />
                    </div>
                    <h5 className="text-lg font-bold text-rose-500 uppercase tracking-tight">Danger Zone</h5>
                  </div>
                  <p className="text-xs font-medium text-gray-500 mb-6 leading-relaxed">
                    Delete this user account. This action cannot be undone.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button className="px-4 py-2 bg-white text-gray-500 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all border border-gray-100 shadow-sm">
                      Reset Password
                    </button>
                    <button 
                      onClick={() => handleDeleteUser(selectedUser.id || selectedUser._id)}
                      className="px-4 py-2 bg-rose-500 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-md hover:bg-rose-600 transition-all border border-white/10"
                    >
                      Delete User
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
