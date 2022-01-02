const express = require('express');

const router = express.Router();
const voteService = require('../services/voteService');

// 新增投票
router.post('/addVote', (req, res) => {
	voteService.addVote(req, res);
});

// 选择某一项
router.post('/selectVoteItem', (req, res) => {
	voteService.selectVoteItem(req, res);
});

module.exports = router;
