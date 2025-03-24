"use client";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { useState, useEffect } from "react";
import GoogleMap from "./map";
import {
  reportInspector,
  getRecentReports,
  InspectorReport,
} from "../lib/supabase";

// get last x hours of reports
const RECENT_REPORTS_HOURS = 24;

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
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({
    open: false,
    message: "",
    severity: "info",
  });

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
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      console.error("Geolocation is not supported by this browser.");
    }

    // yay grabbed it, set locations
    function success(pos: GeolocationPosition) {
      console.log("yay grabbed location!");
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
      setNotification({
        open: true,
        message: "Location not available yet",
        severity: "error",
      });
      return;
    }

    // report inspector location - if dragged report 100m accuracy
    const success = await reportInspector(
      locLatLng,
      dragged? 100 : geoLocation?.coords.accuracy
    );

    // if successfully, send toast and refresh reports
    if (success) {
      setNotification({
        open: true,
        message: "Inspector reported successfully!",
        severity: "success",
      });

      // refresh reports
      fetchRecentReports();
    } else {
      // if failed, send error toast
      setNotification({
        open: true,
        message: "Failed to report inspector",
        severity: "error",
      });
    }
  };

  // close notification, set open to false
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ backgroundColor: "#000", color: "#fff" }}>
          <Typography variant="h6">Ptv Inspector Tracker</Typography>
        </Toolbar>
      </AppBar>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: "80vh" }}
      >
        <GoogleMap
          location={geoLocation}
          locLatLng={locLatLng}
          inspectorReports={inspectorReports}
          onLocationChange={handleLocationChange}
        />
        <Button
          variant="contained"
          onClick={handleReportInspector}
          sx={{ mt: 2 }}
          color="error"
        >
          Report Inspector Here
        </Button>

        <Button variant="outlined" onClick={fetchRecentReports} sx={{ mt: 1 }}>
          Refresh Reports
        </Button>
      </Box>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export interface LocLatLngProps {
  locLatLng: google.maps.LatLngLiteral | null;
}

export interface LocationProps {
  location: GeolocationPosition | null;
}

// testing, display user location and accuracy
function UserLocation({ location }: LocationProps) {
  return (
    <div className="location-info">
      {location ? (
        <Typography variant="body1">
          Latitude: {location.coords.latitude}, Longitude:{" "}
          {location.coords.longitude}, Accuracy (m): {location.coords.accuracy}
        </Typography>
      ) : (
        <Typography variant="body1">Retrieving location...</Typography>
      )}
    </div>
  );
}
