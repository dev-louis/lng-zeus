import { db } from "@/db";
import { publication } from "@/db/schema";
import { auth } from "@/lib/auth";
import { ilike, or } from "drizzle-orm";
import { parse } from "postcode";

export async function POST(request: Request) {
  let postcode;
  let charCount;

  try {
    const body = await request.json();

    postcode = body.postcode;
    charCount = body.charCount;
  } catch (error) {
    return new Response("Invalid JSON body", { status: 400 });
  }

  if (!charCount || isNaN(charCount) || charCount <= 0) {
    return new Response("Invalid charCount", { status: 400 });
  }

  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  const isAuthValid = await auth.api.verifyApiKey({
    body: {
      key: token,
      permissions: {
        publications: ["read"],
      },
    },
  });

  if (!isAuthValid.valid) {
    return new Response("Forbidden", { status: 403 });
  }

  if (!postcode) {
    return new Response("Postcode is required", { status: 400 });
  }

  const { outcode, sector, valid } = parse(postcode);
  if (!valid) {
    return new Response("Invalid postcode", { status: 400 });
  }

  const fontSize = 7;
  const leading = 6.5;

  try {
    const dbResults = await db.query.publication.findMany({
      where: or(
        ilike(publication.circulation, `${outcode},%`),
        ilike(publication.circulation, `%, ${outcode}`),
        ilike(publication.circulation, `%, ${outcode},%`),
        ilike(publication.circulation, `${sector},%`),
        ilike(publication.circulation, `%, ${sector}`),
        ilike(publication.circulation, `%, ${sector},%`)
      ),
    });

    let results = {};

    for (const result of dbResults) {
      const { colWidth, name, id, trusteePrice, colPrice, confirmed } = result;

      if (colWidth) {
        const colWidthPoints = Number(colWidth) / 0.352778;
        const avgCharWidth = fontSize * 0.36;
        const charsPerLine = colWidthPoints / avgCharWidth;
        const numberOfLines = Math.ceil(charCount / charsPerLine);
        const adHeightPoints = numberOfLines * leading;
        let adHeightMm = adHeightPoints * 0.352778;
        if (adHeightMm < 50) {
          adHeightMm = 50;
        }
        let cost = Number(colPrice) * Math.ceil(adHeightMm / 10);
        if (trusteePrice) {
          cost = Number(trusteePrice);
        }
        cost += 60;
        results = {
          ...results,
          [id]: {
            id,
            name,
            cost: cost.toFixed(2),
            colWidth,
            confirmed: confirmed !== undefined ? confirmed : false,
            result,
          },
        };
      } else if (trusteePrice) {
        results = {
          ...results,
          [id]: {
            id,
            name,
            cost: Number(trusteePrice).toFixed(2),
            colWidth: null,
            confirmed: confirmed !== undefined ? confirmed : false,
            result,
          },
        };
      }
    }

    return Response.json(results);
  } catch (error) {
    console.error("Database query error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
