"use client";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { useState, useEffect } from "react";

import { GoogleMap } from "./map";

export default function Home() {
  const [location, setLocation] = useState<GeolocationPosition | null>(null);

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
    }

    function error(e: any) {
      console.error("Error in getting user location: ", e);
    }
  }

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Ptv Inspector Tracker</Typography>
        </Toolbar>
      </AppBar>
      <UserLocation location={location} />
      <GoogleMap location={location} />
    </div>
  );
}

export interface UserLocationProps {
  location: GeolocationPosition | null;
}

function UserLocation({ location }: UserLocationProps) {
  return (
    <div className="location-info">
      {location ? (
        <Typography variant="body1">
          Latitude: {location.coords.latitude}, Longitude:{" "}
          {location.coords.longitude}
        </Typography>
      ) : (
        <Typography variant="body1">Retrieving location...</Typography>
      )}
    </div>
  );
}
