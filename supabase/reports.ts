import { supabase, getSession } from "./client";

export type InspectorReport = {
  id: number;
  user_id: string;
  latitude: number;
  longitude: number;
  votes: number;
  created_at: string;
};

const DB_REPORTS_TABLE = "inspector_reports";
const RECENT_REPORTS_HOURS = 8;

// save current location as an inspector report
export async function reportInspector(
  errorCallback: (error: any) => void,
  location: google.maps.LatLngLiteral,
  inspectorReports: InspectorReport[],
): Promise<boolean> {
  try {
    // find if very similar location (within 50m) has already been reported
    const similarReport = inspectorReports.find((report) => {
      const latDiff = Math.abs(report.latitude - location.lat);
      const lngDiff = Math.abs(report.longitude - location.lng);

      return latDiff < 0.0005 && lngDiff < 0.0005;
    });

    // update existing report if found and upvote
    if (similarReport) {
      const session = await getSession();

      // if user is not the one who created the report, upvote it
      if (session?.user?.id !== similarReport.user_id) {
        const { error } = await supabase
          .from(DB_REPORTS_TABLE)
          .update({
            created_at: new Date().toISOString(),
            votes: similarReport.votes + 1,
          })
          .eq("id", similarReport.id);

        if (error) throw error;
      }
    } else {
      const { error } = await supabase.from(DB_REPORTS_TABLE).insert({
        latitude: location.lat,
        longitude: location.lng,
      });

      if (error) throw error;
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
