"use client";

import { useState, useEffect } from "react";
import { Plus, Linkedin, Trash2, AlertCircle, CheckCircle, ShieldCheck, ExternalLink, RefreshCw, Briefcase, Activity, Calendar, Globe, Database, Target, Cpu, Hexagon, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import ConnectAccountModal from "./components/ConnectAccountModal";
import AccountDetailsModal from "./components/AccountDetailsModal";

export default function LinkedInPage() {
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
      const res = await fetch("/api/linkedin/accounts");
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
      const res = await fetch(`/api/linkedin/accounts/${id}`, {
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
    <div className="w-full pb-32 p-6 md:p-10 lg:p-12 min-h-screen">
      <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <div className="max-w-[1200px] mx-auto space-y-12">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 border-b border-gray-100 pb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
                 <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-full border border-green-100 flex items-center gap-2">
                 <ShieldCheck size={14} />
                 Safe
               </span>
            </div>
            <h1>LinkedIn</h1>
            <p>Connect and manage your LinkedIn accounts here.</p>
          </div>
          <button
            onClick={() => {
                setSelectedAccount(null);
                setIsConnectModalOpen(true);
            }}
            className="group px-8 py-4 bg-[#8245EF] text-white text-sm font-bold rounded-xl hover:bg-[#6d28d9] transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500" />
            Add Account
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 space-y-4 text-center">
             <div className="relative">
                <div className="animate-spin w-12 h-12 border-[4px] border-[#8245EF]/10 border-t-[#8245EF] rounded-full shadow-sm" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <Briefcase size={20} className="text-[#8245EF] animate-pulse" />
                </div>
             </div>
             <p className="text-gray-500 font-semibold">Getting your accounts...</p>
          </div>
        ) : accounts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[2rem] border border-dashed border-gray-200 text-center p-12 max-w-2xl mx-auto shadow-sm">
            <div className="w-16 h-16 bg-gray-50 text-[#8245EF] rounded-2xl flex items-center justify-center mb-6">
               <Linkedin size={32} />
            </div>
            <h2>No Accounts Found</h2>
            <p className="max-w-md mx-auto">Add your LinkedIn account to start talking to people.</p>
            <button 
              onClick={() => setIsConnectModalOpen(true)}
              className="mt-8 px-8 py-3 bg-[#8245EF]/10 text-[#8245EF] rounded-xl font-bold hover:bg-[#8245EF] hover:text-white transition-all border border-[#8245EF]/10"
            >
              Add Account
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {accounts.map((account) => (
              <div 
                key={account._id}
                onClick={() => setSelectedAccount(account)}
                className="group bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden flex flex-col p-8"
              >
                 <div className="flex items-start justify-between mb-6">
                    <div className="relative">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-gray-50 shadow-sm group-hover:scale-105 transition-transform duration-500">
                           <img 
                             src={account.profilePicture || `https://ui-avatars.com/api/?name=${account.name}&background=B78D7D&color=fff`} 
                             alt={account.name}
                             className="w-full h-full object-cover"
                           />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#0A66C2] text-white rounded-md flex items-center justify-center border-2 border-white shadow-sm">
                           <Linkedin size={12} fill="currentColor" />
                        </div>
                    </div>
                    <div className="flex gap-2">
                       <button
                         onClick={(e) => handleReconnect(e, account)}
                         className="p-2 bg-gray-50 text-gray-400 hover:text-[#8245EF] rounded-lg hover:bg-[#8245EF]/10 transition-all active:scale-90"
                         title="Reconnect"
                       >
                         <RefreshCw size={14} />
                       </button>
                       <button
                         onClick={(e) => handleDelete(e, account._id)}
                         className="p-2 bg-gray-50 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-all active:scale-90"
                         title="Remove Account"
                       >
                         <Trash2 size={14} />
                       </button>
                    </div>
                 </div>

                 <div className="space-y-1">
                    <h3 className="group-hover:text-[#8245EF] transition-colors line-clamp-1">{account.name}</h3>
                    <p className="text-xs text-gray-500 line-clamp-1">{account.headline || "LinkedIn User"}</p>
                 </div>

                 <div className="grid grid-cols-2 gap-3 mt-6">
                    <div className="bg-gray-50/50 p-3 rounded-xl border border-gray-50">
                       <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Status</p>
                       <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${account.status === "ACTIVE" ? "bg-emerald-500" : "bg-amber-500"} shadow-sm`} />
                          <span className="text-[11px] font-bold text-gray-700">{account.status}</span>
                       </div>
                    </div>
                    <div className="bg-gray-50/50 p-3 rounded-xl border border-gray-50">
                       <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Last used</p>
                       <div className="flex items-center gap-2">
                          <Calendar size={10} className="text-[#8245EF]" />
                          <span className="text-[11px] font-bold text-gray-700">{account.lastUsed ? new Date(account.lastUsed).toLocaleDateString() : "Never"}</span>
                       </div>
                    </div>
                 </div>

                 <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <span className="flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-600 rounded-md text-[10px] font-bold border border-green-100">
                          <Activity size={10} /> Safe
                       </span>
                    </div>
                    <button 
                      onClick={() => router.push(`/linkedin/${account._id}/campaigns`)}
                      className="text-xs font-bold text-[#8245EF] flex items-center gap-1 group/btn"
                    >
                       See my plans <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
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
