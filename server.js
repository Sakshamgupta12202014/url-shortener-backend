import express from "express";
import dotenv from "dotenv";
import urlRoute from "./routes/url.js";
import urlModel from "./models/url.js";
import connectMongoDB from "./db/connect.js";
import cors from "cors";
import authMiddleware from "./authMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import { usersDB } from "./db/usersDB.js";

dotenv.config();

connectMongoDB("mongodb://127.0.0.1:27017/short-url") // short-url is the database name
  .then((res) => console.log(`Database connected!`))
  .catch((error) => console.log(`Error in connecting database`));

// connecting to user database
usersDB;

const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // allows cookies sent by frontend
  })
);

app.use(express.json()); // This middleware parses incoming JSON payloads from the request body and makes them available on req.body

app.use("/api/user", authRoutes);

app.use("/api/url", urlRoute);

app.get("/api/urls", authMiddleware, async (req, res) => {
  const allUrls = await urlModel.find({});

  if (!allUrls) {
    return res.status(404).json({ msg: "failed to get all the urls" });
  } else {
    return res.status(200).json({ allUrls: allUrls });
  }
});

app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;

  const url = await urlModel.findOneAndUpdate(
    { shortId: String(shortId) },
    { $push: { visitHistory: { timestamp: Date.now() } } }
  );

  return res.redirect(url.redirectURL);
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server started at port: ${PORT}`);
});
