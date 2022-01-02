const Sequelize = require('sequelize');
const sequelize = require('../dataSource/MysqlPoolClass');
const resultMessage = require('../util/resultMessage');
const commentRecord = require('../models/comment_record');
const content = require('../models/content');
const user = require('../models/user');

const { getHotReply, handleComment } = require('../util/commonService');

const Op = Sequelize.Op;
const userModal = user(sequelize);
const contentModal = content(sequelize);
const commentRecordModal = commentRecord(sequelize);
commentRecordModal.belongsTo(userModal, { foreignKey: 'user_id', targetKey: 'id', as: 'userDetail' });

const pagesize = 10;

module.exports = {
	// 获取内容的全部评论
	getAllByContentId: async (req, res) => {
		try {
			const { content_id, current, user_id } = req.query;
			const offset = Number((current - 1) * pagesize);
			const comments = await commentRecordModal.findAll({
				where: {
					content_id,
					type: 1,
					is_delete: 1,
				},
				attributes: ['id', 'content_id', 'comment_id', 'img_urls', 'type', 'desc', 'goods', 'share', 'comment', 'create_time'],
				include: [
					{
						model: userModal,
						as: 'userDetail',
						attributes: ['id', 'username', 'photo', 'school'],
					},
				],
				order: [
					['goods', 'DESC'],
					['comment', 'DESC'],
					['create_time', 'DESC'],
				],
				limit: pagesize,
				offset,
			});
			const result = await handleComment(comments, user_id);
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 获取评论的回复
	getAllByCommentId: async (req, res) => {
		try {
			const { comment_id, current, user_id } = req.query;
			const offset = Number((current - 1) * pagesize);
			const comments = await commentRecordModal.findAll({
				where: {
					comment_id,
					type: 2,
					is_delete: 1,
				},
				attributes: ['id', 'content_id', 'comment_id', 'img_urls', 'type', 'desc', 'goods', 'share', 'comment', 'create_time'],
				include: [
					{
						model: userModal,
						as: 'userDetail',
						attributes: ['id', 'username', 'photo', 'school'],
					},
				],
				order: [
					['goods', 'DESC'],
					['comment', 'DESC'],
					['create_time', 'DESC'],
				],
				limit: pagesize,
				offset,
			});
			const result = await handleComment(comments, user_id);
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 获取热门回复
	getHotReplyByContentId: async (req, res) => {
		try {
			const { content_id } = req.query;
			const result = await getHotReply(content_id);
			res.send(resultMessage.success(result[0] || {}));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 删除评论
	deleteCommentById: async (req, res) => {
		try {
			const { id, content_id } = req.body;
			const num = await commentRecordModal.update(
				{ is_delete: 2 },
				{
					where: {
						[Op.or]: {
							id,
							comment_id: id,
						},
						content_id,
					},
				},
			);
			// 帖子的评论数量加1
			await contentModal.decrement({ comment: num || 0, hot: num || 0 }, { where: { id: content_id } });
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},
};
