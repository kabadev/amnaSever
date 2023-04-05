import User from "../model/User.js";
import bcrypt from "bcrypt";
import { query } from "express";

//create new user/ partner function
export const create = async (req, res) => {
  try {
    //generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      fullName: req.body.fullName,
      email: req.body.email,
      mobile: req.body.mobile,
      role: req.body.role,
      country: req.body.country,
      avatar: req.body.avatar,
      joinDate: req.body.joinDate,
      password: hashedPassword,
    });

    // check if email already exist
    const existEmail = await User.findOne({ email: req.body.email });
    if (existEmail) {
      return res.status(400).json({
        message: "Email Already Exist",
        success: false,
        statusCode: 400,
      });
    } else {
      await newUser.save();
      res.status(200).json({
        message: "User created successfully",
        success: true,
        statusCode: 200,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Something Went Wrong ",
      error: err,
      success: false,
      statusCode: 500,
    });
  }
};

export const Login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    !user &&
      res.status(400).json({
        message: "Email is incorrect",
        success: false,
        statusCode: 400,
      });

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    !validPassword &&
      res
        .status(400)
        .json({ message: "Wrong Password", success: false, statusCode: 400 });

    // if user && validPassword create token
    // ........
    // ........

    const { password, updatedAt, ...others } = user._doc;
    res.status(200).json({
      ...others,
    });
    // }
  } catch (err) {
    res.status(500).json({
      message: "Somethings Went Wrong ",
      error: err,
      success: false,
      statusCode: 500,
    });
  }
};

// get one n
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      const { password, ...userData } = user._doc;
      res.status(200).json({
        message: "success",
        success: true,
        statusCode: 200,
        data: userData,
      });
    } else {
      res
        .status(404)
        .json({ message: "User Not Found", success: false, statusCode: 404 });
    }
  } catch (err) {
    res.status(500).json({
      message: "Somethings Went Wrong Please",
      error: err,
      success: false,
      statusCode: 500,
    });
  }
};
// getALluser
export const getAllUser = async (req, res) => {
  try {
    const roles = req.query.role?.split(",") || [];
    const query = roles.length > 0 ? { role: { $in: roles } } : {};
    const users = await User.find(query);
    res.status(200).json({
      message: "success",
      success: true,
      statusCode: 200,
      data: users,
    });
  } catch (err) {
    res.status(500).json({
      message: "Something Went Wrong",
      error: err.message,
      success: false,
      statusCode: 500,
    });
  }
};

// update user

// delete user
