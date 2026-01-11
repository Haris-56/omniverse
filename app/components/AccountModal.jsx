// components/AccountModal.jsx
'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

export default function AccountModal({ onClose, onSubmit }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cookies, setCookies] = useState('');
  const [saveAsDraft, setSaveAsDraft] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ email, password, cookies, saveAsDraft });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-xl">
        {/* Header */}
        <div className="bg-[#6B4EFF] text-white p-4 rounded-t-lg flex justify-between items-center">
          <h2 className="text-xl font-semibold">New Account</h2>
          <button onClick={onClose} className="hover:bg-purple-700 p-1 rounded-full">
            <X size={20} />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Number or Email</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Placeholder"
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-[#6B4EFF] focus:border-[#6B4EFF]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Placeholder"
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-[#6B4EFF] focus:border-[#6B4EFF]"
            />
          </div>

          {/* Text Editor Area (Mockup using textarea for simplicity) */}
          <div className="space-y-1">
            <textarea
              value={cookies}
              onChange={(e) => setCookies(e.target.value)}
              placeholder="Upload Your Facebook Account Cookies Here"
              rows={6}
              className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-[#6B4EFF] focus:border-[#6B4EFF] resize-none"
            />
            {/* The actual rich text toolbar is complex, this is a placeholder */}
            <div className="border border-gray-300 rounded-b-md p-2 flex items-center justify-between text-gray-500">
                <span className="text-xs">Paragraph</span>
                <div className="flex gap-2 text-sm">
                    {/* Placeholder for B, I, etc. buttons */}
                    <button type="button" className="font-bold">B</button>
                    <button type="button" className="italic">I</button>
                    <span>...</span>
                </div>
            </div>
          </div>

          {/* Footer controls */}
          <div className="flex justify-between items-center pt-2">
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={saveAsDraft}
                onChange={(e) => setSaveAsDraft(e.target.checked)}
                className="rounded text-[#6B4EFF] focus:ring-[#6B4EFF]"
              />
              <span>Save As Draft</span>
            </label>

            <button
              type="submit"
              className="px-6 py-2 bg-[#6B4EFF] text-white rounded-md hover:bg-purple-700 transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}