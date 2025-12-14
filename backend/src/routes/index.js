const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');
const insightsController = require('../controllers/insightsController');

// Data endpoints
router.get('/data/sample', dataController.getSample);
router.post('/data/import', dataController.importData);

// Insights endpoints
router.get('/insights/summary', insightsController.getSummary);
router.get('/insights/student/:studentId', insightsController.getStudentDetail);
router.get('/insights/leaderboard', insightsController.getLeaderboard);

// Records endpoint
router.get('/records', dataController.getRecords);

// ML recommendation endpoint
router.get('/ml/recommendation/:studentId', insightsController.getRecommendation);

module.exports = router;
