import React from "react";

import { Badge } from "@/components/ui/badge";
import { BeerIcon, TruckIcon } from "lucide-react";
import { cache } from "react";

type Props = {};

const SystemStatuses = async (props: Props) => {
  const getHGVStatus = cache(async () => {
    const res = await fetch("https://hgv.legalnoticegateway.com/api/auth/ok", {
      next: { revalidate: 600 },
    });
    return { ok: res.ok };
  });

  const getPremisesStatus = cache(async () => {
    const res = await fetch(
      "https://premises.legalnoticegateway.com/api/auth/ok",
      {
        next: { revalidate: 600 },
      }
    );
    return { ok: res.ok };
  });

  const hgvStatus = await getHGVStatus();
  const premisesStatus = await getPremisesStatus();

  return (
    <div className="flex items-center gap-2">
      <Badge variant={hgvStatus.ok ? "success" : "destructive"}>
        <TruckIcon className="size-4" />
        <span className="font-medium">
          HGV {hgvStatus.ok ? "Online" : "Offline"}
        </span>
      </Badge>
      <Badge variant={premisesStatus.ok ? "success" : "destructive"}>
        <BeerIcon className="size-4" />
        <span className="font-medium">
          Premises {premisesStatus.ok ? "Online" : "Offline"}
        </span>
      </Badge>
    </div>
  );
};

export default SystemStatuses;
