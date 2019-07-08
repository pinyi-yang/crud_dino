'use strict';
module.exports = (sequelize, DataTypes) => {
  const img = sequelize.define('img', {
    url: DataTypes.TEXT,
    dinoId: DataTypes.INTEGER
  }, {});
  img.associate = function(models) {
    // associations can be defined here
    models.img.belongsTo(models.dino);
  };
  return img;
};