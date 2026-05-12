"use client";

import { useState, useEffect } from "react";
import { X, Bot, Plus, Trash2, Save, Cpu, Sparkles, Activity, ShieldCheck, Zap, Hexagon } from "lucide-react";

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

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4 lg:p-8 animate-in fade-in duration-700 overflow-y-auto custom-scrollbar">
      <div className="fixed inset-0 bg-[#161932]/20 backdrop-blur-2xl" onClick={handleBackdropClick} />
      
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-3xl overflow-hidden border border-[#8245EF]/20 relative z-10 animate-in zoom-in-95 duration-700 flex flex-col max-h-[90vh] my-auto">
        
        {/* Modal Header */}
        <div className="p-8 border-b border-[#8245EF]/10 flex justify-between items-center bg-[#FCF8FE]/30">
           <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-[#8245EF] rounded-[1.75rem] flex items-center justify-center text-white shadow-lg shadow-[#8245EF]/20">
                 <Cpu size={32} />
              </div>
              <div>
                 <h2 className="text-3xl font-black text-[#161932] tracking-tighter uppercase leading-none">
                    AI Helper
                 </h2>
                 <p className="text-[10px] font-black text-[#8245EF] uppercase tracking-[0.4em] mt-3 font-mono leading-none">This helps you finish the talk and get the sale.</p>
              </div>
           </div>
           <button onClick={onClose} className="p-4 bg-white hover:bg-[#FCF8FE] rounded-2xl transition-all border border-[#8245EF]/15 text-[#94a3b8] hover:text-[#161932] shadow-sm">
             <X size={24} />
           </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <form id="agent-form" onSubmit={handleSubmit} className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               <div className="space-y-4">
                  <label className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.4em] ml-2 font-mono">AI Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#FCF8FE]/50 border-2 border-transparent border-b-[#8245EF]/10 rounded-2xl px-8 py-5 text-base font-bold text-[#161932] outline-none focus:border-b-[#8245EF] focus:bg-white transition-all shadow-inner"
                    placeholder="e.g., Prospector_Alpha"
                  />
               </div>
               <div className="space-y-4">
                  <label className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.2em] ml-2 font-mono">App to Connect</label>
                  <div className="relative">
                    <select
                      name="platform"
                      value={formData.platform}
                      onChange={handleChange}
                      className="w-full bg-[#FCF8FE]/50 border-2 border-transparent border-b-[#8245EF]/10 rounded-2xl px-8 py-5 text-base font-bold text-[#161932] outline-none focus:border-b-[#8245EF] focus:bg-white transition-all appearance-none cursor-pointer shadow-inner pr-12"
                    >
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="Instagram">Instagram</option>
                      <option value="Facebook">Facebook</option>
                      <option value="Email">Email</option>
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[#8245EF]">
                       <Hexagon size={18} className="animate-spin-slow opacity-50" />
                    </div>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               <div className="space-y-4">
                  <label className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.2em] ml-2 font-mono">Tone of Voice</label>
                  <select
                    name="tone"
                    value={formData.tone}
                    onChange={handleChange}
                    className="w-full bg-[#FCF8FE]/50 border-2 border-transparent border-b-[#8245EF]/10 rounded-2xl px-8 py-5 text-base font-bold text-[#161932] outline-none focus:border-b-[#8245EF] focus:bg-white transition-all appearance-none cursor-pointer shadow-inner pr-12"
                  >
                    <option value="Professional">Professional</option>
                    <option value="Casual">Casual</option>
                    <option value="Friendly">Friendly</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Witty">Witty</option>
                  </select>
               </div>
               <div className="space-y-4">
                  <label className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.2em] ml-2 font-mono">Style</label>
                  <select
                    name="style"
                    value={formData.style}
                    onChange={handleChange}
                    className="w-full bg-[#FCF8FE]/50 border-2 border-transparent border-b-[#8245EF]/10 rounded-2xl px-8 py-5 text-base font-bold text-[#161932] outline-none focus:border-b-[#8245EF] focus:bg-white transition-all appearance-none cursor-pointer shadow-inner pr-12"
                  >
                    <option value="Concise">Concise Byte</option>
                    <option value="Detailed">Detailed Data</option>
                    <option value="Persuasive">Persuasive</option>
                    <option value="Empathetic">Friendly</option>
                  </select>
               </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.2em] ml-2 font-mono">Instructions</label>
              <textarea
                name="behavior"
                value={formData.behavior}
                onChange={handleChange}
                rows={4}
                className="w-full bg-[#FCF8FE]/50 border-2 border-transparent border-b-[#8245EF]/10 rounded-[2rem] px-8 py-6 text-base font-bold text-[#161932] outline-none focus:border-b-[#8245EF] focus:bg-white transition-all resize-none shadow-inner"
                placeholder="Describe how the AI should respond..."
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.2em] ml-2 font-mono">Main Goal</label>
              <textarea
                name="goal"
                value={formData.goal}
                onChange={handleChange}
                rows={2}
                className="w-full bg-[#FCF8FE]/50 border-2 border-transparent border-b-[#8245EF]/10 rounded-[2rem] px-8 py-6 text-base font-bold text-[#161932] outline-none focus:border-b-[#8245EF] focus:bg-white transition-all resize-none shadow-inner"
                placeholder="Example: Book a meeting or get their email."
              />
            </div>

            <div className="pt-10 border-t border-[#8245EF]/10">
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-4">
                   <Zap size={24} className="text-[#8245EF] animate-pulse" />
                   <h3 className="text-xl font-black text-[#161932] uppercase tracking-tighter leading-none">Auto Replies</h3>
                </div>
                <button
                  type="button"
                  onClick={addTrigger}
                  className="px-8 py-4 bg-[#FCF8FE] text-[#8245EF] border border-[#8245EF]/20 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#8245EF] hover:text-white transition-all flex items-center gap-3 font-mono shadow-sm active:scale-95"
                >
                  <Plus size={16} />
                  Inject Keyword
                </button>
              </div>
              
              <div className="space-y-6">
                {formData.triggers.length === 0 && (
                  <div className="text-center py-16 bg-[#FCF8FE]/30 rounded-[3rem] border-2 border-dashed border-[#8245EF]/15 group">
                     <p className="text-[11px] font-black text-[#94a3b8] uppercase tracking-[0.3em] font-mono group-hover:text-[#8245EF] transition-colors">No rules set.</p>
                  </div>
                )}
                {formData.triggers.map((trigger, index) => (
                  <div key={index} className="flex gap-6 items-start bg-[#FCF8FE]/40 p-8 rounded-[2.5rem] border border-[#8245EF]/10 group relative transition-all hover:bg-white hover:border-[#8245EF]/30 shadow-sm animate-in slide-in-from-right-4 duration-500">
                    <div className="flex-1 space-y-6">
                      <div className="space-y-3">
                         <label className="text-[9px] font-black text-[#94a3b8] uppercase tracking-[0.2em] font-mono ml-2">If they say...</label>
                         <input
                           type="text"
                           value={trigger.keyword}
                           onChange={(e) => updateTrigger(index, "keyword", e.target.value)}
                           placeholder="e.g. pricing"
                           className="w-full bg-white border border-[#8245EF]/10 rounded-xl px-6 py-4 text-sm font-bold text-[#161932] outline-none focus:border-[#8245EF] shadow-sm"
                         />
                      </div>
                      <div className="space-y-3">
                         <label className="text-[9px] font-black text-[#94a3b8] uppercase tracking-[0.2em] font-mono ml-2">Then reply with...</label>
                         <input
                           type="text"
                           value={trigger.response}
                           onChange={(e) => updateTrigger(index, "response", e.target.value)}
                           placeholder="e.g. It costs $99."
                           className="w-full bg-white border border-[#8245EF]/10 rounded-xl px-6 py-4 text-sm font-bold text-[#161932] outline-none focus:border-[#8245EF] shadow-sm"
                         />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeTrigger(index)}
                      className="text-[#94a3b8] hover:text-rose-500 transition-colors p-4 bg-white rounded-2xl border border-[#8245EF]/10 shadow-sm active:scale-90 mt-6"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="p-8 bg-[#FCF8FE]/50 border-t border-[#8245EF]/10 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
           <div className="absolute inset-0 opacity-[0.01] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
           <div className="flex items-center gap-4 relative z-10">
              <ShieldCheck size={24} className="text-emerald-500" />
              <span className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.2em] font-mono">Ready to Go</span>
           </div>
           <div className="flex items-center gap-6 w-full md:w-auto relative z-10">
              <button
                onClick={onClose}
                className="flex-1 md:flex-none px-8 py-4 bg-white text-[#94a3b8] font-black text-[10px] uppercase tracking-[0.2em] rounded-[1rem] hover:bg-rose-50 hover:text-rose-500 transition-all font-mono active:scale-95 border border-[#8245EF]/15 shadow-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="agent-form"
                className="flex-1 md:flex-none px-10 py-4 bg-[#8245EF] text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-[1rem] shadow-lg hover:bg-[#6d28d9] transition-all flex items-center justify-center gap-3 border border-white/10 font-mono active:scale-95"
              >
                <Save size={18} />
                <span>Save AI Helper</span>
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
