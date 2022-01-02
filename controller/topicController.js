const express = require('express');

const router = express.Router();
const topicService = require('../services/topicService');

// 获取话题根据圈子id
router.get('/getByCircleId', (req, res) => {
	topicService.getByCircleId(req, res);
});

// 根据多个圈子id获取话题 // 获取个人圈子
router.get('/getByCircleIds', (req, res) => {
	topicService.getByCircleIds(req, res);
});

module.exports = router;
