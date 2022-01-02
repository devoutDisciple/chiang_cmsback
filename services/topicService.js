const sequelize = require('../dataSource/MysqlPoolClass');
const resultMessage = require('../util/resultMessage');
const responseUtil = require('../util/responseUtil');
const topic = require('../models/topic');
const circle = require('../models/circle');

const circleModal = circle(sequelize);
const topicModal = topic(sequelize);

circleModal.hasMany(topicModal, { foreignKey: 'circle_id', targetKey: 'id', as: 'topics' });

module.exports = {
	// 根据圈子id获取话题
	getAllByCircleId: async (req, res) => {
		try {
			const { circle_id } = req.query;
			const topics = await topicModal.findAll({
				where: { circle_id, is_delete: 1 },
				order: [['hot', 'DESC']],
			});
			const result = responseUtil.renderFieldsAll(topics, ['id', 'name', 'hot']);
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 删除话题
	deleteTopicById: async (req, res) => {
		try {
			const { topicId } = req.body;
			await topicModal.destroy({ where: { id: topicId } });
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 新增话题
	addTopic: async (req, res) => {
		try {
			const { topicName, circleId } = req.body;
			await topicModal.create({ circle_id: circleId, name: topicName });
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},
};
