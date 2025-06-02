const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Waitlist = sequelize.define('Waitlist', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false
  },
  transactionVolume: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  salary: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  debt: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  cardType: {
    type: DataTypes.ENUM('classic', 'optimo', 'femme', 'gold', 'platinum'),
    allowNull: false
  }
}, {
  timestamps: true
});

module.exports = Waitlist;