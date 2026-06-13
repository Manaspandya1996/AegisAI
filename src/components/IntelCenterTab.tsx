import React, { useState, useEffect } from "react";
import { Filter, Trash, RefreshCw, AlertTriangle, ShieldCheck, Search, FileText } from "lucide-react";
import { ScanResult, ThreatStatus } from "../types";

export default function IntelCenterTab() {
  const [scans, setScans] = useState<ScanResult[]>([]);
  const [filteredScans, setFilteredScans] = useState<ScanResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedScan, setSelectedScan] = useState<ScanResult | null>(null);

  const fetchScans = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/scans");
      const list = await res.json();
      setScans(list);
      setFilteredScans(list);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchScans();
  }, []);

  useEffect(() => {
    let result = [...scans];

    if (search) {
      result = result.filter(s => 
        s.payload.toLowerCase().includes(search.toLowerCase()) || 
        s.category.toLowerCase().includes(search.toLowerCase()) ||
        s.explanation.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (typeFilter !== "all") {
      result = result.filter(s => s.type === typeFilter);
    }

    if (statusFilter !== "all") {
      result = result.filter(s => s.status === statusFilter);
    }

    setFilteredScans(result);
  }, [search, typeFilter, statusFilter, scans]);

  const handleClearHistory = async () => {
    if (!window.confirm("Are you sure you want to purge all threat scans from the database?")) return;
    try {
      const res = await fetch("/api/scans/clear", { method: "POST" });
      if (res.ok) {
        setScans([]);
        setFilteredScans([]);
        setSelectedScan(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upper header action banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-rose-450 flex items-center gap-2">
            <FileText className="w-5 h-5 text-rose-455" />
            Threat Intelligence Center
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Browse corporate threat data logs. View historical prompt injections, malware payloads, malicious blacklisted IPs, and exfiltration logs processed by the gateway.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchScans}
            className="h-9 px-3 bg-slate-800 border border-slate-700 text-slate-300 rounded text-xs hover:bg-slate-705 transition flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            Refresh Log
          </button>

          <button
            onClick={handleClearHistory}
            className="h-9 px-3 bg-rose-950/20 border border-rose-900/30 text-rose-400 hover:bg-rose-950/40 rounded text-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Trash className="w-3.5 h-3.5" />
            Purge History
          </button>
        </div>
      </div>

      {/* Grid of logs & inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Log Listings */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 lg:col-span-2 space-y-4">
          {/* Controls Filter bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Search Input */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-slate-500">
                <Search className="w-3.5 h-3.5" />
              </span>
              <input
                type="text"
                placeholder="Search raw payloads..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-8 bg-slate-950 border border-slate-800 rounded pl-8 pr-2 text-xs text-slate-300 focus:outline-none focus:border-rose-500"
              />
            </div>

            {/* Type Option Selector */}
            <div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full h-8 bg-slate-950 border border-slate-800 rounded px-2 text-xs text-slate-300 focus:outline-none focus:border-rose-500"
              >
                <option value="all">All Payload Types</option>
                <option value="prompt">Prompt Inputs</option>
                <option value="url">Malicious URLs</option>
                <option value="ip">Reputation IPs</option>
                <option value="file">File Attachments</option>
              </select>
            </div>

            {/* Status Option Selector */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full h-8 bg-slate-950 border border-slate-800 rounded px-2 text-xs text-slate-300 focus:outline-none focus:border-rose-500"
              >
                <option value="all">All Threat Statuses</option>
                <option value="Dangerous">Dangerous Blocks</option>
                <option value="Suspicious">Suspicious Alerts</option>
                <option value="Safe">Safe Scans</option>
              </select>
            </div>
          </div>

          <div className="space-y-2 overflow-y-auto max-h-[500px]">
            {filteredScans.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                No telemetry scans match current filter query rules.
              </div>
            ) : (
              filteredScans.map((scan) => (
                <div 
                  key={scan.id}
                  onClick={() => setSelectedScan(scan)}
                  className={`p-3 rounded-lg border transition cursor-pointer text-left ${
                    selectedScan?.id === scan.id
                      ? "bg-slate-800 border-rose-500/50"
                      : "bg-slate-950 border-slate-850 hover:border-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[8px] font-mono uppercase px-1.5 py-0.5 rounded border ${
                        scan.status === "Dangerous"
                          ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                          : scan.status === "Suspicious"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      }`}>
                        {scan.status}
                      </span>
                      <span className="text-[10px] font-mono text-slate-550 uppercase">
                        {scan.type}
                      </span>
                    </div>

                    <span className="text-[9px] text-slate-500 font-mono">
                      {new Date(scan.timestamp).toLocaleString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 font-semibold truncate mt-1 max-w-lg">
                    {scan.payload}
                  </p>

                  <div className="flex items-center justify-between mt-1 text-[10px] text-slate-500 font-mono">
                    <span>Category: <b className="text-slate-400">{scan.category}</b></span>
                    <span>Risk: {scan.riskScore}%</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Deep Inspector Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">Telemetry Deep Inspector</h3>
          
          {!selectedScan ? (
            <div className="h-64 flex flex-col items-center justify-center text-center text-slate-650 text-xs">
              <AlertTriangle className="w-8 h-8 text-slate-750 animate-pulse mb-2" />
              <span>Select an item in log to run diagnostic tests</span>
            </div>
          ) : (
            <div className="space-y-4 text-left">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-950 p-2 border border-slate-850 rounded">
                  <span className="text-[9px] font-mono text-slate-500 uppercase block">Verdict Status</span>
                  <span className={`text-xs font-bold ${
                    selectedScan.status === "Dangerous" ? "text-rose-400" : selectedScan.status === "Suspicious" ? "text-amber-400" : "text-emerald-400"
                  }`}>
                    {selectedScan.status}
                  </span>
                </div>

                <div className="bg-slate-950 p-2 border border-slate-850 rounded">
                  <span className="text-[9px] font-mono text-slate-500 uppercase block">Risk Score</span>
                  <span className="text-xs font-bold font-mono text-slate-200">
                    {selectedScan.riskScore}/100
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[9px] font-mono text-slate-500 uppercase block">Raw Payload Tested</span>
                <div className="p-2.5 bg-slate-950 border border-slate-850 rounded text-xs text-slate-300 max-h-32 overflow-y-auto font-mono">
                  {selectedScan.payload}
                </div>
              </div>

              <div>
                <span className="text-[9px] font-mono text-slate-500 uppercase block">Threat Category</span>
                <p className="text-xs font-semibold text-slate-200 bg-slate-950 p-2 border border-slate-850 rounded uppercase font-mono mt-0.5">
                  {selectedScan.category}
                </p>
              </div>

              <div>
                <span className="text-[9px] font-mono text-slate-500 uppercase block mb-0.5">Firewall Explanation</span>
                <p className="text-xs text-slate-400 bg-slate-950 p-2.5 border border-slate-850 rounded leading-relaxed">
                  {selectedScan.explanation}
                </p>
              </div>

              <div>
                <span className="text-[9px] font-mono text-slate-500 uppercase block mb-0.5">Mitigate & Resolve Checklist</span>
                <p className="text-xs text-slate-400 bg-slate-950 p-2.5 border border-slate-850 rounded leading-relaxed border-l-2 border-emerald-500">
                  {selectedScan.mitigation}
                </p>
              </div>

              <div className="p-2 bg-slate-950 border border-slate-850 rounded text-[10px] font-mono space-y-1 text-slate-500">
                <div>GATEWAY_ID: <span className="text-slate-400">{selectedScan.details?.agentTarget || "Aegis_Default"}</span></div>
                <div>LOCAL_RULES_MATCHED: <span className="text-slate-400">{selectedScan.rulesTriggered?.join(", ") || "None"}</span></div>
                <div>PERSISTENCE_LAYER: <span className="text-slate-450">MongoDB Atlas (Vultr Client)</span></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
