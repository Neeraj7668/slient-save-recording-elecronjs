require("dotenv").config();

module.exports = {
  MONGODB_URI:
    process.env.MONGODB_URI ||
    "mongodb+srv://neerajmaurya001:neeraj001@cluster0.ax4dk.mongodb.net/demo",
};
