"use client";

import { X, Linkedin, Activity, PlayCircle, PauseCircle } from "lucide-react";

export default function AccountDetailsModal({ account, isOpen, onClose }) {
  if (!isOpen || !account) return null;

  const campaigns = [
    { id: 1, name: "CEO Outreach - Tech", status: "Running", progress: 32 },
    { id: 2, name: "Recruiter Connections", status: "Paused", progress: 8 },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0077B5]/10 text-[#0077B5] rounded-full flex items-center justify-center">
              <Linkedin size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{account.email}</h2>
              <p className={`text-xs font-medium ${account.status === "Connected" ? "text-green-600" : "text-red-600"}`}>
                {account.status}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Activity size={16} />
            Active Campaigns
          </h3>

          {account.status !== "Connected" ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-gray-500">
              Cannot view campaigns for a disconnected account.
            </div>
          ) : campaigns.length > 0 ? (
            <div className="space-y-3">
              {campaigns.map((camp) => (
                <div key={camp.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-blue-100 transition">
                  <div className="flex items-center gap-3">
                    {camp.status === "Running" ? (
                      <PlayCircle size={20} className="text-green-500" />
                    ) : (
                      <PauseCircle size={20} className="text-amber-500" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{camp.name}</p>
                      <p className="text-xs text-gray-500">{camp.status} • {camp.progress}% Completed</p>
                    </div>
                  </div>
                  <button className="text-sm text-blue-600 hover:underline font-medium">
                    View Details
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-gray-500">
              No active campaigns found on this account.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
