"use client";

import { useState, useEffect } from "react";
import { Plus, Mail, Trash2, AlertCircle, CheckCircle, Zap, ShieldCheck, ExternalLink, Send, FileText, Activity, Calendar, Globe, Database, Target, Cpu, Hexagon, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import ConnectAccountModal from "./components/ConnectAccountModal";
import AccountDetailsModal from "./components/AccountDetailsModal";

export default function EmailPage() {
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
      const res = await fetch("/api/email/accounts");
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
      const res = await fetch(`/api/email/accounts/${id}`, {
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

  return (
    <div className="w-full font-sans pb-32 p-6 md:p-10 lg:p-12 bg-[#FCF8FE]/30 min-h-screen">
      <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="max-w-[1400px] mx-auto space-y-12">
        
        {/* Header Sector */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 border-b border-[#8245EF]/15 pb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
                 <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-full border border-green-100 flex items-center gap-2">
                 <ShieldCheck size={14} className="opacity-80" />
                 Active
               </span>
            </div>
            <h1>Email Accounts</h1>
            <p className="text-gray-500 mt-2 text-lg">Add and manage your email accounts here.</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => router.push("/email/templates")}
              className="px-6 py-4 bg-white border border-gray-100 text-gray-900 text-xs font-bold rounded-xl hover:bg-gray-50 transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95"
            >
              <FileText size={16} className="text-[#8245EF]" />
              Templates
            </button>
            <button
              onClick={() => setIsConnectModalOpen(true)}
              className="px-8 py-4 bg-[#8245EF] text-white text-xs font-bold rounded-xl hover:bg-[#6d28d9] transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95 border border-white/10"
            >
              <Plus size={18} />
              Add Account
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 space-y-8 text-center">
             <div className="relative">
                <div className="animate-spin w-12 h-12 border-[4px] border-[#8245EF]/10 border-t-[#8245EF] rounded-full shadow-sm" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <Mail size={20} className="text-[#8245EF] animate-pulse" />
                </div>
             </div>
              <p className="text-gray-400 font-bold text-xs">Looking for accounts...</p>
          </div>
        ) : accounts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[2.5rem] border border-dashed border-[#8245EF]/20 text-center shadow-sm p-12 max-w-3xl mx-auto relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#8245EF]/5 rounded-full blur-3xl group-hover:bg-[#8245EF]/10 transition-colors" />
            <div className="w-20 h-20 bg-[#FCF8FE] text-[#8245EF] rounded-[1.5rem] flex items-center justify-center mb-10 shadow-inner group-hover:rotate-6 transition-all duration-700">
               <Send size={44} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">No accounts added yet</h2>
            <p className="text-gray-500 mt-2 max-w-md mx-auto text-lg">Add your first email account to start sending messages.</p>
            <button
              onClick={() => setIsConnectModalOpen(true)}
              className="mt-8 px-8 py-4 bg-[#8245EF] text-white rounded-xl font-bold text-xs uppercase transition-all shadow-md"
            >
              Add Account
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {accounts.map((account) => (
              <div
                key={account._id}
                onClick={() => router.push(`/email/${account._id}/campaigns`)}
                className="group bg-white rounded-[2rem] border border-[#8245EF]/10 transition-all duration-700 flex flex-col cursor-pointer relative overflow-hidden shadow-sm hover:shadow-[0_20px_40px_rgba(130, 69, 239,0.08)] hover:-translate-y-2"
              >
                <div className="h-1.5 w-full absolute top-0 left-0 z-20 bg-[#8245EF]" />
                
                <div className="p-8 pb-6 flex-1 relative z-10 flex flex-col">
                  <div className="flex justify-between items-start mb-8">
                    <div className="w-16 h-16 bg-[#FCF8FE] text-[#8245EF] rounded-[1.25rem] flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 border border-[#8245EF]/10">
                      <Mail size={36} />
                    </div>
                    <button
                      onClick={(e) => handleDelete(e, account._id)}
                      className="text-[#94a3b8] hover:text-rose-500 transition-all p-3 hover:bg-rose-500/5 bg-[#FCF8FE]/50 border border-transparent rounded-xl opacity-0 group-hover:opacity-100 active:scale-90"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                  <h3 className="font-bold text-xl text-gray-900 mb-1 truncate">{account.email}</h3>
                  <p className="text-xs text-gray-400 mb-6">Connected</p>
                  
                  <div className="flex items-center justify-between mb-8">
                     <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-green-50 text-green-600 text-[10px] font-bold border border-green-100 shadow-sm leading-none">
                           <CheckCircle size={10} /> Connected
                        </span>
                     </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 p-6 bg-[#FCF8FE]/50 rounded-[1.5rem] border border-[#8245EF]/10 group-hover:bg-white transition-all duration-500 shadow-inner mt-auto">
                     <div className="text-center">
                       <p className="text-[10px] font-bold text-gray-400 mb-1">Sent</p>
                       <p className="font-bold text-gray-900 text-xl">--</p>
                     </div>
                     <div className="text-center border-l border-gray-100">
                       <p className="text-[10px] font-bold text-gray-400 mb-1">Replies</p>
                       <p className="font-bold text-gray-900 text-xl">--</p>
                     </div>
                  </div>
                </div>

                <div className="px-8 py-6 bg-[#FCF8FE]/30 border-t border-[#8245EF]/10 flex justify-between items-center group-hover:bg-[#FCF8FE]/70 transition-all relative z-10">
                   <span className="text-[10px] font-bold text-gray-400 flex items-center gap-2">
                    <Activity size={14} className="text-[#8245EF] animate-pulse" />
                    Running
                  </span>
                  <span className="text-[10px] font-bold text-[#8245EF] flex items-center gap-2">
                    View Plans <ChevronRight size={14} />
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
        editAccount={selectedAccount}
      />
    </div>
  );
}
