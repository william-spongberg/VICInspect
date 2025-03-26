"use client";

import { Card, CardHeader, CardBody, Button } from "@heroui/react";
import { FaMap, FaLocationArrow, FaSubway, FaDatabase } from "react-icons/fa";
import { SiNextdotjs, SiHeroku, SiVercel, SiSupabase } from "react-icons/si";

import { title, subtitle } from "@/components/primitives";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl m-8">
      <h1 className={title({ size: "lg", color: "yellow" })}>
        PTV Inspector Tracker
      </h1>

      <p className={subtitle()}>
        Due to concerns about how PTV inspectors have been treating passengers,
        this website serves as a platform for reporting the precise locations of
        these inspectors at all times and allow users to readjust their trips
        accordingly.
      </p>

      <div className="my-6 p-4 bg-amber-100 dark:bg-amber-900/30 border-l-4 border-amber-500 rounded mb-16">
        <p className="text-amber-800 dark:text-amber-200">
          <strong>NOTE:</strong> Currently a work in progress! You can help out
          by sharing this website online or starring the project on GitHub.
        </p>
      </div>

      <div className="pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Card className="border-2 border-blue-400 dark:border-blue-600">
            <CardHeader className="flex gap-3 bg-blue-100 dark:bg-blue-900/30">
              <FaMap className="text-blue-600 dark:text-blue-400 text-xl" />
              <h4 className="font-semibold text-blue-700 dark:text-blue-300">
                Mapping
              </h4>
            </CardHeader>
            <CardBody>
              <p>
                Employs the Google Maps API for mapping; uses markers and
                heatmaps to display inspector locations.
              </p>
            </CardBody>
          </Card>

          <Card className="border-2 border-green-400 dark:border-green-600">
            <CardHeader className="flex gap-3 bg-green-100 dark:bg-green-900/30">
              <FaLocationArrow className="text-green-600 dark:text-green-400 text-xl" />
              <h4 className="font-semibold text-green-700 dark:text-green-300">
                Geolocation
              </h4>
            </CardHeader>
            <CardBody>
              <p>
                Utilises device geolocation to accurately pinpoint your
                location.
              </p>
            </CardBody>
          </Card>

          <Card className="border-2 border-purple-400 dark:border-purple-600">
            <CardHeader className="flex gap-3 bg-purple-100 dark:bg-purple-900/30">
              <FaSubway className="text-purple-600 dark:text-purple-400 text-xl" />
              <h4 className="font-semibold text-purple-700 dark:text-purple-300">
                PTV Integration [In Progress]
              </h4>
            </CardHeader>
            <CardBody>
              <p>
                Integrates the PTV API to monitor current tram and train
                locations, enabling the assignment of inspectors to these
                vehicles.
              </p>
            </CardBody>
          </Card>

          <Card className="border-2 border-amber-400 dark:border-amber-600">
            <CardHeader className="flex gap-3 bg-amber-100 dark:bg-amber-900/30">
              <FaDatabase className="text-amber-600 dark:text-amber-400 text-xl" />
              <h4 className="font-semibold text-amber-700 dark:text-amber-300">
                Data Storage
              </h4>
            </CardHeader>
            <CardBody>
              <p>
                Uses Supabase for the fast and secure storage of inspector
                location data.
              </p>
            </CardBody>
          </Card>
        </div>
      </div>

      <div className="pt-14 pb-8">
        <h3 className={title({ size: "sm", color: "foreground" })}>
          Tech Stack
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <a href="https://nextjs.org" rel="noreferrer" target="_blank">
            <Button
              className="border-2 border-cyan-400 dark:border-cyan-600 bg-cyan-100 dark:bg-cyan-900/30 flex gap-3 py-3 px-4"
              startContent={
                <SiNextdotjs className="text-cyan-600 dark:text-cyan-400 text-xl" />
              }
            >
              <h4 className="font-semibold text-cyan-700 dark:text-cyan-300">
                NextJS + React
              </h4>
            </Button>
          </a>

          <a href="https://www.heroui.com" rel="noreferrer" target="_blank">
            <Button
              className="border-2 border-indigo-400 dark:border-indigo-600 bg-indigo-100 dark:bg-indigo-900/30 flex gap-3 py-3 px-4"
              startContent={
                <SiHeroku className="text-indigo-600 dark:text-indigo-400 text-xl" />
              }
            >
              <h4 className="font-semibold text-indigo-700 dark:text-indigo-300">
                HeroUI Library
              </h4>
            </Button>
          </a>

          <a href="https://vercel.com" rel="noreferrer" target="_blank">
            <Button
              className="border-2 border-pink-400 dark:border-pink-600 bg-pink-100 dark:bg-pink-900/30 flex gap-3 py-3 px-4"
              startContent={
                <SiVercel className="text-pink-600 dark:text-pink-400 text-xl" />
              }
            >
              <h4 className="font-semibold text-pink-700 dark:text-pink-300">
                Vercel Deploy
              </h4>
            </Button>
          </a>

          <a href="https://supabase.com" rel="noreferrer" target="_blank">
            <Button
              className="border-2 border-emerald-400 dark:border-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 flex gap-3 py-3 px-4"
              startContent={
                <SiSupabase className="text-emerald-600 dark:text-emerald-400 text-xl" />
              }
            >
              <h4 className="font-semibold text-emerald-700 dark:text-emerald-300">
                Supabase DB
              </h4>
            </Button>
          </a>
        </div>
      </div>

      <div className="pt-16">
        <h2 className={title({ size: "sm", color: "cyan" })}>Roadmap</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          <Card className="border border-default-200">
            <CardHeader className="flex gap-3">
              <h4 className="font-semibold">Integrate PTV API</h4>
            </CardHeader>
            <CardBody>
              <p>
                Get current tram, train and bus locations and add the option to
                attach inspector reports to these vehicles
              </p>
            </CardBody>
          </Card>

          <Card className="border border-default-200">
            <CardHeader className="flex gap-3">
              <h4 className="font-semibold">Facebook Auth</h4>
            </CardHeader>
            <CardBody>
              <p>Add Facebook and Github authentication using Supabase</p>
            </CardBody>
          </Card>

          <Card className="border border-default-200">
            <CardHeader className="flex gap-3">
              <h4 className="font-semibold">Leaderboard System</h4>
            </CardHeader>
            <CardBody>
              <p>
                Create a leaderboard for most reports, most upvoted reports, etc
              </p>
            </CardBody>
          </Card>

          <Card className="border border-default-200">
            <CardHeader className="flex gap-3">
              <h4 className="font-semibold">Report Descriptions</h4>
            </CardHeader>
            <CardBody>
              <p>
                Add descriptions for reports or link to Facebook group posts,
                considering storage costs
              </p>
            </CardBody>
          </Card>

          <Card className="border border-default-200">
            <CardHeader className="flex gap-3">
              <h4 className="font-semibold">API Security</h4>
            </CardHeader>
            <CardBody>
              <p>
                Lock Google Maps API to custom domain and rate limit requests
              </p>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
