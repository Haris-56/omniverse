"use client";

import { useState, useEffect } from "react";
import { Plus, Bot, Trash2, Edit2, Zap, MessageSquare, Target } from "lucide-react";
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
    <div className="w-full p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">AI Agents</h1>
          <p className="text-sm text-gray-500 mt-1">Create and train custom AI agents for your campaigns</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition flex items-center gap-2 shadow-sm"
        >
          <Plus size={18} />
          Create New Agent
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading agents...</div>
      ) : agents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-dashed border-gray-200 text-center">
          <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-4">
            <Bot size={32} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Agents Created</h3>
          <p className="text-gray-500 max-w-sm mb-6">
            Create your first AI agent to automate interactions.
          </p>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition"
          >
            Create Agent
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <div
              key={agent._id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition group overflow-hidden flex flex-col"
            >
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center">
                      <Bot size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{agent.name}</h3>
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                        {agent.platform}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEditModal(agent)}
                      className="text-gray-300 hover:text-blue-500 transition p-1.5 hover:bg-blue-50 rounded-md"
                      title="Edit Agent"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, agent._id)}
                      className="text-gray-300 hover:text-red-500 transition p-1.5 hover:bg-red-50 rounded-md"
                      title="Delete Agent"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2 text-gray-600">
                    <Target size={16} className="mt-0.5 text-gray-400 shrink-0" />
                    <p className="line-clamp-2">{agent.goal || "No specific goal set"}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-600">
                    <MessageSquare size={16} className="text-gray-400 shrink-0" />
                    <p>{agent.tone} • {agent.style}</p>
                  </div>

                  {agent.triggers && agent.triggers.length > 0 && (
                    <div className="flex items-start gap-2 text-gray-600">
                      <Zap size={16} className="mt-0.5 text-amber-500 shrink-0" />
                      <p>{agent.triggers.length} Active Triggers</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
                <span>Updated {new Date(agent.updatedAt).toLocaleDateString()}</span>
                <span className="font-medium text-purple-600 cursor-pointer hover:underline" onClick={() => openEditModal(agent)}>Configure</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <AgentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveAgent}
        initialData={editingAgent}
      />
    </div>
  );
}
