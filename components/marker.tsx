import { useState } from "react";
import { AdvancedMarker, Pin, InfoWindow } from "@vis.gl/react-google-maps";

import AccuracyCircle from "./accuracy";

export const DRAGGED_ACCURACY = 50;

export interface MarkerProps {
  title?: string;
  location: google.maps.LatLngLiteral;
  colour?: string;
  draggable?: boolean;
  accuracy?: number;
  zIndex?: number;
  opacity?: number;
  onDragEnd?: (location: google.maps.LatLngLiteral) => void;
}

// general marker for google maps
export default function Marker({
  location,
  title = "",
  colour = "#EF0000",
  draggable = false,
  accuracy = 0,
  zIndex = 0,
  opacity = 1,
  onDragEnd,
}: MarkerProps) {
  // open info window on click
  const [open, setOpen] = useState(false);

  // update accuracy circle on location or radius change (on drag)
  const [radius, setRadius] = useState(accuracy);

  // update location after user finishes dragging marker
  const handleDragEnd = (e: google.maps.MapMouseEvent) => {
    if (onDragEnd && e.latLng) {
      onDragEnd({
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      });

      // super accurate now, user set location manually
      setRadius(DRAGGED_ACCURACY);
    }
  };

  return (
    <>
      <AdvancedMarker
        draggable={draggable}
        position={location}
        style={{ opacity: opacity }}
        zIndex={zIndex}
        onClick={() => setOpen(true)}
        onDragEnd={handleDragEnd}
      >
        <Pin background={colour} borderColor={"#000"} glyphColor={"#000"} />
      </AdvancedMarker>

      <AccuracyCircle accuracy={radius} location={location} />

      {open && title.length > 0 && (
        <InfoWindow position={location} onCloseClick={() => setOpen(false)}>
          <div className="text-black">{title}</div>
        </InfoWindow>
      )}
    </>
  );
}
