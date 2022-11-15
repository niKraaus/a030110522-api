import mongoose from "mongoose";

const { Schema } = mongoose;
const CatSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const Category = mongoose.model("Category", CatSchema);
export default Category;
