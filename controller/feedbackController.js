const express = require('express');

const router = express.Router();
const feebackService = require('../services/feebackService');

// 获取地区
router.get('/all', (req, res) => {
	feebackService.getAll(req, res);
});

module.exports = router;
