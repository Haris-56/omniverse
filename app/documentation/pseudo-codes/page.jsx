import { Terminal, Code, Cpu, ShieldCheck, Zap } from "lucide-react";

export default function PseudoCodesPage() {
  const sections = [
    {
      title: "Email Automation Engine",
      icon: Code,
      description: "The core logic responsible for scheduling and dispatching cold email sequences with ramp-up and jitter protection.",
      pseudoCode: `
FUNCTION EmailSchedulerTick():
    FOR EACH active_campaign IN Database:
        IF current_time NOT IN campaign.schedule_window:
            CONTINUE
            
        current_daily_count = GetSentCountToday(campaign.id)
        limit_with_jitter = ApplyJitter(campaign.daily_limit, 0.1)
        
        IF current_daily_count >= limit_with_jitter:
            LOG "Daily limit reached for campaign"
            CONTINUE
            
        pending_contacts = GetNextBatch(campaign.id, batch_size=10)
        
        FOR EACH contact IN pending_contacts:
            email_payload = Personalize(campaign.template, contact)
            PushToBullMQ("send-email", {
                account_id: campaign.account_id,
                to: contact.email,
                content: email_payload
            })
            MarkContactAsQueued(contact.id)
      `
    },
    {
      title: "Social Automation Worker",
      icon: Cpu,
      description: "Handles browser-based automation for LinkedIn, Instagram, and Facebook using stealth drivers and humanoid behavior simulation.",
      pseudoCode: `
FUNCTION SocialWorkerLoop():
    WHILE system_is_active:
        tasks = Database.FetchPendingSocialTasks(batch=5)
        
        FOR EACH task IN tasks:
            proxy = ProxyAllocator.Get(task.account_id)
            browser = StealthBrowser.Launch(proxy)
            
            TRY:
                browser.NavigateTo(task.platform_url)
                Humanoid.RandomDelay(2000, 5000) // Mimic human wait
                
                IF task.action == "CONNECT":
                    LinkedInEngine.SendConnection(browser, task.lead_url)
                ELSE IF task.action == "MESSAGE":
                    InstagramEngine.SendDM(browser, task.lead_url, task.text)
                
                LogSuccess(task.id)
            CATCH Error:
                HandleAutomationError(Error, task.id)
            FINALLY:
                browser.Close()
                
        Sleep(5_MINUTES) // Prevent aggressive footprinting
      `
    },
    {
      title: "AI Response Agent",
      icon: Zap,
      description: "Generates contextual and personalized replies based on lead interaction history and configured brand personas.",
      pseudoCode: `
FUNCTION GenerateAIResponse(lead_message, history, persona_id):
    persona = Database.GetPersona(persona_id)
    system_prompt = ConstructPrompt(persona.tone, persona.goals)
    
    context = history.map(m => m.role + ": " + m.text).join("\\n")
    
    ai_request = {
        model: "gpt-4o",
        messages: [
            { role: "system", content: system_prompt },
            { role: "user", content: \`Lead said: \${lead_message}. History: \${context}\` }
        ]
    }
    
    response = OpenAI.CreateCompletion(ai_request)
    RETURN CleanseResponse(response.text)
      `
    },
    {
      title: "Proxy Allocation Logic",
      icon: ShieldCheck,
      description: "Ensures each social account is tied to a unique residential IP to prevent multi-account flagging.",
      pseudoCode: `
FUNCTION AllocateProxy(account_id, platform):
    existing_assignment = Database.FindProxyForAccount(account_id)
    
    IF existing_assignment AND existing_assignment.hasCapacity(platform):
        RETURN existing_assignment
        
    FOR EACH proxy IN ProxyPool:
        IF proxy.isResidential AND proxy.currentLoad < MAX_LOAD:
            Database.Bind(proxy.id, account_id, platform)
            RETURN proxy
            
    THROW Error("No available residential proxies. Expand proxy pool.")
      `
    }
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="border-b border-white/10 pb-8 relative group">
        <div className="absolute -left-8 top-2 w-1 h-12 bg-indigo-500 rounded-r-lg shadow-[0_0_15px_rgba(99,102,241,0.6)]"></div>
        <h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-4">
          <Terminal className="text-indigo-400" size={36} />
          Project Pseudo Codes
        </h1>
        <p className="text-slate-400 mt-3 text-lg leading-relaxed max-w-2xl">
          High-level algorithmic representations of the core Omniverse engines. Use these as a reference for architectural logic and workflow implementation.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12">
        {sections.map((section, idx) => (
          <div key={idx} className="group relative">
            <div className="flex items-start gap-6">
               <div className="mt-1 p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500/20 group-hover:border-indigo-500/40 transition-all duration-300">
                  <section.icon size={24} />
               </div>
               <div className="flex-1 space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">{section.title}</h2>
                    <p className="text-slate-400 mt-1 leading-relaxed">{section.description}</p>
                  </div>
                  
                  <div className="relative rounded-2xl border border-white/5 bg-[#050505] overflow-hidden shadow-2xl">
                    <div className="absolute top-0 left-0 right-0 h-10 bg-white/5 flex items-center px-4 justify-between border-b border-white/5">
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/40"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/40"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/40"></div>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Pseudo Code</span>
                    </div>
                    <pre className="p-8 pt-14 overflow-x-auto custom-scrollbar">
                      <code className="text-indigo-300/90 font-mono text-sm leading-relaxed block">
                        {section.pseudoCode.trim()}
                      </code>
                    </pre>
                  </div>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
