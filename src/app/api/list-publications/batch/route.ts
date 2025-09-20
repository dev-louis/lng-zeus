import { db } from "@/db";
import { publication } from "@/db/schema";
import { auth } from "@/lib/auth";
import { ilike, or } from "drizzle-orm";

export async function POST(request: Request) {
  let ids;

  try {
    const body = await request.json();

    ids = body.ids;
  } catch (error) {
    return new Response("Invalid JSON body", { status: 400 });
  }

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return new Response("Invalid ids", { status: 400 });
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

  try {
    const dbResults = await db.query.publication.findMany({
      where: or(...ids.map((id) => ilike(publication.id, id))),
      columns: {
        id: true,
        name: true,
        group: true,
        circulation: true,
        hgvPrice: true,
        premisesPrice: true,
        trusteePrice: true,
        colPrice: true,
        colWidth: true,
        col2Width: true,
        confirmed: true,
        isNationalPaper: true,
        isPaidPaper: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return Response.json(dbResults);
  } catch (error) {
    console.error("Database query error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
