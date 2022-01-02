const express = require('express');

const router = express.Router();
const replyService = require('../services/replyService');

// 获取内容的评论
router.get('/allByContentId', (req, res) => {
	replyService.getAllByContentId(req, res);
});

// 获取评论的回复
router.get('/allByCommentId', (req, res) => {
	replyService.getAllByCommentId(req, res);
});

// 获取热门评论 getHotReply
router.get('/hotReplyByContentId', (req, res) => {
	replyService.getHotReplyByContentId(req, res);
});

// 删除评论
router.post('/deleteCommentById', (req, res) => {
	replyService.deleteCommentById(req, res);
});

module.exports = router;
