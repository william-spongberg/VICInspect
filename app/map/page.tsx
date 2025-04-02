"use client";

import { useState, useEffect } from "react";
import {
  FaLocationArrow,
  FaSyncAlt,
  FaExclamationCircle,
} from "react-icons/fa";
import {
  addToast,
  Card,
  CardFooter,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Textarea,
} from "@heroui/react";
import { useRouter } from "next/navigation";

import { createReport, getReports, InspectorReport } from "@/supabase/reports";
import LeafletMapWrapper from "@/components/leaflet/map-wrapper";
import { useAuth } from "@/context/auth-context";

const MAX_DESCRIPTION_LENGTH = 100;
const TOAST_TIMEOUT = 3000;
const LOCATION_TIMEOUT = 25000;
const MELBOURNE_CBD = {
  lat: -37.8136,
  lng: 144.9631,
};

export default function InspectorMap() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [geoLocation, setGeoLocation] = useState<GeolocationPosition | null>(
    null
  );
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  }>(MELBOURNE_CBD);
  const [inspectorReports, setInspectorReports] = useState<InspectorReport[]>(
    []
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [description, setDescription] = useState("");
  const { user } = useAuth();
  const router = useRouter();

  // refresh once on load
  useEffect(() => {
    refresh();
  }, []);

  // grab recent reports within x hours
  async function refreshReports() {
    const reports = await getReports();

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
        }
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
      router.push("/signin");

      return;
    }

    setIsReporting(true);
    refreshReports();

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
        description: error.message,
        color: "danger",
        variant: "bordered",
        timeout: TOAST_TIMEOUT,
      });
      setIsReporting(false);
    };

    // report inspector location - if dragged report 100m accuracy
    const success = await createReport(
      user,
      userLocation,
      description.slice(0, MAX_DESCRIPTION_LENGTH),
      inspectorReports,
      errorCallback
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
      setDescription("");

      // refresh reports
      refreshReports();
    }
  };

  return (
    <>
      <div className="flex justify-center h-dvh w-full pt-0 pb-0">
        <Card
          isFooterBlurred
          className="max-w-dvw w-full max-h-screen rounded-none relative overflow-hidden"
        >
          <LeafletMapWrapper
            errorCallback={(error) =>
              addToast({
                title: "Error",
                description: error.message,
                color: "danger",
                variant: "bordered",
                timeout: TOAST_TIMEOUT,
              })
            }
            geoLocation={geoLocation}
            inspectorReports={inspectorReports}
            userId={user?.id ?? ""}
            userLocation={userLocation}
            onLocationChange={handleLocationChange}
          />
          <CardFooter className="flex flex-col gap-4 pt-0 overflow-hidden absolute bottom-5 left-1/2 transform -translate-x-1/2 before:rounded-xl rounded-large w-[calc(100%-8px)] md:w-auto z-10">
            <div className="flex flex-row gap-4 w-full">
              <Button
                aria-label="Refresh"
                className="w-full sm:w-auto text-xl"
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
                className="w-full sm:w-auto text-xl"
                color="danger"
                isLoading={isReporting}
                startContent={!isReporting && <FaExclamationCircle />}
                variant="ghost"
                onPress={onOpen}
              >
                Report
              </Button>
              <Modal
                backdrop="blur"
                isOpen={isOpen}
                onOpenChange={onOpenChange}
              >
                <ModalContent>
                  {(onClose) => (
                    <>
                      <ModalHeader className="flex flex-col gap-4 ">
                        Report Inspector Sighting
                      </ModalHeader>
                      <ModalBody>
                        {user ? (
                          <>
                            <p>
                              Please provide details about the inspector(s)
                              you&apos;ve spotted. This helps other commuters
                              stay informed.
                            </p>
                            <Textarea
                              isRequired
                              label="Description"
                              placeholder="(e.g. Number of inspectors, what tram or train, location details, where they were headed)"
                              rows={4}
                              value={description}
                              variant="bordered"
                              onChange={(e) => setDescription(e.target.value)}
                            />
                          </>
                        ) : (
                          <>
                            <p>
                              You need to be signed in to report inspector
                              sightings. Please sign in to continue.
                            </p>
                          </>
                        )}
                      </ModalBody>
                      <ModalFooter>
                        <Button
                          color="danger"
                          variant="light"
                          onPress={onClose}
                        >
                          Cancel
                        </Button>
                        {user ? (
                          <Button
                            color="primary"
                            isDisabled={!description.trim()}
                            isLoading={isReporting}
                            onPress={() => {
                              onClose();
                              handleReportInspector();
                            }}
                          >
                            Report Inspector
                          </Button>
                        ) : (
                          <Button
                            color="primary"
                            onPress={() => router.push("/signin")}
                          >
                            Sign In
                          </Button>
                        )}
                      </ModalFooter>
                    </>
                  )}
                </ModalContent>
              </Modal>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
