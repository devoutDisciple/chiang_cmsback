const config = require('../config/config');
const sequelize = require('../dataSource/MysqlPoolClass');
const plate = require('../models/plate');
const resultMessage = require('../util/resultMessage');
const responseUtil = require('../util/responseUtil');

const plateModal = plate(sequelize);

module.exports = {
	// 获取所有板块信息
	getAll: async (req, res) => {
		try {
			const plates = await plateModal.findAll({
				where: {
					is_delete: 1,
				},
				order: [['sort', 'DESC']],
			});
			let result = {};
			result = responseUtil.renderFieldsAll(plates, ['id', 'name', 'url', 'type', 'link']);
			result.forEach((item) => {
				item.url = config.preUrl.baseUrl + item.url;
			});
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 获取板块详细信息
	getDetailByPlateId: async (req, res) => {
		try {
			const { plate_id } = req.query;
			const plateDetail = await plateModal.findOne({
				where: {
					id: plate_id,
					is_delete: 1,
				},
			});
			let result = {};
			result = responseUtil.renderFieldsObj(plateDetail, ['id', 'name', 'url', 'type', 'link']);
			result.url = config.preUrl.baseUrl + result.url;
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},
};
