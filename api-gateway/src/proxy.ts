import { createProxyMiddleware } from "http-proxy-middleware";
import type { Application } from "express";
import { Route } from "./routes";

const setupProxies = (app: Application, routes: Route[]) => {
  const sortedRoutes = [...routes].sort((a, b) => b.url.length - a.url.length);

  sortedRoutes.forEach((route) => {
    const proxyOptions = {
      ...route.proxy,
    };

    app.use(route.url, createProxyMiddleware(proxyOptions));
  });
};

export { setupProxies };
