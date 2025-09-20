"use client";

import React, { useEffect } from "react";
import { Publication } from "@/types";
import PublicationsTable from "./publications-table";
import { getPublications } from "@/lib/actions";
import { Loader2Icon } from "lucide-react"; // Make sure this import is correct for your icon library

type Props = {};

const PublicationsLayout = (props: Props) => {
  const [publications, setPublications] = React.useState<Publication[]>([]);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const fetchPublications = async () => {
      setLoading(true);
      const publications = await getPublications();
      setPublications(publications);
      setLoading(false);
    };

    fetchPublications();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">
        {publications.length} Publications
      </h1>
      {loading ? (
        <div className="flex justify-center items-center py-10 flex-col gap-2">
          <Loader2Icon className="h-8 w-8 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      ) : (
        <PublicationsTable publications={publications} />
      )}
    </div>
  );
};

export default PublicationsLayout;
