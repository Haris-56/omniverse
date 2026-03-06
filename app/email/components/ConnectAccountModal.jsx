"use client";

import { useState } from "react";
import { 
  X, Mail, Loader2, AlertCircle, CheckCircle, 
  ShieldCheck, Send, Lock
} from "lucide-react";

export default function ConnectAccountModal({ isOpen, onClose, onAccountConnected }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  
  const [formData, setFormData] = useState({
    provider: 'gmail', // gmail, outlook, custom
    email: '',
    password: '',
    smtpHost: '',
    smtpPort: '',
    smtpSecure: true, 
    testEmail: '' // Test email address
  });

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const setProvider = (provider) => {
    setFormData(prev => ({ ...prev, provider: provider }));
  };

  const handleConnect = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    // Default test email if empty
    const payload = { 
      ...formData, 
      testEmail: formData.testEmail || "haris.bin.ahson@gmail.com",
      // Set reasonable defaults for limits since we removed them from UI
      dailyLimit: 50,
      hourlyLimit: 10,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      warmupEnabled: false, 
      trackingOpen: true, 
      trackingClick: true
    };

    try {
      const res = await fetch("/api/email/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to connect");
      }
      
      if (data.status === "Connected") {
         setResult({ status: "Connected" });
         setTimeout(() => {
           onAccountConnected();
           handleClose();
         }, 2000);
      } else {
        let reason = data.failureReason || "Unknown Error";
        // Friendly error for Gmail/Outlook auth
        if (reason.includes("535") || reason.includes("Username and Password not accepted")) {
           reason = "Invalid Credentials. If using Gmail/Outlook, you MUST use an 'App Password', not your login password. Please generate one in your account security settings.";
        }
        setResult({ status: "Failed", reason });
      }

    } catch (err) {
      // Check for 535 in the thrown error message as well
      let errorMessage = err.message;
      if (errorMessage.includes("535") || errorMessage.includes("Username and Password not accepted")) {
         errorMessage = "Invalid Credentials. If using Gmail/Outlook, you MUST use an 'App Password', not your login password. Please generate one in your account security settings.";
         setResult({ status: "Failed", reason: errorMessage });
      } else {
         setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setResult(null);
    setError("");
    setFormData({
      provider: 'gmail',
      email: '',
      password: '',
      smtpHost: '',
      smtpPort: '',
      smtpSecure: true,
      testEmail: ''
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-900/60 flex items-center justify-center z-[100] p-4 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl overflow-hidden border border-white flex flex-col md:flex-row max-h-[90vh]">
        
        {/* Left Sidebar - Options */}
        <div className="w-full md:w-1/3 bg-gray-50/80 border-r border-gray-100 p-8 flex flex-col justify-between">
           <div>
             <h2 className="text-xl font-black text-gray-900 tracking-tight mb-8 flex items-center gap-2">
               <Send className="text-indigo-600" size={24} />
               Connect Source
             </h2>
             
             <div className="space-y-3">
               <button 
                 onClick={() => setProvider('gmail')}
                 className={`w-full text-left px-5 py-4 rounded-2xl border transition-all flex items-center justify-between group ${formData.provider === 'gmail' ? 'bg-white border-indigo-200 shadow-xl shadow-indigo-100 ring-1 ring-indigo-50' : 'bg-transparent border-transparent hover:bg-white hover:border-gray-200'}`}
               >
                 <span className={`font-bold text-sm ${formData.provider === 'gmail' ? 'text-gray-900' : 'text-gray-500'}`}>Google Gmail</span>
                 {formData.provider === 'gmail' && <CheckCircle size={16} className="text-indigo-600" />}
               </button>
               
               <button 
                 onClick={() => setProvider('outlook')}
                 className={`w-full text-left px-5 py-4 rounded-2xl border transition-all flex items-center justify-between group ${formData.provider === 'outlook' ? 'bg-white border-indigo-200 shadow-xl shadow-indigo-100 ring-1 ring-indigo-50' : 'bg-transparent border-transparent hover:bg-white hover:border-gray-200'}`}
               >
                 <span className={`font-bold text-sm ${formData.provider === 'outlook' ? 'text-gray-900' : 'text-gray-500'}`}>Microsoft Outlook</span>
                 {formData.provider === 'outlook' && <CheckCircle size={16} className="text-indigo-600" />}
               </button>
               
               <button 
                 onClick={() => setProvider('custom')}
                 className={`w-full text-left px-5 py-4 rounded-2xl border transition-all flex items-center justify-between group ${formData.provider === 'custom' ? 'bg-white border-indigo-200 shadow-xl shadow-indigo-100 ring-1 ring-indigo-50' : 'bg-transparent border-transparent hover:bg-white hover:border-gray-200'}`}
               >
                 <span className={`font-bold text-sm ${formData.provider === 'custom' ? 'text-gray-900' : 'text-gray-500'}`}>Custom SMTP</span>
                 {formData.provider === 'custom' && <CheckCircle size={16} className="text-indigo-600" />}
               </button>
             </div>
           </div>

           <div className="mt-8 p-5 bg-indigo-50/50 rounded-2xl border border-indigo-50/50">
             <div className="flex items-start gap-3">
                <ShieldCheck size={18} className="text-indigo-600 shrink-0 mt-0.5" />
                <div>
                   <p className="text-[10px] font-black text-indigo-900 uppercase tracking-widest mb-1">Secure Encryption</p>
                   <p className="text-[11px] text-indigo-700/80 leading-relaxed font-medium">
                     Credentials are encrypted using AES-256 before storage. We verify connection immediately upon setup.
                   </p>
                </div>
             </div>
           </div>
        </div>

        {/* Right Content - Form */}
        <div className="flex-1 p-8 md:p-10 overflow-y-auto bg-white scrollbar-hide">
           <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-black text-gray-900">
                {formData.provider === 'custom' ? 'SMTP Configuration' : `${formData.provider === 'gmail' ? 'Google' : 'Outlook'} Credentials`}
              </h3>
              <button onClick={handleClose} className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-400 hover:text-gray-900">
                <X size={20} />
              </button>
           </div>
           
           {result ? (
               <div className="flex flex-col items-center justify-center h-64 text-center animate-in zoom-in duration-300">
                  {result.status === "Connected" ? (
                    <>
                      <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-4 animate-bounce">
                        <CheckCircle size={40} />
                      </div>
                      <h4 className="text-2xl font-black text-gray-900 mb-2">Connected Successfully!</h4>
                      <p className="text-gray-500 font-medium">Your email account is ready for campaigns.</p>
                      <p className="text-xs text-gray-400 mt-2">Test email sent to verification address.</p>
                    </>
                  ) : (
                    <>
                      <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                        <AlertCircle size={40} />
                      </div>
                      <h4 className="text-2xl font-black text-gray-900 mb-2">Connection Failed</h4>
                      <p className="text-red-500 font-medium mb-6 px-4">{result.reason}</p>
                      <button 
                        onClick={() => setResult(null)}
                        className="px-6 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold shadow-lg"
                      >
                        Try Again
                      </button>
                    </>
                  )}
               </div>
           ) : (
           <form onSubmit={handleConnect} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                 <div className="col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input 
                        required
                        type="email" 
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all"
                        placeholder="you@company.com"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                      />
                    </div>
                 </div>

                 <div className="col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
                      {formData.provider === 'gmail' || formData.provider === 'outlook' ? 'App Password' : 'Password'}
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input 
                        required
                        type="password" 
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all"
                        placeholder="••••••••••••"
                        value={formData.password}
                        onChange={(e) => handleChange('password', e.target.value)}
                      />
                    </div>
                    {(formData.provider === 'gmail' || formData.provider === 'outlook') && (
                      <p className="text-[10px] text-gray-400 px-1 font-medium">Use an <a href="https://myaccount.google.com/apppasswords" target="_blank" className="text-indigo-600 underline">App Password</a>, not your login password.</p>
                    )}
                 </div>

                 {formData.provider === 'custom' && (
                   <>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">SMTP Host</label>
                        <input 
                          required
                          type="text" 
                          className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3.5 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all"
                          placeholder="smtp.example.com"
                          value={formData.smtpHost}
                          onChange={(e) => handleChange('smtpHost', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Port</label>
                        <input 
                          required
                          type="text" 
                          className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3.5 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all"
                          placeholder="587"
                          value={formData.smtpPort}
                          onChange={(e) => handleChange('smtpPort', e.target.value)}
                        />
                      </div>
                   </>
                 )}

                 {/* Test Email Section */}
                 <div className="col-span-2 pt-4 border-t border-gray-100 mt-2">
                    <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-4">Verification</h4>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Send Test Email To</label>
                      <input 
                        type="email" 
                        className="w-full bg-indigo-50/50 border border-indigo-100 rounded-2xl px-4 py-3.5 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all placeholder-indigo-300"
                        placeholder="haris.bin.ahson@gmail.com (Default)"
                        value={formData.testEmail}
                        onChange={(e) => handleChange('testEmail', e.target.value)}
                      />
                      <p className="text-[10px] text-gray-400 px-1 font-medium">We'll send a test email to verify credentials work.</p>
                    </div>
                 </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-2xl flex items-center gap-2">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <div className="flex gap-4 pt-2">
                <button 
                  type="button" 
                  onClick={onClose}
                  className="w-full py-4 bg-white border border-gray-200 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-gray-200 hover:bg-gray-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                   {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                   {loading ? 'Verifying...' : 'Verify & Connect'}
                </button>
              </div>
           </form>
           )}
        </div>
      </div>
    </div>
  );
}
