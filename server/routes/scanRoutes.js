import express from 'express';
import { 
  startTcpScan, 
  startUdpScan, 
  startQuickScan, 
  startSynScan, 
  startOsScan,
  startFirewallScan,
  startNetworkScan,
  startMultiIpScan,
  startBannerScan,
  getScanStatus,
  getScanResults
} from '../controllers/scanController.js';

const router = express.Router();

// Start scan routes
router.post('/tcp', startTcpScan);
router.post('/udp', startUdpScan);
router.post('/quick', startQuickScan);
router.post('/syn', startSynScan);
router.post('/os', startOsScan);
router.post('/firewall', startFirewallScan);
router.post('/network', startNetworkScan);
router.post('/multi-ip', startMultiIpScan);
router.post('/banner', startBannerScan);

// Get scan status and results
router.get('/status/:scanId', getScanStatus);
router.get('/results/:scanId', getScanResults);

export default router;