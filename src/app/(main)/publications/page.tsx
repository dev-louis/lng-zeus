import PublicationsLayout from "@/components/publications/publications-layout";
import { getPublications } from "@/lib/actions";

export default async function Publications() {
  const publications = await getPublications();
  return <PublicationsLayout publications={publications} />;
}
