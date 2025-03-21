import { Typography } from "@mui/material";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
} from "@vis.gl/react-google-maps";
import { UserLocationProps } from "./page";

// TODO: add pins for trams
// TODO: add options for pin, such as delete after 8 hours + select number of inspectors and set multiple pins to cluster

type Poi = { key: string; location: google.maps.LatLngLiteral };

export function GoogleMap({ location }: UserLocationProps) {
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
    { key: "tarongaZoo", location: { lat: -33.8472767, lng: 151.2188164 } },
    { key: "manlyBeach", location: { lat: -33.8209738, lng: 151.2563253 } },
    { key: "hyderPark", location: { lat: -33.8690081, lng: 151.2052393 } },
    { key: "theRocks", location: { lat: -33.8587568, lng: 151.2058246 } },
    { key: "circularQuay", location: { lat: -33.858761, lng: 151.2055688 } },
    { key: "harbourBridge", location: { lat: -33.852228, lng: 151.2038374 } },
    { key: "kingsCross", location: { lat: -33.8737375, lng: 151.222569 } },
    { key: "botanicGardens", location: { lat: -33.864167, lng: 151.216387 } },
    { key: "museumOfSydney", location: { lat: -33.8636005, lng: 151.2092542 } },
    { key: "maritimeMuseum", location: { lat: -33.869395, lng: 151.198648 } },
    {
      key: "kingStreetWharf",
      location: { lat: -33.8665445, lng: 151.1989808 },
    },
    { key: "aquarium", location: { lat: -33.869627, lng: 151.202146 } },
    { key: "darlingHarbour", location: { lat: -33.87488, lng: 151.1987113 } },
    { key: "barangaroo", location: { lat: -33.8605523, lng: 151.1972205 } },
  ];

  return (
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
      <AdvancedMarker position={userLoc} />
      <PoiMarkers pois={locations} />
    </APIProvider>
  );
}

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
