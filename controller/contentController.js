const express = require('express');

const router = express.Router();
const contentService = require('../services/contentService');

// 使用硬盘存储模式设置存放接收到的文件的路径以及文件名

// 分页获取内容
router.get('/contentsByPage', (req, res) => {
	contentService.getContentsByPage(req, res);
});

// 获取内容详情
router.get('/contentDetail', (req, res) => {
	contentService.getContentDetail(req, res);
});

// 删除内容
router.get('/deleteById', (req, res) => {
	contentService.deleteById(req, res);
});

module.exports = router;
