const express = require('express');

const router = express.Router();
const addressService = require('../services/addressService');

// 获取所有地区
router.get('/getAll', (req, res) => {
	addressService.getAll(req, res);
});

module.exports = router;
