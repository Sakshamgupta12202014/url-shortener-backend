import express from "express";
import urlModel from "../models/url.js";
import { nanoid } from "nanoid";

async function handleURLRoute(req, res) {
  const body = req.body;

  if (!body.url) {
    return res
      .status(400)
      .json({ result: "Cannot generate URL. No input provided." });
  }

  try {
    const isInDb = await urlModel.findOne({ redirectURL: body.url });
    if (isInDb) {
      return res.json({
        shortId: isInDb.shortId,
        shortUrl: `http://localhost:4001/${isInDb.shortId}`,
      });
    }

    const shortId = nanoid(8);
    const newUrl = await urlModel.create({
      shortId: shortId,
      redirectURL: body.url,
      visitHistory: [],
    });

    console.log("Successfully inserted new URL in MongoDB");
    return res.json({ shortId, shortUrl: `http://localhost:4001/${shortId}` });
  } catch (error) {
    console.error("Error in adding new URL to MongoDB:", error);
    return res.status(500).json({ result: "Internal server error" });
  }
}

export const getClicks = async (req, res) => {
  const shortId = req.params.id;

  const url = await urlModel.findOne({ shortId: shortId });
  if (!url) {
    return res.json({ msg: `Cannot find the url with id ${shortId}` });
  }
  const clicks = url.visitHistory.length;
  return res.json({
    numOfClicks: `Number of views on the website are ${clicks}`,
  });
};

export default handleURLRoute;
