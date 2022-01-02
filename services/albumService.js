const moment = require('moment');
const sizeOf = require('image-size');
const sequelize = require('../dataSource/MysqlPoolClass');
const album = require('../models/album');
const config = require('../config/config');
const resultMessage = require('../util/resultMessage');
const responseUtil = require('../util/responseUtil');

const albumModal = album(sequelize);
const timeformat = 'YYYY-MM-DD HH:mm:ss';

module.exports = {
	// 上传相册
	uploadImg: async (req, res, filename) => {
		try {
			const { user_id } = req.body;
			const { width, height } = sizeOf(req.file.path);
			await albumModal.create({
				user_id,
				url: JSON.stringify({ url: filename, width, height }),
				create_time: moment().format(timeformat),
			});
			res.send(resultMessage.success({ url: filename, width, height }));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	//  获取所有相册
	getAllImgByUserId: async (req, res) => {
		try {
			const { user_id } = req.query;
			if (!user_id) return res.send(resultMessage.error('请先登录'));
			// 查找所有图片
			const albums = await albumModal.findAll({
				where: { user_id, is_delete: 1 },
				attributes: ['id', 'url', 'create_time'],
				order: [['create_time', 'DESC']],
			});
			const albumsRes = [];
			let obj = {
				time: '',
				imgs: [],
			};
			if (albums && albums.length !== 0) {
				albums.forEach((item) => {
					const newItem = responseUtil.renderFieldsObj(item, ['id', 'url', 'create_time']);
					newItem.create_time = moment(newItem.create_time).format('YYYY-MM');
					newItem.url = JSON.parse(newItem.url);
					newItem.url.url = config.preUrl.albumUrl + newItem.url.url;
					if (newItem.create_time !== obj.time) {
						obj = {
							time: '',
							imgs: [],
						};
						obj.time = newItem.create_time;
						obj.imgs.push(newItem.url);
						obj.showMonth = moment(obj.time).format('MM月');
						obj.showYear = moment(obj.time).format('YYYY');
						albumsRes.push(obj);
					} else {
						obj.imgs.push(newItem.url);
					}
				});
			}
			res.send(resultMessage.success(albumsRes));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},
};
