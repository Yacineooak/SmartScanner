import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  startScan,
  getScanStatus,
  getScanResults,
  getScanHistory,
  exportScan
} from '../controllers/scanController.js';

const router = express.Router();

router.use(authenticateToken);

router.post('/:scanType', startScan);
router.get('/status/:scanId', getScanStatus);
router.get('/results/:scanId', getScanResults);
router.get('/history', getScanHistory);
router.get('/export/:scanId', exportScan);

export default router;