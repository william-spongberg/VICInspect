import { getReports } from "@/supabase/reports";

export const runtime = "edge";
export const revalidate = 0; // disabled for now

export async function GET() {
  try {
    // defaults to last 8 hours
    const data = await getReports();

    // console.log("Recent reports fetched successfully:", data);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
      },
    });
  } catch (error) {
    console.error("Error in recent reports edge function:", error);

    return new Response(
      JSON.stringify({ error: "Failed to fetch recent reports" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
