const moment = require('moment');
const sizeOf = require('image-size');
const fs = require('fs');
const sequelize = require('../dataSource/MysqlPoolClass');
const content = require('../models/content');
const posts = require('../models/posts');
const album = require('../models/album');
const user = require('../models/user');
const video = require('../models/video');
const circle = require('../models/circle');
const config = require('../config/config');
const resultMessage = require('../util/resultMessage');
// const responseUtil = require('../util/responseUtil');

const userModal = user(sequelize);
const albumModal = album(sequelize);
const postsModal = posts(sequelize);
const videoModal = video(sequelize);
const circleModal = circle(sequelize);
const contentModal = content(sequelize);
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

	// 发布视频
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
				circle_names: circle_names || '[]',
				topic_ids: topic_ids || '',
				topic_names: topic_names || '[]',
				other_id: videoDetail.id,
				type: 5,
				create_time: moment().format(timeformat),
				update_time: moment().format(timeformat),
			});
			res.send(resultMessage.success({ url: filename }));
			// 用户积分 + 3, 发布 + 1
			userModal.increment({ integral: config.PUBLISH_VIDEO_INTEGRAL, publish: 1 }, { where: { id: user_id } });
			// 圈子热度 + 3
			if (circle_ids && Array.isArray(circle_ids)) {
				circle_ids.forEach((circle_id) => {
					circleModal.increment({ hot: config.PUBLISH_VIDEO_INTEGRAL }, { where: { id: circle_id } });
				});
			}
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 上传视频封面
	uploadVideoCover: async (req, res, filename) => {
		try {
			const dimensions = sizeOf(req.file.path);
			res.send(resultMessage.success({ url: filename, width: dimensions.width, height: dimensions.height }));
			// res.send(resultMessage.success(filename));
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
				circle_ids: circle_ids ? circle_ids.join(',') : '',
				circle_names: circle_names ? JSON.stringify(circle_names) : '[]',
				topic_ids: topic_ids ? JSON.stringify(topic_ids) : '[]',
				topic_names: topic_names ? JSON.stringify(topic_names) : '[]',
				other_id: postsDetail.id,
				type,
				create_time: moment().format(timeformat),
				update_time: moment().format(timeformat),
			});
			res.send(resultMessage.success('success'));
			if (type === 6) {
				const bluckList = [];
				let len = imgUrls.length;
				while (len > 0) {
					len -= 1;
					const curItem = imgUrls[len];
					await fs.copyFileSync(`${config.postsPath}/${curItem.url}`, `${config.albumPath}/${curItem.url}`);
					bluckList.push({
						user_id,
						url: JSON.stringify(curItem),
						create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
					});
				}
				console.log(bluckList, 1232);
				albumModal.bulkCreate(bluckList);
				// imgUrls.forEach(async (item) => {
				// 	await fs.copyFileSync(`${config.postsPath}/${item.url}`, `${config.albumPath}/${item.url}`);
				// 	bluckList.push({
				// 		user_id,
				// 		url: item,
				// 		create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
				// 	});
				// });
				// console.log(bluckList, 1232);
			}
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
};
