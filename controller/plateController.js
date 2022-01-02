const express = require('express');

const router = express.Router();
const plateService = require('../services/plateService');

// 获取板块信息
router.get('/all', (req, res) => {
	plateService.getAll(req, res);
});

// 获取模块详细信息
router.get('/detailByPlateId', (req, res) => {
	plateService.getDetailByPlateId(req, res);
});

module.exports = router;
