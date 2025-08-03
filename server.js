import express from "express";
import dotenv from "dotenv";
import urlRoute from "./routes/url.js";
import urlModel from "./models/url.js";
import connectMongoDB from "./db/connect.js";
import cors from "cors";
import authMiddleware from "./authMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";

dotenv.config();

connectMongoDB(process.env.MONGODB_URI)
  .then((res) => console.log(`URL Shortener Database connected!`))
  .catch((error) => console.log(`Error in connecting URL Shortener database`));

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
  const getCurrentUserId = req.user._id;
  const allUrls = await urlModel.find({ user_id: getCurrentUserId });

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

// import { usersDB } from "./db/usersDB.js";
// // connecting to user database
// usersDB;
