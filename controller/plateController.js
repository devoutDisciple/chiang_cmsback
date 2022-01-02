const express = require('express');
const multer = require('multer');
const ObjectUtil = require('../util/ObjectUtil');
const config = require('../config/config');

const router = express.Router();
const plateService = require('../services/plateService');

let filename = '';
// 使用硬盘存储模式设置存放接收到的文件的路径以及文件名
const storage = multer.diskStorage({
	destination(req, file, cb) {
		// 接收到文件后输出的保存路径（若不存在则需要创建）
		cb(null, config.platePath);
	},
	filename(req, file, cb) {
		// 将保存文件名设置为 随机字符串 + 时间戳名，比如 JFSDJF323423-1342342323.png
		filename = `${ObjectUtil.getName()}-${Date.now()}.png`;
		cb(null, filename);
	},
});
const upload = multer({ dest: config.platePath, storage });

// 分页获取板块数据
router.get('/platesByPage', (req, res) => {
	plateService.getPlatesByPage(req, res);
});

// 获取全部模块
router.get('/allPlates', (req, res) => {
	plateService.getAllPlates(req, res);
});

// 删除模块
router.post('/deleteById', (req, res) => {
	plateService.deleteById(req, res);
});

// 新增模块
router.post('/add', (req, res) => {
	plateService.addPlate(req, res);
});

// 编辑模块
router.post('/edit', (req, res) => {
	plateService.editPlate(req, res);
});

// 上传模块图片
router.post('/upload', upload.single('file'), (req, res) => {
	plateService.uploadImg(req, res, filename);
});

module.exports = router;
