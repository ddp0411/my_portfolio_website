"use client";

import { usePathname } from "next/navigation";
import { routes } from "@/resources";
import NotFound from "@/app/not-found";

interface RouteGuardProps {
  children: React.ReactNode;
}

const dynamicRoutes = ["/blog", "/work", "/projects"] as const;

function isRouteEnabled(pathname: string | null) {
  if (!pathname) return false;

  if (pathname in routes) {
    return routes[pathname as keyof typeof routes];
  }

  return dynamicRoutes.some((route) => pathname.startsWith(route) && routes[route]);
}

// The check runs during render, not in an effect, so the page's real content is in
// the server HTML. (Previously the server sent only a spinner, and crawlers that
// don't run JavaScript, including most AI crawlers, saw an empty page.)
const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const pathname = usePathname();

  if (!isRouteEnabled(pathname)) {
    return <NotFound />;
  }

  return <>{children}</>;
};

export { RouteGuard };
