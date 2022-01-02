const moment = require('moment');
const config = require('../config/config');
const userUtil = require('./userUtil');
const sequelize = require('../dataSource/MysqlPoolClass');
const responseUtil = require('./responseUtil');
const commentRecord = require('../models/comment_record');
const user = require('../models/user');
const posts = require('../models/posts');
const battle = require('../models/battle');
const vote = require('../models/vote');
const video = require('../models/video');
const goodsRecord = require('../models/goods_record');
const voteRecord = require('../models/vote_record');
const battleRecord = require('../models/battle_record');
const userAttention = require('../models/user_attention_user');

const userModal = user(sequelize);
const postsModal = posts(sequelize);
const battleModal = battle(sequelize);
const voteModal = vote(sequelize);
const videoModal = video(sequelize);
const goodsRecordModal = goodsRecord(sequelize);
const voteRecordModal = voteRecord(sequelize);
const battleRecordModal = battleRecord(sequelize);
const userAttentionModal = userAttention(sequelize);
const commentRecordModal = commentRecord(sequelize);
commentRecordModal.belongsTo(userModal, { foreignKey: 'user_id', targetKey: 'id', as: 'userDetail' });

const timeformat = 'YYYY-MM-DD HH:mm';

const handleComment = async (comments) => {
	if (!Array.isArray(comments)) return {};
	let len = comments.length;
	while (len > 0) {
		len -= 1;
		const item = comments[len];
		item.create_time = moment(item.create_time).format(timeformat);
		item.username = item.userDetail ? item.userDetail.username : '';
		item.userId = item.userDetail ? item.userDetail.id : '';
		item.userPhoto = item.userDetail ? userUtil.getPhotoUrl(item.userDetail.photo) : '';
		item.userSchool = item.userDetail ? item.userDetail.school : '';
		let imgUrls = [];
		if (item.img_urls) {
			imgUrls = JSON.parse(item.img_urls);
			if (imgUrls && imgUrls.length !== 0) {
				imgUrls.forEach((temp) => {
					temp.url = config.preUrl.commentUrl + temp.url;
				});
			}
		}
		item.img_urls = imgUrls;
	}
	const result = responseUtil.renderFieldsAll(comments, [
		'id',
		'desc',
		'goods',
		'share',
		'comment',
		'content_id',
		'comment_id',
		'img_urls',
		'create_time',
		'userId',
		'username',
		'userPhoto',
		'userSchool',
		'hadGoods',
	]);
	if (Array.isArray(result)) {
		result.forEach((item) => {
			item.create_time = moment(item.create_time).format(timeformat);
		});
	}
	return result;
};

