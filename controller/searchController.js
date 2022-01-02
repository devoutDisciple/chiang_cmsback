const express = require('express');

const router = express.Router();
const searchService = require('../services/searchService');

// 搜索帖子博客
router.get('/txtContents', (req, res) => {
	searchService.getTxtContents(req, res);
});

// 搜索投票
router.get('/voteContents', (req, res) => {
	searchService.getVoteContents(req, res);
});

// 搜索PK
router.get('/battleContents', (req, res) => {
	searchService.getBattleContents(req, res);
});

// 搜索视频
router.get('/videoContents', (req, res) => {
	searchService.getVideoContents(req, res);
});

// 根据种类模糊搜索圈子
router.get('/circles', (req, res) => {
	searchService.getCircles(req, res);
});

// 根据种类模糊搜索用户
router.get('/users', (req, res) => {
	searchService.getUsers(req, res);
});

module.exports = router;
