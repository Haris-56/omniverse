"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  Zap, 
  Facebook, 
  Instagram, 
  Linkedin, 
  Mail, 
  Clock, 
  AlertCircle,
  Play,
  Settings,
  X,
  User,
  MessageSquare,
  Cpu,
  ShieldCheck,
  ChevronRight,
  Loader2,
  GripVertical
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors 
} from "@dnd-kit/core";
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const ACTIONS = {
  facebook: [
    { id: 'fb-msg', label: 'FB Message', icon: <Facebook size={20} /> },
    { id: 'fb-post', label: 'FB Post Interaction', icon: <Facebook size={20} /> }
  ],
  instagram: [
    { id: 'ig-dm', label: 'IG Direct Message', icon: <Instagram size={20} /> },
    { id: 'ig-story', label: 'IG Story Reply', icon: <Instagram size={20} /> }
  ],
  linkedin: [
    { id: 'li-conn', label: 'LI Connection', icon: <Linkedin size={20} /> },
    { id: 'li-msg', label: 'LI Message', icon: <Linkedin size={20} /> }
  ],
  email: [
    { id: 'em-send', label: 'Send Email', icon: <Mail size={20} /> },
    { id: 'em-followup', label: 'Email Follow-up', icon: <Mail size={20} /> }
  ],
  automation: [
    { id: 'auto-delay', label: 'Time Delay', icon: <Clock size={20} /> },
    { id: 'auto-cond', label: 'Condition Node', icon: <Zap size={20} /> }
  ]
};

function SortableBlock({ block, idx, isLast, isSelected, onSelect, onRemove }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    position: 'relative'
  };

  return (
    <div ref={setNodeRef} style={style} className="w-full flex flex-col items-center group/block">
      <div 
        onClick={() => onSelect(block)}
        className={`w-full max-w-sm bg-white border rounded-[2rem] p-4 md:p-5 flex items-center gap-4 md:gap-5 transition-all duration-300 cursor-pointer shadow-sm relative z-10 ${isSelected ? 'border-indigo-600 ring-4 ring-indigo-50 shadow-indigo-100' : 'border-gray-100 hover:border-indigo-200 hover:shadow-xl'} ${isDragging ? 'opacity-50 scale-105 shadow-2xl border-indigo-400' : ''}`}
      >
        <div 
          {...attributes} 
          {...listeners}
          className="p-1 text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing"
        >
           <GripVertical size={18} />
        </div>

        <div className={`w-12 h-12 md:w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${block.platform === 'facebook' ? 'bg-blue-50 text-blue-600' : block.platform === 'instagram' ? 'bg-purple-50 text-purple-600' : block.platform === 'linkedin' ? 'bg-sky-50 text-sky-600' : block.platform === 'email' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
           {ACTIONS[block.platform]?.find(a => a.id === block.templateId)?.icon || <Zap size={20} />}
        </div>
        
        <div className="flex-1 min-w-0">
           <p className="font-black text-gray-900 tracking-tight text-sm md:text-base truncate">{block.label}</p>
           <div className="flex items-center gap-2 mt-1">
              {block.platform !== 'automation' && (
                 <div className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${block.config.accountId ? 'border-green-100 bg-green-50 text-green-600' : 'border-amber-100 bg-amber-50 text-amber-600'}`}>
                    {block.config.accountId ? 'Account Linked' : 'No Account'}
                 </div>
              )}
              {block.config.delay > 0 && (
                <div className="text-[8px] font-black uppercase px-2 py-0.5 rounded-full border border-indigo-100 bg-indigo-50 text-indigo-600">
                   {block.config.delay}m wait
                </div>
              )}
           </div>
        </div>
        
        <button 
          onClick={(e) => { e.stopPropagation(); onRemove(block.id); }} 
          className="p-2 text-gray-300 hover:text-red-500 transition-opacity"
        >
           <Trash2 size={16} />
        </button>
      </div>
      {!isLast && <div className="w-0.5 h-12 bg-indigo-100" />}
    </div>
  );
}

