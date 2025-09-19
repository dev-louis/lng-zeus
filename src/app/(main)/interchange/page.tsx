import APIKeysLayout from "@/components/api-keys/api-keys-layout";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Interchange() {
  const data = await auth.api.listApiKeys({
    headers: await headers(),
  });

  return <APIKeysLayout apiKeys={data} />;
}
