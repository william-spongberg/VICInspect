"use client";

import { useState, useEffect } from "react";
import GoogleMap, { MAP_WIDTH } from "./map";
import {
  Button,
  Card,
  CardFooter,
  addToast,
} from "@heroui/react";
import {
  FaExclamationCircle,
  FaSyncAlt,
  FaLocationArrow,
} from "react-icons/fa";
import {
  reportInspector,
  getRecentReports,
  InspectorReport,
} from "../lib/supabase";

// get last x hours of reports
const RECENT_REPORTS_HOURS = 24;

export interface LocLatLngProps {
  locLatLng: google.maps.LatLngLiteral | null;
}

export interface LocationProps {
  location: GeolocationPosition | null;
}

export default function Home() {
  const [geoLocation, setGeoLocation] = useState<GeolocationPosition | null>(
    null
  );
  const [locLatLng, setLocLatLng] = useState<google.maps.LatLngLiteral | null>(
    null
  );
  const [dragged, setDragged] = useState(false);
  const [inspectorReports, setInspectorReports] = useState<InspectorReport[]>(
    []
  );

  // get user location once
  useEffect(() => {
    getUserLocation();
    fetchRecentReports();
  }, []);

  // grab recent reports within x hours
  async function fetchRecentReports() {
    const reports = await getRecentReports(RECENT_REPORTS_HOURS);
    setInspectorReports(reports);
  }

  // get user location from browser
  function getUserLocation() {
    setGeoLocation(null);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      console.error("Geolocation is not supported by this browser.");
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
      });
      return;
    }

    // report inspector location - if dragged report 100m accuracy
    const success = await reportInspector(
      locLatLng,
      dragged ? 100 : geoLocation?.coords.accuracy
    );

    // if successfully, send toast and refresh reports
    if (success) {
      addToast({
        title: "Inspector reported",
        description: "Thank you for reporting!",
        color: "success",
      });

      // refresh reports
      fetchRecentReports();
    } else {
      // if failed, send error toast
      addToast({
        title: "Error",
        description: "Failed to report inspector",
        color: "danger",
      });
    }
  };

  return (
    <div className="flex justify-center min-h-fit">
      <Card className={`max-w-[${MAP_WIDTH}px]`}>
        <GoogleMap
          location={geoLocation}
          locLatLng={locLatLng}
          inspectorReports={inspectorReports}
          onLocationChange={handleLocationChange}
        />
        <CardFooter className="flex justify-center gap-4 before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
          <Button
            color="secondary"
            onPress={fetchRecentReports}
            className="w-full sm:w-auto"
            aria-label="Refresh Reports"
          >
            <FaSyncAlt size={20} />
          </Button>
          <Button
            color="danger"
            onPress={handleReportInspector}
            className="w-full sm:w-auto"
            aria-label="Report Inspector"
          >
            <FaExclamationCircle size={20} />
          </Button>

          <Button
            color="success"
            onPress={getUserLocation}
            className="w-full sm:w-auto"
            aria-label="Get my location"
          >
            <FaLocationArrow size={20} />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
