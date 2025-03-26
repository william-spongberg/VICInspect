import { useEffect, useState } from "react";
import { useMap } from "@vis.gl/react-google-maps";

import { ReportProps } from "./map";

import { getReportVotes } from "@/lib/supabase";

export default function HeatMap({ inspectorReports }: ReportProps) {
  // grab map from context
  const map = useMap();
  const [heatmapData, setHeatmapData] = useState<
    google.maps.visualization.WeightedLocation[]
  >([]);

  // heatmap settings
  const HEATMAP_RADIUS = 25;
  const HEATMAP_GRADIENT = [
    "rgba(255,0,0,0)",
    "rgba(255,0,0,1)",
    "rgba(191,0,64,1)",
    "rgba(128,0,128,1)",
  ];

  // Process reports and create heatmap data
  useEffect(() => {
    const fetchVotesAndCreateData = async () => {
      const weightedData = await Promise.all(
        inspectorReports.map(async (report) => {
          const hoursAgo =
            (Date.now() - new Date(report.created_at).getTime()) /
            (1000 * 60 * 60);
          const votes = await getReportVotes(report.id);

          return {
            location: new google.maps.LatLng(report.latitude, report.longitude),
            weight: (votes + 1) / (hoursAgo + 1),
          };
        }),
      );

      setHeatmapData(weightedData);
    };

    fetchVotesAndCreateData();
  }, [inspectorReports]);

  useEffect(() => {
    if (!map || heatmapData.length === 0) return;

    // use the google maps heatmap
    const heatmap = new google.maps.visualization.HeatmapLayer({
      data: heatmapData,
      radius: HEATMAP_RADIUS,
      gradient: HEATMAP_GRADIENT,
    });

    heatmap.setMap(map);

    return () => {
      heatmap.setMap(null);
    };
  }, [heatmapData, map]);

  return null;
}
