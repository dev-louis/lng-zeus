"use client";

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
import { HGVNotice, Grant, Variation } from "@/types";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

type NoticeRow = HGVNotice & {
  type?: string;
  grant?: Grant[];
  variation?: Variation[];
};
type Props = {
  notices: NoticeRow[] | [];
};

export default function NoticesTable(props: Props) {
  const notices = props.notices;

  return (
    <div>
      <Table>
        <TableHeader className="bg-transparent">
          <TableRow className="hover:bg-transparent">
            <TableHead>Type</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Publication(s)</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Cost</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <tbody aria-hidden="true" className="table-row h-2"></tbody>
        <TableBody className="[&_td:first-child]:rounded-l-lg [&_td:last-child]:rounded-r-lg">
          {notices.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-6 text-muted-foreground"
              >
                There are no notices available
              </TableCell>
            </TableRow>
          ) : (
            notices.map((notice) => (
              <TableRow
                key={notice.id}
                className="odd:bg-muted/50 odd:hover:bg-muted/50 border-none hover:bg-transparent"
              >
                <TableCell className="py-2.5 font-medium">
                  {notice.type ?? notice.noticeType}
                </TableCell>
                <TableCell className="py-2.5">{notice.emailAddress}</TableCell>
                <TableCell className="py-2.5">
                  {(() => {
                    let publications: string[] = [];
                    if (notice.type === "HGV") {
                      if (
                        Array.isArray(notice.grants) &&
                        notice.grants.length > 0
                      ) {
                        publications = notice.grants
                          .map((g: Grant) => g.publication?.name)
                          .filter((name): name is string => name !== undefined);
                      } else if (
                        Array.isArray(notice.variations) &&
                        notice.variations.length > 0
                      ) {
                        publications = notice.variations
                          .map((v: Variation) => v.publication?.name)
                          .filter((name): name is string => name !== undefined);
                      }
                      // Check for singular grant/variation properties
                      if (
                        Array.isArray(notice.grant) &&
                        notice.grant.length > 0
                      ) {
                        publications = notice.grant
                          .map((g: Grant) => g.publication?.name)
                          .filter((name): name is string => name !== undefined);
                      } else if (
                        Array.isArray(notice.variation) &&
                        notice.variation.length > 0
                      ) {
                        publications = notice.variation
                          .map((v: Variation) => v.publication?.name)
                          .filter((name): name is string => name !== undefined);
                      }
                    }
                    if (publications.length === 0) return "N/A";
                    const first = publications[0];
                    const others = publications.slice(1);
                    if (others.length === 0) return first;
                    return (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="cursor-pointer underline">
                            {first} +{others.length} others
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <ul className="text-sm">
                            {publications.map((pub, idx) => (
                              <li key={idx}>{pub}</li>
                            ))}
                          </ul>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })()}
                </TableCell>
                <TableCell className="py-2.5 capitalize">
                  {notice.status.replace(/_/g, " ")}
                </TableCell>
                <TableCell className="py-2.5">
                  £
                  {notice.totalActualCost ?? notice.totalEstimatedCost ?? "N/A"}
                </TableCell>
                <TableCell>
                  <Button size="sm" asChild>
                    <Link href={`/notices/${notice.id}`}>
                      View/Process Notice
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
