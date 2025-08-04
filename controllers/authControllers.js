import UserModel from "../models/user.js";
import { setUser, getUser } from "../auth.js";

export async function handleUserLogin(req, res) {
  if (!req.body) return res.json({ authenticated: false });
  const { email, password } = req.body;

  // check in db
  const user = await UserModel.findOne({ email, password });
  if (!user)
    return res.json({
      authenticated: false,
      msg: "Invalid email and password entered",
    });

  // set cookie
  const token = setUser(user);

  // store this jwt token in cookies
  res.cookie("uid", token, {
    maxAge: 86400000, // 1 day
    httpOnly: true, // optional, for security
    sameSite: 'None', // for cross-origin
  });
  return res
    .status(200)
    .json({ authenticated: true, msg: "Logged in Successfully" });
}

export async function handleUserSignup(req, res) {
  if (!req.body)
    return res.json({
      authenticated: false,
      msg: "Please fill the required fields",
    });

  const { name, email, password } = req.body;

  // store user info in db
  try {
    const user = await UserModel.create({ name, email, password });
    if (!user)
      return res.json({
        authenticated: false,
        msg: "User exists with same email",
      });
  } catch (error) {
    // Duplicate key error
    if (error.code === 11000) {
      // Get the field that caused the duplicate
      const field = Object.keys(error.keyValue)[0];
      const value = error.keyValue[field];

      return res.json({
        msg: `The ${field} '${value}' is already in use.`,
      });
    }
    return res.json({ authenticated: false, msg: error.message });
  }
  return res.json({ authenticated: true, msg: "Registeration Successfull" });
}

export async function handleUserLogout(req, res) {
  if (!req.cookies?.uid) return res.json({ authenticated: false, msg: "" });

  res.clearCookie("uid", {
    httpOnly: true,
  });
  return res.json({ msg: "logged out successfully" });
}

export async function handleFetchCurrentUser(req, res) {
  if (!req.cookies?.uid)
    return res.json({ authenticated: false, msg: "user not logged in" });

  const token = req.cookies?.uid;

  const { _id, email } = getUser(token); // destructuring

  const findUser = await UserModel.findOne({ email });
  if (!findUser) {
    return res.json({ authenticated: false, msg: "User not logged in" });
  }

  return res.json({
    authenticated: true,
    user: findUser.name,
    msg: "User logged in",
  });
}
