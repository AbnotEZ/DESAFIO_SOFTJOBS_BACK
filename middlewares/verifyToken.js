require("dotenv").config({ path: "./.env" });
const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  try {
    const token = getToken(req.header("Authorization"));
    jwt.verify(token, process.env.SECRET);
    next();
  } catch (error) {
    res.status(error.code || 498).send(error);
  }
};

module.exports = verifyToken;