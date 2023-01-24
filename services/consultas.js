const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
require("dotenv").config({ path: "./.env" });

const pool = new Pool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  allowExitOnIdle: true,
});

const addUser = async ({ email, password, rol, lenguage }) => {
  const encrypted = bcrypt.hashSync(password);
  password = encrypted;
  const query = "INSERT INTO usuarios VALUES (DEFAULT, $1, $2, $3, $4)";
  const values = [email, encrypted, rol, lenguage];
  await pool.query(query, values);
};

const validateCredentials = async (email, password) => {
  const values = [email];
  const consulta = "SELECT * FROM usuarios WHERE email = $1";
  const {
    rows: [usuario],
    rowCount,
  } = await pool.query(consulta, values);

  const { password: passwordEncriptada } = usuario;
  const passwordEsCorrecta = bcrypt.compareSync(password, passwordEncriptada)
  console.log(rowCount);
  if (!passwordEsCorrecta || rowCount === 0)
    throw { code: 401, message: "Email o contraseña incorrecta" };
};

const getUsers = async (email) => {
    const values = [email];
    const query = "SELECT * FROM usuarios WHERE email = $1";
    const { rows: users } = await pool.query(query, values);
  console.log(users)
  const user = {
    email: users[0].email,
    rol: users[0].rol,
    lenguage: users[0].lenguage
  }
    return user;
  };

module.exports = { addUser, validateCredentials, getUsers};
