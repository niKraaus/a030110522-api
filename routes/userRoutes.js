import express from "express";
const router = express.Router();
import {
  registerUser,
  deleteUser,
  getAllUsers,
  getOneUser,
  loginUser,
} from "./auth.js";

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/all").get(getAllUsers);
router.route("/:id").delete(deleteUser);
router.route("/:id").get(getOneUser);
export default router;
