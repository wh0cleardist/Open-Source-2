import { Router } from 'express';
import * as inventory from '../controllers/inventory.controller.js';

const router = Router();

router.get('/low-stock', inventory.getLowStock);
router.post('/adjust/:id', inventory.adjustStock);
router.get('/movements/:medicineId', inventory.getMovements);

export default router;
