import React, { useState } from "react";
import { 
  Shield, 
  Activity, 
  Terminal, 
  PlayCircle, 
  FileText, 
  Settings, 
  BookOpen, 
  Server, 
  Lock, 
  Zap,
  Globe,
  Database,
  Volume2,
  Mail
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Sub-tabs components
import DashboardTab from "./components/DashboardTab";
import FirewallAnalyzerTab from "./components/FirewallAnalyzerTab";
import AttackSimulatorTab from "./components/AttackSimulatorTab";
import IntelCenterTab from "./components/IntelCenterTab";
import RulesManagerTab from "./components/RulesManagerTab";
import GatewayTab from "./components/GatewayTab";
import EmailVerificationTab from "./components/EmailVerificationTab";

type ActiveTab = "dashboard" | "analyzer" | "email-verify" | "simulator" | "intel" | "rules" | "gateway" | "guide";

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");
  const [syncTick, setSyncTick] = useState<number>(0);

  // Increments when scans are executed anywhere, forcing dashboards to sync
  const handleScanExecuted = () => {
    setSyncTick((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Dynamic Grid Matrix background decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-40"></div>

      {/* Top Header Banner */}
      <header className="relative border-b border-slate-900 bg-slate-950/80 backdrop-blur-lg z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-450 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] transition duration-300">
                <Shield className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-950 animate-pulse"></span>
            </div>
            
            <div>
              <h1 className="text-sm font-bold font-mono tracking-wider uppercase text-white flex items-center gap-1.5">
                AEGIS AI <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20 font-semibold uppercase tracking-widest">રક્ષક v1.5</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                SECURE INTELLIGENT GATEWAY • KARNAVATI UNIVERSITY INITIATIVE 
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-slate-400 bg-slate-900 px-3 py-1 rounded border border-slate-850">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              SHIELD STATUS: ACTIVE_INLINE_BLOCK
            </div>
          </div>
        </div>
      </header>

      {/* Main Container Layout */}
      <main className="relative max-w-7xl mx-auto px-4 py-8 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Vertical Navigation Menu (Span 3) */}
          <nav className="lg:col-span-3 space-y-2">
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest px-3 mb-2">SOC SECURITY CONTROL PANEL</div>
            
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full h-11 px-3 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition active:scale-[0.98] cursor-pointer text-left ${
                activeTab === "dashboard"
                  ? "bg-slate-900 text-emerald-400 border border-slate-800 shadow-[2px_0_0_#10b981_inset]"
                  : "text-slate-400 hover:bg-slate-900/50 hover:text-slate-200"
              }`}
            >
              <Activity className="w-4 h-4" />
              Dashboard Hub
            </button>

            <button
              onClick={() => setActiveTab("analyzer")}
              className={`w-full h-11 px-3 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition active:scale-[0.98] cursor-pointer text-left ${
                activeTab === "analyzer"
                  ? "bg-slate-900 text-emerald-400 border border-slate-800 shadow-[2px_0_0_#10b981_inset]"
                  : "text-slate-400 hover:bg-slate-900/50 hover:text-slate-200"
              }`}
            >
              <Terminal className="w-4 h-4" />
              On-Demand Tester
            </button>

            <button
              onClick={() => setActiveTab("email-verify")}
              className={`w-full h-11 px-3 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition active:scale-[0.98] cursor-pointer text-left ${
                activeTab === "email-verify"
                  ? "bg-slate-900 text-emerald-400 border border-slate-800 shadow-[2px_0_0_#10b981_inset]"
                  : "text-slate-400 hover:bg-slate-900/50 hover:text-slate-200"
              }`}
            >
              <Mail className="w-4 h-4" />
              Email Phishing Filter
              <span className="text-[8px] bg-emerald-500/10 text-emerald-400 px-1 py-0.5 rounded border border-emerald-500/20 font-bold tracking-tight uppercase">New</span>
            </button>

            <button
              onClick={() => setActiveTab("simulator")}
              className={`w-full h-11 px-3 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition active:scale-[0.98] cursor-pointer text-left ${
                activeTab === "simulator"
                  ? "bg-slate-900 text-emerald-400 border border-slate-800 shadow-[2px_0_0_#10b981_inset]"
                  : "text-slate-400 hover:bg-slate-900/50 hover:text-slate-200"
              }`}
            >
              <PlayCircle className="w-4 h-4" />
              SOC Attack Simulator
            </button>

            <button
              onClick={() => setActiveTab("intel")}
              className={`w-full h-11 px-3 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition active:scale-[0.98] cursor-pointer text-left ${
                activeTab === "intel"
                  ? "bg-slate-900 text-emerald-400 border border-slate-800 shadow-[2px_0_0_#10b981_inset]"
                  : "text-slate-400 hover:bg-slate-900/50 hover:text-slate-200"
              }`}
            >
              <FileText className="w-4 h-4" />
              Threat Intel Logs
            </button>

            <button
              onClick={() => setActiveTab("rules")}
              className={`w-full h-11 px-3 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition active:scale-[0.98] cursor-pointer text-left ${
                activeTab === "rules"
                  ? "bg-slate-900 text-emerald-400 border border-slate-800 shadow-[2px_0_0_#10b981_inset]"
                  : "text-slate-400 hover:bg-slate-900/50 hover:text-slate-200"
              }`}
            >
              <Settings className="w-4 h-4" />
              Firewall Rules
            </button>

            <button
              onClick={() => setActiveTab("gateway")}
              className={`w-full h-11 px-3 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition active:scale-[0.98] cursor-pointer text-left ${
                activeTab === "gateway"
                  ? "bg-slate-900 text-emerald-400 border border-slate-800 shadow-[2px_0_0_#10b981_inset]"
                  : "text-slate-400 hover:bg-slate-900/50 hover:text-slate-200"
              }`}
            >
              <Server className="w-4 h-4" />
              Agent Gateway
            </button>

            <button
              onClick={() => setActiveTab("guide")}
              className={`w-full h-11 px-3 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition active:scale-[0.98] cursor-pointer text-left ${
                activeTab === "guide"
                  ? "bg-slate-900 text-emerald-400 border border-slate-800 shadow-[2px_0_0_#10b981_inset]"
                  : "text-slate-400 hover:bg-slate-900/50 hover:text-slate-200"
              }`}
            >
              <BookOpen className="w-4 h-4 text-emerald-500" />
              Integration Guide
            </button>

            {/* Quick Informative Info Sandbox Block */}
            <div className="pt-4 border-t border-slate-900 text-left px-3 space-y-2.5">
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block font-bold flex items-center gap-1">
                🛡️ Team Elite Tier
              </span>
              <p className="text-[11px] leading-relaxed text-slate-400">
                Aegis AI is crafted by <b>the elite tier</b> representing <b>Karnavati University</b> with professional Gujarati technological dexterity. Deployed on ultra-fast digital nodes.
              </p>
            </div>
          </nav>

          {/* Right Active Dashboard Canvas (Span 9) */}
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
              >
                {activeTab === "dashboard" && (
                  <DashboardTab scansUpdatedTick={syncTick} />
                )}

                {activeTab === "analyzer" && (
                  <FirewallAnalyzerTab onScanExecuted={handleScanExecuted} />
                )}

                {activeTab === "email-verify" && (
                  <EmailVerificationTab onScanExecuted={handleScanExecuted} />
                )}

                {activeTab === "simulator" && (
                  <AttackSimulatorTab onScanExecuted={handleScanExecuted} />
                )}

                {activeTab === "intel" && (
                  <IntelCenterTab />
                )}

                {activeTab === "rules" && (
                  <RulesManagerTab />
                )}

                {activeTab === "gateway" && (
                  <GatewayTab />
                )}

                {/* STEP-BY-STEP PROCEDURE HUD PAGE */}
                {activeTab === "guide" && (
                  <div className="space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                      <h2 className="text-xl font-semibold text-emerald-400 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-emerald-450" />
                        Aegis AI - Step-by-Step Tool Deployment Guide
                      </h2>
                      <p className="text-slate-400 text-sm mt-1">
                        Follow this top-to-bottom master recipe list to connect your MongoDB Database, launch on Vultr VM instances, hook up ElevenLabs voices, and wire up n8n webhooks.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {/* Section 1: MongoDB Setup */}
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-left">
                        <h3 className="font-bold text-sm text-slate-200 border-b border-slate-800 pb-2 flex items-center gap-2">
                          <Database className="w-4 h-4 text-emerald-400" />
                          Phase 1: Setting up MongoDB Atlas Cloud Database
                        </h3>
                        <ol className="list-decimal pl-5 mt-3 space-y-3 text-xs text-slate-300 leading-relaxed">
                          <li>Go to <a href="https://cloud.mongodb.com" target="_blank" rel="noreferrer" className="text-emerald-400 underline font-semibold">cloud.mongodb.com</a> and create a free account.</li>
                          <li>Click <b>Deploy Cloud Database</b>, choose the free <b>M0 Shared Sandbox cluster</b>, select any cloud provider region (e.g., AWS N.Virginia), and click create.</li>
                          <li>In Security Quickstart, assign a secure database login username and password. Memorize these credentials.</li>
                          <li>For Connection Protocol, choose <b>Drivers</b> and copy the complete Connection string URI:
                            <div className="p-2.5 bg-slate-950 rounded border border-slate-850 text-[11px] font-mono text-emerald-400 bg-slate-950 font-mono mt-1.5 truncate">
                              mongodb+srv://&lt;username&gt;:&lt;password&gt;@cluster0.abc12.mongodb.net/?retryWrites=true&w=majority
                            </div>
                          </li>
                          <li>In Network Access tab of Atlas, click <b>Add IP address</b>, and configure <code>0.0.0.0/0</code> (Allow Access from Anywhere) to let your server-container interface.</li>
                          <li>Open your private environments settings <code>.env.example</code> or <code>.env.local</code> in root, and assign keys:
                            <pre className="p-2.5 bg-slate-950 rounded border border-slate-850 text-[11px] font-mono mt-1 text-slate-400">
                              MONGODB_URI="your-copied-uri-with-password-substituted"<br />
                              MONGODB_DB="aegis_ai"
                            </pre>
                          </li>
                        </ol>
                      </div>

                      {/* Section 2: Vultr Deployment */}
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-left">
                        <h3 className="font-bold text-sm text-slate-200 border-b border-slate-800 pb-2 flex items-center gap-2">
                          <Server className="w-4 h-4 text-blue-400" />
                          Phase 2: Deploying Aegis AI Firewall to Vultr VC2 VM Instances
                        </h3>
                        <ol className="list-decimal pl-5 mt-3 space-y-3 text-xs text-slate-300 leading-relaxed">
                          <li>Access <a href="https://www.vultr.com" target="_blank" rel="noreferrer" className="text-blue-400 underline font-semibold">vultr.com</a> and provision a cloud instance.</li>
                          <li>Select <b>Cloud Compute VC2</b>, configure Debian / Ubuntu Server OS, and choose the most affordable CPU instance.</li>
                          <li>Use SSH to log into your VM terminal.</li>
                          <li>Prerequisite setup: Install Node.js v18+, NPM package managers, and compile/build dependencies:
                            <pre className="p-2.5 bg-slate-950 rounded border border-slate-850 text-[11px] font-mono mt-1 text-slate-400">
                              sudo apt update && sudo apt install nodejs npm -y
                            </pre>
                          </li>
                          <li>Git pull or upload your Aegis AI product files to the client, customize the `.env.local` keys, and run commands:
                            <pre className="p-2.5 bg-slate-950 rounded border border-slate-850 text-[11px] font-mono mt-1 text-slate-400">
                              npm install # This fetches all package files<br />
                              npm run build # Assembles production assets<br />
                              npm run start # Fires Node.js Express Server on Port 3000
                            </pre>
                          </li>
                          <li>Make sure to accept inbound connections by running <code>ufw allow 3000/tcp</code> so external proxies can hit Port 3000.</li>
                        </ol>
                      </div>

                      {/* Section 3: ElevenLabs Audio */}
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-left">
                        <h3 className="font-bold text-sm text-slate-200 border-b border-slate-800 pb-2 flex items-center gap-2">
                          <Volume2 className="w-4 h-4 text-pink-400" />
                          Phase 3: Connecting ElevenLabs Vocal Warn alerts
                        </h3>
                        <ol className="list-decimal pl-5 mt-3 space-y-3 text-xs text-slate-300 leading-relaxed">
                          <li>Create an account at <a href="https://elevenlabs.io" target="_blank" rel="noreferrer" className="text-pink-400 underline font-semibold">elevenlabs.io</a>.</li>
                          <li>Go to <b>Profile & API Keys</b> section, copy your generated security Key.</li>
                          <li>Select your preferred voice voice avatar from the voice library (e.g. Rachel model), click copy of ID parameter (e.g. <code>EXAVITQu4vr4xnSDxMaL</code>).</li>
                          <li>Append keys to your env:
                            <pre className="p-2.5 bg-slate-950 rounded border border-slate-850 text-[11px] font-mono mt-1 text-slate-450">
                              ELEVENLABS_API_KEY="your-api-key-here"<br />
                              ELEVENLABS_VOICE_ID="EXAVITQu4vr4xnSDxMaL"
                            </pre>
                          </li>
                          <li>Now, whenever threat vectors trigger inside simulation tests, Aegis AI automatically makes a server-to-server proxy fetch to stream text-to-speech alarm mp3 bytes securely!</li>
                        </ol>
                      </div>

                      {/* Section 4: n8n Automation */}
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-left">
                        <h3 className="font-bold text-sm text-slate-200 border-b border-slate-800 pb-2 flex items-center gap-2">
                          <Zap className="w-4 h-4 text-purple-400" />
                          Phase 4: Linking n8n Webhook Alerts Workflow Pipelines
                        </h3>
                        <ol className="list-decimal pl-5 mt-3 space-y-3 text-xs text-slate-300 leading-relaxed">
                          <li>Launch n8n (either via n8n cloud or deploy on your Vultr server via Docker <code>docker run -d --name n8n -p 5678:5678 n8nio/n8n</code>).</li>
                          <li>In n8n GUI, create a <b>New Workflow</b>. Click the 3-dot top-right corner, select "Import From File", and select the preconfigured workflow definition at <code>/n8n-workflows/sentinel-threat-automation.json</code>.</li>
                          <li>Double-click the Webhook trigger node <b>"Webhook - Receive Threat Alert"</b>, copy the production route URI:
                            <div className="p-2 bg-slate-950 rounded border border-slate-850 text-[11px] font-mono text-emerald-400 font-mono mt-1 truncate">
                              https://&lt;your-n8n-instance&gt;/webhook/sentinel-alerts
                            </div>
                          </li>
                          <li>Assign this exact URL inside <code>.env.local</code>:
                            <pre className="p-2 bg-slate-950 rounded border border-slate-850 text-[11px] font-mono mt-1 text-slate-400">
                              N8N_WEBHOOK_URL="https://yourworkspaces.hooks.n8n.cloud/webhook/sentinel-alerts"
                            </pre>
                          </li>
                          <li>Turn the active Toggle in n8n's top-right corner to <b>ON</b>.</li>
                          <li>When high-risk blockages occur, n8n automatically dispatches immediate Slack pings or SMTP alerts to the SOC security team autonomously!</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Footer copyright with detailed custom info */}
      <footer className="mt-16 border-t border-slate-900 bg-slate-950/80 backdrop-blur-md relative z-10 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-900 text-left">
            {/* Branding Column */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Shield className="w-4 h-4 text-emerald-450" />
                </div>
                <span className="font-bold text-sm text-white tracking-widest font-mono">AEGIS AI</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                રક્ષક — Modern prompt injection shield and security operations dashboard protecting autonomous intelligent agents from manipulation and threat vulnerabilities.
              </p>
              <div className="text-[11px] font-mono text-emerald-400 font-semibold bg-emerald-500/5 border border-emerald-500/20 rounded px-2.5 py-1 inline-block">
                📍 Karnavati University Sandbox Center
              </div>
            </div>

            {/* Gujrati Skills & Showcase Column */}
            <div className="space-y-3 text-xs">
              <h4 className="font-semibold text-slate-200 uppercase font-mono tracking-wider">Gujarati Tech Initiative</h4>
              <p className="text-slate-400 leading-relaxed">
                Developed in the spirit of Gujarat's rich heritage of enterprise and modern software resilience. Showcasing premium dynamic dashboard integrations, audio alarm synthesis, and AI firewall heuristics.
              </p>
              <p className="text-slate-500 italic">
                "સુરક્ષા એ જ સર્વોપરી ધર્મ છે" (Security is the supreme defense)
              </p>
            </div>

            {/* Contacts & Core Team column */}
            <div className="space-y-3 text-xs">
              <h4 className="font-semibold text-slate-200 uppercase font-mono tracking-wider">Contact & Operations</h4>
              <ul className="space-y-2 text-slate-400 font-mono text-[11px]">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400 font-semibold">📞 Phone:</span>
                  <a href="tel:+917016488234" className="hover:text-emerald-400 transition">7016488XXX</a>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400 font-semibold">✉️ Email:</span>
                  <a href="mailto:aegisai@info" className="hover:text-emerald-400 transition">aegisai@info</a>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-slate-400">🏢 Institution:</span>
                  <span className="text-slate-300">Karnavati University</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-mono gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <p>© 2026 AEGIS AI CORP. ALL CHANNELS SECURED INBOUND.</p>
              <p className="text-[11px] text-slate-400">
                From <span className="text-emerald-400 font-semibold font-sans">Karnavati university showcasing Gujrati skills</span>.
              </p>
            </div>

            <div className="flex flex-col sm:items-end gap-1 text-center sm:text-right">
              <span className="text-emerald-400 font-bold bg-slate-905 border border-slate-800 px-3 py-1 rounded">
                Made with ❤️ by team <span className="uppercase text-slate-200">The Elite Tier</span>
              </span>
              <span className="text-[10px] text-slate-650">MONGODB: ACTIVE • VOICE: ONLINE • HOST: VULTR</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
