"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import APIKeysTable from "./api-keys-table";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "../ui/form";
import { APIKey } from "@/types";
import { Form } from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Checkbox } from "../ui/checkbox";
import { createApiKey } from "@/lib/actions";

type Props = {
  apiKeys: APIKey[];
};

const RESOURCES = {
  publications: ["read"],
};

const APIKeysLayout = (props: Props) => {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [createdKey, setCreatedKey] = React.useState<string | null>(null);
  const [showKeyDialog, setShowKeyDialog] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const router = useRouter();

  const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    permissions: z.record(z.string(), z.array(z.string())),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      permissions: {} as Record<string, string[]>,
    },
  });

  async function onSubmit(data: any) {
    setLoading(true);
    setError(null);
    try {
      const result = await createApiKey(data.name, data.permissions);
      // The API key value should be in result.key or similar
      const apiKeyValue = result?.key || null;
      if (apiKeyValue) {
        setCreatedKey(apiKeyValue);
        setShowKeyDialog(true);
      }
      setLoading(false);
      setOpen(false);
      router.refresh();
    } catch (err) {
      setLoading(false);
      setError("Failed to create API key");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          {props.apiKeys.length} API Keys
        </h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setOpen(true)}>Create API Key</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create API Key</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                className="flex flex-col gap-3"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="name"
                  rules={{ required: true }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Please enter a descriptive API key name e.g. HGV Frontend"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="permissions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Permissions</FormLabel>
                      <FormControl>
                        <div className="flex flex-col gap-6 overflow-y-scroll max-h-80">
                          {Object.entries(RESOURCES).map(
                            ([resource, actions]) => (
                              <div
                                key={resource}
                                className="bg-card border rounded-xl shadow-sm p-4"
                              >
                                <div className="flex items-center gap-2 mb-3">
                                  <span className="inline-block bg-muted rounded px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                    {resource}
                                  </span>
                                  <span className="text-muted-foreground text-xs">
                                    Resource
                                  </span>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                  {actions.map((action) => (
                                    <label
                                      key={action}
                                      className="flex items-center gap-2 bg-accent rounded-lg px-2 py-1 cursor-pointer transition hover:bg-accent/70"
                                    >
                                      <Checkbox
                                        checked={
                                          Array.isArray(
                                            field.value?.[resource]
                                          ) &&
                                          field.value[resource].includes(action)
                                        }
                                        onCheckedChange={(checked: boolean) => {
                                          let updated = { ...field.value };
                                          if (checked) {
                                            updated[resource] = Array.isArray(
                                              updated[resource]
                                            )
                                              ? [...updated[resource], action]
                                              : [action];
                                          } else {
                                            updated[resource] = Array.isArray(
                                              updated[resource]
                                            )
                                              ? updated[resource].filter(
                                                  (a) => a !== action
                                                )
                                              : [];
                                          }
                                          field.onChange(updated);
                                        }}
                                      />
                                      <span className="text-sm font-medium text-foreground">
                                        {action.charAt(0).toUpperCase() +
                                          action.slice(1)}
                                      </span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </FormControl>
                      <FormDescription>
                        Select permissions for each resource.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {error && <div className="text-red-500 text-sm">{error}</div>}
                <DialogFooter>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Create API Key"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        {/* Show API key dialog after creation */}
        <Dialog open={showKeyDialog} onOpenChange={setShowKeyDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Your New API Key</DialogTitle>
              <DialogDescription>
                <strong>Important:</strong> This API key will only be shown
                once. After closing this dialog, it will be hashed and cannot be
                retrieved. If you lose it, you must delete and regenerate a new
                key.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 w-full overflow-hidden">
              <div
                className="flex items-center gap-2 bg-muted rounded px-3 py-2 font-mono text-sm w-full overflow-x-auto whitespace-nowrap"
                style={{ wordBreak: "break-all" }}
              >
                <span className="truncate inline-block overflow-hidden">
                  {createdKey}
                </span>
                <Button
                  variant="outline"
                  onClick={() => {
                    if (createdKey) {
                      navigator.clipboard.writeText(createdKey);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 1500);
                    }
                  }}
                >
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setShowKeyDialog(false)} type="button">
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <APIKeysTable apiKeys={props.apiKeys} />
    </div>
  );
};

export default APIKeysLayout;
