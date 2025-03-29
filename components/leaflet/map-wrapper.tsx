import dynamic from "next/dynamic";
import { Skeleton } from "@heroui/react";

// ensure client side rendering
const LeafletMapWrapper = dynamic(() => import("./map"), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full" />,
});

export default LeafletMapWrapper;
