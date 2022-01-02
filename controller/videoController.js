const express = require('express');
const multer = require('multer');
const config = require('../config/config');
const ObjectUtil = require('../util/ObjectUtil');

const router = express.Router();
const postsService = require('../services/postsService');

let filename = '';
// 使用硬盘存储模式设置存放接收到的文件的路径以及文件名
const storage = multer.diskStorage({
	destination(req, file, cb) {
		// 接收到文件后输出的保存路径（若不存在则需要创建）
		cb(null, config.videoPath);
	},
	filename(req, file, cb) {
		// 将保存文件名设置为 随机字符串 + 时间戳名，比如 JFSDJF323423-1342342323.png
		let suffix = '.mp4';
		if (file.originalname && file.originalname.includes('.')) {
			suffix = file.originalname.split('.')[1];
		}
		filename = `${ObjectUtil.getName()}-${Date.now()}.${suffix}`;
		cb(null, filename);
	},
});
const upload = multer({ dest: config.videoPath, storage });

// 上传视频
router.post('/upload', upload.single('file'), (req, res) => {
	postsService.uploadVideo(req, res, filename);
});

module.exports = router;
