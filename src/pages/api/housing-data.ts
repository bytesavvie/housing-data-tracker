// Next
import type { NextApiRequest, NextApiResponse } from "next";

// utils
import { getCountyChartData } from "~/utils/api";
import { createS3Client } from "~/utils/s3";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.status(401).json({ message: "Invalid request." });
    return;
  }

  if (req.method === "GET") {
    if (req.query) {
      const client = createS3Client();

      if (
        req.query.state &&
        req.query.county &&
        typeof req.query.state === "string" &&
        typeof req.query.county === "string"
      ) {
        try {
          const result = await getCountyChartData(
            client,
            req.query.state,
            req.query.county
          );
          res.status(200).json(result);
          return;
        } catch (err) {
          console.log("failed s3 error", err);
          res.status(500).json({ message: "Unabled to get data." });
          return;
        }
      }
    }

    res.status(401).json({ message: "Invalid request." });
  }
}
