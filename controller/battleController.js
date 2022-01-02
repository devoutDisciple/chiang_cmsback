const express = require('express');
const multer = require('multer');
const config = require('../config/config');
const ObjectUtil = require('../util/ObjectUtil');

const router = express.Router();
const battleService = require('../services/battleService');

let filename = '';
// 使用硬盘存储模式设置存放接收到的文件的路径以及文件名
const storage = multer.diskStorage({
	destination(req, file, cb) {
		// 接收到文件后输出的保存路径（若不存在则需要创建）
		cb(null, config.battlePath);
	},
	filename(req, file, cb) {
		// 将保存文件名设置为 随机字符串 + 时间戳名，比如 JFSDJF323423-1342342323.png
		filename = `${ObjectUtil.getName()}-${Date.now()}.png`;
		cb(null, filename);
	},
});
const upload = multer({ dest: config.battlePath, storage });

// 上传对决图片
router.post('/uploadImg', upload.single('file'), (req, res) => {
	battleService.uploadImg(req, res, filename);
});

// 新增pk
router.post('/addBattle', (req, res) => {
	battleService.addBattle(req, res);
});

// 选择某一个
router.post('/selectBattleItem', (req, res) => {
	battleService.selectBattleItem(req, res);
});

module.exports = router;
