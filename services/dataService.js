const moment = require('moment');
const resultMessage = require('../util/resultMessage');
const sequelize = require('../dataSource/MysqlPoolClass');
const data = require('../models/data');
const responseUtil = require('../util/responseUtil');

const dataModel = data(sequelize);

module.exports = {
	// 获取统计数据
	getTotal: async (req, res) => {
		try {
			const datas = await dataModel.findAll({
				order: [['create_time', 'DESC']],
				limit: 1,
				offset: 0,
			});
			let result = {};
			if (datas && datas.length !== 0) {
				result = responseUtil.renderFieldsObj(datas[0], [
					'id',
					'user_total',
					'user_today',
					'publish_total',
					'publish_today',
					'goods_total',
					'goods_today',
					'comment_total',
					'comment_today',
					'share_total',
					'share_today',
					'online_num',
					'create_time',
				]);
				result.create_time = moment(result.create_time).format('YYYY-MM-DD HH:mm');
			}
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 获取用户增长记录数据
	getUserNumData: async (req, res) => {
		try {
			const datas = await dataModel.findAll({
				order: [['create_time', 'ASC']],
				attributes: ['id', 'user_total', 'create_time'],
			});
			let result = {};
			if (datas && datas.length !== 0) {
				result = responseUtil.renderFieldsAll(datas, ['id', 'user_total', 'create_time']);
				result.forEach((item) => {
					item.create_time = moment(item.create_time).format('YYYY-MM-DD HH:mm');
				});
			}
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 获取用户增长记录数据
	getPublishNumData: async (req, res) => {
		try {
			const datas = await dataModel.findAll({
				order: [['create_time', 'ASC']],
				attributes: ['id', 'publish_total', 'create_time'],
			});
			let result = {};
			if (datas && datas.length !== 0) {
				result = responseUtil.renderFieldsAll(datas, ['id', 'publish_total', 'create_time']);
				result.forEach((item) => {
					item.create_time = moment(item.create_time).format('YYYY-MM-DD HH:mm');
				});
			}
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 点赞
	getGoodsNumData: async (req, res) => {
		try {
			const datas = await dataModel.findAll({
				order: [['create_time', 'ASC']],
				attributes: ['id', 'goods_total', 'create_time'],
			});
			let result = {};
			if (datas && datas.length !== 0) {
				result = responseUtil.renderFieldsAll(datas, ['id', 'goods_total', 'create_time']);
				result.forEach((item) => {
					item.create_time = moment(item.create_time).format('YYYY-MM-DD HH:mm');
				});
			}
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 评论
	getCommentsNumData: async (req, res) => {
		try {
			const datas = await dataModel.findAll({
				order: [['create_time', 'ASC']],
				attributes: ['id', 'comment_total', 'create_time'],
			});
			let result = {};
			if (datas && datas.length !== 0) {
				result = responseUtil.renderFieldsAll(datas, ['id', 'comment_total', 'create_time']);
				result.forEach((item) => {
					item.create_time = moment(item.create_time).format('YYYY-MM-DD HH:mm');
				});
			}
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},
};
