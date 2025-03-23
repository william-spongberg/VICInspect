import { Typography } from "@mui/material";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  MapCameraChangedEvent,
  InfoWindow,
  useMap,
} from "@vis.gl/react-google-maps";
import { LocationProps } from "./page";
import { useEffect } from "react";

// TODO: add pins for trams
// TODO: add options for pin, such as delete after 8 hours + select number of inspectors and set multiple pins to cluster

type Poi = {
  key: string;
  location: google.maps.LatLngLiteral;
};

export function GoogleMap({ location }: LocationProps) {
  if (!location) {
    return <Typography variant="body1">Loading map...</Typography>;
  }

  const userLoc: google.maps.LatLngLiteral = {
    lat: location.coords.latitude,
    lng: location.coords.longitude,
  };
  const apiKey: any = process.env.NEXT_PUBLIC_MAP_API_KEY;
  // TODO: restrict through google cloud to only accept requests from prod website when published

  const locations: Poi[] = [
    { key: "operaHouse", location: { lat: -33.8567844, lng: 151.213108 } },
  ];

  return (
    <>
      <APIProvider apiKey={apiKey}>
        <Map
          style={{ height: "600px", width: "800px" }}
          defaultCenter={userLoc}
          defaultZoom={18}
          gestureHandling={"greedy"}
          disableDefaultUI={true}
          mapId="DEMO_MAP_ID"
          reuseMaps={true}
        />
        <AccuracyCircle location={location} />
        <AdvancedMarker position={userLoc} />
        <PoiMarkers pois={locations} />
      </APIProvider>
    </>
  );
}

// draw circle for approximation of user location
function AccuracyCircle({ location }: LocationProps) {
  const map = useMap();
  
  useEffect(() => {
    if (!location || !map) return;
    
    const center = {
      lat: location.coords.latitude,
      lng: location.coords.longitude,
    };
    
    // use the google maps circle
    const accuracyCircle = new google.maps.Circle({
      strokeColor: "#4285F4",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#4285F4",
      fillOpacity: 0.15,
      map: map,
      center: center,
      radius: location.coords.accuracy
    });
    
    return () => {
      accuracyCircle.setMap(null);
    };
  }, [location, map]);
  
  return null;
}

// use for trams, trains etc
function PoiMarkers(props: { pois: Poi[] }) {
  return (
    <>
      {props.pois.map((poi: Poi) => (
        <AdvancedMarker key={poi.key} position={poi.location}>
          <Pin
            background={"#FBBC04"}
            glyphColor={"#000"}
            borderColor={"#000"}
          />
        </AdvancedMarker>
      ))}
    </>
  );
}
