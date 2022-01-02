const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('content', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: "发布人id"
    },
    circle_ids: {
      type: Sequelize.STRING(255),
      allowNull: true,
      defaultValue: "[]",
      comment: "圈子id"
    },
    circle_names: {
      type: Sequelize.STRING(255),
      allowNull: true,
      defaultValue: "[]",
      comment: "圈子的name"
    },
    topic_ids: {
      type: Sequelize.STRING(255),
      allowNull: true,
      defaultValue: "[]",
      comment: "所属话题id"
    },
    topic_names: {
      type: Sequelize.STRING(255),
      allowNull: true,
      defaultValue: "[]",
      comment: "话题的name"
    },
    other_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: "关联的id"
    },
    type: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1,
      comment: "1-帖子 2-博客 3-投票 4-pk 5-视频"
    },
    goods: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "点赞"
    },
    comment: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "评论"
    },
    share: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "转发"
    },
    hot: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1,
      comment: "热度"
    },
    create_time: {
      type: Sequelize.DATE,
      allowNull: true
    },
    update_time: {
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
    tableName: 'content',
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
