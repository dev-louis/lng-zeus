"use server";

import { db } from "@/db";
import { publication } from "@/db/schema";
import { auth } from "@/lib/auth";
import { Publication } from "@/types";
import { asc, eq } from "drizzle-orm";
import { headers } from "next/headers";

export async function createApiKey(
  name: string,
  permissions: Record<string, string[]>
) {
  if (!name || !permissions) {
    throw new Error("Name and permissions are required to create an API key");
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  try {
    const data = await auth.api.createApiKey({
      body: {
        name,
        userId: session?.user.id,
        permissions,
      },
    });
    return data;
  } catch (error) {
    console.error("[createApiKey] Error:", error);
    throw new Error("Failed to create API key");
  }
}

export async function deleteApiKey(id: string) {
  if (!id) {
    throw new Error("API key ID is required to delete an API key");
  }

  try {
    await auth.api.deleteApiKey({
      body: {
        keyId: id,
      },
      headers: await headers(),
    });
  } catch (error) {
    console.error("[deleteApiKey] Error:", error);
    throw new Error("Failed to delete API key");
  }
}

export async function updatePublication(newValues: Publication) {
  if (!newValues || !newValues.id) {
    throw new Error("Publication ID and new values are required to update");
  }

  try {
    const updated = await db
      .update(publication)
      .set(newValues)
      .where(eq(publication.id, newValues.id))
      .returning();

    return updated;
  } catch (error) {
    console.log("[updatePublication] Error:", error);
    throw new Error("There was an error updating the publication.");
  }
}

export async function getPublications() {
  try {
    const publications = await db.query.publication.findMany({
      orderBy: asc(publication.name),
    });
    return publications;
  } catch (error) {
    console.error("[getPublications] Error:", error);
    throw new Error("Failed to fetch publications");
  }
}
