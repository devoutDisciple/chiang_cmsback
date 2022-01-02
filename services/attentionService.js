const moment = require('moment');
const userUtil = require('../util/userUtil');
const sequelize = require('../dataSource/MysqlPoolClass');
const resultMessage = require('../util/resultMessage');
const userAttention = require('../models/user_attention_user');
const user = require('../models/user');
const responseUtil = require('../util/responseUtil');

const userModal = user(sequelize);
const userAttentionModal = userAttention(sequelize);
userAttentionModal.belongsTo(userModal, { foreignKey: 'other_id', targetKey: 'id', as: 'userDetail' });

module.exports = {
	// 关注用户
	attentionUser: async (req, res) => {
		try {
			const { user_id, other_id } = req.body;
			const attentionDetail = await userAttentionModal.findOne({ where: { user_id, other_id, is_delete: 1 } });
			if (attentionDetail) {
				// 删除该数据
				userAttentionModal.destroy({
					where: {
						user_id,
						other_id,
					},
				});
			} else {
				// 创建新的关注
				userAttentionModal.create({
					user_id,
					other_id,
					create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
				});
			}
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 获取我关注的用户
	getMyAttentionUsers: async (req, res) => {
		try {
			const { user_id } = req.query;
			const attentionUsers = await userAttentionModal.findAll({
				where: { user_id, is_delete: 1 },
				order: [['create_time', 'DESC']],
				include: [
					{
						model: userModal,
						as: 'userDetail',
						attributes: ['id', 'username', 'photo', 'sign', 'integral'],
					},
				],
			});
			const result = responseUtil.renderFieldsAll(attentionUsers, ['id', 'user_id', 'other_id', 'userDetail']);
			result.forEach((item) => {
				if (item && item.userDetail) {
					item.userDetail.photo = userUtil.getPhotoUrl(item.userDetail.photo);
					item.hadAttention = true;
				}
			});
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 获取关注用户的数量
	getMyAttentionUsersNum: async (req, res) => {
		try {
			const { user_id } = req.query;
			const num = await userAttentionModal.count({
				where: { user_id, is_delete: 1 },
			});

			res.send(resultMessage.success({ num }));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},
};
