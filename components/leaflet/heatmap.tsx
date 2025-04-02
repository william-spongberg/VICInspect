import { CircleMarker, LayerGroup, useMap } from "react-leaflet";

import { MAX_ZOOM } from "./map";

import { InspectorReport } from "@/supabase/reports";

export interface LeafletHeatMapProps {
  inspectorReports: InspectorReport[];
}

const JUST_CREATED = 0.5; // 30 mins
const RECENT = 1; // 1 hour
const WHILE_AGO = 2; // 2 hours
const OLD = 4; // 4 hours

export default function LeafletHeatMap({
  inspectorReports,
}: LeafletHeatMapProps) {
  const map = useMap();
  const currentZoom = map ? map.getZoom() : MAX_ZOOM;
  const radius = (currentZoom / MAX_ZOOM) * 18;

  const heatmapData = inspectorReports.map((report) => {
    const hoursAgo =
      (Date.now() - new Date(report.created_at).getTime()) / (1000 * 60 * 60);

    const weight = (report.votes + 1) / (hoursAgo + 1);

    return {
      id: report.id,
      lat: report.latitude,
      lng: report.longitude,
      weight,
    };
  });

  const getColor = (weight: number) => {
    if (weight < JUST_CREATED) {
      return "rgba(255, 0, 0, 0.8)"; // Red
    } else if (weight < RECENT) {
      return "rgba(255, 127, 0, 0.8)"; // Orange
    } else if (weight < WHILE_AGO) {
      return "rgba(255, 255, 0, 0.8)"; // Yellow
    } else if (weight < OLD) {
      return "rgba(0, 0, 255, 0.8)"; // Blue
    }

    // ancient now, dark blue
    return "rgba(0, 0, 139, 0.8)"; // Dark Blue
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
