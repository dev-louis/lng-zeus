"use client";

import React from "react";
import { Publication } from "@/types";
import PublicationsTable from "./publications-table";

type Props = {
  publications: Publication[];
};

const PublicationsLayout = (props: Props) => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">
        {props.publications.length} Publications
      </h1>
      <PublicationsTable publications={props.publications} />
    </div>
  );
};

export default PublicationsLayout;
