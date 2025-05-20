import Scan from '../models/Scan.js';
import { scanTarget, detectOS } from '../services/scanService.js';
import { searchVulnerabilities } from '../services/nvdService.js';
import { getIpLocation, getCachedLocation, cacheLocation } from '../services/geoipService.js';
import { generatePDF, generateCSV, generateJSON, streamFile } from '../services/exportService.js';
import { sendCriticalAlert } from '../services/notificationService.js';

export const startScan = async (req, res) => {
  try {
    const { target, portRange, scanType } = req.body;
    const userId = req.user.id;

    const scan = await Scan.create({
      userId,
      scanType,
      target,
      portRange,
      status: 'in-progress'
    });

    // Start scan process asynchronously
    processScan(scan);

    res.status(202).json({
      scanId: scan.id,
      message: `${scanType} scan started`,
      status: 'in-progress'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const processScan = async (scan) => {
  try {
    let results;
    
    switch (scan.scanType) {
      case 'os':
        results = await detectOS(scan.target);
        break;
      default:
        results = await scanTarget(scan.target, scan.portRange || '1-1000');
    }

    const vulnerabilities = {};
    for (const result of results) {
      if (result.service) {
        const vulns = await searchVulnerabilities(result.service);
        if (vulns.length > 0) {
          vulnerabilities[result.port] = vulns;
        }
      }
    }

    await scan.update({
      status: 'completed',
      results,
      vulnerabilities,
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

export const getScanStatus = async (req, res) => {
  try {
    const scan = await Scan.findByPk(req.params.scanId);
    
    if (!scan) {
      return res.status(404).json({ error: 'Scan not found' });
    }

    if (scan.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json({
      id: scan.id,
      status: scan.status,
      startTime: scan.startTime,
      endTime: scan.endTime
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getScanResults = async (req, res) => {
  try {
    const scan = await Scan.findByPk(req.params.scanId);
    
    if (!scan) {
      return res.status(404).json({ error: 'Scan not found' });
    }

    if (scan.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json(scan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getScanHistory = async (req, res) => {
  try {
    const scans = await Scan.findAll({
      where: { userId: req.user.id },
      order: [['startTime', 'DESC']],
      limit: 10
    });

    res.json(scans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const exportScan = async (req, res) => {
  try {
    const { scanId } = req.params;
    const { format = 'pdf' } = req.query;
    
    const scan = await Scan.findByPk(scanId);
    if (!scan) {
      return res.status(404).json({ error: 'Scan not found' });
    }

    if (scan.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    let data;
    let filename;
    let contentType;

    switch (format.toLowerCase()) {
      case 'pdf':
        data = await generatePDF(scan);
        filename = `scan-${scanId}.pdf`;
        contentType = 'application/pdf';
        break;
      case 'csv':
        data = await generateCSV(scan);
        filename = `scan-${scanId}.csv`;
        contentType = 'text/csv';
        break;
      case 'json':
        data = await generateJSON(scan);
        filename = `scan-${scanId}.json`;
        contentType = 'application/json';
        break;
      default:
        return res.status(400).json({ error: 'Invalid format' });
    }

    streamFile(res, data, filename, contentType);
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Export failed' });
  }
};