const Sequelize = require('sequelize');
const fs = require('fs');
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

const Op = Sequelize.Op;
const userModal = user(sequelize);
const contentModal = content(sequelize);
const userAttentionModal = userAttention(sequelize);
const goodsRecordModal = goodsRcord(sequelize);

userAttentionModal.belongsTo(userModal, { foreignKey: 'user_id', targetKey: 'id', as: 'userDetail' });
goodsRecordModal.belongsTo(contentModal, { foreignKey: 'content_id', targetKey: 'id', as: 'contentDetail' });
const pagesize = 10;

const commonFields = [
	'id',
	'phone',
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
	'integral',
	'address',
	'school',
	'level',
	'create_time',
];

module.exports = {
	// 根据分页获取用户信息
	getUsersByPage: async (req, res) => {
		try {
			const { current = 1, username, phone, school, startTime, endTime } = req.query;
			const condition = { is_delete: 1 };
			if (username) {
				condition.username = {
					[Op.like]: `%${username}%`,
				};
			}
			if (phone) {
				condition.phone = {
					[Op.like]: `%${phone}%`,
				};
			}
			if (school) {
				condition.school = {
					[Op.like]: `%${school}%`,
				};
			}
			if (startTime) {
				condition.create_time = {
					[Op.gte]: startTime,
				};
			}
			if (endTime) {
				condition.create_time = {
					[Op.lte]: `%${endTime}%`,
				};
			}
			const offset = Number((current - 1) * pagesize);
			const users = await userModal.findAndCountAll({
				where: condition,
				order: [['create_time', 'DESC']],
				attributes: commonFields,
				limit: pagesize,
				offset,
			});
			const result = {
				count: 0,
				list: [],
			};
			if (users && users.rows && users.rows.length !== 0) {
				result.count = users.count;
				result.list = responseUtil.renderFieldsAll(users.rows, commonFields);
				result.list.forEach((item) => {
					item.photo = userUtil.getPhotoUrl(item.photo);
					item.create_time = item.create_time ? moment(item.create_time).format('YYYY-MM-DD HH:mm') : '';
				});
			}
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
			if (userDetail && userDetail.photo) {
				if (userDetail.photo !== 'photo.png') {
					fs.unlink(`${config.userPhotoPath}/${userDetail.photo}`, (err) => {
						console.log(err);
					});
				}
			}
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
			// 获取多少发布
			const publishNum = await contentModal.count({ where: { user_id, is_delete: 1 } });
			// 获取多少粉丝
			const fansNum = await userAttentionModal.count({ where: { other_id: user_id, is_delete: 1 } });
			// 赞过多少帖子
			const postGoodsNum = await goodsRecordModal.count({
				where: { user_id, type: 1 },
				include: [
					{
						model: contentModal,
						as: 'contentDetail',
						where: {
							user_id: {
								[Op.not]: user_id,
							},
						},
					},
				],
			});
			// 赞过多少
			const commentsNum = await goodsRecordModal.count({
				where: { user_id, type: [2, 3] },
			});
			const goodsNum = Number(Number(postGoodsNum) + Number(commentsNum)).toFixed(0);
			// 获取多少关注
			const attentionNum = await userAttentionModal.count({ where: { user_id, is_delete: 1 } });
			res.send(
				resultMessage.success({
					publishNum,
					fansNum,
					goodsNum,
					attentionNum,
				}),
			);
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
};
