"use client";

import React from "react";
import NoticesTable from "./notices-table";
import { HGVNotice } from "@/types";

type Props = {
  hgvNotices: {
    notices: HGVNotice[] | [];
  };
  // premisesNotices: {
  //   notices: PremisesNotice[] | [];
  // }
};

const NoticesLayout = (props: Props) => {
  const hgvNoticesArr = Array.isArray(props.hgvNotices?.notices)
    ? props.hgvNotices.notices
    : [];
  // const premisesNoticesArr = Array.isArray(props.premisesNotices?.notices) ? props.premisesNotices.notices : [];
  const combinedNotices = [
    ...hgvNoticesArr.map((notice) => ({ ...notice, type: "HGV" })),
    // ...premisesNoticesArr.map((notice) => ({ ...notice, type: "Premises" })),
  ];

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">
        {combinedNotices.length} Notices Waiting
      </h1>
      <NoticesTable notices={combinedNotices} />
    </div>
  );
};

export default NoticesLayout;
