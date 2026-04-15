"use client";

import { useState, useEffect } from "react";
import { Plus, Bot, Trash2, Edit2, Zap, MessageSquare, Target, Settings2, ShieldCheck, Sparkles, Cpu, Activity, Calendar, Globe, Database, Hexagon, Loader2, ChevronRight } from "lucide-react";
import AgentModal from "./components/AgentModal";

export default function AIAgentPage() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai-agents");
      if (res.ok) {
        const data = await res.json();
        setAgents(data);
      }
    } catch (error) {
      console.error("Failed to fetch agents", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAgent = async (agentData) => {
    try {
      const url = editingAgent 
        ? `/api/ai-agents/${editingAgent._id}` 
        : "/api/ai-agents";
      
      const method = editingAgent ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(agentData),
      });

      if (res.ok) {
        fetchAgents();
        setIsModalOpen(false);
        setEditingAgent(null);
      } else {
        alert("Failed to save agent");
      }
    } catch (error) {
      console.error("Error saving agent:", error);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this agent?")) return;

    try {
      const res = await fetch(`/api/ai-agents/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchAgents();
      } else {
        alert("Failed to delete agent");
      }
    } catch (error) {
      console.error("Error deleting agent:", error);
    }
  };

  const openEditModal = (agent) => {
    setEditingAgent(agent);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingAgent(null);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full font-sans pb-32 p-6 md:p-10 lg:p-12 bg-[#F8F4F2]/30 min-h-screen">
      <div className="animate-in fade-in slide-in-from-bottom-5 duration-1000">
      <div className="max-w-[1400px] mx-auto space-y-12">
        
        {/* Header Sector */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 border-b border-[#B78D7D]/15 pb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
               <span className="px-4 py-1.5 bg-[#B78D7D]/10 text-[#B78D7D] text-[9px] font-black uppercase tracking-[0.2em] rounded-full border border-[#B78D7D]/20 flex items-center gap-2 font-mono">
                 <ShieldCheck size={14} className="opacity-80" />
                 Active Agents
               </span>
            </div>
            <h1 className="text-3xl font-black text-[#3E3A39] tracking-tighter uppercase leading-tight">AI Agents</h1>
            <p className="text-[#8E7A70] mt-3 text-lg font-medium max-w-2xl leading-relaxed">Customize how your AI responds to messages and interacts with people.</p>
          </div>
          <button
            onClick={openCreateModal}
            className="group px-10 py-5 bg-[#B78D7D] text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-[1.25rem] hover:bg-[#A37B6D] transition-all shadow-[0_15px_30px_rgba(183,141,125,0.2)] flex items-center justify-center gap-3 active:scale-95 border border-white/10 font-mono"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500" />
            Create AI Agent
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 space-y-8 text-center">
             <div className="relative">
                <div className="animate-spin w-12 h-12 border-[4px] border-[#B78D7D]/10 border-t-[#B78D7D] rounded-full shadow-sm" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <Sparkles size={20} className="text-[#B78D7D] animate-pulse" />
                </div>
             </div>
             <p className="text-[#B2AAA6] font-black uppercase tracking-[0.3em] font-mono text-[9px]">Initializing AI...</p>
          </div>
        ) : agents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[2rem] border border-dashed border-[#B78D7D]/20 text-center shadow-lg p-16 max-w-3xl mx-auto relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#B78D7D]/5 rounded-full blur-3xl group-hover:bg-[#B78D7D]/10 transition-colors" />
            <div className="w-20 h-20 bg-[#F8F4F2] text-[#B78D7D] rounded-3xl flex items-center justify-center mb-8 shadow-inner">
               <Bot size={44} />
            </div>
            <h2 className="text-2xl font-black text-[#3E3A39] uppercase tracking-tighter">No Agents Found</h2>
            <p className="text-[#8E7A70] mt-4 max-w-md mx-auto leading-relaxed text-lg">Create an AI personality to automatically manage your replies and engage with your audience 24/7.</p>
            <button 
              onClick={openCreateModal}
              className="mt-10 px-10 py-5 bg-[#B78D7D]/10 text-[#B78D7D] rounded-xl font-black text-[10px] uppercase tracking-[0.4em] hover:bg-[#B78D7D] hover:text-white transition-all border border-[#B78D7D]/20"
            >
              Build Your First Agent
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {agents.map((agent) => (
              <div 
                key={agent._id}
                onClick={() => openEditModal(agent)}
                className="group bg-white rounded-[2rem] border border-[#B78D7D]/10 shadow-sm hover:shadow-[0_20px_40px_rgba(183,141,125,0.08)] transition-all cursor-pointer relative overflow-hidden flex flex-col p-8"
              >
                 <div className="flex items-start justify-between mb-8">
                    <div className="w-14 h-14 bg-[#F8F4F2] text-[#B78D7D] rounded-2xl flex items-center justify-center border border-[#B78D7D]/10 group-hover:rotate-12 transition-transform duration-500 shadow-inner">
                       <Bot size={30} />
                    </div>
                    <div className="flex gap-2">
                       <button
                         onClick={(e) => { e.stopPropagation(); openEditModal(agent); }}
                         className="p-3 bg-[#F8F4F2] text-[#B2AAA6] hover:text-[#B78D7D] rounded-xl hover:bg-[#B78D7D]/10 transition-all border border-[#B78D7D]/5 active:scale-90"
                       >
                         <Edit2 size={16} />
                       </button>
                       <button
                         onClick={(e) => handleDelete(e, agent._id)}
                         className="p-3 bg-[#F8F4F2] text-[#B2AAA6] hover:text-red-500 rounded-xl hover:bg-red-50 transition-all border border-[#B78D7D]/5 active:scale-90"
                       >
                         <Trash2 size={16} />
                       </button>
                    </div>
                 </div>

                 <div className="space-y-1">
                    <h3 className="text-xl font-black text-[#3E3A39] tracking-tighter uppercase group-hover:text-[#B78D7D] transition-colors line-clamp-1">{agent.name}</h3>
                    <p className="text-[10px] font-black text-[#B2AAA6] uppercase tracking-widest font-mono">ID: {agent._id.substring(0, 8)}</p>
                 </div>

                 <div className="mt-8 space-y-4 flex-1">
                    <p className="text-sm font-bold text-[#8E7A70] line-clamp-3 leading-relaxed italic border-l-4 border-[#B78D7D]/20 pl-4 bg-[#F8F4F2]/30 py-3 rounded-r-xl">
                      "{agent.instructions?.substring(0, 100) || "No instructions set"}"
                    </p>
                 </div>

                 <div className="grid grid-cols-2 gap-3 mt-8">
                    <div className="bg-[#F8F4F2]/50 p-4 rounded-2xl border border-[#B78D7D]/5 group-hover:bg-[#F8F4F2] transition-colors">
                       <p className="text-[8px] font-black text-[#B2AAA6] uppercase tracking-widest font-mono mb-1">Knowledge</p>
                       <div className="flex items-center gap-2">
                          <Database size={12} className="text-[#B78D7D]" />
                          <span className="text-[10px] font-black text-[#3E3A39] tracking-widest font-mono">Active</span>
                       </div>
                    </div>
                    <div className="bg-[#F8F4F2]/50 p-4 rounded-2xl border border-[#B78D7D]/5 group-hover:bg-[#F8F4F2] transition-colors">
                       <p className="text-[8px] font-black text-[#B2AAA6] uppercase tracking-widest font-mono mb-1">Brain</p>
                       <div className="flex items-center gap-2">
                          <Cpu size={12} className="text-[#B78D7D]" />
                          <span className="text-[10px] font-black text-[#3E3A39] tracking-widest font-mono">Neural_X1</span>
                       </div>
                    </div>
                 </div>

                 <div className="mt-8 pt-6 border-t border-[#B78D7D]/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <span className="flex items-center gap-1.5 px-3 py-1 bg-[#B78D7D]/10 text-[#B78D7D] rounded-lg text-[8px] font-black uppercase tracking-widest border border-[#B78D7D]/10">
                          <Activity size={10} /> Online
                       </span>
                    </div>
                    <button className="text-[9px] font-black text-[#B78D7D] uppercase tracking-widest font-mono flex items-center gap-2 group/btn">
                       Edit Settings <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                 </div>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>

      <AgentModal
        isOpen={isModalOpen}
        onClose={() => {setIsModalOpen(false); setEditingAgent(null);}}
        onSave={handleSaveAgent}
        editAgent={editingAgent}
      />
    </div>
  );
}
