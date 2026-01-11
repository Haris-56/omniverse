"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, Filter, MoreHorizontal, PlayCircle, PauseCircle, Trash2, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CampaignListPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newCampaignName, setNewCampaignName] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/campaigns");
      if (res.ok) {
        const data = await res.json();
        setCampaigns(data);
      }
    } catch (error) {
      console.error("Failed to fetch campaigns", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    if (!newCampaignName) return;

    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCampaignName, platform: "facebook" }), // Default to FB, changeable in builder
      });

      if (res.ok) {
        const newCampaign = await res.json();
        router.push(`/campaign-builder/${newCampaign._id}/edit`);
      }
    } catch (error) {
      console.error("Error creating campaign:", error);
    }
  };

  const handleDelete = async (e, id) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this campaign?")) return;

    try {
      const res = await fetch(`/api/campaigns/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchCampaigns();
      }
    } catch (error) {
      console.error("Error deleting campaign:", error);
    }
  };

  return (
    <div className="w-full p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Campaigns</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and monitor your automation campaigns</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-[#6A5ACD] text-white text-sm font-medium rounded-lg hover:bg-[#5a4cb4] transition flex items-center gap-2 shadow-sm"
        >
          <Plus size={18} />
          New Campaign
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search campaigns..." 
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#6A5ACD]/20 outline-none"
          />
        </div>
        <button className="px-3 py-2 border rounded-lg text-gray-600 hover:bg-gray-50 flex items-center gap-2 text-sm">
          <Filter size={16} />
          Filter
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading campaigns...</div>
      ) : campaigns.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-dashed border-gray-200 text-center">
          <div className="w-16 h-16 bg-purple-50 text-[#6A5ACD] rounded-full flex items-center justify-center mb-4">
            <PlayCircle size={32} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Campaigns Yet</h3>
          <p className="text-gray-500 max-w-sm mb-6">
            Create your first campaign to start automating your outreach.
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition"
          >
            Create Campaign
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <Link 
              href={`/campaign-builder/${campaign._id}`} 
              key={campaign._id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition group block overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    campaign.status === 'Running' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {campaign.status === 'Running' ? <PlayCircle size={20} /> : <PauseCircle size={20} />}
                  </div>
                  <div className="flex gap-1">
                     <button
                      onClick={(e) => handleDelete(e, campaign._id)}
                      className="text-gray-300 hover:text-red-500 transition p-1.5 hover:bg-red-50 rounded-md"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <h3 className="font-semibold text-lg text-gray-900 mb-1">{campaign.name}</h3>
                <div className="flex items-center gap-2 mb-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    campaign.status === 'Running' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {campaign.status}
                  </span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500 capitalize">{campaign.platform}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 py-4 border-t border-gray-50">
                  <div className="text-center">
                    <p className="text-xs text-gray-400 uppercase tracking-wider">Sent</p>
                    <p className="font-semibold text-gray-900">{campaign.stats?.sent || 0}</p>
                  </div>
                  <div className="text-center border-l border-gray-50">
                    <p className="text-xs text-gray-400 uppercase tracking-wider">Open</p>
                    <p className="font-semibold text-gray-900">{campaign.stats?.opened || 0}</p>
                  </div>
                  <div className="text-center border-l border-gray-50">
                    <p className="text-xs text-gray-400 uppercase tracking-wider">Reply</p>
                    <p className="font-semibold text-gray-900">{campaign.stats?.replied || 0}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex justify-between items-center">
                <span className="text-xs text-gray-500">Last edited {new Date(campaign.updatedAt).toLocaleDateString()}</span>
                <span className="text-xs font-medium text-[#6A5ACD] flex items-center gap-1 group-hover:gap-2 transition-all">
                  View Details <ExternalLink size={12} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-semibold mb-4">Create New Campaign</h2>
            <form onSubmit={handleCreateCampaign}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Name</label>
                <input
                  type="text"
                  value={newCampaignName}
                  onChange={(e) => setNewCampaignName(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#6A5ACD]/20 outline-none"
                  placeholder="e.g., Q1 Outreach"
                  autoFocus
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newCampaignName}
                  className="px-4 py-2 bg-[#6A5ACD] text-white rounded-lg hover:bg-[#5a4cb4] transition disabled:opacity-50"
                >
                  Create & Build
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
