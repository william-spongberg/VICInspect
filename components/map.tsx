import {
  APIProvider,
  Map,
  ColorScheme,
  useMap,
} from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Skeleton } from "@heroui/react";

import Marker from "./marker";
import HeatMap from "./heatmap";

import { InspectorReport } from "@/db/supabase";

export const MAP_ID = "DEMO_MAP_ID";
export const MAP_WIDTH = 1000;
export const MAP_HEIGHT = 600;

// TODO: add pins for trams

export interface GoogleMapProps {
  geoLocation: GeolocationPosition | null;
  userLocation: google.maps.LatLngLiteral;
  inspectorReports: InspectorReport[];
  onLocationChange?: (newLocation: google.maps.LatLngLiteral) => void;
}

export default function GoogleMap({
  geoLocation,
  userLocation,
  inspectorReports,
  onLocationChange,
}: GoogleMapProps) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapTheme, setMapTheme] = useState<ColorScheme>(ColorScheme.DARK);
  const { theme, resolvedTheme } = useTheme();

  useEffect(() => {
    // change map theme based on user theme
    const currentTheme = resolvedTheme ?? theme;

    if (currentTheme === "light") {
      setMapTheme(ColorScheme.LIGHT);
    } else {
      setMapTheme(ColorScheme.DARK);
    }
  }, [theme, resolvedTheme]);

  useEffect(() => {}, [geoLocation, userLocation]);

  // map settings
  const DEFAULT_ZOOM = 15;
  const MAX_ZOOM = 18;
  const MIN_ZOOM = 9;

  // google maps api key
  // TODO: restrict through google cloud to only accept requests from prod website when published
  const apiKey: any = process.env.NEXT_PUBLIC_MAP_API_KEY;

  const handleMarkerDragEnd = (newLocation: google.maps.LatLngLiteral) => {
    if (onLocationChange) {
      onLocationChange(newLocation);
    }
  };

  const handleMapApiLoad = () => {
    setMapLoaded(true);
  };

  return (
    <>
      <APIProvider
        apiKey={apiKey}
        libraries={["visualization", "maps"]}
        onLoad={handleMapApiLoad}
      >
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          <Skeleton
            isLoaded={mapLoaded}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              zIndex: 1,
            }}
          />
          {mapLoaded && (
            <>
              <Map
                colorScheme={mapTheme}
                defaultCenter={userLocation}
                defaultZoom={DEFAULT_ZOOM}
                disableDefaultUI={true}
                gestureHandling={"greedy"}
                mapId={MAP_ID}
                maxZoom={MAX_ZOOM}
                minZoom={MIN_ZOOM}
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  zIndex: 2,
                }}
              />
              <ReportMarkers inspectorReports={inspectorReports} />
              <Marker
                accuracy={geoLocation?.coords.accuracy ?? 50}
                draggable={true}
                location={userLocation}
                title={"You"}
                onDragEnd={handleMarkerDragEnd}
              />
              <HeatMap inspectorReports={inspectorReports} />
              <PanMapToLocation location={userLocation} />
            </>
          )}
        </div>
      </APIProvider>
    </>
  );
}

interface PanProps {
  location: google.maps.LatLngLiteral;
}

function PanMapToLocation({ location }: PanProps) {
  const map = useMap();

  useEffect(() => {
    if (map) {
      map.panTo(location);
    }
  }, [location, map]);

  return null;
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
