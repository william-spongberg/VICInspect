import { User } from "@supabase/supabase-js";

import { supabase } from "./client";

export type InspectorReport = {
  id: number;
  user_id: string;
  user_name: string;
  latitude: number;
  longitude: number;
  votes: number;
  description: string;
  created_at: string;
};

export type ReportVote = {
  id: number;
  report_id: number;
  user_id: string;
  upvote: boolean;
};

const DB_REPORTS_TABLE = "inspector_reports";
const DB_VOTES_TABLE = "report_votes";
const RECENT_REPORTS_HOURS = 8;

export async function voteReport(
  reportId: number,
  userId: string,
  upvote: boolean,
  errorCallback: (error: any) => void,
): Promise<boolean> {
  try {
    // check if voting on own report
    const { data: report, error: reportError } = await supabase
      .from(DB_REPORTS_TABLE)
      .select("id, user_id")
      .eq("id", reportId)
      .single();

    if (reportError) throw reportError;
    if (report.user_id === userId) {
      throw new Error("You cannot vote on your own report.");
    }

    // check if already voted on report
    const { data: existingVote, error: existingError } = await supabase
      .from(DB_VOTES_TABLE)
      .select("*")
      .eq("user_id", userId)
      .eq("report_id", reportId);

    if (existingError) throw existingError;

    if (existingVote && existingVote.length > 0) {
      if (existingVote?.some((vote) => vote.upvote === upvote)) {
        throw new Error("Already voted this way for the report.");
      } else {
        // update with new vote
        const { error: updateError } = await supabase
          .from(DB_VOTES_TABLE)
          .update({ upvote: upvote })
          .eq("user_id", userId)
          .eq("report_id", reportId);

        if (updateError) throw updateError;

        return true;
      }
    }

    // otherwise, its a new vote to insert
    const { error } = await supabase.from("report_votes").insert({
      report_id: reportId,
      user_id: userId,
      upvote: upvote,
    });

    if (error) throw error;

    // increment or decrement report votes
    if (upvote) {
      const { data, error: voteError } = await supabase.rpc(
        "increment_report_votes",
        { report_id: reportId },
      );

      if (voteError) throw voteError;
      console.log(data);
    } else {
      const { data, error: voteError } = await supabase.rpc(
        "decrement_report_votes",
        { report_id: reportId },
      );

      if (voteError) throw voteError;
      console.log(data);
    }

    return true;
  } catch (error) {
    errorCallback(error);

    return false;
  }
}

// save current location as an inspector report
export async function createReport(
  errorCallback: (error: any) => void,
  user: User,
  location: { lat: number; lng: number },
  description: string,
  inspectorReports: InspectorReport[],
): Promise<boolean> {
  try {
    // find if very similar location (within 50m) has already been reported
    const similarReport = inspectorReports.find((report) => {
      const latDiff = Math.abs(report.latitude - location.lat);
      const lngDiff = Math.abs(report.longitude - location.lng);

      return latDiff < 0.0005 && lngDiff < 0.0005;
    });

    // if report is too similar, don't post
    if (similarReport) {
      throw new Error("Report is too close to an existing report.");
    } else {
      // yay create new report
      const { error: reportError } = await supabase
        .from(DB_REPORTS_TABLE)
        .insert({
          user_name: user.user_metadata.name,
          description: description,
          latitude: location.lat,
          longitude: location.lng,
        });

      if (reportError) throw reportError;
    }

    return true;
  } catch (error) {
    errorCallback(error);

    return false;
  }
}

// get recent inspector reports
export async function getReports(
  hours = RECENT_REPORTS_HOURS,
): Promise<InspectorReport[]> {
  // grab all reports from the last 'x' hours
  const { data, error } = await supabase
    .from(DB_REPORTS_TABLE)
    .select("*")
    .gte(
      "created_at",
      new Date(Date.now() - hours * 60 * 60 * 1000).toISOString(),
    )
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data || [];
}

// get number of total reports in last 'x' hours
export async function getReportCount(hours = 0, userId = ""): Promise<number> {
  let query = supabase.from(DB_REPORTS_TABLE).select("*", { count: "exact" });

  // if userId is provided, filter by userId
  if (userId.length > 0) {
    query = query.eq("user_id", userId);
  }

  // if hours is provided, filter by created_at
  if (hours > 0) {
    const fromDate = new Date(
      Date.now() - hours * 60 * 60 * 1000,
    ).toISOString();

    query = query.gte("created_at", fromDate);
  }

  const { count, error } = await query;

  if (error) throw error;

  return count ?? 0;
}

// cache recent reports using server
export async function getRecentReports(): Promise<InspectorReport[]> {
  try {
    const response = await fetch("/api/reports/recent");

    if (!response.ok) {
      throw new Error(`Error fetching recent reports: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching recent reports from Edge Function:", error);

    // fallback to direct call if Edge Function fails
    return getReports();
  }
}

// cache total report count using server
export async function getReportCountTotal(): Promise<number> {
  try {
    const response = await fetch("/api/reports/count/total");

    if (!response.ok) {
      throw new Error(
        `Error fetching total report count: ${response.statusText}`,
      );
    }
    const data = await response.json();

    return data.count;
  } catch (error) {
    console.error(
      "Error fetching total report count from Edge Function:",
      error,
    );

    // fallback to direct call if Edge Function fails
    return getReportCount();
  }
}

// cache today's report count using server
export async function getReportCountToday(): Promise<number> {
  try {
    const response = await fetch("/api/reports/count/today");

    if (!response.ok) {
      throw new Error(
        `Error fetching today's report count: ${response.statusText}`,
      );
    }
    const data = await response.json();

    return data.count;
  } catch (error) {
    console.error(
      "Error fetching today's report count from Edge Function:",
      error,
    );

    // fallback to direct call if Edge Function fails
    return getReportCount(24);
  }
}

// get danger level based on number of reports in the last 24 hours
export function getDangerLevel(reportCount: number): string {
  if (reportCount <= 5) return "Low";
  if (reportCount <= 15) return "Medium";
  if (reportCount <= 30) return "High";

  return "Very High";
}
