const moment = require('moment');
const sequelize = require('../dataSource/MysqlPoolClass');
const resultMessage = require('../util/resultMessage');
const message = require('../models/message');
const user = require('../models/user');
const responseUtil = require('../util/responseUtil');

const messageModal = message(sequelize);
const userModal = user(sequelize);

messageModal.belongsTo(userModal, { foreignKey: 'user_id', targetKey: 'id', as: 'userDetail' });

module.exports = {
	// 添加信息
	addMsg: async (req, res) => {
		try {
			const { user_id, person_id, username, user_photo, content } = req.body;
			await messageModal.create({
				user_id,
				person_id,
				username,
				user_photo,
				content,
				create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
			});
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 获取我收到的信息
	msgsByUserId: async (req, res) => {
		try {
			const { user_id } = req.query;
			// 查询所有未读信息
			const msgs = await messageModal.findAll({ where: { person_id: user_id, is_delete: 1 }, order: [['create_time', 'DESC']] });
			if (!msgs) return res.send(resultMessage.success([]));
			// 将所有未读信息设置为已读
			messageModal.update(
				{ is_delete: 2 },
				{
					where: {
						person_id: user_id,
					},
				},
			);
			const result = responseUtil.renderFieldsAll(msgs, [
				'id',
				'user_id',
				'person_id',
				'username',
				'user_photo',
				'content',
				'create_time',
			]);

			if (result && result.length !== 0) {
				return res.send(resultMessage.success({ data: result, total: result.length }));
			}
			res.send(resultMessage.success('暂无消息'));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},
};
