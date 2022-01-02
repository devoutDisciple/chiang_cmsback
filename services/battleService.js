const moment = require('moment');
const sizeOf = require('image-size');
const sequelize = require('../dataSource/MysqlPoolClass');
const config = require('../config/config');
const content = require('../models/content');
const battle = require('../models/battle');
const user = require('../models/user');
const circle = require('../models/circle');
const battleRecord = require('../models/battle_record');
const resultMessage = require('../util/resultMessage');
const { handleContent } = require('../util/commonService');

const contentModal = content(sequelize);
const userModal = user(sequelize);
const circleModal = circle(sequelize);
const battleModal = battle(sequelize);
const battleRecordModal = battleRecord(sequelize);
const timeformat = 'YYYY-MM-DD HH:mm:ss';

module.exports = {
	// 上传pk图片
	uploadImg: async (req, res, filename) => {
		try {
			const dimensions = sizeOf(req.file.path);
			res.send(resultMessage.success({ url: filename, width: dimensions.width, height: dimensions.height }));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 发布pk
	addBattle: async (req, res) => {
		try {
			const { user_id, activeTimeIdx = 1, title, redImg, redName, blueImg, blueName, circle_ids, circle_names } = req.body;
			if (!user_id || !title || !redImg || !redName || !blueImg || !blueName || !circle_ids || !circle_names) {
				return res.send(resultMessage.error('请填写内容'));
			}
			const dead_time = moment().add(activeTimeIdx, 'days').format(timeformat);
			const battleDetail = await battleModal.create({
				title,
				red_url: JSON.stringify(redImg),
				red_name: redName,
				blue_url: JSON.stringify(blueImg),
				blue_name: blueName,
				type: activeTimeIdx,
				create_time: moment().format(timeformat),
				dead_time,
			});
			await contentModal.create({
				user_id,
				circle_ids: circle_ids ? circle_ids.join(',') : '',
				circle_names: circle_names ? JSON.stringify(circle_names) : '[]',
				other_id: battleDetail.id,
				type: 4,
				create_time: moment().format(timeformat),
				update_time: moment().format(timeformat),
			});
			res.send(resultMessage.success('success'));
			// 用户积分 + 2, 发布 + 1
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

	// 选择某一项对决
	selectBattleItem: async (req, res) => {
		try {
			const { user_id, content_id, type } = req.body;
			// 查询该对决是否过期
			const contentDetail = await contentModal.findOne({
				where: {
					id: content_id,
					is_delete: 1,
				},
				attributes: ['id', 'type', 'other_id'],
			});
			const battleDetail = await handleContent(contentDetail, user_id);
			if (battleDetail.battleDetail) {
				const dead_time = battleDetail.battleDetail.dead_time;
				// 已经过期
				if (!moment(dead_time).isAfter(moment(new Date()))) {
					return res.send(resultMessage.error('投票已截止'));
				}
			}
			const result = await battleRecordModal.findOne({
				where: {
					user_id,
					content_id,
				},
			});
			const curField = String(type) === '1' ? 'red_ticket' : 'blue_ticket';
			const preField = String(type) === '1' ? 'blue_ticket' : 'red_ticket';
			if (String(type) === '3') {
				battleRecordModal.destroy({ where: { user_id, content_id } });
				// 给对局减票数
				battleModal.decrement(curField, { where: { id: battleDetail.battleDetail.id } });
				// 帖子热度 - 1
				contentModal.decrement(['hot'], { where: { id: content_id } });
			} else {
				// eslint-disable-next-line no-lonely-if
				if (result) {
					// 此时这条记录存在，应该删除这个记录
					battleRecordModal.destroy({ where: { id: result.id } });
					// 给对面的减票数
					battleModal.decrement(preField, { where: { id: battleDetail.battleDetail.id } });
				} else {
					// 帖子热度 + 1
					contentModal.increment(['hot'], { where: { id: content_id } });
				}
				// 给对局加票数
				battleModal.increment(curField, { where: { id: battleDetail.battleDetail.id } });
				// 然后创建新记录
				battleRecordModal.create({
					user_id,
					content_id,
					type,
					create_time: moment().format(timeformat),
				});
			}
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},
};
