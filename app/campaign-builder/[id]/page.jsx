"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Edit2, Play, Pause, BarChart2, Users, Mail, MessageSquare } from "lucide-react";
import { useParams } from "next/navigation";

export default function CampaignDetailsPage() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchCampaign();
  }, [id]);

  const fetchCampaign = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/campaigns/${id}`);
      if (res.ok) {
        const data = await res.json();
        setCampaign(data);
      }
    } catch (error) {
      console.error("Failed to fetch campaign", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Loading campaign details...</div>;
  if (!campaign) return <div className="p-10 text-center text-red-500">Campaign not found</div>;

  return (
    <div className="w-full p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/campaign-builder" className="p-2 hover:bg-gray-100 rounded-full transition text-gray-500">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{campaign.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                campaign.status === 'Running' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'
              }`}>
                {campaign.status}
              </span>
              <span className="text-xs text-gray-500 capitalize">• {campaign.platform}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center gap-2 text-sm font-medium">
            {campaign.status === 'Running' ? <Pause size={16} /> : <Play size={16} />}
            {campaign.status === 'Running' ? 'Pause' : 'Start'}
          </button>
          <Link 
            href={`/campaign-builder/${id}/edit`}
            className="px-4 py-2 bg-[#6A5ACD] text-white rounded-lg hover:bg-[#5a4cb4] transition flex items-center gap-2 text-sm font-medium"
          >
            <Edit2 size={16} />
            Edit Flow
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Total Sent</h3>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Mail size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{campaign.stats?.sent || 0}</p>
          <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
            <span>↑ 12%</span> from last week
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Opened</h3>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Users size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{campaign.stats?.opened || 0}</p>
          <p className="text-xs text-gray-500 mt-1">
            {((campaign.stats?.opened / (campaign.stats?.sent || 1)) * 100).toFixed(1)}% open rate
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Replied</h3>
            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
              <MessageSquare size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{campaign.stats?.replied || 0}</p>
          <p className="text-xs text-gray-500 mt-1">
            {((campaign.stats?.replied / (campaign.stats?.sent || 1)) * 100).toFixed(1)}% reply rate
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Conversion</h3>
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
              <BarChart2 size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{campaign.stats?.converted || 0}</p>
          <p className="text-xs text-green-600 mt-1">
            Target met
          </p>
        </div>
      </div>

      {/* Recent Activity / Logs Placeholder */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Recent Activity</h3>
        </div>
        <div className="p-6 text-center text-gray-500 text-sm">
          No recent activity logs found.
        </div>
      </div>
    </div>
  );
}
