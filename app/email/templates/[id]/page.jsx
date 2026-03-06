"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  ArrowLeft, Save, Bold, Italic, Underline, 
  Link as LinkIcon, List, Type, Variable 
} from "lucide-react";

export default function TemplateEditor() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const isNew = id === "new";

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  
  const [template, setTemplate] = useState({
    name: "New Template",
    subject: "",
    body: "Hi {{first_name}},<br><br>I noticed that..."
  });

  const editorRef = useRef(null);

  useEffect(() => {
    if (!isNew && id) {
      fetchTemplate(id);
    }
  }, [id, isNew]);

  const fetchTemplate = async (templateId) => {
    try {
      const res = await fetch("/api/email/templates");
      if (res.ok) {
        const data = await res.json();
        const found = data.find(t => t._id === templateId);
        if (found) {
          setTemplate(found);
          if (editorRef.current) {
            editorRef.current.innerHTML = found.body;
          }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const bodyContent = editorRef.current.innerHTML;
    
    try {
      const payload = { ...template, body: bodyContent };
      const url = isNew ? "/api/email/templates" : `/api/email/templates/${id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        router.push("/email/templates");
      } else {
        alert("Failed to save");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const execCmd = (cmd, val = null) => {
    document.execCommand(cmd, false, val);
    if(editorRef.current) editorRef.current.focus();
  };

  const insertVariable = (variable) => {
    const formatted = `{{${variable}}}`;
    execCmd("insertText", formatted);
  };

  const variables = [
    { label: "First Name", value: "first_name" },
    { label: "Last Name", value: "last_name" },
    { label: "Company", value: "company" },
    { label: "Job Title", value: "job_title" },
    { label: "Email", value: "email" },
  ];

  if (loading) return <div className="p-10 text-center">Loading editor...</div>;

  return (
    <div className="w-full min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-50 rounded-xl transition-all">
            <ArrowLeft size={20} className="text-gray-500" />
          </button>
          <div>
            <h1 className="text-lg font-black text-gray-900 tracking-tight">
              {isNew ? "Create Template" : "Edit Template"}
            </h1>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center gap-2"
        >
          <Save size={18} />
          {saving ? "Saving..." : "Save Template"}
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Editor Area */}
        <div className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto w-full">
           <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1 mb-2 block">Internal Name</label>
                <input 
                  type="text" 
                  value={template.name}
                  onChange={e => setTemplate({...template, name: e.target.value})}
                  className="w-full text-xl font-bold text-gray-900 placeholder:text-gray-300 border-none outline-none focus:ring-0 bg-transparent p-0"
                  placeholder="e.g. First Follow-up"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1 mb-2 block">Subject Line</label>
                <input 
                  type="text" 
                  value={template.subject}
                  onChange={e => setTemplate({...template, subject: e.target.value})}
                  className="w-full text-3xl font-black text-gray-900 placeholder:text-gray-200 border-b-2 border-transparent focus:border-gray-100 outline-none pb-2 transition-all bg-transparent"
                  placeholder="Subject..."
                />
              </div>

              {/* Toolbar */}
              <div className="sticky top-0 bg-white py-2 border-b border-gray-100 flex items-center gap-1 z-10">
                 <button onClick={() => execCmd('bold')} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"><Bold size={16} /></button>
                 <button onClick={() => execCmd('italic')} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"><Italic size={16} /></button>
                 <button onClick={() => execCmd('underline')} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"><Underline size={16} /></button>
                 <div className="w-px h-4 bg-gray-200 mx-2" />
                 <button onClick={() => execCmd('insertUnorderedList')} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"><List size={16} /></button>
              </div>

              {/* Editable Content */}
              <div 
                ref={editorRef}
                contentEditable
                className="min-h-[400px] outline-none text-lg text-gray-700 leading-relaxed font-serif prose max-w-none empty:before:content-[attr(placeholder)] empty:before:text-gray-300 pointer-events-auto"
                onInput={() => setTemplate({...template, body: editorRef.current.innerHTML})}
                dangerouslySetInnerHTML={{ __html: template.body }}
              />
           </div>
        </div>

        {/* Variables Sidebar */}
        <div className="w-72 bg-gray-50 border-l border-gray-100 p-6 hidden lg:block overflow-y-auto">
           <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
             <Variable size={14} className="text-indigo-600" />
             Dynamic Fields
           </h3>
           <div className="space-y-2">
             {variables.map(v => (
               <button 
                 key={v.value}
                 onClick={() => insertVariable(v.value)}
                 className="w-full text-left px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:border-indigo-300 hover:shadow-md transition-all flex items-center justify-between group"
               >
                 <span>{v.label}</span>
                 <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                   {`{{${v.value}}}`}
                 </span>
               </button>
             ))}
           </div>
           
           <div className="mt-8 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
             <p className="text-[10px] text-indigo-800 font-medium leading-relaxed">
               Click a variable to insert it at your cursor position. Variables will be replaced with real contact data during sending.
             </p>
           </div>
        </div>
      </div>
    </div>
  );
}
