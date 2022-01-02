const express = require('express');
const multer = require('multer');
const config = require('../config/config');
const ObjectUtil = require('../util/ObjectUtil');

const router = express.Router();
const userService = require('../services/userService');

let filename = '';
// 使用硬盘存储模式设置存放接收到的文件的路径以及文件名
const storage = multer.diskStorage({
	destination(req, file, cb) {
		// 接收到文件后输出的保存路径（若不存在则需要创建）
		cb(null, config.userPhotoPath);
	},
	filename(req, file, cb) {
		// 将保存文件名设置为 随机字符串 + 时间戳名，比如 JFSDJF323423-1342342323.png
		filename = `${ObjectUtil.getName()}-${Date.now()}.png`;
		cb(null, filename);
	},
});
const upload = multer({ dest: config.userPhotoPath, storage });

// 获取用户基本信息，通过userid
router.get('/userDetailByUserId', (req, res) => {
	userService.getUserDetailByUserId(req, res);
});

// 上传用户头像
router.post('/uploadPhoto', upload.single('file'), (req, res) => {
	userService.uploadPhoto(req, res, filename);
});

// 修改个人信息
router.post('/updateMsg', (req, res) => {
	userService.updateMsg(req, res);
});

// 获取个人统计信息， 收获多少赞，发布，关注，粉丝
router.get('/userData', (req, res) => {
	userService.userData(req, res);
});

// 获取关注我的用户
router.get('/attentionMeByUserId', (req, res) => {
	userService.getAttentionMeByUserId(req, res);
});

// 获取是否已经关注某用户
router.get('/hadAttentionUser', (req, res) => {
	userService.getHadAttentionUser(req, res);
});

// 获取积分排行前三名
router.get('/mostIntegral', (req, res) => {
	userService.getMostIntegral(req, res);
});

// 更新用户身份
router.post('/updateIdentity', (req, res) => {
	userService.updateIdentity(req, res);
});

module.exports = router;
