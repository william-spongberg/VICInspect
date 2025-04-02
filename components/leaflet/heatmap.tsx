import { CircleMarker, LayerGroup, useMap } from "react-leaflet";

import { MAX_ZOOM } from "./map";

import { InspectorReport } from "@/supabase/reports";

export interface LeafletHeatMapProps {
  inspectorReports: InspectorReport[];
}

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
    const decay = Math.max(0, 1 - minutesAgo / 480); // fully decay after 8 hours (480 min)

    // opacity based on votes (0.5 base + 2.5% from votes)
    const opacity = Math.min(1.0, 0.5 + report.votes * 0.025);

    return {
      id: report.id,
      lat: report.latitude,
      lng: report.longitude,
      decay,
      opacity,
    };
  });

  const getColor = (decay: number) => {
    // decay red (0) to blue (240)
    const hue = 240 * (1 - decay);

    return `hsl(${hue}, 100%, 50%)`;
  };

  return (
    <LayerGroup>
      {heatmapData.map((point) => (
        <CircleMarker
          key={point.id}
          center={[point.lat, point.lng]}
          className="blur-[3px]"
          color="rgba(0,0,0,0.3)"
          fillColor={getColor(point.decay)}
          fillOpacity={point.opacity}
          pane="overlayPane"
          radius={radius}
          weight={0}
        />
      ))}
    </LayerGroup>
  );
}
