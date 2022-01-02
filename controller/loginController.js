const express = require('express');

const router = express.Router();
const loginService = require('../services/loginService');

// 使用微信登录
router.post('/loginByWxOpenid', (req, res) => {
	loginService.loginByWxOpenid(req, res);
});

module.exports = router;
