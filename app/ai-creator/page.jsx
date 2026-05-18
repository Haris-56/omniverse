"use client";

import { useState, useEffect } from "react";
import { Plus, UserPlus, Trash2, Edit2, Layout, Mic, PenTool, Repeat, AtSign, Settings2, Globe, Sparkles, Zap, Activity, Calendar, ShieldCheck, Database, Hexagon, Loader2, ChevronRight } from "lucide-react";
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
    if (!confirm("Are you sure you want to delete this AI personality?")) return;

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
    <div className="w-full font-sans pb-32 p-6 md:p-10 lg:p-12 bg-[#FCF8FE]/30 min-h-screen">
      <div className="animate-in fade-in slide-in-from-bottom-5 duration-1000">
      <div className="max-w-[1400px] mx-auto space-y-12">
        
        {/* Header Sector */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 border-b border-[#8245EF]/15 pb-8">
          <div>
            <div className="flex items-center gap-4 mb-4">
               <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-full border border-green-100 flex items-center gap-2">
                 <ShieldCheck size={14} className="opacity-80" />
                 Verified
               </span>
            </div>
            <h1>AI Assistant</h1>
            <p className="text-gray-500 mt-2 text-xl">Create and manage your AI to write posts and talk to people.</p>
          </div>
          <button
            onClick={openCreateModal}
            className="group px-8 py-4 bg-[#8245EF] text-white text-xs font-bold rounded-xl hover:bg-[#6d28d9] transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95 border border-white/10"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500" />
            New Assistant
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 space-y-8 text-center">
             <div className="relative">
                <div className="animate-spin w-12 h-12 border-[4px] border-[#8245EF]/10 border-t-[#8245EF] rounded-full shadow-sm" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <Sparkles size={20} className="text-[#8245EF] animate-pulse" />
                </div>
             </div>
             <p className="text-xs font-bold text-gray-400">Loading...</p>
          </div>
        ) : creators.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[2rem] border border-dashed border-[#8245EF]/20 text-center shadow-lg p-16 max-w-3xl mx-auto relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#8245EF]/5 rounded-full blur-3xl group-hover:bg-[#8245EF]/10 transition-colors" />
            <div className="w-20 h-20 bg-[#FCF8FE] text-[#8245EF] rounded-3xl flex items-center justify-center mb-8 shadow-inner">
               <UserPlus size={44} />
            </div>
             <h2 className="text-2xl font-bold text-gray-900">No Assistants Yet</h2>
             <p className="text-gray-500 mt-4 max-w-md mx-auto text-lg leading-relaxed">Set up an AI assistant to write posts and reply to people for you.</p>
             <button 
               onClick={openCreateModal}
               className="mt-10 px-8 py-4 bg-[#8245EF]/10 text-[#8245EF] rounded-xl font-bold text-xs hover:bg-[#8245EF] hover:text-white transition-all border border-[#8245EF]/20"
             >
               Create Assistant
             </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {creators.map((creator) => (
              <div 
                key={creator._id}
                onClick={() => openEditModal(creator)}
                className="group bg-white rounded-[2.5rem] border border-[#8245EF]/10 shadow-sm hover:shadow-[0_20px_40px_rgba(130, 69, 239,0.08)] transition-all cursor-pointer relative overflow-hidden flex flex-col p-8"
              >
                 <div className="flex items-start justify-between mb-8">
                    <div className="w-14 h-14 bg-[#FCF8FE] text-[#8245EF] rounded-2xl flex items-center justify-center border border-[#8245EF]/10 group-hover:rotate-12 transition-transform duration-500 shadow-inner">
                       <PenTool size={28} />
                    </div>
                    <div className="flex gap-2">
                       <button
                         onClick={(e) => { e.stopPropagation(); openEditModal(creator); }}
                         className="p-3 bg-[#FCF8FE] text-[#94a3b8] hover:text-[#8245EF] rounded-xl hover:bg-[#8245EF]/10 transition-all border border-[#8245EF]/5 active:scale-90"
                       >
                         <Edit2 size={16} />
                       </button>
                       <button
                         onClick={(e) => handleDelete(e, creator._id)}
                         className="p-3 bg-[#FCF8FE] text-[#94a3b8] hover:text-red-500 rounded-xl hover:bg-red-50 transition-all border border-[#8245EF]/5 active:scale-90"
                       >
                         <Trash2 size={16} />
                       </button>
                    </div>
                 </div>

                  <div className="space-y-1">
                     <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#8245EF] transition-colors line-clamp-1">{creator.name}</h3>
                     <p className="text-[10px] font-bold text-gray-400 mt-1">Style: {creator.style || "Natural"}</p>
                  </div>

                 <div className="mt-8 space-y-4 flex-1">
                    <div className="grid grid-cols-3 gap-3">
                       <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl flex flex-col items-center gap-1">
                          <Mic size={14} className="text-[#8245EF]" />
                          <span className="text-[9px] font-bold text-gray-400">Voice</span>
                       </div>
                       <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl flex flex-col items-center gap-1">
                          <Layout size={14} className="text-[#8245EF]" />
                          <span className="text-[9px] font-bold text-gray-400">Image</span>
                       </div>
                       <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl flex flex-col items-center gap-1">
                          <Repeat size={14} className="text-[#8245EF]" />
                          <span className="text-[9px] font-bold text-gray-400">Plan</span>
                       </div>
                    </div>
                 </div>

                  <div className="grid grid-cols-2 gap-3 mt-8">
                     <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400 mb-1">Data</p>
                        <div className="flex items-center gap-2">
                           <Database size={12} className="text-[#8245EF]" />
                           <span className="text-[10px] font-bold text-gray-900">Connected</span>
                        </div>
                     </div>
                     <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400 mb-1">Status</p>
                        <div className="flex items-center gap-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm" />
                           <span className="text-[10px] font-bold text-gray-900">Active</span>
                        </div>
                     </div>
                  </div>

                 <div className="mt-8 pt-6 border-t border-[#8245EF]/10 flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 rounded-lg text-[10px] font-bold border border-green-100">
                           <Zap size={10} /> Active
                        </span>
                     </div>
                     <button className="text-[10px] font-bold text-[#8245EF] flex items-center gap-1 group/btn">
                        Edit <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                     </button>
                 </div>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>

      <CreatorModal
        isOpen={isModalOpen}
        onClose={() => {setIsModalOpen(false); setEditingCreator(null);}}
        onSave={handleSaveCreator}
        initialData={editingCreator}
      />
    </div>
  );
}
