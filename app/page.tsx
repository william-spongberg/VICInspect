"use client";

import { useState, useEffect } from "react";
import {
  FaLocationArrow,
  FaSyncAlt,
  FaExclamationCircle,
} from "react-icons/fa";
import { addToast, Card, CardFooter, Button } from "@heroui/react";

import {
  reportInspector,
  getRecentReports,
  InspectorReport,
} from "@/supabase/reports";
import LeafletMapWrapper from "@/components/leaflet/map-wrapper";
import { useAuth } from "@/context/auth-context";

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
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  }>(MELBOURNE_CBD);
  const [inspectorReports, setInspectorReports] = useState<InspectorReport[]>(
    [],
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const { user } = useAuth();

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
      // set a timeout for location retrieval
      timeoutId = setTimeout(() => {
        addToast({
          title: "Location timed out",
          description: "Using Melbourne CBD location",
          color: "warning",
          icon: <FaLocationArrow size={20} />,
          timeout: TOAST_TIMEOUT,
        });
        setUserLocation(MELBOURNE_CBD);
      }, LOCATION_TIMEOUT);

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          // yay grabbed it
          clearTimeout(timeoutId);
          success(pos);
        },
        (e) => {
          // boo error
          clearTimeout(timeoutId);
          error(e);
        },
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      addToast({
        title: "Location unavailable",
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
      addToast({
        title: "Location error",
        description: "Using Melbourne CBD location",
        color: "warning",
        icon: <FaLocationArrow size={20} />,
        timeout: TOAST_TIMEOUT,
      });
    }
  }

  // refresh location and reports
  async function refresh() {
    setIsRefreshing(true);
    await refreshReports();
    refreshLocation();
    setIsRefreshing(false);
  }

  // update location for new lat lng
  function handleLocationChange(newLocation: { lat: number; lng: number }) {
    setUserLocation(newLocation);
  }

  // use const since using async
  // report current location as an inspector
  const handleReportInspector = async () => {
    if (!user) {
      window.location.href = "/signin";

      return;
    }

    setIsReporting(true);

    // if location not available, send error toast
    if (!userLocation) {
      addToast({
        title: "Error",
        description: "Location not available yet",
        color: "warning",
        timeout: TOAST_TIMEOUT,
      });
      setIsReporting(false);

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
        setIsReporting(false);

        return;
      }

      addToast({
        title: "Error",
        description: "Failed to report inspector",
        color: "danger",
        variant: "bordered",
        timeout: TOAST_TIMEOUT,
      });
      setIsReporting(false);
      console.error("Error reporting inspector:", error);
    };

    // report inspector location - if dragged report 100m accuracy
    const success = await reportInspector(
      errorCallback,
      userLocation,
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
      setIsReporting(false);

      // refresh reports
      refreshReports();
    }
  };

  return (
    <>
      <div className="flex justify-center h-full">
        <Card
          isFooterBlurred
          className="max-w-[1000px] w-full max-h-dvh mb-8 relative overflow-hidden"
        >
          <LeafletMapWrapper
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
              isLoading={isRefreshing}
              startContent={!isRefreshing && <FaSyncAlt />}
              variant="light"
              onPress={refresh}
            >
              Refresh
            </Button>
            <Button
              aria-label="Report Inspector"
              className="w-full sm:w-auto text-lg"
              color="danger"
              isLoading={isReporting}
              startContent={!isReporting && <FaExclamationCircle />}
              variant="bordered"
              onPress={handleReportInspector}
            >
              Report
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
