import { Marker, Popup } from "react-leaflet";

import { markerIcon } from "./map";

import { InspectorReport } from "@/supabase/reports";

export interface InspectorReportProps {
  inspectorReports: InspectorReport[];
}

export default function ReportMarkers({
  inspectorReports,
}: InspectorReportProps) {
  const markers = inspectorReports.map((report) => {
    const createdAt = new Date(report.created_at);
    const minutesAgo = Math.floor(
      (Date.now() - createdAt.getTime()) / (1000 * 60),
    );

    // convert to human readable time
    let title = "";

    if (minutesAgo < 1) {
      title = "reported just now";
    } else if (minutesAgo < 60) {
      title = `reported ${minutesAgo} minute(s) ago`;
    } else {
      title = `reported ${Math.floor(minutesAgo / 60)} hour(s) ago`;
    }

    // hide report markers, only use for popups
    return (
      <Marker
        key={report.id}
        icon={markerIcon}
        opacity={0}
        position={[report.latitude, report.longitude]}
      >
        <Popup>
          [{report.id?.toString()}] {title}
        </Popup>
      </Marker>
    );
  });

  return markers;
}
