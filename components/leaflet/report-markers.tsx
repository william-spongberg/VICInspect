import { Marker, Popup } from "react-leaflet";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
} from "@heroui/react";

import { reportIcon } from "./map";

import { InspectorReport } from "@/supabase/reports";
import { vote } from "@/supabase/votes";

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
    (Date.now() - createdAt.getTime()) / (1000 * 60)
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
    await vote(report.id, userId, true, errorCallback);
  };

  const handleDownvote = async () => {
    await vote(report.id, userId, false, errorCallback);
  };

  return (
    <Card fullWidth shadow="none" className={"w-[300px] bg-white"}>
      <CardHeader className="flex justify-center items-center pb-2">
        <div className="flex items-center space-x-3">
          <Button color="success" variant="ghost" onPress={handleUpvote}>
            👍
          </Button>
          <div
            className={`font-bold text-large ${report.votes > 0 ? "text-green-500" : "text-red-500"}`}
          >
            {report.votes}
          </div>
          <Button color="danger" variant="ghost" onPress={handleDownvote}>
            👎
          </Button>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <p className="text-sm text-black font-bold">
          {reportedText} at{" "}
          {createdAt.toLocaleTimeString("en-AU", {
            hour: "2-digit",
            minute: "2-digit",
          })}
          <p className="text-sm text-gray-500">
            by{" "}
            <span className="font-semibold">
              {report.user_name ?? "Unknown user"}
            </span>
          </p>
        </p>
        <p className="text-sm text-black">
          {report.description ?? "No description provided"}
        </p>
      </CardBody>
      <CardFooter className="flex justify-end pt-1">
        <span className="text-[0.6rem] text-gray-400 italic">
          {report.id} | {report.user_id}
        </span>
      </CardFooter>
    </Card>
  );
}
