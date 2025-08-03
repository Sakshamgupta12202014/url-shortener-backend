import mongoose from "mongoose";

const usersDB = mongoose.createConnection("mongodb://127.0.0.1:27017/node-authentication-data")

// usersDB.once("open", () => {
//   console.log("Connected to user database");
// });
// usersDB.on("error", (err) => {
//   console.log("User DB connection error:", err);
// });