const express = require('express');

const router = express.Router();
const topicService = require('../services/topicService');

// 根据圈子id获取话题
router.get('/allByCircleId', (req, res) => {
	topicService.getAllByCircleId(req, res);
});

// 删除话题
router.post('/delete', (req, res) => {
	topicService.deleteTopicById(req, res);
});

// 新增话题
router.post('/add', (req, res) => {
	topicService.addTopic(req, res);
});

module.exports = router;
