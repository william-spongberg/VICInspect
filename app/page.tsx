"use client";
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import { useState, useEffect } from "react";

import { GoogleMap } from "./map";

export default function Home() {
  const [location, setLocation] = useState<GeolocationPosition | null>(null);
  const [locLatLng, setLocLatLng] = useState<google.maps.LatLngLiteral | null>(
    null
  );

  // get user location once
  useEffect(() => {
    getUserLocation();
  }, []);

  function getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      console.error("Geolocation is not supported by this browser.");
    }

    function success(pos: GeolocationPosition) {
      console.log("yay grabbed location!");
      setLocation(pos);
      setLocLatLng({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      });
    }

    function error(e: any) {
      console.error("Error in getting user location: ", e);
    }
  }

  function logUserLocation() {
    if (location) {
      console.log("User location:", locLatLng);
    } else {
      console.log("Location not available yet.");
    }
  }

  const handleLocationChange = (newLocation: google.maps.LatLngLiteral) => {
    if (location) {
      setLocLatLng(newLocation);
      console.log("Location updated to:", locLatLng);
    }
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
          location={location}
          locLatLng={locLatLng}
          onLocationChange={handleLocationChange}
        />
        <Button variant="contained" onClick={logUserLocation} sx={{ mt: 2 }}>
          Report Inspector At My Location
        </Button>
        <UserLocation location={location} />
      </Box>
    </>
  );
}

export interface LocLatLngProps {
  locLatLng: google.maps.LatLngLiteral | null;
}

export interface LocationProps {
  location: GeolocationPosition | null;
}

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
