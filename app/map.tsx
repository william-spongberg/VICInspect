import { Typography } from "@mui/material";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import Marker from "./marker";

// TODO: add pins for trams
// TODO: add options for pin, such as delete after 8 hours + select number of inspectors and set multiple pins to cluster

type Poi = {
  key: string;
  location: google.maps.LatLngLiteral;
};

export interface GoogleMapProps {
  location: GeolocationPosition | null;
  locLatLng: google.maps.LatLngLiteral | null;
  onLocationChange?: (newLocation: google.maps.LatLngLiteral) => void;
}

export function GoogleMap({ location, locLatLng, onLocationChange }: GoogleMapProps) {
  if (!location || !locLatLng) {
    return <Typography variant="body1">Loading map...</Typography>;
  }

  const userLoc: google.maps.LatLngLiteral = locLatLng;
  const apiKey: any = process.env.NEXT_PUBLIC_MAP_API_KEY;
  // TODO: restrict through google cloud to only accept requests from prod website when published

  const locations: Poi[] = [
    { key: "Melbourne", location: { lat: -36.813629, lng: 144.963058 } },
  ];

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
        <PoiMarkers pois={locations} />
      </APIProvider>
    </>
  );
}

// use for trams, trains etc
function PoiMarkers(props: { pois: Poi[] }) {
  return (
    <>
      {props.pois.map((poi: Poi) => (
        <Marker key={poi.key} title={poi.key} location={poi.location} />
      ))}
    </>
  );
}
