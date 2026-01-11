"use client";

import { useState, useEffect } from "react";
import { X, UserPlus, Save, Layout, AtSign, Mic, Repeat, PenTool } from "lucide-react";

export default function CreatorModal({ isOpen, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState({
    name: "",
    profilesToTrack: "",
    platform: "LinkedIn",
    tone: "Professional",
    postType: "Repost", // or 'New Post'
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: "",
        profilesToTrack: "",
        platform: "LinkedIn",
        tone: "Professional",
        postType: "Repost",
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg flex flex-col animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
          <div className="flex items-center gap-3 text-indigo-600">
            <div className="bg-white p-2 rounded-lg shadow-sm">
              <UserPlus size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              {initialData ? "Edit AI Creator" : "New AI Creator"}
            </h2>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 hover:bg-white/50 p-2 rounded-full transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* content */}
        <div className="p-6 space-y-6">
          <form id="creator-form" onSubmit={handleSubmit} className="space-y-5">
            
            {/* Name Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Creator Name</label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-gray-900 placeholder:text-gray-500"
                  placeholder="e.g., Tech Influencer Tracker"
                />
                <UserPlus className="absolute left-3 top-2.5 text-gray-400" size={18} />
              </div>
            </div>

            {/* Profiles to Track */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Profiles to Track <span className="text-xs font-normal text-gray-500">(Separate with commas)</span>
              </label>
              <div className="relative">
                <textarea
                  name="profilesToTrack"
                  value={formData.profilesToTrack}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none text-gray-900 placeholder:text-gray-500"
                  placeholder="e.g., elonmusk, satyanadella, sundarpichai"
                />
                <AtSign className="absolute left-3 top-3 text-gray-400" size={18} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              {/* Platform Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Platform</label>
                <div className="relative">
                  <select
                    name="platform"
                    value={formData.platform}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all appearance-none text-gray-900"
                  >
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Facebook">Facebook</option>
                  </select>
                  <Layout className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </div>
              </div>

              {/* Tone/Tune Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tone & Tune</label>
                <div className="relative">
                  <select
                    name="tone"
                    value={formData.tone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all appearance-none text-gray-900"
                  >
                    <option value="Professional">Professional</option>
                    <option value="Casual">Casual</option>
                    <option value="Witty">Witty</option>
                    <option value="Inspirational">Inspirational</option>
                    <option value="Controversial">Controversial</option>
                  </select>
                  <Mic className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </div>
              </div>
            </div>

            {/* Post Type Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Action Type</label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`
                  relative flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all
                  ${formData.postType === 'Repost' 
                    ? 'border-indigo-500 bg-indigo-50/50 text-indigo-700' 
                    : 'border-gray-100 bg-white hover:border-gray-200 text-gray-600'}
                `}>
                  <input
                    type="radio"
                    name="postType"
                    value="Repost"
                    checked={formData.postType === 'Repost'}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <Repeat size={24} className="mb-2" />
                  <span className="font-medium text-sm">Repost</span>
                </label>

                <label className={`
                  relative flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all
                  ${formData.postType === 'New Post' 
                    ? 'border-indigo-500 bg-indigo-50/50 text-indigo-700' 
                    : 'border-gray-100 bg-white hover:border-gray-200 text-gray-600'}
                `}>
                  <input
                    type="radio"
                    name="postType"
                    value="New Post"
                    checked={formData.postType === 'New Post'}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <PenTool size={24} className="mb-2" />
                  <span className="font-medium text-sm">New Post</span>
                </label>
              </div>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 flex justify-end gap-3 rounded-b-xl">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="creator-form"
            className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-all shadow-sm flex items-center gap-2"
          >
            <Save size={18} />
            {initialData ? "Save Changes" : "Create Creator"}
          </button>
        </div>

      </div>
    </div>
  );
}
