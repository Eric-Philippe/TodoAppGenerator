interface Route {
  url: string;
  auth: boolean;
  creditCheck: boolean;
  rateLimit?: {
    windowMs: number;
    max: number;
  };
  proxy: {
    target: string;
    router?: { [key: string]: string };
    changeOrigin: boolean;
    pathFilter?: string | ((pathname: string, req: any) => boolean);
    pathRewrite?:
      | { [key: string]: string }
      | ((path: string, req: any) => string);
  };
}

const ROUTES: Route[] = [
  {
    url: "/public",
    auth: false,
    creditCheck: false,
    proxy: {
      target: process.env.PUBLIC_API_URL || "http://localhost:5050",
      changeOrigin: true,
    },
  },
  {
    url: "/public/api-docs",
    auth: false,
    creditCheck: false,
    proxy: {
      target:
        (process.env.PUBLIC_API_URL || "http://localhost:5050") + "/api-docs",
      changeOrigin: true,
    },
  },
  {
    url: "/private/api-docs",
    auth: false,
    creditCheck: false,
    proxy: {
      target:
        (process.env.PRIVATE_API_URL || "http://localhost:5555") +
        "/swagger/index.html",
      changeOrigin: true,
    },
  },
  {
    url: "/private",
    auth: false,
    creditCheck: false,
    proxy: {
      target: process.env.PRIVATE_API_URL || "http://localhost:5555",
      changeOrigin: true,
      pathFilter: (pathname: string) =>
        !pathname.startsWith("/private/api-docs"),
    },
  },
];

export { ROUTES, Route };
