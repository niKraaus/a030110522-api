import Express from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import authRouter from "./routes/auth.js";
import userRouter from "./routes/user.js";
import postRouter from "./routes/post.js";
import catRouter from "./routes/category.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

//middleware
const app = Express();
app.use(Express.json());
app.use(cors());

//initialise
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/images", Express.static(path.join(__dirname, "/images")));

//connect to the data base
mongoose
  .connect(process.env.MONGO_URL)
  .then(console.log("backend has connected to the database"))
  .catch((error) => {
    console.log(error);
  });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  }, //image name will have to change
});
const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json("file has been uploaded");
});

app.use("/api/auth/", authRouter);
app.use("/api/user/", userRouter);
app.use("/api/posts/", postRouter);
app.use("/api/categories", catRouter);

app.listen("5000", (req, res) => {
  console.log("back end is running on port 5000");
});
app.get("/", (req, res) => {
  res.send("Hello");
});
