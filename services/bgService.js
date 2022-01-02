const fs = require('fs');
const sequelize = require('../dataSource/MysqlPoolClass');
const user = require('../models/user');
const bgImg = require('../models/bg_img');
const config = require('../config/config');
const resultMessage = require('../util/resultMessage');

const userModal = user(sequelize);
const bgImgModal = bgImg(sequelize);

module.exports = {
	// 上传背景图片
	uploadBg: async (req, res, filename) => {
		try {
			res.send(resultMessage.success(filename));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 获取所有默认背景图
	getDefalutBgImg: async (req, res) => {
		try {
			const bgs = await bgImgModal.findAll({ order: [['sort', 'DESC']] });
			const result = [];
			bgs.forEach((item) => {
				const imgUrl = JSON.parse(item.url);
				result.push(imgUrl);
			});
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 保存背景图的url
	saveBgUrl: async (req, res) => {
		try {
			const { user_id, filename } = req.body;
			if (!user_id) return res.send(resultMessage.error('请先登录'));
			const userDetail = await userModal.findOne({ where: { id: user_id, is_delete: 1 } });
			if (!userDetail) return res.send(resultMessage.error('请先登录'));
			// 删除以前图片
			if (userDetail && userDetail.bg_url) {
				if (userDetail.bg_url !== 'bg.png') {
					fs.unlink(`${config.userBgPath}/${userDetail.bg_url}`, (err) => {
						console.log(err);
					});
				}
			}
			await userModal.update(
				{
					bg_url: filename,
				},
				{
					where: {
						id: user_id,
					},
				},
			);
			res.send(resultMessage.success(config.preUrl.bgUrl + filename));
			// 用户积分 + 1
			userModal.increment({ integral: config.CHANGE_BG_INTEGRAL }, { where: { id: user_id } });
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},
};
