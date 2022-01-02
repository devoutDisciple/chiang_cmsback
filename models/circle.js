const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('circle', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    plate_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: "板块id"
    },
    name: {
      type: Sequelize.STRING(255),
      allowNull: false,
      comment: "圈子名称"
    },
    desc: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "圈子简介"
    },
    fellow: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "关注人数"
    },
    blogs: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "博客数量"
    },
    posts: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "帖子数量"
    },
    vote: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "投票数量"
    },
    battle: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "pk数量"
    },
    videos: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    hot: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "热度"
    },
    type: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1,
      comment: "1-学校圈子 2-其他圈子"
    },
    province: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "省"
    },
    city: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "市"
    },
    country: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "区"
    },
    logo: {
      type: Sequelize.STRING(255),
      allowNull: true,
      defaultValue: "logo.png",
      comment: "圈子头像"
    },
    bg_url: {
      type: Sequelize.STRING(255),
      allowNull: true,
      defaultValue: "bg.png",
      comment: "背景图"
    },
    sort: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1,
      comment: "权重"
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
    tableName: 'circle',
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
