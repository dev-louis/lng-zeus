"use client";

import { Publication } from "@/types";
import { HashIcon, Loader2Icon } from "lucide-react";
import { UserIcon, MailIcon, PhoneIcon, FileTextIcon } from "lucide-react";
import Image from "next/image";
import React, { Suspense } from "react";
import { Button } from "../ui/button";
import dynamic from "next/dynamic";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import PublicationForm from "./publication-form";

const CirculationMap = dynamic(
  () => import("@/components/publications/circulation-map"),
  { ssr: false }
);

type Props = {
  publication: Publication;
};

const PublicationOverview = (props: Props) => {
  // Helper to format GBP prices
  const formatGBP = (value?: string | null) => {
    if (!value || isNaN(Number(value))) return "N/A";
    return `£${Number(value).toLocaleString("en-GB", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };
  const { publication } = props;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div className="flex w-full justify-between">
          <h1 className="text-2xl font-semibold inline-flex gap-2 items-center">
            {publication.name}
          </h1>
        </div>
        <div className="flex gap-2 text-muted-foreground items-center">
          <HashIcon className="size-4" />
          <p>{publication.id}</p>
        </div>
        <div className="flex gap-8 mt-4">
          <div className="p-4 rounded-md border w-full md:w-1/2">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <div className="font-semibold text-lg flex items-center gap-2 mb-2">
                  <UserIcon className="size-5" /> Group
                  <span className="text-base font-normal ml-2">
                    {publication.group}
                  </span>
                </div>
                <div className="font-semibold text-lg flex gap-2 mb-2">
                  <span>Circulation</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Dialog>
                        <DialogTrigger asChild>
                          <span className="text-base font-normal ml-2 cursor-pointer line-clamp-2">
                            {publication.circulation || "N/A"}
                          </span>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Circulation</DialogTitle>
                            <DialogDescription>
                              All the postcode outcodes and sectors below are
                              being matched against incoming postcode requests.
                              You may need to scroll for larger publications.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="max-h-96 overflow-y-scroll">
                            {publication.circulation || "N/A"}
                          </div>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button>Close</Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Click to view full circulation sectors</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              {/* Important details below */}
              <div className="grid grid-cols-2 gap-4 mt-4 relative">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">HGV Price</span>
                  <span className="ml-2">
                    {formatGBP(publication.hgvPrice)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Premises Price</span>
                  <span className="ml-2">
                    {formatGBP(publication.premisesPrice)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Trustee Price</span>
                  <span className="ml-2">
                    {formatGBP(publication.trusteePrice)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Col Price</span>
                  <span className="ml-2">
                    {formatGBP(publication.colPrice)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Col Width</span>
                  <span className="ml-2">{publication.colWidth ?? "N/A"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Col2 Width</span>
                  <span className="ml-2">{publication.col2Width ?? "N/A"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Circulation Count</span>
                  <span className="ml-2">
                    {publication.circulationCount ?? "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Confirmed</span>
                  <span className="ml-2">
                    {publication.confirmed ? "Yes" : "No"}
                  </span>
                </div>
                {/* Paper Contact Section */}
                <div className="col-span-2 mt-4">
                  <span className="font-semibold text-lg flex items-center gap-2 mb-2">
                    <UserIcon className="size-5" /> Paper Contact
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2">
                      <UserIcon className="size-4 text-muted-foreground" />
                      <span className="ml-2">
                        {publication.paperContactName &&
                        publication.paperContactName.trim() !== ""
                          ? publication.paperContactName
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MailIcon className="size-4 text-muted-foreground" />
                      {publication.paperContactEmail ? (
                        <a
                          className="ml-2 underline"
                          href={`mailto:${publication.paperContactEmail}`}
                        >
                          {publication.paperContactEmail}
                        </a>
                      ) : (
                        <span className="ml-2">N/A</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <PhoneIcon className="size-4 text-muted-foreground" />
                      {publication.paperContactNumber ? (
                        <a
                          className="ml-2 underline"
                          href={`tel:${publication.paperContactNumber}`}
                        >
                          {publication.paperContactNumber}
                        </a>
                      ) : (
                        <span className="ml-2">N/A</span>
                      )}
                    </div>
                  </div>
                  <span className="font-semibold text-lg flex items-center gap-2 mt-4 mb-2">
                    <FileTextIcon className="size-5" /> Paper Voucher Contact
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2">
                      <UserIcon className="size-4 text-muted-foreground" />
                      <span className="ml-2">
                        {publication.paperVoucherContactName &&
                        publication.paperVoucherContactName.trim() !== ""
                          ? publication.paperVoucherContactName
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <PhoneIcon className="size-4 text-muted-foreground" />
                      {publication.paperVoucherContactNumber ? (
                        <a
                          className="ml-2 underline"
                          href={`tel:${publication.paperVoucherContactNumber}`}
                        >
                          {publication.paperVoucherContactNumber}
                        </a>
                      ) : (
                        <span className="ml-2">N/A</span>
                      )}
                    </div>
                  </div>
                </div>
                {/* Adfast logo at bottom right if true */}
                {publication.adfast && (
                  <div className="absolute right-0 bottom-0 p-2">
                    <Image
                      src="/adfast.png"
                      alt="Adfast"
                      width={128}
                      height={64}
                    />
                  </div>
                )}
                <div className="col-span-2 flex items-center gap-2">
                  <span className="font-semibold">Deadline</span>
                  <span className="ml-2">{publication.deadline ?? "N/A"}</span>
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <span className="font-semibold">Special Instructions</span>
                  <span className="ml-2">
                    {publication.specialInstructions ?? "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Send Artwork</span>
                  <span className="ml-2">
                    {publication.sendArtwork ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <Suspense
              fallback={
                <div className="flex flex-col items-center justify-center h-[400px] border rounded-md">
                  <Loader2Icon className="animate-spin size-8 text-primary" />
                  <p>Loading map…</p>
                </div>
              }
            >
              <CirculationMap circulation={publication.circulation || ""} />
            </Suspense>
          </div>
        </div>
        <div className="mt-4">
          <PublicationForm publication={publication} />
        </div>
      </div>
    </div>
  );
};

export default PublicationOverview;
