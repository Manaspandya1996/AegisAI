import React, { useEffect, useState } from "react";
import { 
  ShieldAlert, 
  ShieldCheck, 
  Activity, 
  Volume2, 
  Layers, 
  Server, 
  Terminal, 
  AlertTriangle, 
  Grid, 
  Bug, 
  Shield, 
  Clock, 
  Laptop, 
  UserPlus, 
  XOctagon, 
  Settings, 
  CheckCircle,
  HelpCircle
} from "lucide-react";
import { SecurityStats, ScanResult } from "../types";
import BlastRadiusCanvas from "./BlastRadiusCanvas";

interface Props {
  scansUpdatedTick: number; // Trigger reload when simulations or manual scans fire
}

export default function DashboardTab({ scansUpdatedTick }: Props) {
  const [stats, setStats] = useState<SecurityStats>({
    totalScanned: 0,
    blockedAttacks: 0,
    safeCount: 0,
    suspiciousCount: 0,
    dangerousCount: 0,
    averageRiskScore: 0,
    categoryDistribution: {},
    scansByDay: []
  });
  
  const [recentScans, setRecentScans] = useState<ScanResult[]>([]);
  const [systemInfo, setSystemInfo] = useState<any>({
    mongoConnected: false,
    aiEnabled: false,
    elevenlabsEnabled: false,
    n8nEnabled: false
  });
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [activeDisclosure, setActiveDisclosure] = useState<string | null>("node1");
  const [intelligenceExpanded, setIntelligenceExpanded] = useState<string | null>(null);

  // Countermeasure actionable interactive flags
  const [isHostsIsolated, setIsHostsIsolated] = useState<boolean>(false);
  const [isSystemsPatched, setIsSystemsPatched] = useState<boolean>(false);
  const [isIncidentEscalated, setIsIncidentEscalated] = useState<boolean>(false);
  const [countermeasureLogs, setCountermeasureLogs] = useState<string[]>([]);

  const fetchDashboardData = async () => {
    try {
      // 1. Fetch system health
      const healthRes = await fetch("/api/health");
      const healthData = await healthRes.json();
      setSystemInfo(healthData);

      // 2. Fetch aggregated stats
      const statsRes = await fetch("/api/stats");
      const statsData = await statsRes.json();
      setStats(statsData);

      // 3. Fetch recent security logs
      const scansRes = await fetch("/api/scans");
      const scansData = await scansRes.json();
      setRecentScans(scansData.slice(0, 15));
    } catch (err) {
      console.error("Failed to load command center stats database:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [scansUpdatedTick]);

  const addLogMessage = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setCountermeasureLogs(prev => [`[${time}] ${msg}`, ...prev].slice(0, 5));
  };

  const handleIsolateHosts = () => {
    const newState = !isHostsIsolated;
    setIsHostsIsolated(newState);
    if (newState) {
      addLogMessage("⚠️ CRITICAL: Initiating perimeter quarantine... Subnet B and C are entirely offline! Active DNS isolated.");
    } else {
      addLogMessage("✅ RESTORED: Central subnets returned to active routing gateway. Ports open.");
    }
  };

  const handlePatchSystems = () => {
    setIsSystemsPatched(true);
    addLogMessage("🛠️ HEURISTICS: Running automated defense patch. Core vulnerabilities mitigated on Vultr node.");
    setTimeout(() => {
      setIsSystemsPatched(false);
    }, 5000);
  };

  const handleEscalateIncident = () => {
    setIsIncidentEscalated(true);
    addLogMessage("🚨 SOC STATUS: Incident is escalated. Forwarding payload stream to central Slack & team mobile pager.");
    setTimeout(() => {
      setIsIncidentEscalated(false);
    }, 6000);
  };

  return (
    <div className="space-y-6 select-none animate-entrance text-left font-sans">
      
      {/* Top Header Metrics row (From Mockup Grid stats) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Scanned */}
        <div className="bg-surface-container-lowest/80 backdrop-blur-xl border border-white/10 p-4 rounded-xl flex items-center justify-between hover:border-info-cyan/20 transition duration-300">
          <div className="space-y-1">
            <span className="text-[9px] uppercase font-mono tracking-widest text-slate-500 font-bold">TOTAL SCANS AUDIT</span>
            <p className="text-xl font-bold font-mono text-white tracking-tight">{stats.totalScanned}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-info-cyan/10 flex items-center justify-center text-info-cyan shadow-[0_0_10px_rgba(0,240,255,0.15)] ring-1 ring-info-cyan/20">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        {/* Attacks Blocked */}
        <div className="bg-surface-container-lowest/80 backdrop-blur-xl border border-white/10 p-4 rounded-xl flex items-center justify-between hover:border-danger-magenta/20 transition duration-300">
          <div className="space-y-1">
            <span className="text-[9px] uppercase font-mono tracking-widest text-slate-500 font-bold font-mono">EXPLOITS BLOCKED</span>
            <p className="text-xl font-bold font-mono text-danger-magenta tracking-tight">{stats.blockedAttacks}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-danger-magenta/10 flex items-center justify-center text-danger-magenta shadow-[0_0_10px_rgba(255,0,255,0.15)] ring-1 ring-danger-magenta/20 animate-pulse">
            <ShieldAlert className="w-5 h-5 text-danger-magenta" />
          </div>
        </div>

        {/* Avg Risk Score */}
        <div className="bg-surface-container-lowest/80 backdrop-blur-xl border border-white/10 p-4 rounded-xl flex items-center justify-between hover:border-warning-orange/20 transition duration-300">
          <div className="space-y-1">
            <span className="text-[9px] uppercase font-mono tracking-widest text-slate-500 font-bold">AVG RISK INDEX</span>
            <p className="text-xl font-bold font-mono text-warning-orange tracking-tight">{stats.averageRiskScore}%</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-warning-orange/10 flex items-center justify-center text-warning-orange shadow-[0_0_10px_rgba(255,153,0,0.15)] ring-1 ring-warning-orange/20">
            <Layers className="w-5 h-5 text-warning-orange" />
          </div>
        </div>

        {/* Protected Nodes */}
        <div className="bg-surface-container-lowest/80 backdrop-blur-xl border border-white/10 p-4 rounded-xl flex items-center justify-between hover:border-safe-green/20 transition duration-300">
          <div className="space-y-1">
            <span className="text-[9px] uppercase font-mono tracking-widest text-slate-500 font-bold">MONITORED CLIENTS</span>
            <p className="text-xl font-bold font-mono text-safe-green tracking-tight">8 Secure</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-safe-green/10 flex items-center justify-center text-safe-green shadow-[0_0_10px_rgba(0,255,102,0.15)] ring-1 ring-safe-green/20">
            <Server className="w-5 h-5 text-safe-green" />
          </div>
        </div>
      </div>

      {/* Integration Connections Panel (From original premium widgets to maintain real-time diagnostics) */}
      <div className="bg-surface/50 border border-white/10 p-4 rounded-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-info-cyan animate-ping"></span>
          <span className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">ACTIVE COGNITIVE GATEWAY VERIFICATION</span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* MongoDB */}
          <span className={`px-2.5 py-1 rounded text-[10px] font-mono border flex items-center gap-1.5 ${
            systemInfo.mongoConnected 
              ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400" 
              : "bg-slate-900/40 border-slate-800 text-slate-500"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${systemInfo.mongoConnected ? "bg-emerald-500" : "bg-slate-600"}`}></span>
            DB: {systemInfo.mongoConnected ? "Atlas" : "In-Memory fallback"}
          </span>

          {/* Gemini */}
          <span className={`px-2.5 py-1 rounded text-[10px] font-mono border flex items-center gap-1.5 ${
            systemInfo.aiEnabled 
              ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400" 
              : "bg-slate-900/40 border-slate-800 text-slate-500"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${systemInfo.aiEnabled ? "bg-emerald-500" : "bg-slate-600"}`}></span>
            AI: {systemInfo.aiEnabled ? "Gemini 3.5 Active" : "Local Rules Engine"}
          </span>

          {/* ElevenLabs */}
          <span className={`px-2.5 py-1 rounded text-[10px] font-mono border flex items-center gap-1.5 ${
            systemInfo.elevenlabsEnabled 
              ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400" 
              : "bg-slate-900/40 border-slate-800 text-slate-500"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${systemInfo.elevenlabsEnabled ? "bg-emerald-500" : "bg-slate-600"}`}></span>
            Audio: {systemInfo.elevenlabsEnabled ? "ElevenLabs Active" : "Web speech fallback"}
          </span>

          {/* n8n */}
          <span className={`px-2.5 py-1 rounded text-[10px] font-mono border flex items-center gap-1.5 ${
            systemInfo.n8nEnabled 
              ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400" 
              : "bg-slate-900/40 border-slate-800 text-slate-500"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${systemInfo.n8nEnabled ? "bg-emerald-500" : "bg-slate-600"}`}></span>
            n8n integration: {systemInfo.n8nEnabled ? "Live Webhook" : "Fallback alerts"}
          </span>
        </div>
      </div>

      {/* Main Core Operations Area: Layout matching user screenshot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column: Threat Timeline Block (Span 4) */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <div className="bg-surface/40 hover:bg-surface/50 border border-white/10 rounded-xl p-6 transition duration-400 flex flex-col justify-between flex-grow min-h-[440px] relative overflow-hidden group">
            {/* Ambient scanner light effect on timeline */}
            <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-info-cyan/15 to-transparent animate-pulse"></div>
            
            <div>
              <div className="flex justify-between items-center mb-6 relative z-10 select-none">
                <h2 className="font-headline font-semibold text-sm text-slate-200 uppercase tracking-widest flex items-center gap-2">
                  <Clock className="w-4 h-4 text-info-cyan glow-text-cyan" />
                  Threat Timeline
                </h2>
                <span className="text-[10px] font-mono text-info-cyan/60 animate-pulse bg-info-cyan/5 px-2 py-0.5 rounded border border-info-cyan/20">LIVE STREAM</span>
              </div>

              <div className="relative border-l border-white/10 ml-3.5 space-y-7 pb-4 z-10 transition-all">
                {/* Node 1: Anomaly */}
                <div className="relative pl-7 group/node">
                  <div className={`absolute -left-[14px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                    activeDisclosure === "node1" 
                      ? "bg-danger-magenta/25 border border-danger-magenta text-danger-magenta shadow-[0_0_15px_rgba(255,0,255,0.7)]" 
                      : "bg-slate-950 border border-white/15 text-slate-500 group-hover/node:border-danger-magenta group-hover/node:text-danger-magenta"
                  }`}>
                    <span className="text-[10px] font-bold font-mono">🚨</span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 mb-1">14:02:55 UTC</div>
                  <h3 className="font-headline text-[11px] font-semibold tracking-wider text-danger-magenta glow-text-magenta uppercase">
                    ANOMALY DETECTED
                  </h3>
                  
                  {activeDisclosure === "node1" ? (
                    <div className="mt-2 text-xs text-slate-400 font-mono leading-relaxed bg-black/40 p-2 rounded border border-white/5 animate-fade-in">
                      Unauthorized access attempt detected from anomalous IP block targeting perimeter gateways. High severity rating bypass blocked.
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-400 font-mono mt-1 opacity-70 truncate max-w-[240px]">Targeting perimeter gateways...</p>
                  )}
                  
                  <button 
                    onClick={() => setActiveDisclosure(activeDisclosure === "node1" ? null : "node1")}
                    className="text-[9px] font-mono text-info-cyan uppercase tracking-widest mt-2 hover:underline cursor-pointer flex items-center gap-1"
                  >
                    {activeDisclosure === "node1" ? "Collapse" : "Progressive Disclosure"} 
                    <span className="text-[10px]">→</span>
                  </button>
                </div>

                {/* Node 2: Data Exfiltration */}
                <div className="relative pl-7 group/node">
                  <div className={`absolute -left-[14px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                    activeDisclosure === "node2" 
                      ? "bg-info-cyan/25 border border-info-cyan text-info-cyan shadow-[0_0_15px_rgba(0,240,255,0.7)]" 
                      : "bg-slate-950 border border-white/15 text-slate-500 group-hover/node:border-info-cyan group-hover/node:text-info-cyan"
                  }`}>
                    <span className="text-[9px] font-bold font-mono">📡</span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 mb-1">14:05:12 UTC</div>
                  <h3 className="font-headline text-[11px] font-semibold tracking-wider text-info-cyan glow-text-cyan uppercase">
                    DATA EXFILTRATION INITIATED
                  </h3>

                  {activeDisclosure === "node2" ? (
                    <div className="mt-2 text-xs text-slate-400 font-mono leading-relaxed bg-black/40 p-2 rounded border border-white/5 animate-fade-in">
                      Encrypted payload identified in outbound traffic. Destination IP geolocated to unknown proxy. Blocked in-flight.
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-400 font-mono mt-1 opacity-70 truncate max-w-[240px]">Encrypted payload identified...</p>
                  )}

                  <button 
                    onClick={() => setActiveDisclosure(activeDisclosure === "node2" ? null : "node2")}
                    className="text-[9px] font-mono text-info-cyan uppercase tracking-widest mt-2 hover:underline cursor-pointer flex items-center gap-1"
                  >
                    {activeDisclosure === "node2" ? "Collapse" : "Progressive Disclosure"} 
                    <span className="text-[10px]">→</span>
                  </button>
                </div>

                {/* Node 3: Containment */}
                <div className="relative pl-7 group/node">
                  <div className={`absolute -left-[14px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                    activeDisclosure === "node3" 
                      ? "bg-warning-orange/25 border border-warning-orange text-warning-orange shadow-[0_0_15px_rgba(255,153,0,0.7)]" 
                      : "bg-slate-950 border border-white/15 text-slate-500 group-hover/node:border-warning-orange group-hover/node:text-warning-orange"
                  }`}>
                    <span className="text-[10px] font-bold font-mono">🔒</span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 mb-1">14:07:30 UTC</div>
                  <h3 className="font-headline text-[11px] font-semibold tracking-wider text-warning-orange uppercase">
                    CONTAINMENT PROTOCOL ENGAGED
                  </h3>

                  {activeDisclosure === "node3" ? (
                    <div className="mt-2 text-xs text-slate-400 font-mono leading-relaxed bg-black/40 p-3 rounded border border-white/5 animate-fade-in space-y-1">
                      <p className="text-amber-400 font-semibold text-[11px]">🛡️ Active Containment List:</p>
                      <ul className="list-disc pl-4 space-y-1 text-[11.5px] text-slate-300">
                        <li>Isolating subnets B and C.</li>
                        <li>Revoking active external SSO session tokens.</li>
                        <li>Forensic diagnostic dump captures active.</li>
                      </ul>
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-400 font-mono mt-1 opacity-70 truncate max-w-[240px]">Core subnets locked down...</p>
                  )}

                  <button 
                    onClick={() => setActiveDisclosure(activeDisclosure === "node3" ? null : "node3")}
                    className="text-[9px] font-mono text-info-cyan uppercase tracking-widest mt-2 hover:underline cursor-pointer flex items-center gap-1"
                  >
                    {activeDisclosure === "node3" ? "Collapse" : "Progressive Disclosure"} 
                    <span className="text-[10px]">→</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Simulated Live countermeasure outputs */}
            {countermeasureLogs.length > 0 && (
              <div className="pt-4 border-t border-slate-850 text-left font-mono text-[9.5px] space-y-1 text-slate-500">
                <p className="font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1"><Terminal className="w-3.5 h-3.5 text-warning-orange" /> Real-time Containment Logs:</p>
                <div className="bg-black/80 rounded p-2 text-slate-300 max-h-24 overflow-y-auto space-y-1.5 border border-slate-850">
                  {countermeasureLogs.map((log, lIdx) => (
                    <p key={lIdx} className="leading-tight break-all border-b border-slate-900 pb-1 last:border-0">{log}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center: Blast Radius 3D sphere card (Span 8) */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          <div className="bg-surface/40 hover:bg-surface/50 border border-info-cyan/20 rounded-xl p-6 relative overflow-hidden flex flex-col justify-between h-grow min-h-[440px] shadow-[0_0_40px_rgba(0,240,255,0.06)] group">
            
            {/* Top Bar inside Blast Radius */}
            <div className="flex justify-between items-center relative z-20">
              <div>
                <h2 className="font-headline font-bold text-md text-white uppercase tracking-wider glow-text-cyan flex items-center gap-1.5">
                  <Shield className="w-4.5 h-4.5 text-info-cyan" />
                  Blast Radius Controls
                </h2>
                <p className="text-[10px] font-mono text-slate-400 uppercase mt-0.5 tracking-tight">Interactive Infrastructure Network Node Visualizer (WebGL)</p>
              </div>

              {/* Control zoom panel */}
              <div className="flex gap-2.5 bg-black/40 border border-white/10 p-1 rounded-lg backdrop-blur-md">
                <button 
                  onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2.5))}
                  title="Zoom In Sphere"
                  className="bg-black/60 hover:bg-info-cyan/20 hover:border-info-cyan/40 border border-white/5 transition duration-200 p-1 px-2.5 text-xs text-info-cyan font-bold rounded cursor-pointer"
                >
                  🔍+
                </button>
                <button 
                  onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.5))}
                  title="Zoom Out Sphere"
                  className="bg-black/60 hover:bg-info-cyan/20 hover:border-info-cyan/40 border border-white/5 transition duration-200 p-1 px-2.5 text-xs text-info-cyan font-bold rounded cursor-pointer"
                >
                  🔍-
                </button>
                <button 
                  onClick={() => setZoomLevel(1)}
                  title="Reset Camera Zoom"
                  className="bg-black/60 hover:text-white transition duration-200 p-1 px-2 text-[10px] text-slate-400 rounded cursor-pointer font-mono"
                >
                  RESET
                </button>
              </div>
            </div>

            {/* THREEJS Spherical Radar Canvas */}
            <div className="relative w-full h-[320px] rounded-xl overflow-hidden mt-2 border border-white/5 bg-black/25">
              <BlastRadiusCanvas zoom={zoomLevel} />
            </div>

            {/* Bottom status stats indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-400 gap-3 pt-3 border-t border-slate-900 mt-2 relative z-10">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-safe-green inline-block"></span> RADAR DISPATCH STATUS: ACTIVE_VERDICT</span>
              <span className="text-slate-500">📍 DRAG WEBGL IMAGE TO OVERRIDE ROTATIONAL AXIS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Under Row bento-grid components: System Health, Response countermeasures, Intel Feed */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        
        {/* Bento 1: System Health Circular Gauges (Col span 4) */}
        <div className="col-span-12 md:col-span-4 bg-surface/40 hover:bg-surface/50 border border-white/10 rounded-xl p-6 transition duration-300 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-2">
            <h2 className="font-headline font-bold text-xs text-slate-200 uppercase tracking-widest flex items-center gap-1.5">
              <Settings className="w-4 h-4 text-info-cyan" />
              Infrastructure Heuristics
            </h2>
            <span className="text-[10px] font-mono text-slate-500">HEALTH_LEVELS</span>
          </div>

          <div className="space-y-5">
            {/* Global Infra Bar */}
            <div>
              <div className="flex justify-between font-mono text-[10px] mb-1.5 uppercase font-bold tracking-widest">
                <span className="text-slate-200">GLOBAL CLOUD INFRASTRUCTURE</span>
                <span className="text-info-cyan glow-text-cyan">98%</span>
              </div>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden shadow-[inset_0_1px_3px_rgba(0,0,0,0.8)] border border-slate-900">
                <div className="bg-info-cyan h-full shadow-[0_0_10px_#00f0ff]" style={{ width: "98%" }}></div>
              </div>
            </div>

            {/* Cloud Services bar */}
            <div>
              <div className="flex justify-between font-mono text-[10px] mb-1.5 uppercase font-bold tracking-widest">
                <span className="text-slate-200">COGNITIVE VERDICT VELOCITY</span>
                <span className="text-danger-magenta glow-text-magenta">82%</span>
              </div>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden shadow-[inset_0_1px_3px_rgba(0,0,0,0.8)] border border-slate-900">
                <div className="bg-danger-magenta h-full shadow-[0_0_10px_#ff00ff]" style={{ width: "82%" }}></div>
              </div>
            </div>

            {/* AI Defense bar */}
            <div>
              <div className="flex justify-between font-mono text-[10px] mb-1.5 uppercase font-bold tracking-widest">
                <span className="text-slate-200">AI AGENT DEFENSIVE SHIELD</span>
                <span className="text-info-cyan glow-text-cyan">100%</span>
              </div>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden shadow-[inset_0_1px_3px_rgba(0,0,0,0.8)] border border-slate-900">
                <div className="bg-info-cyan h-full shadow-[0_0_10px_#00f0ff]" style={{ width: "100%" }}></div>
              </div>
            </div>
          </div>

          {/* Core circular dials (SVG format) */}
          <div className="flex justify-center items-center gap-8 mt-6 pt-4 border-t border-slate-900">
            {/* Radial Core 1 */}
            <div className="flex flex-col items-center gap-1">
              <div className="relative w-14 h-14 rounded-full border border-white/5 flex items-center justify-center bg-black/40 shadow-[inset_0_0_10px_rgba(0,240,255,0.15)]">
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path 
                    className="text-info-cyan" 
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeDasharray="79, 100" 
                    strokeWidth="3.5" 
                    style={{ filter: "drop-shadow(0 0 3px rgba(0,240,255,0.7))" }}
                  ></path>
                </svg>
                <span className="font-mono text-[10.5px] text-info-cyan z-10 font-bold glow-text-cyan">79%</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 uppercase font-bold tracking-wider">CPU CORES</span>
            </div>

            {/* Radial Core 2 */}
            <div className="flex flex-col items-center gap-1">
              <div className="relative w-14 h-14 rounded-full border border-white/5 flex items-center justify-center bg-black/40 shadow-[inset_0_0_10px_rgba(255,0,255,0.15)]">
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path 
                    className="text-danger-magenta" 
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeDasharray="96.5, 100" 
                    strokeWidth="3.5" 
                    style={{ filter: "drop-shadow(0 0 3px rgba(255,0,255,0.7))" }}
                  ></path>
                </svg>
                <span className="font-mono text-[10.5px] text-danger-magenta z-10 font-bold glow-text-magenta">96.5</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 uppercase font-bold tracking-wider">FIREWALL</span>
            </div>
          </div>
        </div>

        {/* Bento 2: Response Actions list (Col span 4) */}
        <div className="col-span-12 md:col-span-4 bg-surface/40 hover:bg-surface/50 border border-white/10 rounded-xl p-6 transition duration-300 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-2">
              <h2 className="font-headline font-bold text-xs text-slate-200 uppercase tracking-widest flex items-center gap-1.5">
                <Laptop className="w-4 h-4 text-danger-magenta" />
                Response Actions
              </h2>
              <span className="text-[10px] font-mono text-danger-magenta">MANUAL OVERRIDE</span>
            </div>

            {/* Active Control Buttons */}
            <div className="space-y-3">
              {/* Countermeasure 1 */}
              <button
                onClick={handleIsolateHosts}
                className={`w-full py-3.5 px-4 rounded-lg font-mono text-xs font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-between border cursor-pointer ${
                  isHostsIsolated 
                    ? "bg-danger-magenta/20 border-danger-magenta text-danger-magenta glow-text-magenta shadow-[0_0_15px_rgba(255,0,255,0.3)] animate-pulse" 
                    : "bg-surface-glass hover:bg-info-cyan/10 border-info-cyan/35 text-info-cyan hover:shadow-[0_0_15px_rgba(0,240,255,0.25)]"
                }`}
              >
                <span>{isHostsIsolated ? "🔒 RELEASE ISOLATION" : "🚫 ISOLATE GUEST HOSTS"}</span>
                <span className="text-[10px]">{isHostsIsolated ? "CONTAINED" : "READY"}</span>
              </button>

              {/* Countermeasure 2 */}
              <button
                onClick={handlePatchSystems}
                disabled={isSystemsPatched}
                className={`w-full py-3.5 px-4 rounded-lg font-mono text-xs font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-between border cursor-pointer ${
                  isSystemsPatched 
                    ? "bg-slate-900 border-slate-700 text-slate-500" 
                    : "bg-surface-glass hover:bg-info-cyan/10 border-info-cyan/35 text-info-cyan hover:shadow-[0_0_15px_rgba(0,240,255,0.25)]"
                }`}
              >
                <span>{isSystemsPatched ? "🛠️ APPLYING PATCH..." : "📡 PATCH INFRASTRUCTURE"}</span>
                <span className="text-[10px]">{isSystemsPatched ? "DEPLOYING" : "STANDBY"}</span>
              </button>

              {/* Countermeasure 3 */}
              <button
                onClick={handleEscalateIncident}
                disabled={isIncidentEscalated}
                className={`w-full py-3.5 px-4 rounded-lg font-mono text-xs font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-1.5 border cursor-pointer ${
                  isIncidentEscalated 
                    ? "bg-rose-950/40 border-rose-500 text-rose-450 shadow-[0_0_15px_rgba(244,63,94,0.3)] animate-bounce" 
                    : "bg-danger-magenta/10 hover:bg-danger-magenta/20 border-danger-magenta text-danger-magenta hover:shadow-[0_0_15px_rgba(255,0,255,0.25)]"
                }`}
              >
                <span>⚠️ {isIncidentEscalated ? "ESCALATED TO SOC LEAD" : "ESCALATE INCIDENT"}</span>
              </button>
            </div>
          </div>

          <div className="bg-black/40 border border-white/5 rounded-lg p-2.5 mt-4 text-[10px] font-mono text-slate-450 text-left">
            🚩 <b>Aegis Countermeasures</b> allow instant isolation of dangerous client traffic to safeguard connected LLM systems.
          </div>
        </div>

        {/* Bento 3: Intelligence Feed & Incidents (Col span 4) */}
        <div className="col-span-12 md:col-span-4 bg-surface/40 hover:bg-surface/50 border border-white/10 rounded-xl p-6 transition duration-300 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
              <h2 className="font-headline font-bold text-xs text-slate-200 uppercase tracking-widest flex items-center gap-1.5">
                <Bug className="w-4 h-4 text-warning-orange" />
                Intelligence Feed
              </h2>
              <span className="text-[10px] font-mono text-slate-500">THREAT_INTEL</span>
            </div>

            {/* Custom dynamic intelligence vectors feed */}
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              
              {/* Item 1 */}
              <div 
                onClick={() => setIntelligenceExpanded(intelligenceExpanded === "feed1" ? null : "feed1")}
                className="bg-black/50 hover:bg-black/8 w-full p-2.5 rounded-lg border border-white/5 hover:border-danger-magenta/40 hover:shadow-[0_0_15px_rgba(255,0,255,0.15)] transition-all cursor-pointer group text-left"
              >
                <div className="flex items-center gap-1.5 mb-1 text-[11px] font-mono font-bold text-danger-magenta group-hover:glow-text-magenta">
                  <span>👾</span>
                  <span className="uppercase tracking-wide">MALWARE DETECTED - SECTOR 7</span>
                </div>
                <p className="font-mono text-[10.5px] text-slate-400 leading-tight">
                  {intelligenceExpanded === "feed1" 
                    ? "An advanced ransomware strain leveraging recursive prompt injection was identified. Sandbox heuristics show credential extraction attempts targeted at connected database nodes. IP domain isolated." 
                    : "Signature matches advanced security-bypass threat actor profile..."}
                </p>
              </div>

              {/* Item 2 */}
              <div 
                onClick={() => setIntelligenceExpanded(intelligenceExpanded === "feed2" ? null : "feed2")}
                className="bg-black/50 hover:bg-black/8 w-full p-2.5 rounded-lg border border-white/5 hover:border-info-cyan/40 hover:shadow-[0_0_15px_rgba(0,240,255,0.15)] transition-all cursor-pointer group text-left"
              >
                <div className="flex items-center gap-1.5 mb-1 text-[11px] font-mono font-bold text-info-cyan group-hover:glow-text-cyan">
                  <span>👀</span>
                  <span className="uppercase tracking-wide">APT ACTIVITY - 'VOID HAWK'</span>
                </div>
                <p className="font-mono text-[10.5px] text-slate-400 leading-tight">
                  {intelligenceExpanded === "feed2" 
                    ? "Active coordination from foreign hosting networks attempting dictionary brute-forcing on active Aegis client authentication routes on Debian instances. Blocklist rules generated." 
                    : "Command and control infrastructure communicating with perimeter..."}
                </p>
              </div>

              {/* Item 3 */}
              <div 
                onClick={() => setIntelligenceExpanded(intelligenceExpanded === "feed3" ? null : "feed3")}
                className="bg-black/50 hover:bg-black/8 w-full p-2.5 rounded-lg border border-white/5 hover:border-warning-orange/40 hover:shadow-[0_0_15px_rgba(255,153,0,0.15)] transition-all cursor-pointer group text-left"
              >
                <div className="flex items-center gap-1.5 mb-1 text-[11px] font-mono font-bold text-warning-orange">
                  <span>📧</span>
                  <span className="uppercase tracking-wide">SPOOFED DKIM TARGET ENVELOPE</span>
                </div>
                <p className="font-mono text-[10.5px] text-slate-400 leading-tight">
                  {intelligenceExpanded === "feed3" 
                    ? "Targeted spear phishing campaigns originating from spoofed financial domains targeting internal finance team emails. System automatically alerted gateways." 
                    : "Urgent wire transfer phishing and PayPal fake validation emails blocked..."}
                </p>
              </div>
            </div>
          </div>

          <div className="text-[10px] font-mono uppercase text-slate-500 tracking-widest text-center mt-3 border-t border-slate-900 pt-3">
            LAST SECURITY CLASSIFIERS SYNC: SECS AGO
          </div>
        </div>
      </div>

      {/* Under Section: Real-time logs list showing previous scans */}
      <div className="bg-surface/40 hover:bg-surface/50 border border-white/10 rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-350 flex items-center gap-1.5">
            <Terminal className="w-4 h-4 text-info-cyan" />
            Live Inbound Network Audit Stream (Latest Scans)
          </h3>
          <span className="text-[10px] font-mono text-slate-500 uppercase">SYS_LOGS_ACTIVE</span>
        </div>

        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {isLoading ? (
            <div className="text-center py-6 text-xs text-slate-500 font-mono">Querying deep database metrics...</div>
          ) : recentScans.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-600 font-mono">No active network logs yet. Try triggering simulated attacks in the Attack Simulator.</div>
          ) : (
            recentScans.map((scan) => (
              <div 
                key={scan.id} 
                className="p-3 bg-black/60 hover:bg-black/85 rounded-lg border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-3 text-left transition duration-200"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full relative flex-shrink-0 ${
                    scan.status === "Dangerous" 
                      ? "bg-rose-500 shadow-[0_0_10px_#ef4444]" 
                      : scan.status === "Suspicious"
                      ? "bg-amber-500 shadow-[0_0_10px_#f59e0b]"
                      : "bg-emerald-500 shadow-[0_0_10px_#10b981]"
                  }`}>
                    <span className="animate-ping absolute inset-0 w-full h-full rounded-full opacity-60 bg-current"></span>
                  </span>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                      <span className="bg-white/5 px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider">{scan.type}</span>
                      <span>•</span>
                      <span className="text-slate-300 font-semibold">{scan.category}</span>
                      <span>•</span>
                      <span className="text-slate-500">{new Date(scan.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-xs text-slate-300 font-mono tracking-tight leading-relaxed line-clamp-1 break-all max-w-xl">
                      {scan.payload}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-auto font-mono text-[10.5px]">
                  {scan.status === "Dangerous" && (
                    <span className="text-[9px] bg-rose-500/10 text-rose-400 px-1.5 py-0.5 rounded border border-rose-500/20 font-bold uppercase tracking-wide">
                      BLOCKED_INLINE
                    </span>
                  )}
                  {scan.status === "Suspicious" && (
                    <span className="text-[9px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/20 font-bold uppercase tracking-wide">
                      WATCH_DEEP
                    </span>
                  )}
                  {scan.status === "Clean" && (
                    <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20 font-bold uppercase tracking-wide">
                      CLEAN_PASS
                    </span>
                  )}
                  <span className={`px-2 py-0.5 rounded bg-black border border-white/10 ${
                    scan.riskScore >= 70 ? "text-rose-450" : scan.riskScore >= 35 ? "text-amber-450" : "text-emerald-450"
                  }`}>
                    Risk: {scan.riskScore}%
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
