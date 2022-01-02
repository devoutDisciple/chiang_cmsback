const express = require('express');

const router = express.Router();
const attentionService = require('../services/attentionService');

// 关注用户
router.post('/attentionUser', (req, res) => {
	attentionService.attentionUser(req, res);
});

// 获取关注的用户
router.get('/myAttentionUsers', (req, res) => {
	attentionService.getMyAttentionUsers(req, res);
});

module.exports = router;
