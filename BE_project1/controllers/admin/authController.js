const Admin = require("../../models/Admin");
const CryptoJs = require("crypto-js");
const jwt = require("jsonwebtoken");
const { isPhoneNumber, isEmail } = require("../../hepler/hepler");

const register = async (req, res) => {
  const existingEmail = await Admin.findOne({ email: req.body.email });
  if (existingEmail || !isEmail(req.body.email)) {
    return res.status(400).json({ message: "Email already exists or Invalid" });
  }
  if (!isPhoneNumber(req.body.phone)) {
    return res.status(400).json({ message: "Phone number Invalid" });
  }
  const hashedPassword = CryptoJs.AES.encrypt(
    req.body.password,
    process.env.SECRET_PASS
  ).toString();

  const admin = new Admin({
    fullname: req.body.fullname,
    email: req.body.email,
    password: hashedPassword,
    phone: req.body.phone,
    role: req.body.role,
  });
  try {
    await admin.save();
    return res.status(201).json(admin);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const login = async (req, res) => {
  try {
    const admin = await Admin.findOne({
      email: req.body.email,
    });
    if (!admin) {
      return res.status(401).json("Không tồn tại tài khoản này");
    }

    const hashedPassword = CryptoJs.AES.decrypt(
      admin.password,
      process.env.SECRET_PASS
    );
    const Originalpassword = hashedPassword.toString(CryptoJs.enc.Utf8);
    if (Originalpassword !== req.body.password) {
      return res.status(401).json("Mật khẩu không chính xác");
    } else {
      const token = jwt.sign(
        { id: admin._id, email: admin.email, role: admin.role, name: admin.fullname },
        process.env.JWT_SEC,
        { expiresIn: "7d" }
      );
      const { password, ...others } = admin._doc;
      return res.status(200).json({ ...others, token });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};


const verifyToken = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1]; // Lấy token từ header
  if (!token) { 
    return res.status(401).send("Token không được cung cấp");
  }

  jwt.verify(token, process.env.JWT_SEC, (err, decoded) => {
    if (err) {
      return res.status(401).send("Token không hợp lệ");
    }
    return res.status(200).send("Token hợp lệ");
  });
};

module.exports = { login, register, verifyToken };
