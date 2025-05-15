import express from 'express';
import { getCve, searchCves } from '../controllers/cveController.js';

const router = express.Router();

router.get('/:cveId', getCve);
router.get('/search', searchCves);

export default router;