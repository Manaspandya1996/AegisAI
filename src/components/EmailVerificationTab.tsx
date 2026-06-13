import React, { useState } from "react";
import { 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  AlertCircle, 
  Mail, 
  Terminal, 
  Volume2, 
  Send, 
  CheckCircle, 
  HelpCircle, 
  XOctagon, 
  Lock, 
  UserX,
  FileCheck2
} from "lucide-react";
import { ScanResult } from "../types";

interface Props {
  onScanExecuted: () => void;
}

export default function EmailVerificationTab({ onScanExecuted }: Props) {
  const [fromEmail, setFromEmail] = useState<string>("billing-updates@paypaI-notfiy.org");
  const [toEmail, setToEmail] = useState<string>("finance@company-domain.com");
  const [subject, setSubject] = useState<string>("⚠️ URGENT: Complete Account Verification to Avoid Immediate Suspension");
  const [bodyText, setBodyText] = useState<string>(
    "Dear Customer,\n\nWe detected a suspicious login attempt on your account from IP 184.22.91.44. Please verify your identity immediately by clicking on the secure portal below to avoid direct service suspension:\n\nhttp://verification-secure-portal.net/login?token=885ae3f9\n\nKind regards,\nSupport Security Team"
  );
  
  const [spfDkimPass, setSpfDkimPass] = useState<"pass" | "fail" | "none">("fail");
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [blockedSenders, setBlockedSenders] = useState<string[]>(["spammer@nigerialottery.xyz"]);
  const [blockingStatus, setBlockingStatus] = useState<string | null>(null);

  const speakAlert = async (category: string, riskScore: number) => {
    const text = `Phishing email risk analysis is complete. Security verdict rating: ${riskScore} out of 100. Category: ${category}. Threat neutralized by secure gateway filter.`;
    try {
      const res = await fetch("/api/elevenlabs/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });
      if (res.headers.get("Content-Type")?.includes("audio/mpeg")) {
        const blob = await res.blob();
        const audio = new Audio(URL.createObjectURL(blob));
        await audio.play();
        return;
      }
    } catch {
      // Fallback
    }

    if ("speechSynthesis" in window) {
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
    }
  };

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bodyText.trim() || !fromEmail.trim()) return;

    setIsScanning(true);
    setResult(null);
    setBlockingStatus(null);

    // Build compound raw representation of the email for server scan engine
    const fullEmailContent = `[SENDER]: ${fromEmail}\n[RECEIVER]: ${toEmail}\n[SUBJECT]: ${subject}\n[SPF/DKIM]: ${spfDkimPass.toUpperCase()}\n\n[BODY]:\n${bodyText}`;

    try {
      const res = await fetch("/api/scans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "email",
          payload: fullEmailContent,
          agentTarget: `EmailGatewayFilter-${fromEmail.split("@")[1] || "Generic"}`
        })
      });
      
      if (res.ok) {
        const scanData = await res.json();
        
        // Enhance scanData in UI with SPF/DKIM failure metadata
        if (spfDkimPass === "fail" && scanData.status !== "Dangerous") {
          scanData.status = "Dangerous";
          scanData.riskScore = Math.max(scanData.riskScore, 85);
          scanData.category = "Email Domain Spoofing";
          scanData.explanation = "CRITICAL: " + scanData.explanation + " SPF/DKIM signature failed validation, indicating this message is spoofing its origin domain.";
          scanData.mitigation = "Mark as spam, flag sender, block direct transmission.";
          if (!scanData.rulesTriggered.includes("SPF/DKIM Alignment Failure")) {
            scanData.rulesTriggered.push("SPF/DKIM Alignment Failure");
          }
        } else if (spfDkimPass === "none" && scanData.riskScore < 40) {
          scanData.status = "Suspicious";
          scanData.riskScore = Math.max(scanData.riskScore, 42);
          if (!scanData.rulesTriggered.includes("Missing Security Signatures")) {
            scanData.rulesTriggered.push("Missing Security Signatures");
          }
        }

        setResult(scanData);
        onScanExecuted(); // Refresh widgets in main stats database

        if (scanData.status === "Dangerous" || scanData.riskScore >= 70) {
          speakAlert(scanData.category, scanData.riskScore);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsScanning(false);
    }
  };

  const loadScenario = (preset: {
    from: string;
    to: string;
    sub: string;
    body: string;
    spf: "pass" | "fail" | "none";
  }) => {
    setFromEmail(preset.from);
    setToEmail(preset.to);
    setSubject(preset.sub);
    setBodyText(preset.body);
    setSpfDkimPass(preset.spf);
    setResult(null);
  };

  const handleBlockSender = (emailDomain: string) => {
    if (!blockedSenders.includes(emailDomain)) {
      setBlockedSenders([...blockedSenders, emailDomain]);
      setBlockingStatus(`Successfully added '${emailDomain}' to Aegis centralized DNS & email blocklists.`);
    } else {
      setBlockingStatus(`Domain '${emailDomain}' is already fully blocked.`);
    }
  };

  const PRESETS = [
    {
      title: "PayPal Spoof Links",
      icon: "💳",
      from: "security@paypaI-support-security.net",
      to: "executive@yourdomain.com",
      sub: "Action Required: Your Merchant Account Has Been Limited",
      spf: "fail" as const,
      body: "We detected unauthorized transactions on your linked payment card. Click the link to update your secure login credentials immediately:\n\nhttps://paypaI.com-webapps-limited.org/secure-login\n\nFailure to login within 24 hours results in permanent limitation of funds."
    },
    {
      title: "CEO Direct Wire Request",
      icon: "💼",
      from: "chief-executive-office@gmai1.com",
      to: "finance-ledger@company.in",
      sub: "CONFIDENTIAL / URGENT: Unscheduled Invoice Clearance No. #88921",
      spf: "none" as const,
      body: "Finance,\n\nI am currently in a high-priority meeting. I need you to execute an immediate offshore wire of $45,200 to our raw supplies partner. Do not raise standard protocol channels as this is highly sensitive timing.\n\nUse banking wire routing node details provided in attached invoices.\n\nRegards,\nSent from CEO iPad"
    },
    {
      title: "Government Tax Warrant",
      icon: "🏛️",
      from: "tax-refund-status@irs-enforcement.org",
      to: "taxpayer88@gmail.com",
      sub: "⚠️ FINAL DEMAND: Internal Revenue Service Settlement Code 3392",
      spf: "fail" as const,
      body: "NOTICE OF FEDERAL TAX LIEN ACTION\n\nOur system shows uncollected back taxes of $4,850. An immediate court summons has been provisioned if left unresolved. To dismiss legal action, make electronic settlement now via our governmental portal:\n\nhttp://official-irs-penalty-waivers.com/pay"
    },
    {
      title: "Legitimate Update",
      icon: "✅",
      from: "alerts@github.com",
      to: "developer-team@industry-tech.com",
      sub: "[GitHub] Security advisory: Vulnerability found in your dependencies",
      spf: "pass" as const,
      body: "GitHub advisory team flagged high severity CVE alert in your react-scripts packages. Please inspect GitHub Security center to execute automated dependabot pull request workflows."
    }
  ];

  return (
    <div className="space-y-6">
      {/* Dynamic Header Block */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-emerald-450">
              Email Security Gateway & Phishing Filter
            </h2>
            <p className="text-slate-400 text-sm mt-0.5">
              Scan raw email headers, body markup, and SPF signatures to neutralize credential harvesting, CEO spear-phishing wire requests, and authority impersonation.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input verification configurations (Col Span 7) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-350 flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-emerald-400 font-bold" />
              Incoming Message Parameters
            </h3>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 rounded px-2 py-0.5 border border-emerald-500/20 animate-pulse">
              GATEWAY_INBOUND: ACTIVE
            </span>
          </div>

          <form onSubmit={handleScan} className="space-y-4">
            {/* From & To Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase">From (Sender Address)</label>
                <input
                  type="text"
                  value={fromEmail}
                  onChange={(e) => setFromEmail(e.target.value)}
                  placeholder="e.g. security@paypal.com"
                  className="w-full bg-slate-950 border border-slate-850 rounded p-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase">To (Target Inbox)</label>
                <input
                  type="text"
                  value={toEmail}
                  onChange={(e) => setToEmail(e.target.value)}
                  placeholder="e.g. user@yourcorp.com"
                  className="w-full bg-slate-950 border border-slate-850 rounded p-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            {/* Subject Line & SPF Alignment Row */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-8 space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase">Subject Topic</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Subject Line"
                  className="w-full bg-slate-950 border border-slate-850 rounded p-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="md:col-span-4 space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase">SPF / DKIM Status</label>
                <select
                  value={spfDkimPass}
                  onChange={(e) => setSpfDkimPass(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-850 rounded p-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500 h-9"
                >
                  <option value="pass">🟢 Pass (Aligned)</option>
                  <option value="fail">🔴 Fail (Spoofed)</option>
                  <option value="none">🟡 None (No Record)</option>
                </select>
              </div>
            </div>

            {/* Email Body Context */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-400 uppercase block">
                Email Body Text Content (Payload)
              </label>
              <textarea
                rows={7}
                value={bodyText}
                onChange={(e) => setBodyText(e.target.value)}
                placeholder="Paste the full text of the questionable email here..."
                className="w-full bg-slate-950 border border-slate-850 rounded p-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                required
              ></textarea>
            </div>

            {/* Scan Buttons and Audio toggle */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="submit"
                disabled={isScanning}
                className="bg-emerald-500 hover:bg-emerald-450 text-slate-950 font-bold px-5 py-2.5 rounded-lg text-xs tracking-wider uppercase transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isScanning ? (
                  <>
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-950 border-t-transparent animate-spin"></div>
                    Decoding Inbound Nodes...
                  </>
                ) : (
                  <>
                    <Terminal className="w-4 h-4" />
                    Verify & Analyze Email Risk
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setFromEmail("");
                  setToEmail("");
                  setSubject("");
                  setBodyText("");
                  setSpfDkimPass("none");
                  setResult(null);
                  setBlockingStatus(null);
                }}
                className="text-xs text-slate-400 hover:text-white underline font-mono cursor-pointer"
              >
                Flush Form
              </button>
            </div>
          </form>

          {/* Preset templates */}
          <div className="pt-4 border-t border-slate-850">
            <span className="text-[10px] font-mono text-slate-500 uppercase block mb-2">
              Preloader: Attack Vector Presets
            </span>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => loadScenario(preset)}
                  className="bg-slate-950 hover:bg-slate-900 border border-slate-850 hover:border-slate-700 text-slate-300 p-2 rounded-lg text-left transition text-xs flex flex-col gap-1 cursor-pointer"
                >
                  <span className="text-sm">{preset.icon} {preset.title}</span>
                  <span className="text-[10px] text-slate-500 font-mono leading-none">
                    spf: {preset.spf.toUpperCase()}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Audit Results Dashboard (Col Span 5) */}
        <div className="space-y-6 lg:col-span-5">
          {/* Main Results View */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-left relative overflow-hidden min-h-[300px]">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-4 border-b border-slate-850 pb-2">
              📊 Real-Time Threat Analysis Output
            </h3>

            {isScanning ? (
              <div className="h-64 flex flex-col items-center justify-center text-center text-slate-500 space-y-3">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full border border-emerald-500/20 border-t-emerald-400 animate-spin"></div>
                  <Mail className="w-6 h-6 text-emerald-450 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                <p className="text-sm font-mono text-emerald-400">Exhaustive Phishing Extraction...</p>
                <p className="text-xs text-slate-400">Triggering DNS validations & lexical audits</p>
              </div>
            ) : result ? (
              <div className="space-y-4">
                {/* Threat Banner Header */}
                <div className={`p-4 rounded-lg flex items-start gap-3 border ${
                  result.status === "Dangerous" 
                    ? "bg-rose-950/20 border-rose-500/30 text-rose-400" 
                    : result.status === "Suspicious"
                    ? "bg-amber-950/20 border-amber-500/30 text-amber-400"
                    : "bg-emerald-950/20 border-emerald-500/30 text-emerald-400"
                }`}>
                  {result.status === "Dangerous" ? (
                    <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5 animate-bounce" />
                  ) : result.status === "Suspicious" ? (
                    <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                  ) : (
                    <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
                  )}
                  
                  <div className="space-y-1">
                    <p className="text-xs font-mono font-bold uppercase tracking-widest leading-none">
                      FIREWALL STATUS: {result.status === "Dangerous" ? "BLOCKED & QUARANTINED" : result.status === "Suspicious" ? "SUSPICIOUS / WATCH" : "CLEAN PASS"}
                    </p>
                    <p className="text-xs font-semibold">{result.category || "General Classification"}</p>
                  </div>
                </div>

                {/* Score bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-450">MALICIOUSNESS RISK INDEX:</span>
                    <span className={`font-bold ${
                      result.riskScore >= 70 ? "text-rose-400" : result.riskScore >= 30 ? "text-amber-400" : "text-emerald-400"
                    }`}>{result.riskScore}%</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-850">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        result.riskScore >= 70 ? "bg-rose-500" : result.riskScore >= 30 ? "bg-amber-500" : "bg-emerald-500"
                      }`}
                      style={{ width: `${result.riskScore}%` }}
                    ></div>
                  </div>
                </div>

                {/* Cognitive Explanation */}
                <div className="space-y-1 bg-slate-950 p-3 rounded border border-slate-850">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">Deep Cognitive Audit Summary</span>
                  <p className="text-slate-300 text-xs leading-relaxed font-sans">
                    {result.explanation}
                  </p>
                </div>

                {/* Mitigation Protocols */}
                <div className="space-y-1 bg-slate-950 p-3 rounded border border-slate-850">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">Mitigation & Action items</span>
                  <p className="text-emerald-450 text-xs leading-relaxed font-mono">
                    ⚠️ {result.mitigation}
                  </p>
                </div>

                {/* Triggered Rules Tag block */}
                {result.rulesTriggered.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono text-slate-500 uppercase block">Matched Firewalls Policies</span>
                    <div className="flex flex-wrap gap-1.5">
                      {result.rulesTriggered.map((ruleName, index) => (
                        <span key={index} className="text-[10px] bg-slate-950 border border-slate-800 text-slate-400 px-2.5 py-0.5 rounded font-mono">
                          🕵️ {ruleName}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Block Simulators */}
                <div className="pt-2 border-t border-slate-850 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => handleBlockSender(fromEmail.split("@")[1] || fromEmail)}
                    className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-lg px-3 py-1.5 text-xs font-mono font-semibold transition cursor-pointer flex items-center gap-1.5"
                  >
                    <UserX className="w-3.5 h-3.5" />
                    Block Domain ({fromEmail.split("@")[1] || "sender"})
                  </button>

                  <div className="text-[10px] text-slate-450 hover:text-slate-300 font-mono text-right">
                    SCAN_ID: <span className="text-slate-400">{result.id || "N/A"}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center text-slate-500 space-y-2">
                <CheckCircle className="w-12 h-12 text-slate-700 animate-pulse" />
                <p className="text-sm font-mono">Waiting for inbound emails...</p>
                <p className="text-xs max-w-xs leading-relaxed text-slate-400">
                  Choose an attack vector template on the left, or input your own suspect mail elements, and click "Verify" to run real-time checks.
                </p>
              </div>
            )}
          </div>

          {/* Domain blocklist state indicator */}
          {blockingStatus && (
            <div className="p-4 bg-emerald-900/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-mono leading-relaxed text-left flex items-start gap-2 animate-fade-in">
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p>{blockingStatus}</p>
            </div>
          )}

          {/* Central Blocklist List widget */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-left">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              Aegis Centrally Blocked Inbound Domains
            </h4>
            <div className="space-y-1 max-h-24 overflow-y-auto">
              {blockedSenders.map((domain, idx) => (
                <div key={idx} className="flex items-center justify-between bg-slate-950 p-1.5 rounded text-[11px] font-mono text-rose-400 border border-slate-850">
                  <span>🚫 {domain}</span>
                  <span className="text-[9px] bg-rose-500/10 text-rose-400 rounded px-1 text-right">BLOCKED</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
