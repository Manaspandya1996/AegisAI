import React, { useState, useEffect } from "react";
import { Plus, Trash, Shield, Info, AlertTriangle, Check, RefreshCw } from "lucide-react";
import { SystemRules } from "../types";

export default function RulesManagerTab() {
  const [rules, setRules] = useState<SystemRules[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Form fields
  const [name, setName] = useState<string>("");
  const [pattern, setPattern] = useState<string>("");
  const [category, setCategory] = useState<string>("Prompt Injection");
  const [severity, setSeverity] = useState<"Safe" | "Suspicious" | "Dangerous">("Dangerous");
  const [feedback, setFeedback] = useState<string>("");

  const fetchRules = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/rules");
      const list = await res.json();
      setRules(list);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const handleAddRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !pattern) {
      setFeedback("Name and REGEX pattern are required.");
      return;
    }

    try {
      const res = await fetch("/api/rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, pattern, category, severity })
      });
      if (res.ok) {
        setName("");
        setPattern("");
        setFeedback("Rule added successfully!");
        fetchRules();
        setTimeout(() => setFeedback(""), 3000);
      }
    } catch (err: any) {
      setFeedback("Error adding rule: " + err.message);
    }
  };

  const handleDeleteRule = async (ruleId: string) => {
    try {
      const res = await fetch(`/api/rules/${ruleId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        fetchRules();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-sky-400 flex items-center gap-2">
          <Shield className="w-5 h-5 text-sky-450" />
          Firewall Rule Administration
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Customize pattern matching filters. Prompts triggers are compared against these block lists synchronously. If a prompt triggers a rule, it is mapped to its associated severity rating.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Form: Add New Rule */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-fit">
          <h3 className="font-semibold text-sm text-slate-200 mb-4">Add Custom Firewall Rule</h3>

          <form onSubmit={handleAddRule} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono text-slate-500 uppercase mb-1">Rule Policy Name</label>
              <input
                type="text"
                placeholder="e.g. Reverse Engineering Bypass"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-500 uppercase mb-1">Regex Pattern Trigger</label>
              <input
                type="text"
                placeholder="e.g. bypass limit|ignore security"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-300 font-mono focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono text-slate-500 uppercase mb-1">Incident Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-sky-500"
                >
                  <option value="Prompt Injection">Prompt Injection</option>
                  <option value="Jailbreak">Jailbreak</option>
                  <option value="Data Exfiltration">Data Exfiltration</option>
                  <option value="Tool Abuse">Tool Abuse</option>
                  <option value="System Prompt Extraction">System Prompt Extraction</option>
                  <option value="Context Poisoning">Context Poisoning</option>
                  <option value="Agent Manipulation">Agent Manipulation</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-500 uppercase mb-1">Threat Severity</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-sky-500"
                >
                  <option value="Dangerous">Dangerous</option>
                  <option value="Suspicious">Suspicious</option>
                  <option value="Safe">Safe (Logged only)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs py-2 rounded transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Commit Rule to Database
            </button>
          </form>

          {feedback && (
            <div className="mt-4 p-3 bg-slate-950 border border-slate-800 text-slate-300 rounded text-center text-xs">
              {feedback}
            </div>
          )}
        </div>

        {/* Right Area: Active rules list */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm text-slate-200">Active Rule Definitions ({rules.length})</h3>
            <button
              onClick={fetchRules}
              className="text-slate-500 hover:text-slate-300 text-xs flex items-center gap-1 cursor-pointer font-mono"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              reload
            </button>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[450px] pr-1">
            {rules.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No custom rules stored in MongoDB.
              </div>
            ) : (
              rules.map((rule) => (
                <div key={rule.id} className="p-3 bg-slate-950 border border-slate-850 rounded-lg flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] px-2 py-0.5 rounded uppercase font-mono font-bold ${
                        rule.severity === "Dangerous"
                          ? "bg-rose-500/10 text-rose-455 border border-rose-500/20"
                          : rule.severity === "Suspicious"
                          ? "bg-amber-500/10 text-amber-455 border border-amber-500/20"
                          : "bg-emerald-500/10 text-emerald-455 border border-emerald-500/20"
                      }`}>
                        {rule.severity}
                      </span>
                      <h4 className="text-xs font-semibold text-slate-200">{rule.name}</h4>
                    </div>

                    <div className="text-[11px] text-slate-400">
                      <span>Category: </span>
                      <span className="text-slate-250 font-mono">{rule.category}</span>
                    </div>

                    <div className="text-[11px] font-mono text-emerald-500 bg-slate-950 py-1 px-1.5 rounded truncate max-w-lg mt-0.5 border border-slate-900">
                      Regex: <code className="text-emerald-400">{rule.pattern}</code>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteRule(rule.id)}
                    className="text-slate-600 hover:text-rose-500 p-2 rounded hover:bg-rose-500/10 transition cursor-pointer"
                    title="Delete Rule"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
