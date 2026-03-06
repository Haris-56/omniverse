"use client";

import { useState, useEffect } from "react";
import { Plus, FileText, Trash2, Edit, Search } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await fetch("/api/email/templates");
      if (res.ok) {
        const data = await res.json();
        setTemplates(data);
      }
    } catch (error) {
      console.error("Failed to fetch templates", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!confirm("Delete this template?")) return;

    try {
      const res = await fetch(`/api/email/templates/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchTemplates();
      }
    } catch (error) {
      console.error("Failed to delete", error);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50/50 p-8 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Email Templates</h1>
            <p className="text-gray-500 mt-2 font-medium">Design and manage your cold outreach scripts.</p>
          </div>
          <button
            onClick={() => router.push("/email/templates/new")}
            className="px-6 py-3 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-800 transition-all shadow-lg flex items-center gap-2"
          >
            <Plus size={20} />
            New Template
          </button>
        </div>

        {loading ? (
           <div className="text-center py-20">Loading...</div>
        ) : templates.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-[2.5rem] border border-dashed border-gray-200">
             <div className="w-20 h-20 bg-gray-50 text-gray-400 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <FileText size={40} />
             </div>
             <h3 className="text-xl font-black text-gray-900 mb-2">No Templates Yet</h3>
             <p className="text-gray-400 font-medium mb-8">Create your first personalized email template.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {templates.map((template) => (
              <div
                key={template._id}
                onClick={() => router.push(`/email/templates/${template._id}`)}
                className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group relative"
              >
                <div className="flex justify-between items-start mb-4">
                   <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                      <FileText size={24} />
                   </div>
                   <button 
                     onClick={(e) => handleDelete(e, template._id)}
                     className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                   >
                     <Trash2 size={18} />
                   </button>
                </div>
                <h3 className="font-bold text-gray-900 mb-1 truncate">{template.name}</h3>
                <p className="text-xs text-gray-400 font-medium truncate mb-4">{template.subject}</p>
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-300">
                   <span>HTML Format</span>
                   <span>Last Edit: {new Date(template.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
