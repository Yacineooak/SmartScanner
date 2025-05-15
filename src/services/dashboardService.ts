import { ScanHistoryItem } from '../types/scan';
import { delay } from '../lib/utils';

// Mock dashboard statistics data
export async function fetchDashboardStats() {
  // Simulate API call delay
  await delay(800);
  
  return {
    totalScans: 142,
    totalVulnerabilities: 384,
    openPorts: 93,
    scannedHosts: 28,
    criticalVulnerabilities: 12,
  };
}

// Mock recent scans data
export async function fetchRecentScans(limit: number = 5): Promise<ScanHistoryItem[]> {
  // Simulate API call delay
  await delay(1000);
  
  const mockScans: ScanHistoryItem[] = [
    {
      id: 'scan-001',
      scanType: 'tcp',
      target: '192.168.1.1',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      resultCount: 24,
      vulnerabilityCount: 3,
      status: 'completed',
    },
    {
      id: 'scan-002',
      scanType: 'os',
      target: '10.0.0.5',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      resultCount: 1,
      vulnerabilityCount: 0,
      status: 'completed',
    },
    {
      id: 'scan-003',
      scanType: 'cve',
      target: 'example.com',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
      resultCount: 18,
      vulnerabilityCount: 8,
      status: 'completed',
    },
    {
      id: 'scan-004',
      scanType: 'network',
      target: '192.168.0.0/24',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      resultCount: 56,
      vulnerabilityCount: 12,
      status: 'completed',
    },
    {
      id: 'scan-005',
      scanType: 'quick',
      target: '172.16.1.2',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
      resultCount: 10,
      vulnerabilityCount: 0,
      status: 'completed',
    },
  ];
  
  return mockScans.slice(0, limit);
}