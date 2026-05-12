"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  Upload, 
  Plus, 
  Trash2, 
  ArrowLeft, 
  Folder, 
  Calendar, 
  Tag, 
  ChevronRight, 
  UserCircle2, 
  LayoutGrid, 
  List as ListIcon,
  Filter,
  MoreVertical,
  ExternalLink,
  Activity,
  Database,
  ShieldCheck,
  Globe,
  Loader2,
  Hexagon,
  ChevronLeft
} from "lucide-react";
import AddContactModal from "./components/AddContactModal";
import UploadContactsModal from "./components/UploadContactsModal";

export default function ContactsPage() {
  const [viewMode, setViewMode] = useState("lists"); // 'lists' | 'contacts'
  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [displayStyle, setDisplayStyle] = useState("table"); 

  useEffect(() => {
    if (viewMode === "lists") {
      fetchLists();
    } else if (selectedList) {
      fetchContacts(selectedList._id);
    }
  }, [viewMode, selectedList, searchQuery]);

  const fetchLists = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/lists");
      if (res.ok) {
        const data = await res.json();
        setLists(data);
      }
    } catch (error) {
      console.error("Failed to fetch lists", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchContacts = async (listId) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("listId", listId);
      if (searchQuery) params.append("search", searchQuery);

      const res = await fetch(`/api/contacts?${params}`);
      if (res.ok) {
        const data = await res.json();
        setContacts(data);
      }
    } catch (error) {
      console.error("Failed to fetch contacts", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteList = async (e, listId, listName) => {
    e.stopPropagation();
    if (!confirm(`Are you sure you want to delete the list '${listName}'?`)) return;

    try {
      const res = await fetch(`/api/lists?id=${listId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchLists();
      } else {
        alert("Failed to delete list");
      }
    } catch (error) {
      console.error("Error deleting list:", error);
    }
  };

  const handleDeleteContact = async (id) => {
    if (!confirm("Are you sure you want to delete this person?")) return;

    try {
      const res = await fetch(`/api/contacts/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        if (selectedList) fetchContacts(selectedList._id);
      } else {
        alert("Failed to delete contact");
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  const truncate = (str, n = 30) => {
    return (str && str.length > n) ? str.substr(0, n - 1) + "..." : str;
  };

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-1000 font-sans pb-32">
      
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 mb-16 border-b border-[#8245EF]/10 pb-12">
        <div className="flex items-center gap-8">
          {viewMode === "contacts" && (
            <button 
              onClick={() => {
                setViewMode("lists");
                setSelectedList(null);
                setSearchQuery("");
              }}
              className="p-5 bg-white border border-[#8245EF]/15 rounded-2xl text-[#94a3b8] hover:text-[#8245EF] shadow-sm transition-all active:scale-90 group"
            >
              <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-4 mb-4">
               <span className="px-5 py-2 bg-[#8245EF]/10 text-[#8245EF] text-[10px] font-black uppercase tracking-[0.4em] rounded-full border border-[#8245EF]/20 flex items-center gap-2 font-mono shadow-sm">
                 <ShieldCheck size={14} className="opacity-80" />
                 Safe & Working
               </span>
            </div>
            <h1 className="text-5xl font-black text-[#161932] tracking-tighter uppercase leading-tight">
              My <span className="text-[#8245EF]">People</span>
            </h1>
            <p className="text-[#64748b] mt-4 text-xl font-medium leading-relaxed">
              {viewMode === "lists" 
                ? `This is a list of everyone you want to talk to.` 
                : `Showing people in your list: [${selectedList?.name}].`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-10 py-5 bg-white border border-[#8245EF]/15 text-[#64748b] text-[11px] font-black uppercase tracking-[0.4em] rounded-[1.75rem] hover:text-[#8245EF] hover:bg-[#FCF8FE] transition-all shadow-sm flex items-center justify-center gap-4 group font-mono"
          >
            <Upload size={20} className="text-[#8245EF] group-hover:-translate-y-1 transition-transform" />
            Upload List
          </button>
          
          {viewMode === "contacts" ? (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-12 py-5 bg-[#8245EF] text-white text-[11px] font-black rounded-[1.75rem] hover:bg-[#6d28d9] transition-all shadow-[0_20px_40px_rgba(130, 69, 239,0.3)] flex items-center justify-center gap-4 active:scale-95 border border-white/10 font-mono uppercase tracking-[0.4em]"
            >
              <Plus size={24} />
              Add a Person
            </button>
          ) : (
             <div className="hidden md:flex items-center bg-white border border-[#8245EF]/10 p-2 rounded-2xl shadow-sm">
                <button 
                  onClick={() => setDisplayStyle("table")}
                  className={`p-3 rounded-xl transition-all ${displayStyle === 'table' ? 'bg-[#8245EF] text-white shadow-lg' : 'text-[#94a3b8] hover:text-[#8245EF]'}`}
                >
                  <ListIcon size={20} />
                </button>
                <button 
                  onClick={() => setDisplayStyle("cards")}
                  className={`p-3 rounded-xl transition-all ${displayStyle === 'cards' ? 'bg-[#8245EF] text-white shadow-lg' : 'text-[#94a3b8] hover:text-[#8245EF]'}`}
                >
                  <LayoutGrid size={20} />
                </button>
             </div>
          )}
        </div>
      </div>

      {/* Toolbar Sector */}
      <div className="bg-white p-10 rounded-[3.5rem] border border-[#8245EF]/10 shadow-sm relative overflow-hidden group mb-16">
         <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
            <div className="relative flex-1 max-w-2xl group/search">
               <input
                 placeholder={viewMode === "lists" ? "SEARCH YOUR LISTS..." : "SEARCH FOR PEOPLE..."}
                 value={searchQuery}
                 onInput={(e) => setSearchQuery(e.target.value)}
                 className="w-full bg-[#FCF8FE]/50 border border-[#8245EF]/10 rounded-3xl py-6 px-16 text-[12px] font-black text-[#161932] outline-none shadow-inner focus:border-[#8245EF]/40 transition-all placeholder:text-[#94a3b8] font-mono tracking-widest uppercase"
               />
               <Search size={24} className="absolute left-6 top-1/2 -translate-y-1/2 text-[#94a3b8] group-focus-within/search:text-[#8245EF] transition-colors" />
            </div>
            
            <button className="px-12 py-5 bg-white border border-[#8245EF]/15 rounded-2xl text-[#64748b] text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-4 hover:border-[#8245EF]/40 hover:text-[#8245EF] transition-all font-mono">
              <Filter size={20} className="group-hover:rotate-12 transition-transform" />
              Filters
            </button>
         </div>
         <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#8245EF]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-56 space-y-12">
           <div className="relative">
              <div className="w-24 h-24 border-[5px] border-[#8245EF]/10 border-t-[#8245EF] rounded-full animate-spin shadow-sm"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-[#8245EF]/5">
                    <Database size={24} className="text-[#8245EF] animate-pulse" />
                 </div>
              </div>
           </div>
           <p className="text-[11px] font-black text-[#94a3b8] uppercase tracking-[0.6em] font-mono">Loading data...</p>
        </div>
      ) : (
        <div className="animate-in fade-in duration-700">
          {viewMode === "lists" ? (
            /* Lists Portfolio */
            displayStyle === "table" ? (
              <div className="bg-white rounded-[4rem] shadow-sm border border-[#8245EF]/10 overflow-hidden relative group/table">
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left">
                    <thead className="bg-[#FCF8FE]/50 text-[10px] font-black uppercase text-[#94a3b8] tracking-[0.4em] font-mono border-b border-[#8245EF]/10">
                      <tr>
                        <th className="p-10 pl-14">List Name</th>
                        <th className="p-10">Category</th>
                        <th className="p-10 text-center">People Count</th>
                        <th className="p-10">Created On</th>
                        <th className="p-10 pr-14 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#8245EF]/5">
                      {lists.length === 0 ? (
                        <tr><td colSpan="5" className="p-40 text-center text-[#94a3b8] text-xl font-medium opacity-60">You haven't uploaded any lists yet.</td></tr>
                      ) : (
                        lists.map((list) => (
                          <tr 
                            key={list._id} 
                            onClick={() => {
                              setSelectedList(list);
                              setViewMode("contacts");
                            }}
                            className="group hover:bg-[#FCF8FE]/30 transition-all cursor-default"
                          >
                            <td className="p-10 pl-14 relative">
                              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#8245EF] opacity-0 group-hover:opacity-100 transition-opacity" />
                              <div className="flex items-center gap-8">
                                <div className="w-16 h-16 bg-[#FCF8FE] border border-[#8245EF]/10 text-[#94a3b8] rounded-[1.75rem] flex items-center justify-center group-hover:bg-[#8245EF] group-hover:text-white group-hover:scale-110 transition-all duration-700 shadow-inner">
                                  <Folder size={28} />
                                </div>
                                <div>
                                  <p className="text-xl font-black text-[#161932] tracking-tighter uppercase leading-none group-hover:text-[#8245EF] transition-colors">{list.name}</p>
                                  <p className="text-[10px] text-[#94a3b8] font-black uppercase tracking-[0.3em] mt-3 font-mono">ID: {list._id.slice(-8).toUpperCase()}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-10">
                              <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white border border-[#8245EF]/10 text-[#94a3b8] text-[10px] font-black uppercase tracking-[0.3em] group-hover:border-[#8245EF]/30 group-hover:text-[#8245EF] transition-all font-mono shadow-sm">
                                <Tag size={14} />
                                {list.segment || 'General'}
                              </div>
                            </td>
                            <td className="p-10 text-center">
                              <span className="text-3xl font-black text-[#161932] tracking-tighter font-sans group-hover:text-[#8245EF] transition-colors leading-none">{list.count || 0}</span>
                            </td>
                            <td className="p-10">
                              <div className="flex items-center gap-4 text-[#94a3b8] font-black font-mono text-[10px] uppercase tracking-widest">
                                <Calendar size={16} className="text-[#8245EF]/40" />
                                <span>{new Date(list.createdAt).toLocaleDateString().toUpperCase()}</span>
                              </div>
                            </td>
                            <td className="p-10 pr-14 text-right">
                              <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500">
                                <button
                                  onClick={(e) => handleDeleteList(e, list._id, list.name)}
                                  className="p-4 text-rose-500 bg-rose-500/5 hover:bg-rose-500 hover:text-white border border-rose-500/10 rounded-xl transition-all active:scale-90"
                                >
                                  <Trash2 size={20} />
                                </button>
                                <div className="p-4 text-[#94a3b8] group-hover:text-[#8245EF] group-hover:translate-x-1 transition-all">
                                  <ChevronRight size={24} />
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="absolute inset-0 opacity-[0.01] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
              </div>
            ) : (
              /* Card View */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {lists.map((list) => (
                  <div
                    key={list._id}
                    onClick={() => {
                      setSelectedList(list);
                      setViewMode("contacts");
                    }}
                    className="group bg-white rounded-[4rem] p-12 cursor-pointer relative overflow-hidden border border-[#8245EF]/10 transition-all duration-700 hover:shadow-[0_45px_90px_rgba(130, 69, 239,0.08)] hover:-translate-y-3"
                  >
                    <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-[#8245EF]/10 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    
                    <div className="flex justify-between items-start mb-12 relative z-10">
                       <div className="w-20 h-20 bg-[#FCF8FE] border border-[#8245EF]/15 text-[#94a3b8] rounded-[2rem] flex items-center justify-center shadow-inner group-hover:rotate-12 group-hover:scale-110 group-hover:bg-white group-hover:text-[#8245EF] transition-all duration-700">
                         <Folder size={40} />
                       </div>
                       <div className="px-6 py-2 bg-white border border-[#8245EF]/10 text-[10px] font-black uppercase text-[#94a3b8] tracking-[0.4em] rounded-full font-mono shadow-sm">
                         {list.segment || 'General'}
                       </div>
                    </div>

                    <h3 className="text-3xl font-black text-[#161932] mb-4 truncate group-hover:text-[#8245EF] transition-colors tracking-tighter uppercase leading-tight font-sans">{list.name}</h3>
                    
                    <div className="flex items-center gap-10 mt-12 pt-12 border-t border-[#8245EF]/10 relative z-10">
                      <div className="flex-1">
                        <p className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.4em] mb-3 font-mono">People</p>
                        <p className="text-4xl font-black text-[#161932] leading-none tracking-tighter">{list.count || 0}</p>
                      </div>
                      <div className="flex-1 border-l border-[#8245EF]/10 pl-10">
                        <p className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.4em] mb-3 font-mono">Status</p>
                        <p className="text-[11px] font-black text-[#8245EF] uppercase tracking-[0.3em] font-mono leading-none">All Good</p>
                      </div>
                    </div>

                    <div className="mt-12 flex justify-end relative z-10">
                       <div className="w-16 h-16 bg-[#FCF8FE] rounded-[1.75rem] border border-[#8245EF]/10 flex items-center justify-center text-[#94a3b8] group-hover:bg-[#8245EF] group-hover:text-white group-hover:translate-x-1 transition-all shadow-md group-hover:shadow-[0_15px_30px_rgba(130, 69, 239,0.2)]">
                          <ChevronRight size={32} />
                       </div>
                    </div>

                    <div className="absolute inset-0 opacity-[0.015] pointer-events-none group-hover:opacity-[0.03] transition-opacity bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                  </div>
                ))}
              </div>
            )
          ) : (
            /* Contacts View */
            <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-700">
               <div className="p-8 bg-white border border-[#8245EF]/15 rounded-[3rem] shadow-sm flex flex-col md:flex-row items-center justify-between gap-10">
                   <div className="flex items-center gap-8 pl-4">
                      <div className="w-16 h-16 bg-[#8245EF]/10 rounded-2xl flex items-center justify-center text-[#8245EF] shadow-inner">
                         <Activity size={32} />
                      </div>
                      <div>
                         <p className="text-[11px] font-black text-[#161932] uppercase tracking-[0.4em] font-mono leading-none">List Active</p>
                         <p className="text-[9px] text-[#94a3b8] font-black uppercase tracking-[0.2em] font-mono mt-3 leading-relaxed">Everything is ready and looking good.</p>
                      </div>
                   </div>
                   <div className="flex gap-4 pr-4">
                      <div className="px-8 py-4 bg-[#FCF8FE] border border-[#8245EF]/10 rounded-2xl text-[10px] font-black text-[#94a3b8] font-mono uppercase tracking-widest text-center">
                         Current List: <span className="text-[#161932]">{selectedList?.name.toUpperCase()}</span>
                      </div>
                   </div>
               </div>

               <div className="bg-white rounded-[4.5rem] border border-[#8245EF]/10 shadow-sm overflow-hidden relative group/records">
                  <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left hidden lg:table">
                      <thead className="bg-[#FCF8FE]/50 text-[10px] font-black uppercase text-[#94a3b8] tracking-[0.4em] font-mono border-b border-[#8245EF]/10">
                        <tr className="border-b border-[#8245EF]/5">
                          {contacts.length > 0 &&
                            Object.keys(contacts[0])
                              .filter((key) => !["_id", "listId", "createdAt", "updatedAt", "__v"].includes(key))
                              .map((key) => (
                                <th key={key} className="p-10 whitespace-nowrap">
                                  {key.replace(/_/g, " ").toUpperCase()}
                                </th>
                              ))}
                          <th className="p-10">Added On</th>
                          <th className="p-10 text-right pr-14">Action</th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-[#8245EF]/5">
                        {contacts.length === 0 ? (
                           <tr><td colSpan="100%" className="p-48 text-center text-[#94a3b8] text-2xl font-medium opacity-60">You haven't added anyone to this list yet.</td></tr>
                        ) : (
                          contacts.map((contact) => (
                            <tr
                              key={contact._id}
                              className="group hover:bg-[#FCF8FE]/30 transition-all cursor-default"
                            >
                              {Object.keys(contacts[0] || {})
                                .filter((key) => !["_id", "listId", "createdAt", "updatedAt", "__v"].includes(key))
                                .map((key) => (
                                  <td key={key} className="p-10 text-[#161932] font-black max-w-[300px] font-sans" title={contact[key]}>
                                    {typeof contact[key] === "string" && (contact[key].startsWith("http") || contact[key].startsWith("www")) ? (
                                      <a
                                        href={contact[key].startsWith("http") ? contact[key] : `https://${contact[key]}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[#8245EF] hover:underline flex items-center gap-3 transition-colors font-bold group-hover:translate-x-1 duration-500"
                                      >
                                        <span className="truncate tracking-tight">{truncate(contact[key])}</span>
                                        <ExternalLink size={16} className="opacity-0 group-hover:opacity-60 transition-opacity" />
                                      </a>
                                    ) : (
                                      <span className="truncate block text-[#161932]/80 group-hover:text-[#161932] transition-all tracking-tight font-bold">{truncate(String(contact[key] || "-"), 60)}</span>
                                    )}
                                  </td>
                                ))}

                              <td className="p-10 text-[#94a3b8] font-black whitespace-nowrap font-mono text-[10px] uppercase tracking-widest group-hover:text-[#161932] transition-colors">
                                {contact.createdAt ? new Date(contact.createdAt).toLocaleDateString() : "-"}
                              </td>

                              <td className="p-10 text-right pr-14">
                                <button
                                  onClick={() => handleDeleteContact(contact._id)}
                                  className="p-4 text-[#94a3b8] hover:text-rose-500 bg-transparent hover:bg-rose-500/5 border border-transparent hover:border-rose-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100 active:scale-90"
                                >
                                  <Trash2 size={22} />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>

                    <div className="lg:hidden p-8 space-y-10">
                      {contacts.map((contact) => (
                        <div key={contact._id} className="p-10 bg-[#FCF8FE]/50 border border-[#8245EF]/10 rounded-[3.5rem] space-y-8 relative overflow-hidden group hover:shadow-lg transition-all duration-700">
                           <button
                              onClick={() => handleDeleteContact(contact._id)}
                              className="absolute top-8 right-8 p-4 text-[#94a3b8] hover:text-rose-500 hover:bg-rose-500/5 rounded-2xl transition-all border border-[#8245EF]/10 shadow-sm"
                            >
                              <Trash2 size={20} />
                            </button>
                           <div className="flex items-center gap-6 relative z-10">
                              <div className="w-16 h-16 bg-white border border-[#8245EF]/10 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:rotate-12 transition-all duration-700">
                                 <UserCircle2 size={36} className="text-[#8245EF]/60 group-hover:text-[#8245EF] transition-colors" />
                              </div>
                              <div>
                                 <p className="font-black text-[#161932] text-xl tracking-tighter uppercase leading-none">{contact.full_name || contact.name || "Unknown Person"}</p>
                                 <p className="text-[10px] font-black uppercase tracking-widest text-[#94a3b8] font-mono mt-3">{new Date(contact.createdAt).toLocaleDateString()}</p>
                              </div>
                           </div>
                           
                           <div className="grid grid-cols-1 gap-6 pt-10 border-t border-[#8245EF]/10 relative z-10">
                              {Object.keys(contact)
                                .filter(k => !["_id", "listId", "createdAt", "updatedAt", "__v", "full_name", "name"].includes(k))
                                .map(k => (
                                  <div key={k} className="flex flex-col gap-2">
                                     <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#94a3b8] font-mono">{k.replace(/_/g, ' ')}</span>
                                     <span className="text-base font-bold text-[#161932] truncate font-sans leading-relaxed">
                                        {typeof contact[k] === 'string' && contact[k].startsWith('http') ? (
                                           <a href={contact[k]} target="_blank" className="text-[#8245EF] underline decoration-[#8245EF]/30">Visit Link</a>
                                        ) : String(contact[k] || 'N/A')}
                                     </span>
                                  </div>
                                ))
                              }
                           </div>

                           <div className="absolute inset-0 opacity-[0.01] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-[#8245EF]/20 opacity-0 group-hover/records:opacity-100 transition-opacity" />
               </div>
            </div>
          )}
        </div>
      )}

      <AddContactModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onContactAdded={() => {
          if (selectedList) fetchContacts(selectedList._id);
        }}
        listId={selectedList?._id}
      />

      <UploadContactsModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onContactsUploaded={() => {
          if (viewMode === "lists") fetchLists();
          else if (selectedList) fetchContacts(selectedList._id);
        }}
      />
    </div>
  );
}
