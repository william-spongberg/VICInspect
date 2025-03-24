import { useState } from "react";
import { AdvancedMarker, Pin, InfoWindow } from "@vis.gl/react-google-maps";
import AccuracyCircle from "./accuracy";

export interface MarkerProps {
  title?: string;
  location: google.maps.LatLngLiteral;
  colour?: string;
  draggable?: boolean;
  accuracy?: number;
  zIndex?: number;
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
  onDragEnd,
}: MarkerProps) {
  // open info window on click
  const [open, setOpen] = useState(false);

  // update accuracy circle on location or radius change (on drag)
  const [loc, setLoc] = useState(location);
  const [radius, setRadius] = useState(accuracy);

  // update location after user finishes dragging marker
  const handleDragEnd = (e: google.maps.MapMouseEvent) => {
    if (onDragEnd && e.latLng) {
      onDragEnd({
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      });

      // super accurate now, user set location manually
      setRadius(50);
      setLoc({
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      });
    }
  };

  return (
    <>
      <AdvancedMarker
        position={location}
        onClick={() => setOpen(true)}
        draggable={draggable}
        onDragEnd={handleDragEnd}
        zIndex={zIndex}
      >
        <Pin background={colour} glyphColor={"#000"} borderColor={"#000"} />
      </AdvancedMarker>

      {accuracy > 0 &&
        <AccuracyCircle locLatLng={loc} accuracy={radius} />
      }

      {open && title.length > 0 && (
        <InfoWindow position={location} onCloseClick={() => setOpen(false)}>
          <div className="text-black">
            {title}
          </div>
        </InfoWindow>
      )}
    </>
  );
}
