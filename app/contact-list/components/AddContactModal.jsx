"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function AddContactModal({ isOpen, onClose, onContactAdded }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    twitter: "",
    segments: [],
  });
  const [availableSegments, setAvailableSegments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchSegments();
    }
  }, [isOpen]);

  const fetchSegments = async () => {
    try {
      const res = await fetch("/api/segments");
      if (res.ok) {
        const data = await res.json();
        setAvailableSegments(data);
      }
    } catch (error) {
      console.error("Failed to fetch segments", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSegmentChange = (e) => {
    const value = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setFormData((prev) => ({ ...prev, segments: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        onContactAdded();
        onClose();
        setFormData({
          name: "",
          email: "",
          phone: "",
          linkedin: "",
          twitter: "",
          segments: [],
        });
      } else {
        alert("Failed to add contact");
      }
    } catch (error) {
      console.error("Error adding contact:", error);
      alert("Error adding contact");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-6">Add New Contact</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#6B4EFF] outline-none"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#6B4EFF] outline-none"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#6B4EFF] outline-none"
              placeholder="+1 234 567 890"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LinkedIn
              </label>
              <input
                type="text"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#6B4EFF] outline-none"
                placeholder="Profile URL"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Twitter
              </label>
              <input
                type="text"
                name="twitter"
                value={formData.twitter}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#6B4EFF] outline-none"
                placeholder="@handle"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Segments
            </label>
            <select
              multiple
              name="segments"
              value={formData.segments}
              onChange={handleSegmentChange}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#6B4EFF] outline-none h-24"
            >
              {availableSegments.map((segment) => (
                <option key={segment} value={segment}>
                  {segment}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Hold Ctrl/Cmd to select multiple
            </p>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#6B4EFF] text-white py-2.5 rounded-lg font-medium hover:bg-[#5a3ee0] transition disabled:opacity-70"
            >
              {loading ? "Adding..." : "Add Contact"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
