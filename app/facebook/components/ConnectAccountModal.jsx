"use client";

import { useState, useEffect } from "react";
import { 
  X, 
  Facebook, 
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
  Smartphone,
  Activity,
  Hexagon
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
    
    if (result?.status !== "Checkpoint" && result?.status !== "AppConfirmation") {
        setResult(null);
    }

    try {
      const res = await fetch("/api/facebook/accounts", {
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
        if (data.status === "Checkpoint" || data.status === "AppConfirmation") {
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
      <div className="fixed inset-0 bg-[#161932]/20 backdrop-blur-[60px]" onClick={handleClose} />
      
      <div className="bg-[#FCF8FE] rounded-[4rem] shadow-[0_80px_160px_rgba(130, 69, 239,0.2)] w-full max-w-[1400px] overflow-hidden border border-[#8245EF]/20 relative z-10 animate-in zoom-in-95 duration-1000 my-auto group/modal">
        
        {/* Modal Header */}
        <div className="p-10 border-b border-[#8245EF]/10 flex justify-between items-center bg-white/40">
          <div className="flex items-center gap-6">
             <div className="w-20 h-20 bg-white text-[#8245EF] rounded-[2rem] flex items-center justify-center shadow-lg border border-[#8245EF]/10 group-hover/modal:rotate-12 transition-transform duration-700">
                <Facebook size={36} fill="currentColor" />
             </div>
             <div>
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Facebook</h2>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Connect and manage your Facebook accounts.</p>
             </div>
          </div>
          <button onClick={handleClose} className="p-4 bg-white hover:bg-[#8245EF] group/close rounded-2xl transition-all border border-[#8245EF]/10 text-[#94a3b8] hover:text-white shadow-sm active:scale-90">
            <X size={28} className="group-hover/close:rotate-90 transition-transform duration-500" />
          </button>
        </div>

        <div className="p-12 custom-scrollbar max-h-[70vh] overflow-y-auto">
          {result && result.status !== "Checkpoint" && result.status !== "AppConfirmation" ? (
            <div className="text-center py-20 animate-in slide-in-from-bottom duration-500">
              {result.status === "Connected" ? (
                <>
                  <div className="w-32 h-32 bg-white text-emerald-500 rounded-[3rem] flex items-center justify-center mx-auto mb-10 shadow-xl border border-emerald-500/10 transition-transform duration-1000 hover:scale-110">
                    <CheckCircle size={56} />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight uppercase">Account Connected</h3>
                  <p className="text-gray-500 font-bold text-lg">Your Facebook account has been successfully connected.</p>
                </>
              ) : (
                <>
                  <div className="w-32 h-32 bg-rose-50 text-rose-500 rounded-[3rem] flex items-center justify-center mx-auto mb-10 shadow-inner border border-rose-500/20">
                    <AlertCircle size={56} />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight uppercase">Connection Failed</h3>
                  <p className="text-rose-500 font-bold mb-10 text-lg">{result.reason}</p>
                  <button 
                    onClick={() => setResult(null)}
                    className="px-12 py-5 bg-[#8245EF] text-white font-bold rounded-xl hover:bg-[#6d28d9] transition-all shadow-lg text-xs uppercase tracking-widest border border-white/10 active:scale-95"
                  >
                    Try Again
                  </button>
                </>
              )}
            </div>
          ) : (
            <form onSubmit={handleConnect} className="space-y-12">
              {error && (
                <div className="p-6 bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold rounded-2xl flex items-center gap-4 uppercase tracking-widest">
                  <AlertCircle size={24} />
                  {error}
                </div>
              )}

              {(result?.status === "Checkpoint") ? (
                <div className="space-y-12 animate-in slide-in-from-top-4 duration-500">
                   <div className="p-10 bg-white border border-[#8245EF]/10 rounded-[3rem] flex gap-8 items-center shadow-sm">
                      <div className="p-6 bg-[#FCF8FE] rounded-3xl text-[#8245EF] border border-[#8245EF]/10 shadow-inner">
                         <Lock size={32} />
                      </div>
                       <div>
                          <p className="text-2xl font-bold text-gray-900 tracking-tight">Security Check</p>
                          <p className="text-xs font-bold text-gray-400 mt-2 uppercase tracking-widest">Please enter the security code sent to your account.</p>
                       </div>
                   </div>

                   <div className="space-y-4 text-center">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Security Code</label>
                    <input
                      type="text"
                      value={twoFactorCode}
                      onChange={(e) => setTwoFactorCode(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-12 py-6 text-center text-5xl font-bold tracking-[1em] text-gray-900 outline-none focus:border-[#8245EF]/40 transition-all"
                      placeholder="000000"
                    />
                  </div>
                </div>
              ) : result?.status === "AppConfirmation" ? (
                <div className="space-y-12 animate-in slide-in-from-top-4 duration-500">
                   <div className="p-10 bg-white border border-[#8245EF]/10 rounded-[3rem] flex gap-8 items-center shadow-sm">
                      <div className="p-6 bg-[#FCF8FE] rounded-3xl text-[#8245EF] border border-[#8245EF]/10 shadow-inner">
                         <Smartphone size={32} />
                      </div>
                      <div>
                          <p className="text-2xl font-bold text-gray-900 tracking-tight">App Approval</p>
                          <p className="text-xs font-bold text-gray-400 mt-2 uppercase tracking-widest">Please open your Facebook app and approve the login request.</p>
                       </div>
                   </div>
                   
                   <div className="py-10 text-center relative">
                       <div className="inline-block px-10 py-5 bg-white text-[#8245EF] text-[11px] font-bold uppercase tracking-widest rounded-full border border-[#8245EF]/10 animate-pulse">
                          Waiting for approval...
                       </div>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 opacity-10">
                         <Activity size={240} className="text-[#8245EF] animate-spin-slow" />
                      </div>
                   </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-2">Email or Username</label>
                      <div className="relative group/input">
                         <User size={24} className="absolute left-8 top-1/2 -translate-y-1/2 text-[#94a3b8] group-focus-within/input:text-[#8245EF] transition-colors" />
                          <input
                           type="email"
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                           className="w-full bg-white border border-gray-100 rounded-2xl pl-16 pr-8 py-4 text-base font-bold text-gray-900 outline-none focus:border-[#8245EF]/40 transition-all shadow-sm placeholder:text-gray-300"
                           placeholder="Email or phone number"
                         />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-2">Password</label>
                      <div className="relative group/input">
                         <Key size={24} className="absolute left-8 top-1/2 -translate-y-1/2 text-[#94a3b8] group-focus-within/input:text-[#8245EF] transition-colors" />
                          <input
                           type="password"
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                           className="w-full bg-white border border-gray-100 rounded-2xl pl-16 pr-8 py-4 text-base font-bold text-gray-900 outline-none focus:border-[#8245EF]/40 transition-all shadow-sm placeholder:text-gray-300"
                           placeholder="••••••••••••"
                         />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-2">Login Cookies</label>
                    <textarea
                      value={cookies}
                      onChange={(e) => setCookies(e.target.value)}
                      className="w-full bg-white border border-gray-100 rounded-2xl px-8 py-6 text-xs font-bold text-gray-500 outline-none h-32 focus:border-[#8245EF]/40 transition-all shadow-sm resize-none"
                      placeholder='Paste your JSON cookies here (optional)...'
                    />
                  </div>
                  
                   {/* Proxy Matrix */}
                   <div className="pt-10 border-t border-[#8245EF]/10 space-y-10">
                     <div className="flex items-center gap-4 group cursor-pointer" onClick={() => setUseProxy(!useProxy)}>
                       <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${useProxy ? 'bg-[#8245EF] border-[#8245EF]' : 'border-gray-200 bg-white'}`}>
                          {useProxy && <CheckCircle size={14} className="text-white" />}
                       </div>
                       <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                          Use Proxy
                       </span>
                    </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-top-4 duration-500">
                           <div className="space-y-2">
                              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-2">Host</label>
                              <input
                                 type="text"
                                 value={proxyHost}
                                 onChange={(e) => setProxyHost(e.target.value)}
                                 className="w-full bg-gray-50 border border-gray-100 rounded-xl px-6 py-3 text-sm font-bold text-gray-900 outline-none focus:border-[#8245EF]/40"
                                 placeholder="0.0.0.0"
                              />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-2">Port</label>
                              <input
                                 type="text"
                                 value={proxyPort}
                                 onChange={(e) => setProxyPort(e.target.value)}
                                 className="w-full bg-gray-50 border border-gray-100 rounded-xl px-6 py-3 text-sm font-bold text-gray-900 outline-none focus:border-[#8245EF]/40"
                                 placeholder="8080"
                              />
                           </div>
                        </div>
                   </div>
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#8245EF] text-white py-6 rounded-2xl font-bold text-base shadow-lg hover:bg-[#6d28d9] transition-all disabled:opacity-50 flex items-center justify-center gap-4 active:scale-[0.98] mt-8"
              >
                {loading ? (
                  <>
                    <Loader2 size={24} className="animate-spin" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <Rocket size={24} />
                    <span>{result?.status === "Checkpoint" ? "Submit" : result?.status === "AppConfirmation" ? "Confirm" : "Connect Account"}</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
        
        {/* Footer info */}
         <div className="p-8 bg-gray-50/50 border-t border-gray-100 flex items-center justify-center gap-4 relative">
            <Activity size={20} className="text-[#8245EF] animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">SECURE CONNECTION</span>
         </div>

        {/* Branding Decoration */}
        <div className="absolute top-1/2 left-10 -translate-y-1/2 opacity-[0.03] pointer-events-none -z-10 grayscale group-hover/modal:opacity-[0.06] transition-opacity duration-1000">
           <Hexagon size={240} strokeWidth={1} className="text-[#8245EF] animate-spin-slow" />
        </div>
      </div>
    </div>
  );
}
