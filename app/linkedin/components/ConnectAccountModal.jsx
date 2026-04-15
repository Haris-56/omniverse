"use client";

import { useState, useEffect } from "react";
import { 
  X, 
  Linkedin, 
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
  Hexagon,
  Activity
} from "lucide-react";

export default function ConnectAccountModal({ isOpen, onClose, onAccountConnected, initialEmail = "" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cookies, setCookies] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  
  // Proxy State
  const [useProxy, setUseProxy] = useState(false);
  const [proxyHost, setProxyHost] = useState("");
  const [proxyPort, setProxyPort] = useState("");
  const [proxyUsername, setProxyUsername] = useState("");
  const [proxyPassword, setProxyPassword] = useState("");

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
    if (!email || !password) {
      setError("Email and Password are required");
      return;
    }

    setLoading(true);
    setError("");
    
    if (result?.status !== "Checkpoint") {
        setResult(null);
    }

    try {
      const res = await fetch("/api/linkedin/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          password, 
          cookies,
          twoFactorCode,
          proxy: useProxy ? {
            host: proxyHost,
            port: proxyPort,
            username: proxyUsername,
            password: proxyPassword
          } : null
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.status === "Checkpoint") {
           setResult({ status: data.status, reason: data.failureReason });
           return;
        }
        throw new Error(data.error || "Failed to connect");
      }

      setResult({ status: data.status, reason: data.failureReason });
      
      if (data.status === "Connected") {
        setTimeout(() => {
          onAccountConnected();
          handleClose();
        }, 1500);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setPassword("");
    setCookies("");
    setTwoFactorCode("");
    setError("");
    setResult(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4 lg:p-20 animate-in fade-in duration-700 overflow-y-auto custom-scrollbar">
      <div className="fixed inset-0 bg-[#3E3A39]/20 backdrop-blur-[60px]" onClick={handleClose} />
      
      <div className="bg-white rounded-[4rem] shadow-[0_80px_160px_rgba(183,141,125,0.2)] w-full max-w-[1400px] overflow-hidden border border-[#B78D7D]/20 relative z-10 animate-in zoom-in-95 duration-1000 my-auto">
        
        {/* Modal Header */}
        <div className="p-10 border-b border-[#B78D7D]/10 flex justify-between items-center bg-[#F8F4F2]/50">
          <div className="flex items-center gap-6">
             <div className="w-16 h-16 bg-[#F8F4F2] text-[#B78D7D] rounded-[1.75rem] flex items-center justify-center shadow-sm border border-[#B78D7D]/10">
                <Linkedin size={32} fill="currentColor" />
             </div>
             <div>
                <h2 className="text-3xl font-black text-[#3E3A39] tracking-tighter uppercase leading-none">LinkedIn</h2>
                <p className="text-[10px] font-black text-[#B78D7D] uppercase tracking-[0.4em] mt-1 font-mono leading-none">Manage your social accounts here.</p>
             </div>
          </div>
          <button onClick={handleClose} className="p-4 bg-[#F8F4F2] hover:bg-[#B78D7D] group rounded-[1.25rem] transition-all border border-[#B78D7D]/10 text-[#B2AAA6] hover:text-white">
            <X size={24} className="group-hover:rotate-90 transition-transform duration-500" />
          </button>
        </div>

        <div className="p-12 custom-scrollbar max-h-[70vh] overflow-y-auto">
          {result && result.status !== "Checkpoint" ? (
            <div className="text-center py-16 animate-in slide-in-from-bottom duration-500">
              {result.status === "Connected" ? (
                <>
                  <div className="w-28 h-28 bg-[#B78D7D]/10 text-[#B78D7D] rounded-[3rem] flex items-center justify-center mx-auto mb-10 shadow-sm border border-[#B78D7D]/20">
                    <CheckCircle size={48} />
                  </div>
                  <h3 className="text-4xl font-black text-[#3E3A39] mb-4 tracking-tighter uppercase">Node Activated</h3>
                  <p className="text-[#8E7A70] font-bold italic text-lg">Your LinkedIn identity is now synchronized with the Omniverse cluster.</p>
                </>
              ) : (
                <>
                  <div className="w-28 h-28 bg-rose-500/10 text-rose-500 rounded-[3rem] flex items-center justify-center mx-auto mb-10 shadow-sm border border-rose-500/20">
                    <AlertCircle size={48} />
                  </div>
                  <h3 className="text-4xl font-black text-[#3E3A39] mb-4 tracking-tighter uppercase">Signal Loss</h3>
                  <p className="text-rose-500 font-black mb-12 text-lg italic">{result.reason}</p>
                  <button 
                    onClick={() => setResult(null)}
                    className="px-14 py-6 bg-[#B78D7D] text-white font-black rounded-[2rem] hover:bg-[#A37B6D] transition-all shadow-lg text-[11px] uppercase tracking-[0.4em] font-mono"
                  >
                    Retry Handshake
                  </button>
                </>
              )}
            </div>
          ) : (
            <form onSubmit={handleConnect} className="space-y-10">
              {error && (
                <div className="p-6 bg-rose-500/5 border border-rose-500/10 text-rose-500 text-xs font-black rounded-2xl flex items-center gap-4 animate-shake uppercase tracking-widest font-mono">
                  <AlertCircle size={22} />
                  {error}
                </div>
              )}

              {result?.status === "Checkpoint" ? (
                <div className="space-y-10 animate-in slide-in-from-top-4 duration-500">
                   <div className="p-8 bg-[#B78D7D]/5 border border-[#B78D7D]/10 rounded-[2.5rem] flex gap-6 items-center">
                      <div className="p-5 bg-white rounded-2xl text-[#B78D7D] border border-[#B78D7D]/10 shadow-sm">
                         <Lock size={26} />
                      </div>
                      <div>
                         <p className="text-xl font-black text-[#3E3A39] uppercase">Verification Matrix</p>
                         <p className="text-[10px] font-black text-[#8E7A70] mt-1 uppercase tracking-widest font-mono">Inject the secure code from your email.</p>
                      </div>
                   </div>

                   <div className="space-y-4">
                    <label className="text-[10px] font-black text-[#B2AAA6] uppercase tracking-[0.4em] ml-2 font-mono">Quantum Passcode</label>
                    <input
                      type="text"
                      value={twoFactorCode}
                      onChange={(e) => setTwoFactorCode(e.target.value)}
                      className="w-full bg-[#F8F4F2]/50 border border-[#B78D7D]/10 rounded-2xl px-10 py-6 text-center text-4xl font-black tracking-[0.8em] text-[#3E3A39] outline-none focus:border-[#B78D7D] transition-all font-mono shadow-sm"
                      placeholder="000000"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-[#B2AAA6] uppercase tracking-[0.4em] ml-2 font-mono">Your account name</label>
                      <div className="relative group">
                        <User size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-[#B2AAA6] group-focus-within:text-[#B78D7D] transition-colors" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-[#F8F4F2]/50 border border-[#B78D7D]/10 rounded-2xl pl-16 pr-8 py-5 text-sm font-bold text-[#3E3A39] outline-none focus:border-[#B78D7D] transition-all shadow-sm"
                          placeholder="Your username"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-[#B2AAA6] uppercase tracking-[0.4em] ml-2 font-mono">Your account password</label>
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
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-[#B2AAA6] uppercase tracking-[0.4em] ml-2 font-mono">Cookie Sequence (JSON)</label>
                    <textarea
                      value={cookies}
                      onChange={(e) => setCookies(e.target.value)}
                      className="w-full bg-[#F8F4F2]/50 border border-[#B78D7D]/10 rounded-[2.5rem] px-8 py-6 text-xs font-mono text-[#8E7A70] outline-none h-32 focus:border-[#B78D7D] transition-all shadow-sm resize-none custom-scrollbar"
                      placeholder='[{"domain": ".linkedin.com", ...}]'
                    />
                  </div>
                  
                  <div className="pt-10 border-t border-[#B78D7D]/10 space-y-8">
                    <div className="flex items-center gap-4 group cursor-pointer" onClick={() => setUseProxy(!useProxy)}>
                       <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${useProxy ? 'bg-[#B78D7D] border-[#B78D7D]' : 'border-[#B78D7D]/20 bg-white'}`}>
                          {useProxy && <CheckCircle size={14} className="text-white" />}
                       </div>
                       <span className="text-xs font-black text-[#8E7A70] uppercase tracking-widest font-mono group-hover:text-[#B78D7D] transition-colors">
                          Enable Proxy Tunnel
                       </span>
                    </div>

                    {useProxy && (
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-top-4 duration-500">
                          <div className="space-y-3">
                             <label className="text-[9px] font-black text-[#B2AAA6] uppercase tracking-[0.4em] font-mono ml-2">Relay Host</label>
                             <input
                                type="text"
                                value={proxyHost}
                                onChange={(e) => setProxyHost(e.target.value)}
                                className="w-full bg-white border border-[#B78D7D]/20 rounded-xl px-6 py-4 text-sm font-bold text-[#3E3A39] outline-none focus:border-[#B78D7D] shadow-sm"
                                placeholder="0.0.0.0"
                             />
                          </div>
                          <div className="space-y-3">
                             <label className="text-[9px] font-black text-[#B2AAA6] uppercase tracking-[0.4em] font-mono ml-2">Tunnel Port</label>
                             <input
                                type="text"
                                value={proxyPort}
                                onChange={(e) => setProxyPort(e.target.value)}
                                className="w-full bg-white border border-[#B78D7D]/20 rounded-xl px-6 py-4 text-sm font-bold text-[#3E3A39] outline-none focus:border-[#B78D7D] shadow-sm"
                                placeholder="8080"
                             />
                          </div>
                       </div>
                    )}
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#B78D7D] text-white py-6 rounded-[2rem] font-black text-lg shadow-[0_20px_40px_rgba(183,141,125,0.3)] hover:bg-[#A37B6D] transition-all disabled:opacity-50 flex items-center justify-center gap-5 active:scale-[0.98] border border-white/10 mt-8 uppercase tracking-[0.3em] font-mono text-[12px]"
              >
                {loading ? (
                  <>
                    <Loader2 size={24} className="animate-spin opacity-80" />
                    <span className="animate-pulse">Active Handshake...</span>
                  </>
                ) : (
                  <>
                    <Rocket size={24} />
                    <span>{result?.status === "Checkpoint" ? "Submit" : "Connect Account"}</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
        
        {/* Footer info */}
        <div className="p-10 bg-[#F8F4F2]/50 border-t border-[#B78D7D]/10 flex items-center justify-center gap-4">
           <Activity size={18} className="text-[#B78D7D]" />
           <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#B2AAA6] font-mono">End-to-End Encryption Enabled</span>
        </div>
      </div>
    </div>
  );
}
