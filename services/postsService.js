const moment = require('moment');
const sizeOf = require('image-size');
const sequelize = require('../dataSource/MysqlPoolClass');
const content = require('../models/content');
const posts = require('../models/posts');
const video = require('../models/video');
const resultMessage = require('../util/resultMessage');
// const responseUtil = require('../util/responseUtil');

const contentModal = content(sequelize);
const postsModal = posts(sequelize);
const videoModal = video(sequelize);
const timeformat = 'YYYY-MM-DD HH:mm:ss';

module.exports = {
	// 上传背景图片
	uploadImg: async (req, res, filename) => {
		try {
			const dimensions = sizeOf(req.file.path);
			res.send(resultMessage.success({ url: filename, width: dimensions.width, height: dimensions.height }));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 上传视频
	uploadVideo: async (req, res, filename) => {
		try {
			const { photo, width, height, duration, size, user_id, circle_ids, circle_names, topic_ids, topic_names, desc } = req.body;
			const videoDetail = await videoModal.create({
				url: filename,
				photo,
				width,
				height,
				duration,
				size,
				desc,
			});
			await contentModal.create({
				user_id,
				circle_ids: circle_ids ? JSON.parse(circle_ids).join(',') : '',
				circle_names: circle_names ? JSON.stringify(circle_names) : '[]',
				topic_ids: topic_ids ? JSON.stringify(topic_ids) : '',
				topic_names: topic_names ? JSON.stringify(topic_names) : '[]',
				other_id: videoDetail.id,
				type: 5,
				create_time: moment().format(timeformat),
				update_time: moment().format(timeformat),
			});
			res.send(resultMessage.success({ url: filename }));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 上传视频封面
	uploadVideoCover: async (req, res, filename) => {
		try {
			res.send(resultMessage.success(filename));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 发布帖子或者博客
	addPostsOrBlogs: async (req, res) => {
		try {
			const { user_id, title, desc, imgUrls, circle_ids, circle_names, topic_ids, topic_names, type } = req.body;
			const postsDetail = await postsModal.create({
				title,
				desc,
				img_urls: imgUrls ? JSON.stringify(imgUrls) : '[]',
			});
			await contentModal.create({
				user_id,
				circle_ids: circle_ids ? JSON.parse(circle_ids).join(',') : '',
				circle_names: circle_names ? JSON.stringify(circle_names) : '[]',
				topic_ids: topic_ids ? JSON.stringify(topic_ids) : '[]',
				topic_names: topic_names ? JSON.stringify(topic_names) : '[]',
				other_id: postsDetail.id,
				type,
				create_time: moment().format(timeformat),
				update_time: moment().format(timeformat),
			});
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},
};
