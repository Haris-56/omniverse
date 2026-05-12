"use client";

import { useState } from "react";
import { X, User, Mail, Globe, MapPin, Briefcase, Plus, Loader2, Sparkles, Activity, ShieldCheck, Hexagon } from "lucide-react";

export default function AddContactModal({ isOpen, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    website: "",
    location: "",
    company: "",
    position: ""
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onAdd(formData);
    setLoading(false);
    onClose();
    setFormData({ name: "", email: "", website: "", location: "", company: "", position: "" });
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[1000] p-6 lg:p-12 animate-in fade-in duration-500 overflow-y-auto custom-scrollbar">
      <div className="fixed inset-0 bg-[#161932]/10 backdrop-blur-2xl" onClick={handleBackdropClick} />
      
      <div className="bg-[#FCF8FE] rounded-[4rem] shadow-[0_50px_100px_rgba(130, 69, 239,0.15)] w-full max-w-2xl overflow-hidden border border-[#8245EF]/15 relative z-10 animate-in zoom-in-95 duration-500 my-auto group/modal">
        
        {/* Header */}
        <div className="p-10 border-b border-[#8245EF]/10 flex justify-between items-center bg-white/40">
           <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white text-[#8245EF] rounded-[1.75rem] flex items-center justify-center shadow-lg border border-[#8245EF]/10 group-hover/modal:rotate-12 transition-transform duration-700">
                 <Plus size={32} />
              </div>
              <div>
                 <h2 className="text-3xl font-black text-[#161932] tracking-tighter uppercase leading-none">Provision_Node</h2>
                 <p className="text-[10px] font-black text-[#8245EF] uppercase tracking-[0.4em] mt-2 font-mono italic leading-none">Inject_Into_Global_Registry</p>
              </div>
           </div>
           <button onClick={onClose} className="p-4 bg-white hover:bg-[#8245EF] group/close rounded-2xl transition-all border border-[#8245EF]/10 text-[#94a3b8] hover:text-white shadow-sm active:scale-90">
             <X size={28} className="group-hover/close:rotate-90 transition-transform duration-500" />
           </button>
        </div>

        <div className="p-12 custom-scrollbar max-h-[70vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               <div className="space-y-4">
                  <label className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.4em] ml-2 font-mono italic">Full_Identity</label>
                  <div className="relative group/input">
                     <User size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-[#94a3b8] group-focus-within/input:text-[#8245EF] transition-colors" />
                     <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-white border-2 border-transparent border-b-[#8245EF]/10 rounded-2xl pl-16 pr-8 py-5 text-sm font-bold text-[#161932] outline-none focus:border-b-[#8245EF] transition-all shadow-inner italic"
                        placeholder="e.g., John_Doe"
                     />
                  </div>
               </div>

               <div className="space-y-4">
                  <label className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.4em] ml-2 font-mono italic">Endpoint_Email</label>
                  <div className="relative group/input">
                     <Mail size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-[#94a3b8] group-focus-within/input:text-[#8245EF] transition-colors" />
                     <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-white border-2 border-transparent border-b-[#8245EF]/10 rounded-2xl pl-16 pr-8 py-5 text-sm font-bold text-[#161932] outline-none focus:border-b-[#8245EF] transition-all shadow-inner italic"
                        placeholder="john@prospect.cluster"
                     />
                  </div>
               </div>

               <div className="space-y-4">
                  <label className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.4em] ml-2 font-mono italic">Organization_Fabric</label>
                  <div className="relative group/input">
                     <Briefcase size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-[#94a3b8] group-focus-within/input:text-[#8245EF] transition-colors" />
                     <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({...formData, company: e.target.value})}
                        className="w-full bg-white border-2 border-transparent border-b-[#8245EF]/10 rounded-2xl pl-16 pr-8 py-5 text-sm font-bold text-[#161932] outline-none focus:border-b-[#8245EF] transition-all shadow-inner italic"
                        placeholder="Neural_Systems_v4"
                     />
                  </div>
               </div>

               <div className="space-y-4">
                  <label className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.4em] ml-2 font-mono italic">Operational_Directive</label>
                  <div className="relative group/input">
                     <Sparkles size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-[#94a3b8] group-focus-within/input:text-[#8245EF] transition-colors" />
                     <input
                        type="text"
                        value={formData.position}
                        onChange={(e) => setFormData({...formData, position: e.target.value})}
                        className="w-full bg-white border-2 border-transparent border-b-[#8245EF]/10 rounded-2xl pl-16 pr-8 py-5 text-sm font-bold text-[#161932] outline-none focus:border-b-[#8245EF] transition-all shadow-inner italic"
                        placeholder="Managing_Director"
                     />
                  </div>
               </div>

               <div className="space-y-4">
                  <label className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.4em] ml-2 font-mono italic">Digital_Domain_URI</label>
                  <div className="relative group/input">
                     <Globe size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-[#94a3b8] group-focus-within/input:text-[#8245EF] transition-colors" />
                     <input
                        type="text"
                        value={formData.website}
                        onChange={(e) => setFormData({...formData, website: e.target.value})}
                        className="w-full bg-white border-2 border-transparent border-b-[#8245EF]/10 rounded-2xl pl-16 pr-8 py-5 text-sm font-bold text-[#161932] outline-none focus:border-b-[#8245EF] transition-all shadow-inner italic"
                        placeholder="https://prospect.ai"
                     />
                  </div>
               </div>

               <div className="space-y-4">
                  <label className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.4em] ml-2 font-mono italic">Physical_Geospatial_Sector</label>
                  <div className="relative group/input">
                     <MapPin size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-[#94a3b8] group-focus-within/input:text-[#8245EF] transition-colors" />
                     <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        className="w-full bg-white border-2 border-transparent border-b-[#8245EF]/10 rounded-2xl pl-16 pr-8 py-5 text-sm font-bold text-[#161932] outline-none focus:border-b-[#8245EF] transition-all shadow-inner italic"
                        placeholder="London_Orbital"
                     />
                  </div>
               </div>
            </div>

            <button
               type="submit"
               disabled={loading}
               className="w-full py-7 bg-[#8245EF] text-white font-black text-xl rounded-[2.5rem] shadow-[0_30px_60px_rgba(130, 69, 239,0.3)] hover:bg-[#6d28d9] transition-all disabled:opacity-50 flex items-center justify-center gap-6 active:scale-[0.98] border border-white/10 mt-10 font-mono uppercase tracking-[0.4em] text-[12px] group/btn"
            >
               {loading ? (
                  <Loader2 size={32} className="animate-spin opacity-80" />
               ) : (
                  <>
                    <span>INTEGRATE_PROSPECT</span>
                    <Plus size={32} className="group-hover/btn:rotate-90 transition-transform duration-500" />
                  </>
               )}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <div className="p-10 bg-[#FCF8FE]/50 border-t border-[#8245EF]/10 flex items-center justify-center gap-6 relative overflow-hidden">
           <Activity size={24} className="text-[#8245EF] animate-pulse" />
           <span className="text-[10px] font-black uppercase tracking-[0.6em] text-[#94a3b8] font-mono italic leading-none">REGISTRY_SECURE_::SHA-256_VALIDATED</span>
           <div className="absolute inset-0 opacity-[0.01] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        </div>

        {/* Branding Decoration */}
        <div className="absolute top-1/2 left-10 -translate-y-1/2 opacity-[0.03] pointer-events-none -z-10 grayscale group-hover/modal:opacity-[0.06] transition-opacity duration-1000">
           <Hexagon size={240} strokeWidth={1} className="text-[#8245EF] animate-spin-slow" />
        </div>
      </div>
    </div>
  );
}
