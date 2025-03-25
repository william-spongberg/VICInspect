import { useEffect } from "react";
import { useMap } from "@vis.gl/react-google-maps";

import { ReportProps } from "./map";

export default function HeatMap({ inspectorReports }: ReportProps) {
  // grab map from context
  const map = useMap();

  // heatmap settings
  const HEATMAP_RADIUS = 25;
  const HEATMAP_GRADIENT = [
    "rgba(255,0,0,0)",
    "rgba(255,0,0,1)",
    "rgba(191,0,64,1)",
    "rgba(128,0,128,1)",
  ];

  // add extra weighting to data depending on timestamp
  const data = inspectorReports.map((report) => {
    const hoursAgo =
      (Date.now() - new Date(report.created_at).getTime()) / (1000 * 60 * 60);

    const weighted: google.maps.visualization.WeightedLocation = {
      location: new google.maps.LatLng(report.latitude, report.longitude),
      weight: report.votes / (hoursAgo + 1),
    };

    return weighted;
  });

  useEffect(() => {
    if (!map) return;

    // use the google maps heatmap
    const heatmap = new google.maps.visualization.HeatmapLayer({
      data: data,
      radius: HEATMAP_RADIUS,
      gradient: HEATMAP_GRADIENT,
    });

    heatmap.setMap(map);

    return () => {
      heatmap.setMap(null);
    };
  }, [data, map]);

  return null;
}
