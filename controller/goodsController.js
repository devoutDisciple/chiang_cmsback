const express = require('express');

const router = express.Router();
const goodsService = require('../services/goodsService');

// 查看帖子的评论
router.get('/allByContentId', (req, res) => {
	goodsService.getAllByContentId(req, res);
});

module.exports = router;
