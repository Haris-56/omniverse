"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Facebook, 
  Instagram, 
  Linkedin, 
  Mail, 
  Phone, 
  MessageSquare, 
  Clock, 
  GitBranch, 
  Bot,
  X,
  Save,
  Loader2
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import SortableBlock from "../../../components/sortable-block";

// Platform Definitions
const platforms = [
  { id: 'facebook', label: 'Facebook', icon: <Facebook size={20} /> },
  { id: 'instagram', label: 'Instagram', icon: <Instagram size={20} /> },
  { id: 'linkedin', label: 'LinkedIn', icon: <Linkedin size={20} /> },
  { id: 'email', label: 'Email', icon: <Mail size={20} /> },
  { id: 'contact', label: 'Contact', icon: <Phone size={20} /> },
];

// Actions per Platform
const platformActions = {
  facebook: [
    { id: 'fb_friend_request', label: 'Friend Request', icon: <Facebook size={16} /> },
    { id: 'fb_comment', label: 'Comment', icon: <MessageSquare size={16} /> },
    { id: 'fb_like_post', label: 'Like the Post', icon: <Facebook size={16} /> },
    { id: 'fb_message', label: 'Send a Message', icon: <MessageSquare size={16} /> },
    { id: 'fb_page_like', label: 'Page Like', icon: <Facebook size={16} /> },
    { id: 'delay', label: 'Delay / Wait', icon: <Clock size={16} /> },
    { id: 'condition', label: 'Condition', icon: <GitBranch size={16} /> },
    { id: 'chatbot', label: 'Chatbot', icon: <Bot size={16} /> },
  ],
  instagram: [
    { id: 'ig_follow', label: 'Follow User', icon: <Instagram size={16} /> },
    { id: 'ig_like', label: 'Like Post', icon: <Instagram size={16} /> },
    { id: 'ig_comment', label: 'Comment', icon: <MessageSquare size={16} /> },
    { id: 'ig_message', label: 'Direct Message', icon: <MessageSquare size={16} /> },
    { id: 'delay', label: 'Delay / Wait', icon: <Clock size={16} /> },
  ],
  linkedin: [
    { id: 'li_connect', label: 'Connect', icon: <Linkedin size={16} /> },
    { id: 'li_message', label: 'Message', icon: <MessageSquare size={16} /> },
    { id: 'li_view_profile', label: 'View Profile', icon: <Linkedin size={16} /> },
    { id: 'delay', label: 'Delay / Wait', icon: <Clock size={16} /> },
  ],
  email: [
    { id: 'email_send', label: 'Send Email', icon: <Mail size={16} /> },
    { id: 'delay', label: 'Delay / Wait', icon: <Clock size={16} /> },
  ],
  contact: [
    { id: 'sms_send', label: 'Send SMS', icon: <Phone size={16} /> },
    { id: 'whatsapp_send', label: 'WhatsApp Message', icon: <MessageSquare size={16} /> },
  ]
};

