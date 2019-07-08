'use strict';
module.exports = (sequelize, DataTypes) => {
  const dino = sequelize.define('dino', {
    name: DataTypes.TEXT,
    type: DataTypes.TEXT
  }, {
    // hooks: {
    //     beforeCreate: function(d) {
    //       d.name = d.name.toUpperCase();
    //     }
    //   }
  });
  dino.associate = function(models) {
    // associations can be defined here
    models.dino.hasMany(models.img);
  };
  
  // dino.hook('beforeCreate', function(b) {
  //   b.name=b.name.toUpperCase();
  // });

  dino.beforeCreate(function(d) {
    d.name = d.name.toUpperCase();
  });
  
  return dino;
};
