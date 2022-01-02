// const fs = require('fs');
const moment = require('moment');
const userUtil = require('../util/userUtil');
const sequelize = require('../dataSource/MysqlPoolClass');
const user = require('../models/user');
const content = require('../models/content');
const userAttention = require('../models/user_attention_user');
const goodsRcord = require('../models/goods_record');
const config = require('../config/config');
const resultMessage = require('../util/resultMessage');
const responseUtil = require('../util/responseUtil');

const userModal = user(sequelize);
const contentModal = content(sequelize);
const userAttentionModal = userAttention(sequelize);
const goodsRecordModal = goodsRcord(sequelize);

userAttentionModal.belongsTo(userModal, { foreignKey: 'user_id', targetKey: 'id', as: 'userDetail' });
goodsRecordModal.belongsTo(contentModal, { foreignKey: 'content_id', targetKey: 'id', as: 'contentDetail' });

module.exports = {
	// 根据user_id获取当前用户信息
	getUserDetailByUserId: async (req, res) => {
		try {
			const { user_id } = req.query;
			const userDetail = await userModal.findOne({ where: { id: user_id, disable: 1, is_delete: 1 } });
			if (!userDetail) {
				return res.send(resultMessage.success({}));
			}
			const result = responseUtil.renderFieldsObj(userDetail, [
				'id',
				'username',
				'photo',
				'bg_url',
				'birthday',
				'sex',
				'address',
				'sign',
				'goods',
				'fans',
				'fellow',
				'publish',
				'type',
				'address',
				'school',
				'level',
				'integral',
				'identity',
			]);
			if (result.birthday) result.birthday = moment(result.birthday).format('YYYY-MM-DD');
			result.photo = userUtil.getPhotoUrl(result.photo);
			result.bg_url = config.preUrl.bgUrl + result.bg_url;
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 上传用户头像
	uploadPhoto: async (req, res, filename) => {
		try {
			const { user_id } = req.body;
			if (!user_id) return res.send(resultMessage.error('请先登录'));
			const userDetail = await userModal.findOne({ where: { id: user_id, is_delete: 1 } });
			if (!userDetail) return res.send(resultMessage.error('请先登录'));
			// 删除以前图片
			// if (userDetail && userDetail.photo) {
			// 	if (userDetail.photo !== 'photo.png') {
			// 		fs.unlink(`${config.userPhotoPath}/${userDetail.photo}`, (err) => {
			// 			console.log(err);
			// 		});
			// 	}
			// }
			await userModal.update(
				{
					photo: filename,
				},
				{
					where: {
						id: user_id,
					},
				},
			);
			res.send(resultMessage.success(userUtil.getPhotoUrl(filename)));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 修改个人信息
	updateMsg: async (req, res) => {
		try {
			const { user_id, data } = req.body;
			const userDetail = await userModal.findOne({ where: { id: user_id, disable: 1, is_delete: 1 } });
			if (!userDetail) return res.send(resultMessage.error('暂无此用户'));
			await userModal.update(data, { where: { id: user_id } });
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 获取个人统计信息， 收获多少赞，发布，关注，粉丝
	userData: async (req, res) => {
		try {
			const { user_id } = req.query;
			if (!user_id) return res.send(resultMessage.error('请先登录'));
			const userDetail = await userModal.findOne({
				where: { id: user_id },
				attributes: ['id', 'goods', 'fans', 'fellow', 'publish', 'integral'],
			});
			const { publish, fans, goods, fellow, integral } = userDetail;
			res.send(resultMessage.success({ publish, fans, goods, fellow, integral }));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 获取关注我的用户
	getAttentionMeByUserId: async (req, res) => {
		try {
			const { user_id } = req.query;
			const attentionUsers = await userAttentionModal.findAll({
				where: { other_id: user_id, is_delete: 1 },
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

			if (result && result.length !== 0) {
				let len = result.length;
				while (len > 0) {
					len -= 1;
					const curItem = result[len];
					if (curItem && curItem.userDetail) {
						curItem.userDetail.photo = userUtil.getPhotoUrl(curItem.userDetail.photo);
						// 查看是否我也关注了该用户
						const attentionDetail = await userAttentionModal.findOne({
							where: {
								user_id,
								other_id: curItem.user_id,
							},
						});
						if (attentionDetail) curItem.hadAttention = true;
					}
				}
			}

			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 获取我是否已经关注某用户
	getHadAttentionUser: async (req, res) => {
		try {
			const { user_id, current_user_id } = req.query;
			const attentionUsers = await userAttentionModal.findOne({
				where: { user_id: current_user_id, other_id: user_id, is_delete: 1 },
				attributes: ['id'],
			});
			res.send(resultMessage.success({ hadAttention: !!attentionUsers }));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 获取积分前三名
	getMostIntegral: async (req, res) => {
		try {
			const users = await userModal.findAll({
				where: { is_delete: 1 },
				attributes: ['id', 'username', 'photo', 'integral'],
				order: [
					['integral', 'DESC'],
					['create_time', 'DESC'],
				],
				limit: 3,
				offset: 0,
			});
			const result = responseUtil.renderFieldsAll(users, ['id', 'username', 'photo', 'integral']);
			result.forEach((item) => {
				item.photo = userUtil.getPhotoUrl(item.photo);
			});
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 更新用户身份
	updateIdentity: async (req, res) => {
		try {
			const { user_id, identity } = req.body;
			await userModal.update({ identity }, { where: { id: user_id } });
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},
};
