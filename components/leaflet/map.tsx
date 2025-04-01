import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";

import ReportMarkers from "./report-markers";
import LeafletHeatMap from "./heatmap";
import LeafletAccuracyCircle, { DEFAULT_ACCURACY } from "./accuracy-circle";

import { InspectorReport } from "@/supabase/reports";

// user marker icon
export const markerIcon = L.icon({
  iconUrl: "icon.png",
  iconSize: [50, 50],
  iconAnchor: [25, 40],
  popupAnchor: [1, -34],
});

export const reportIcon = L.icon({
  iconUrl: "icon.png",
  iconSize: [50, 50],
  iconAnchor: [25, 35],
  popupAnchor: [1, -10],
  shadowSize: [41, 41],
});

// Map options
const TILE_LAYER = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const MAP_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const DEFAULT_ZOOM = 15;

export const MAX_ZOOM = 18;
export const MIN_ZOOM = 9;

export interface LeafletMapProps {
  geoLocation: GeolocationPosition | null;
  userLocation: { lat: number; lng: number };
  inspectorReports: InspectorReport[];
  userId: string;
  onLocationChange?: (newLocation: { lat: number; lng: number }) => void;
  errorCallback: (error: any) => void;
}

export default function LeafletMap({
  geoLocation,
  userLocation,
  inspectorReports,
  userId,
  onLocationChange,
  errorCallback,
}: LeafletMapProps) {
  const [accuracy, setAccuracy] = useState<number>(
    geoLocation?.coords.accuracy ?? DEFAULT_ACCURACY,
  );

  // set marker icon on load
  useEffect(() => {
    L.Marker.prototype.options.icon = markerIcon;
  }, []);

  // update location and accuracy on marker drag
  function handleMarkerDragEnd(e: L.DragEndEvent) {
    if (onLocationChange) {
      const marker = e.target;
      const position = marker.getLatLng();

      onLocationChange({ lat: position.lat, lng: position.lng });
      setAccuracy(DEFAULT_ACCURACY);
    }
  }

  // pan to location changes
  function MapController() {
    const map = useMap();

    useEffect(() => {
      if (userLocation && map) {
        map.panTo([userLocation.lat, userLocation.lng]);
      }
    }, [userLocation, map]);

    return null;
  }

  return (
    <div className="relative w-full h-full">
      <MapContainer
        attributionControl={true}
        center={[userLocation.lat, userLocation.lng]}
        className="w-full h-full z-[1]"
        dragging={true}
        maxZoom={MAX_ZOOM}
        minZoom={MIN_ZOOM}
        scrollWheelZoom={true}
        zoom={DEFAULT_ZOOM}
        zoomControl={false}
      >
        <TileLayer attribution={MAP_ATTRIBUTION} url={TILE_LAYER} />

        {/* User location marker */}
        <Marker
          draggable={true}
          eventHandlers={{
            dragend: handleMarkerDragEnd,
          }}
          icon={markerIcon}
          pane="markerPane"
          position={[userLocation.lat, userLocation.lng]}
        >
          <Popup>You</Popup>
        </Marker>

        {/* Location accuracy circle */}
        {geoLocation && (
          <LeafletAccuracyCircle
            accuracy={accuracy}
            location={[userLocation.lat, userLocation.lng]}
          />
        )}

        {/* Inspector location markers */}
        <ReportMarkers
          errorCallback={errorCallback}
          reports={inspectorReports}
          userId={userId}
        />

        {/* Inspector heatmap */}
        <LeafletHeatMap inspectorReports={inspectorReports} />

        {/* Map controller for panning */}
        <MapController />
      </MapContainer>
    </div>
  );
}
