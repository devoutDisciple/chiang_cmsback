const Sequelize = require('sequelize');
const moment = require('moment');
const sequelize = require('../dataSource/MysqlPoolClass');
const resultMessage = require('../util/resultMessage');
const content = require('../models/content');
const user = require('../models/user');
const responseUtil = require('../util/responseUtil');
const { getHotReply, handleContent } = require('../util/commonService');

const contentModal = content(sequelize);
const userModal = user(sequelize);
contentModal.belongsTo(userModal, { foreignKey: 'user_id', targetKey: 'id', as: 'userDetail' });

const pagesize = 10;
const Op = Sequelize.Op;

const contentCommonFields = [
	'id',
	'user_id',
	'circle_ids',
	'circle_names',
	'topic_ids',
	'topic_names',
	'other_id',
	'type',
	'goods',
	'comment',
	'share',
	'hot',
	'create_time',
];

module.exports = {
	// 分页获取内容
	getContentsByPage: async (req, res) => {
		try {
			const { current = 1, circle, type, sort, startTime, endTime, username } = req.query;
			const condition = { is_delete: 1 };
			const order = [['create_time', 'DESC']];
			if (username) {
				const users = await userModal.findAll({
					where: {
						is_delete: 1,
						username: {
							[Op.like]: `%${username}%`,
						},
					},
				});
				if (users && users.length !== 0) {
					const userIds = users.map((item) => {
						return item.id;
					});
					condition.user_id = userIds;
				}
			}
			if (circle) {
				condition.circle_names = {
					[Op.like]: `%${circle}%`,
				};
			}
			if (type) condition.type = type;
			if (sort) {
				order.unshift([sort, 'DESC']);
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
			const contents = await contentModal.findAndCountAll({
				where: condition,
				include: [
					{
						model: userModal,
						as: 'userDetail',
						attributes: ['id', 'username'],
					},
				],
				order,
				attributes: contentCommonFields,
				limit: pagesize,
				offset,
			});
			const result = {
				count: 0,
				list: [],
			};
			if (contents && contents.rows && contents.rows.length !== 0) {
				result.count = contents.count;
				result.list = responseUtil.renderFieldsAll(contents.rows, [...contentCommonFields, 'userDetail']);
				result.list.forEach((item) => {
					item.username = item.userDetail.username;
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

	// 获取内容详情
	getContentDetail: async (req, res) => {
		try {
			const { content_id, user_id } = req.query;
			if (!content_id) return res.send(resultMessage.error());
			const contentDetail = await contentModal.findOne({
				where: {
					id: content_id,
					is_delete: 1,
				},
				include: [
					{
						model: userModal,
						as: 'userDetail',
						attributes: ['id', 'username', 'photo', 'school'],
					},
				],
				order: [['create_time', 'DESC']],
				attributes: contentCommonFields,
			});
			if (!contentDetail) return res.send(resultMessage.error('暂无数据'));
			const obj = responseUtil.renderFieldsObj(contentDetail, [...contentCommonFields, 'userDetail']);
			const result = await handleContent(obj, user_id);
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 删除内容
	deleteById: async (req, res) => {
		try {
			const { contentId } = req.query;
			// const contents = await contentModal.findOne({
			// 	where: { id: contentId },
			// 	attributes: ['id', 'type'],
			// });
			await contentModal.update({ is_delete: 2 }, { where: { id: contentId } });
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 获取用户帖子或者博客
	getContentsByTypeAndUserId: async (req, res) => {
		try {
			const { user_id, current = 1, activeIdx } = req.query;
			const offset = Number((current - 1) * pagesize);
			let type = [1];
			switch (String(activeIdx)) {
				// 获取文字
				case '0':
					type = [1, 2, 3, 4];
					break;
				// 获取视频
				case '1':
					type = [5];
					break;
				// 获取相册
				case '2':
					type = [3, 4];
					break;
				default:
					type = [1];
					break;
			}
			if (!user_id) return res.send(resultMessage.error('请先登录'));
			const userDetail = await userModal.findOne({ where: { id: user_id }, attributes: ['id', 'photo', 'school', 'username'] });
			const contentList = await contentModal.findAll({
				where: {
					user_id,
					is_delete: 1,
					type,
				},
				order: [['create_time', 'DESC']],
				attributes: contentCommonFields,
				limit: pagesize,
				offset,
			});
			const result = [];
			if (contentList && contentList.length !== 0) {
				let len = contentList.length;
				while (len > 0) {
					len -= 1;
					contentList[len].userDetail = responseUtil.renderFieldsObj(userDetail, ['id', 'photo', 'school', 'username']);
					const obj = responseUtil.renderFieldsObj(contentList[len], [...contentCommonFields, 'userDetail']);
					const content_id = contentList[len].id;
					// 查看帖子或者pk的详情
					const newObj = await handleContent(obj, user_id);
					newObj.hotReply = await getHotReply(content_id, user_id);
					result.unshift(newObj);
				}
			}
			const threeDays = []; // 三天内的
			const monthDays = []; // 一个月内的
			const longago = []; // 更早以前的
			result.forEach((item) => {
				const diffDays = moment(new Date()).diff(moment(item.create_time), 'days');
				if (diffDays < 3) {
					threeDays.push(item);
				} else if (diffDays < 30) {
					monthDays.push(item);
				} else {
					longago.push(item);
				}
			});
			res.send(
				resultMessage.success({
					threeDays,
					monthDays,
					longago,
				}),
			);
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},
};
