"use client";

import { useState, useEffect } from "react";
import { X, UserPlus, Save, Layout, AtSign, Mic, Repeat, PenTool, Sparkles, Activity, ShieldCheck, Zap, Hexagon } from "lucide-react";

export default function CreatorModal({ isOpen, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState({
    name: "",
    profilesToTrack: "",
    platform: "LinkedIn",
    tone: "Professional",
    postType: "Repost", // or 'New Post'
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: "",
        profilesToTrack: "",
        platform: "LinkedIn",
        tone: "Professional",
        postType: "Repost",
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      <div className="fixed inset-0 bg-[#3E3A39]/20 backdrop-blur-2xl" onClick={handleBackdropClick} />
      
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-3xl overflow-hidden border border-[#B78D7D]/20 relative z-10 animate-in zoom-in-95 duration-700 flex flex-col max-h-[90vh] my-auto">
        
        {/* Modal Header */}
        <div className="p-8 border-b border-[#B78D7D]/10 flex justify-between items-center bg-[#F8F4F2]/30">
           <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-[#B78D7D] rounded-[1.75rem] flex items-center justify-center text-white shadow-lg shadow-[#B78D7D]/20">
                 <UserPlus size={32} />
              </div>
              <div>
                 <h2 className="text-3xl font-black text-[#3E3A39] tracking-tighter uppercase leading-none">
                    AI Writer
                 </h2>
                 <p className="text-[10px] font-black text-[#B78D7D] uppercase tracking-[0.4em] mt-3 font-mono leading-none">The computer writes messages for you.</p>
              </div>
           </div>
           <button onClick={onClose} className="p-4 bg-white hover:bg-[#F8F4F2] rounded-2xl transition-all border border-[#B78D7D]/15 text-[#B2AAA6] hover:text-[#3E3A39] shadow-sm">
             <X size={24} />
           </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <form id="creator-form" onSubmit={handleSubmit} className="space-y-10">
            
            {/* Name Input */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-[#B2AAA6] uppercase tracking-[0.4em] ml-2 font-mono">What do you do?</label>
              <div className="relative group">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#F8F4F2]/50 border-2 border-transparent border-b-[#B78D7D]/10 rounded-2xl pl-16 pr-8 py-5 text-base font-bold text-[#3E3A39] outline-none focus:border-b-[#B78D7D] focus:bg-white transition-all shadow-inner font-sans"
                  placeholder="Describe your work in one sentence."
                />
                <UserPlus className="absolute left-6 top-1/2 -translate-y-1/2 text-[#B78D7D]/40 group-focus-within:text-[#B78D7D]" size={22} />
              </div>
            </div>

            {/* Profiles to Track */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-[#B2AAA6] uppercase tracking-[0.4em] ml-2 font-mono">
                Who are you talking to? <span className="text-[8px] font-black text-[#B2AAA6] normal-case opacity-50">(Describe your customers)</span>
              </label>
              <div className="relative group">
                <textarea
                  name="profilesToTrack"
                  value={formData.profilesToTrack}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full bg-[#F8F4F2]/50 border-2 border-transparent border-b-[#B78D7D]/10 rounded-[2rem] pl-16 pr-8 py-6 text-base font-bold text-[#3E3A39] outline-none focus:border-b-[#B78D7D] focus:bg-white transition-all resize-none custom-scrollbar shadow-inner"
                  placeholder="Describe your customers here..."
                />
                <AtSign className="absolute left-6 top-7 text-[#B78D7D]/40 group-focus-within:text-[#B78D7D]" size={22} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-[#B2AAA6] uppercase tracking-[0.2em] ml-2 font-mono">App to connect</label>
                <div className="relative group">
                  <select
                    name="platform"
                    value={formData.platform}
                    onChange={handleChange}
                    className="w-full bg-[#F8F4F2]/50 border-2 border-transparent border-b-[#B78D7D]/10 rounded-2xl pl-16 pr-12 py-5 text-base font-bold text-[#3E3A39] outline-none focus:border-b-[#B78D7D] focus:bg-white transition-all appearance-none cursor-pointer shadow-inner"
                  >
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Facebook">Facebook</option>
                  </select>
                  <Layout className="absolute left-6 top-1/2 -translate-y-1/2 text-[#B78D7D]/40 group-focus-within:text-[#B78D7D]" size={22} />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[#B78D7D]">
                     <Hexagon size={16} className="animate-spin-slow opacity-50" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-[#B2AAA6] uppercase tracking-[0.2em] ml-2 font-mono">Tone of Voice</label>
                <div className="relative group">
                  <select
                    name="tone"
                    value={formData.tone}
                    onChange={handleChange}
                    className="w-full bg-[#F8F4F2]/50 border-2 border-transparent border-b-[#B78D7D]/10 rounded-2xl pl-16 pr-12 py-5 text-base font-bold text-[#3E3A39] outline-none focus:border-b-[#B78D7D] focus:bg-white transition-all appearance-none cursor-pointer shadow-inner"
                  >
                    <option value="Professional">Professional</option>
                    <option value="Casual">Casual</option>
                    <option value="Witty">Witty</option>
                    <option value="Inspirational">Inspirational</option>
                    <option value="Controversial">Controversial</option>
                  </select>
                  <Mic className="absolute left-6 top-1/2 -translate-y-1/2 text-[#B78D7D]/40 group-focus-within:text-[#B78D7D]" size={22} />
                   <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[#B78D7D]">
                     <Hexagon size={16} className="animate-spin-slow opacity-50" />
                  </div>
                </div>
              </div>
            </div>

            {/* Protocol Type Selection */}
            <div className="space-y-6">
              <label className="text-[10px] font-black text-[#B2AAA6] uppercase tracking-[0.2em] ml-2 font-mono">Post Type</label>
              <div className="grid grid-cols-2 gap-8">
                <label className={`
                  relative flex flex-col items-center justify-center p-8 rounded-[2.5rem] border-2 cursor-pointer transition-all duration-500 overflow-hidden group/opt
                  ${formData.postType === 'Repost' 
                    ? 'border-[#B78D7D] bg-[#B78D7D] text-white shadow-xl shadow-[#B78D7D]/20' 
                    : 'border-[#B78D7D]/10 bg-[#F8F4F2]/50 text-[#B2AAA6] hover:border-[#B78D7D]/30'}
                `}>
                  <input
                    type="radio"
                    name="postType"
                    value="Repost"
                    checked={formData.postType === 'Repost'}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <div className={`p-4 rounded-2xl mb-4 transition-all duration-500 ${formData.postType === 'Repost' ? 'bg-white/20' : 'bg-white border border-[#B78D7D]/10 group-hover/opt:rotate-12 group-hover/opt:scale-110'}`}>
                    <Repeat size={32} className={`${formData.postType === 'Repost' ? 'text-white' : 'text-[#B78D7D]'}`} />
                  </div>
                  <span className="font-black text-[11px] uppercase tracking-[0.2em] font-mono leading-none">Repost</span>
                </label>

                <label className={`
                  relative flex flex-col items-center justify-center p-8 rounded-[2.5rem] border-2 cursor-pointer transition-all duration-500 overflow-hidden group/opt
                  ${formData.postType === 'New Post' 
                    ? 'border-[#B78D7D] bg-[#B78D7D] text-white shadow-xl shadow-[#B78D7D]/20' 
                    : 'border-[#B78D7D]/10 bg-[#F8F4F2]/50 text-[#B2AAA6] hover:border-[#B78D7D]/30'}
                `}>
                  <input
                    type="radio"
                    name="postType"
                    value="New Post"
                    checked={formData.postType === 'New Post'}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <div className={`p-4 rounded-2xl mb-4 transition-all duration-500 ${formData.postType === 'New Post' ? 'bg-white/20' : 'bg-white border border-[#B78D7D]/10 group-hover/opt:rotate-12 group-hover/opt:scale-110'}`}>
                    <PenTool size={32} className={`${formData.postType === 'New Post' ? 'text-white' : 'text-[#B78D7D]'}`} />
                  </div>
                  <span className="font-black text-[11px] uppercase tracking-[0.2em] font-mono leading-none">Write New</span>
                </label>
              </div>
            </div>

          </form>
        </div>

        {/* Modal Footer */}
        <div className="p-8 bg-[#F8F4F2]/50 border-t border-[#B78D7D]/10 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
           <div className="absolute inset-0 opacity-[0.01] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
           <div className="flex items-center gap-3 relative z-10">
              <ShieldCheck size={20} className="text-emerald-500" />
              <span className="text-[10px] font-black text-[#B2AAA6] uppercase tracking-[0.2em] font-mono">Ready to Start</span>
           </div>
           <div className="flex items-center gap-4 w-full md:w-auto relative z-10">
              <button
                onClick={onClose}
                className="flex-1 md:flex-none px-8 py-4 bg-white text-[#B2AAA6] font-black text-[10px] uppercase tracking-[0.2em] rounded-[1rem] hover:bg-rose-50 hover:text-rose-500 transition-all font-mono active:scale-95 border border-[#B78D7D]/15 shadow-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="creator-form"
                className="flex-1 md:flex-none px-10 py-4 bg-[#B78D7D] text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-[1rem] shadow-lg hover:bg-[#A37B6D] transition-all flex items-center justify-center gap-3 border border-white/10 font-mono active:scale-95"
              >
                <Save size={18} />
                <span>Save AI Writer</span>
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
