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
      <div className="fixed inset-0 bg-[#161932]/20 backdrop-blur-[60px]" onClick={handleClose} />
      
      <div className="bg-white rounded-[4rem] shadow-[0_80px_160px_rgba(130, 69, 239,0.2)] w-full max-w-[1400px] overflow-hidden border border-[#8245EF]/20 relative z-10 animate-in zoom-in-95 duration-1000 my-auto">
        
        {/* Modal Header */}
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-white text-[#8245EF] rounded-xl flex items-center justify-center shadow-sm border border-gray-100">
                <Linkedin size={24} fill="currentColor" />
             </div>
             <div>
                <h2>LinkedIn</h2>
                <p className="text-sm">Add your social accounts here.</p>
             </div>
          </div>
          <button onClick={handleClose} className="p-3 bg-white hover:bg-gray-50 rounded-xl transition-all border border-gray-200 text-gray-400">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 custom-scrollbar max-h-[70vh] overflow-y-auto">
          {result && result.status !== "Checkpoint" ? (
            <div className="text-center py-12 animate-in slide-in-from-bottom duration-500">
              {result.status === "Connected" ? (
                <>
                  <div className="w-20 h-20 bg-green-50 text-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={40} />
                  </div>
                  <h3>Account Connected</h3>
                  <p className="font-bold text-gray-600">Your LinkedIn account is now connected.</p>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <AlertCircle size={40} />
                  </div>
                  <h3>Connection Error</h3>
                  <p className="text-rose-500 font-bold mb-8">{result.reason}</p>
                  <button 
                    onClick={() => setResult(null)}
                    className="px-8 py-3 bg-[#8245EF] text-white font-bold rounded-xl hover:bg-[#6d28d9] transition-all shadow-md text-sm"
                  >
                    Try Again
                  </button>
                </>
              )}
            </div>
          ) : (
            <form onSubmit={handleConnect} className="space-y-8">
              {error && (
                <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 text-sm font-bold rounded-xl flex items-center gap-3 animate-shake">
                  <AlertCircle size={18} />
                  {error}
                </div>
              )}

              {result?.status === "Checkpoint" ? (
                <div className="space-y-8 animate-in slide-in-from-top-4 duration-500">
                   <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl flex gap-4 items-center">
                      <div className="p-3 bg-white rounded-xl text-blue-600 shadow-sm">
                         <Lock size={20} />
                      </div>
                      <div>
                         <p className="font-bold text-gray-900">Security Check</p>
                         <p className="text-xs text-gray-500">Type the code we sent to your email.</p>
                      </div>
                   </div>

                   <div className="space-y-2">
                    <label>Security Code</label>
                    <input
                      type="text"
                      value={twoFactorCode}
                      onChange={(e) => setTwoFactorCode(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-6 py-4 text-center text-3xl font-bold text-gray-900 outline-none focus:border-[#8245EF] transition-all"
                      placeholder="000000"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label>Your email</label>
                      <div className="relative">
                        <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="form-input pl-12"
                          placeholder="Your email address"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label>Your password</label>
                      <div className="relative">
                        <Key size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="form-input pl-12"
                          placeholder="Your secret password"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label>Login Cookies (JSON)</label>
                    <textarea
                      value={cookies}
                      onChange={(e) => setCookies(e.target.value)}
                      className="form-input h-24 resize-none text-xs font-mono"
                      placeholder='[{"domain": ".linkedin.com", ...}]'
                    />
                  </div>
                  
                  <div className="pt-6 border-t border-gray-100 space-y-6">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => setUseProxy(!useProxy)}>
                       <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${useProxy ? 'bg-[#8245EF] border-[#8245EF]' : 'border-gray-300 bg-white'}`}>
                          {useProxy && <CheckCircle size={12} className="text-white" />}
                       </div>
                       <span className="text-sm font-bold text-gray-600">
                          Use a Proxy
                       </span>
                    </div>

                    {useProxy && (
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-top-4 duration-500">
                          <div className="space-y-1">
                             <label className="text-xs">Proxy Address</label>
                             <input
                                type="text"
                                value={proxyHost}
                                onChange={(e) => setProxyHost(e.target.value)}
                                className="form-input py-2"
                                placeholder="0.0.0.0"
                             />
                          </div>
                          <div className="space-y-1">
                             <label className="text-xs">Proxy Port</label>
                             <input
                                type="text"
                                value={proxyPort}
                                onChange={(e) => setProxyPort(e.target.value)}
                                className="form-input py-2"
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
                className="w-full bg-[#8245EF] text-white py-4 rounded-xl font-bold text-base shadow-lg hover:bg-[#6d28d9] transition-all disabled:opacity-50 flex items-center justify-center gap-3 active:scale-[0.98] mt-4"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <Rocket size={20} />
                    <span>{result?.status === "Checkpoint" ? "Submit" : "Connect Account"}</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
        
        {/* Footer info */}
        <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-center gap-2">
           <Activity size={14} className="text-[#8245EF]" />
           <span className="text-xs font-bold text-gray-400">Your data is safe</span>
        </div>
      </div>
    </div>
  );
}
