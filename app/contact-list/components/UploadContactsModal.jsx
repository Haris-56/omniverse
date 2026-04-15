"use client";

import { useState } from "react";
import { X, Upload, FileType, CheckCircle2, AlertCircle, Loader2, ArrowRight, ShieldCheck, Activity, Hexagon } from "lucide-react";

export default function UploadContactsModal({ isOpen, onClose, onUpload }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
      setError("");
    } else {
      setFile(null);
      setError("Please select a valid .csv file");
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      await onUpload(file);
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setFile(null);
      }, 2000);
    } catch (err) {
      setError(err.message || "Bulk ingestion failed");
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[1000] p-6 lg:p-12 animate-in fade-in duration-500 overflow-y-auto custom-scrollbar">
      <div className="fixed inset-0 bg-[#3E3A39]/10 backdrop-blur-2xl" onClick={handleBackdropClick} />
      
      <div className="bg-[#F8F4F2] rounded-[4rem] shadow-[0_50px_100px_rgba(183,141,125,0.15)] w-full max-w-2xl overflow-hidden border border-[#B78D7D]/15 relative z-10 animate-in zoom-in-95 duration-500 my-auto group/modal">
        
        {/* Header */}
        <div className="p-10 border-b border-[#B78D7D]/10 flex justify-between items-center bg-white/40">
           <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white text-[#B78D7D] rounded-[1.75rem] flex items-center justify-center shadow-lg border border-[#B78D7D]/10 group-hover/modal:rotate-12 transition-transform duration-700">
                 <Upload size={32} />
              </div>
              <div>
                 <h2 className="text-3xl font-black text-[#3E3A39] tracking-tighter uppercase leading-none">Mass_Ingest</h2>
                 <p className="text-[10px] font-black text-[#B78D7D] uppercase tracking-[0.4em] mt-2 font-mono italic leading-none">Neural_Data_Streaming</p>
              </div>
           </div>
           <button onClick={onClose} className="p-4 bg-white hover:bg-[#B78D7D] group/close rounded-2xl transition-all border border-[#B78D7D]/10 text-[#B2AAA6] hover:text-white shadow-sm active:scale-90">
             <X size={28} className="group-hover/close:rotate-90 transition-transform duration-500" />
           </button>
        </div>

        <div className="p-12">
          {success ? (
            <div className="text-center py-20 animate-in slide-in-from-bottom duration-500">
               <div className="w-32 h-32 bg-white text-emerald-500 rounded-[3rem] flex items-center justify-center mx-auto mb-10 shadow-xl border border-emerald-500/10 transition-transform duration-1000 hover:scale-110">
                  <CheckCircle2 size={56} />
               </div>
               <h3 className="text-4xl font-black text-[#3E3A39] mb-4 tracking-tighter uppercase">Sync_Complete</h3>
               <p className="text-[#8E7A70] font-black italic text-lg uppercase tracking-widest font-mono text-[12px]">Cluster nodes successfully populated with new prospect data.</p>
            </div>
          ) : (
            <div className="space-y-12">
              <div className="relative group/upload">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                  id="csv-upload"
                />
                <label
                  htmlFor="csv-upload"
                  className={`flex flex-col items-center justify-center w-full min-h-[350px] border-2 border-dashed rounded-[3.5rem] cursor-pointer transition-all duration-700 bg-white/30 hover:bg-white/60 ${
                    file ? "border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.05)]" : "border-[#B78D7D]/20 hover:border-[#B78D7D]/50 shadow-inner"
                  }`}
                >
                  <div className="flex flex-col items-center justify-center p-12 text-center">
                    <div className={`p-8 rounded-[2.5rem] border mb-8 transition-all duration-700 ${
                       file ? "bg-emerald-50 text-emerald-500 border-emerald-200 shadow-sm scale-110" : "bg-white text-[#B2AAA6] border-[#B78D7D]/10 group-hover/upload:scale-110 group-hover/upload:rotate-6 group-hover/upload:text-[#B78D7D] group-hover/upload:border-[#B78D7D]/30 shadow-md"
                    }`}>
                       {file ? <FileType size={56} /> : <Upload size={56} />}
                    </div>
                    
                    {file ? (
                      <div className="space-y-4 animate-in zoom-in duration-500">
                        <p className="text-3xl font-black text-[#3E3A39] tracking-tighter uppercase">{file.name}</p>
                        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.5em] font-mono italic">Ready_For_Sequence_Compilation</p>
                      </div>
                    ) : (
                      <>
                        <h4 className="text-3xl font-black text-[#3E3A39] mb-4 tracking-tighter uppercase">Select_CSV_Fragment</h4>
                        <p className="text-[#8E7A70] text-[11px] font-black uppercase tracking-[0.3em] max-w-sm mx-auto leading-relaxed italic font-mono opacity-60">
                          Headers Req:: Name, Email, Website, Location, Company, Position.
                        </p>
                      </>
                    )}
                  </div>
                </label>
              </div>

              {error && (
                <div className="p-8 bg-rose-50 border border-rose-500/10 text-rose-600 text-[10px] font-black rounded-[2rem] flex items-center gap-6 animate-pulse uppercase tracking-[0.3em] font-mono shadow-inner italic text-center justify-center">
                   <AlertCircle size={24} />
                   {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-10">
                 <button
                    onClick={onClose}
                    className="py-6 bg-white text-[#B2AAA6] font-black text-[12px] uppercase tracking-[0.5em] rounded-[2rem] hover:bg-rose-50 hover:text-rose-500 transition-all border border-[#B78D7D]/10 active:scale-95 font-mono shadow-sm"
                 >
                    Terminate
                 </button>
                 <button
                    onClick={handleUpload}
                    disabled={!file || loading}
                    className="py-6 bg-[#B78D7D] text-white font-black text-[12px] uppercase tracking-[0.5em] rounded-[2rem] shadow-[0_25px_50px_rgba(183,141,125,0.3)] hover:bg-[#A37B6D] transition-all disabled:opacity-30 flex items-center justify-center gap-5 border border-white/10 font-mono active:scale-95 group/btn"
                 >
                    {loading ? (
                       <Loader2 size={24} className="animate-spin opacity-80" />
                    ) : (
                       <>
                          <span>Transmit_Data</span>
                          <ArrowRight size={24} className="group-hover/btn:translate-x-1 transition-transform" />
                       </>
                    )}
                 </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-10 bg-[#F8F4F2]/50 border-t border-[#B78D7D]/10 flex items-center justify-between relative overflow-hidden">
           <div className="flex items-center gap-4 relative z-10">
              <ShieldCheck size={20} className="text-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#B2AAA6] font-mono italic">Node_Integrity_Verified</span>
           </div>
           <Activity size={20} className="text-[#B78D7D] relative z-10 animate-pulse" />
           <div className="absolute inset-0 opacity-[0.01] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        </div>

        {/* Branding Decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none -z-10 grayscale group-hover/modal:opacity-[0.06] transition-opacity duration-1000">
           <Hexagon size={320} strokeWidth={1} className="text-[#B78D7D] animate-spin-slow" />
        </div>
      </div>
    </div>
  );
}
