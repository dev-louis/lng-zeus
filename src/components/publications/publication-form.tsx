"use client";

import { Publication } from "@/types";
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";
import { updatePublication } from "@/lib/actions";

type Props = {
  publication: Publication;
};

const publicationSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  group: z.string().min(1, { message: "Group is required" }),
  circulation: z.string().optional(),
  hgvPrice: z.string().optional(),
  premisesPrice: z.string().optional(),
  trusteePrice: z.string().optional(),
  colPrice: z.string().optional(),
  colWidth: z.string().optional(),
  col2Width: z.string().optional(),
  circulationCount: z.union([z.number(), z.null()]).optional(),
  confirmed: z.boolean(),
  paperContactName: z.string().optional(),
  paperContactEmail: z.email().optional().or(z.literal("").optional()),
  paperContactNumber: z.string().optional(),
  paperVoucherContactName: z.string().optional(),
  paperVoucherContactNumber: z.string().optional(),
  adfast: z.boolean().optional(),
  deadline: z.string().optional(),
  specialInstructions: z.string().optional(),
  sendArtwork: z.boolean().optional(),
});

const PublicationForm = (props: Props) => {
  const { publication } = props;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof publicationSchema>>({
    resolver: zodResolver(publicationSchema),
    defaultValues: {
      name: publication.name || "",
      group: publication.group || "",
      circulation: publication.circulation || "",
      hgvPrice: publication.hgvPrice || "",
      premisesPrice: publication.premisesPrice || "",
      trusteePrice: publication.trusteePrice || "",
      colPrice: publication.colPrice || "",
      colWidth: publication.colWidth || "",
      col2Width: publication.col2Width || "",
      circulationCount: publication.circulationCount ?? null,
      confirmed: publication.confirmed ?? false,
      paperContactName: publication.paperContactName || "",
      paperContactEmail: publication.paperContactEmail || "",
      paperContactNumber: publication.paperContactNumber || "",
      paperVoucherContactName: publication.paperVoucherContactName || "",
      paperVoucherContactNumber: publication.paperVoucherContactNumber || "",
      adfast: publication.adfast ?? false,
      deadline: publication.deadline || "",
      specialInstructions: publication.specialInstructions || "",
      sendArtwork: publication.sendArtwork ?? false,
    },
  });

  async function onSubmit(values: z.infer<typeof publicationSchema>) {
    setIsLoading(true);
    try {
      await updatePublication({
        ...values,
        id: publication.id,
        createdAt: publication.createdAt,
        updatedAt: publication.updatedAt,
        circulation: values.circulation || "",
        hgvPrice: values.hgvPrice || "",
        premisesPrice: values.premisesPrice || "",
        trusteePrice: values.trusteePrice || "",
        colPrice: values.colPrice || "",
        colWidth: values.colWidth || "",
        col2Width: values.col2Width || "",
        paperContactName: values.paperContactName || "",
        paperContactEmail: values.paperContactEmail || "",
        paperContactNumber: values.paperContactNumber || "",
        paperVoucherContactName: values.paperVoucherContactName || "",
        paperVoucherContactNumber: values.paperVoucherContactNumber || "",
        deadline: values.deadline || "",
        specialInstructions: values.specialInstructions || "",
        circulationCount: values.circulationCount ?? null,
      }).then(() => {
        window.location.reload();
      });
    } catch (error) {
      setIsLoading(false);
      toast.error("There was an error updating the publication.");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setDialogOpen(true);
        }}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Publication Name"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="group"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group</FormLabel>
              <FormControl>
                <Input placeholder="Group" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="circulation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Circulation</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Circulation"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="hgvPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>HGV Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="HGV Price"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="premisesPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Premises Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Premises Price"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="trusteePrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trustee Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Trustee Price"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="colPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Col Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Col Price"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="colWidth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Col Width</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Col Width"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="col2Width"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Col2 Width</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Col2 Width"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="circulationCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Circulation Count</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Circulation Count"
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? null : Number(e.target.value)
                      )
                    }
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="paperContactName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Paper Contact Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Contact Name"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="paperContactEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Paper Contact Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Contact Email"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="paperContactNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Paper Contact Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Contact Number"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="paperVoucherContactName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Paper Voucher Contact Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Voucher Contact Name"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="paperVoucherContactNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Paper Voucher Contact Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Voucher Contact Number"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="deadline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deadline</FormLabel>
              <FormControl>
                <Input placeholder="Deadline" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="specialInstructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Special Instructions</FormLabel>
              <FormControl>
                <Input
                  placeholder="Special Instructions"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-8">
          <FormField
            control={form.control}
            name="confirmed"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-2">
                <FormLabel>Details confirmed with paper?</FormLabel>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="adfast"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-2">
                <FormLabel>Adfast</FormLabel>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sendArtwork"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-2">
                <FormLabel>Send Artwork</FormLabel>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update"}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Update(s)</DialogTitle>
            </DialogHeader>
            <p>Are you sure you want to update this publication's details?</p>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" disabled={isLoading}>
                  Cancel
                </Button>
              </DialogClose>
              <Button
                onClick={form.handleSubmit(onSubmit)}
                type="button"
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Confirm"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </form>
    </Form>
  );
};

export default PublicationForm;
