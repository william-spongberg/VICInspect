import { useEffect } from "react";
import { useMap } from "@vis.gl/react-google-maps";
import { ReportProps } from "./map";

export default function HeatMap({ inspectorReports }: ReportProps) {
  const map = useMap();

  // add extra weighting to data depending on timestamp
  const data = inspectorReports.map((report) => {
    const hoursAgo = (Date.now() - new Date(report.created_at!).getTime()) / (1000 * 60 * 60);
    return {
      location: new google.maps.LatLng(report.latitude, report.longitude),
      weight: 1 / (hoursAgo + 1),
    };
  });

  console.log(data);

  useEffect(() => {
    if (!map) return;

    // use the google maps heatmap
    const heatmap = new google.maps.visualization.HeatmapLayer({
      data: data,
      dissipating: true,
      radius: 40,
      gradient: [
      "rgba(255,0,0,0)",
      "rgba(255,0,0,1)",
      "rgba(191,0,64,1)",
      "rgba(128,0,128,1)"
      ]
    });
    heatmap.setMap(map);

    return () => {
      heatmap.setMap(null);
    };
  }, [data, map]);

  return null;
}
