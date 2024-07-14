const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Dummy admin credentials
const admin = {
  username: "admin",
  password: bcrypt.hashSync("adminpassword", 10),
};

exports.login = (req, res) => {
  const { username, password } = req.body;

  if (username !== admin.username) {
    return res.status(401).json({ message: "Username salah" });
  }

  const passwordIsValid = bcrypt.compareSync(password, admin.password);

  if (!passwordIsValid) {
    return res.status(401).json({ message: "Password salah" });
  }

  const token = jwt.sign({ id: username }, process.env.JWTOKEN, {
    expiresIn: "1h",
  });
  res.status(200).json({ token });
};
