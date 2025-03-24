import { Typography } from "@mui/material";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import Marker from "./marker";
import { InspectorReport } from "@/lib/supabase";

// TODO: add pins for trams
// TODO: add options for pin, such as delete after 8 hours + select number of inspectors and set multiple pins to cluster

export interface GoogleMapProps {
  location: GeolocationPosition | null;
  locLatLng: google.maps.LatLngLiteral | null;
  inspectorReports: InspectorReport[];
  onLocationChange?: (newLocation: google.maps.LatLngLiteral) => void;
}

export function GoogleMap({
  location,
  locLatLng,
  inspectorReports,
  onLocationChange,
}: GoogleMapProps) {
  if (!location || !locLatLng) {
    return <Typography variant="body1">Loading map...</Typography>;
  }

  const userLoc: google.maps.LatLngLiteral = locLatLng;
  const apiKey: any = process.env.NEXT_PUBLIC_MAP_API_KEY;
  // TODO: restrict through google cloud to only accept requests from prod website when published

  const handleMarkerDragEnd = (newLocation: google.maps.LatLngLiteral) => {
    if (onLocationChange) {
      onLocationChange(newLocation);
    }
  };

  return (
    <>
      <APIProvider apiKey={apiKey}>
        <Map
          style={{ height: "600px", width: "800px" }}
          defaultCenter={userLoc}
          defaultZoom={16}
          gestureHandling={"greedy"}
          disableDefaultUI={true}
          mapId="DEMO_MAP_ID"
          reuseMaps={true}
        />
        <Marker
          title={"You"}
          location={userLoc}
          accuracy={location.coords.accuracy}
          draggable={true}
          onDragEnd={handleMarkerDragEnd}
        />
        <ReportMarkers inspectorReports={inspectorReports} />
      </APIProvider>
    </>
  );
}

// use for trams, trains etc
interface ReportProps {
  inspectorReports: InspectorReport[];
}

function ReportMarkers({ inspectorReports }: ReportProps) {
  const elements = inspectorReports.map((report: InspectorReport) => {
    let title = "";

    // calc number of minutes since report
    const minutesAgo = Math.floor(
      (Date.now() - new Date(report.created_at!).getTime()) / (1000 * 60)
    );

    // convert to hours if more than 60 minutes
    if (minutesAgo <= 60) {
      title = `reported ${minutesAgo} minute(s) ago`;
    } else {
      title = `reported ${Math.floor(minutesAgo / 60)} hour(s) ago`;
    }

    return (
      <Marker
        key={report.id}
        title={title}
        location={{ lat: report.latitude, lng: report.longitude }}
      />
    );
  });

  return <>{elements}</>;
}
