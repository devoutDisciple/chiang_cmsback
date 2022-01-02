const express = require('express');
const multer = require('multer');
const config = require('../config/config');
const ObjectUtil = require('../util/ObjectUtil');

const router = express.Router();
const bgService = require('../services/bgService');

let filename = '';
// 使用硬盘存储模式设置存放接收到的文件的路径以及文件名
const storage = multer.diskStorage({
	destination(req, file, cb) {
		// 接收到文件后输出的保存路径（若不存在则需要创建）
		cb(null, config.userBgPath);
	},
	filename(req, file, cb) {
		// 将保存文件名设置为 随机字符串 + 时间戳名，比如 JFSDJF323423-1342342323.png
		filename = `${ObjectUtil.getName()}-${Date.now()}.png`;
		cb(null, filename);
	},
});
const upload = multer({ dest: config.userBgPath, storage });

// 上传背景图
router.post('/uploadBg', upload.single('file'), (req, res) => {
	bgService.uploadBg(req, res, filename);
});

// 获取所有默认背景图
router.get('/defalutBgImg', (req, res) => {
	bgService.getDefalutBgImg(req, res);
});

// 保存背景图url
router.post('/saveBgUrl', (req, res) => {
	bgService.saveBgUrl(req, res);
});

module.exports = router;