module.exports = {
	// 处理内容返回的详情
	handleContent: async (obj, user_id) => {
		// post || blogs
		if (obj.type === 1 || obj.type === 2 || obj.type === 6) {
			obj.postsDetail = await postsModal.findOne({
				where: { id: obj.other_id },
				attributes: ['id', 'title', 'desc', 'img_urls'],
			});
			obj.postsDetail = responseUtil.renderFieldsObj(obj.postsDetail, ['id', 'title', 'desc', 'img_urls']);
			obj.postsDetail.img_urls = JSON.parse(obj.postsDetail.img_urls) || [];
			if (Array.isArray(obj.postsDetail.img_urls)) {
				obj.postsDetail.img_urls.forEach((item) => {
					item.url = config.preUrl.postsUrl + item.url;
				});
			}
		}
		// vote
		if (obj.type === 3) {
			const voteFields = ['id', 'title', 'total', 'type', 'content'];
			obj.voteDetail = await voteModal.findOne({
				where: { id: obj.other_id },
				attributes: voteFields,
			});
			obj.voteDetail = responseUtil.renderFieldsObj(obj.voteDetail, voteFields);
			obj.voteDetail.content = JSON.parse(obj.voteDetail.content) || [];
			// 查看用户是否已经选择了某个
			if (user_id && obj.id) {
				const curVoteRecord = await voteRecordModal.findOne({ where: { user_id, content_id: obj.id } });
				if (curVoteRecord) {
					const select_items = JSON.parse(curVoteRecord.select_items);
					select_items.forEach((item) => {
						obj.voteDetail.content[item].selected = true;
					});
				}
			}
		}
		// battle
		if (obj.type === 4) {
			const battleFields = [
				'id',
				'title',
				'red_name',
				'red_ticket',
				'red_url',
				'blue_name',
				'blue_ticket',
				'blue_url',
				'type',
				'dead_time',
			];
			// 查看battle详情
			obj.battleDetail = await battleModal.findOne({
				where: { id: obj.other_id },
				attributes: battleFields,
			});
			const dead_time = obj.battleDetail.dead_time;
			obj.battleDetail.expire = false;
			// 已经过期
			if (!moment(dead_time).isAfter(moment(new Date()))) {
				obj.battleDetail.expire = true;
			}
			obj.battleDetail = responseUtil.renderFieldsObj(obj.battleDetail, battleFields);
			obj.battleDetail.red_url = JSON.parse(obj.battleDetail.red_url) || {};
			obj.battleDetail.red_url.url = config.preUrl.battleUrl + obj.battleDetail.red_url.url;
			obj.battleDetail.blue_url = JSON.parse(obj.battleDetail.blue_url) || {};
			obj.battleDetail.blue_url.url = config.preUrl.battleUrl + obj.battleDetail.blue_url.url;
			const red_ticket = obj.battleDetail.red_ticket;
			const blue_ticket = obj.battleDetail.blue_ticket;
			const total = Number(red_ticket) + Number(blue_ticket);
			if (Number(total) === 0) {
				obj.battleDetail.red_percent = 50;
				obj.battleDetail.blue_percent = 50;
			} else {
				obj.battleDetail.red_percent = Number((red_ticket / total) * 100).toFixed(0);
				obj.battleDetail.blue_percent = Number((blue_ticket / total) * 100).toFixed(0);
			}
			// 查看用户是否已经选择了某个
			if (user_id && obj.id) {
				const curBattle = await battleRecordModal.findOne({ where: { user_id, content_id: obj.id } });
				if (curBattle) {
					obj.battleDetail.selectItem = curBattle.type;
				}
			}
		}
		// video
		if (obj.type === 5) {
			const videoFields = ['id', 'url', 'desc', 'photo', 'width', 'height', 'duration', 'size'];
			obj.videoDetail = await videoModal.findOne({
				where: { id: obj.other_id },
				attributes: videoFields,
			});
			obj.videoDetail = responseUtil.renderFieldsObj(obj.videoDetail, videoFields);
			if (obj.videoDetail && obj.videoDetail.url) obj.videoDetail.url = config.preUrl.videoUrl + obj.videoDetail.url;
			if (obj.videoDetail && obj.videoDetail.photo) {
				const photo = JSON.parse(obj.videoDetail.photo);
				photo.url = config.preUrl.videoCoverUrl + photo.url;
				obj.videoDetail.photo = photo;
			}
		}
		obj.circle_names = obj.circle_names ? JSON.parse(obj.circle_names) : [];
		obj.topic_ids = obj.topic_ids ? JSON.parse(obj.topic_ids) : [];
		obj.topic_names = obj.topic_names ? JSON.parse(obj.topic_names) : [];
		obj.create_time = obj.create_time ? moment(obj.create_time).format(timeformat) : '';
		if (obj.userDetail) {
			obj.userDetail = responseUtil.renderFieldsObj(obj.userDetail, ['id', 'photo', 'school', 'username', 'integral']);
			if (obj.userDetail.photo) obj.userDetail.photo = userUtil.getPhotoUrl(obj.userDetail.photo);
		}
		if (user_id && obj.userDetail && obj.userDetail.id) {
			// 查看是否赞过这个帖子
			const hadGoods = await goodsRecordModal.findOne({ where: { user_id, content_id: obj.id, type: 1 } });
			obj.hadGoods = !!hadGoods;
			// 查看用户是否已经关注该用户
			const attentionDetail = await userAttentionModal.findOne({
				where: {
					user_id,
					other_id: obj.userDetail.id,
				},
			});
			if (attentionDetail) {
				obj.userDetail.hadAttention = true;
			}
		}
		return obj;
	},
	// 处理回复返回的内容
	handleComment,
	// 获取热门回复， 点赞量最多的
	getHotReply: async (content_id, user_id) => {
		const comments = await commentRecordModal.findOne({
			where: {
				content_id,
				type: 1, // 给帖子的评论
				is_delete: 1,
			},
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
			limit: 1,
			offset: 0,
		});
		if (!comments) return {};
		const result = await handleComment([comments], user_id);
		return result[0] || {};
	},
};
