import { Marker, Popup } from "react-leaflet";

import { reportIcon } from "./map";

import { InspectorReport } from "@/supabase/reports";
import PopupInfo from "./report-popup";

export interface InspectorReportProps {
  reports: InspectorReport[];
  userId: string;
  errorCallback: (error: any) => void;
}

export default function ReportMarkers({
  reports,
  userId,
  errorCallback,
}: InspectorReportProps) {
  const markers = reports.map((report) => {
    // report markers are hidden, only use is for popups
    return (
      <Marker
        key={report.id}
        icon={reportIcon}
        opacity={0}
        position={[report.latitude, report.longitude]}
      >
        <Popup>
          <PopupInfo
            errorCallback={errorCallback}
            report={report}
            userId={userId}
          />
        </Popup>
      </Marker>
    );
  });

  return markers;
}
