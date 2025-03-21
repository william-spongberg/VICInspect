import { Typography } from "@mui/material";
import {
  APIProvider,
  Map,
  AdvancedMarker,
} from "@vis.gl/react-google-maps";
import { UserLocationProps } from "./page";


export function GoogleMap({ location }: UserLocationProps) {
  if (!location) {
    return <Typography variant="body1">Loading map...</Typography>;
  }

  const apiKey: any = process.env.NEXT_PUBLIC_MAP_API_KEY;

  return (
    <APIProvider apiKey={apiKey}>
      <Map
        style={{ height: "600px", width: "800px" }}
        defaultCenter={{ lat: location.coords.latitude, lng: location.coords.longitude }}
        defaultZoom={11}
        gestureHandling={"greedy"}
        disableDefaultUI={true}
        mapId="DEMO_MAP_ID"
      />
      <AdvancedMarker
        position={{ lat: location.coords.latitude, lng: location.coords.longitude }} />
    </APIProvider>
  );
}