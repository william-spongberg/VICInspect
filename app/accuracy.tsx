import { useEffect } from "react";
import { useMap } from "@vis.gl/react-google-maps";

export interface AccuracyCircleProps {
  locLatLng: google.maps.LatLngLiteral;
  accuracy: number;
}

// draw circle for accuracy of user location
export default function AccuracyCircle({
  locLatLng,
  accuracy,
}: AccuracyCircleProps) {
  const map = useMap();

  useEffect(() => {
    if (!locLatLng || !map) return;

    // use the google maps circle
    const accuracyCircle = new google.maps.Circle({
      strokeColor: "#4285F4",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#4285F4",
      fillOpacity: 0.15,
      map: map,
      center: locLatLng,
      radius: accuracy,
    });

    return () => {
      accuracyCircle.setMap(null);
    };
  }, [locLatLng, accuracy, map]);

  return null;
}
