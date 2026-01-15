import { registerApplication, start } from "single-spa";

// React Navbar
registerApplication({
  name: "@revature/navbar",
  app: () => System.import("@revature/navbar"),
  activeWhen: ["/"], //Active with any route!
});

// Angular Products
registerApplication({
  name: "@revature/products",
  app: () => System.import("@revature/products"),
  activeWhen: ["/products"],
});

start({
  urlRerouteOnly: true,
});
