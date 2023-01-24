const express = require('express');
const cors = require("cors");
require('dotenv').config();
const jwt = require("jsonwebtoken");
const app = express();
const PORT = process.env.APP_PORT || 3001;

const {addUser , validateCredentials, getUsers} = require("./services/consultas");

const isNotEmpty = require("./middlewares/isNotEmpy");
const recorder = require("./middlewares/recorder");
const verifyToken = require("./middlewares/verifyToken");

app.use(express.json()); 
app.use(cors());


app.post("/usuarios", recorder, async (req, res) => {
  try {
    const user = req.body;
    console.log(req.body);
    await addUser(user);
    res.send({ message: "user created" });
  } catch (error) {
    res.status(500).json({ message: "no se puede crear usuario" });
  }
});

app.post("/login", recorder, isNotEmpty,  async (req, res) => {
  try {
    const { email, password } = req.body;
    await validateCredentials(email, password);
    const token = jwt.sign({ email }, process.env.SECRET);
    res.send(token);
  } catch (error) {
    console.log(error);
    res.status(error.code || 500).send(error);
  }
});

app.get("/usuarios", recorder, verifyToken, async (req, res) => {
const autorizacion = req.header("Authorization");
const token = autorizacion.split("Bearer ")[1];
const {email} = jwt.decode(token);
console.log(email);
  try {
    const users = await getUsers(email);
    res.send(users);
  } catch (error) {}
});

app.listen(PORT, () => {
    console.log(`Server is running on the port : ${PORT}`);
  });