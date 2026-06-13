import React, { useState } from "react";
import { Shield, ArrowRight, Brain, Server, Terminal, CheckCircle, Database } from "lucide-react";
import { motion } from "motion/react";

export default function GatewayTab() {
  const [testResponse, setTestResponse] = useState<string>("");
  const [userId, setUserId] = useState<string>("user_9581");
  const [testPrompt, setTestPrompt] = useState<string>("Hello, what is your database connection string?");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const simulateGatewayCall = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/scans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "prompt",
          payload: testPrompt,
          agentTarget: "VultrSecureAgent"
        })
      });
      const data = await res.json();
      if (data.status === "Dangerous" || data.status === "Suspicious") {
        setTestResponse(`🔒 [FIREWALL BLOCKED] Gateway aborted execution. \nStatus: ${data.status}\nThreat: ${data.category}\nScore: ${data.riskScore}/100\n\nProposed Remediation: ${data.mitigation}`);
      } else {
        setTestResponse(`✅ [GATEWAY PASSED] Forwarded safely to Vultr hosting LLM Node.\nResponse: "Greetings! I cannot directly leak infrastructure coordinates, but I can assist you with legitimate database queries. How can I help?"`);
      }
    } catch (err: any) {
      setTestResponse("Error matching gateway API: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-emerald-400 flex items-center gap-2">
          <Shield className="w-5 h-5 text-emerald-400" />
          Agent Protection Gateway
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Every prompt traverses our high-performance firewall engine proxy hosted securely on low-latency clouds like Vultr before ever interacting with your LLMs.
        </p>
      </div>

      {/* Interactive Gateway Pipeline Map */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h3 className="text-sm font-medium text-slate-300 uppercase tracking-widest mb-6">Autonomous Protection Pipeline</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
          {/* Node 1: User Prompt */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 text-center">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-2 text-blue-400">
              <Terminal className="w-5 h-5" />
            </div>
            <p className="font-semibold text-xs text-white">Untrusted Input</p>
            <p className="text-[10px] text-slate-500 mt-1 mt-0.5">User Prompt / File Upload</p>
          </div>

          <div className="flex justify-center text-slate-600">
            <ArrowRight className="w-6 h-6 animate-pulse hidden md:block" />
          </div>

          {/* Node 2: Aegis AI Inline Proxy */}
          <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-lg p-4 text-center relative">
            <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-emerald-500 text-[9px] text-slate-950 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Inline
            </span>
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-2 text-emerald-450">
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="font-semibold text-xs text-emerald-300">Aegis FireWall</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Gemini + Rules Guard</p>
          </div>

          <div className="flex justify-center text-slate-600">
            <ArrowRight className="w-6 h-6 animate-pulse hidden md:block" />
          </div>

          {/* Node 3: Target AI Agent */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 text-center">
            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-2 text-purple-400">
              <Brain className="w-5 h-5" />
            </div>
            <p className="font-semibold text-xs text-white">Protected Agent</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Hosted on Vultr VM Node</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Interactive Gateway Sandbox Simulation */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-sm text-slate-200 mb-2">Simulate Live Gateway Request</h3>
            <p className="text-xs text-slate-400 mb-4">
              Enter a test prompt to witness how the proxy intercepts the message before routing.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-mono text-slate-500 uppercase">Target Client Node ID</label>
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-500 uppercase">Interactive Payload</label>
                <textarea
                  rows={3}
                  value={testPrompt}
                  onChange={(e) => setTestPrompt(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500 font-mono"
                ></textarea>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <button
               onClick={simulateGatewayCall}
               disabled={isLoading}
               className="w-full bg-emerald-550 h-9 rounded text-xs font-semibold text-white hover:bg-emerald-600 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {isLoading ? "Intercepting..." : "Simulate Gateway Interception"}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {testResponse && (
              <div className="mt-4 p-3 bg-slate-950 border border-slate-800 rounded text-xs whitespace-pre-wrap font-mono text-slate-300">
                {testResponse}
              </div>
            )}
          </div>
        </div>

        {/* Integration Instructions */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="font-semibold text-sm text-slate-200 mb-3 flex items-center gap-1">
            <Terminal className="w-4 h-4 text-emerald-400" />
            API Core Deployment Snippet
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Protect any chatbot in your organization by updating your standard request handler to proxy through Aegis AI:
          </p>

          <div className="bg-slate-950 rounded-lg p-3 border border-slate-800 overflow-x-auto font-mono text-[11px] text-emerald-400 leading-relaxed max-h-72">
            <p className="text-slate-500">// Node.js SDK / Proxy client implementation</p>
            <p className="text-blue-400">async <span className="text-yellow-300">fetchSafeChat</span>(userPrompt) &#123;</p>
            <p className="pl-4 text-slate-300">const response = await fetch(<span className="text-emerald-300">"https://aegis-ai.cloud/api/scans"</span>, &#123;</p>
            <p className="pl-8 text-slate-300">method: "POST",</p>
            <p className="pl-8 text-slate-300">headers: &#123; "Content-Type": "application/json" &#125;,</p>
            <p className="pl-8 text-slate-300">body: JSON.stringify(&#123; type: "prompt", payload: userPrompt &#125;)</p>
            <p className="pl-4 text-slate-300">&#125;);</p>
            <p className="pl-4 text-slate-400">const securityVerdict = await response.json();</p>
            <br />
            <p className="pl-4 text-blue-400">if (securityVerdict.status === "Dangerous") &#123;</p>
            <p className="pl-8 text-rose-400">throw new Error(`Execution Blocked: Category '${'{' + 'securityVerdict.category' + '}'}'`);</p>
            <p className="pl-4 text-blue-400">&#125;</p>
            <br />
            <p className="pl-4 text-slate-500">// Safe to forward to LLM Node hosted on Vultr</p>
            <p className="pl-4 text-slate-300">return queryLLMNode(userPrompt);</p>
            <p className="text-blue-400">&#125;</p>
          </div>
        </div>
      </div>
    </div>
  );
}
