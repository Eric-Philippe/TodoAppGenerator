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
    pathFilter?: string;
    pathRewrite?: { [key: string]: string };
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
    url: "/private",
    auth: false,
    creditCheck: false,
    proxy: {
      target: process.env.PRIVATE_API_URL || "http://localhost:5555",
      changeOrigin: true,
    },
  },
];

export { ROUTES, Route };
