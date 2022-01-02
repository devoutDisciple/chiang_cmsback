const express = require('express');

const router = express.Router();
const viewService = require('../services/viewService');

// 新增浏览记录
router.post('/addRecord', (req, res) => {
	viewService.addRecord(req, res);
});

// 获取被浏览历史
router.get('/recordsByUserId', (req, res) => {
	viewService.getRecordsByUserId(req, res);
});

// 获取用户被浏览历史详情
router.get('/recordsDetailByUserId', (req, res) => {
	viewService.getRecordsDetailByUserId(req, res);
});

module.exports = router;
