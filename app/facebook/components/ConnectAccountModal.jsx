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
  Smartphone
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
    <div className="fixed inset-0 bg-gray-900/60 flex items-center justify-center z-[100] p-4 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-white animate-in zoom-in duration-300">
        
        {/* Modal Header */}
        <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-blue-50/30">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-[#1877F2] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <Facebook size={24} fill="currentColor" />
             </div>
             <div>
                <h2 className="text-xl font-bold text-gray-900 tracking-tight">Connect Facebook</h2>
                <p className="text-xs font-medium text-[#1877F2] mt-0.5">Secure Login Assistant</p>
             </div>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-white rounded-xl transition-all border border-transparent hover:border-gray-100 text-gray-400 hover:text-gray-900">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 md:p-10">
          {result && result.status !== "Checkpoint" && result.status !== "AppConfirmation" ? (
            <div className="text-center py-10 animate-in slide-in-from-bottom duration-500">
              {result.status === "Connected" ? (
                <>
                  <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner animate-bounce">
                    <CheckCircle size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Connected successfully!</h3>
                  <p className="text-gray-500 text-sm font-medium">Your Facebook account is now linked and ready for use.</p>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 bg-red-50 text-red-500 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <AlertCircle size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Login Failed</h3>
                  <p className="text-red-500 font-medium mb-8 text-sm">{result.reason}</p>
                  <button 
                    onClick={() => setResult(null)}
                    className="px-8 py-4 bg-gray-900 text-white font-bold text-xs uppercase tracking-wider rounded-2xl hover:bg-gray-800 transition-all shadow-xl"
                  >
                    Try Again
                  </button>
                </>
              )}
            </div>
          ) : (
            <form onSubmit={handleConnect} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-xs font-semibold rounded-2xl flex items-center gap-3 animate-in slide-in-from-top">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              {result?.status === "Checkpoint" ? (
                <div className="space-y-6 animate-in slide-in-from-top-4 duration-500">
                   <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl flex gap-4 items-start">
                      <div className="p-2 bg-white rounded-xl text-[#1877F2] shadow-sm">
                         <Lock size={18} />
                      </div>
                      <div>
                         <p className="text-sm font-bold text-gray-900">Security Code Required</p>
                         <p className="text-xs font-medium text-gray-500 mt-0.5">Please enter the security code sent to your device.</p>
                      </div>
                   </div>

                   <div className="space-y-2">
                    <div className="flex items-center gap-2 ml-1">
                       <ShieldCheck size={14} className="text-[#1877F2]" />
                       <label className="text-xs font-semibold text-gray-500">Security Code</label>
                    </div>
                    <input
                      type="text"
                      value={twoFactorCode}
                      onChange={(e) => setTwoFactorCode(e.target.value)}
                      className="w-full bg-blue-50/30 border border-blue-100 rounded-2xl px-6 py-4 text-center text-2xl font-bold tracking-[0.5em] text-gray-900 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 focus:bg-white transition-all shadow-sm"
                      placeholder="000000"
                    />
                  </div>
                </div>
              ) : result?.status === "AppConfirmation" ? (
                <div className="space-y-6 animate-in slide-in-from-top-4 duration-500">
                   <div className="p-4 bg-[#F0F7FF] border border-blue-100 rounded-2xl flex gap-4 items-start">
                      <div className="p-2 bg-white rounded-xl text-blue-600 shadow-sm">
                         <Smartphone size={18} />
                      </div>
                      <div>
                         <p className="text-sm font-bold text-gray-900">App Confirmation</p>
                         <p className="text-xs font-medium text-gray-500 mt-0.5">Please open your Facebook app and approve this login request.</p>
                      </div>
                   </div>
                   
                   <div className="py-2 text-center">
                      <div className="inline-block px-4 py-2 bg-blue-50 text-blue-700 text-xs font-bold rounded-full animate-pulse">
                         Waiting for your confirmation...
                      </div>
                   </div>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 ml-1">
                       <User size={14} className="text-[#1877F2]" />
                       <label className="text-xs font-semibold text-gray-500">Email Address</label>
                    </div>
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-medium text-gray-900 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 focus:bg-white transition-all shadow-sm"
                      placeholder="user@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 ml-1">
                       <Key size={14} className="text-[#1877F2]" />
                       <label className="text-xs font-semibold text-gray-500">Password</label>
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-medium text-gray-900 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 focus:bg-white transition-all shadow-sm"
                      placeholder="••••••••"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 ml-1">
                       <Terminal size={14} className="text-[#1877F2]" />
                       <label className="text-xs font-semibold text-gray-500">Optional: Cookies (JSON)</label>
                    </div>
                    <textarea
                      value={cookies}
                      onChange={(e) => setCookies(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-100 rounded-[1.5rem] px-6 py-4 text-xs font-mono text-gray-600 outline-none h-24 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 focus:bg-white transition-all shadow-sm resize-none"
                      placeholder='[{"domain": ".facebook.com", ...}]'
                    />
                  </div>
                </>
              )}

              <div className="pt-4 flex flex-col gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#1877F2] text-white py-4 rounded-2xl font-bold text-sm shadow-xl shadow-blue-500/20 hover:bg-[#166fe5] transition-all disabled:opacity-50 flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      {result?.status === "Checkpoint" ? "Verifying Code..." : result?.status === "AppConfirmation" ? "Syncing..." : "Logging in..."}
                    </>
                  ) : (
                    <>
                      <Rocket size={18} />
                      {result?.status === "Checkpoint" ? "Confirm Security Code" : result?.status === "AppConfirmation" ? "I've Approved on App" : "Connect Account"}
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
