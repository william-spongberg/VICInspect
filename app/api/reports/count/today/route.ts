import { getReportCount } from "@/supabase/reports";

const LIFETIME = 60 * 5; // 5 minutes

export const runtime = 'edge';
export const revalidate = LIFETIME;

export async function GET() {
  try {
    // get last 24 hours report count
    const reportCount = await getReportCount(24);

    return new Response(
      JSON.stringify({ count: reportCount}),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
        }
      }
    );
  } catch (error) {
    console.error("Error in today's report count edge function:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch today's report count" }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
