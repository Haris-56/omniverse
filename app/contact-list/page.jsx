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
  ExternalLink
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
  const [displayStyle, setDisplayStyle] = useState("table"); // 'table' | 'cards' for desktop, always cards for mobile

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
    if (!confirm(`Are you sure you want to delete the list '${listName}' and all its contacts?`)) return;

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
    if (!confirm("Are you sure you want to delete this contact?")) return;

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
    <div className="w-full min-h-screen bg-gray-50/50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            {viewMode === "contacts" && (
              <button 
                onClick={() => {
                  setViewMode("lists");
                  setSelectedList(null);
                  setSearchQuery("");
                }}
                className="p-3 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:bg-gray-50 transition-all text-gray-500"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                {viewMode === "lists" ? "Contact Segments" : selectedList?.name}
              </h1>
              <p className="text-gray-500 mt-1 text-sm font-medium">
                {viewMode === "lists" 
                  ? `${lists.length} lists managed across all platforms` 
                  : `${contacts.length} entries found in this sequence`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="flex-1 md:flex-none px-5 py-3 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-2xl hover:bg-gray-50 transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <Upload size={18} className="text-indigo-600" />
              <span>Import CSV</span>
            </button>
            {viewMode === "contacts" ? (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex-1 md:flex-none px-6 py-3 bg-indigo-600 text-white text-sm font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                <span>Add Record</span>
              </button>
            ) : (
               <div className="hidden md:flex items-center bg-white border border-gray-200 p-1 rounded-2xl shadow-sm">
                  <button 
                    onClick={() => setDisplayStyle("table")}
                    className={`p-2 rounded-xl transition-all ${displayStyle === 'table' ? 'bg-indigo-50 text-indigo-600 shadow-inner' : 'text-gray-400 hover:bg-gray-50'}`}
                  >
                    <ListIcon size={18} />
                  </button>
                  <button 
                    onClick={() => setDisplayStyle("cards")}
                    className={`p-2 rounded-xl transition-all ${displayStyle === 'cards' ? 'bg-indigo-50 text-indigo-600 shadow-inner' : 'text-gray-400 hover:bg-gray-50'}`}
                  >
                    <LayoutGrid size={18} />
                  </button>
               </div>
            )}
          </div>
        </div>

        {/* Toolbar Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
           <div className="relative flex-1 max-w-md group">
              <input
                placeholder={viewMode === "lists" ? "Search segments..." : "Search contacts in list..."}
                value={searchQuery}
                onInput={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-[1.25rem] py-3.5 px-12 text-sm font-medium outline-none shadow-sm group-focus-within:ring-4 group-focus-within:ring-indigo-500/10 group-focus-within:border-indigo-500/30 transition-all"
              />
              <Search size={20} className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
           </div>
           
           <div className="flex items-center gap-2">
              <button className="px-4 py-3 bg-white border border-gray-100 rounded-2xl text-gray-500 text-sm font-bold flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm">
                <Filter size={18} />
                <span>Filter</span>
              </button>
           </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
             <div className="relative">
                <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <Plus size={16} className="text-indigo-600" />
                   </div>
                </div>
             </div>
             <p className="mt-6 text-gray-400 font-bold uppercase tracking-widest text-[10px]">Processing Data Nodes...</p>
          </div>
        ) : (
          <>
            {viewMode === "lists" ? (
              /* Lists View */
              displayStyle === "table" ? (
                <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/40 overflow-hidden border border-gray-100">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-gray-400 border-b border-gray-50 bg-gray-50/20 uppercase text-[10px] font-black tracking-[0.1em]">
                          <th className="p-6">Segment Workspace</th>
                          <th className="p-6">Platform / Tag</th>
                          <th className="p-6">Creation Date</th>
                          <th className="p-6 text-center">Data Points</th>
                          <th className="p-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {lists.length === 0 ? (
                          <tr><td colSpan="5" className="p-20 text-center text-gray-400 font-medium italic">Empty segment workspace. Initialize with a CSV import.</td></tr>
                        ) : (
                          lists.map((list) => (
                            <tr 
                              key={list._id} 
                              onClick={() => {
                                setSelectedList(list);
                                setViewMode("contacts");
                              }}
                              className="group hover:bg-gray-50/80 transition-all cursor-pointer"
                            >
                              <td className="p-6">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-inner">
                                    <Folder size={22} />
                                  </div>
                                  <div>
                                    <p className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{list.name}</p>
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider mt-0.5">Contact List</p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-6">
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-100 text-gray-600 text-[10px] font-black uppercase tracking-widest border border-transparent group-hover:border-indigo-100 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                                  <Tag size={12} />
                                  {list.segment || 'General'}
                                </div>
                              </td>
                              <td className="p-6">
                                <div className="flex items-center gap-2 text-gray-500 font-medium">
                                  <Calendar size={14} />
                                  {new Date(list.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </div>
                              </td>
                              <td className="p-6 text-center">
                                <span className="font-black text-gray-900 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">{list.count || 0}</span>
                              </td>
                              <td className="p-6 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={(e) => handleDeleteList(e, list._id, list.name)}
                                    className="p-2.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                  <div className="p-2.5 text-gray-300 group-hover:text-indigo-400 transition-all">
                                    <ChevronRight size={18} />
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                /* Card View for Lists */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {lists.map((list) => (
                    <div
                      key={list._id}
                      onClick={() => {
                        setSelectedList(list);
                        setViewMode("contacts");
                      }}
                      className="group bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer relative overflow-hidden"
                    >
                      <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-indigo-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      <div className="flex justify-between items-start mb-8 relative z-10">
                         <div className="p-4 bg-indigo-50 text-indigo-600 rounded-3xl shadow-inner group-hover:rotate-6 transition-transform duration-500">
                           <Folder size={32} />
                         </div>
                         <div className="px-3 py-1.5 bg-gray-50 text-[10px] font-black uppercase text-gray-400 tracking-[0.15em] rounded-full border border-gray-100">
                           {list.segment || 'General'}
                         </div>
                      </div>

                      <h3 className="text-xl font-black text-gray-900 mb-2 truncate group-hover:text-indigo-600 transition-colors">{list.name}</h3>
                      
                      <div className="flex items-center gap-4 mt-6 pt-6 border-t border-gray-50">
                        <div className="flex-1">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Entries</p>
                          <p className="text-lg font-black text-gray-900">{list.count || 0}</p>
                        </div>
                        <div className="flex-1 border-l border-gray-50 pl-4">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Created</p>
                          <p className="text-sm font-bold text-gray-700">{new Date(list.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="mt-8 flex justify-end">
                         <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                            <ChevronRight size={20} />
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              /* Contacts View (Record List) */
              <div className="space-y-6">
                 {/* Mobile view info */}
                 <div className="lg:hidden p-4 bg-amber-50 rounded-2xl border border-amber-100 text-[10px] font-bold text-amber-700 uppercase tracking-widest flex items-center gap-2 mb-4">
                    <LayoutGrid size={14} />
                    Mobile Optimized Card View Active
                 </div>

                 <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/30 overflow-hidden border border-gray-100">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm hidden lg:table">
                        <thead>
                          <tr className="text-left text-gray-400 border-b border-gray-50 bg-gray-50/20 uppercase text-[10px] font-black tracking-[0.1em]">
                            {contacts.length > 0 &&
                              Object.keys(contacts[0])
                                .filter((key) => !["_id", "listId", "createdAt"].includes(key))
                                .map((key) => (
                                  <th key={key} className="p-6 whitespace-nowrap">
                                    {key.replace(/_/g, " ")}
                                  </th>
                                ))}
                            <th className="p-6">Date Synchronized</th>
                            <th className="p-6 text-right">Action</th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-50">
                          {contacts.length === 0 ? (
                             <tr><td colSpan="100%" className="p-20 text-center text-gray-400 font-medium italic">Scanning pipeline complete. 0 records established.</td></tr>
                          ) : (
                            contacts.map((contact) => (
                              <tr
                                key={contact._id}
                                className="hover:bg-gray-50 transition-all group"
                              >
                                {Object.keys(contacts[0] || {})
                                  .filter((key) => !["_id", "listId", "createdAt"].includes(key))
                                  .map((key) => (
                                    <td key={key} className="p-6 text-gray-900 font-medium max-w-[250px]" title={contact[key]}>
                                      {typeof contact[key] === "string" && (contact[key].startsWith("http") || contact[key].startsWith("www")) ? (
                                        <a
                                          href={contact[key].startsWith("http") ? contact[key] : `https://${contact[key]}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-indigo-600 hover:underline flex items-center gap-1.5"
                                        >
                                          {truncate(contact[key])}
                                          <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </a>
                                      ) : (
                                        <span className="truncate block">{truncate(String(contact[key] || "-"), 40)}</span>
                                      )}
                                    </td>
                                  ))}

                                <td className="p-6 text-gray-500 font-medium whitespace-nowrap">
                                  {contact.createdAt ? new Date(contact.createdAt).toLocaleDateString() : "-"}
                                </td>

                                <td className="p-6 text-right">
                                  <button
                                    onClick={() => handleDeleteContact(contact._id)}
                                    className="p-2.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>

                      {/* Mobile Card View (shown below lg breakpoint) */}
                      <div className="lg:hidden p-4 space-y-4">
                        {contacts.map((contact) => (
                          <div key={contact._id} className="p-6 bg-gray-50/50 rounded-3xl border border-gray-100 space-y-4 relative">
                             <button
                                onClick={() => handleDeleteContact(contact._id)}
                                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-600"
                              >
                                <Trash2 size={16} />
                              </button>
                             <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                   <UserCircle2 size={24} className="text-indigo-400" />
                                </div>
                                <div>
                                   <p className="font-bold text-gray-900">{contact.full_name || contact.name || "Anonymous Record"}</p>
                                   <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{new Date(contact.createdAt).toLocaleDateString()}</p>
                                </div>
                             </div>
                             
                             <div className="grid grid-cols-1 gap-3 pt-4 border-t border-gray-100">
                                {Object.keys(contact)
                                  .filter(k => !["_id", "listId", "createdAt", "full_name", "name"].includes(k))
                                  .map(k => (
                                    <div key={k} className="flex flex-col">
                                       <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-0.5">{k.replace(/_/g, ' ')}</span>
                                       <span className="text-xs font-bold text-gray-700 truncate">
                                          {typeof contact[k] === 'string' && contact[k].startsWith('http') ? (
                                             <a href={contact[k]} target="_blank" className="text-indigo-600 underline">Link</a>
                                          ) : String(contact[k] || '-')}
                                       </span>
                                    </div>
                                  ))
                                }
                             </div>
                          </div>
                        ))}
                        {contacts.length === 0 && <p className="text-center py-10 text-gray-400 italic">No records to display.</p>}
                      </div>
                    </div>
                 </div>
              </div>
            )}
          </>
        )}
      </div>

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
