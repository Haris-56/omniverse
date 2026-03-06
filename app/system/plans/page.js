"use client";

import { useState, useEffect } from "react";
import { 
  Plus, Edit2, Trash2, Check, X, 
  CreditCard, Zap, Mail, Layout, 
  ShieldCheck, Globe, Star
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
        color: editingPlan.color || "bg-indigo-500" 
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
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight text-glow">Subscription Plans</h1>
          <p className="text-slate-500 font-medium mt-2 text-lg">Define pricing, limits, and product feature access.</p>
        </div>
        <button onClick={() => setEditingPlan({})} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2">
          <Plus size={18} /> Create New Plan
        </button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {plans.map((plan) => (
          <div key={plan._id || plan.id} className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className={`h-4 ${plan.color}`} />
            <div className="p-10 flex-1">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-2xl font-black text-slate-900">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-black text-indigo-600">${plan.price}</span>
                    <span className="text-slate-400 font-bold text-xs">/month</span>
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setEditingPlan(plan)} className="p-2 bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-xl transition-all"><Edit2 size={16}/></button>
                  <button onClick={() => handleDelete(plan._id)} className="p-2 bg-slate-50 text-slate-400 hover:text-red-600 rounded-xl transition-all"><Trash2 size={16}/></button>
                </div>
              </div>

              <div className="space-y-6">
                <LimitItem icon={<Mail size={16}/>} label="Email Sending" value={`${plan.emailLimit} / day`} />
                <LimitItem icon={<Zap size={16}/>} label="Campaigns" value={plan.campaignLimit} />
                <LimitItem icon={<Layout size={16}/>} label="Connected Accounts" value={plan.accountLimit} />
                
                <div className="pt-6 border-t border-slate-50 space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AI & Modules</h4>
                  <FeatureToggle label="AI Closer Access" active={plan.aiCloser} />
                  <FeatureToggle label="AI Creator Access" active={plan.aiCreator} />
                </div>

                <div className="pt-6 border-t border-slate-50">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Platform Access</h4>
                  <div className="flex flex-wrap gap-2">
                    {plan.platforms && plan.platforms.map(p => (
                      <span key={p} className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-tight border border-indigo-100">{p}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Plan Modal */}
      {editingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setEditingPlan(null)} />
          <div className="bg-white w-full max-w-xl h-full shadow-2xl relative animate-in slide-in-from-right duration-500 overflow-y-auto">
            <div className="p-12">
               <div className="flex justify-between items-center mb-10">
                 <div>
                   <h2 className="text-3xl font-black text-slate-900 tracking-tight">Edit Plan</h2>
                   <p className="text-slate-400 font-bold text-sm">Modify configuration for <span className="text-indigo-600">{editingPlan.name || 'New Plan'}</span></p>
                 </div>
                 <button onClick={() => setEditingPlan(null)} className="p-3 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-2xl transition-all">
                   <X size={24} />
                 </button>
               </div>

               <form className="space-y-8" onSubmit={handleSave}>
                 <div className="grid grid-cols-2 gap-6">
                    <FormGroup label="Plan Name">
                      <input type="text" name="name" defaultValue={editingPlan.name || ''} className="form-input" required />
                    </FormGroup>
                    <FormGroup label="Monthly Price ($)">
                      <input type="number" name="price" defaultValue={editingPlan.price || 0} className="form-input" required />
                    </FormGroup>
                 </div>

                 <div className="space-y-4">
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                      <Star size={16} className="text-amber-500" /> System Limits
                    </h4>
                    <div className="grid grid-cols-3 gap-4">
                      <FormGroup label="Emails / Day">
                        <input type="number" name="emailLimit" defaultValue={editingPlan.emailLimit || 100} className="form-input-sm" required />
                      </FormGroup>
                      <FormGroup label="Max Campaigns">
                        <input type="number" name="campaignLimit" defaultValue={editingPlan.campaignLimit || 5} className="form-input-sm" required />
                      </FormGroup>
                      <FormGroup label="Max Accounts">
                        <input type="number" name="accountLimit" defaultValue={editingPlan.accountLimit || 3} className="form-input-sm" required />
                      </FormGroup>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">AI Module Access</h4>
                    <div className="flex flex-col gap-3">
                      <label className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer">
                        <span className="text-sm font-bold text-slate-700">Enable AI Sales Closer</span>
                        <input type="checkbox" name="aiCloser" defaultChecked={editingPlan.aiCloser} className="w-5 h-5 accent-indigo-600" />
                      </label>
                      <label className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer">
                        <span className="text-sm font-bold text-slate-700">Enable AI Content Creator</span>
                        <input type="checkbox" name="aiCreator" defaultChecked={editingPlan.aiCreator} className="w-5 h-5 accent-indigo-600" />
                      </label>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Enabled Platforms</h4>
                    <div className="grid grid-cols-2 gap-3">
                       {["Email", "LinkedIn", "Facebook", "Instagram"].map(p => (
                         <label key={p} className="flex items-center gap-3 p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-all cursor-pointer">
                           <input type="checkbox" name={`platform_${p}`} defaultChecked={editingPlan.platforms && editingPlan.platforms.includes(p)} className="w-4 h-4 accent-indigo-600" />
                           <span className="text-sm font-bold text-slate-600">{p}</span>
                         </label>
                       ))}
                    </div>
                 </div>

                 <div className="pt-8 flex gap-4">
                    <button type="button" onClick={() => setEditingPlan(null)} className="flex-1 py-4 bg-slate-100 text-slate-400 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-all">Cancel</button>
                    <button type="submit" className="flex-[2] py-4 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">Save Changes</button>
                 </div>
               </form>
            </div>
          </div>
        </div>
      )}

      {/* Inline Styles for Form */}
      <style jsx>{`
        .form-input {
          width: 100%;
          padding: 1rem 1.25rem;
          background-color: #F8FAFC;
          border: 1px solid #F1F5F9;
          border-radius: 1rem;
          font-weight: 700;
          outline: none;
          transition: all 0.2s;
        }
        .form-input:focus {
          background-color: white;
          border-color: #6366F1;
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
        }
        .form-input-sm {
          width: 100%;
          padding: 0.75rem 1rem;
          background-color: #F8FAFC;
          border: 1px solid #F1F5F9;
          border-radius: 0.75rem;
          font-weight: 700;
          outline: none;
          font-size: 0.875rem;
        }
      `}</style>
    </div>
  );
}

function LimitItem({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-3 text-slate-400 font-medium">
        {icon}
        <span>{label}</span>
      </div>
      <span className="font-black text-slate-900">{value}</span>
    </div>
  );
}

function FeatureToggle({ label, active }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs font-bold text-slate-500">{label}</span>
      {active ? (
        <div className="w-5 h-5 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center"><Check size={12} strokeWidth={4} /></div>
      ) : (
        <div className="w-5 h-5 bg-slate-100 text-slate-300 rounded-lg flex items-center justify-center"><X size={12} strokeWidth={4} /></div>
      )}
    </div>
  );
}

function FormGroup({ label, children }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">{label}</label>
      {children}
    </div>
  );
}
