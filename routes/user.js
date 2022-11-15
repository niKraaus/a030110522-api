import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import Express from "express";
import Post from "../models/Post.js";

const router = Express.Router();

//UPDATE USER
router.put("/:id", async (req, res) => {
  if (req.body.userId == req.params.id) {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(401).json("you can only update your profile");
  }
});
//DELETE USER
router.delete("/:id", async (req, res) => {
  if (req.body.userId == req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      try {
        await Post.deleteMany({ username: user.username });
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("the user has been successfully deleted");
      } catch (error) {
        res.status(500).json(`no no ${error}`);
      }
    } catch (error) {
      res.status(401).json("the user is not found");
    }
  } else {
    res.status(401).json("you can only delete your account");
  }
});
//GET USER
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (error) {
    res.status(500).json(error);
  }
});
export default router;
