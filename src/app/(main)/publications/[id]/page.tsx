import PublicationOverview from "@/components/publications/publications-overview";
import { db } from "@/db";
import { publication } from "@/db/schema";
import { eq } from "drizzle-orm";
import React from "react";

export default async function PublicationDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const dbPublication = await db.query.publication.findFirst({
    where: eq(publication.id, id),
  });

  if (!dbPublication) {
    return <div>Publication not found</div>;
  }

  return <PublicationOverview publication={dbPublication} />;
}
