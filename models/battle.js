const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('battle', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "pk标题"
    },
    red_url: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "红方图片url"
    },
    red_name: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "红方名称"
    },
    blue_url: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "蓝方图片url"
    },
    blue_name: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "蓝方名称"
    },
    red_ticket: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "红方得票数"
    },
    blue_ticket: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "蓝方得票数"
    },
    type: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1,
      comment: "1-一天  3-三天  5-五天"
    },
    create_time: {
      type: Sequelize.DATE,
      allowNull: true,
      comment: "创建时间"
    },
    dead_time: {
      type: Sequelize.DATE,
      allowNull: true,
      comment: "截止时间"
    }
  }, {
    sequelize,
    tableName: 'battle',
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
