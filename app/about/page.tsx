"use client";

import { Card, CardHeader, CardBody, Button } from "@heroui/react";
import { FaMap, FaLocationArrow, FaSubway, FaDatabase } from "react-icons/fa";
import { SiNextdotjs, SiHeroku, SiVercel, SiSupabase } from "react-icons/si";
import { useRouter } from "next/navigation";

import { title, subtitle } from "@/components/primitives";

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center">
      <section className="container pt-40 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className={title({ size: "md", color: "cyan" })}>Our Mission</h1>
          <p className={`${subtitle()} max-w-3xl mx-auto mt-6`}>
            Due to concerns about how Public Transport Victoria inspectors have
            been treating passengers, this website serves as a platform for
            reporting the precise locations of inspectors at all times and allow
            users to readjust their trips accordingly. It will forever remain a
            free, highly accessible and useful tool for all Melbourne commuters.
          </p>
          <div className="max-w-4xl items-center justify-center text-center my-10 p-4 bg-amber-100 dark:bg-amber-900/30 border-l-4 border-amber-500 rounded">
            <p className="text-amber-800 dark:text-amber-200 items-center justify-center text-center">
              <strong>NOTE:</strong> Currently a work in progress! You can help
              by sharing this website or starring the project on GitHub.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 max-w-4xl">
        <section className="w-full py-12">
          <h2 className={title({ size: "md", color: "blue" })}>Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <Card className="border-2 border-blue-400 dark:border-blue-600">
              <CardHeader className="flex gap-3 bg-blue-100 dark:bg-blue-900/30">
                <FaMap className="text-blue-600 dark:text-blue-400 text-xl" />
                <h4 className="font-semibold text-blue-700 dark:text-blue-300">
                  Mapping
                </h4>
              </CardHeader>
              <CardBody>
                <p>
                  Employs the Leaflet API and OpenStreetMap for mapping and uses
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
        </section>

        <section className="w-full py-16 my-10 -mx-6 px-6 rounded-xl">
          <h2 className={title({ size: "md", color: "blue" })}>Tech Stack</h2>
          <p className={subtitle()}>
            Built with modern web technologies for performance and scalability
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <a href="https://nextjs.org" rel="noreferrer" target="_blank">
              <Button
                className="border-2 border-cyan-400 dark:border-cyan-600 bg-cyan-100 dark:bg-cyan-900/30 flex gap-3 py-3 px-4 w-full justify-start"
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
                className="border-2 border-indigo-400 dark:border-indigo-600 bg-indigo-100 dark:bg-indigo-900/30 flex gap-3 py-3 px-4 w-full justify-start"
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
                className="border-2 border-pink-400 dark:border-pink-600 bg-pink-100 dark:bg-pink-900/30 flex gap-3 py-3 px-4 w-full justify-start"
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
                className="border-2 border-emerald-400 dark:border-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 flex gap-3 py-3 px-4 w-full justify-start"
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
        </section>

        <section className="w-full py-12">
          <h2 className={title({ size: "md", color: "blue" })}>Roadmap</h2>
          <p className={subtitle()}>
            Our development plan for future improvements
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-6">
            <Card className="border border-default-200 shadow-sm">
              <CardHeader className="flex gap-3 bg-blue-100/50 dark:bg-blue-900/20">
                <h4 className="font-semibold">Integrate PTV API</h4>
              </CardHeader>
              <CardBody>
                <p>
                  Get current tram, train and bus locations and add the option
                  to attach inspector reports to these vehicles
                </p>
              </CardBody>
            </Card>

            <Card className="border border-default-200 shadow-sm">
              <CardHeader className="flex gap-3 bg-green-100/50 dark:bg-green-900/20">
                <h4 className="font-semibold">Facebook Auth</h4>
              </CardHeader>
              <CardBody>
                <p>Add Facebook authentication using Supabase</p>
              </CardBody>
            </Card>

            <Card className="border border-default-200 shadow-sm">
              <CardHeader className="flex gap-3 bg-purple-100/50 dark:bg-purple-900/20">
                <h4 className="font-semibold">Leaderboard System</h4>
              </CardHeader>
              <CardBody>
                <p>
                  Create a leaderboard for most reports, most upvoted reports,
                  etc
                </p>
              </CardBody>
            </Card>

            <Card className="border border-default-200 shadow-sm">
              <CardHeader className="flex gap-3 bg-amber-100/50 dark:bg-amber-900/20">
                <h4 className="font-semibold">Report Descriptions</h4>
              </CardHeader>
              <CardBody>
                <p>
                  Add descriptions for reports or link to Facebook group posts -
                  need to consider storage costs
                </p>
              </CardBody>
            </Card>
          </div>
        </section>
      </div>

      <section className="w-screen py-10 mt-12">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h3 className={title({ color: "blue", size: "sm" })}>
            Interested in helping?
          </h3>
          <p className={`${subtitle()} mt-2 mb-6`}>
            Join the community effort to make public transport safer and more
            accountable
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <Button
              color="primary"
              size="lg"
              onPress={() => router.push("/map")}
            >
              View the Source on Github
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
