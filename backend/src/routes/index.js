const express = require('express');
const router = express.Router();
const insightsController = require('../controllers/insightsController');

// Insights endpoints
router.get('/insights/summary', insightsController.getSummary);
router.get('/insights/student/:studentId', insightsController.getStudentDetail);
router.get('/insights/leaderboard', insightsController.getLeaderboard);

// ML recommendation endpoint
router.get('/ml/recommendation/:studentId', insightsController.getRecommendation);

module.exports = router;
