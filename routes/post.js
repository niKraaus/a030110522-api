import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import Express from "express";
import Post from "../models/Post.js";

const router = Express.Router();

//CREATE POST
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (error) {
    res.status(500).json(`server error : ${error}`);
  }
});
//UPDATE POST
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) {
      try {
        const updatedPost = await Post.findByIdAndUpdate(
          req.params.id,
          { $set: req.body },
          { new: true }
        );
        res.status(200).json(updatedPost);
      } catch (error) {
        res.status(500).json(`server error ${error}`);
      }
    } else {
      res.status(401).json("you can only update your profile");
    }
  } catch (error) {
    res.status(500).json(`server error ${error}`);
  }
});
//DELETE POST
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) {
      try {
        await post.delete();
        res.status(200).json("the post has been successfully deleted");
      } catch (error) {
        res.status(400).json(error);
      }
    } else {
      res.status(401).json("you can only delete your post");
    }
  } catch (error) {
    res.status(500).json(`server eror: ${error}`);
  }
});
//GET POST
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post) {
      res.status(200).json(post);
    }
  } catch (error) {
    res.status(500).json(`server error : ${error}`);
  }
});
//GET ALL POSTS
router.get("/", async (req, res) => {
  // const username = req.query.user;
  const userName = req.rawHeaders && req.rawHeaders[15].split("=")[1];
  const catName = req.rawHeaders && req.rawHeaders[15].split("=")[1];
  try {
    let posts;
    if (userName) {
      console.log(userName);
      posts = await Post.find({ username: userName });
    } else if (catName) {
      posts = await Post.find({ category: { $in: [catName] } });
    } else {
      posts = await Post.find();
    }
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(`server error : ${err}`);
  }
});
export default router;
