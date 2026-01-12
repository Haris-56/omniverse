"use client";

import { useState, useEffect } from "react";
import { Plus, UserPlus, Trash2, Edit2, Layout, Mic, PenTool, Repeat, AtSign, Settings2, Globe, Sparkles } from "lucide-react";
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
    <div className="w-full min-h-screen bg-gray-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
               <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-wider rounded-full border border-indigo-100">Automation</span>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
              AI Creators
              <Sparkles size={24} className="text-amber-400" />
            </h1>
            <p className="text-gray-500 mt-2 max-w-lg">Manage your automated content creators and trackers with advanced AI personas.</p>
          </div>
          <button
            onClick={openCreateModal}
            className="group px-6 py-3 bg-indigo-600 text-white text-sm font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            Create New Creator
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="animate-spin w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full shadow-inner"></div>
            <p className="text-gray-400 font-medium animate-pulse">Scanning Neural Networks...</p>
          </div>
        ) : creators.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] border border-dashed border-gray-200 text-center shadow-sm p-8">
            <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mb-6 rotate-3">
              <UserPlus size={48} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Initialize Your First Creator</h3>
            <p className="text-gray-500 max-w-md mb-8">
              Launch an AI persona that tracks profiles, crafts content, and automates your social presence with precision.
            </p>
            <button
              onClick={openCreateModal}
              className="px-8 py-3.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm flex items-center gap-2"
            >
              <Plus size={20} />
              Get Started
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {creators.map((creator) => (
              <div
                key={creator._id}
                className="bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group overflow-hidden flex flex-col relative"
              >
                {/* Platform Badge Overlay */}
                <div className="absolute top-6 right-6 z-10">
                   <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-indigo-600 bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-50 uppercase tracking-widest">
                    <Globe size={12} />
                    {creator.platform}
                  </span>
                </div>

                <div className="p-8 flex-1">
                  <div className="flex items-center gap-5 mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform duration-500">
                      <UserPlus size={28} />
                    </div>
                    <div>
                      <h3 className="font-black text-gray-900 text-xl tracking-tight">{creator.name}</h3>
                      <p className="text-xs text-indigo-500 font-bold mt-0.5 uppercase tracking-widest opacity-70">AI Persona Active</p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div className="relative p-5 bg-gray-50 rounded-3xl border border-gray-100 group-hover:bg-white group-hover:border-indigo-100 transition-colors duration-300">
                      <div className="flex items-start gap-4">
                        <AtSign size={20} className="text-indigo-400 mt-1 shrink-0" />
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Targeting Pipeline</p>
                          <p className="text-sm text-gray-700 font-bold line-clamp-2 leading-relaxed italic">
                            {creator.profilesToTrack || "No profiles targeted"}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-4 py-3 rounded-2xl flex-1 border border-transparent group-hover:border-gray-100 transition-all">
                        <Mic size={18} className="text-indigo-400" />
                        <span className="font-bold text-xs">{creator.tone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-4 py-3 rounded-2xl flex-1 border border-transparent group-hover:border-gray-100 transition-all">
                        {creator.postType === 'Repost' ? <Repeat size={18} className="text-indigo-400" /> : <PenTool size={18} className="text-indigo-400" />}
                        <span className="font-bold text-xs">{creator.postType}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="px-8 py-5 bg-gray-50/50 border-t border-gray-50 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:bg-white transition-colors duration-300">
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-sm shadow-green-200" />
                     Live Status
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(creator)}
                      className="text-gray-400 hover:text-indigo-600 transition-all p-2.5 hover:bg-white rounded-xl"
                    >
                      <Settings2 size={18} />
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, creator._id)}
                      className="text-gray-400 hover:text-red-600 transition-all p-2.5 hover:bg-white rounded-xl"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CreatorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCreator}
        initialData={editingCreator}
      />
    </div>
  );
}
