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
	getByCircleId: async (req, res) => {
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

	// 根据圈子id获取话题
	getByCircleIds: async (req, res) => {
		try {
			let { circleIds } = req.query;
			circleIds = JSON.parse(circleIds) || [];
			const circleList = await circleModal.findAll({
				where: { id: circleIds, is_delete: 1 },
				include: [
					{
						model: topicModal,
						as: 'topics',
					},
				],
			});
			const result = [];
			if (circleList && circleList.length !== 0) {
				circleList.forEach((cir) => {
					const obj = {
						circle_id: cir.id,
						circle_name: cir.name,
					};
					const topics = cir.topics || [];
					if (topics && topics.length !== 0) {
						obj.topics = [];
						topics.forEach((tp) => {
							obj.topics.push({
								topic_id: tp.id,
								topic_name: tp.name,
								selected: false,
							});
						});
					}
					result.push(obj);
				});
			}

			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},
};
