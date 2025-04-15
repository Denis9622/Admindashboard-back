import express from 'express';
import {
  getDashboardStatistics,
  getRecentCustomers,
  getIncomeExpenses,
  getCustomersWithSpent, 
} from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/statistics', getDashboardStatistics);
router.get('/recent-customers', getRecentCustomers);
router.get('/income-expenses', getIncomeExpenses);
router.get('/customers-with-spent', getCustomersWithSpent); 

export default router;
