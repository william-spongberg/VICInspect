"use client";

import { Button, Card, CardBody, CardHeader } from "@heroui/react";
import { useRouter } from "next/navigation";
import {
  FaMapMarkerAlt,
  FaUserShield,
  FaClock,
  FaExclamationTriangle,
  FaChartBar,
} from "react-icons/fa";
import { SiLeaflet } from "react-icons/si";
import { useEffect, useState } from "react";
import Image from "next/image";

import { title, subtitle } from "@/components/primitives";
import { useAuth } from "@/context/auth-context";
import {
  getEdgeReportCountToday,
  getEdgeReportCountTotal,
  getDangerLevel,
} from "@/supabase/reports";

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const [todayReports, setTodayReports] = useState<number>(0);
  const [totalReports, setTotalReports] = useState<number>(0);
  const [dangerLevel, setDangerLevel] = useState<string>("Loading...");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchReportStats = async () => {
      setIsLoading(true);
      try {
        const todayCount = await getEdgeReportCountToday();
        const totalCount = await getEdgeReportCountTotal();

        setTodayReports(todayCount);
        setTotalReports(totalCount);
        setDangerLevel(getDangerLevel(todayCount));
      } catch (error) {
        console.error("Error fetching report stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportStats();
  }, []);

  function getDangerLevelColor(level: string): string {
    switch (level) {
      case "Low":
        return "text-green-500";
      case "Medium":
        return "text-yellow-500";
      case "High":
        return "text-orange-500";
      case "Very High":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  }

  return (
    <div className="flex flex-col items-center">
      <section className="w-full bg-gradient-to-b from-blue-800/20 to-purple-800/20 dark:from-blue-900/20 dark:to-purple-900/20 py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <Image
              alt="Logo"
              className="rounded-full"
              height={120}
              src="/icon.png"
              width={120}
            />
          </div>
          <h1 className={title({ color: "blue", size: "lg" })}>TransitEye</h1>
          <p className={`${subtitle()} max-w-3xl mx-auto mt-6 mb-10 text-lg`}>
            Real-time tracking and reporting of Public Transport Victoria
            inspectors to help commuters avoid unwanted encounters and unfair
            treatment.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <Button
              className="font-medium px-8"
              color="primary"
              size="lg"
              startContent={<FaMapMarkerAlt />}
              variant="shadow"
              onPress={() => router.push("/map")}
            >
              Open Live Map
            </Button>
            {!user && (
              <Button
                className="font-medium px-8"
                color="success"
                size="lg"
                startContent={<FaUserShield />}
                variant="ghost"
                onPress={() => router.push("/signin")}
              >
                Sign In to Report
              </Button>
            )}
          </div>
        </div>
      </section>

      <section className="w-full py-10 px-4 bg-gradient-to-r from-default-50/50 to-default-100/50 dark:from-default-50/5 dark:to-default-100/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white/80 dark:bg-default/50">
              <CardBody className="flex flex-col items-center text-center py-6">
                <FaChartBar className="text-blue-500 text-3xl mb-3" />
                <h3 className="text-lg font-bold">Reports Today</h3>
                {isLoading ? (
                  <div className="animate-pulse bg-default-200 h-8 w-16 rounded-lg mt-2" />
                ) : (
                  <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                    {todayReports}
                  </p>
                )}
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  In the last 24 hours
                </p>
              </CardBody>
            </Card>

            <Card className="bg-white/80 dark:bg-default/50">
              <CardBody className="flex flex-col items-center text-center py-6">
                <FaExclamationTriangle
                  className="text-3xl mb-3"
                  style={{
                    color: isLoading
                      ? "#888"
                      : getDangerLevelColor(dangerLevel),
                  }}
                />
                <h3 className="text-lg font-bold">Inspector Activity</h3>
                {isLoading ? (
                  <div className="animate-pulse bg-default-200 h-8 w-24 rounded-lg mt-2" />
                ) : (
                  <p
                    className={`text-4xl font-bold ${getDangerLevelColor(dangerLevel)}`}
                  >
                    {dangerLevel}
                  </p>
                )}
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Based on recent activity
                </p>
              </CardBody>
            </Card>

            <Card className="bg-white/80 dark:bg-default/50">
              <CardBody className="flex flex-col items-center text-center py-6">
                <FaMapMarkerAlt className="text-purple-500 text-3xl mb-3" />
                <h3 className="text-lg font-bold">Total Reports</h3>
                {isLoading ? (
                  <div className="animate-pulse bg-default-200 h-8 w-16 rounded-lg mt-2" />
                ) : (
                  <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                    {totalReports}
                  </p>
                )}
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Since launch
                </p>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      <section className="w-full max-w-6xl mx-auto py-16 px-4">
        <h2 className={title({ color: "yellow", size: "md" })}>Key Features</h2>
        <p className={subtitle()}>
          Help the community stay informed and travel safely
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          <Card className="border-2 border-blue-400 dark:border-blue-600">
            <CardHeader className="flex gap-3 bg-blue-100 dark:bg-blue-900/30">
              <SiLeaflet className="text-blue-600 dark:text-blue-400 text-xl" />
              <h4 className="font-semibold text-blue-700 dark:text-blue-300">
                Interactive Map
              </h4>
            </CardHeader>
            <CardBody>
              <p>
                View real-time inspector locations with our interactive map
                powered by Leaflet and OpenStreetMap.
              </p>
            </CardBody>
          </Card>

          <Card className="border-2 border-green-400 dark:border-green-600">
            <CardHeader className="flex gap-3 bg-green-100 dark:bg-green-900/30">
              <FaClock className="text-green-600 dark:text-green-400 text-xl" />
              <h4 className="font-semibold text-green-700 dark:text-green-300">
                Real-Time Updates
              </h4>
            </CardHeader>
            <CardBody>
              <p>
                Get immediate updates on inspector locations reported by our
                community of users.
              </p>
            </CardBody>
          </Card>

          <Card className="border-2 border-purple-400 dark:border-purple-600">
            <CardHeader className="flex gap-3 bg-purple-100 dark:bg-purple-900/30">
              <FaUserShield className="text-purple-600 dark:text-purple-400 text-xl" />
              <h4 className="font-semibold text-purple-700 dark:text-purple-300">
                Community Driven
              </h4>
            </CardHeader>
            <CardBody>
              <p>
                Free and open-source project on Github, allowing anyone to
                contribute and improve the platform.
              </p>
            </CardBody>
          </Card>
        </div>
      </section>

      <section className="w-full bg-default-50 dark:bg-default-100/5 py-16">
        <div className="max-w-5xl mx-auto px-4 flex flex-col lg:flex-row items-center gap-10">
          <div className="lg:w-1/2 order-2 lg:order-1">
            <h2 className={title({ color: "blue", size: "sm" })}>
              See Inspectors in Real-Time
            </h2>
            <p className={`${subtitle()} my-4`}>
              Our heatmap visualization shows you where inspectors have been
              reported recently, helping you plan your journey with confidence.
            </p>
            <Button
              className="mt-4"
              color="primary"
              size="lg"
              variant="shadow"
              onPress={() => router.push("/map")}
            >
              Open Map View
            </Button>
          </div>
          <div className="w-full order-1 lg:order-2 relative px-4">
            <div className="aspect-video relative bg-default-200 dark:bg-default-700 rounded-xl overflow-hidden w-full">
              {/* Heatmap Blots */}
              <div className="absolute inset-0">
                <div className="absolute top-10 left-20 w-10 h-10 rounded-full bg-red-400 opacity-60 blur-sm" />
                <div className="absolute bottom-12 right-16 w-16 h-16 rounded-full bg-orange-400 opacity-60 blur-xl" />
                <div className="absolute top-1/2 left-1/4 w-8 h-8 rounded-full bg-blue-400 opacity-60 blur-md" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <FaMapMarkerAlt className="text-primary/50" size={60} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full max-w-5xl mx-auto py-16 px-4">
        <h2 className={title({ color: "yellow", size: "sm" })}>
          About the Project
        </h2>
        <p className={subtitle()}>Built by the community, for the community</p>
        <div className="mt-6">
          <p className="mb-4">
            The TransitEye was created in response to growing concerns about how
            Public Transport Victoria inspectors interact with passengers. Our
            goal is to provide a transparent platform where commuters can report
            inspector locations and help others adjust their travel plans if
            needed.
          </p>
          <Button
            color="primary"
            variant="light"
            onPress={() => router.push("/about")}
          >
            Learn More About This Project
          </Button>
        </div>
      </section>

      <section className="w-full bg-gradient-to-r from-blue-800/20 to-red-800/20 dark:from-blue-900/20 dark:to-red-900/20 py-10">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h3 className={title({ color: "blue", size: "sm" })}>
            Join the Community
          </h3>
          <p className={`${subtitle()} mt-2 mb-6`}>
            Help make public transport better for everyone
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              className="w-full sm:w-auto"
              color="primary"
              size="lg"
              variant="shadow"
              onPress={() => router.push("/map")}
            >
              View the Map
            </Button>
            {!user && (
              <Button
                color="success"
                size="lg"
                variant="ghost"
                onPress={() => router.push("/signin")}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
