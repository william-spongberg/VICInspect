// @ts-nocheck
// ignore errors here, code runs fine. errors occur because of the way leaflet heatmap is imported
import HeatmapLayer from "react-leaflet-heat-layer";

import { MAX_ZOOM } from "./map";

import { InspectorReport } from "@/supabase/reports";

export interface LeafletHeatMapProps {
  inspectorReports: InspectorReport[];
}

export default function LeafletHeatMap({
  inspectorReports,
}: LeafletHeatMapProps) {
  const heatmapData = inspectorReports.map((report) => {
    const hoursAgo =
      (Date.now() - new Date(report.created_at).getTime()) / (1000 * 60 * 60);

    // weight based on votes and how old report is
    const weight = (report.votes + 1) / (hoursAgo + 1);

    return [report.latitude, report.longitude, weight] as [
      number,
      number,
      number,
    ];
  });

  return (
    <HeatmapLayer
      blur={15}
      latlngs={heatmapData}
      maxZoom={MAX_ZOOM}
      minOpacity={0.5}
      radius={25}
    />
  );
}
