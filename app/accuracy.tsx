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

    // center and fit map around circle if not in view
    const circleBounds = accuracyCircle.getBounds();
    const currentBounds = map.getBounds();

    if (circleBounds && currentBounds) {
      if (
        !currentBounds.contains(circleBounds.getNorthEast()) ||
        !currentBounds.contains(circleBounds.getSouthWest())
      ) {
        map.fitBounds(circleBounds, 100);
      }
    }

    return () => {
      accuracyCircle.setMap(null);
    };
  }, [locLatLng, accuracy, map]);

  return null;
}
