const User = require("./User");
const Resume = require("./Resume");

// One User has many Resumes
User.hasMany(Resume, {
  foreignKey: "userId",
  as: "resumes",
  onDelete: "CASCADE",
});

// Each Resume belongs to one User
Resume.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

module.exports = {
  User,
  Resume,
};
