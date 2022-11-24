import mongoose from "mongoose";
import Express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";

const router = Express.Router();
//handling user register
router.post("/register", async (req, res) => {
  const salt = bcrypt.genSaltSync(10);
  const hashPassword = bcrypt.hashSync(req.body.password, salt);
  const user = await User.findOne({ username: req.body.username });
  const email = await User.findOne({ username: req.body.email });
  if (user || email) {
    res.status(400);
    throw new Error("email or user name already in use");
  }
  try {
    const newUser = User({
      username: req.body.username,
      email: req.body.email,
      password: hashPassword,
    });
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (error) {}
});
//handle login
router.post("/login", async (req, res) => {
  try {
    //user name
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      req.status(401);
      throw new Error("no user with found");
    }

    //password
    const validated = await bcrypt.compare(req.body.password, user.password);

    if (!validated) {
      res.status(401);
      throw new Error("the password is wrong");
    }

    const { password, ...others } = user._doc;
    res.status(200).json(others); //remove the password from data
  } catch (error) {}
});
export default router;
