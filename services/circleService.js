const Sequelize = require('sequelize');
const moment = require('moment');
const config = require('../config/config');
const sequelize = require('../dataSource/MysqlPoolClass');
const circle = require('../models/circle');
const plate = require('../models/plate');
const resultMessage = require('../util/resultMessage');
const responseUtil = require('../util/responseUtil');

const Op = Sequelize.Op;
const circleModal = circle(sequelize);
const plateModal = plate(sequelize);

circleModal.belongsTo(plateModal, { foreignKey: 'plate_id', targetKey: 'id', as: 'plateDetail' });

const pagesize = 10;
const commonFields = [
	'id',
	'plate_id',
	'name',
	'desc',
	'fellow',
	'blogs',
	'posts',
	'vote',
	'battle',
	'videos',
	'hot',
	'type',
	'province',
	'city',
	'country',
	'logo',
	'bg_url',
	'create_time',
];

module.exports = {
	// 分页获取圈子数据
	getCirclesByPage: async (req, res) => {
		try {
			const { current = 1, name } = req.query;
			const condition = { is_delete: 1 };
			if (name) {
				condition.name = {
					[Op.like]: `%${name}%`,
				};
			}
			const offset = Number((current - 1) * pagesize);
			const circles = await circleModal.findAndCountAll({
				where: condition,
				attributes: commonFields,
				order: [['create_time', 'DESC']],
				limit: pagesize,
				offset,
			});
			const result = {
				count: 0,
				list: [],
			};
			if (circles && circles.rows && circles.rows.length !== 0) {
				result.count = circles.count;
				result.list = responseUtil.renderFieldsAll(circles.rows, [...commonFields]);
				result.list.forEach((item) => {
					item.logo = config.preUrl.circleUrl + item.logo;
					item.bg_url = config.preUrl.circleUrl + item.bg_url;
					item.contentNum = Number(
						Number(item.blogs) + Number(item.posts) + Number(item.vote) + Number(item.battle) + Number(item.videos),
					).toFixed(0);
				});
			}
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 上传图片
	uploadImg: async (req, res, filename) => {
		try {
			res.send(resultMessage.success(filename));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 新增圈子
	addCircle: async (req, res) => {
		try {
			const { name, plate_id, type, province, city, country, desc, logo, bg_url } = req.body;
			await circleModal.create({
				name,
				plate_id,
				type,
				province,
				city,
				country,
				desc,
				logo,
				bg_url,
				create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
			});
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 删除圈子
	deleteCircle: async (req, res) => {
		try {
			const { circle_id } = req.body;
			if (!circle_id) return res.send(resultMessage.error('无效圈子'));
			await circleModal.destroy({
				where: {
					id: circle_id,
				},
			});
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 编辑圈子
	editCircle: async (req, res) => {
		try {
			const { id, name, plate_id, type, province, city, country, desc, logo, bg_url } = req.body;
			const data = {
				name,
				plate_id,
				type,
				province,
				city,
				country,
				desc,
			};
			if (logo) data.logo = logo;
			if (bg_url) data.bg_url = bg_url;
			await circleModal.update(data, { where: { id } });
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 获取所有圈子简略信息
	getAllCirclesDetail: async (req, res) => {
		try {
			const circles = await circleModal.findAll({
				where: { is_delete: 1 },
				attributes: ['id', 'name'],
				order: [['create_time', 'DESC']],
			});
			const result = responseUtil.renderFieldsAll(circles, ['id', 'name']);
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},
};
