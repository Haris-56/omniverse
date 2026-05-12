"use client";

import { useState, useEffect } from "react";
import { 
  Plus, Edit2, Trash2, Check, X, 
  CreditCard, Zap, Mail, Layout, 
  ShieldCheck, Globe, Star, Activity,
  ArrowRight, Shield, Hexagon
} from "lucide-react";

export default function PlanManagement() {
  const [plans, setPlans] = useState([]);
  const [editingPlan, setEditingPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await fetch("/api/system/plans");
      const data = await res.json();
      setPlans(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const planData = {
        _id: editingPlan._id, 
        name: formData.get("name"),
        price: Number(formData.get("price")),
        emailLimit: Number(formData.get("emailLimit")),
        campaignLimit: Number(formData.get("campaignLimit")),
        accountLimit: Number(formData.get("accountLimit")),
        aiCloser: formData.get("aiCloser") === "on",
        aiCreator: formData.get("aiCreator") === "on",
        platforms: ["Email", "LinkedIn", "Facebook", "Instagram"].filter(p => formData.get(`platform_${p}`) === "on"),
        color: editingPlan.color || "bg-[#8245EF]" 
    };

    try {
        await fetch("/api/system/plans", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(planData)
        });
        setEditingPlan(null);
        fetchPlans();
    } catch (err) {
        alert("Failed to save plan");
    }
  };
  
  const handleDelete = async (id) => {
    if(!confirm("Are you sure?")) return;
    await fetch(`/api/system/plans?id=${id}`, { method: "DELETE" });
    fetchPlans();
  };

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-1000 font-sans p-4 lg:p-0 pb-32">
      <div className="max-w-full mx-auto space-y-20">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-[#8245EF]/10 pb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
                 <span className="px-5 py-2 bg-[#8245EF]/10 text-[#8245EF] text-[10px] font-black uppercase tracking-[0.4em] rounded-full border border-[#8245EF]/20 flex items-center gap-3 font-mono">
                 <ShieldCheck size={16} className="opacity-80" />
                 Protocol_Standardization::Active
               </span>
            </div>
            <h1 className="text-7xl font-black text-[#161932] tracking-tighter uppercase leading-none">
              Service <span className="text-[#8245EF]">Matrix</span>
            </h1>
            <p className="text-[#64748b] text-2xl font-medium max-w-3xl leading-relaxed italic">Calibrate subscription tiers, resource throughput limits, and modular feature access.</p>
          </div>
          <button 
            onClick={() => setEditingPlan({})} 
            className="group px-12 py-6 bg-[#8245EF] text-white font-black uppercase text-[11px] tracking-[0.4em] rounded-[2rem] flex items-center justify-center gap-5 transition-all shadow-xl hover:bg-[#6d28d9] active:scale-95 font-mono border border-white/10"
          >
            <Plus size={24} className="group-hover:rotate-90 transition-transform duration-500" /> 
            Induct_New_Tier
          </button>
        </div>

        {/* Plans Matrix Grid */}
        {loading ? (
             <div className="flex flex-col items-center justify-center py-48 space-y-10 animate-pulse text-center">
                <div className="w-24 h-24 border-8 border-[#FCF8FE] border-t-[#8245EF] rounded-full animate-spin shadow-inner" />
                <p className="text-[11px] font-black text-[#94a3b8] uppercase tracking-[0.6em] font-mono">Synchronizing_Plan_Registry...</p>
             </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <div key={plan._id || plan.id} className="group bg-white rounded-[4rem] border border-[#8245EF]/10 shadow-sm transition-all duration-700 hover:-translate-y-2 flex flex-col relative overflow-hidden h-full">
                <div className="h-2 w-full absolute top-0 left-0 z-20 bg-[#8245EF] opacity-40" />
                
                <div className="p-12 pb-14 flex-1 flex flex-col relative z-10">
                  <div className="flex justify-between items-start mb-10">
                    <div>
                      <h3 className="text-3xl font-black text-[#161932] tracking-tighter uppercase leading-none">{plan.name}</h3>
                      <div className="flex items-baseline gap-2 mt-5">
                        <span className="text-[10px] font-black text-[#94a3b8] uppercase tracking-widest font-mono">Cost::</span>
                        <span className="text-4xl font-black text-[#8245EF] tracking-tighter">${plan.price}</span>
                        <span className="text-[#94a3b8] font-black text-[9px] uppercase tracking-widest font-mono">/Cycle</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3">
                       <button onClick={() => setEditingPlan(plan)} className="p-3.5 bg-[#FCF8FE] border border-[#8245EF]/10 text-[#94a3b8] hover:text-[#8245EF] hover:bg-white rounded-[1.25rem] transition-all active:scale-90 shadow-sm"><Edit2 size={20}/></button>
                       <button onClick={() => handleDelete(plan._id)} className="p-3.5 bg-[#FCF8FE] border border-[#8245EF]/10 text-[#94a3b8] hover:text-rose-500 hover:bg-white rounded-[1.25rem] transition-all active:scale-90 shadow-sm"><Trash2 size={20}/></button>
                    </div>
                  </div>

                  <div className="space-y-10 flex-1">
                    <div className="space-y-4">
                       <p className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.4em] font-mono border-b border-[#8245EF]/10 pb-4">Throughput_Limits</p>
                       <LimitItem icon={<Mail size={18}/>} label="Email_Ingress" value={`${plan.emailLimit} u/D`} />
                       <LimitItem icon={<Zap size={18}/>} label="Neural_Chains" value={plan.campaignLimit} />
                       <LimitItem icon={<Layout size={18}/>} label="Node_Links" value={plan.accountLimit} />
                    </div>
                    
                    <div className="space-y-4">
                       <p className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.4em] font-mono border-b border-[#8245EF]/10 pb-4">Modular_Access</p>
                       <FeatureToggle label="AI_Sales_Closer" active={plan.aiCloser} />
                       <FeatureToggle label="AI_Content_Engine" active={plan.aiCreator} />
                    </div>

                    <div className="pt-2">
                      <p className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.4em] font-mono mb-6">Channel_Provisioning</p>
                      <div className="flex flex-wrap gap-2.5">
                        {plan.platforms && plan.platforms.map(p => (
                          <span key={p} className="px-5 py-2 bg-[#FCF8FE] text-[#64748b] rounded-xl text-[10px] font-black uppercase tracking-widest border border-[#8245EF]/10 group-hover:border-[#8245EF]/30 transition-all font-mono italic shadow-sm">{p}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Manifest Editor Component (Modal) */}
      {editingPlan && (
        <div className="fixed inset-0 z-[600] flex items-center justify-end p-0">
          <div className="absolute inset-0 bg-[#161932]/60 backdrop-blur-xl animate-in fade-in duration-500" onClick={() => setEditingPlan(null)} />
          <div className="bg-white w-full max-w-3xl h-full shadow-2xl relative animate-in slide-in-from-right duration-700 overflow-y-auto border-l border-[#8245EF]/15 flex flex-col p-0">
                        <div className="p-8 flex-1">
               <div className="flex justify-between items-start mb-10">
                 <div>
                   <h2 className="text-3xl font-bold text-[#161932] tracking-tight uppercase leading-none">Tier Calibration</h2>
                   <p className="text-[#64748b] font-bold text-[10px] uppercase tracking-wider mt-4 font-mono flex items-center gap-3">
                      <Edit2 size={14} className="text-[#8245EF]" />
                      Configuration for: <span className="text-[#161932] underline decoration-[#8245EF]/30">{editingPlan.name || 'UNINITIALIZED_TIER'}</span>
                   </p>
                 </div>
                 <button onClick={() => setEditingPlan(null)} className="p-3 bg-[#FCF8FE] border border-[#8245EF]/10 text-[#94a3b8] hover:text-[#161932] group rounded-xl transition-all active:scale-90 shadow-sm">
                   <X size={20} className="group-hover:rotate-90 transition-transform duration-500" />
                 </button>
               </div>

               <form className="space-y-10" onSubmit={handleSave}>
                 <div className="grid grid-cols-2 gap-6">
                    <FormGroup label="Tier Designation">
                      <input type="text" name="name" defaultValue={editingPlan.name || ''} className="form-input" placeholder="e.g. OMNI PRO" required />
                    </FormGroup>
                    <FormGroup label="Cycle Cost USD">
                      <input type="number" name="price" defaultValue={editingPlan.price || 0} className="form-input text-[#8245EF]" placeholder="0.00" required />
                    </FormGroup>
                 </div>

                 <div className="space-y-6 bg-[#FCF8FE]/50 p-8 rounded-3xl border border-[#8245EF]/10">
                    <h4 className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider font-mono border-b border-[#8245EF]/10 pb-4 mb-6">Resource Throughput Matrix</h4>
                    <div className="grid grid-cols-3 gap-6">
                      <FormGroup label="Mail Nodes">
                        <input type="number" name="emailLimit" defaultValue={editingPlan.emailLimit || 100} className="form-input-sm" required />
                      </FormGroup>
                      <FormGroup label="Neural Chains">
                        <input type="number" name="campaignLimit" defaultValue={editingPlan.campaignLimit || 5} className="form-input-sm" required />
                      </FormGroup>
                      <FormGroup label="Access Nodes">
                        <input type="number" name="accountLimit" defaultValue={editingPlan.accountLimit || 3} className="form-input-sm" required />
                      </FormGroup>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <h4 className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider font-mono ml-2">Advanced Modular Access</h4>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between p-4 bg-white rounded-xl border border-[#8245EF]/10 cursor-pointer group hover:border-[#8245EF]/40 transition-all shadow-sm">
                        <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider font-mono">Neural Sales Closer</span>
                        <div className="relative">
                          <input type="checkbox" name="aiCloser" defaultChecked={editingPlan.aiCloser} className="w-6 h-6 rounded-md bg-[#FCF8FE] border-[#8245EF]/20 text-[#8245EF] focus:ring-[#8245EF]/20" />
                        </div>
                      </label>
                      <label className="flex items-center justify-between p-4 bg-white rounded-xl border border-[#8245EF]/10 cursor-pointer group hover:border-[#8245EF]/40 transition-all shadow-sm">
                        <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider font-mono">Generative Creator</span>
                        <div className="relative">
                          <input type="checkbox" name="aiCreator" defaultChecked={editingPlan.aiCreator} className="w-6 h-6 rounded-md bg-[#FCF8FE] border-[#8245EF]/20 text-[#8245EF] focus:ring-[#8245EF]/20" />
                        </div>
                      </label>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <h4 className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider font-mono ml-2">Channel Inception</h4>
                    <div className="grid grid-cols-2 gap-4">
                       {["Email", "LinkedIn", "Facebook", "Instagram"].map(p => (
                         <label key={p} className="flex items-center gap-3 p-4 bg-[#FCF8FE]/50 border border-[#8245EF]/10 rounded-xl hover:border-[#8245EF]/30 transition-all cursor-pointer group">
                           <input type="checkbox" name={`platform_${p}`} defaultChecked={editingPlan.platforms && editingPlan.platforms.includes(p)} className="w-5 h-5 rounded-md bg-white border-[#8245EF]/20 text-[#8245EF]" />
                           <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider font-mono group-hover:text-[#161932] transition-colors">{p}</span>
                         </label>
                       ))}
                    </div>
                 </div>

                 <div className="pt-8 flex gap-4">
                    <button type="button" onClick={() => setEditingPlan(null)} className="flex-1 py-4 bg-[#FCF8FE] text-[#94a3b8] font-bold text-[11px] uppercase tracking-wider rounded-xl hover:bg-[#e2e8f0] transition-all font-mono border border-[#8245EF]/10">Cancel Link</button>
                    <button type="submit" className="flex-[2] py-4 bg-[#8245EF] text-white font-bold text-[11px] uppercase tracking-wider rounded-xl hover:bg-[#6d28d9] transition-all shadow-md font-mono border border-white/10 active:scale-95">Commit Matrix</button>
                 </div>
               </form>
            </div>
            
            <div className="p-12 border-t border-[#8245EF]/10 bg-[#FCF8FE]/50 flex items-center justify-center gap-4">
               <ShieldCheck size={20} className="text-[#8245EF]" />
               <span className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.5em] font-mono">End-to-End Authority Verified</span>
            </div>
          </div>
        </div>
      )}

      {/* Global CSS for Form Inputs */}
      <style jsx>{`
        .form-input {
          width: 100%;
          padding: 1rem 1.25rem;
          background-color: rgba(248, 244, 242, 0.5);
          border: 1px solid rgba(130, 69, 239, 0.2);
          border-radius: 1rem;
          font-weight: bold;
          color: #161932;
          outline: none;
          transition: all 0.3s;
          font-family: monospace;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          font-size: 0.85rem;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
        }
        .form-input:focus {
          border-color: #8245EF;
          background-color: #ffffff;
          box-shadow: 0 4px 12px rgba(130, 69, 239, 0.1);
        }
        .form-input-sm {
          width: 100%;
          padding: 1rem;
          background-color: #ffffff;
          border: 1px solid rgba(130, 69, 239, 0.2);
          border-radius: 1rem;
          font-weight: bold;
          color: #8245EF;
          outline: none;
          font-family: monospace;
          text-align: center;
          font-size: 1.1rem;
          transition: all 0.3s;
          box-shadow: 0 2px 6px rgba(0,0,0,0.02);
        }
        .form-input-sm:focus {
           border-color: #8245EF;
           box-shadow: 0 4px 12px rgba(130, 69, 239, 0.1);
        }
        .form-input::placeholder {
            color: #94a3b8;
        }
      `}</style>
    </div>
  );
}

function LimitItem({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between text-sm py-2">
      <div className="flex items-center gap-5 text-[#64748b] font-black font-mono text-[10px] uppercase tracking-widest leading-none">
        <div className="text-[#8245EF] opacity-80 leading-none">{icon}</div>
        <span className="leading-none pt-0.5">{label}</span>
      </div>
      <span className="font-black text-[#161932] font-mono text-sm leading-none">{value}</span>
    </div>
  );
}

function FeatureToggle({ label, active }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-[10px] font-black text-[#64748b] uppercase tracking-widest font-mono leading-none">{label}</span>
      {active ? (
        <div className="px-5 py-2 bg-[#8245EF]/10 text-[#8245EF] rounded-xl flex items-center gap-3 text-[10px] font-black uppercase tracking-tighter border border-[#8245EF]/20 leading-none"><Check size={14} strokeWidth={4} /> Enabled</div>
      ) : (
        <div className="px-5 py-2 bg-[#FCF8FE] text-[#94a3b8] rounded-xl flex items-center gap-3 text-[10px] font-black uppercase tracking-tighter border border-[#8245EF]/10 leading-none"><X size={14} strokeWidth={4} /> Restricted</div>
      )}
    </div>
  );
}

function FormGroup({ label, children }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider font-mono ml-2">{label}</label>
      {children}
    </div>
  );
}
