import Express from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import { errorHandler } from "./middleware/errorHandling.js";
import cors from "cors";

const app = Express();

//middleware
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
    console.log(`error is ${error}`);
  });
//for deployment remove the / api

app.use("/api/user", userRoutes);
app.use("/api/posts", postRoutes);

// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send("Something broke!");
//   err.message = "hey man stop";
// });

app.get("/", (req, res) => {
  res.send({ name: "Nicholas" });
});
app.use(errorHandler);
const PORT = process.env.PORT || 5000;
app.listen(PORT, (req, res) => {
  console.log(`back end is running on port ${PORT}`);
});
