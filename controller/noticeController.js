const express = require('express');

const router = express.Router();
const noticeService = require('../services/noticeService');

// 获取公告
router.get('/notices', (req, res) => {
	noticeService.getNotices(req, res);
});

// 获取公告详情
router.get('/noticeDetail', (req, res) => {
	noticeService.getNoticeDetail(req, res);
});

module.exports = router;
