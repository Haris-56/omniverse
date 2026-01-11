"use client";

import { useState, useEffect } from "react";
import { Plus, UserPlus, Trash2, Edit2, Layout, Mic, PenTool, Repeat, AtSign } from "lucide-react";
import CreatorModal from "./components/CreatorModal";

export default function AICreatorPage() {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCreator, setEditingCreator] = useState(null);

  useEffect(() => {
    fetchCreators();
  }, []);

  const fetchCreators = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai-creators");
      if (res.ok) {
        const data = await res.json();
        setCreators(data);
      }
    } catch (error) {
      console.error("Failed to fetch creators", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCreator = async (creatorData) => {
    try {
      const url = editingCreator 
        ? `/api/ai-creators/${editingCreator._id}` 
        : "/api/ai-creators";
      
      const method = editingCreator ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(creatorData),
      });

      if (res.ok) {
        fetchCreators();
        setIsModalOpen(false);
        setEditingCreator(null);
      } else {
        alert("Failed to save creator");
      }
    } catch (error) {
      console.error("Error saving creator:", error);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this creator?")) return;

    try {
      const res = await fetch(`/api/ai-creators/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchCreators();
      } else {
        alert("Failed to delete creator");
      }
    } catch (error) {
      console.error("Error deleting creator:", error);
    }
  };

  const openEditModal = (creator) => {
    setEditingCreator(creator);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingCreator(null);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full p-8 min-h-screen bg-gray-50/50">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">AI Creators</h1>
          <p className="text-gray-500 mt-2">Manage your automated content creators and trackers</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center gap-2"
        >
          <Plus size={20} />
          Create New Creator
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">Loading creators...</p>
        </div>
      ) : creators.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-200 text-center shadow-sm">
          <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-6">
            <UserPlus size={40} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Creators Yet</h3>
          <p className="text-gray-500 max-w-sm mb-8">
            Start by adding a new AI Creator to track profiles and automate your social presence.
          </p>
          <button
            onClick={openCreateModal}
            className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
          >
            Create Your First Creator
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {creators.map((creator) => (
            <div
              key={creator._id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden flex flex-col"
            >
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600 rounded-xl flex items-center justify-center shadow-inner">
                      <UserPlus size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{creator.name}</h3>
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full mt-1">
                        <Layout size={12} />
                        {creator.platform}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEditModal(creator)}
                      className="text-gray-400 hover:text-indigo-600 transition p-2 hover:bg-indigo-50 rounded-lg"
                      title="Edit Creator"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, creator._id)}
                      className="text-gray-400 hover:text-red-600 transition p-2 hover:bg-red-50 rounded-lg"
                      title="Delete Creator"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                    <AtSign size={18} className="text-gray-400 mt-1 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Tracking</p>
                      <p className="text-sm text-gray-700 font-medium line-clamp-2">
                        {creator.profilesToTrack || "No profiles set"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-3 py-2 rounded-lg flex-1">
                      <Mic size={16} className="text-gray-400" />
                      <span className="font-medium">{creator.tone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-3 py-2 rounded-lg flex-1">
                      {creator.postType === 'Repost' ? <Repeat size={16} className="text-gray-400" /> : <PenTool size={16} className="text-gray-400" />}
                      <span className="font-medium">{creator.postType}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-4 bg-gray-50/80 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
                <span>Active</span>
                <button 
                  onClick={() => openEditModal(creator)}
                  className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
                >
                  Configure
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <CreatorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCreator}
        initialData={editingCreator}
      />
    </div>
  );
}
