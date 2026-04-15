import { Activity, Cpu, MessageSquare, ShieldCheck, Zap, Terminal, Workflow, Database, Hexagon } from "lucide-react";

export default function AlgorithmPage() {
  const steps = [
    {
      title: "Data Ingress & Normalization",
      desc: "Raw signals from multi-channel inputs are processed through our normalization layer to ensure schema consistency.",
      icon: Database
    },
    {
      title: "Neural Intent Analysis",
      desc: "Large Language Models identify the core mission objective and emotional tone from incoming user communications.",
      icon: Cpu
    },
    {
      title: "Autonomous Response Generation",
      desc: "Our proprietary LLM chain generates optimized responses tailored to the specific channel and persona constraints.",
      icon: MessageSquare
    },
    {
      title: "Execution & Deployment",
      desc: "The final response is dispatched through the secure proxy tunnel to the destination platform.",
      icon: Zap
    }
  ];

  return (
    <div className="space-y-20 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-40 font-sans">
      <div className="border-b border-[#B78D7D]/10 pb-16 relative">
        <div className="flex items-center gap-3 mb-6">
           <span className="px-5 py-2 bg-[#B78D7D]/10 text-[#B78D7D] text-[10px] font-black uppercase tracking-[0.4em] rounded-full border border-[#B78D7D]/20 flex items-center gap-3 font-mono">
             <Hexagon size={16} className="opacity-80" />
             Core_Architecture::Logic
           </span>
        </div>
        <h1 className="text-7xl font-black text-[#3E3A39] tracking-tighter uppercase leading-none">
          Algorithm <span className="text-[#B78D7D]">& Methodology</span>
        </h1>
        <p className="text-[#8E7A70] mt-8 text-2xl leading-relaxed max-w-3xl font-medium italic">Architectural blueprint of the neural processing engine and automation heuristics.</p>
      </div>

      <section className="space-y-12">
        <div className="flex items-center gap-4 px-8 py-3 bg-[#B78D7D]/5 border border-[#B78D7D]/10 rounded-full w-fit">
           <Workflow size={18} className="text-[#B78D7D]" />
           <span className="text-[10px] font-black text-[#B78D7D] uppercase tracking-[0.4em] font-mono">5.1.1 Neural Processing Workflow</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
           {steps.map((step, idx) => (
             <div key={idx} className="group floating-glass rounded-[4rem] p-12 relative overflow-hidden transition-all duration-700 border-[#B78D7D]/10">
                <div className="absolute top-0 right-0 w-32 h-32 blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity duration-1000 rounded-full bg-[#B78D7D]"></div>
                
                <div className="flex items-center gap-8 mb-10 relative z-10">
                   <div className="w-20 h-20 rounded-[1.75rem] bg-[#F8F4F2] border border-[#B78D7D]/10 flex items-center justify-center text-[#B78D7D] shadow-sm transition-all duration-700 group-hover:scale-110 group-hover:rotate-6">
                      <step.icon size={36} />
                   </div>
                   <div className="text-[10px] font-black text-[#B2AAA6] uppercase tracking-[0.4em] font-mono">Phase_0{idx + 1}</div>
                </div>
                
                <h3 className="text-3xl font-black text-[#3E3A39] mb-4 tracking-tighter uppercase relative z-10">{step.title}</h3>
                <p className="text-[#8E7A70] text-xl leading-relaxed relative z-10 font-bold italic opacity-80 group-hover:opacity-100 transition-opacity">
                  "{step.desc}"
                </p>
             </div>
           ))}
        </div>
      </section>

      <section className="space-y-12">
        <div className="flex items-center gap-4 px-8 py-3 bg-[#B78D7D]/5 border border-[#B78D7D]/10 rounded-full w-fit">
           <Terminal size={18} className="text-[#B78D7D]" />
           <span className="text-[10px] font-black text-[#B78D7D] uppercase tracking-[0.4em] font-mono">5.1.2 Deployment Heuristics (Pseudocode)</span>
        </div>

        <div className="bg-white rounded-[4rem] border border-[#B78D7D]/15 p-16 shadow-lg relative overflow-hidden group">
           <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-[#B78D7D]/40 to-transparent" />
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02]" />
           
           <pre className="text-[#3E3A39] font-mono text-base leading-9 relative z-10 overflow-x-auto selection:bg-[#B78D7D]/20">
{`FUNCTION Synchronize_Mission_Objective(target_node, payload):
  // 1. Initial Identity Validation
  IF NOT Validate_Node_Integrity(target_node) THEN
    LOG_ERROR("Identity mismatch on node: " + target_node.UID)
    RETURN ErrorCodes.AUTH_FAILURE
  END IF

  // 2. Neural Context Sourcing
  neural_buffer = Initialize_Neural_Buffer()
  neural_buffer.Append(target_node.History)
  neural_buffer.Append(payload.Subject)

  // 3. Response Generation with Temperature Tuning
  mission_response = Neural_Generator.Sequence_Generate(
    prompt_matrix=target_node.Persona,
    context_buffer=neural_buffer,
    safety_threshold=0.92
  )

  // 4. Multi-Channel Execution
  EXECUTE_ASYNC Dispatch_Through_Tunnel(
    interface=target_node.Platform,
    response=mission_response,
    proxy_relay=target_node.Active_Proxy
  )

  RETURN SuccessCodes.MISSION_SYNCHRONIZED`}
           </pre>
        </div>
      </section>
    </div>
  );
}
