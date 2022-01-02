const express = require('express');

const router = express.Router();
const circleService = require('../services/circleService');

// 获取个人圈子
router.get('/allByUserId', (req, res) => {
	circleService.getAllByUserId(req, res);
});

// 获取学校圈子，通过地区
router.get('/getAllByAddress', (req, res) => {
	circleService.getAllByAddress(req, res);
});

// 关注学校圈子
router.post('/attentionSchoolCircle', (req, res) => {
	circleService.attentionSchoolCircle(req, res);
});

// 关注多个圈子
router.post('/attentionCircles', (req, res) => {
	circleService.attentionCircles(req, res);
});

// 获取个人关注圈子
router.get('/allCirclesByUserId', (req, res) => {
	circleService.getCirclesByUserId(req, res);
});

// 获取所有板块，以及板块下的圈子
router.get('/allCirclesByPlate', (req, res) => {
	circleService.getAllCirclesByPlate(req, res);
});

// 获取个人学校圈子 getPersonSchoolCircle
router.get('/getPersonSchoolCircle', (req, res) => {
	circleService.getPersonSchoolCircle(req, res);
});

// 获取热度最高的十个圈子
router.get('/mostHot', (req, res) => {
	circleService.getMostHot(req, res);
});

// 获取个人关注圈子以及热度
router.get('/myAttentionCircles', (req, res) => {
	circleService.getMyAttentionCircles(req, res);
});

// 根据板块id获取圈子列表
router.get('/circlesByPlateId', (req, res) => {
	circleService.getCirclesByPlateId(req, res);
});

// 关注或者取消关注单个圈子
router.post('/attentionCircleByUser', (req, res) => {
	circleService.attentionCircleByUser(req, res);
});

// 获取圈子详情
router.get('/circleDetailById', (req, res) => {
	circleService.getCircleDetailById(req, res);
});

// 获取我关注的圈子通过模块id
router.get('/circleDetailByPlateId', (req, res) => {
	circleService.getCircleDetailByPlateId(req, res);
});

// 获取学校圈子的地区
router.get('/circleAddressByCity', (req, res) => {
	circleService.getCircleAddressByCity(req, res);
});

// 保存首页展示的圈子
router.post('/saveMyShowCircle', (req, res) => {
	circleService.saveMyShowCircle(req, res);
});

// 获取学校圈子的名称
router.get('/schoolCircles', (req, res) => {
	circleService.getSchoolCircles(req, res);
});

module.exports = router;
