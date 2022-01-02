const moment = require('moment');
const sequelize = require('../dataSource/MysqlPoolClass');
const resultMessage = require('../util/resultMessage');
const notice = require('../models/notice');
const responseUtil = require('../util/responseUtil');

const noticeModal = notice(sequelize);

module.exports = {
	// 获取公告简略信息
	getNotices: async (req, res) => {
		try {
			const { circle_id } = req.query;
			const notices = await noticeModal.findAll({
				where: {
					circle_id,
					is_delete: 1,
				},
				attributes: ['id', 'title', 'type'],
				order: [['create_time', 'DESC']],
			});
			let result = [];
			if (Array.isArray(notices)) {
				result = responseUtil.renderFieldsAll(notices, ['id', 'title', 'type']);
			}
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 获取单个详情
	getNoticeDetail: async (req, res) => {
		try {
			const { notice_id } = req.query;
			const notices = await noticeModal.findOne({
				where: {
					id: notice_id,
					is_delete: 1,
				},
				attributes: ['id', 'title', 'desc', 'type', 'create_time'],
				order: [['create_time', 'DESC']],
			});
			const result = responseUtil.renderFieldsObj(notices, ['id', 'title', 'desc', 'type', 'create_time']);
			if (result.desc) {
				result.desc = result.desc.split('__%&*__');
			} else {
				result.desc = [];
			}

			result.time = moment(result.create_time).format('YYYY-MM-DD HH:mm');
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},
};
