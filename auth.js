import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const secretKey = process.env.SECRET_KEY || "!@#saksham";

export function setUser(user) {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
    },
    secretKey
  );
}

export function getUser(token) {
  if (!token) {
    return null;
  }
  try {
    const user = jwt.verify(token, secretKey);
    return user;
  } catch (error) {
    console.log("jwt error", error);
  }
}

