"use client";

import { useState, useEffect } from "react";
import { X, Bot, Plus, Trash2, Save } from "lucide-react";

export default function AgentModal({ isOpen, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState({
    name: "",
    platform: "LinkedIn",
    behavior: "",
    tone: "Professional",
    style: "Concise",
    goal: "",
    triggers: []
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: "",
        platform: "LinkedIn",
        behavior: "",
        tone: "Professional",
        style: "Concise",
        goal: "",
        triggers: []
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addTrigger = () => {
    setFormData(prev => ({
      ...prev,
      triggers: [...prev.triggers, { keyword: "", response: "" }]
    }));
  };

  const updateTrigger = (index, field, value) => {
    const newTriggers = [...formData.triggers];
    newTriggers[index][field] = value;
    setFormData(prev => ({ ...prev, triggers: newTriggers }));
  };

  const removeTrigger = (index) => {
    const newTriggers = formData.triggers.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, triggers: newTriggers }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b flex justify-between items-center bg-purple-50">
          <div className="flex items-center gap-2 text-purple-600">
            <Bot size={24} />
            <h2 className="text-xl font-semibold text-gray-900">
              {initialData ? "Edit AI Agent" : "Create New AI Agent"}
            </h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form id="agent-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Agent Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500/20 outline-none bg-gray-50 text-gray-900 placeholder:text-gray-500"
                  placeholder="e.g., Sales Assistant"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                <select
                  name="platform"
                  value={formData.platform}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500/20 outline-none bg-gray-50 text-gray-900"
                >
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Email">Email</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tone</label>
                <select
                  name="tone"
                  value={formData.tone}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500/20 outline-none bg-gray-50 text-gray-900"
                >
                  <option value="Professional">Professional</option>
                  <option value="Casual">Casual</option>
                  <option value="Friendly">Friendly</option>
                  <option value="Urgent">Urgent</option>
                  <option value="Witty">Witty</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Style</label>
                <select
                  name="style"
                  value={formData.style}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500/20 outline-none bg-gray-50 text-gray-900"
                >
                  <option value="Concise">Concise</option>
                  <option value="Detailed">Detailed</option>
                  <option value="Persuasive">Persuasive</option>
                  <option value="Empathetic">Empathetic</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Behavior / Personality</label>
              <textarea
                name="behavior"
                value={formData.behavior}
                onChange={handleChange}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500/20 outline-none resize-none bg-gray-50 text-gray-900 placeholder:text-gray-500"
                placeholder="Describe how the agent should act (e.g., 'You are a helpful support agent who prioritizes customer satisfaction...')"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Goal</label>
              <textarea
                name="goal"
                value={formData.goal}
                onChange={handleChange}
                rows={2}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500/20 outline-none resize-none bg-gray-50 text-gray-900 placeholder:text-gray-500"
                placeholder="What is the primary objective? (e.g., 'Book a meeting', 'Resolve issue')"
              />
            </div>

            <div className="border-t pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold text-gray-900">Dynamic Triggers</h3>
                <button
                  type="button"
                  onClick={addTrigger}
                  className="text-xs flex items-center gap-1 text-purple-600 hover:text-purple-700 font-medium"
                >
                  <Plus size={14} />
                  Add Trigger
                </button>
              </div>
              
              <div className="space-y-3">
                {formData.triggers.length === 0 && (
                  <p className="text-sm text-gray-500 italic text-center py-4 bg-gray-50 rounded-lg">
                    No triggers defined. Add one to automate responses based on keywords.
                  </p>
                )}
                {formData.triggers.map((trigger, index) => (
                  <div key={index} className="flex gap-3 items-start bg-gray-50 p-3 rounded-lg group">
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={trigger.keyword}
                        onChange={(e) => updateTrigger(index, "keyword", e.target.value)}
                        placeholder="If user says (keyword)..."
                        className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:ring-1 focus:ring-purple-500 outline-none bg-gray-50 text-gray-900 placeholder:text-gray-500"
                      />
                      <input
                        type="text"
                        value={trigger.response}
                        onChange={(e) => updateTrigger(index, "response", e.target.value)}
                        placeholder="Reply with / Send link..."
                        className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:ring-1 focus:ring-purple-500 outline-none bg-gray-50 text-gray-900 placeholder:text-gray-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeTrigger(index)}
                      className="text-gray-400 hover:text-red-500 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </form>
        </div>

        <div className="p-6 border-t bg-gray-50 flex justify-end gap-3 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="agent-form"
            className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
          >
            <Save size={16} />
            Save Agent
          </button>
        </div>
      </div>
    </div>
  );
}
