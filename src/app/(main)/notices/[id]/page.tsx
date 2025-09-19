import NoticeOverview from "@/components/notices/notice-overview";
import { notFound } from "next/navigation";
import React from "react";

export default async function UserDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await fetch(
    `https://hgv.legalnoticegateway.com/api/zeus/get-notice/${id}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.SUPER_ADMIN_PIN}`,
        "Content-Type": "application/json",
      },
    }
  );

  const noticeData = await res.json();

  if (!noticeData.notice) {
    notFound();
  }

  return <NoticeOverview notice={noticeData.notice} from="hgv" />;
}
