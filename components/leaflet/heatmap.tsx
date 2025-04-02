import { CircleMarker, LayerGroup, useMap } from "react-leaflet";

import { MAX_ZOOM } from "./map";

import { InspectorReport } from "@/supabase/reports";

export interface LeafletHeatMapProps {
  inspectorReports: InspectorReport[];
}

// between 0-1
const JUST_CREATED = 0.75;
const RECENT = 0.5;
const WHILE_AGO = 0.25;
const OLD = 0.1;

export default function LeafletHeatMap({
  inspectorReports,
}: LeafletHeatMapProps) {
  const map = useMap();
  const currentZoom = map ? map.getZoom() : MAX_ZOOM;
  const radius = (currentZoom / MAX_ZOOM) * 18;

  const heatmapData = inspectorReports.map((report) => {
    const minutesAgo =
      (Date.now() - new Date(report.created_at).getTime()) / (1000 * 60);

    // decay based on time (older reports have lower weight)
    // approaches 0 as time increases
    const timeFactor = Math.max(0, 1 - minutesAgo / 480); // fully decay after 8 hours (480 min)

    const voteBoost = Math.min(0.5, report.votes * 0.1); // max 0.5 boost from votes

    // final weight between 0 and 1
    const weight = Math.min(1, timeFactor + voteBoost);

    return {
      id: report.id,
      lat: report.latitude,
      lng: report.longitude,
      weight,
    };
  });

  const getColor = (weight: number) => {
    if (weight >= JUST_CREATED) {
      return "rgba(255, 0, 0, 0.8)"; // red
    } else if (weight >= RECENT) {
      return "rgba(255, 127, 0, 0.8)"; // orange
    } else if (weight >= WHILE_AGO) {
      return "rgba(255, 255, 0, 0.8)"; // yellow
    } else if (weight >= OLD) {
      return "rgba(0, 0, 255, 0.8)"; // blue
    }

    // ancient now, dark blue
    return "rgba(0, 0, 139, 0.8)";
  };

  return (
    <LayerGroup>
      {heatmapData.map((point) => (
        <CircleMarker
          key={point.id}
          center={[point.lat, point.lng]}
          color="rgba(0,0,0,0.3)"
          fillColor={getColor(point.weight)}
          fillOpacity={0.8}
          pane="overlayPane"
          radius={radius}
          weight={0}
        />
      ))}
    </LayerGroup>
  );
}
