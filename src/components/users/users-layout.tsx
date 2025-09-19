"use client";

import React from "react";
import { User } from "@/types";
import UsersTable from "./users-table";

type Props = {
  users: User[];
};

const UsersLayout = (props: Props) => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">
        {props.users.length > 250
          ? "250+ Users Found"
          : `${props.users.length} Users Found`}
      </h1>
      <UsersTable users={props.users} />
    </div>
  );
};

export default UsersLayout;
