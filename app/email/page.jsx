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
    <div className="w-full font-sans pb-32 p-6 md:p-10 lg:p-12 bg-[#F8F4F2]/30 min-h-screen">
      <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="max-w-[1400px] mx-auto space-y-12">
        
        {/* Header Sector */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 border-b border-[#B78D7D]/15 pb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
                 <span className="px-4 py-1.5 bg-[#B78D7D]/10 text-[#B78D7D] text-[9px] font-black uppercase tracking-[0.2em] rounded-full border border-[#B78D7D]/20 flex items-center gap-2 font-mono">
                 <ShieldCheck size={14} className="opacity-80" />
                 Verified
               </span>
            </div>
            <h1 className="text-3xl font-black text-[#3E3A39] tracking-tighter uppercase leading-tight">
              Email Accounts
            </h1>
            <p className="text-[#8E7A70] mt-3 text-lg font-medium max-w-2xl leading-relaxed">Connect and manage your email accounts to start sending high-conversion sequences.</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => router.push("/email/templates")}
              className="px-6 py-4 bg-white border border-[#B78D7D]/15 text-[#3E3A39] text-[9px] font-black uppercase tracking-[0.3em] rounded-xl hover:bg-[#F8F4F2] transition-all shadow-sm flex items-center justify-center gap-3 font-mono active:scale-95"
            >
              <FileText size={16} className="text-[#B78D7D]" />
              Templates
            </button>
            <button
              onClick={() => setIsConnectModalOpen(true)}
              className="group px-8 py-4 bg-[#B78D7D] text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-[1.25rem] hover:bg-[#A37B6D] transition-all shadow-[0_15px_30px_rgba(183,141,125,0.2)] flex items-center justify-center gap-4 active:scale-95 border border-white/10 font-mono"
            >
              <Plus size={18} className="group-hover:rotate-90 transition-transform duration-500" />
              Connect Account
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 space-y-8 text-center">
             <div className="relative">
                <div className="animate-spin w-12 h-12 border-[4px] border-[#B78D7D]/10 border-t-[#B78D7D] rounded-full shadow-sm" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <Mail size={20} className="text-[#B78D7D] animate-pulse" />
                </div>
             </div>
             <p className="text-[#B2AAA6] font-black uppercase tracking-[0.3em] font-mono text-[9px]">Syncing accounts...</p>
          </div>
        ) : accounts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[2.5rem] border border-dashed border-[#B78D7D]/20 text-center shadow-sm p-12 max-w-3xl mx-auto relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#B78D7D]/5 rounded-full blur-3xl group-hover:bg-[#B78D7D]/10 transition-colors" />
            <div className="w-20 h-20 bg-[#F8F4F2] text-[#B78D7D] rounded-[1.5rem] flex items-center justify-center mb-10 shadow-inner group-hover:rotate-6 transition-all duration-700">
               <Send size={44} />
            </div>
            <h2 className="text-2xl font-black text-[#3E3A39] uppercase tracking-tighter">No Accounts Found</h2>
            <p className="text-[#8E7A70] mt-4 max-w-md mx-auto leading-relaxed text-lg">Connect your SMTP or email account to start reaching out to your community and leads.</p>
            <button
              onClick={() => setIsConnectModalOpen(true)}
              className="mt-10 px-10 py-5 bg-[#B78D7D]/10 text-[#B78D7D] rounded-xl font-black text-[10px] uppercase tracking-[0.4em] hover:bg-[#B78D7D] hover:text-white transition-all border border-[#B78D7D]/20"
            >
              Start Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {accounts.map((account) => (
              <div
                key={account._id}
                onClick={() => router.push(`/email/${account._id}/campaigns`)}
                className="group bg-white rounded-[2rem] border border-[#B78D7D]/10 transition-all duration-700 flex flex-col cursor-pointer relative overflow-hidden shadow-sm hover:shadow-[0_20px_40px_rgba(183,141,125,0.08)] hover:-translate-y-2"
              >
                <div className="h-1.5 w-full absolute top-0 left-0 z-20 bg-[#B78D7D]" />
                
                <div className="p-8 pb-6 flex-1 relative z-10 flex flex-col">
                  <div className="flex justify-between items-start mb-8">
                    <div className="w-16 h-16 bg-[#F8F4F2] text-[#B78D7D] rounded-[1.25rem] flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 border border-[#B78D7D]/10">
                      <Mail size={36} />
                    </div>
                    <button
                      onClick={(e) => handleDelete(e, account._id)}
                      className="text-[#B2AAA6] hover:text-rose-500 transition-all p-3 hover:bg-rose-500/5 bg-[#F8F4F2]/50 border border-transparent rounded-xl opacity-0 group-hover:opacity-100 active:scale-90"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                  <h3 className="font-black text-xl text-[#3E3A39] mb-1 truncate tracking-tighter uppercase group-hover:text-[#B78D7D] transition-colors">{account.email}</h3>
                  <p className="text-[10px] font-black text-[#B2AAA6] uppercase tracking-[0.2em] mb-10 font-mono">Verified Connection</p>
                  
                  <div className="flex items-center justify-between mb-8">
                     <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-widest border border-emerald-100 shadow-sm font-mono leading-none">
                           <CheckCircle size={10} /> Active
                        </span>
                     </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 p-6 bg-[#F8F4F2]/50 rounded-[1.5rem] border border-[#B78D7D]/10 group-hover:bg-white transition-all duration-500 shadow-inner mt-auto">
                    <div className="text-center">
                      <p className="text-[8px] font-black text-[#B2AAA6] uppercase tracking-[0.3em] mb-2 font-mono">Sent</p>
                      <p className="font-black text-[#3E3A39] text-2xl tracking-tighter leading-none">--</p>
                    </div>
                    <div className="text-center border-l border-[#B78D7D]/10">
                      <p className="text-[8px] font-black text-[#B2AAA6] uppercase tracking-[0.3em] mb-2 font-mono">Open Rate</p>
                      <p className="font-black text-[#3E3A39] text-2xl tracking-tighter leading-none">--</p>
                    </div>
                  </div>
                </div>

                <div className="px-8 py-6 bg-[#F8F4F2]/30 border-t border-[#B78D7D]/10 flex justify-between items-center group-hover:bg-[#F8F4F2]/70 transition-all relative z-10">
                  <span className="text-[9px] font-black text-[#B2AAA6] uppercase tracking-[0.3em] flex items-center gap-2 font-mono">
                    <Activity size={14} className="text-[#B78D7D] animate-pulse" />
                    Verified
                  </span>
                  <span className="text-[9px] font-black text-[#B78D7D] uppercase tracking-[0.3em] flex items-center gap-3 font-mono">
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
