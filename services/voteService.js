const moment = require('moment');
const sequelize = require('../dataSource/MysqlPoolClass');
const content = require('../models/content');
const config = require('../config/config');
const vote = require('../models/vote');
const user = require('../models/user');
const circle = require('../models/circle');
const voteRecord = require('../models/vote_record');
const resultMessage = require('../util/resultMessage');
const { handleContent } = require('../util/commonService');

const contentModal = content(sequelize);
const userModal = user(sequelize);
const circleModal = circle(sequelize);
const voteRecordModal = voteRecord(sequelize);
const voteModal = vote(sequelize);
const timeformat = 'YYYY-MM-DD HH:mm:ss';

module.exports = {
	// 发布投票
	addVote: async (req, res) => {
		try {
			const { user_id, isMultiple, title, conList, circle_ids, circle_names } = req.body;
			if (!user_id || !title || !conList || !circle_ids) {
				return res.send(resultMessage.error());
			}
			const voteDetail = await voteModal.create({
				title,
				type: isMultiple ? 2 : 1,
				content: conList ? JSON.stringify(conList) : '[]',
			});
			await contentModal.create({
				user_id,
				circle_ids: circle_ids ? circle_ids.join(',') : '',
				circle_names: circle_names ? JSON.stringify(circle_names) : '[]',
				topic_ids: '[]',
				other_id: voteDetail.id,
				type: 3,
				create_time: moment().format(timeformat),
				update_time: moment().format(timeformat),
			});
			res.send(resultMessage.success('success'));
			// 用户积分 + 2， 发布 + 1
			userModal.increment({ integral: config.PUBLISH_POSTS_INTEGRAL, publish: 1 }, { where: { id: user_id } });
			// 圈子热度 + 2
			if (circle_ids && Array.isArray(circle_ids)) {
				circle_ids.forEach((circle_id) => {
					circleModal.increment({ hot: config.PUBLISH_POSTS_INTEGRAL }, { where: { id: circle_id } });
				});
			}
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 选择某一项
	selectVoteItem: async (req, res) => {
		try {
			const { user_id, content_id, select_items } = req.body;
			const contentDetail = await contentModal.findOne({
				where: {
					id: content_id,
					is_delete: 1,
				},
				attributes: ['id', 'type', 'other_id'],
			});
			const voteContent = await handleContent(contentDetail);
			const voteDetail = voteContent.voteDetail;

			const result = await voteRecordModal.findOne({
				where: {
					user_id,
					content_id,
				},
			});
			// 当前全部的选项
			const curItems = voteDetail.content || [];

			// 如果存在这条记录，先将vote表中的记录都减一
			if (result) {
				// 以前选择的类目
				const curSelect = result.select_items ? JSON.parse(result.select_items) : [];
				// 以前选择的投票数全部 - 1
				curSelect.forEach((item) => {
					// 当前选项 - 1
					curItems[item].num = Number(curItems[item].num) - 1;
					// 投票总票数 - 1
					voteDetail.total = Number(voteDetail.total) - 1;
				});
				// 删除这个记录
				voteRecordModal.destroy({ where: { id: result.id } });
			} else {
				// 帖子热度 + 1
				contentModal.increment(['hot'], { where: { id: content_id } });
			}

			// 现在选择的全部 + 1
			select_items.forEach((item) => {
				curItems[item].num = Number(curItems[item].num) + 1;
				// 投票总票数 - 1
				voteDetail.total = Number(voteDetail.total) + 1;
			});
			// 更新该条记录
			await voteModal.update(
				{
					content: curItems ? JSON.stringify(curItems) : '[]',
					total: voteDetail.total,
				},
				{
					where: {
						id: voteDetail.id,
					},
				},
			);
			// 然后创建新记录
			voteRecordModal.create({
				user_id,
				content_id,
				select_items: select_items ? JSON.stringify(select_items) : '[]',
				create_time: moment().format(timeformat),
			});

			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},
};
