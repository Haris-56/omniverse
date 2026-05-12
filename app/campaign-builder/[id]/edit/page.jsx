"use client";

import React, { useState, useEffect } from "react";
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
  GripVertical,
  Hexagon,
  ChevronLeft
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

  const getPlatformColors = (p) => {
    const colors = {
      facebook: 'text-blue-500 bg-blue-50 border-blue-100',
      instagram: 'text-rose-500 bg-rose-50 border-rose-100',
      linkedin: 'text-sky-500 bg-sky-50 border-sky-100',
      email: 'text-[#8245EF] bg-[#FCF8FE] border-[#8245EF]/20',
      automation: 'text-amber-500 bg-amber-50 border-amber-100'
    };
    return colors[p] || 'text-[#8245EF] bg-[#FCF8FE] border-[#8245EF]/20';
  };

  return (
    <div ref={setNodeRef} style={style} className="w-full flex flex-col items-center group/block font-sans animate-in fade-in duration-500">
      <div 
        onClick={() => onSelect(block)}
        className={`w-full max-w-lg bg-white border-2 rounded-2xl p-5 flex items-center gap-4 transition-all duration-300 cursor-pointer relative z-10 ${
            isSelected 
            ? 'border-[#8245EF] shadow-lg ring-4 ring-[#8245EF]/10' 
            : 'border-[#8245EF]/15 hover:border-[#8245EF]/40 hover:shadow-md'
        } ${isDragging ? 'opacity-50 scale-105 rotate-1 border-[#8245EF]' : ''}`}
      >
        <div 
          {...attributes} 
          {...listeners}
          className="p-2 text-[#94a3b8] hover:text-[#8245EF] cursor-grab active:cursor-grabbing transition-colors"
        >
           <GripVertical size={20} />
        </div>

        <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 border shadow-inner transition-transform group-hover/block:-rotate-6 duration-300 ${getPlatformColors(block.platform)}`}>
           {ACTIONS[block.platform]?.find(a => a.id === block.templateId)?.icon || <Zap size={24} />}
        </div>
        
        <div className="flex-1 min-w-0">
           <p className="font-bold text-[#161932] text-base mb-1 truncate">{block.label}</p>
           <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-[#94a3b8] font-mono leading-none">ID: {block.id.slice(-4)}</span>
              {block.platform !== 'automation' && (
                 <div className={`text-[9px] font-bold px-2 py-1 rounded border leading-none ${block.config.accountId ? 'border-emerald-200 bg-emerald-50 text-emerald-600' : 'border-amber-200 bg-amber-50 text-amber-600'}`}>
                    {block.config.accountId ? 'Ready' : 'Needs Setup'}
                 </div>
              )}
              {block.config.delay > 0 && (
                <div className="text-[9px] font-bold px-2 py-1 rounded border border-[#8245EF]/20 bg-[#FCF8FE] text-[#8245EF] leading-none">
                   Wait: {block.config.delay}m
                </div>
              )}
           </div>
        </div>
        
        <button 
          onClick={(e) => { e.stopPropagation(); onRemove(block.id); }} 
          className="p-3 text-[#94a3b8] hover:text-rose-500 transition-all hover:bg-rose-50 rounded-xl active:scale-90"
        >
           <Trash2 size={20} />
        </button>

        {/* Texture */}
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      </div>
      {!isLast && <div className="w-[3px] h-20 bg-gradient-to-b from-[#8245EF]/30 to-[#8245EF]/5 relative">
          <div className="absolute inset-0 bg-[#8245EF]/10 blur-[6px]"></div>
      </div>}
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

  const [lists, setLists] = useState([]);
  const [listId, setListId] = useState('');

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
      const [fb, ig, li, em, ag, camp, contactLists] = await Promise.all([
        fetch("/api/facebook/accounts").then(res => res.json()),
        fetch("/api/instagram/accounts").then(res => res.json()),
        fetch("/api/linkedin/accounts").then(res => res.json()),
        fetch("/api/email/accounts").then(res => res.json()),
        fetch("/api/ai-agents").then(res => res.json()),
        id !== 'new' ? fetch(`/api/campaigns/${id}`).then(res => res.json()) : Promise.resolve(null),
        fetch("/api/lists").then(res => res.json())
      ]);

      setAccounts({ 
        facebook: Array.isArray(fb) ? fb : [], 
        instagram: Array.isArray(ig) ? ig : [], 
        linkedin: Array.isArray(li) ? li : [], 
        email: Array.isArray(em) ? em : [] 
      });
      setAgents(Array.isArray(ag) ? ag : []);
      setLists(Array.isArray(contactLists) ? contactLists : []);
      
      if (camp) {
        setCampaignName(camp.name);
        setBlocks(camp.blocks || []);
        if (camp.listId) setListId(camp.listId);
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
          listId,
          blocks, 
          status: 'Running', 
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
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#FCF8FE] space-y-12">
       <div className="relative">
          <div className="w-24 h-24 border-[5px] border-[#8245EF]/10 border-t-[#8245EF] rounded-full animate-spin shadow-sm"></div>
          <div className="absolute inset-0 flex items-center justify-center">
             <Zap size={32} className="text-[#8245EF] animate-pulse" />
          </div>
       </div>
       <p className="text-[#94a3b8] font-bold uppercase tracking-widest text-xs">Loading Campaign...</p>
    </div>
  );

  return (
    <div className="h-screen w-full flex flex-col bg-[#FCF8FE] overflow-hidden font-sans">
      
      {/* HEADER */}
      <div className="h-16 bg-white border-b border-[#8245EF]/15 px-4 md:px-6 flex items-center justify-between shrink-0 z-[60] shadow-sm relative">
        <div className="flex items-center gap-4">
          <Link href="/campaign-builder" className="p-2 bg-[#FCF8FE] hover:bg-white border border-[#8245EF]/15 hover:border-[#8245EF]/40 rounded-lg transition-all text-[#94a3b8] hover:text-[#8245EF] active:scale-90 group shadow-sm">
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div className="hidden md:block h-8 w-[1px] bg-[#8245EF]/20" />
          <div className="min-w-0 flex items-center gap-4">
            <div>
              <input 
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                className="text-lg md:text-xl font-bold text-[#161932] bg-transparent border-none outline-none focus:ring-0 p-0 tracking-tight placeholder-[#94a3b8]/40 truncate font-sans leading-none"
                placeholder="Unnamed Campaign"
              />
              <div className="flex items-center gap-2 mt-1.5">
                 <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse flex-shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                 <p className="text-[10px] font-medium text-[#94a3b8] whitespace-nowrap">Platform Sync Active</p>
              </div>
            </div>
            
            <select
                value={listId}
                onChange={(e) => setListId(e.target.value)}
                className="text-xs bg-[#FCF8FE] border border-[#8245EF]/20 rounded-md p-1.5 outline-none font-medium text-[#161932]"
            >
                <option value="">Select Target List...</option>
                {lists.map(l => (
                    <option key={l._id} value={l._id}>{l.name}</option>
                ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
           {/* Mobile Panel Toggles */}
           <button 
             onClick={() => { setIsLeftPanelOpen(!isLeftPanelOpen); setIsRightPanelOpen(false); }}
             className={`p-2 rounded-lg border transition-all md:hidden ${isLeftPanelOpen ? 'bg-[#8245EF] text-white shadow-md' : 'bg-white text-[#94a3b8] border-[#8245EF]/15'}`}
           >
              <Zap size={18} />
           </button>
           <button 
             onClick={() => { setIsRightPanelOpen(!isRightPanelOpen); setIsLeftPanelOpen(false); }}
             className={`p-2 rounded-lg border transition-all md:hidden ${isRightPanelOpen ? 'bg-[#8245EF] text-white shadow-md' : 'bg-white text-[#94a3b8] border-[#8245EF]/15'}`}
           >
              <Settings size={18} />
           </button>

           <button 
             onClick={handleSave}
             disabled={saving}
             className="px-4 py-2 bg-[#8245EF] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm hover:bg-[#6d28d9] transition-all disabled:opacity-70 flex items-center gap-2 border border-white/10 active:scale-95"
           >
             {saving ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
             <span className="hidden sm:inline">{saving ? "Deploying..." : "Deploy"}</span>
             <span className="sm:hidden">{saving ? "..." : "Deploy"}</span>
           </button>
        </div>
      </div>

      {/* WORKSPACE */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* LEFT: ACTION DRAWER */}
        <div className={`
          absolute inset-y-0 left-0 w-64 bg-white border-r border-[#8245EF]/15 flex flex-col shrink-0 z-50 transition-transform duration-300 md:relative md:translate-x-0 shadow-xl md:shadow-none
          ${isLeftPanelOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="p-4 border-b border-[#8245EF]/10 bg-[#FCF8FE]/30">
             <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-[#161932] uppercase tracking-wider">Actions</h3>
                <button onClick={() => setIsLeftPanelOpen(false)} className="md:hidden text-[#94a3b8] hover:text-[#8245EF] transition-colors"><X size={20} /></button>
             </div>
             <div className="flex bg-[#FCF8FE] border border-[#8245EF]/15 p-1.5 rounded-2xl shadow-inner gap-1">
                {['facebook', 'instagram', 'linkedin', 'email', 'automation'].map(plat => (
                   <button 
                     key={plat}
                     onClick={() => setActiveTab(plat)}
                     className={`flex-1 py-3 rounded-xl flex items-center justify-center transition-all ${activeTab === plat ? 'bg-white text-[#8245EF] shadow border border-[#8245EF]/10' : 'text-[#94a3b8] hover:text-[#8245EF]'}`}
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

          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
             {ACTIONS[activeTab].map(template => (
               <button
                 key={template.id}
                 onClick={() => addBlock(template)}
                 className="w-full bg-white border border-[#8245EF]/15 p-3 rounded-xl flex items-center gap-3 hover:border-[#8245EF]/50 hover:bg-[#FCF8FE] hover:-translate-y-0.5 transition-all group shadow-sm text-left"
               >
                 <div className="w-10 h-10 bg-[#FCF8FE] rounded-lg flex items-center justify-center text-[#94a3b8] group-hover:text-[#8245EF] shadow-inner transition-all border border-transparent group-hover:border-[#8245EF]/20 shrink-0">
                    {template.id.includes('delay') ? <Clock size={16} /> : React.cloneElement(template.icon, { size: 16 })}
                 </div>
                 <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#161932] group-hover:text-[#8245EF] text-xs truncate transition-colors">{template.label}</p>
                 </div>
                 <Plus size={16} className="text-[#94a3b8]/40 group-hover:text-[#8245EF] group-hover:rotate-90 transition-all shrink-0" />
               </button>
             ))}
          </div>
          
          <div className="p-6 border-t border-[#8245EF]/10 bg-[#FCF8FE]/20">
             <div className="flex items-center gap-3 p-4 bg-white border border-[#8245EF]/15 rounded-xl shadow-sm">
                <ShieldCheck size={20} className="text-emerald-500 shrink-0" />
                <p className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider">Safe Mode Enabled</p>
             </div>
          </div>
        </div>

        {/* CENTER: FLOW CANVAS */}
        <div className="flex-1 bg-[#FCF8FE]/50 relative overflow-hidden flex flex-col items-center">
          <div className="flex-1 overflow-y-auto w-full p-6 md:p-12 relative z-0 custom-scrollbar overscroll-contain">
            <div className="max-w-xl mx-auto flex flex-col items-center">
              
              <div className="mb-12 relative group">
                <div className="px-8 py-4 bg-white border border-[#8245EF]/20 rounded-full shadow-md text-[10px] font-bold text-[#161932] flex items-center gap-3 transition-all hover:scale-105 active:scale-95 cursor-default group overflow-hidden">
                  <div className="absolute inset-0 bg-[#8245EF]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)] relative z-10" />
                  <span className="uppercase tracking-widest relative z-10">Campaign Start</span>
                </div>
                {blocks.length > 0 && <div className="absolute left-1/2 -bottom-12 w-[3px] h-12 bg-gradient-to-b from-emerald-500/30 via-[#8245EF]/20 to-[#8245EF]/10 -translate-x-1/2" />}
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
                      <div className="w-full max-w-lg p-16 border-2 border-dashed border-[#8245EF]/20 rounded-3xl bg-white shadow-sm flex flex-col items-center justify-center text-center opacity-60 hover:opacity-100 transition-opacity duration-500">
                         <div className="w-20 h-20 bg-[#FCF8FE] rounded-[1.5rem] flex items-center justify-center text-[#94a3b8] mb-6 border border-[#8245EF]/10 group-hover:rotate-12 transition-transform shadow-inner">
                            <Plus size={40} />
                         </div>
                         <h4 className="text-xl font-bold text-[#161932]">Add First Step</h4>
                         <p className="text-[#64748b] mt-3 text-sm max-w-xs">Drag actions from the left or click to build your campaign flow.</p>
                      </div>
                    )}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          </div>
          
           {/* Global Branding Watermark */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.02] select-none z-[-1] grayscale">
              <Hexagon size={1200} strokeWidth={0.5} className="animate-spin-slow rotate-12 text-[#8245EF]" />
           </div>
        </div>

        {/* RIGHT: CONFIG PANEL */}
        <div className={`
          absolute inset-y-0 right-0 w-full md:w-[320px] bg-white border-l border-[#8245EF]/15 flex flex-col shrink-0 z-50 transition-transform duration-300 md:relative md:translate-x-0 shadow-xl md:shadow-none
          ${isRightPanelOpen ? 'translate-x-0' : 'translate-x-full'}
        `}>
          <div className="p-4 border-b border-[#8245EF]/10 flex items-center justify-between bg-[#FCF8FE]/30 relative z-10">
             <div className="min-w-0 pr-4">
                <h3 className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider mb-1">Settings</h3>
                <h2 className="text-lg font-bold text-[#161932] truncate">{configBlock ? configBlock.label : "No Selection"}</h2>
             </div>
             <button onClick={() => setIsRightPanelOpen(false)} className="md:hidden p-2 bg-white rounded-lg text-[#94a3b8] hover:text-[#8245EF] transition-all shadow-sm shrink-0"><X size={20} /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
             {configBlock ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                   <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Cpu size={16} className="text-[#8245EF]" />
                        <h4 className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider">AI Agent</h4>
                      </div>
                      <select 
                        value={configBlock.config.agentId}
                        onChange={(e) => updateBlockConfig(configBlock.id, { agentId: e.target.value })}
                        className="w-full bg-[#FCF8FE] border border-[#8245EF]/10 p-3 rounded-lg text-xs font-bold text-[#161932] outline-none focus:bg-white focus:border-[#8245EF]/40 transition-all cursor-pointer shadow-inner appearance-none"
                      >
                         <option value="">Manual (No AI)</option>
                         {agents.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
                      </select>
                   </div>

                   {configBlock.platform !== 'automation' && (
                     <div className="space-y-3 pt-4 border-t border-[#FCF8FE]">
                        <div className="flex items-center gap-2">
                          <User size={16} className="text-[#8245EF]" />
                          <h4 className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider">Account to use</h4>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                           {accounts[configBlock.platform]?.length === 0 ? (
                              <div className="p-4 bg-rose-50 rounded-lg border border-rose-100 flex flex-col items-center text-center shadow-inner group/error">
                                 <AlertCircle size={20} className="text-rose-500 mb-2" />
                                 <p className="text-[10px] font-bold text-rose-600">No accounts connected. Go to settings to link one.</p>
                              </div>
                           ) : accounts[configBlock.platform]?.map(acc => (
                             <button
                               key={acc._id}
                               onClick={() => updateBlockConfig(configBlock.id, { accountId: acc._id })}
                               className={`p-3 rounded-lg border text-left transition-all flex items-center gap-3 shadow-sm ${configBlock.config.accountId === acc._id ? 'bg-[#8245EF] border-[#8245EF] text-white' : 'bg-white border-[#8245EF]/10 hover:border-[#8245EF]/40 text-[#94a3b8] hover:text-[#161932]'}`}
                             >
                                <div className={`p-1.5 rounded-md transition-colors ${configBlock.config.accountId === acc._id ? 'bg-white/20' : 'bg-[#FCF8FE]'}`}><User size={14} /></div>
                                <span className="text-xs font-bold truncate">{acc.name || acc.email}</span>
                             </button>
                           ))}
                        </div>
                     </div>
                   )}

                   {configBlock.platform !== 'automation' && (
                     <div className="space-y-3 pt-4 border-t border-[#FCF8FE]">
                        <div className="flex items-center gap-2">
                          <MessageSquare size={16} className="text-[#8245EF]" />
                          <h4 className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider">Message Template</h4>
                        </div>
                        <textarea 
                          value={configBlock.config.message}
                          onChange={(e) => updateBlockConfig(configBlock.id, { message: e.target.value })}
                          className="w-full bg-[#FCF8FE] border border-[#8245EF]/10 p-3 rounded-lg text-xs font-medium text-[#161932] min-h-[120px] outline-none focus:bg-white focus:border-[#8245EF]/40 transition-all resize-none custom-scrollbar shadow-inner placeholder-[#94a3b8]/50"
                          placeholder="Type your message here..."
                        />
                     </div>
                   )}

                   <div className="space-y-3 pt-4 border-t border-[#FCF8FE]">
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-[#8245EF]" />
                        <h4 className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider">Delay (Minutes)</h4>
                      </div>
                      <div className="relative group/delay">
                         <input 
                           type="number"
                           min="0"
                           value={configBlock.config.delay}
                           onChange={(e) => updateBlockConfig(configBlock.id, { delay: parseInt(e.target.value) || 0 })}
                           className="w-full bg-[#FCF8FE] border border-[#8245EF]/10 p-3 rounded-lg text-lg font-bold text-[#161932] outline-none focus:bg-white focus:border-[#8245EF]/40 transition-all shadow-inner"
                         />
                         <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b8] text-[10px] font-bold uppercase">MIN</div>
                      </div>
                   </div>
                </div>
             ) : (
                <div className="h-full flex flex-col items-center justify-center text-center py-12 px-6">
                   <div className="w-20 h-20 bg-[#FCF8FE] rounded-2xl border border-[#8245EF]/10 flex items-center justify-center mb-6 text-[#94a3b8] opacity-50">
                      <Settings size={32} />
                   </div>
                   <h5 className="text-lg font-bold text-[#94a3b8] mb-2">Select an action</h5>
                   <p className="text-[#64748b] text-sm max-w-[200px] text-center opacity-70">Click a node on the canvas to configure it.</p>
                </div>
             )}
          </div>
          
          <div className="p-6 border-t border-[#8245EF]/10 bg-[#FCF8FE]/20">
             {configBlock ? (
                <button 
                  onClick={() => { setConfigBlock(null); setIsRightPanelOpen(false); }}
                  className="w-full py-3 bg-white border border-[#8245EF]/15 text-[#94a3b8] font-bold text-xs rounded-xl hover:bg-[#FCF8FE] hover:text-[#161932] shadow-sm transition-all active:scale-95"
                >
                  Close Settings
                </button>
             ) : (
                <div className="w-full py-3 text-center">
                   <p className="text-xs font-medium text-[#94a3b8] opacity-50">Configure your campaign</p>
                </div>
             )}
          </div>
        </div>

      </div>
    </div>
  );
}
