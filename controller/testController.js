const express = require('express');

const router = express.Router();
const testService = require('../services/testService');

// 测试
router.get('/test', (req, res) => {
	testService.test(req, res);
});

// 测试
router.get('/test2', (req, res) => {
	testService.test2(req, res);
});

module.exports = router;
