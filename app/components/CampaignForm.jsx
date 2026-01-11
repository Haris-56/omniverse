// components/CampaignForm.jsx
'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

export default function CampaignForm({ onClose }) {
  const [formData, setFormData] = useState({
    campaignName: '',
    messageTemplate: '',
    templateName: '',
    type: '',
    style: '',
    productNumber: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Campaign Data:', formData);
    // Submit data to API
    onClose();
  };

  return (
    // Outer Overlay: Allows the entire modal to scroll if screen is very small
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      
      {/* Modal Box Container:
          1. Defined max height.
          2. Used 'flex flex-col' to structure content vertically.
          3. Used 'overflow-hidden' to ensure the scrolling is handled by a child. */}
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-xl my-8 max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header: Fixed at the top, ensures it doesn't scroll */}
        <div className="bg-[#6B4EFF] text-white p-4 rounded-t-lg flex justify-between items-center flex-shrink-0">
          <h2 className="text-xl font-semibold">New Campaign (Add Order)</h2>
          <button onClick={onClose} className="hover:bg-purple-700 p-1 rounded-full">
            <X size={20} />
          </button>
        </div>

        {/* Form Content Area:
            1. FIX: Added 'overflow-y-auto' and 'flex-1' (or 'grow'). 
               'flex-1' forces this container to take up all remaining vertical space, 
               allowing 'overflow-y-auto' to work correctly. */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          
          {/* Form Fields Start */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Campaign name</label>
            <input
              type="text"
              name="campaignName"
              value={formData.campaignName}
              onChange={handleChange}
              placeholder="Your Product Name"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Message Template</label>
            <input
              type="text"
              name="messageTemplate"
              value={formData.messageTemplate}
              onChange={handleChange}
              placeholder="Placeholder"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Template name</label>
            <div className="flex gap-4">
                <input
                    type="text"
                    name="templateName"
                    value={formData.templateName}
                    onChange={handleChange}
                    placeholder="Normal Price"
                    className="w-1/2 border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
                <input
                    type="text"
                    placeholder="Sale Price"
                    className="w-1/2 border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
            </div>
          </div>

          <div className="space-y-1">
            <textarea
              rows={6}
              placeholder="Type your message here..."
              className="w-full border border-gray-300 rounded-t-md p-3 text-sm focus:ring-[#6B4EFF] focus:border-[#6B4EFF] resize-none"
            />
            <div className="border border-gray-300 rounded-b-md p-2 flex items-center justify-between text-gray-500">
                <span className="text-xs">Paragraph</span>
                <div className="flex gap-2 text-sm">
                    <button type="button" className="font-bold">B</button>
                    <button type="button" className="italic">I</button>
                    <span>...</span>
                </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Type</label>
            <input
              type="text"
              name="type"
              value={formData.type}
              onChange={handleChange}
              placeholder="Info Type"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Style</label>
            <input
              type="text"
              name="style"
              value={formData.style}
              onChange={handleChange}
              placeholder="Info Style"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Product Number</label>
            <input
              type="text"
              name="productNumber"
              value={formData.productNumber}
              onChange={handleChange}
              placeholder="Info Product Number"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
          
          {/* Added extra fields to guarantee scroll */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Extra Field 1</label>
            <input type="text" placeholder="Test Scroll" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Extra Field 2</label>
            <input type="text" placeholder="Test Scroll" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Extra Field 3</label>
            <input type="text" placeholder="Test Scroll" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
          </div>

          {/* This part of the form will now scroll with the rest of the content */}

          {/* Submit Button: Remains outside the primary scrolling area of the form, 
             but must be inside the scrolling form wrapper to scroll with content 
             if you want it at the bottom of the form's scrolling window.
             If you want it fixed, it needs to be moved outside the 'form' element 
             but inside the 'Modal Box Container'.
             I'll leave it in the form for simplicity as scrollbar should encompass the entire form. */}
          <div className="flex justify-end pt-4 shrink-0">
            <button
              type="submit"
              className="px-6 py-2 bg-[#6B4EFF] text-white rounded-md hover:bg-purple-700 transition"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}