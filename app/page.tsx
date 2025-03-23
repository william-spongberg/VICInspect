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
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Ptv Inspector Tracker</Typography>
        </Toolbar>
      </AppBar>
      <GoogleMap location={location} />
      <UserLocation location={location}/>
    </>
  );
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
          {location.coords.longitude}, Accuracy (km): {location.coords.accuracy/1000.0}
        </Typography>
      ) : (
        <Typography variant="body1">Retrieving location...</Typography>
      )}
    </div>
  );
}
