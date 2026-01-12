"use client";

import { useState, useEffect } from "react";
import { Plus, Bot, Trash2, Edit2, Zap, MessageSquare, Target, Settings2, ShieldCheck, Sparkles, Cpu } from "lucide-react";
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
    <div className="w-full min-h-screen bg-gray-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
               <span className="px-3 py-1 bg-purple-50 text-purple-600 text-[10px] font-bold uppercase tracking-wider rounded-full border border-purple-100 flex items-center gap-1">
                 <ShieldCheck size={12} />
                 Authenticated Agents
               </span>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
              AI Agents
              <Cpu size={28} className="text-purple-500" />
            </h1>
            <p className="text-gray-500 mt-2 max-w-lg">Train and deploy custom autonomous agents to handle complex campaign interactions.</p>
          </div>
          <button
            onClick={openCreateModal}
            className="group px-6 py-3 bg-purple-600 text-white text-sm font-bold rounded-2xl hover:bg-purple-700 transition-all shadow-xl shadow-purple-100 flex items-center justify-center gap-2"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            Train New Agent
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="animate-spin w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full shadow-inner"></div>
            <p className="text-gray-400 font-medium animate-pulse">Initializing Neural Cores...</p>
          </div>
        ) : agents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] border border-dashed border-gray-200 text-center shadow-sm p-8">
            <div className="w-24 h-24 bg-purple-50 text-purple-600 rounded-3xl flex items-center justify-center mb-6 -rotate-3">
              <Bot size={48} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Active Agents</h3>
            <p className="text-gray-500 max-w-md mb-8">
              Create and train your first AI agent to automate human-like conversations and manage complex workflows.
            </p>
            <button
              onClick={openCreateModal}
              className="px-8 py-3.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm flex items-center gap-2"
            >
              <Sparkles size={18} className="text-amber-400" />
              Begin Training
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {agents.map((agent) => (
              <div
                key={agent._id}
                className="bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group overflow-hidden flex flex-col relative"
              >
                {/* Status Indicator Overlay */}
                <div className="absolute top-6 right-6 z-10">
                   <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-purple-600 bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-50 uppercase tracking-widest">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    Online
                  </span>
                </div>

                <div className="p-8 flex-1">
                  <div className="flex items-center gap-5 mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
                      <Bot size={28} />
                    </div>
                    <div>
                      <h3 className="font-black text-gray-900 text-xl tracking-tight">{agent.name}</h3>
                      <p className="text-xs text-purple-500 font-bold mt-0.5 uppercase tracking-widest opacity-70">{agent.platform}</p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div className="relative p-5 bg-gray-50 rounded-3xl border border-gray-100 group-hover:bg-white group-hover:border-purple-100 transition-colors duration-300">
                      <div className="flex items-start gap-4">
                        <Target size={20} className="text-purple-400 mt-1 shrink-0" />
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Primary Objective</p>
                          <p className="text-sm text-gray-700 font-bold line-clamp-2 leading-relaxed italic">
                            {agent.goal || "Objective not defined"}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-4 py-3 rounded-2xl flex-1 border border-transparent group-hover:border-gray-100 transition-all">
                        <MessageSquare size={18} className="text-purple-400" />
                        <span className="font-bold text-xs truncate">{agent.tone} / {agent.style}</span>
                      </div>
                    </div>

                    {agent.triggers && agent.triggers.length > 0 && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-xl border border-amber-100 text-[10px] font-black uppercase tracking-widest">
                        <Zap size={14} fill="currentColor" />
                        {agent.triggers.length} Autonomous Triggers Active
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="px-8 py-5 bg-gray-50/50 border-t border-gray-50 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:bg-white transition-colors duration-300">
                  <div className="flex items-center gap-2">
                     Last Trained: {new Date(agent.updatedAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(agent)}
                      className="text-gray-400 hover:text-purple-600 transition-all p-2.5 hover:bg-white rounded-xl"
                    >
                      <Settings2 size={18} />
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, agent._id)}
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

      <AgentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveAgent}
        initialData={editingAgent}
      />
    </div>
  );
}
