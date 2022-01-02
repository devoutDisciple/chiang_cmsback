const express = require('express');

const router = express.Router();
const dataService = require('../services/dataService');

// 获取统计数据
router.get('/total', (req, res) => {
	dataService.getTotal(req, res);
});

// 获取用户增长数据
router.get('/userNumData', (req, res) => {
	dataService.getUserNumData(req, res);
});

// 获取发布内容增长数据
router.get('/publishNumData', (req, res) => {
	dataService.getPublishNumData(req, res);
});

// 获取评论增长数据
router.get('/commentsNumData', (req, res) => {
	dataService.getCommentsNumData(req, res);
});

// 获取点赞增长数据
router.get('/goodsNumData', (req, res) => {
	dataService.getGoodsNumData(req, res);
});

module.exports = router;
