import React, { useState } from "react";
import { attackScenarios, SimulationScenario } from "../data/simulations";
import { PlayCircle, ShieldAlert, CheckCircle2, Volume2, AlertOctagon, Terminal } from "lucide-react";

interface SimulatorProps {
  onScanExecuted: () => void;
}

export default function AttackSimulatorTab({ onScanExecuted }: SimulatorProps) {
  const [activeSim, setActiveSim] = useState<SimulationScenario | null>(null);
  const [executionResult, setExecutionResult] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const speakAlert = async (category: string, riskScore: number) => {
    const speakText = `Aegis AI Alert. Dangerous code execution or Prompt injection detected! Category: ${category}. Risk score: ${riskScore} out of 100. Threat vector neutralized by proxy firewall.`;
    
    try {
      const res = await fetch("/api/elevenlabs/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: speakText })
      });
      
      const contentType = res.headers.get("Content-Type");
      if (contentType && contentType.includes("audio/mpeg")) {
        const audioBlob = await res.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        await audio.play();
        return;
      }
    } catch (err) {
      console.warn("ElevenLabs proxy fell back to browser vocal engine:", err);
    }

    // Dynamic browser Speech Synthesis Fallback if API key has not been entered yet!
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(speakText);
      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find(v => v.name.includes("Google") || v.name.includes("Female") || v.name.includes("Zira"));
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }
      utterance.rate = 1.01;
      utterance.pitch = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const executeSimulation = async (scenario: SimulationScenario) => {
    setIsLoading(true);
    setActiveSim(scenario);
    setExecutionResult(null);

    try {
      const res = await fetch("/api/scans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: scenario.type,
          payload: scenario.payload,
          isSimulated: true,
          agentTarget: "AegisSimulator"
        })
      });
      const data = await res.json();
      setExecutionResult(data);
      
      // Trigger Vocal Warning immediately if Dangerous
      if (data.status === "Dangerous") {
        speakAlert(data.category, data.riskScore);
      }

      // Notify parent to fetch fresh logs/stats on Dashboard automatically
      onScanExecuted();
    } catch (err: any) {
      setExecutionResult({ error: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-rose-500 flex items-center gap-2">
          <AlertOctagon className="w-5 h-5 text-rose-500" />
          SOC Attack Simulator
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Perform controlled ethical-hacking simulations. Clicking a scenario fires injection payloads, jailbreaks, data exfiltration codes, or malware files directly at our firewall to stress-test your defense and witness real-time alerts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Scenarios list */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Available Simulation Payloads</h3>
          
          <div className="space-y-3">
            {attackScenarios.map((sim) => (
              <div 
                key={sim.id}
                className={`p-4 rounded-xl border transition-all ${
                  activeSim?.id === sim.id 
                    ? "bg-rose-950/20 border-rose-500/50" 
                    : "bg-slate-900 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="bg-rose-500/10 text-rose-450 text-[10px] uppercase font-mono px-2 py-0.5 rounded border border-rose-500/20">
                        {sim.type}
                      </span>
                      <h4 className="font-semibold text-sm text-slate-200">{sim.name}</h4>
                    </div>
                    <p className="text-xs text-slate-400 mt-1.5">{sim.description}</p>
                    <div className="mt-2 text-[11px] text-slate-500 font-mono bg-slate-950 px-2 py-1.5 rounded truncate max-w-md">
                      Payload: {sim.payload}
                    </div>
                  </div>

                  <button
                    onClick={() => executeSimulation(sim)}
                    disabled={isLoading}
                    className="flex-shrink-0 bg-rose-550 hover:bg-rose-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer disabled:opacity-55"
                  >
                    <PlayCircle className="w-4 h-4" />
                    Fire
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: SOC Alerts & Output Feed */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between min-h-[400px]">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1">
                <Terminal className="w-4 h-4 text-rose-400" />
                Live SIM-Verdict Payload Inspector
              </span>
              <span className="text-[10px] text-slate-500 font-mono">CHANNEL: SIM_PORT_8080</span>
            </div>

            {!activeSim && (
              <div className="h-64 flex flex-col items-center justify-center text-center text-slate-500 space-y-2">
                <ShieldAlert className="w-12 h-12 text-slate-700 animate-pulse" />
                <p className="text-sm">Ready to evaluate threat vectors</p>
                <p className="text-xs max-w-xs">Select any attack exploit payload on the left and click "Fire" to watch Aegis block the threat.</p>
              </div>
            )}

            {activeSim && isLoading && (
              <div className="h-64 flex flex-col items-center justify-center text-center text-slate-400 space-y-3">
                <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin"></div>
                <p className="text-xs font-mono">Analyzing payload through Firewall layer 1 & 2 & 3...</p>
              </div>
            )}

            {activeSim && !isLoading && executionResult && (
              <div className="space-y-4">
                {/* Visual Status Indicator */}
                <div className={`p-4 rounded-xl border flex items-center gap-4 ${
                  executionResult.status === "Dangerous" 
                    ? "bg-rose-955/20 border-rose-500/30 text-rose-300"
                    : executionResult.status === "Suspicious"
                    ? "bg-amber-955/20 border-amber-500/30 text-amber-300"
                    : "bg-emerald-955/20 border-emerald-500/30 text-emerald-300"
                }`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    executionResult.status === "Dangerous" 
                      ? "bg-rose-500/10 text-rose-400"
                      : executionResult.status === "Suspicious"
                      ? "bg-amber-500/10 text-amber-400"
                      : "bg-emerald-500/10 text-emerald-400"
                  }`}>
                    {executionResult.status === "Dangerous" ? <AlertOctagon className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-400 font-mono">Mitigation Action Triggered</p>
                    <p className="text-base font-bold">
                      {executionResult.status === "Dangerous" ? "🚨 INLINE COMMAND DEPLOYMENT BLOCKED" : "🟢 PASS - RECORDED AS SAFE"}
                    </p>
                  </div>
                </div>

                {/* Score and stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-mono">Risk index Rating</span>
                    <p className="text-xl font-bold font-mono text-rose-400">{executionResult.riskScore}%</p>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-mono">Incident Class</span>
                    <p className="text-sm font-bold truncate text-slate-250">{executionResult.category}</p>
                  </div>
                </div>

                {/* Deep Analysis Explanation */}
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase font-mono">Cognitive FireWall Explanation</span>
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded bg-slate-950 rounded text-xs leading-relaxed text-slate-300">
                    {executionResult.explanation}
                  </div>
                </div>

                {/* Dynamic voice indicator */}
                {executionResult.status === "Dangerous" && (
                  <div className="p-2 border border-slate-800 bg-slate-950 rounded flex items-center gap-2 text-xs text-slate-450 font-mono">
                    <Volume2 className="w-4 h-4 text-emerald-400 animate-bounce" />
                    <span>Elevenlabs verbal alert dispatched to sandbox audio.</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {activeSim && !isLoading && executionResult && (
            <div className="border-t border-slate-800 pt-3 mt-6 flex justify-between items-center text-[10px] font-mono text-slate-500">
              <span>ALERT STATUS: BROADCAST TO SLACK & n8n WEBHOOK</span>
              <span>VERDICT: BLOCK_IP_NODE</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
