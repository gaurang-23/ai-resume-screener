const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Resume = sequelize.define(
  "Resume",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    jobDescription: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    analysis: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  {
    tableName: "resumes",
    timestamps: true,
    updatedAt: false,
  },
);

module.exports = Resume;
