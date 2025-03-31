import { getReportCount } from "@/supabase/reports";

const LIFETIME = 60 * 1; // 1 minute

export const runtime = 'edge';
export const revalidate = LIFETIME;

export async function GET() {
  try {
    // defaults to all time
    const reportCount = await getReportCount();
    
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
    console.error("Error in total report count edge function:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch total report count" }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
