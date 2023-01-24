const isNotEmpty = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw { code: 406, message: "email o contraseña no pueden estar vacias" };
    }
    next();
  } catch (error) {
    res.status(error.code || 500).send(error);
  }
};

module.exports = isNotEmpty;