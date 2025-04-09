import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
} from "@heroui/react";

import { InspectorReport } from "@/supabase/reports";
import { vote } from "@/supabase/votes";
import { useEffect, useState } from "react";

interface PopupInfoProps {
  report: InspectorReport;
  userId: string;
  errorCallback: (error: any) => void;
}

export default function PopupInfo({
  report,
  userId,
  errorCallback,
}: PopupInfoProps) {
  const createdAt = new Date(report.created_at);
  const minutesAgo = Math.floor(
    (Date.now() - createdAt.getTime()) / (1000 * 60)
  );
  const [votes, setVotes] = useState(report.votes);

  useEffect(() => {
    setVotes(report.votes);
  }, [report.votes]);

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
    <Card fullWidth className={"w-[300px] bg-white"} shadow="none">
      <CardHeader className="flex justify-center items-center pb-2">
        <div className="flex items-center space-x-3">
          <Button color="success" variant="ghost" onPress={handleUpvote}>
            👍
          </Button>
          <div
            className={`font-bold text-large ${votes > 0 ? "text-green-500" : "text-red-500"}`}
          >
            {votes}
          </div>
          <Button color="danger" variant="ghost" onPress={handleDownvote}>
            👎
          </Button>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <div className="text-sm text-black font-bold">
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
        </div>
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
