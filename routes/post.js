import Post from "../models/Post.js";
import AsyncHandler from "express-async-handler";

//@desc
//POST REQUEST
//creating a post
const createPost = AsyncHandler(async (req, res) => {
  const { title, desc, photo, audio, userName } = req.body;
  const postExists = await Post.findOne({ title });
  if (postExists) {
    res.status(400);
    throw new Error(`post with title :  ${title} already exists`);
  }
  if (title === null) {
    res.status(400);
    throw new Error("null title");
  }
  if (desc === null) {
    res.status(400);
    throw new Error("null description");
  }
  const newPost = await Post.create({
    title,
    desc,
    photo,
    audio,
    userName,
  });
  if (newPost) {
    res.status(200).json({
      id: newPost._id,
      title: newPost.title,
      desc: newPost.desc,
      photo: newPost.photo,
      audio: newPost.audio,
      userName: newPost.userName,
    });
  }
});

//@desc
//PUT REQUEST
//updating a post
const updatePost = AsyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post.userName === req.body.userName) {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatePost);
  } else {
    res.status(401);
    throw new Error("unathorized action requested");
  }
});

//@desc
//DELETE REQUEST
//deleting a post

const deletePost = AsyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post.userName === req.body.userName || req.body.userName.isAdmin) {
    await post.delete();
    res.status(200).json("successfully deleted !");
  } else {
    res.status(401);
    throw new Error("unauthorized acyion requested");
  }
});

//@desc
//GET REQUEST
//get a single Post

const getOnePost = AsyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post) {
    res.status(200).json(post);
  } else {
    res.status(400);
    throw new Error("no such post");
  }
});
//@desc
//GET REQUEST
//get all posts

export const getAllPosts = AsyncHandler(async (req, res) => {
  const userName = req.query.user || req.params.user;

  let posts = [];

  if (userName) {
    posts = await Post.find({ userName: userName });
  } else {
    posts = await Post.find();
  }
  res.status(200).json(posts);
});
//@des
//GET REQUEST
//get post for specified user

export const getAllPostsForOneUSer = AsyncHandler(async (req, res) => {
  const userName = req.query.user;
  let posts = [];

  if (userName) {
    posts = await Post.find({ userName: userName });
    res.status(200).json(posts);
  } else {
    res.status(400);
    throw new Error("no posts found");
  }
});
//
//end

export { getOnePost, deletePost, updatePost, createPost };
