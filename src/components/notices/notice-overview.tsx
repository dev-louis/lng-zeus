"use client";

import { HGVNoticeWithUser } from "@/types";
import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form";
import { ArrowRightIcon, HashIcon, UserIcon } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { Input } from "../ui/input";
import { Card, CardHeader, CardContent, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Separator } from "../ui/separator";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

type GrantFormValue = {
  id: string;
  actualHeight: string;
  price: string;
  overridePrice: boolean;
};

type Props = {
  notice: HGVNoticeWithUser;
  from: "hgv" | "premises";
};

const NoticeOverview = (props: Props) => {
  const { notice } = props;
  const [isDialogOpen, setIsDialogOpen] = React.useState(false); // State for controlling the dialog

  // Setup react-hook-form
  const defaultGrants: GrantFormValue[] = notice.grant.map((grant) => {
    let initialPrice: string = "0.00"; // Default to "0.00"

    // Attempt to use estimatedCost from props first
    if (grant.estimatedCost && !isNaN(parseFloat(grant.estimatedCost))) {
      initialPrice = parseFloat(grant.estimatedCost).toFixed(2);
    }
    // If estimatedCost is invalid or missing, attempt to calculate
    else if (grant.actualHeight && grant.publication?.colPrice) {
      const heightNumMm = parseFloat(grant.actualHeight);
      const colPriceNum = parseFloat(grant.publication.colPrice);

      if (!isNaN(heightNumMm) && !isNaN(colPriceNum)) {
        const heightNumCm = heightNumMm / 10;
        const roundedHeightCm = Math.ceil(heightNumCm);
        initialPrice = (roundedHeightCm * colPriceNum).toFixed(2);
      }
    }
    // If all attempts fail, it remains "0.00" as initialised

    return {
      id: grant.id,
      actualHeight: grant.actualHeight || "",
      price: initialPrice,
      overridePrice: false, // Default to not overriding
    };
  });

  const form = useForm<{ grants: GrantFormValue[] }>({
    defaultValues: {
      grants: defaultGrants,
    },
    // resolver: zodResolver(yourValidationSchema), // Uncomment and add your Zod schema if needed
  });

  const { fields, replace } = useFieldArray({
    control: form.control,
    name: "grants",
  });

  const calculatePrice = (grantIdx: number, heightValue: string): string => {
    const grantData = notice.grant[grantIdx]; // Get original grant data for column price
    const heightNumMm = parseFloat(heightValue);
    const colPriceNum = parseFloat(grantData.publication?.colPrice || "0");

    if (isNaN(heightNumMm) || isNaN(colPriceNum) || heightNumMm <= 0) {
      // Return "0.00" if height is not a valid positive number or colPrice is invalid
      return "0.00";
    }

    const heightNumCm = heightNumMm / 10;
    const roundedHeightCm = Math.ceil(heightNumCm);
    return (roundedHeightCm * colPriceNum).toFixed(2);
  };

  React.useEffect(() => {
    fields.forEach((field, idx) => {
      const actualHeight = form.getValues(`grants.${idx}.actualHeight`);
      const overridePrice = form.getValues(`grants.${idx}.overridePrice`);

      if (!overridePrice) {
        const newPrice = calculatePrice(idx, actualHeight || "");
        if (form.getValues(`grants.${idx}.price`) !== newPrice) {
          form.setValue(`grants.${idx}.price`, newPrice);
        }
      }
    });
  }, [
    form,
    fields,
    // Watch relevant fields for changes to trigger effect
    // Need to correctly map over fields for watch to be effective across all items
    ...fields.map((_, idx) => form.watch(`grants.${idx}.actualHeight`)),
    ...fields.map((_, idx) => form.watch(`grants.${idx}.overridePrice`)),
  ]);

  // Total cost
  const totalCost = form
    .watch("grants")
    .reduce((sum: number, g: GrantFormValue) => {
      const price = parseFloat(g.price);
      return sum + (isNaN(price) ? 0 : price);
    }, 0);

  // This function will be called if the form is valid AND user confirms in dialog
  const onSubmit = (values: { grants: GrantFormValue[] }) => {
    console.log("Form values:", values);
    toast.success("Price updates confirmed and sent to customer!");
    setIsDialogOpen(false); // Close dialog after successful submission
    // Here you would typically send `values` to your API to update the notice
    // and trigger the customer notification.
  };

  // This function will open the dialog if form is valid, otherwise show errors
  const handleOpenDialog = () => {
    form.trigger().then((isValid) => {
      if (isValid) {
        setIsDialogOpen(true);
      } else {
        toast.error("Please correct the errors in the form before proceeding.");
        // Optionally scroll to the first error or highlight them
        const firstErrorField = Object.keys(form.formState.errors).find((key) =>
          key.startsWith("grants.")
        );
        if (firstErrorField) {
          document.getElementsByName(firstErrorField)[0]?.focus();
        }
      }
    });
  };

  return (
    <div className="flex flex-col gap-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle className="inline-flex gap-2 items-center justify-between">
            <span>Notice Overview</span>
            <Button>Edit Notice Details</Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-muted-foreground items-center">
            <div className="flex gap-2 items-center">
              <HashIcon className="size-4" />
              <p>ID: {notice.id}</p>
            </div>
            <div className="flex gap-2 items-center">
              <UserIcon className="size-4" />
              <p>Applicant: {notice.user.email}</p>
              <Button variant="ghost" asChild>
                <Link href={`/users/${notice.user.id}`} target="_blank">
                  View User <ArrowRightIcon className="ml-1 size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {fields.length > 0 && (
        <Form {...form}>
          {/* We're wrapping the form content, but the actual submission is triggered via the dialog */}
          <form
            // No onSubmit here, it will be called via handleConfirmAndSend
            // The form still needs to be a <form> element for accessibility and validation
            className="flex flex-col gap-6"
          >
            {fields.map((field, idx) => (
              <Card key={field.id}>
                <CardHeader>
                  <CardTitle>
                    {notice.grant[idx].publication?.name} (
                    {notice.grant[idx].publication?.group})
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    No. of vehicles: {notice.grant[idx].vehicles}, No. of
                    trailers: {notice.grant[idx].trailers}
                  </p>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6">
                  {/* Notice Text Display */}
                  <div className="flex flex-col gap-3">
                    <p className="font-semibold">Notice Text Preview</p>
                    <div className="p-4 bg-secondary/30 border rounded-md flex flex-col gap-3 text-sm">
                      <p className="text-center font-bold tracking-wide">
                        GOODS VEHICLE
                        <br />
                        OPERATOR'S LICENCE
                      </p>
                      <p className="text-justify leading-relaxed">
                        {notice.nameOfOperator}
                        {notice.tradingName
                          ? ` t/a ${notice.tradingName}`
                          : ""}{" "}
                        of {notice.grant[idx].operatingCentre} is applying for a
                        licence to use {notice.grant[idx].operatingCentre} as an
                        operating centre for {notice.grant[idx].vehicles} goods{" "}
                        {notice.grant[idx].vehicles === 1
                          ? "vehicle"
                          : "vehicles"}{" "}
                        and {notice.grant[idx].trailers}{" "}
                        {notice.grant[idx].trailers === 1
                          ? "trailer"
                          : "trailers"}
                        . Owners or occupiers of land (including buildings) near
                        the operating centre who believe that their use or
                        enjoyment of that land would be affected, should make
                        written representations to the Traffic Commissioner at
                        Quarry House, Quarry Hill, Leeds LS2 7UE stating their
                        reasons, within 21 days of this notice. Representors
                        must at the same time send a copy of their
                        representations to the applicant at the address given at
                        the top of this notice. A Guide to making
                        representations is available from the Traffic
                        Commissioner's Office.
                      </p>
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => {
                          const textToCopy = `${notice.nameOfOperator}${
                            notice.tradingName
                              ? ` t/a ${notice.tradingName}`
                              : ""
                          } of ${
                            notice.grant[idx].operatingCentre
                          } is applying for a licence to use ${
                            notice.grant[idx].operatingCentre
                          } as an operating centre for ${
                            notice.grant[idx].vehicles
                          } goods ${
                            notice.grant[idx].vehicles === 1
                              ? "vehicle"
                              : "vehicles"
                          } and ${notice.grant[idx].trailers} ${
                            notice.grant[idx].trailers === 1
                              ? "trailer"
                              : "trailers"
                          }. Owners or occupiers of land (including buildings) near the operating centre who believe that their use or enjoyment of that land would be affected, should make written representations to the Traffic Commissioner at Quarry House, Quarry Hill, Leeds LS2 7UE stating their reasons, within 21 days of this notice. Representors must at the same time send a copy of their representations to the applicant at the address given at the top of this notice. A Guide to making representations is available from the Traffic Commissioner's Office.`
                            .replace(/\n/g, " ")
                            .replace(/\s+/g, " ");

                          navigator.clipboard.writeText(textToCopy);
                          toast.success("Notice text copied to clipboard.");
                        }}
                      >
                        Copy notice text
                      </Button>
                    </div>
                  </div>

                  {/* Price and Details Form Fields */}
                  <div className="flex flex-col gap-4">
                    <p className="font-semibold">
                      Adjust Publication Details & Price
                    </p>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                      <div className="col-span-2">
                        <p className="text-sm text-muted-foreground">
                          Initial Price from system:{" "}
                          <span className="font-medium text-foreground">
                            £{defaultGrants[idx]?.price || "0.00"}
                          </span>
                        </p>
                      </div>

                      <FormField
                        control={form.control}
                        name={`grants.${idx}.actualHeight`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Actual Height (mm)</FormLabel>
                            <FormControl>
                              <Input
                                disabled={form.watch(
                                  `grants.${idx}.overridePrice`
                                )} // Disable if override is active
                                type="number"
                                placeholder="e.g. 150"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex flex-col space-y-2 justify-end">
                        <Label
                          htmlFor={`override-price-${field.id}`}
                          className="flex items-center space-x-2"
                        >
                          <Switch
                            id={`override-price-${field.id}`}
                            checked={form.watch(`grants.${idx}.overridePrice`)}
                            onCheckedChange={(checked) => {
                              form.setValue(
                                `grants.${idx}.overridePrice`,
                                checked
                              );
                              // When override is enabled, the price input should be enabled and populated with current calculated price (or its current value)
                              // When override is disabled, the price should recalculate based on height
                              if (!checked) {
                                const actualHeight = form.getValues(
                                  `grants.${idx}.actualHeight`
                                );
                                form.setValue(
                                  `grants.${idx}.price`,
                                  calculatePrice(idx, actualHeight || "")
                                );
                              }
                            }}
                          />
                          <span>Override Price?</span>
                        </Label>
                      </div>

                      <FormField
                        control={form.control}
                        name={`grants.${idx}.price`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price (£)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="e.g. 131.78"
                                {...field}
                                disabled={
                                  !form.watch(`grants.${idx}.overridePrice`)
                                }
                                value={field.value} // Use field.value directly as it's already a string
                                onChange={(e) => {
                                  field.onChange(e.target.value);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex flex-col space-y-1 justify-end">
                        <FormLabel>Column Width (mm)</FormLabel>
                        <Input
                          placeholder="Column width"
                          value={notice.grant[idx].publication?.colWidth || ""}
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Separator className="my-4" />

            <div className="flex justify-between items-center px-4 py-2 bg-secondary/30 rounded-md shadow-sm">
              <span className="text-lg font-bold">Total Notice Cost:</span>
              <span className="text-lg font-bold">£{totalCost.toFixed(2)}</span>
            </div>

            <Button
              type="button" // Change to type="button" to prevent immediate form submission
              className="self-end mt-4"
              onClick={handleOpenDialog} // This will now open the dialog
              disabled={totalCost === 0}
            >
              Confirm Price Updates & Send to Customer
            </Button>
          </form>
        </Form>
      )}
      {fields.length === 0 && (
        <Card className="text-center p-8 text-muted-foreground">
          <p>No grants found for this notice.</p>
        </Card>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Price Updates</DialogTitle>
            <DialogDescription>
              Please confirm that the prices below are correct. Upon
              confirmation, these prices will be sent to the customer for review
              and payment.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center justify-between text-lg font-semibold">
              <span>Total Notice Cost:</span>
              <span>£{totalCost.toFixed(2)}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Are you sure you want to send these updated prices? This action
              cannot be easily undone.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              type="button"
            >
              Cancel
            </Button>
            <Button
              onClick={form.handleSubmit(onSubmit)} // Use handleSubmit here to validate and then call onSubmit
              type="button" // Important: keep type="button" to prevent default submit behaviour, handleSubmit will handle it.
            >
              Confirm & Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NoticeOverview;
