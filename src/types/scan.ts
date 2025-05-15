export type ScanType = 
  | 'tcp' 
  | 'udp' 
  | 'quick' 
  | 'syn' 
  | 'os' 
  | 'firewall' 
  | 'network' 
  | 'multi-ip' 
  | 'banner' 
  | 'cve';

export interface ScanResult {
  id: string;
  ip: string;
  port?: number;
  protocol?: string;
  service?: string;
  cveCount?: number;
  status: 'open' | 'closed' | 'filtered';
  details?: string;
  osInfo?: string;
  timestamp: string;
}

export interface CVEInfo {
  id: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  cvssScore?: number;
  references?: string[];
  publishedDate?: string;
  lastModifiedDate?: string;
}

export interface AIInsight {
  summary: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  recommendations: string[];
}

export interface ScanSession {
  id: string;
  userId: string;
  scanType: ScanType;
  target: string;
  portRange?: string;
  timestamp: string;
  status: 'in-progress' | 'completed' | 'failed';
  results?: ScanResult[];
  cveDetails?: Record<string, CVEInfo[]>;
  insights?: AIInsight;
}

export interface ScanHistoryItem {
  id: string;
  scanType: ScanType;
  target: string;
  timestamp: string;
  resultCount: number;
  vulnerabilityCount: number;
  status: 'completed' | 'failed';
}

export interface ScanFormData {
  target: string;
  portRange: string;
  scanType: ScanType;
  options?: {
    timeout?: number;
    concurrency?: number;
    detectVersion?: boolean;
    skipDiscovery?: boolean;
  };
}