import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { address } = req.query;
  if (typeof address !== "string") {
    return res.status(400).json({ error: "Address must be a string." });
  }
  try {
    const response = await axios.get(
      `https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?format=json&benchmark=Public_AR_Census2020&address=${encodeURIComponent(
        address
      )}`
    );
    if (
      response.data.result &&
      response.data.result.addressMatches.length > 0
    ) {
      const { x, y } = response.data.result.addressMatches[0].coordinates;
      res.status(200).json({ x, y });
    } else {
      throw new Error("No address matches found.");
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
}