export default function CampaignBuilderPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [selectedPlatform, setSelectedPlatform] = useState('facebook');
  const [blocks, setBlocks] = useState([]);
  const [campaignName, setCampaignName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    if (id) fetchCampaign();
  }, [id]);

  const fetchCampaign = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/campaigns/${id}`);
      if (res.ok) {
        const data = await res.json();
        setCampaignName(data.name);
        setSelectedPlatform(data.platform || 'facebook');
        setBlocks(data.blocks || []);
      }
    } catch (error) {
      console.error("Failed to fetch campaign", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/campaigns/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: campaignName,
          platform: selectedPlatform,
          blocks 
        }),
      });

      if (res.ok) {
        // Optional: Show toast
      } else {
        alert("Failed to save campaign");
      }
    } catch (error) {
      console.error("Error saving campaign:", error);
    } finally {
      setSaving(false);
    }
  };

  // Add block when clicked
  const addBlock = (action) => {
    setBlocks((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        label: action.label,
        icon: action.icon,
        type: action.id
      },
    ]);
  };

  // Remove block
  const removeBlock = (id) => {
    setBlocks((prev) => prev.filter(b => b.id !== id));
  };

  // Drag & Drop
  const handleDragEnd = (e) => {
    const { active, over } = e;
    if (!over) return;

    if (active.id !== over.id) {
      setBlocks((prev) => {
        const oldIndex = prev.findIndex((i) => i.id === active.id);
        const newIndex = prev.findIndex((i) => i.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center text-gray-500">Loading builder...</div>;

  return (
    <div className="w-full h-screen bg-gray-50 flex flex-col">

      {/* Header */}
      <div className="w-full bg-white border-b px-4 py-3 flex justify-between items-center shadow-sm z-20">
        <div className="flex items-center gap-4">
          <Link href={`/campaign-builder/${id}`} className="p-2 hover:bg-gray-100 rounded-full transition text-gray-500">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <input 
              type="text" 
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              className="text-lg font-semibold text-gray-900 border-none focus:ring-0 p-0 bg-transparent placeholder-gray-400"
              placeholder="Campaign Name"
            />
            <p className="text-xs text-gray-500">Builder Mode</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-[#6A5ACD] text-white text-sm font-medium rounded-lg hover:bg-[#5a4cb4] transition flex items-center gap-2 shadow-sm disabled:opacity-70"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? "Saving..." : "Save Flow"}
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col md:flex-row w-full flex-1 overflow-hidden">

        {/* LEFT PANEL - PLATFORMS */}
        <div className="w-full md:w-64 bg-white border-r flex flex-col z-10">
          <div className="p-4 border-b">
            <h2 className="font-bold text-sm text-gray-500 uppercase tracking-wider">Platform</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {platforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => setSelectedPlatform(platform.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  selectedPlatform === platform.id
                    ? "bg-[#E6E0FF] text-[#6A5ACD] shadow-sm ring-1 ring-[#6A5ACD]/20"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <div className={`${selectedPlatform === platform.id ? "text-[#6A5ACD]" : "text-gray-400"}`}>
                  {platform.icon}
                </div>
                {platform.label}
              </button>
            ))}
          </div>
        </div>

        {/* CENTER BUILDER AREA */}
        <div className="flex-1 bg-[#F8F9FC] relative overflow-hidden flex flex-col">
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-50"></div>
          
          <div className="flex-1 overflow-y-auto p-8 relative z-0">
            <div className="max-w-2xl mx-auto flex flex-col items-center min-h-full py-10">
              
              {/* Start Node */}
              <div className="mb-8 relative group">
                <div className="px-6 py-3 bg-white border-2 border-green-400 rounded-full shadow-sm text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Start Sequence
                </div>
                {blocks.length > 0 && (
                   <div className="absolute left-1/2 -bottom-8 w-0.5 h-8 bg-gray-300 -translate-x-1/2"></div>
                )}
              </div>

              {/* DND AREA */}
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
                  <div className="flex flex-col items-center w-full">
                    {blocks.length === 0 && (
                      <div className="text-center p-10 border-2 border-dashed border-gray-300 rounded-2xl bg-white/50 backdrop-blur-sm">
                        <p className="text-gray-500 font-medium">Your automation flow is empty</p>
                        <p className="text-gray-400 text-sm mt-1">Select an action from the right panel to begin</p>
                      </div>
                    )}

                    {blocks.map((block, index) => (
                      <div key={block.id} className="relative flex flex-col items-center group w-full">
                        {/* Connector Line from previous */}
                        {index > 0 && (
                          <div className="w-0.5 h-8 bg-gray-300"></div>
                        )}

                        {/* The Block */}
                        <div className="relative z-10 w-64">
                          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex items-center justify-between hover:shadow-md transition-shadow cursor-move group-hover:border-[#6A5ACD]/50">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-[#F3F0FF] rounded-lg text-[#6A5ACD]">
                                {block.icon || <Clock size={16} />}
                              </div>
                              <span className="text-sm font-medium text-gray-700">{block.label}</span>
                            </div>
                            <button 
                              onClick={(e) => { e.stopPropagation(); removeBlock(block.id); }}
                              className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </div>

                        {/* Connector Line to next (or end) */}
                         <div className="w-0.5 h-8 bg-gray-300"></div>
                      </div>
                    ))}
                  </div>
                </SortableContext>
              </DndContext>

              {/* End Node */}
              {blocks.length > 0 && (
                <div className="relative">
                  <div className="px-6 py-3 bg-gray-100 border border-gray-300 rounded-full text-sm font-medium text-gray-500 flex items-center gap-2">
                    <X size={14} />
                    End of Sequence
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* RIGHT PANEL - ACTIONS */}
        <div className="w-full md:w-72 bg-white border-l flex flex-col z-10 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)]">
          <div className="p-4 border-b">
            <h2 className="font-bold text-sm text-gray-500 uppercase tracking-wider">Actions for {selectedPlatform}</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {platformActions[selectedPlatform]?.map((action) => (
              <button
                key={action.id}
                onClick={() => addBlock(action)}
                className="w-full flex items-center gap-3 px-4 py-3.5 bg-white border border-gray-200 hover:border-[#6A5ACD] hover:bg-[#F3F0FF] rounded-xl text-sm font-medium text-gray-700 transition-all duration-200 shadow-sm hover:shadow-md group text-left"
              >
                <div className="text-gray-400 group-hover:text-[#6A5ACD] transition-colors">
                  {action.icon}
                </div>
                {action.label}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
