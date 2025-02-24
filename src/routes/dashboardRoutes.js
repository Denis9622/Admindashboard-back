import express from 'express';
import {
  getDashboardStatistics,
  getRecentCustomers,
  getIncomeExpenses,
} from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/statistics', getDashboardStatistics);
router.get('/recent-customers', getRecentCustomers);
router.get('/income-expenses', getIncomeExpenses);

export default router;
