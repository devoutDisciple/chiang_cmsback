const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('topic', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    circle_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      comment: "所属圈子id"
    },
    name: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "话题名称"
    },
    hot: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1,
      comment: "热度"
    },
    sort: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1,
      comment: "排序"
    },
    create_time: {
      type: Sequelize.DATE,
      allowNull: true
    },
    is_delete: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1,
      comment: "1-存在 2-删除"
    }
  }, {
    sequelize,
    tableName: 'topic',
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
