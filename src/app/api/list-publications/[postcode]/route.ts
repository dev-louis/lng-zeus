import { db } from "@/db";
import { publication } from "@/db/schema";
import { auth } from "@/lib/auth";
import { ilike, or } from "drizzle-orm";
import { parse } from "postcode";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ postcode: string }> }
) {
  const { postcode } = await params;

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

    return Response.json(dbResults);
  } catch (error) {
    console.error("Database query error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
