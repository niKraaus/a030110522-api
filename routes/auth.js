import mongoose from "mongoose";
import Express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";

const router = Express.Router();
//handling user register
router.post("/register", async (req, res) => {
  const salt = bcrypt.genSaltSync(10);
  const hashPassword = bcrypt.hashSync(req.body.password, salt);
  try {
    const newUser = User({
      username: req.body.username,
      email: req.body.email,
      password: hashPassword,
    });
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(`server error: ${error}`);
  }
});
//handle login
router.post("/login", async (req, res) => {
  try {
    //user name
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      throw new Error("no user with found");
    }

    //password
    const validated = await bcrypt.compare(req.body.password, user.password);

    if (!validated) {
      throw new Error("the password is wrong");
    }

    const { password, ...others } = user._doc;
    res.status(200).json(others); //remove the password from data
  } catch (error) {
    res.status(500).json(error);
  }
});
export default router;
