"use client";

import { useState, useEffect } from "react";
import { Plus, Instagram, Trash2, AlertCircle, CheckCircle, Zap, ShieldCheck, ExternalLink, Camera, RefreshCw, Activity, Calendar, Globe, Database, Cpu, Image, Hexagon, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import ConnectAccountModal from "./components/ConnectAccountModal";

export default function InstagramPage() {
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
      const res = await fetch("/api/instagram/accounts");
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
      const res = await fetch(`/api/instagram/accounts/${id}`, {
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
      <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="max-w-[1400px] mx-auto space-y-12">
        
        {/* Header Sector */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 border-b border-[#8245EF]/15 pb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
                 <span className="px-4 py-1.5 bg-[#8245EF]/10 text-[#8245EF] text-[9px] font-black uppercase tracking-[0.2em] rounded-full border border-[#8245EF]/20 flex items-center gap-2 font-mono">
                 <Camera size={14} className="opacity-80" />
                 Verified
               </span>
            </div>
            <h1 className="text-3xl font-black text-[#161932] tracking-tighter uppercase leading-tight">Instagram</h1>
            <p className="text-[#64748b] mt-3 text-lg font-medium max-w-2xl leading-relaxed">Connect and manage your Instagram accounts to automate your engagement.</p>
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
                   <Image size={20} className="text-[#8245EF] animate-pulse" />
                </div>
             </div>
             <p className="text-[#94a3b8] font-black uppercase tracking-[0.3em] font-mono text-[9px]">Syncing accounts...</p>
          </div>
        ) : accounts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[2.5rem] border border-dashed border-[#8245EF]/20 text-center shadow-sm p-12 max-w-3xl mx-auto relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#8245EF]/5 rounded-full blur-3xl group-hover:bg-[#8245EF]/10 transition-colors" />
            <div className="w-20 h-20 bg-[#FCF8FE] text-[#8245EF] rounded-[1.5rem] flex items-center justify-center mb-10 shadow-inner group-hover:rotate-6 transition-all duration-700">
               <Instagram size={44} />
            </div>
            <h2 className="text-2xl font-black text-[#161932] uppercase tracking-tighter">No Accounts Found</h2>
            <p className="text-[#64748b] mt-4 max-w-md mx-auto leading-relaxed text-lg">Connect your first Instagram account to start automating your visual outreach and engagement.</p>
            <button
              onClick={() => {
                setSelectedAccount(null);
                setIsConnectModalOpen(true);
              }}
              className="mt-10 px-10 py-5 bg-[#8245EF]/10 text-[#8245EF] rounded-xl font-black text-[10px] uppercase tracking-[0.4em] hover:bg-[#8245EF] hover:text-white transition-all border border-[#8245EF]/20"
            >
              Get Started Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {accounts.map((account) => (
              <div
                key={account._id}
                onClick={() => router.push(`/instagram/${account._id}/campaigns`)}
                className="group bg-white rounded-[2rem] border border-[#8245EF]/10 transition-all duration-700 flex flex-col cursor-pointer relative overflow-hidden shadow-sm hover:shadow-[0_20px_40px_rgba(130, 69, 239,0.08)] hover:-translate-y-2"
              >
                <div className={`h-1.5 w-full absolute top-0 left-0 z-20 ${account.status === "Connected" ? "bg-emerald-500" : "bg-rose-500"}`} />
                
                <div className="p-8 pb-6 flex-1 relative z-10 flex flex-col">
                  <div className="flex justify-between items-start mb-8">
                    <div className="w-16 h-16 bg-[#FCF8FE] text-[#8245EF] rounded-[1.25rem] flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 border border-[#8245EF]/10">
                      <Instagram size={36} />
                    </div>
                    <button
                      onClick={(e) => handleDelete(e, account._id)}
                      className="text-[#94a3b8] hover:text-rose-500 transition-all p-3 hover:bg-rose-500/5 bg-[#FCF8FE]/50 border border-transparent rounded-xl opacity-0 group-hover:opacity-100 active:scale-90"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                  <h3 className="font-black text-xl text-[#161932] mb-1 truncate tracking-tighter uppercase group-hover:text-[#8245EF] transition-colors">{account.email}</h3>
                  <p className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.2em] mb-10 font-mono">ID: {account._id.slice(-8).toUpperCase()}</p>
                  
                  <div className="flex items-center justify-between mb-8">
                     <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest border shadow-sm font-mono leading-none ${account.status === "Connected" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"}`}>
                           {account.status === "Connected" ? <CheckCircle size={10} /> : <AlertCircle size={10} />}
                           {account.status === "Connected" ? "Active" : account.status || "Error"}
                        </span>
                     </div>
                    
                    {account.status !== "Connected" && (
                        <button 
                            onClick={(e) => handleReconnect(e, account)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#8245EF] text-white text-[8px] font-black uppercase tracking-widest border border-white/10 hover:bg-[#6d28d9] transition-all shadow-md font-mono active:scale-95"
                        >
                            <RefreshCw size={10} className="animate-spin-slow" />
                            Reconnect
                        </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 p-6 bg-[#FCF8FE]/50 rounded-[1.5rem] border border-[#8245EF]/10 group-hover:bg-white transition-all duration-500 shadow-inner mt-auto">
                    <div className="text-center">
                      <p className="text-[8px] font-black text-[#94a3b8] uppercase tracking-[0.3em] mb-2 font-mono">Posts</p>
                      <p className="font-black text-[#161932] text-2xl tracking-tighter leading-none">--</p>
                    </div>
                    <div className="text-center border-l border-[#8245EF]/10">
                      <p className="text-[8px] font-black text-[#94a3b8] uppercase tracking-[0.3em] mb-2 font-mono">Replies</p>
                      <p className="font-black text-[#161932] text-2xl tracking-tighter leading-none">--</p>
                    </div>
                  </div>
                </div>

                <div className="px-8 py-6 bg-[#FCF8FE]/30 border-t border-[#8245EF]/10 flex justify-between items-center group-hover:bg-[#FCF8FE]/70 transition-all relative z-10">
                  <span className="text-[9px] font-black text-[#94a3b8] uppercase tracking-[0.3em] flex items-center gap-2 font-mono">
                    <Activity size={14} className="text-[#8245EF] animate-pulse" />
                    Verified
                  </span>
                  <span className="text-[9px] font-black text-[#8245EF] uppercase tracking-[0.3em] flex items-center gap-3 font-mono">
                    Dashboard <ChevronRight size={14} />
                  </span>
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
        initialEmail={selectedAccount?.email}
      />
    </div>
  );
}
