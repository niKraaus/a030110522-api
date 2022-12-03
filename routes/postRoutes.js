import express from "express";
const router = express.Router();
import {
  getAllPosts,
  getOnePost,
  deletePost,
  updatePost,
  createPost,
  getAllPostsForOneUSer,
} from "./post.js";
//get should always be on the top
//avoid using double get requests
router.route("/user").get(getAllPostsForOneUSer);
router.route("/create").post(createPost);
router.route("/:id").put(updatePost).delete(deletePost).get(getOnePost);
router.route("/").get(getAllPosts);

export default router;
