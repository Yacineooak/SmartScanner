import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Scan = sequelize.define('Scan', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  scanType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  target: {
    type: DataTypes.STRING,
    allowNull: false
  },
  portRange: {
    type: DataTypes.STRING
  },
  status: {
    type: DataTypes.ENUM('pending', 'in-progress', 'completed', 'failed'),
    defaultValue: 'pending'
  },
  results: {
    type: DataTypes.JSONB
  },
  vulnerabilities: {
    type: DataTypes.JSONB
  },
  startTime: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  endTime: {
    type: DataTypes.DATE
  }
});

export default Scan;