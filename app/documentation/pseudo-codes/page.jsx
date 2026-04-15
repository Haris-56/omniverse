import { Terminal, Code, Cpu, ShieldCheck, Zap, Hexagon } from "lucide-react";

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
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-5 duration-1000 pb-32 font-sans">
      
      {/* Header Sector */}
      <div className="border-b border-[#B78D7D]/15 pb-12 relative">
        <div className="absolute -left-8 top-1.5 w-1.5 h-12 bg-[#B78D7D] rounded-full shadow-sm"></div>
        <h1 className="text-5xl font-black text-[#3E3A39] tracking-tighter uppercase leading-tight flex items-center gap-6">
          <Terminal className="text-[#B78D7D]" size={48} />
          Project_<span className="text-[#B78D7D]">Pseudo_Codes</span>
        </h1>
        <p className="text-[#8E7A70] mt-4 text-xl font-bold leading-relaxed max-w-3xl italic">
          High-level algorithmic representations of the core Omniverse engines. Use these as a reference for architectural logic and workflow implementation.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-20">
        {sections.map((section, idx) => (
          <div key={idx} className="group relative">
            <div className="flex flex-col lg:flex-row items-start gap-12">
               <div className="mt-2 p-5 rounded-[2rem] bg-white border border-[#B78D7D]/15 text-[#B78D7D] group-hover:bg-[#B78D7D] group-hover:text-white transition-all duration-700 shadow-sm group-hover:shadow-[0_20px_40px_rgba(183,141,125,0.2)] group-hover:rotate-6">
                  <section.icon size={36} />
               </div>
               <div className="flex-1 space-y-8 w-full">
                  <div>
                    <h2 className="text-3xl font-black text-[#3E3A39] tracking-tight uppercase leading-none">{section.title}</h2>
                    <p className="text-[#8E7A70] mt-4 text-lg font-bold italic leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity whitespace-pre-wrap">"{section.description}"</p>
                  </div>
                  
                  <div className="relative rounded-[3rem] border border-[#B78D7D]/15 bg-white overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-700">
                    <div className="absolute top-0 left-0 right-0 h-14 bg-[#F8F4F2] flex items-center px-8 justify-between border-b border-[#B78D7D]/10">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-rose-500/20"></div>
                            <div className="w-3 h-3 rounded-full bg-amber-500/20"></div>
                            <div className="w-3 h-3 rounded-full bg-emerald-500/20"></div>
                        </div>
                        <span className="text-[10px] font-black font-mono text-[#B2AAA6] uppercase tracking-[0.4em] italic">Protocol_Snippet_v4.0</span>
                    </div>
                    
                    <pre className="p-10 pt-20 overflow-x-auto custom-scrollbar bg-white">
                      <code className="text-[#5E5A59] font-mono text-base font-bold leading-8 block selection:bg-[#B78D7D]/10">
                        {section.pseudoCode.trim()}
                      </code>
                    </pre>

                    <div className="absolute inset-0 opacity-[0.01] pointer-events-none group-hover:opacity-[0.02] transition-opacity bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                  </div>
               </div>
            </div>
          </div>
        ))}
      </div>

       {/* Global Branding Watermark */}
       <div className="fixed bottom-10 right-10 pointer-events-none opacity-[0.03] select-none z-[-1] grayscale">
         <div className="flex flex-col items-end gap-10">
            <h1 className="text-[14rem] font-black font-sans tracking-tighter uppercase leading-none text-[#B78D7D]">PSEUDO</h1>
            <div className="flex items-center gap-10">
               <Hexagon size={80} strokeWidth={2} className="text-[#B78D7D]" />
               <p className="text-4xl font-black uppercase tracking-[1em] text-[#B78D7D] font-mono">LOGIC_MATRIX</p>
            </div>
         </div>
      </div>
    </div>
  );
}
