import { createClient } from "@supabase/supabase-js";

export type InspectorReport = {
  id: number;
  latitude: number;
  longitude: number;
  accuracy?: number;
  votes: number;
  created_at: string;
};

const DB_REPORTS_TABLE = "inspector_reports";
const DB_VOTES_TABLE = "report_votes";
const RECENT_REPORTS_HOURS = 8;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// create a supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// get the current session
export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error("Error getting session:", error);
    return null;
  }
  return data.session;
};

// save current location as an inspector report
export async function reportInspector(
  errorCallback: (error: any) => void,
  location: google.maps.LatLngLiteral,
  accuracy?: number,
  inspectorReports?: InspectorReport[]
): Promise<boolean> {
  try {
    // find if very similar location (within 50m) has already been reported
    const similarReport = inspectorReports?.find((report) => {
      const latDiff = Math.abs(report.latitude - location.lat);
      const lngDiff = Math.abs(report.longitude - location.lng);

      return latDiff < 0.0005 && lngDiff < 0.0005;
    });

    // update existing report if found and upvote
    if (similarReport) {
      const { error } = await supabase
        .from(DB_VOTES_TABLE)
        .insert({ report_id: similarReport.id });

      if (error) throw error;
    } else {
      const { error } = await supabase.from(DB_REPORTS_TABLE).insert({
        latitude: location.lat,
        longitude: location.lng,
        accuracy: accuracy ?? 0,
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
export async function getRecentReports(
  hours = RECENT_REPORTS_HOURS
): Promise<InspectorReport[]> {
  try {
    // grab all reports from the last 'x' hours
    const { data, error } = await supabase
      .from(DB_REPORTS_TABLE)
      .select("*")
      .gte(
        "created_at",
        new Date(Date.now() - hours * 60 * 60 * 1000).toISOString()
      )
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error("Error fetching recent reports:", error);

    return [];
  }
}

// get all votes that match report id
export async function getReportVotes(reportId: number): Promise<number> {
  try {
    const { data, error } = await supabase
      .from(DB_VOTES_TABLE)
      .select("report_id", { count: "exact" })
      .eq("report_id", reportId);

    if (error) throw error;

    return data?.length ?? 0;
  } catch (error) {
    console.error("Error fetching report votes:", error);

    return 0;
  }
}
