"use client";

import { useState, useEffect } from "react";
import { Plus, Facebook, Trash2, AlertCircle, CheckCircle, ShieldCheck, ExternalLink, Camera, RefreshCw, Activity, Calendar, Globe, Database, Target, Cpu, Hexagon } from "lucide-react";
import { useRouter } from "next/navigation";
import ConnectAccountModal from "./components/ConnectAccountModal";
import AccountDetailsModal from "./components/AccountDetailsModal";

export default function FacebookPage() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/facebook/accounts");
      if (res.ok) {
        const data = await res.json();
        setAccounts(data);
      }
    } catch (error) {
      console.error("Failed to fetch accounts", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to remove this account?")) return;

    try {
      const res = await fetch(`/api/facebook/accounts/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchAccounts();
      } else {
        alert("Failed to delete account");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  const handleReconnect = (e, account) => {
    e.stopPropagation();
    setSelectedAccount(account);
    setIsConnectModalOpen(true);
  };

  return (
    <div className="w-full font-sans pb-32 p-6 md:p-10 lg:p-12 bg-[#FCF8FE]/30 min-h-screen">
      <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <div className="max-w-[1400px] mx-auto space-y-12">
        
        {/* Header Sector */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 border-b border-[#8245EF]/15 pb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
                 <span className="px-4 py-1.5 bg-[#8245EF]/10 text-[#8245EF] text-[9px] font-black uppercase tracking-[0.2em] rounded-full border border-[#8245EF]/20 flex items-center gap-2 font-mono">
                 <ShieldCheck size={14} className="opacity-80" />
                 Verified
               </span>
            </div>
            <h1 className="text-3xl font-black text-[#161932] tracking-tighter uppercase leading-tight">Facebook</h1>
            <p className="text-[#64748b] mt-3 text-lg font-medium max-w-2xl leading-relaxed">Connect and manage your Facebook accounts safely.</p>
          </div>
          <button
            onClick={() => {
                setSelectedAccount(null);
                setIsConnectModalOpen(true);
            }}
            className="group px-10 py-5 bg-[#8245EF] text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-[1.25rem] hover:bg-[#6d28d9] transition-all shadow-[0_15px_30px_rgba(130, 69, 239,0.2)] flex items-center justify-center gap-3 active:scale-95 border border-white/10 font-mono"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500" />
            Connect Account
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 space-y-8 text-center">
             <div className="relative">
                <div className="animate-spin w-12 h-12 border-[4px] border-[#8245EF]/10 border-t-[#8245EF] rounded-full shadow-sm" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <Globe size={20} className="text-[#8245EF] animate-pulse" />
                </div>
             </div>
             <p className="text-[#94a3b8] font-black uppercase tracking-[0.3em] font-mono text-[9px]">Syncing accounts...</p>
          </div>
        ) : accounts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[2.5rem] border border-dashed border-[#8245EF]/20 text-center shadow-sm p-12 max-w-3xl mx-auto relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#8245EF]/5 rounded-full blur-3xl group-hover:bg-[#8245EF]/10 transition-colors" />
            <div className="w-20 h-20 bg-[#FCF8FE] text-[#8245EF] rounded-3xl flex items-center justify-center mb-8 shadow-inner">
               <Facebook size={40} />
            </div>
            <h2 className="text-2xl font-black text-[#161932] uppercase tracking-tighter">No Accounts Found</h2>
            <p className="text-[#64748b] mt-4 max-w-md mx-auto leading-relaxed">Connect your first Facebook account to start managing your presence and automation.</p>
            <button 
              onClick={() => setIsConnectModalOpen(true)}
              className="mt-10 px-10 py-4 bg-[#8245EF]/10 text-[#8245EF] rounded-xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-[#8245EF] hover:text-white transition-all border border-[#8245EF]/20"
            >
              Get Started Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {accounts.map((account) => (
              <div 
                key={account._id}
                onClick={() => setSelectedAccount(account)}
                className="group bg-white rounded-[2rem] border border-[#8245EF]/10 shadow-sm hover:shadow-[0_20px_40px_rgba(130, 69, 239,0.08)] transition-all cursor-pointer relative overflow-hidden flex flex-col p-8"
              >
                 <div className="flex items-start justify-between mb-8">
                    <div className="relative">
                        <div className="w-16 h-16 rounded-[1.25rem] overflow-hidden border-4 border-[#FCF8FE] shadow-md group-hover:scale-110 transition-transform duration-500">
                           <img 
                             src={account.profilePicture || `https://ui-avatars.com/api/?name=${account.name}&background=B78D7D&color=fff`} 
                             alt={account.name}
                             className="w-full h-full object-cover"
                           />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#1877F2] text-white rounded-lg flex items-center justify-center border-2 border-white shadow-sm scale-90">
                           <Facebook size={14} fill="currentColor" />
                        </div>
                    </div>
                    <div className="flex gap-2">
                       <button
                         onClick={(e) => handleReconnect(e, account)}
                         className="p-3 bg-[#FCF8FE] text-[#94a3b8] hover:text-[#8245EF] rounded-xl hover:bg-[#8245EF]/10 transition-all border border-[#8245EF]/5 active:scale-90"
                         title="Reconnect"
                       >
                         <RefreshCw size={16} />
                       </button>
                       <button
                         onClick={(e) => handleDelete(e, account._id)}
                         className="p-3 bg-[#FCF8FE] text-[#94a3b8] hover:text-red-500 rounded-xl hover:bg-red-50 transition-all border border-[#8245EF]/5 active:scale-90"
                         title="Remove Account"
                       >
                         <Trash2 size={16} />
                       </button>
                    </div>
                 </div>

                 <div className="space-y-1">
                    <h3 className="text-xl font-black text-[#161932] tracking-tighter uppercase leading-tight group-hover:text-[#8245EF] transition-colors line-clamp-1">{account.name}</h3>
                    <p className="text-[10px] font-black text-[#94a3b8] uppercase tracking-widest font-mono">UID: {account.facebookId?.substring(0, 12)}...</p>
                 </div>

                 <div className="grid grid-cols-2 gap-3 mt-8">
                    <div className="bg-[#FCF8FE]/50 p-4 rounded-2xl border border-[#8245EF]/5 group-hover:bg-[#FCF8FE] transition-colors">
                       <p className="text-[8px] font-black text-[#94a3b8] uppercase tracking-widest font-mono mb-1">Status</p>
                       <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${account.status === "ACTIVE" ? "bg-emerald-500" : "bg-amber-500"} shadow-sm`} />
                          <span className="text-[9px] font-black text-[#161932] uppercase tracking-widest font-mono">{account.status}</span>
                       </div>
                    </div>
                    {account.lastUsed && (
                       <div className="bg-[#FCF8FE]/50 p-4 rounded-2xl border border-[#8245EF]/5 group-hover:bg-[#FCF8FE] transition-colors">
                          <p className="text-[8px] font-black text-[#94a3b8] uppercase tracking-widest font-mono mb-1">Last Sync</p>
                          <div className="flex items-center gap-2">
                             <Calendar size={10} className="text-[#8245EF]" />
                             <span className="text-[9px] font-black text-[#161932] uppercase tracking-widest font-mono">{new Date(account.lastUsed).toLocaleDateString()}</span>
                          </div>
                       </div>
                    )}
                 </div>

                 <div className="mt-8 pt-6 border-t border-[#8245EF]/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[8px] font-black uppercase tracking-widest border border-emerald-100">
                          <Activity size={10} /> Active
                       </span>
                    </div>
                    <button className="text-[9px] font-black text-[#8245EF] uppercase tracking-widest font-mono flex items-center gap-2 group/btn">
                       Enter Dashboard <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                 </div>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>

      <ConnectAccountModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        onAccountConnected={fetchAccounts}
        editAccount={selectedAccount}
      />
      
      {selectedAccount && !isConnectModalOpen && (
        <AccountDetailsModal
          account={selectedAccount}
          onClose={() => setSelectedAccount(null)}
        />
      )}
    </div>
  );
}