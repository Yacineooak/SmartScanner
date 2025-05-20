import net from 'net';
import { promisify } from 'util';
import { exec } from 'child_process';
import axios from 'axios';
import { searchVulnerabilities } from './nvdService.js';
import { generateAiInsights } from './aiService.js';
import Scan from '../models/Scan.js';

const execAsync = promisify(exec);
const PYTHON_SCAN_SERVICE = 'http://localhost:5001';

export const startScan = async (userId, scanType, target, portRange) => {
  try {
    // Create scan record
    const scan = await Scan.create({
      userId,
      scanType,
      target,
      portRange,
      status: 'in-progress',
      startTime: new Date()
    });

    // Start scan process asynchronously
    processScan(scan);

    return scan;
  } catch (error) {
    console.error('Error starting scan:', error);
    throw error;
  }
};

const processScan = async (scan) => {
  try {
    // Call Python scan service
    const response = await axios.post(`${PYTHON_SCAN_SERVICE}/scan/${scan.scanType}`, {
      target: scan.target,
      portRange: scan.portRange
    });

    const results = response.data;

    // Enrich with vulnerabilities
    const vulnerabilities = {};
    for (const result of results) {
      if (result.service) {
        const vulns = await searchVulnerabilities(result.service);
        if (vulns.length > 0) {
          vulnerabilities[result.port] = vulns;
        }
      }
    }

    // Generate AI insights
    const insights = await generateAiInsights(results, vulnerabilities);

    // Update scan record
    await scan.update({
      status: 'completed',
      results,
      vulnerabilities,
      insights,
      endTime: new Date()
    });
  } catch (error) {
    console.error(`Error processing scan ${scan.id}:`, error);
    await scan.update({
      status: 'failed',
      endTime: new Date()
    });
  }
};

export const getScanStatus = async (scanId) => {
  const scan = await Scan.findByPk(scanId);
  if (!scan) {
    throw new Error('Scan not found');
  }
  return {
    id: scan.id,
    status: scan.status,
    progress: calculateProgress(scan),
    startTime: scan.startTime,
    endTime: scan.endTime
  };
};

const calculateProgress = (scan) => {
  if (scan.status === 'completed') return 100;
  if (scan.status === 'failed') return 0;
  
  const now = new Date();
  const start = new Date(scan.startTime);
  const elapsed = now - start;
  
  // Estimate progress based on typical scan duration
  const estimatedDuration = 300000; // 5 minutes
  return Math.min(95, Math.floor((elapsed / estimatedDuration) * 100));
};

export const getScanResults = async (scanId) => {
  const scan = await Scan.findByPk(scanId);
  if (!scan) {
    throw new Error('Scan not found');
  }
  return scan;
};

export const getScanHistory = async (userId) => {
  return await Scan.findAll({
    where: { userId },
    order: [['startTime', 'DESC']],
    limit: 10
  });
};