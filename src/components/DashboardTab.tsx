import React, { useEffect, useState } from "react";
import { ShieldAlert, ShieldCheck, Activity, Brain, Server, Shield, Layers, HelpCircle, Terminal } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";
import { SecurityStats, ScanResult } from "../types";

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

  const fetchDashboardData = async () => {
    try {
      // 1. Fetch live system health status
      const healthRes = await fetch("/api/health");
      const healthData = await healthRes.json();
      setSystemInfo(healthData);

      // 2. Fetch stats
      const statsRes = await fetch("/api/stats");
      const statsData = await statsRes.json();
      setStats(statsData);

      // 3. Fetch latest raw scans
      const scansRes = await fetch("/api/scans");
      const scansData = await scansRes.json();
      setRecentScans(scansData.slice(0, 10)); // Top 10 for dashboard activity tracker
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [scansUpdatedTick]);

  // Construct charts data
  const barChartData = Object.entries(stats.categoryDistribution).map(([category, count]) => ({
    name: category,
    count
  }));

  const COLORS = ["#f43f5e", "#fbbf24", "#38bdf8", "#c084fc", "#ec4899", "#14b8a6"];

  return (
    <div className="space-y-6">
      {/* Upper Status Bar Metrics (Grid of 4) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Scanned */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500">Total Scans Audit</span>
            <p className="text-xl font-bold font-mono text-white">{stats.totalScanned}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        {/* Attacks Blocked */}
        <div className="bg-slate-900 border border-slate-805 p-4 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500">Exploits Blocked</span>
            <p className="text-xl font-bold font-mono text-rose-500">{stats.blockedAttacks}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-rose-550/10 flex items-center justify-center text-rose-400">
            <ShieldAlert className="w-5 h-5 text-rose-500" />
          </div>
        </div>

        {/* Avg Risk Score */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500">Avg Risk Rating</span>
            <p className="text-xl font-bold font-mono text-amber-500">{stats.averageRiskScore}%</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400">
            <Layers className="w-5 h-5 text-amber-550" />
          </div>
        </div>

        {/* Protected Nodes */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500">Protected Agents</span>
            <p className="text-xl font-bold font-mono text-emerald-400">7 Active</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <Server className="w-5 h-5 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Integration Connection Health Badges */}
      <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span className="text-xs font-semibold text-slate-300">Live Services Integration Health:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* MongoDB */}
          <span className={`px-2.5 py-1 rounded text-[10px] font-mono border flex items-center gap-1.5 ${
            systemInfo.mongoConnected 
              ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400" 
              : "bg-slate-900 border-slate-800 text-slate-500"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${systemInfo.mongoConnected ? "bg-emerald-500" : "bg-slate-600"}`}></span>
            DB: {systemInfo.mongoConnected ? "Connected (MongoDB Atlas)" : "Fallback (In-Memory)"}
          </span>

          {/* Gemini */}
          <span className={`px-2.5 py-1 rounded text-[10px] font-mono border flex items-center gap-1.5 ${
            systemInfo.aiEnabled 
              ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400" 
              : "bg-slate-900 border-slate-800 text-slate-500"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${systemInfo.aiEnabled ? "bg-emerald-500" : "bg-slate-600"}`}></span>
            AI: {systemInfo.aiEnabled ? "Active (Gemini 3.5)" : "Offline (Local Rule Engine)"}
          </span>

          {/* ElevenLabs */}
          <span className={`px-2.5 py-1 rounded text-[10px] font-mono border flex items-center gap-1.5 ${
            systemInfo.elevenlabsEnabled 
              ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400" 
              : "bg-slate-900 border-slate-800 text-slate-500"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${systemInfo.elevenlabsEnabled ? "bg-emerald-500" : "bg-slate-600"}`}></span>
            Voice: {systemInfo.elevenlabsEnabled ? "Active (ElevenLabs API)" : "Fallback (Web Speech)"}
          </span>

          {/* n8n */}
          <span className={`px-2.5 py-1 rounded text-[10px] font-mono border flex items-center gap-1.5 ${
            systemInfo.n8nEnabled 
              ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400" 
              : "bg-slate-900 border-slate-800 text-slate-500"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${systemInfo.n8nEnabled ? "bg-emerald-500" : "bg-slate-600"}`}></span>
            n8n Automation: {systemInfo.n8nEnabled ? "Active Webhook" : "Simulated alerts"}
          </span>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Dynamic Line Volume Chart (Span 8) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 lg:col-span-8 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4 font-mono">Malicious Attacks & Telemetry Volume Trends</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={stats.scansByDay}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorBlocked" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="day" stroke="#64748b" fontSize={10} fontStyle="mono" />
                  <YAxis stroke="#64748b" fontSize={10} fontStyle="mono" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#020617", borderColor: "#1e293b", borderRadius: "8px" }}
                    labelStyle={{ color: "#94a3b8", fontSize: "11px", fontWeight: "bold" }}
                    itemStyle={{ fontSize: "12px", padding: 0 }}
                  />
                  <Area type="monotone" dataKey="count" name="Total Scans" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorCount)" />
                  <Area type="monotone" dataKey="blocked" name="Blocked Attacks" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorBlocked)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right: Category Distribution (Span 4) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 lg:col-span-4 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4 font-mono">Threat Vectors Breakdown</h3>
            <div className="h-64 w-full flex items-center justify-center">
              {barChartData.length === 0 ? (
                <p className="text-xs text-slate-650 italic">No exploits blocked yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={9} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={10} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#020617", borderColor: "#1e293b", borderRadius: "8px" }}
                      itemStyle={{ color: "#38bdf8", fontSize: "11px" }}
                    />
                    <Bar dataKey="count" name="Identified Incidents" maxBarSize={30}>
                      {barChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Incident scrolling Activity Feed */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4 font-mono flex items-center gap-1.5">
          <Terminal className="w-4 h-4 text-emerald-450" />
          Real-Time SOC Firewall Incident Feed
        </h3>

        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
          {isLoading ? (
            <div className="text-center py-10 text-xs text-slate-500 font-mono">Loading dynamic system logs...</div>
          ) : recentScans.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-650 font-mono">No network incidents currently logged. Safe gateway operating correctly.</div>
          ) : (
            recentScans.map((scan) => (
              <div key={scan.id} className="p-3 bg-slate-950 rounded-lg border border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
                <div className="flex items-center gap-3">
                  <span className={`w-2.5 h-2.5 rounded-full relative flex-shrink-0 ${
                    scan.status === "Dangerous" 
                      ? "bg-rose-500 shadow-[0_0_10px_#ef4444]" 
                      : scan.status === "Suspicious"
                      ? "bg-amber-500 shadow-[0_0_10px_#f59e0b]"
                      : "bg-emerald-500 shadow-[0_0_10px_#10b981]"
                  }`}>
                    <span className="animate-ping absolute inset-0 w-full h-full rounded-full opacity-60 bg-current"></span>
                  </span>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-450 uppercase">{scan.type} audit</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-[11px] font-mono text-slate-350">{scan.category}</span>
                    </div>
                    <p className="text-xs text-slate-300 font-medium truncate max-w-lg">{scan.payload}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <span className="text-[11px] font-mono text-slate-450 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    Risk Score: {scan.riskScore}%
                  </span>
                  <span className="text-[9px] text-slate-600 font-mono">
                    {new Date(scan.timestamp).toLocaleTimeString()}
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
