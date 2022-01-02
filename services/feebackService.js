const moment = require('moment');
const sequelize = require('../dataSource/MysqlPoolClass');
const resultMessage = require('../util/resultMessage');
const feedback = require('../models/feedback');
const user = require('../models/user');
const userUtil = require('../util/userUtil');
const responseUtil = require('../util/responseUtil');

const feedbackModel = feedback(sequelize);
const userModal = user(sequelize);
feedbackModel.belongsTo(userModal, { foreignKey: 'user_id', targetKey: 'id', as: 'userDetail' });
const pagesize = 10;
module.exports = {
	// 关于圈子的意见反馈
	getAll: async (req, res) => {
		try {
			const { current = 1 } = req.query;
			const offset = Number((current - 1) * pagesize);
			const feedbackFields = ['id', 'user_id', 'plate_id', 'desc', 'type', 'create_time'];
			const lists = await feedbackModel.findAndCountAll({
				attributes: feedbackFields,
				include: [
					{
						model: userModal,
						as: 'userDetail',
						attributes: ['id', 'username', 'photo', 'school'],
					},
				],
				order: [['create_time', 'DESC']],
				limit: pagesize,
				offset,
			});
			const result = {
				count: 0,
				list: [],
			};
			if (lists && lists.rows && lists.rows.length !== 0) {
				result.count = lists.count;
				result.list = responseUtil.renderFieldsAll(lists.rows, [...feedbackFields, 'userDetail']);
				result.list.forEach((item) => {
					item.school = item.userDetail.school;
					item.username = item.userDetail.username;
					item.userPhoto = userUtil.getPhotoUrl(item.userDetail.photo);
					delete item.userDetail;
					item.create_time = moment(item.create_time).format('YYYY-MM-DD HH:mm');
				});
			}
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},
};
