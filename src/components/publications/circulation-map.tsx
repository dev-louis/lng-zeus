"use client";

import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";
import { Loader2Icon } from "lucide-react";

type CirculationMapProps = {
  circulation: string;
};

function FitBounds({ geoData }: { geoData: any[] }) {
  const map = useMap();
  useEffect(() => {
    if (geoData.length > 0) {
      const group = L.featureGroup(geoData.map((g: any) => L.geoJSON(g)));
      map.fitBounds(group.getBounds(), { padding: [30, 30] });
    }
  }, [geoData, map]);
  return null;
}

export default function CirculationMap({ circulation }: CirculationMapProps) {
  const [geoData, setGeoData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showSlowMsg, setShowSlowMsg] = useState<boolean>(false);

  useEffect(() => {
    let slowMsgTimeout: NodeJS.Timeout;
    async function loadData() {
      setLoading(true);
      setShowSlowMsg(false);
      slowMsgTimeout = setTimeout(() => setShowSlowMsg(true), 1500);
      const codes = circulation
        .split(",")
        .map((c: string) => c.trim())
        .filter(Boolean);

      // Fetch all in parallel
      const fetched = await Promise.all(
        codes.map(async (code: string) => {
          try {
            const res = await fetch(`/geojson/${code}.json`);
            if (res.ok) {
              return await res.json();
            }
          } catch (err) {
            console.error(`Error fetching ${code}`, err);
          }
          return null;
        })
      );

      setGeoData(fetched.filter(Boolean));
      setLoading(false);
      clearTimeout(slowMsgTimeout);
      setShowSlowMsg(false);
    }

    loadData();
    return () => clearTimeout(slowMsgTimeout);
  }, [circulation]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] border rounded-md">
        <Loader2Icon className="animate-spin size-8 text-primary" />
        <p>Loading map…</p>
        {showSlowMsg && (
          <p className="text-xs text-muted-foreground mt-2">
            This may take a few seconds for larger papers.
          </p>
        )}
      </div>
    );
  }

  return (
    <MapContainer
      className="rounded-md border overflow-hidden z-1"
      center={[54, -2]}
      zoom={8}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {geoData.map((feature, i) => (
        <GeoJSON
          key={i}
          data={feature}
          style={{ color: "blue", weight: 1, fillOpacity: 0.3 }}
        />
      ))}

      <FitBounds geoData={geoData} />
    </MapContainer>
  );
}
