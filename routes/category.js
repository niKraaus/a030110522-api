import Category from "../models/Category.js";
import Express from "express";

const route = Express.Router();

//CREATE CATEGORY
route.post("/", async (req, res) => {
  const savedCat = new Category(req.body);
  try {
    await savedCat.save();
    res.status(200).json(savedCat);
  } catch (error) {
    res.status(500).json(`server error : ${error}`);
  }
});
// FETCH CATEGORY
route.get("/", async (req, res) => {
  try {
    const cats = await Category.find();
    res.status(200).json(cats);
  } catch (error) {
    res.status(500).json(`server error ${error}`);
  }
});
export default route;
