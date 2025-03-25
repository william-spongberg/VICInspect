import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { Skeleton } from "@heroui/react";

import Marker from "./marker";
import HeatMap from "./heatmap";

import { InspectorReport } from "@/lib/supabase";

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
    return <Skeleton style={{ width: "100%", height: "75vh" }} />;
  }

  // map settings
  const DEFAULT_ZOOM = 15;
  const MAX_ZOOM = 18;
  const MIN_ZOOM = 9;

  // user location
  const userLoc: google.maps.LatLngLiteral = locLatLng;

  // google maps api key
  // TODO: restrict through google cloud to only accept requests from prod website when published
  const apiKey: any = process.env.NEXT_PUBLIC_MAP_API_KEY;

  const handleMarkerDragEnd = (newLocation: google.maps.LatLngLiteral) => {
    if (onLocationChange) {
      onLocationChange(newLocation);
    }
  };

  return (
    <>
      <APIProvider apiKey={apiKey} libraries={["visualization"]}>
        <Map
          defaultCenter={userLoc}
          defaultZoom={DEFAULT_ZOOM}
          disableDefaultUI={true}
          gestureHandling={"greedy"}
          mapId={MAP_ID}
          maxZoom={MAX_ZOOM}
          minZoom={MIN_ZOOM}
          style={{ width: "100vw", height: "75vh" }}
        />
        <ReportMarkers inspectorReports={inspectorReports} />
        <Marker
          accuracy={location.coords.accuracy}
          draggable={true}
          location={userLoc}
          title={"You"}
          onDragEnd={handleMarkerDragEnd}
        />
        <HeatMap inspectorReports={inspectorReports} />
      </APIProvider>
    </>
  );
}

// use for trams, trains etc
export interface ReportProps {
  inspectorReports: InspectorReport[];
}

// display all reports on map
function ReportMarkers({ inspectorReports }: ReportProps) {
  const elements = inspectorReports.map((report: InspectorReport) => {
    let title = "";

    // calc number of minutes since report
    const createdAt = new Date(report.created_at);
    const minutesAgo = Math.floor(
      (Date.now() - new Date(createdAt).getTime()) / (1000 * 60),
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
        colour="white"
        location={{ lat: report.latitude, lng: report.longitude }}
        opacity={0.5}
        title={`[${report.id?.toString()}] ${title}`}
        zIndex={-1}
      />
    );
  });

  return <>{elements}</>;
}
