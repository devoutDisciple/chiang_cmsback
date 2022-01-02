const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('battle_record', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    content_id: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    type: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: "1-选择红色方 2-选择蓝色方"
    },
    create_time: {
      type: Sequelize.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'battle_record',
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
