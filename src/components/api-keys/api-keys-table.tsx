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
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";
import { APIKey } from "@/types";
import { deleteApiKey } from "@/lib/actions";

type Props = {
  apiKeys: APIKey[];
};

export default function APIKeysTable(props: Props) {
  const apiKeys = props.apiKeys;

  return (
    <div>
      <Table>
        <TableHeader className="bg-transparent">
          <TableRow className="hover:bg-transparent">
            <TableHead>Name</TableHead>
            <TableHead>Prefix</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Rate Limit</TableHead>
            <TableHead>Requests</TableHead>
            <TableHead>Expires At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <tbody aria-hidden="true" className="table-row h-2"></tbody>
        <TableBody className="[&_td:first-child]:rounded-l-lg [&_td:last-child]:rounded-r-lg">
          {apiKeys.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={8}
                className="text-center py-6 text-muted-foreground"
              >
                There are no API keys available
              </TableCell>
            </TableRow>
          ) : (
            apiKeys.map((apiKey) => (
              <TableRow
                key={apiKey.id}
                className="odd:bg-muted/50 odd:hover:bg-muted/50 border-none hover:bg-transparent"
              >
                <TableCell className="py-2.5 font-medium">
                  {apiKey.name ?? (
                    <span className="text-muted-foreground">(No name)</span>
                  )}
                </TableCell>
                <TableCell className="py-2.5">
                  {apiKey.prefix ?? (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="py-2.5">
                  {apiKey.enabled ? (
                    <span className="text-green-600">Enabled</span>
                  ) : (
                    <span className="text-red-600">Disabled</span>
                  )}
                </TableCell>
                <TableCell className="py-2.5">
                  {apiKey.rateLimitEnabled ? (
                    `${apiKey.rateLimitMax ?? "—"} / ${
                      apiKey.rateLimitTimeWindow
                        ? apiKey.rateLimitTimeWindow / 1000 + "s"
                        : "—"
                    }`
                  ) : (
                    <span className="text-muted-foreground">Off</span>
                  )}
                </TableCell>
                <TableCell className="py-2.5">
                  {apiKey.requestCount}
                  {typeof apiKey.remaining === "number" && (
                    <span className="text-muted-foreground">
                      {" "}
                      / {apiKey.remaining}
                    </span>
                  )}
                </TableCell>
                <TableCell className="py-2.5">
                  {apiKey.expiresAt ? (
                    new Date(apiKey.expiresAt).toLocaleString()
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm">View</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md p-0">
                      <DialogHeader className="bg-card rounded-t-xl px-6 py-4 border-b">
                        <DialogTitle className="text-lg font-semibold">
                          API Key Overview
                        </DialogTitle>
                      </DialogHeader>
                      <div className="bg-card px-6 py-4 rounded-b-xl space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="block text-xs text-muted-foreground mb-1">
                              Name
                            </span>
                            <span className="font-medium text-foreground">
                              {apiKey.name ?? (
                                <span className="text-muted-foreground">
                                  (No name)
                                </span>
                              )}
                            </span>
                          </div>
                          <div>
                            <span className="block text-xs text-muted-foreground mb-1">
                              Prefix
                            </span>
                            <span className="font-mono text-sm">
                              {apiKey.prefix ?? (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </span>
                          </div>
                          <div>
                            <span className="block text-xs text-muted-foreground mb-1">
                              Status
                            </span>
                            {apiKey.enabled ? (
                              <span className="text-green-600 font-semibold">
                                Enabled
                              </span>
                            ) : (
                              <span className="text-red-600 font-semibold">
                                Disabled
                              </span>
                            )}
                          </div>
                          <div>
                            <span className="block text-xs text-muted-foreground mb-1">
                              Rate Limit
                            </span>
                            {apiKey.rateLimitEnabled ? (
                              <span>
                                {apiKey.rateLimitMax ?? "—"} requests /{" "}
                                {apiKey.rateLimitTimeWindow
                                  ? apiKey.rateLimitTimeWindow / 1000 + "s"
                                  : "—"}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">Off</span>
                            )}
                          </div>
                          <div>
                            <span className="block text-xs text-muted-foreground mb-1">
                              Requests
                            </span>
                            <span>
                              {apiKey.requestCount}
                              {typeof apiKey.remaining === "number" && (
                                <span className="text-muted-foreground">
                                  {" "}
                                  / {apiKey.remaining}
                                </span>
                              )}
                            </span>
                          </div>
                          <div>
                            <span className="block text-xs text-muted-foreground mb-1">
                              Expires At
                            </span>
                            <span>
                              {apiKey.expiresAt ? (
                                new Date(apiKey.expiresAt).toLocaleString()
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </span>
                          </div>
                        </div>
                        <div className="mt-4">
                          <span className="block text-xs text-muted-foreground mb-1">
                            Permissions
                          </span>
                          {apiKey.permissions &&
                          Object.keys(apiKey.permissions).length > 0 ? (
                            <div className="bg-muted rounded-lg p-3">
                              <ul className="space-y-1">
                                {Object.entries(apiKey.permissions).map(
                                  ([resource, actions]) => (
                                    <li key={resource}>
                                      <span className="font-semibold text-foreground">
                                        {resource}:
                                      </span>{" "}
                                      <span className="text-muted-foreground">
                                        {actions.join(", ")}
                                      </span>
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </div>
                      </div>
                      <DialogFooter className="px-6 py-4 border-t bg-card rounded-b-xl flex justify-end">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="destructive">Delete</Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-sm">
                            <DialogHeader>
                              <DialogTitle>Delete API Key</DialogTitle>
                            </DialogHeader>
                            <div className="mb-4">
                              Are you sure you want to delete this API key? This
                              action cannot be undone.
                            </div>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="secondary">Cancel</Button>
                              </DialogClose>
                              <Button
                                variant="destructive"
                                onClick={async () => {
                                  await deleteApiKey(apiKey.id).then(() => {
                                    window.location.reload();
                                  });
                                }}
                              >
                                Delete
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
