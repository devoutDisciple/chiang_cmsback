const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('plate', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "板块名称"
    },
    url: {
      type: Sequelize.STRING(255),
      allowNull: true
    },
    sort: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: "板块权重"
    },
    type: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: "1-圈子 2-其他"
    },
    link: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 2,
      comment: "1-支持跳转 2-不支持跳转"
    },
    hot: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1,
      comment: "热度"
    },
    create_time: {
      type: Sequelize.DATE,
      allowNull: true,
      comment: "创建时间"
    },
    update_time: {
      type: Sequelize.DATE,
      allowNull: true,
      comment: "更新时间"
    },
    is_delete: {
      type: Sequelize.STRING(255),
      allowNull: true,
      defaultValue: "1",
      comment: "1-存在 2-删除"
    }
  }, {
    sequelize,
    tableName: 'plate',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
