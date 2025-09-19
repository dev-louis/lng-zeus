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
import { CheckIcon, XIcon } from "lucide-react";
import { User } from "@/types";

type Props = {
  users: User[];
};

export default function UsersTable(props: Props) {
  const users = props.users;

  return (
    <div>
      <Table>
        <TableHeader className="bg-transparent">
          <TableRow className="hover:bg-transparent">
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Email Verified?</TableHead>
            <TableHead>Notices</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <tbody aria-hidden="true" className="table-row h-2"></tbody>
        <TableBody className="[&_td:first-child]:rounded-l-lg [&_td:last-child]:rounded-r-lg">
          {users.map((user) => (
            <TableRow
              key={user.id}
              className="odd:bg-muted/50 odd:hover:bg-muted/50 border-none hover:bg-transparent"
            >
              <TableCell className="py-2.5 font-medium">{user.name}</TableCell>
              <TableCell className="py-2.5">{user.email}</TableCell>
              <TableCell className="py-2.5">
                {user.emailVerified ? (
                  <CheckIcon className="size-4" />
                ) : (
                  <XIcon className="size-4" />
                )}
              </TableCell>
              <TableCell className="py-2.5 capitalize">
                {/* if the user has notices then count them otherwise show 0 */}
                {user.notice.length > 0 ? user.notice.length : 0}
              </TableCell>
              <TableCell>
                <Button size="sm" asChild>
                  <Link href={`/users/${user.id}`}>View User Details</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
