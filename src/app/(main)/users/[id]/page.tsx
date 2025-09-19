import UserOverview from "@/components/users/user-overview";
import React from "react";

export default async function UserDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await fetch(
    `https://hgv.legalnoticegateway.com/api/zeus/get-user/${id}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.SUPER_ADMIN_PIN}`,
        "Content-Type": "application/json",
      },
    }
  );

  const usersData = await res.json();

  return <UserOverview user={usersData.user} from="hgv" />;
}
