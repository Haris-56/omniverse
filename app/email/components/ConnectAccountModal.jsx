"use client";

import { useState, useEffect } from "react";
import { 
  X, 
  Mail, 
  Loader2, 
  AlertCircle, 
  CheckCircle, 
  ShieldCheck, 
  Key, 
  User, 
  Terminal,
  Info,
  Rocket,
  Lock,
  Globe,
  Server,
  Activity,
  Hexagon
} from "lucide-react";

export default function ConnectAccountModal({ isOpen, onClose, onAccountConnected, initialEmail = "" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [host, setHost] = useState("");
  const [port, setPort] = useState("465");
  const [secure, setSecure] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (isOpen) {
        setEmail(initialEmail || "");
    }
  }, [isOpen, initialEmail]);

  if (!isOpen) return null;

  const handleConnect = async (e) => {
    if (e) e.preventDefault();
    if (!email || !password || !host || !port) {
      setError("All SMTP parameters are required");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/email/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          password, 
          smtpHost: host,
          smtpPort: parseInt(port),
          secure
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to establish SMTP bridge");
      }

      setResult({ status: "Connected" });
      
      setTimeout(() => {
        onAccountConnected();
        handleClose();
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setPassword("");
    setHost("");
    setError("");
    setResult(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4 lg:p-20 animate-in fade-in duration-700 overflow-y-auto custom-scrollbar">
      <div className="fixed inset-0 bg-[#3E3A39]/20 backdrop-blur-[60px]" onClick={handleClose} />
      
      <div className="bg-white rounded-[4rem] shadow-[0_80px_160px_rgba(183,141,125,0.2)] w-full max-w-7xl overflow-hidden border border-[#B78D7D]/20 relative z-10 animate-in zoom-in-95 duration-1000 my-auto">
        
        {/* Modal Header */}
        <div className="p-10 border-b border-[#B78D7D]/10 flex justify-between items-center bg-[#F8F4F2]/50">
          <div className="flex items-center gap-6">
             <div className="w-16 h-16 bg-[#F8F4F2] text-[#B78D7D] rounded-[1.75rem] flex items-center justify-center shadow-sm border border-[#B78D7D]/10">
                <Mail size={32} />
             </div>
             <div>
                <h2 className="text-3xl font-black text-[#3E3A39] tracking-tighter uppercase">SMTP Bridge</h2>
                <p className="text-[10px] font-black text-[#B78D7D] uppercase tracking-[0.4em] mt-1 font-mono">Provision_Outreach_Protocol</p>
             </div>
          </div>
          <button onClick={handleClose} className="p-4 bg-[#F8F4F2] hover:bg-[#B78D7D] group rounded-[1.25rem] transition-all border border-[#B78D7D]/10 text-[#B2AAA6] hover:text-white">
            <X size={24} className="group-hover:rotate-90 transition-transform duration-500" />
          </button>
        </div>

        <div className="p-12 custom-scrollbar max-h-[70vh] overflow-y-auto">
          {result ? (
            <div className="text-center py-16 animate-in slide-in-from-bottom duration-500">
              <div className="w-28 h-28 bg-[#B78D7D]/10 text-[#B78D7D] rounded-[3rem] flex items-center justify-center mx-auto mb-10 shadow-sm border border-[#B78D7D]/20">
                <CheckCircle size={48} />
              </div>
              <h3 className="text-4xl font-black text-[#3E3A39] mb-4 tracking-tighter uppercase">Bridge Active</h3>
              <p className="text-[#8E7A70] font-bold italic text-lg">Your SMTP node is now broadcasting on the outreach frequency.</p>
            </div>
          ) : (
            <form onSubmit={handleConnect} className="space-y-10">
              {error && (
                <div className="p-6 bg-rose-500/5 border border-rose-500/10 text-rose-500 text-xs font-black rounded-2xl flex items-center gap-4 animate-shake uppercase tracking-widest font-mono">
                  <AlertCircle size={22} />
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <label className="text-[10px] font-black text-[#B2AAA6] uppercase tracking-[0.4em] ml-2 font-mono">System Email</label>
                <div className="relative group">
                    <User size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-[#B2AAA6] group-focus-within:text-[#B78D7D] transition-colors" />
                    <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#F8F4F2]/50 border border-[#B78D7D]/10 rounded-2xl pl-16 pr-8 py-5 text-sm font-bold text-[#3E3A39] outline-none focus:border-[#B78D7D] transition-all shadow-sm"
                    placeholder="outreach@domain.com"
                    />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-4">
                   <label className="text-[10px] font-black text-[#B2AAA6] uppercase tracking-[0.4em] ml-2 font-mono">SMTP Host</label>
                   <div className="relative group">
                        <Server size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-[#B2AAA6] group-focus-within:text-[#B78D7D] transition-colors" />
                        <input
                        type="text"
                        value={host}
                        onChange={(e) => setHost(e.target.value)}
                        className="w-full bg-[#F8F4F2]/50 border border-[#B78D7D]/10 rounded-2xl pl-16 pr-8 py-5 text-sm font-bold text-[#3E3A39] outline-none focus:border-[#B78D7D] transition-all font-mono shadow-sm"
                        placeholder="smtp.provider.com"
                        />
                   </div>
                </div>
                <div className="space-y-4">
                   <label className="text-[10px] font-black text-[#B2AAA6] uppercase tracking-[0.4em] ml-2 font-mono">Port</label>
                   <input
                    type="text"
                    value={port}
                    onChange={(e) => setPort(e.target.value)}
                    className="w-full bg-[#F8F4F2]/50 border border-[#B78D7D]/10 rounded-2xl px-8 py-5 text-sm font-bold text-[#3E3A39] outline-none focus:border-[#B78D7D] transition-all font-mono text-center shadow-sm"
                    placeholder="465"
                    />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-[#B2AAA6] uppercase tracking-[0.4em] ml-2 font-mono">App Passkey</label>
                <div className="relative group">
                    <Key size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-[#B2AAA6] group-focus-within:text-[#B78D7D] transition-colors" />
                    <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#F8F4F2]/50 border border-[#B78D7D]/10 rounded-2xl pl-16 pr-8 py-5 text-sm font-bold text-[#3E3A39] outline-none focus:border-[#B78D7D] transition-all shadow-sm"
                    placeholder="••••••••••••"
                    />
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-6 pt-4">
                <div className="flex items-center gap-4 bg-[#F8F4F2]/50 p-6 rounded-2xl border border-[#B78D7D]/10 flex-1 w-full box-border">
                   <div className="group cursor-pointer flex items-center gap-4" onClick={() => setSecure(!secure)}>
                      <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${secure ? 'bg-[#B78D7D] border-[#B78D7D]' : 'border-[#B78D7D]/20 bg-white'}`}>
                         {secure && <CheckCircle size={14} className="text-white" />}
                      </div>
                      <span className="text-xs font-black text-[#8E7A70] uppercase tracking-widest font-mono group-hover:text-[#B78D7D] transition-colors">
                         Enable SSL/TLS
                      </span>
                   </div>
                </div>
                <div className="flex items-center gap-3 px-6 py-4 bg-white rounded-2xl border border-[#B78D7D]/10 shadow-sm">
                    <ShieldCheck size={20} className="text-[#B78D7D]" />
                    <span className="text-[10px] font-black text-[#B2AAA6] uppercase tracking-widest font-mono">Secured_Link</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#B78D7D] text-white py-6 rounded-[2rem] font-black text-lg shadow-[0_20px_40px_rgba(183,141,125,0.3)] hover:bg-[#A37B6D] transition-all disabled:opacity-50 flex items-center justify-center gap-5 active:scale-[0.98] border border-white/10 mt-10 uppercase tracking-[0.3em] font-mono text-[12px]"
              >
                {loading ? (
                  <>
                    <Loader2 size={24} className="animate-spin opacity-80" />
                    <span className="animate-pulse">Active Handshake...</span>
                  </>
                ) : (
                  <>
                    <Rocket size={24} />
                    <span>Initialize SMTP Bridge</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
        
        {/* Footer info */}
        <div className="p-10 bg-[#F8F4F2]/50 border-t border-[#B78D7D]/10 flex items-center justify-center gap-4">
           <Activity size={18} className="text-[#B78D7D]" />
           <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#B2AAA6] font-mono">SMTP Protocol Layer 7 Secure</span>
        </div>
      </div>
    </div>
  );
}
