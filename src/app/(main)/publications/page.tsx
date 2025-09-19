import PublicationsLayout from "@/components/publications/publications-layout";
import { db } from "@/db";
import { publication } from "@/db/schema";
import { asc } from "drizzle-orm";

export default async function Publications() {
  try {
    const publications = await db.query.publication.findMany({
      orderBy: asc(publication.name),
    });
    return <PublicationsLayout publications={publications} />;
  } catch (error) {
    console.error("Error fetching publications:", error);
    return <div>Error fetching publications</div>;
  }
}
