import { v4 as uuidv4 } from 'uuid';
import { saveScan, getScan } from '../database/scanStore.js';
import { simulateTcpScan } from '../services/scanService.js';
import { fetchCveData } from '../services/cveService.js';
import { generateAiInsights } from '../services/aiService.js';

// Common function to handle scan requests
const handleScanRequest = async (req, res, scanType) => {
  try {
    const { target, portRange, options } = req.body;
    
    if (!target) {
      return res.status(400).json({ error: 'Target is required' });
    }
    
    // Create a scan session
    const scanId = uuidv4();
    const scanSession = {
      id: scanId,
      userId: req.user?.id || 'anonymous',
      scanType,
      target,
      portRange,
      timestamp: new Date().toISOString(),
      status: 'in-progress',
    };
    
    // Save initial scan session
    await saveScan(scanSession);
    
    // Start scan process asynchronously
    processScan(scanSession, options);
    
    // Return scan ID immediately
    res.status(202).json({ 
      scanId, 
      message: `${scanType} scan started`,
      status: 'in-progress'
    });
  } catch (error) {
    console.error(`Error starting ${scanType} scan:`, error);
    res.status(500).json({ error: `Failed to start ${scanType} scan` });
  }
};

// Process scan in background
const processScan = async (scanSession, options) => {
  try {
    // Simulate scan based on type
    let results;
    switch (scanSession.scanType) {
      case 'tcp':
      case 'udp':
      case 'quick':
      case 'syn':
      case 'os':
      case 'firewall':
      case 'network':
      case 'multi-ip':
      case 'banner':
        results = await simulateTcpScan(scanSession.target, scanSession.portRange, options);
        break;
      default:
        results = [];
    }
    
    // Get CVE data for open ports/services
    const cveDetails = {};
    for (const result of results) {
      if (result.service && result.status === 'open') {
        const cveData = await fetchCveData(result.service);
        if (cveData && cveData.length > 0) {
          cveDetails[result.id] = cveData;
        }
      }
    }
    
    // Generate AI insights if vulnerabilities found
    let insights = null;
    const vulnCount = Object.keys(cveDetails).length;
    if (vulnCount > 0) {
      insights = await generateAiInsights(results, cveDetails);
    }
    
    // Update scan with results
    const updatedScan = {
      ...scanSession,
      status: 'completed',
      results,
      cveDetails,
      insights,
      completedAt: new Date().toISOString()
    };
    
    await saveScan(updatedScan);
  } catch (error) {
    console.error(`Error processing scan ${scanSession.id}:`, error);
    
    // Update scan with error status
    const failedScan = {
      ...scanSession,
      status: 'failed',
      error: error.message,
      completedAt: new Date().toISOString()
    };
    
    await saveScan(failedScan);
  }
};

// Controller methods for different scan types
export const startTcpScan = (req, res) => handleScanRequest(req, res, 'tcp');
export const startUdpScan = (req, res) => handleScanRequest(req, res, 'udp');
export const startQuickScan = (req, res) => handleScanRequest(req, res, 'quick');
export const startSynScan = (req, res) => handleScanRequest(req, res, 'syn');
export const startOsScan = (req, res) => handleScanRequest(req, res, 'os');
export const startFirewallScan = (req, res) => handleScanRequest(req, res, 'firewall');
export const startNetworkScan = (req, res) => handleScanRequest(req, res, 'network');
export const startMultiIpScan = (req, res) => handleScanRequest(req, res, 'multi-ip');
export const startBannerScan = (req, res) => handleScanRequest(req, res, 'banner');

// Get scan status
export const getScanStatus = async (req, res) => {
  try {
    const { scanId } = req.params;
    const scan = await getScan(scanId);
    
    if (!scan) {
      return res.status(404).json({ error: 'Scan not found' });
    }
    
    res.status(200).json({
      scanId: scan.id,
      status: scan.status,
      progress: calculateProgress(scan),
      startedAt: scan.timestamp,
      completedAt: scan.completedAt
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get scan status' });
  }
};

// Get scan results
export const getScanResults = async (req, res) => {
  try {
    const { scanId } = req.params;
    const scan = await getScan(scanId);
    
    if (!scan) {
      return res.status(404).json({ error: 'Scan not found' });
    }
    
    res.status(200).json(scan);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get scan results' });
  }
};

// Helper function to calculate scan progress
const calculateProgress = (scan) => {
  if (scan.status === 'completed') return 100;
  if (scan.status === 'failed') return 100;
  
  // For in-progress scans, estimate progress
  const startTime = new Date(scan.timestamp).getTime();
  const now = Date.now();
  const elapsedMs = now - startTime;
  
  // Assume average scan takes 30 seconds
  const estimatedProgress = Math.min(95, Math.floor((elapsedMs / 30000) * 100));
  
  return estimatedProgress;
};