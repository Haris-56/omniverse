"use client";

import { useState, useEffect } from "react";
import { Search, Upload, Plus, Trash2, ArrowLeft, Folder, Calendar, Tag } from "lucide-react";
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

  const truncate = (str, n = 25) => {
    return (str && str.length > n) ? str.substr(0, n - 1) + "..." : str;
  };

  return (
    <div className="w-full p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {viewMode === "contacts" && (
            <button 
              onClick={() => {
                setViewMode("lists");
                setSelectedList(null);
                setSearchQuery("");
              }}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <h1 className="text-2xl font-semibold">
            {viewMode === "lists" ? "My Contact Lists" : selectedList?.name || "Contacts"}
          </h1>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-50 flex items-center gap-2"
          >
            <Upload size={16} />
            Import CSV
          </button>
          {viewMode === "contacts" && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-[#6B4EFF] text-white text-sm rounded-md hover:bg-[#5a3ee0] flex items-center gap-2"
            >
              <Plus size={16} />
              Add Contact
            </button>
          )}
        </div>
      </div>

      {viewMode === "lists" ? (
        /* Lists Table */
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600 border-b bg-gray-50/50">
                <th className="p-4 font-medium">List Name</th>
                <th className="p-4 font-medium">Segment / Platform</th>
                <th className="p-4 font-medium">Date Created</th>
                <th className="p-4 font-medium">Contacts</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="100%" className="p-8 text-center text-gray-500">Loading lists...</td></tr>
              ) : lists.length === 0 ? (
                <tr><td colSpan="100%" className="p-8 text-center text-gray-500">No lists found. Import a CSV to create one!</td></tr>
              ) : (
                lists.map((list) => (
                  <tr 
                    key={list._id} 
                    onClick={() => {
                      setSelectedList(list);
                      setViewMode("contacts");
                    }}
                    className="border-b last:border-0 hover:bg-gray-50 transition cursor-pointer group"
                  >
                    <td className="p-4 font-medium text-gray-900 flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-50 text-[#6B4EFF] rounded-full flex items-center justify-center">
                        <Folder size={16} />
                      </div>
                      {list.name}
                    </td>
                    <td className="p-4 text-gray-700">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-800 text-xs font-medium">
                        <Tag size={12} />
                        {list.segment}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        {new Date(list.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">{list.count || 0}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={(e) => handleDeleteList(e, list._id, list.name)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition opacity-0 group-hover:opacity-100"
                        title="Delete List"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        /* Contacts Table */
        <>
          {/* Search */}
          <div className="mb-6">
            <div className="relative w-72">
              <input
                placeholder="Search in this list..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border rounded-md py-2 px-10 text-sm outline-none bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#6B4EFF]/20 transition"
              />
              <Search size={16} className="absolute left-3 top-2.5 text-gray-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-600 border-b bg-gray-50/50">
                    {contacts.length > 0 &&
                      Object.keys(contacts[0])
                        .filter((key) => !["_id", "listId", "createdAt"].includes(key))
                        .map((key) => (
                          <th key={key} className="p-4 font-medium capitalize whitespace-nowrap">
                            {key.replace(/_/g, " ")}
                          </th>
                        ))}
                    <th className="p-4 font-medium">Added Date</th>
                    <th className="p-4"></th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr><td colSpan="100%" className="p-8 text-center text-gray-500">Loading contacts...</td></tr>
                  ) : contacts.length === 0 ? (
                    <tr><td colSpan="100%" className="p-8 text-center text-gray-500">No contacts in this list.</td></tr>
                  ) : (
                    contacts.map((contact) => (
                      <tr
                        key={contact._id}
                        className="border-b last:border-0 hover:bg-gray-50 transition group"
                      >
                        {Object.keys(contacts[0] || {})
                          .filter((key) => !["_id", "listId", "createdAt"].includes(key))
                          .map((key) => (
                            <td key={key} className="p-4 text-gray-900 max-w-[200px]" title={contact[key]}>
                              {typeof contact[key] === "string" && (contact[key].startsWith("http") || contact[key].startsWith("www")) ? (
                                <a
                                  href={contact[key].startsWith("http") ? contact[key] : `https://${contact[key]}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline"
                                >
                                  {truncate(contact[key])}
                                </a>
                              ) : (
                                truncate(String(contact[key] || "-"))
                              )}
                            </td>
                          ))}

                        <td className="p-4 text-gray-600 whitespace-nowrap">
                          {contact.createdAt
                            ? new Date(contact.createdAt).toLocaleDateString()
                            : "-"}
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition">
                            <button
                              onClick={() => handleDeleteContact(contact._id)}
                              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition"
                              title="Delete Contact"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <AddContactModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onContactAdded={() => {
          if (selectedList) fetchContacts(selectedList._id);
        }}
        listId={selectedList?._id} // Pass listId to modal
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

