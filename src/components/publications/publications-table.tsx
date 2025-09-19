"use client";
import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import Link from "next/link";
import { Publication } from "@/types";
import { Input } from "../ui/input";
import { parse } from "postcode";

type Props = {
  publications: Publication[];
};

export default function PublicationsTable(props: Props) {
  const [search, setSearch] = React.useState("");
  const [circulationSearch, setCirculationSearch] = React.useState("");
  const publications = props.publications;

  const filtered = publications.filter((pub) => {
    const nameMatch =
      pub.name?.toLowerCase().includes(search.toLowerCase()) ||
      pub.group?.toLowerCase().includes(search.toLowerCase());

    if (!nameMatch) return false;
    if (!circulationSearch) return true;

    let sector = "";
    try {
      sector = parse(circulationSearch.toUpperCase()).sector || "";
    } catch {
      sector = "";
    }
    if (!sector) return false;

    const circulationStr = pub.circulation?.toString().toUpperCase() || "";
    const circulationParts = circulationStr
      .split(",")
      .map((part) => part.trim());
    return circulationParts.includes(sector);
  });

  return (
    <div>
      <div className="flex gap-4 mb-4">
        <Input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name/group..."
          className="max-w-md"
        />
        <Input
          type="text"
          value={circulationSearch}
          onChange={(e) => setCirculationSearch(e.target.value)}
          placeholder="Please enter full postcode to search..."
          className="max-w-md"
        />
      </div>

      <div className="[&>div]:max-h-130 ">
        <Table>
          <TableHeader className="bg-transparent sticky top-0 z-10 backdrop-blur-xs">
            <TableRow className="hover:bg-transparent">
              <TableHead>Group</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <tbody aria-hidden="true" className="table-row h-2"></tbody>
          <TableBody className="[&_td:first-child]:rounded-l-lg [&_td:last-child]:rounded-r-lg">
            {filtered.map((publication) => (
              <TableRow
                key={publication.id}
                className="odd:bg-muted/50 odd:hover:bg-muted/50 border-none hover:bg-transparent"
              >
                <TableCell className="py-2.5 font-medium w-2/5">
                  {publication.group}
                </TableCell>
                <TableCell className="py-2.5 w-2/5">
                  {publication.name}
                </TableCell>
                <TableCell className="w-1/5">
                  <Button size="sm" asChild>
                    <Link href={`/publications/${publication.id}`}>
                      View Publication Details
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
