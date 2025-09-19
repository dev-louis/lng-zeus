"use client";

import { User } from "@/types";
import { CalendarIcon, CheckIcon, HashIcon, MailIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Button } from "../ui/button";
import NoticesTable from "../notices/notices-table";
import { Badge } from "../ui/badge";

type Props = {
  user: User;
  from: "hgv" | "premises";
};

const UserOverview = (props: Props) => {
  const { user, from } = props;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div className="flex w-full justify-between">
          <h1 className="text-2xl font-semibold inline-flex gap-2 items-center">
            {user.name}{" "}
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge className="uppercase">{from}</Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  User is from the <span className="uppercase">{from}</span>{" "}
                  system
                </p>
              </TooltipContent>
            </Tooltip>
          </h1>
          <Button>Edit User Details</Button>
        </div>
        <div className="flex gap-2 text-muted-foreground items-center">
          <HashIcon className="size-4" />
          <p>{user.id}</p>
        </div>
        <div className="flex gap-2 text-muted-foreground items-center">
          <MailIcon className="size-4" />
          <Link href={`mailto:${user.email}`}>{user.email}</Link>
          {user.emailVerified && (
            <Tooltip>
              <TooltipTrigger asChild>
                <CheckIcon className="size-4" />
              </TooltipTrigger>
              <TooltipContent>User's email is verified</TooltipContent>
            </Tooltip>
          )}
        </div>
        <div className="flex gap-2 text-muted-foreground items-center">
          <CalendarIcon className="size-4" />
          <Tooltip>
            <TooltipTrigger asChild>
              <p>
                {new Date(user.createdAt).toLocaleString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                User created account{" "}
                {new Date(user.createdAt).toLocaleDateString()} at{" "}
                {new Date(user.createdAt).toLocaleTimeString(undefined, {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
        {user.banned && (
          <div className="flex gap-2 text-muted-foreground items-center">
            <p>This user is banned for reason: {user.banReason}</p>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <p>
          This user has {user.notice.length} notices, of which{" "}
          {
            user.notice.filter(
              (n) => n.status === "awaiting_quote" || n.status === "processing"
            ).length
          }{" "}
          are pending.
        </p>
        <NoticesTable
          notices={user.notice.map((n) => ({ ...n, type: "HGV" }))}
        />
      </div>
    </div>
  );
};

export default UserOverview;
