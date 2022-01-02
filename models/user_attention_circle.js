const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('user_attention_circle', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      comment: "用户id"
    },
    circle_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      comment: "圈子id"
    },
    self_school: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 2,
      comment: "1-是本校 2-其他"
    },
    sort: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1,
      comment: "1"
    },
    type: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1,
      comment: "1-普通关注 2-首页存在"
    },
    create_time: {
      type: Sequelize.DATE,
      allowNull: true
    },
    is_delete: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: "1-存在 2-删除"
    }
  }, {
    sequelize,
    tableName: 'user_attention_circle',
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
