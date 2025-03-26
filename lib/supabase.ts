import { createClient } from "@supabase/supabase-js";

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
  inspectorReports?: InspectorReport[],
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
      const session = await getSession();

      if (session?.user?.id === similarReport.user_id) {
        const { error } = await supabase
          .from("inspector_sightings")
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
export async function getRecentReports(
  hours = RECENT_REPORTS_HOURS,
): Promise<InspectorReport[]> {
  try {
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
  } catch (error) {
    console.error("Error fetching recent reports:", error);

    return [];
  }
}
