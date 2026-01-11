"use client";

import { useState, useEffect } from "react";
import { Plus, Instagram, Trash2, AlertCircle, CheckCircle } from "lucide-react";
import ConnectAccountModal from "./components/ConnectAccountModal";
import AccountDetailsModal from "./components/AccountDetailsModal";

export default function InstagramPage() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

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

  return (
    <div className="w-full p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-black">Instagram Accounts</h1>
          <p className="text-sm text-gray-700 mt-1">Manage your connected Instagram accounts</p>
        </div>
        <button
          onClick={() => setIsConnectModalOpen(true)}
          className="px-4 py-2 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] text-white text-sm font-medium rounded-lg hover:opacity-90 transition flex items-center gap-2 shadow-sm"
        >
          <Plus size={18} />
          Connect New Account
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading accounts...</div>
      ) : accounts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-dashed border-gray-200 text-center">
          <div className="w-16 h-16 bg-pink-50 text-[#E1306C] rounded-full flex items-center justify-center mb-4">
            <Instagram size={32} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Accounts Connected</h3>
          <p className="text-gray-700 max-w-sm mb-6">
            Connect your Instagram account to start automating.
          </p>
          <button
            onClick={() => setIsConnectModalOpen(true)}
            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition"
          >
            Connect Account
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((account) => (
            <div
              key={account._id}
              onClick={() => setSelectedAccount(account)}
              className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer group relative overflow-hidden"
            >
              <div className={`h-1.5 w-full ${account.status === "Connected" ? "bg-green-500" : "bg-red-500"}`} />
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-gradient-to-tr from-[#FCAF45] to-[#833AB4] text-white rounded-full flex items-center justify-center">
                    <Instagram size={24} />
                  </div>
                  <button
                    onClick={(e) => handleDelete(e, account._id)}
                    className="text-gray-300 hover:text-red-500 transition p-1"
                    title="Remove Account"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <h3 className="font-semibold text-lg text-gray-900 truncate mb-1">{account.email}</h3>
                
                <div className="flex items-center gap-2 mb-4">
                  {account.status === "Connected" ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-green-50 text-green-700 text-xs font-medium">
                      <CheckCircle size={12} />
                      Connected
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 text-xs font-medium">
                      <AlertCircle size={12} />
                      Failed
                    </span>
                  )}
                  <span className="text-xs text-gray-400">
                    {new Date(account.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {account.status !== "Connected" && (
                  <div className="text-xs text-red-600 bg-red-50 p-2 rounded-md mb-4">
                    Reason: {account.failureReason || "Unknown error"}
                  </div>
                )}

                <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-600">
                  <span>View Campaigns</span>
                  <span className="group-hover:translate-x-1 transition">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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
