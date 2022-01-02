const sequelize = require('../dataSource/MysqlPoolClass');
const resultMessage = require('../util/resultMessage');
const address = require('../models/address');

const addressModal = address(sequelize);

// 获取地区列表树形结构
const getAddressByTree = (list, item_id) => {
	const arr = [];
	list.forEach((item) => {
		if (item.parent_id === item_id) {
			const obj = { key: item.id, id: item.id, name: item.name, type: item.type, sort: item.sort };
			arr.push(obj);
			if (item.type !== 3) {
				obj.children = getAddressByTree(list, item.id);
			}
		}
	});
	return arr;
};

module.exports = {
	// 获取所有地区
	getAll: async (req, res) => {
		try {
			const addressAll = await addressModal.findAll({ where: { is_delete: 1 }, order: [['sort', 'DESC']] });
			const newList = getAddressByTree(addressAll, -1);
			res.send(resultMessage.success(newList));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 新增省份
	addProvince: async (req, res) => {
		try {
			const { name, sort, parentId, type } = req.body;
			await addressModal.create({ name, sort, type, parent_id: parentId });
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 删除地区
	deleteAddressById: async (req, res) => {
		try {
			const { id } = req.body;
			await addressModal.update({ is_delete: 2 }, { where: { id } });
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},
};
