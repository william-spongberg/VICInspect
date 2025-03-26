"use client";

import { useState, useEffect } from "react";
import { Button, Card, CardFooter, addToast } from "@heroui/react";
import {
  FaExclamationCircle,
  FaSyncAlt,
  FaLocationArrow,
} from "react-icons/fa";

import {
  reportInspector,
  getRecentReports,
  InspectorReport,
} from "@/db/supabase";
import { DRAGGED_ACCURACY } from "@/components/marker";
import GoogleMap, { MAP_WIDTH } from "@/components/map";
import PushNotificationManager from "@/components/push";

const TOAST_TIMEOUT = 3000;
const LOCATION_TIMEOUT = 25000;
const MELBOURNE_CBD = {
  lat: -37.8136,
  lng: 144.9631,
};

export interface LocLatLngProps {
  locLatLng: google.maps.LatLngLiteral | null;
}

export interface LocationProps {
  location: GeolocationPosition | null;
}

export default function Home() {
  const [geoLocation, setGeoLocation] = useState<GeolocationPosition | null>(
    null,
  );
  const [locLatLng, setLocLatLng] =
    useState<google.maps.LatLngLiteral>(MELBOURNE_CBD);
  const [dragged, setDragged] = useState(false);
  const [inspectorReports, setInspectorReports] = useState<InspectorReport[]>(
    [],
  );

  //get user location and recent reports on load
  useEffect(() => {
    getUserLocation();
    fetchRecentReports();
  }, []);

  // grab recent reports within x hours
  async function fetchRecentReports() {
    const reports = await getRecentReports();

    setInspectorReports(reports);
  }

  // get user location from browser
  function getUserLocation() {
    let timeoutId: NodeJS.Timeout;

    if (navigator.geolocation) {
      // Set a timeout for location retrieval
      timeoutId = setTimeout(() => {
        console.log("Location timeout reached, using Melbourne CBD as default");
        addToast({
          title: "Location unavailable",
          description: "Using Melbourne CBD location",
          color: "warning",
          icon: <FaLocationArrow size={20} />,
          timeout: TOAST_TIMEOUT,
        });
      }, LOCATION_TIMEOUT);

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          // yay grabbed it, clear timeout
          clearTimeout(timeoutId);
          success(pos);
        },
        (e) => {
          // boo error, clear timeout
          clearTimeout(timeoutId);
          error(e);
        },
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      addToast({
        title: "Location error",
        description: "Using Melbourne CBD location",
        color: "warning",
        icon: <FaLocationArrow size={20} />,
        timeout: TOAST_TIMEOUT,
      });
    }

    // yay grabbed it, set locations
    function success(pos: GeolocationPosition) {
      console.log("yay grabbed location!");
      // if not first time, send toast
      if (geoLocation) {
        addToast({
          title: "Location found",
          color: "success",
          icon: <FaLocationArrow size={20} />,
          timeout: TOAST_TIMEOUT,
        });
      }
      setGeoLocation(pos);
      setLocLatLng({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      });
    }

    // report error if any
    function error(e: any) {
      console.error("Error in getting user location: ", e);
      addToast({
        title: "Location error",
        description: "Using Melbourne CBD location",
        color: "warning",
        icon: <FaLocationArrow size={20} />,
        timeout: TOAST_TIMEOUT,
      });
      setLocLatLng(MELBOURNE_CBD);
    }
  }

  // update location for new lat lng
  const handleLocationChange = (newLocation: google.maps.LatLngLiteral) => {
    setLocLatLng(newLocation);
    setDragged(true);
    console.log("Location updated to:", newLocation);
  };

  // use const since using async
  // report current location as an inspector
  const handleReportInspector = async () => {
    // if location not available, send error toast
    if (!locLatLng) {
      addToast({
        title: "Error",
        description: "Location not available yet",
        color: "warning",
        timeout: TOAST_TIMEOUT,
      });

      return;
    }

    // report inspector location - if dragged report 100m accuracy
    const success = await reportInspector(
      locLatLng,
      dragged ? DRAGGED_ACCURACY : geoLocation?.coords.accuracy,
      inspectorReports,
    );

    // if successfully, send toast and refresh reports
    if (success) {
      addToast({
        title: "Inspector reported",
        description: "Thank you for reporting!",
        color: "success",
        timeout: TOAST_TIMEOUT,
      });

      // refresh reports
      fetchRecentReports();
    } else {
      // if failed, send error toast
      addToast({
        title: "Error",
        description: "Failed to report inspector",
        color: "danger",
        timeout: TOAST_TIMEOUT,
      });
    }
  };

  return (
    <>
      <div className="flex justify-center h-full">
        <Card
          className={`max-w-[${MAP_WIDTH}px] w-full max-h-dvh mb-16 relative overflow-hidden`}
        >
          <GoogleMap
            inspectorReports={inspectorReports}
            locLatLng={locLatLng}
            location={geoLocation}
            onLocationChange={handleLocationChange}
          />
          <CardFooter className="flex justify-center gap-4 before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
            <Button
              isIconOnly
              aria-label="Refresh Reports"
              className="w-full sm:w-auto"
              color="secondary"
              onPress={fetchRecentReports}
            >
              <FaSyncAlt size={20} />
            </Button>
            <Button
              isIconOnly
              aria-label="Report Inspector"
              className="w-full sm:w-auto"
              color="danger"
              onPress={handleReportInspector}
            >
              <FaExclamationCircle size={25} />
            </Button>
            <Button
              isIconOnly
              aria-label="Get my location"
              className="w-full sm:w-auto"
              color="success"
              onPress={getUserLocation}
            >
              <FaLocationArrow size={20} />
            </Button>
          </CardFooter>
        </Card>
      </div>
      <PushNotificationManager />
    </>
  );
}
