import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

import { LatLng } from "@/types/index";

export interface LeafletAccuracyCircleProps {
  location: LatLng;
  accuracy: number;
}

export const DEFAULT_ACCURACY = 100;

export default function LeafletAccuracyCircle({
  location,
  accuracy,
}: LeafletAccuracyCircleProps) {
  const map = useMap();

  useEffect(() => {
    if (!location || !map || accuracy <= 0) return;

    // add blue circle to map
    const accuracyCircle = L.circle(location, {
      color: "#4285F4",
      weight: 2,
      fillColor: "#4285F4",
      fillOpacity: 0.15,
      radius: accuracy,
    }).addTo(map);

    return () => {
      map.removeLayer(accuracyCircle);
    };
  }, [location, accuracy, map]);

  return null;
}
