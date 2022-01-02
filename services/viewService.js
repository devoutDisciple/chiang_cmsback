const moment = require('moment');
const sequelize = require('../dataSource/MysqlPoolClass');
const viewRecord = require('../models/view_record');
const userAttention = require('../models/user_attention_user');
const user = require('../models/user');
const responseUtil = require('../util/responseUtil');
const resultMessage = require('../util/resultMessage');
const userUtil = require('../util/userUtil');

const userModal = user(sequelize);
const viewRecordModal = viewRecord(sequelize);
const userAttentionModal = userAttention(sequelize);

viewRecordModal.belongsTo(userModal, { foreignKey: 'user_id', targetKey: 'id', as: 'userDetail' });
const timeformat = 'YYYY-MM-DD HH:mm:ss';
const pagesize = 10;
const COMMONE_USER_FIELDS = ['id', 'username', 'photo', 'integral'];

module.exports = {
	// 新增浏览记录
	addRecord: async (req, res) => {
		try {
			const { user_id, other_id } = req.body;
			if (!user_id || !other_id || String(user_id) === String(other_id)) {
				return res.send(resultMessage.success('success'));
			}
			// 查询浏览历史是否存在
			const viewDetail = await viewRecordModal.findOne({
				where: {
					user_id,
					other_id,
				},
			});
			if (viewDetail) {
				viewRecordModal.update(
					{ create_time: moment().format(timeformat) },
					{
						where: {
							user_id,
							other_id,
						},
					},
				);
			} else {
				viewRecordModal.create({
					user_id,
					other_id,
					create_time: moment().format(timeformat),
				});
			}
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 获取被浏览历史
	getRecordsByUserId: async (req, res) => {
		try {
			const { user_id, current = 1, size = pagesize } = req.query;
			const offset = Number((current - 1) * size);
			let result = [];
			if (!user_id) {
				return res.send(resultMessage.success(result));
			}
			// 查询浏览历史是否存在
			const viewRecords = await viewRecordModal.findAll({
				where: { other_id: user_id },
				attributes: ['id', 'user_id', 'other_id', 'create_time'],
				include: [
					{
						model: userModal,
						as: 'userDetail',
						attributes: COMMONE_USER_FIELDS,
					},
				],
				limit: pagesize,
				offset,
			});
			if (viewRecords && viewRecords.length !== 0) {
				result = responseUtil.renderFieldsAll(viewRecords, ['id', 'user_id', 'other_id', 'create_time', 'userDetail']);
				result.forEach((item) => {
					item.create_time = moment(item.create_time).format(timeformat);
					if (item.userDetail) {
						item.userDetail = responseUtil.renderFieldsObj(item.userDetail, COMMONE_USER_FIELDS);
						item.userDetail.photo = userUtil.getPhotoUrl(item.userDetail.photo);
					}
				});
			}
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 获取用户浏览历史详情
	getRecordsDetailByUserId: async (req, res) => {
		try {
			const { user_id, current = 1, size = pagesize } = req.query;
			const offset = Number((current - 1) * size);
			let result = [];
			if (!user_id) {
				return res.send(resultMessage.success(result));
			}
			// 查询浏览历史是否存在
			const viewRecords = await viewRecordModal.findAll({
				where: { other_id: user_id },
				attributes: ['id', 'user_id', 'other_id', 'create_time'],
				include: [
					{
						model: userModal,
						as: 'userDetail',
						attributes: COMMONE_USER_FIELDS,
					},
				],
				limit: pagesize,
				offset,
			});
			// 查询是否已关注用户
			if (viewRecords && viewRecords.length !== 0) {
				result = responseUtil.renderFieldsAll(viewRecords, ['id', 'user_id', 'other_id', 'create_time', 'userDetail']);
				const viewerIds = [];
				result.forEach((item) => viewerIds.push(item.user_id));
				// 查看关注列表
				const attentions = await userAttentionModal.findAll({
					where: {
						user_id,
						other_id: viewerIds,
					},
					attributes: ['id', 'user_id', 'other_id'],
				});
				result.forEach((item) => {
					item.hadAttention = false;
					item.create_time = moment(item.create_time).format('YYYY-MM-DD HH:mm');
					if (item.userDetail) {
						item.userDetail = responseUtil.renderFieldsObj(item.userDetail, COMMONE_USER_FIELDS);
						item.userDetail.photo = userUtil.getPhotoUrl(item.userDetail.photo);
					}
					const attentionDetail = attentions.filter((tempItem) => tempItem.other_id === item.user_id);
					if (Array.isArray(attentionDetail) && attentionDetail.length !== 0) {
						item.hadAttention = true;
					}
				});
			}
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},
};
