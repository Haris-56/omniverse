"use client";

import { useState, useEffect } from "react";
import { Plus, Linkedin, Trash2, AlertCircle, CheckCircle, Zap, ShieldCheck, ExternalLink, Briefcase } from "lucide-react";
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

  return (
    <div className="w-full min-h-screen bg-gray-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
               <span className="px-3 py-1 bg-sky-50 text-[#0077B5] text-[10px] font-bold uppercase tracking-wider rounded-full border border-sky-100 flex items-center gap-1">
                 <ShieldCheck size={12} fill="currentColor" className="opacity-80" />
                 Professional Identity Verified
               </span>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
              LinkedIn Hub
            </h1>
            <p className="text-gray-500 mt-2 max-w-lg font-medium">Manage your B2B outreach nodes and orchestrate high-precision professional networking sequences.</p>
          </div>
          <button
            onClick={() => setIsConnectModalOpen(true)}
            className="group px-6 py-3.5 bg-[#0077B5] text-white text-sm font-bold rounded-2xl hover:bg-[#006097] transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-2"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            Connect Linked Profile
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4 text-center">
             <div className="animate-spin w-10 h-10 border-4 border-[#0077B5] border-t-transparent rounded-full" />
             <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Verifying Network Handshakes...</p>
          </div>
        ) : accounts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border border-dashed border-gray-200 text-center shadow-sm p-10 max-w-2xl mx-auto">
            <div className="w-24 h-24 bg-blue-50 text-[#0077B5] rounded-3xl flex items-center justify-center mb-6 rotate-3 shadow-inner">
              <Linkedin size={48} />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">No Profiles Synchronized</h3>
            <p className="text-gray-500 font-medium mb-8">
              Bridges your LinkedIn professional profile to start automating connection requests and multi-step messaging sequences.
            </p>
            <button
              onClick={() => setIsConnectModalOpen(true)}
              className="px-8 py-4 bg-white border border-gray-200 text-gray-900 font-bold rounded-2xl hover:bg-gray-50 transition-all shadow-sm flex items-center gap-2"
            >
              <Plus size={20} />
              Authorize Profile
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {accounts.map((account) => (
              <div
                key={account._id}
                onClick={() => router.push(`/linkedin/${account._id}/campaigns`)}
                className="bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group overflow-hidden flex flex-col cursor-pointer"
              >
                <div className={`h-1.5 w-full ${account.status === "Connected" ? "bg-[#0077B5]" : "bg-red-500"}`} />
                
                <div className="p-8 pb-6 flex-1">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 bg-blue-50 text-[#0077B5] rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500">
                      <Linkedin size={28} />
                    </div>
                    <button
                      onClick={(e) => handleDelete(e, account._id)}
                      className="text-gray-300 hover:text-red-500 transition-all p-3 hover:bg-red-50 rounded-xl opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                  <h3 className="font-black text-xl text-gray-900 mb-1 truncate tracking-tight">{account.email}</h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Professional Outreach Node</p>
                  
                  <div className="flex items-center gap-3 mb-6">
                    {account.status === "Connected" ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#0077B5] text-[10px] font-black uppercase tracking-wider border border-blue-100">
                        <CheckCircle size={12} />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-[10px] font-black uppercase tracking-wider border border-red-100">
                        <AlertCircle size={12} />
                        Handshake Failed
                      </span>
                    )}
                    <span className="text-[10px] font-bold text-gray-400">
                      Linked {new Date(account.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 rounded-[1.5rem] border border-gray-100 group-hover:bg-white group-hover:border-blue-100 transition-all">
                    <div className="text-center">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Connections</p>
                      <p className="font-black text-gray-900 text-lg">--</p>
                    </div>
                    <div className="text-center border-l border-gray-200">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Replies</p>
                      <p className="font-black text-gray-900 text-lg">--</p>
                    </div>
                  </div>
                </div>

                <div className="px-8 py-5 bg-gray-50/50 border-t border-gray-50 flex justify-between items-center group-hover:bg-white transition-colors">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Briefcase size={12} className="text-[#0077B5]" />
                    B2B Protocol Ready
                  </span>
                  <span className="text-xs font-black text-[#0077B5] flex items-center gap-2 group-hover:gap-3 transition-all">
                    View Network <ExternalLink size={14} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConnectAccountModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        onAccountConnected={fetchAccounts}
      />

      <AccountDetailsModal
        account={selectedAccount}
        isOpen={!!selectedAccount}
        onClose={() => setSelectedAccount(null)}
      />
    </div>
  );
}
