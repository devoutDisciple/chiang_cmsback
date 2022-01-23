const Sequelize = require('sequelize');
const moment = require('moment');
const sequelize = require('../dataSource/MysqlPoolClass');
const resultMessage = require('../util/resultMessage');
const order = require('../models/order');
const user = require('../models/user');
const project = require('../models/project');
const subject = require('../models/subject');
const responseUtil = require('../util/responseUtil');

const userModal = user(sequelize);
const projectModal = project(sequelize);
const subjectModal = subject(sequelize);
const orderModal = order(sequelize);

const pagesize = 10;
const Op = Sequelize.Op;

orderModal.belongsTo(userModal, { foreignKey: 'user_id', targetKey: 'id', as: 'userDetail' });
orderModal.belongsTo(projectModal, { foreignKey: 'project_id', targetKey: 'id', as: 'projectDetail' });
orderModal.belongsTo(subjectModal, { foreignKey: 'subject_id', targetKey: 'id', as: 'subjectDetail' });

const contentCommonFields = ['id', 'user_id', 'team_uuid', 'subject_id', 'project_id', 'pay_state', 'type', 'create_time'];

module.exports = {
	// 分页获取内容
	getAllOrderByConditions: async (req, res) => {
		try {
			const { current = 1, start_time, end_time } = req.query;
			const condition = { is_delete: 1 };
			if (start_time && end_time) {
				condition.create_time = {
					[Op.gte]: start_time,
					[Op.lte]: end_time,
				};
			}
			const offset = Number((current - 1) * pagesize);
			const contents = await orderModal.findAndCountAll({
				where: condition,
				order: [['create_time', 'DESC']],
				attributes: contentCommonFields,
				limit: pagesize,
				offset,
				include: [
					{
						model: userModal,
						as: 'userDetail',
						attributes: ['id', 'username', 'phone', 'photo'],
					},
					{
						model: projectModal,
						as: 'projectDetail',
						attributes: ['id', 'name', 'type_id'],
					},
					{
						model: subjectModal,
						as: 'subjectDetail',
						attributes: ['id', 'title'],
					},
				],
			});
			const result = {
				count: 0,
				list: [],
			};
			if (contents && contents.rows && contents.rows.length !== 0) {
				result.count = contents.count;
				result.list = responseUtil.renderFieldsAll(contents.rows, [
					...contentCommonFields,
					'userDetail',
					'projectDetail',
					'subjectDetail',
				]);
				result.list.forEach((item) => {
					item.create_time = moment(item.create_time).format('YYYY-MM-DD HH:mm:ss');
				});
			}
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},
};
