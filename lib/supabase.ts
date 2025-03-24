import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL??'';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY??'';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type InspectorReport = {
  id?: number;
  latitude: number;
  longitude: number;
  accuracy?: number;
  created_at?: string;
};

// save current location as an inspector report
export async function reportInspector(location: google.maps.LatLngLiteral, accuracy?: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('inspector_sightings')
      .insert({
        latitude: location.lat,
        longitude: location.lng,
        accuracy: accuracy??0,
      });
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error reporting inspector:', error);
    return false;
  }
}

// get recent inspector reports
export async function getRecentReports(hours = 1): Promise<InspectorReport[]> {
  try {
    // grab all reports from the last 'x' hours
    const { data, error } = await supabase
      .from('inspector_sightings')
      .select('*')
      .gte('created_at', new Date(Date.now() - hours * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching recent reports:', error);
    return [];
  }
}
