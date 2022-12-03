import User from "../models/User.js";
import bcrypt from "bcrypt";
import asyncHandler from "express-async-handler";

// @desc
// handling user registering
const registerUser = asyncHandler(async (req, res) => {
  const { userName, phoneNumber, password } = req.body;
  const user = await User.findOne({ phoneNumber });
  const _user = await User.findOne({ userName });
  if (user) {
    res.status(400);
    throw new Error(`the user with ${phoneNumber} already exists`);
  }
  if (_user) {
    res.status(400);
    throw new Error(`the user with name : ${userName} already exists`);
  }
  //@desc
  //hashing the password
  const salt = bcrypt.genSaltSync(10);
  const hashPassword = bcrypt.hashSync(password, salt);
  //@desc
  //creating the user in the database
  const newUser = await User.create({
    userName,
    phoneNumber,
    password: hashPassword,
  });
  //@desc
  //checking the user in the data base and returning the appropriate data
  if (newUser) {
    res.status(201).json({
      id: newUser._id,
      userName: newUser.userName,
      isAdmin: newUser.isAdmin,
    });
  } else {
    res.status(400);
    throw new Error("wrong user data, try again");
  }
});

//@desc
//Handling user login
//we get the user input and compare it with the data in the database
//then we handle the errors
const loginUser = asyncHandler(async (req, res, next) => {
  const { phoneNumber, password } = req.body;
  const user_phone = await User.findOne({ phoneNumber });
  try {
    if (!user_phone) {
      res.status(400);
      throw new Error(`user with ${phoneNumber} not found`);
    }
    const validated = await bcrypt.compare(password, user_phone.password);

    if (!validated) {
      res.status(401);
      throw new Error("the password you entered is incorrect");
    }
    res.status(200).json({
      id: user_phone._id,
      userName: user_phone.userName,
      phoneNumber: user_phone.phoneNumber,
      isAdmin: user_phone.isAdmin,
    });
  } catch (err) {
    next(err);
  }
});
//@des
//get single user
const getOneUser = asyncHandler(async (req, res) => {
  const user = req.body.id;
  await User.findById(user);
  if (user) {
    res.status(200).json({
      id: user._id,
      userName: user.userName,
      phoneNumber: user.phoneNumber,
    });
  } else {
    res.status(401);
    throw new Error("no such user is found");
  }
});
//@desc
//get all users (this will be showing in admin panel)
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  if (users.length > 0) {
    res.status(200).json(users);
  } else {
    res.status(401);
    throw new Error("no users yet");
  }
});
//@desc
//delete a user
const deleteUser = asyncHandler(async (req, res) => {
  const user = req.params.id;
  if (req.body.user.isAdmin) {
    await User.findByIdAndDelete(user);
    res.status(200).json("The user has been deleted");
  } else {
    res.status(401);
    throw new Error("not authorized");
  }
});
export { registerUser, loginUser, getAllUsers, deleteUser, getOneUser };