export default function CampaignBuilderPage() {
  const { id } = useParams();
  const router = useRouter();
  const [campaignName, setCampaignName] = useState("Universal Outreach Flow");
  const [blocks, setBlocks] = useState([]);
  const [activeTab, setActiveTab] = useState('facebook');
  const [configBlock, setConfigBlock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [accounts, setAccounts] = useState({ facebook: [], instagram: [], linkedin: [], email: [] });
  const [agents, setAgents] = useState([]);
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    fetchInitialData();
  }, [id]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [fb, ig, li, em, ag, camp] = await Promise.all([
        fetch("/api/facebook/accounts").then(res => res.json()),
        fetch("/api/instagram/accounts").then(res => res.json()),
        fetch("/api/linkedin/accounts").then(res => res.json()),
        fetch("/api/email/accounts").then(res => res.json()),
        fetch("/api/ai-agents").then(res => res.json()),
        id !== 'new' ? fetch(`/api/campaigns/${id}`).then(res => res.json()) : Promise.resolve(null)
      ]);

      setAccounts({ 
        facebook: Array.isArray(fb) ? fb : [], 
        instagram: Array.isArray(ig) ? ig : [], 
        linkedin: Array.isArray(li) ? li : [], 
        email: Array.isArray(em) ? em : [] 
      });
      setAgents(Array.isArray(ag) ? ag : []);
      
      if (camp) {
        setCampaignName(camp.name);
        setBlocks(camp.blocks || []);
      }
    } catch (error) {
      console.error("Initialization Failed", error);
    } finally {
      setLoading(false);
    }
  };

  const addBlock = (template) => {
    const newBlock = {
      id: Math.random().toString(36).substr(2, 9),
      templateId: template.id,
      label: template.label,
      platform: activeTab,
      config: {
        accountId: '',
        agentId: '',
        message: '',
        delay: 0,
        conditions: {}
      }
    };
    setBlocks([...blocks, newBlock]);
    setConfigBlock(newBlock);
    if (window.innerWidth < 768) {
      setIsLeftPanelOpen(false);
      setIsRightPanelOpen(true);
    }
  };

  const removeBlock = (blockId) => {
    setBlocks(blocks.filter(b => b.id !== blockId));
    if (configBlock?.id === blockId) setConfigBlock(null);
  };

  const updateBlockConfig = (blockId, newConfig) => {
    setBlocks(blocks.map(b => b.id === blockId ? { ...b, config: { ...b.config, ...newConfig } } : b));
    if (configBlock?.id === blockId) {
      setConfigBlock(prev => ({ ...prev, config: { ...prev.config, ...newConfig } }));
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setBlocks((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = id === 'new' ? '/api/campaigns' : `/api/campaigns/${id}`;
      const method = id === 'new' ? 'POST' : 'PUT';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: campaignName, 
          blocks, 
          status: 'Running', // Auto-run on deploy
          isAdvanced: true,
          platform: 'multi-channel'
        })
      });

      if (res.ok) {
        const saved = await res.json();
        router.push(`/campaign-builder/${saved._id || id}`);
      }
    } catch (error) {
      console.error("Save failed", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#FAFBFF] space-y-6">
       <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
             <Zap size={24} className="text-indigo-600 animate-pulse" />
          </div>
       </div>
       <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-[10px]">Synchronizing Multi-Channel Nodes...</p>
    </div>
  );

  return (
    <div className="h-screen w-full flex flex-col bg-[#F8F9FE] overflow-hidden">
      
      {/* HEADER */}
      <div className="h-20 bg-white border-b border-gray-100 px-4 md:px-8 flex items-center justify-between shrink-0 z-50">
        <div className="flex items-center gap-2 md:gap-6">
          <Link href="/campaign-builder" className="p-2.5 md:p-3 bg-gray-50 hover:bg-white border border-transparent hover:border-gray-100 rounded-2xl transition-all text-gray-500">
            <ArrowLeft size={18} />
          </Link>
          <div className="hidden md:block h-10 w-px bg-gray-100" />
          <div className="min-w-0">
            <input 
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              className="text-sm md:text-xl font-black text-gray-900 bg-transparent border-none outline-none focus:ring-0 p-0 tracking-tight placeholder-gray-300 truncate"
              placeholder="Unnamed Campaign"
            />
            <div className="flex items-center gap-2 mt-0.5">
               <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse flex-shrink-0" />
               <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-gray-400 whitespace-nowrap">Orchestrator v2.0 Active</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
           {/* Mobile Panel Toggles */}
           <button 
             onClick={() => { setIsLeftPanelOpen(!isLeftPanelOpen); setIsRightPanelOpen(false); }}
             className={`p-2.5 rounded-xl border transition-all md:hidden ${isLeftPanelOpen ? 'bg-indigo-600' : 'bg-white text-gray-400'}`}
           >
              <Zap size={20} className={isLeftPanelOpen ? 'text-white' : ''} />
           </button>
           <button 
             onClick={() => { setIsRightPanelOpen(!isRightPanelOpen); setIsLeftPanelOpen(false); }}
             className={`p-2.5 rounded-xl border transition-all md:hidden ${isRightPanelOpen ? 'bg-indigo-600' : 'bg-white text-gray-400'}`}
           >
              <Settings size={20} className={isRightPanelOpen ? 'text-white' : ''} />
           </button>

           <button 
             onClick={handleSave}
             disabled={saving}
             className="px-4 md:px-8 py-2.5 md:py-3.5 bg-[#6F3FF5] text-white font-black text-[10px] md:text-sm rounded-2xl shadow-xl shadow-purple-200 hover:bg-[#5c2cd9] transition-all disabled:opacity-70 flex items-center gap-2 md:gap-3"
           >
             {saving ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
             <span className="hidden sm:inline">{saving ? "Deploying..." : "Deploy Automation"}</span>
             <span className="sm:hidden">{saving ? "Deploy" : "Deploy"}</span>
           </button>
        </div>
      </div>

      {/* WORKSPACE */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* LEFT: ACTION DRAWER */}
        <div className={`
          absolute inset-y-0 left-0 w-80 bg-white border-r border-gray-100 flex flex-col shrink-0 z-40 transition-transform duration-500 md:relative md:translate-x-0
          ${isLeftPanelOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="p-6 border-b border-gray-100">
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em]">Command Nodes</h3>
                <button onClick={() => setIsLeftPanelOpen(false)} className="md:hidden text-gray-400"><X size={18} /></button>
             </div>
             <div className="flex bg-gray-50 p-1 rounded-xl">
                {['facebook', 'instagram', 'linkedin', 'email', 'automation'].map(plat => (
                   <button 
                     key={plat}
                     onClick={() => setActiveTab(plat)}
                     className={`flex-1 p-2.5 rounded-lg flex items-center justify-center transition-all ${activeTab === plat ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
                   >
                     {plat === 'facebook' && <Facebook size={18} />}
                     {plat === 'instagram' && <Instagram size={18} />}
                     {plat === 'linkedin' && <Linkedin size={18} />}
                     {plat === 'email' && <Mail size={18} />}
                     {plat === 'automation' && <Zap size={18} />}
                   </button>
                ))}
             </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
             {ACTIONS[activeTab].map(template => (
               <button
                 key={template.id}
                 onClick={() => addBlock(template)}
                 className="w-full bg-white border border-gray-100 p-4 rounded-2xl flex items-center gap-4 hover:border-indigo-500 hover:bg-indigo-50/30 hover:scale-[1.02] transition-all group group shadow-sm text-left"
               >
                 <div className="w-10 h-10 bg-gray-50 rounded-[1.25rem] flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:text-indigo-600 shadow-inner transition-colors">
                    {template.id.includes('delay') ? <Clock size={20} /> : template.icon}
                 </div>
                 <div className="flex-1">
                    <p className="font-bold text-gray-900 group-hover:text-indigo-600 text-sm tracking-tight">{template.label}</p>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Add to sequence</p>
                 </div>
                 <Plus size={16} className="text-gray-300 group-hover:text-indigo-500" />
               </button>
             ))}
          </div>
        </div>

        {/* CENTER: FLOW CANVAS */}
        <div className="flex-1 bg-[#F8F9FC] relative overflow-hidden flex flex-col">
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-40"></div>
          
          <div className="flex-1 overflow-y-auto p-6 md:p-12 relative z-0 custom-scrollbar">
            <div className="max-w-xl mx-auto flex flex-col items-center">
              
              <div className="mb-12 relative group">
                <div className="px-6 md:px-8 py-3 md:py-4 bg-white border border-green-200 rounded-[2rem] shadow-xl shadow-green-100/50 text-xs md:text-sm font-black text-gray-700 flex items-center gap-3">
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                  <span className="uppercase tracking-[0.2em] text-[9px] md:text-[10px]">Sequence Entry Point</span>
                </div>
                {blocks.length > 0 && <div className="absolute left-1/2 -bottom-12 w-0.5 h-12 bg-gradient-to-b from-green-200 to-indigo-200 -translate-x-1/2" />}
              </div>

              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                  <div className="flex flex-col items-center w-full space-y-0">
                    {blocks.map((block, idx) => (
                      <SortableBlock 
                        key={block.id}
                        block={block}
                        idx={idx}
                        isLast={idx === blocks.length - 1}
                        isSelected={configBlock?.id === block.id}
                        onSelect={(b) => { setConfigBlock(b); if (window.innerWidth < 768) setIsRightPanelOpen(true); }}
                        onRemove={removeBlock}
                      />
                    ))}
                    {blocks.length === 0 && (
                      <div className="w-full max-w-sm p-12 border-2 border-dashed border-gray-200 rounded-[3rem] bg-white/50 backdrop-blur-sm flex flex-col items-center justify-center text-center opacity-60">
                         <div className="w-16 h-16 bg-gray-100 rounded-3xl flex items-center justify-center text-gray-300 mb-4">
                            <Plus size={32} />
                         </div>
                         <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest">Build Protocol</h4>
                         <p className="text-xs text-gray-400 mt-2">Add components from the left command drawer.</p>
                      </div>
                    )}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          </div>
        </div>

        {/* RIGHT: CONFIG PANEL */}
        <div className={`
          absolute inset-y-0 right-0 w-[90%] md:w-96 bg-white border-l border-gray-100 flex flex-col shrink-0 z-40 transition-transform duration-500 md:relative md:translate-x-0
          ${isRightPanelOpen ? 'translate-x-0' : 'translate-x-[110%]'}
        `}>
          <div className="p-6 md:p-8 border-b border-gray-100 flex items-center justify-between">
             <div className="min-w-0">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mb-1">Parameters</h3>
                <h2 className="text-lg font-black text-gray-900 truncate">{configBlock ? configBlock.label : "Select Node"}</h2>
             </div>
             <button onClick={() => setIsRightPanelOpen(false)} className="md:hidden text-gray-400"><X size={18} /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
             {configBlock ? (
                <div className="space-y-8">
                   <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Cpu size={16} className="text-indigo-600" />
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">AI Persona</h4>
                      </div>
                      <select 
                        value={configBlock.config.agentId}
                        onChange={(e) => updateBlockConfig(configBlock.id, { agentId: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl text-xs font-bold text-gray-900 outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                      >
                         <option value="">Manual Control</option>
                         {agents.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
                      </select>
                   </div>

                   {configBlock.platform !== 'automation' && (
                     <div className="space-y-4 pt-6 border-t border-gray-50">
                        <div className="flex items-center gap-2">
                          <User size={16} className="text-indigo-600" />
                          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Source Account</h4>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                           {accounts[configBlock.platform]?.length === 0 ? (
                              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex flex-col items-center text-center">
                                 <AlertCircle size={18} className="text-amber-600 mb-2" />
                                 <p className="text-[9px] font-black text-amber-900 uppercase">No connected accounts</p>
                              </div>
                           ) : accounts[configBlock.platform]?.map(acc => (
                             <button
                               key={acc._id}
                               onClick={() => updateBlockConfig(configBlock.id, { accountId: acc._id })}
                               className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3 ${configBlock.config.accountId === acc._id ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white border-gray-100 hover:border-indigo-200'}`}
                             >
                                <div className="p-2 bg-gray-100 rounded-lg text-gray-500"><User size={14} /></div>
                                <span className="text-xs font-black truncate">{acc.name || acc.email}</span>
                             </button>
                           ))}
                        </div>
                     </div>
                   )}

                   {configBlock.platform !== 'automation' && (
                     <div className="space-y-4 pt-6 border-t border-gray-50">
                        <div className="flex items-center gap-2">
                          <MessageSquare size={16} className="text-indigo-600" />
                          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Payload</h4>
                        </div>
                        <textarea 
                          value={configBlock.config.message}
                          onChange={(e) => updateBlockConfig(configBlock.id, { message: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl text-xs font-medium min-h-[140px] outline-none focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all resize-none"
                          placeholder="Craft your sequence node content..."
                        />
                     </div>
                   )}

                   <div className="space-y-4 pt-6 border-t border-gray-50">
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-indigo-600" />
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Execution Delay (Min)</h4>
                      </div>
                      <input 
                        type="number"
                        min="0"
                        value={configBlock.config.delay}
                        onChange={(e) => updateBlockConfig(configBlock.id, { delay: parseInt(e.target.value) || 0 })}
                        className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl text-xs font-black text-gray-900 outline-none focus:ring-4 focus:ring-indigo-50"
                      />
                   </div>
                </div>
             ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-30 py-20">
                   <div className="w-16 h-16 bg-gray-100 rounded-3xl flex items-center justify-center mb-4">
                      <Settings size={32} className="animate-spin-slow" />
                   </div>
                   <p className="text-xs font-bold text-gray-400 italic">Select a command block to adjust parameters.</p>
                </div>
             )}
          </div>
          
          {configBlock && (
             <div className="p-6 border-t border-gray-50">
                <button 
                  onClick={() => { setConfigBlock(null); setIsRightPanelOpen(false); }}
                  className="w-full py-4 bg-white border border-gray-200 text-gray-700 font-black text-[10px] uppercase rounded-2xl hover:bg-gray-50 transition-all active:scale-95"
                >
                  Deselect Node
                </button>
             </div>
          )}
        </div>

      </div>
    </div>
  );
}
