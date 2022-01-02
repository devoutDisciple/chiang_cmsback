const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('account', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    username: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "用户名称"
    },
    account: {
      type: Sequelize.STRING(255),
      allowNull: false,
      comment: "登录账号"
    },
    password: {
      type: Sequelize.STRING(255),
      allowNull: false,
      comment: "密码"
    },
    phone: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "手机号"
    },
    role: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: "1-超级管理员 2-管理员 3-用户"
    },
    is_delete: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1,
      comment: "1-存在 2-删除"
    },
    create_time: {
      type: Sequelize.DATE,
      allowNull: true,
      comment: "创建时间"
    }
  }, {
    sequelize,
    tableName: 'account',
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
