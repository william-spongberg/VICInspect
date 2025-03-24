import { APIProvider, Map } from "@vis.gl/react-google-maps";
import Marker from "./marker";
import { InspectorReport } from "@/lib/supabase";
import HeatMap from "./heatmap";
import { Skeleton } from "@heroui/react";

export const MAP_ID = "DEMO_MAP_ID";
export const MAP_WIDTH = 1000;
export const MAP_HEIGHT = 600;

// TODO: add pins for trams

export interface GoogleMapProps {
  location: GeolocationPosition | null;
  locLatLng: google.maps.LatLngLiteral | null;
  inspectorReports: InspectorReport[];
  onLocationChange?: (newLocation: google.maps.LatLngLiteral) => void;
}

export default function GoogleMap({
  location,
  locLatLng,
  inspectorReports,
  onLocationChange,
}: GoogleMapProps) {
  if (!location || !locLatLng) {
    return <Skeleton />;
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
      <APIProvider apiKey={apiKey} libraries={["visualization"]}>
        <Map
          style={{ width: MAP_WIDTH, height: MAP_HEIGHT }}
          defaultCenter={userLoc}
          defaultZoom={14}
          gestureHandling={"greedy"}
          disableDefaultUI={true}
          mapId={MAP_ID}
          reuseMaps={true}
          maxZoom={18}
          minZoom={10}
        />
        <HeatMap inspectorReports={inspectorReports} />
        <ReportMarkers inspectorReports={inspectorReports} />
        <Marker
          title={"You"}
          location={userLoc}
          accuracy={location.coords.accuracy}
          draggable={true}
          onDragEnd={handleMarkerDragEnd}
        />
      </APIProvider>
    </>
  );
}

// use for trams, trains etc
export interface ReportProps {
  inspectorReports: InspectorReport[];
}

function ReportMarkers({ inspectorReports }: ReportProps) {
  const elements = inspectorReports.map((report: InspectorReport) => {
    let title = "";

    // calc number of minutes since report
    const minutesAgo = Math.floor(
      (Date.now() - new Date(report.created_at!).getTime()) / (1000 * 60)
    );

    // title is time last reported, make more human readable
    if (minutesAgo < 1) {
      title = "reported just now";
    } else if (minutesAgo < 60) {
      title = `reported ${minutesAgo} minute(s) ago`;
    } else {
      title = `reported ${Math.floor(minutesAgo / 60)} hour(s) ago`;
    }

    return (
      <Marker
        key={report.id}
        title={title}
        colour="white"
        location={{ lat: report.latitude, lng: report.longitude }}
      />
    );
  });

  return <>{elements}</>;
}
