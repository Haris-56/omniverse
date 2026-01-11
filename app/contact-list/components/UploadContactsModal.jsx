"use client";

import { useState, useRef } from "react";
import { X, Upload, FileSpreadsheet, AlertCircle, CheckCircle } from "lucide-react";
import * as XLSX from "xlsx";

export default function UploadContactsModal({ isOpen, onClose, onContactsUploaded }) {
  const [step, setStep] = useState(1); // 1: Select File, 2: Preview & Config, 3: Uploading/Done
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [listName, setListName] = useState("");
  const [segment, setSegment] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const processFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        if (json.length < 2) {
          setError("File appears to be empty or missing headers.");
          return;
        }

        const extractedHeaders = json[0];
        const rows = json.slice(1);

        if (rows.length > 100) {
          setError("File exceeds the 100-row limit. Please upload a smaller file.");
          return;
        }

        // Convert rows to objects based on headers
        const formattedData = rows.map((row) => {
          const obj = {};
          extractedHeaders.forEach((header, index) => {
            if (header) obj[header.trim()] = row[index]; // Use header as key
          });
          return obj;
        });

        setFile(file);
        setHeaders(extractedHeaders);
        setPreviewData(formattedData);
        setListName(file.name.split('.')[0]); // Default list name from filename
        setStep(2);
        setError("");
      } catch (err) {
        console.error("Error parsing file:", err);
        setError("Failed to parse file. Please ensure it's a valid CSV or Excel file.");
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleUpload = async () => {
    if (!listName) {
      setError("Please provide a name for this list.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      // 1. Create the List
      const listRes = await fetch("/api/lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: listName, segment: segment }),
      });

      if (!listRes.ok) {
        throw new Error("Failed to create list");
      }

      const listData = await listRes.json();
      const listId = listData._id;

      // 2. Upload Contacts to that List
      const contactsRes = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          contacts: previewData,
          listId: listId 
        }),
      });

      if (!contactsRes.ok) {
        const errData = await contactsRes.json();
        throw new Error(errData.error || "Failed to upload contacts");
      }

      setSuccess(true);
      setStep(3);
      setTimeout(() => {
        onContactsUploaded();
        handleClose();
      }, 1500);
    } catch (err) {
      console.error("Upload failed:", err);
      setError(err.message || "An error occurred during upload.");
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setFile(null);
    setPreviewData([]);
    setHeaders([]);
    setListName("");
    setSegment("");
    setError("");
    setSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Import Contacts</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md flex items-center gap-2 text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {step === 1 && (
            <div 
              className="border-2 border-dashed border-gray-300 rounded-xl p-12 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-16 h-16 bg-indigo-50 text-[#6B4EFF] rounded-full flex items-center justify-center mb-4">
                <Upload size={32} />
              </div>
              <h3 className="text-lg font-medium mb-2">Click to upload or drag and drop</h3>
              <p className="text-gray-500 text-sm mb-6">CSV, XLSX (Max 100 rows)</p>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept=".csv, .xlsx, .xls" 
                className="hidden" 
              />
              <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-md hover:bg-gray-100 text-sm font-medium">
                Select File
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                <FileSpreadsheet className="text-green-600" size={24} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{file?.name}</p>
                  <p className="text-xs text-gray-500">{previewData.length} contacts found</p>
                </div>
                <button 
                  onClick={() => setStep(1)}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Change
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    List Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={listName}
                    onChange={(e) => setListName(e.target.value)}
                    placeholder="e.g. LinkedIn Outreach"
                    className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#6B4EFF]/20 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Segment / Platform
                  </label>
                  <input
                    type="text"
                    value={segment}
                    onChange={(e) => setSegment(e.target.value)}
                    placeholder="e.g. LinkedIn"
                    className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#6B4EFF]/20 outline-none"
                  />
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Preview (First 3 rows)</h4>
                <div className="border rounded-md overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        {headers.map((h, i) => (
                          <th key={i} className="p-2 font-medium text-gray-600 whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.slice(0, 3).map((row, i) => (
                        <tr key={i} className="border-b last:border-0">
                          {headers.map((h, j) => (
                            <td key={j} className="p-2 text-gray-800 whitespace-nowrap">{row[h.trim()] || "-"}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button 
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md text-sm"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUpload}
                  disabled={uploading}
                  className="px-4 py-2 bg-[#6B4EFF] text-white rounded-md hover:bg-[#5a3ee0] text-sm font-medium disabled:opacity-50 flex items-center gap-2"
                >
                  {uploading ? "Uploading..." : "Create List & Import"}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-4">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Import Successful!</h3>
              <p className="text-gray-500">Your contacts have been added to the list.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
