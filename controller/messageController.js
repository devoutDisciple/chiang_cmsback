const express = require('express');
const multer = require('multer');
const config = require('../config/config');
const ObjectUtil = require('../util/ObjectUtil');

const router = express.Router();
const messageService = require('../services/messageService');

let filename = '';
// 使用硬盘存储模式设置存放接收到的文件的路径以及文件名
const storage = multer.diskStorage({
	destination(req, file, cb) {
		// 接收到文件后输出的保存路径（若不存在则需要创建）
		cb(null, config.msgPath);
	},
	filename(req, file, cb) {
		// 将保存文件名设置为 随机字符串 + 时间戳名，比如 JFSDJF323423-1342342323.png
		filename = `${ObjectUtil.getName()}-${Date.now()}.png`;
		cb(null, filename);
	},
});
const upload = multer({ dest: config.msgPath, storage });

// 上传图片
router.post('/uploadImg', upload.single('file'), (req, res) => {
	messageService.uploadImg(req, res, filename);
});

// 增加信息
router.post('/addMsg', (req, res) => {
	messageService.addMsg(req, res);
});

// 获取信息
router.get('/msgsByUserId', (req, res) => {
	messageService.msgsByUserId(req, res);
});

module.exports = router;
