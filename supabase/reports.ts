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

export const DB_REPORTS_TABLE = "inspector_reports";
export const RECENT_REPORTS_HOURS = 8;
export const LOW_REPORTS = 5;
export const MEDIUM_REPORTS = 15;
export const HIGH_REPORTS = 30;

// save current location as an inspector report
export async function createReport(
  user: User,
  location: { lat: number; lng: number },
  description: string,
  inspectorReports: InspectorReport[],
  errorCallback: (error: any) => void,
): Promise<boolean> {
  try {
    const similarReport = checkSimilarReport(inspectorReports, location);

    // if report is too similar, don't post
    if (similarReport) {
      throw new Error("Report is too close to an existing report.");
    } else {
      // yay insert new report
      await insertReport(user, location, description);
    }

    return true;
  } catch (error) {
    errorCallback(error);

    return false;
  }
}

// find if very similar location (within 50m) has already been reported
export function checkSimilarReport(
  inspectorReports: InspectorReport[],
  location: { lat: number; lng: number },
): boolean {
  return inspectorReports.some((report) => {
    const latDiff = Math.abs(report.latitude - location.lat);
    const lngDiff = Math.abs(report.longitude - location.lng);

    return latDiff < 0.0005 && lngDiff < 0.0005;
  });
}

// insert new report
export async function insertReport(
  user: User,
  location: { lat: number; lng: number },
  description: string,
) {
  const { error } = await supabase.from(DB_REPORTS_TABLE).insert({
    user_id: user.id,
    user_name: user.user_metadata.name,
    description: description,
    latitude: location.lat,
    longitude: location.lng,
  });

  if (error) throw error;
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
export async function getEdgeRecentReports(): Promise<InspectorReport[]> {
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
export async function getEdgeReportCountTotal(): Promise<number> {
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
export async function getEdgeReportCountToday(): Promise<number> {
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

// get danger level based on number of reports today
export function getDangerLevel(reportCount: number): string {
  if (reportCount <= LOW_REPORTS) return "Low";
  if (reportCount <= MEDIUM_REPORTS) return "Medium";
  if (reportCount <= HIGH_REPORTS) return "High";

  return "Very High";
}
