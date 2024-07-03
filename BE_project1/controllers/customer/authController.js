import Customer from "../../models/Customer";
import CryptoJs from "crypto-js";
import jwt from "jsonwebtoken";
import { isEmail, isPhoneNumber } from "../../hepler/hepler";
import Contact from "../../models/Contact";
import mongoose from "mongoose";

const register = async (req, res) => {
  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    const existingEmail = await Customer.findOne({ email: req.body.email });
    if (existingEmail || !isEmail(req.body.email)) {
      return res
        .status(400)
        .json({ message: "Email already exists or Invalid" });
    }
    if (!isPhoneNumber(req.body.phone)) {
      return res.status(400).json({ message: "Phone Number Invalid " });
    }
    const hashedPassword = CryptoJs.AES.encrypt(
      req.body.password,
      process.env.SECRET_PASS_CUS
    ).toString();
    const customer = new Customer({
      fullname: req.body.fullname,
      email: req.body.email,
      password: hashedPassword,
      phone: req.body.phone,
    });
    const contact = new Contact({
      room_chat: customer._id,
    });
    // await contact.save({ session });
    // await customer.save({ session });
    await session.commitTransaction();
    session.endSession();
    return res.status(201).json("Register successfully, Please Login");
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log(error);
    return res.status(500).json(error);
  }
};

const login = async (req, res) => {
  try {
    const customer = await Customer.findOne({
      email: req.body.email,
    });
    if (!customer) {
      return res.status(401).json("Account does not exists");
    }
    const hashedPassword = CryptoJs.AES.decrypt(
      customer.password,
      process.env.SECRET_PASS_CUS
    );
    const Originalpassword = hashedPassword.toString(CryptoJs.enc.Utf8);
    if (Originalpassword !== req.body.password) {
      return res.status(401).json("Password is incorect");
    } else {
      const token = jwt.sign(
        { id: customer._id, email: customer.email, name: customer.fullname },
        process.env.JWT_SEC_CUS,
        { expiresIn: "7d" }
      );
      const { password, ...others } = customer._doc;
      return res.status(200).json({ ...others, token });
    }
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const verifyToken = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).send("Token does not exist");
    }

    jwt.verify(token, process.env.JWT_SEC_CUS, (err, decoded) => {
      if (err) {
        return res.status(401).send("Token Invalid");
      }
      return res.status(200).send("Token Valid");
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

export { register, login, verifyToken };
