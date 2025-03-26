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
} from "@/lib/supabase";
import { DRAGGED_ACCURACY } from "@/components/marker";
import GoogleMap, { MAP_WIDTH } from "@/components/map";
import PushNotificationManager from "@/components/push";

const TOAST_TIMEOUT = 3000;
const LOCATION_TIMEOUT = 25000;
const MELBOURNE_CBD = {
  lat: -37.8136,
  lng: 144.9631,
};

export default function Home() {
  const [geoLocation, setGeoLocation] = useState<GeolocationPosition | null>(
    null,
  );
  const [userLocation, setUserLocation] =
    useState<google.maps.LatLngLiteral>(MELBOURNE_CBD);
  const [dragged, setDragged] = useState(false);
  const [inspectorReports, setInspectorReports] = useState<InspectorReport[]>(
    [],
  );

  // refresh once on load
  useEffect(() => {
    refresh();
  }, []);

  // grab recent reports within x hours
  async function refreshReports() {
    const reports = await getRecentReports();

    setInspectorReports(reports);
  }

  // get user location from browser
  function refreshLocation() {
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
      setGeoLocation(pos);
      setUserLocation({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      });
    }

    // report error if any
    function error(e: any) {
      console.error("Error in getting user location: ", e);
      // toast error if first time getting location
      if (!geoLocation) {
        addToast({
          title: "Location error",
          description: "Using Melbourne CBD location",
          color: "warning",
          icon: <FaLocationArrow size={20} />,
          timeout: TOAST_TIMEOUT,
        });
      }
      setUserLocation(MELBOURNE_CBD);
    }
  }

  // refresh location and reports
  async function refresh() {
    await refreshReports();
    refreshLocation();
  }

  // update location for new lat lng
  const handleLocationChange = (newLocation: google.maps.LatLngLiteral) => {
    setUserLocation(newLocation);
    setDragged(true);
    console.log("Location updated to:", newLocation);
  };

  // use const since using async
  // report current location as an inspector
  const handleReportInspector = async () => {
    // if location not available, send error toast
    if (!userLocation) {
      addToast({
        title: "Error",
        description: "Location not available yet",
        color: "warning",
        timeout: TOAST_TIMEOUT,
      });

      return;
    }

    const errorCallback = (error: any) => {
      if (error.code === "42501") {
        addToast({
          title: "Error",
          description: "You need to be signed in to report inspectors",
          color: "warning",
          timeout: TOAST_TIMEOUT,
        });

        return;
      }

      addToast({
        title: "Error",
        description: "Failed to report inspector",
        color: "danger",
        timeout: TOAST_TIMEOUT,
      });
      console.error("Error reporting inspector:", error);
    };

    // report inspector location - if dragged report 100m accuracy
    const success = await reportInspector(
      errorCallback,
      userLocation,
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
      refreshReports();
    }
  };

  return (
    <>
      <div className="flex justify-center h-full">
        <Card
          isFooterBlurred
          className={`max-w-[${MAP_WIDTH}px] w-full max-h-dvh mb-8 relative overflow-hidden`}
        >
          <GoogleMap
            geoLocation={geoLocation}
            inspectorReports={inspectorReports}
            userLocation={userLocation}
            onLocationChange={handleLocationChange}
          />
          <CardFooter className="flex justify-center gap-4 overflow-hidden py-3 absolute bottom-1 left-1/2 transform -translate-x-1/2 before:rounded-xl rounded-large w-[calc(100%-8px)] lg:w-auto z-10">
            <Button
              aria-label="Refresh"
              className="w-full sm:w-auto text-lg"
              color="primary"
              startContent={<FaSyncAlt />}
              variant="flat"
              onPress={refresh}
            >
              Refresh
            </Button>
            <Button
              aria-label="Report Inspector"
              className="w-full sm:w-auto text-lg"
              color="danger"
              startContent={<FaExclamationCircle />}
              variant="bordered"
              onPress={handleReportInspector}
            >
              Report
            </Button>
          </CardFooter>
        </Card>
      </div>
      <PushNotificationManager />
    </>
  );
}
