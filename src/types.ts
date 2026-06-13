export type ScanType = 'prompt' | 'url' | 'ip' | 'file' | 'email';

export type ThreatStatus = 'Safe' | 'Suspicious' | 'Dangerous';

export interface ScanResult {
  id: string; // Mongo ID or generated UUID
  type: ScanType;
  payload: string;
  status: ThreatStatus;
  riskScore: number; // 0 to 100
  category: string;
  explanation: string;
  timestamp: string;
  mitigation: string;
  rulesTriggered: string[];
  details: {
    source?: string;
    virustotal?: any;
    abuseipdb?: any;
    urlscan?: any;
    localRuleCount?: number;
    vectorSimilarityScore?: number;
    isSimulated?: boolean;
    agentTarget?: string;
  };
}

export interface SecurityStats {
  totalScanned: number;
  blockedAttacks: number;
  safeCount: number;
  suspiciousCount: number;
  dangerousCount: number;
  averageRiskScore: number;
  categoryDistribution: { [category: string]: number };
  scansByDay: { day: string; count: number; blocked: number }[];
}

export interface SystemRules {
  id: string;
  name: string;
  pattern: string;
  category: string;
  severity: ThreatStatus;
  enabled: boolean;
}
