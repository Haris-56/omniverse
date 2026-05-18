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
          <div className="space-y-4">
            <div className="flex items-center gap-3">
                 <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-full border border-green-100 flex items-center gap-2">
                 <ShieldCheck size={14} className="opacity-80" />
                 Plan Management
               </span>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 tracking-tight">Subscription Plans</h1>
            <p className="text-gray-500 text-xl font-medium">Manage your subscription plans, user limits, and features.</p>
          </div>
          <button 
            onClick={() => setEditingPlan({})} 
            className="group px-8 py-4 bg-[#8245EF] text-white font-bold uppercase text-xs tracking-widest rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg hover:bg-[#6d28d9] active:scale-95 border border-white/10"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500" /> 
            Create New Plan
          </button>
        </div>

        {/* Plans Matrix Grid */}
        {loading ? (
              <div className="flex flex-col items-center justify-center py-40 space-y-4 text-center">
                 <div className="w-16 h-16 border-4 border-gray-100 border-t-[#8245EF] rounded-full animate-spin" />
                 <p className="text-xs font-bold text-gray-400">Loading plans...</p>
              </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <div key={plan._id || plan.id} className="group bg-white rounded-[4rem] border border-[#8245EF]/10 shadow-sm transition-all duration-700 hover:-translate-y-2 flex flex-col relative overflow-hidden h-full">
                <div className="h-2 w-full absolute top-0 left-0 z-20 bg-[#8245EF] opacity-40" />
                
                <div className="p-12 pb-14 flex-1 flex flex-col relative z-10">
                  <div className="flex justify-between items-start mb-10">
                     <div>
                       <h3 className="text-2xl font-bold text-gray-900 mb-4">{plan.name}</h3>
                       <div className="flex items-baseline gap-2">
                         <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Price:</span>
                         <span className="text-4xl font-bold text-[#8245EF] tracking-tight">${plan.price}</span>
                         <span className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">/month</span>
                       </div>
                     </div>
                    <div className="flex flex-col gap-3">
                       <button onClick={() => setEditingPlan(plan)} className="p-3.5 bg-[#FCF8FE] border border-[#8245EF]/10 text-[#94a3b8] hover:text-[#8245EF] hover:bg-white rounded-[1.25rem] transition-all active:scale-90 shadow-sm"><Edit2 size={20}/></button>
                       <button onClick={() => handleDelete(plan._id)} className="p-3.5 bg-[#FCF8FE] border border-[#8245EF]/10 text-[#94a3b8] hover:text-rose-500 hover:bg-white rounded-[1.25rem] transition-all active:scale-90 shadow-sm"><Trash2 size={20}/></button>
                    </div>
                  </div>

                  <div className="space-y-10 flex-1">
                    <div className="space-y-4">
                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Daily Limits</p>
                       <LimitItem icon={<Mail size={16}/>} label="Emails" value={`${plan.emailLimit} / day`} />
                       <LimitItem icon={<Zap size={16}/>} label="Campaigns" value={plan.campaignLimit} />
                       <LimitItem icon={<Layout size={16}/>} label="Accounts" value={plan.accountLimit} />
                    </div>
                    
                    <div className="space-y-4">
                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Features</p>
                       <FeatureToggle label="Sales AI" active={plan.aiCloser} />
                       <FeatureToggle label="Content AI" active={plan.aiCreator} />
                    </div>

                    <div className="pt-2">
                    <div className="pt-2">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Platforms</p>
                      <div className="flex flex-wrap gap-2">
                        {plan.platforms && plan.platforms.map(p => (
                          <span key={p} className="px-3 py-1 bg-gray-50 text-gray-500 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-gray-100">{p}</span>
                        ))}
                      </div>
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
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Edit Plan</h2>
                    <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-2 flex items-center gap-2">
                       <Edit2 size={14} className="text-[#8245EF]" />
                       Plan: <span className="text-gray-900">{editingPlan.name || 'New Plan'}</span>
                    </p>
                  </div>
                 </div>
                 <button onClick={() => setEditingPlan(null)} className="p-3 bg-[#FCF8FE] border border-[#8245EF]/10 text-[#94a3b8] hover:text-[#161932] group rounded-xl transition-all active:scale-90 shadow-sm">
                   <X size={20} className="group-hover:rotate-90 transition-transform duration-500" />
                 </button>
               </div>

               <form className="space-y-10" onSubmit={handleSave}>
                 <div className="grid grid-cols-2 gap-6">
                    <FormGroup label="Plan Name">
                      <input type="text" name="name" defaultValue={editingPlan.name || ''} className="form-input" placeholder="e.g. Pro Plan" required />
                    </FormGroup>
                    <FormGroup label="Price (USD)">
                      <input type="number" name="price" defaultValue={editingPlan.price || 0} className="form-input text-[#8245EF]" placeholder="0" required />
                    </FormGroup>
                 </div>

                  <div className="space-y-6 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-200 pb-2 mb-6">Usage Limits</h4>
                    <div className="grid grid-cols-3 gap-6">
                      <FormGroup label="Emails">
                        <input type="number" name="emailLimit" defaultValue={editingPlan.emailLimit || 100} className="form-input-sm" required />
                      </FormGroup>
                      <FormGroup label="Campaigns">
                        <input type="number" name="campaignLimit" defaultValue={editingPlan.campaignLimit || 5} className="form-input-sm" required />
                      </FormGroup>
                      <FormGroup label="Accounts">
                        <input type="number" name="accountLimit" defaultValue={editingPlan.accountLimit || 3} className="form-input-sm" required />
                      </FormGroup>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-2">AI Features</h4>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 cursor-pointer hover:border-[#8245EF]/20 transition-all">
                        <span className="text-xs font-bold text-gray-500">Sales AI</span>
                        <input type="checkbox" name="aiCloser" defaultChecked={editingPlan.aiCloser} className="w-5 h-5 rounded border-gray-200 text-[#8245EF]" />
                      </label>
                      <label className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 cursor-pointer hover:border-[#8245EF]/20 transition-all">
                        <span className="text-xs font-bold text-gray-500">Content AI</span>
                        <input type="checkbox" name="aiCreator" defaultChecked={editingPlan.aiCreator} className="w-5 h-5 rounded border-gray-200 text-[#8245EF]" />
                      </label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-2">Platforms</h4>
                    <div className="grid grid-cols-2 gap-4">
                       {["Email", "LinkedIn", "Facebook", "Instagram"].map(p => (
                         <label key={p} className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-100 rounded-xl hover:border-[#8245EF]/20 cursor-pointer transition-all">
                           <input type="checkbox" name={`platform_${p}`} defaultChecked={editingPlan.platforms && editingPlan.platforms.includes(p)} className="w-5 h-5 rounded border-gray-200 text-[#8245EF]" />
                           <span className="text-xs font-bold text-gray-500">{p}</span>
                         </label>
                       ))}
                    </div>
                  </div>

                  <div className="pt-8 flex gap-4">
                    <button type="button" onClick={() => setEditingPlan(null)} className="flex-1 py-4 bg-gray-50 text-gray-400 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-gray-100 transition-all border border-gray-200">Cancel</button>
                    <button type="submit" className="flex-[2] py-4 bg-[#8245EF] text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-[#6d28d9] transition-all shadow-lg active:scale-95 border border-white/10">Save Plan</button>
                  </div>
               </form>
            </div>
                        <div className="p-8 border-t border-gray-100 bg-gray-50 flex items-center justify-center gap-2">
                <ShieldCheck size={16} className="text-[#8245EF]" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">System Secured</span>
             </div>
          </div>
        </div>
      )}

      {/* Global CSS for Form Inputs */}
      <style jsx>{`
        .form-input {
          width: 100%;
          padding: 0.75rem 1rem;
          background-color: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          font-weight: 600;
          color: #111827;
          outline: none;
          transition: all 0.2s;
          font-size: 0.875rem;
        }
        .form-input:focus {
          border-color: #8245EF;
          background-color: #ffffff;
          box-shadow: 0 0 0 4px rgba(130, 69, 239, 0.1);
        }
        .form-input-sm {
          width: 100%;
          padding: 0.75rem;
          background-color: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          font-weight: 700;
          color: #8245EF;
          outline: none;
          text-align: center;
          font-size: 1rem;
          transition: all 0.2s;
        }
        .form-input-sm:focus {
           border-color: #8245EF;
           box-shadow: 0 0 0 4px rgba(130, 69, 239, 0.1);
        }
        .form-input::placeholder {
            color: #d1d5db;
        }
      `}</style>
    </div>
  );
}

function LimitItem({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between text-sm py-2">
      <div className="flex items-center gap-3 text-gray-400 font-bold text-[10px] uppercase tracking-widest">
        <div className="text-[#8245EF] opacity-80">{icon}</div>
        <span>{label}</span>
      </div>
      <span className="font-bold text-gray-900 text-sm">{value}</span>
    </div>
  );
}

function FeatureToggle({ label, active }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>
      {active ? (
        <div className="px-3 py-1 bg-green-50 text-green-600 rounded-lg flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest border border-green-100"><Check size={12} strokeWidth={4} /> Enabled</div>
      ) : (
        <div className="px-3 py-1 bg-gray-50 text-gray-400 rounded-lg flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest border border-gray-100"><X size={12} strokeWidth={4} /> Disabled</div>
      )}
    </div>
  );
}

function FormGroup({ label, children }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">{label}</label>
      {children}
    </div>
  );
}
