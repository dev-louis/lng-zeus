import { db } from "@/db";
import { publication } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq, ilike, or } from "drizzle-orm";
import { parse } from "postcode";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

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

  if (!id) {
    return new Response("ID is required", { status: 400 });
  }

  try {
    const dbResults = await db.query.publication.findFirst({
      where: eq(publication.id, id),
    });

    return Response.json(dbResults);
  } catch (error) {
    console.error("Database query error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
