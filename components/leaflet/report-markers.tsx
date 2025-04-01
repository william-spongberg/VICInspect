import { Marker, Popup } from "react-leaflet";
import { Button } from "@heroui/react";

import { reportIcon } from "./map";

import { InspectorReport, voteReport } from "@/supabase/reports";

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

interface PopupInfoProps {
  report: InspectorReport;
  userId: string;
  errorCallback: (error: any) => void;
}

function PopupInfo({ report, userId, errorCallback }: PopupInfoProps) {
  const createdAt = new Date(report.created_at);
  const minutesAgo = Math.floor(
    (Date.now() - createdAt.getTime()) / (1000 * 60),
  );

  // convert to human readable time
  let reportedText = "";

  if (minutesAgo < 1) {
    reportedText = "Reported just now";
  } else if (minutesAgo < 60) {
    reportedText = `Reported ${minutesAgo} minute(s) ago`;
  } else {
    reportedText = `Reported ${Math.floor(minutesAgo / 60)} hour(s) ago`;
  }

  const handleUpvote = async () => {
    await voteReport(report.id, userId, true, errorCallback);
  };

  const handleDownvote = async () => {
    await voteReport(report.id, userId, false, errorCallback);
  };

  return (
    <div className="p-2">
      <div className="flex items-center mb-2">
        <div className="flex items-center space-x-3 mx-auto">
          <Button color="success" variant="ghost" onPress={handleUpvote}>
            👍
          </Button>
          {report.votes > 0 ? (
            <div className="font-bold text-green-500 text-large mx-auto">
              {report.votes}
            </div>
          ) : (
            <div className="font-bold text-red-500 text-large mx-auto">
              {report.votes}
            </div>
          )}
          <Button color="danger" variant="ghost" onPress={handleDownvote}>
            👎
          </Button>
        </div>
      </div>
      <div className="mb-2 font-bold text-gray-700">
        {reportedText} at{" "}
        {createdAt.toLocaleTimeString("en-AU", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
      <div className="mb-2 text-gray-800">
        by{" "}
        <span className="font-semibold">
          {report.user_name ?? "Unknown user"}
        </span>
      </div>
      <div className="p-3 mb-1 bg-blue-50 rounded-md shadow">
        <div className="mb-2">
          {report.description ?? "No description provided"}
        </div>
      </div>
      <div className="text-right">
        <span className="text-[0.6rem] text-gray-400 italic">
          {report.id} | {report.user_id}
        </span>
      </div>
    </div>
  );
}
