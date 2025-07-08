import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  // server: {
  //   proxy: {
  //     "/api": "http://localhost:8080",
  //   },
  // },
  // resolve: {
  //   alias: {
  //     // Provide empty modules for Node.js modules
  //     path: false,
  //     url: false,
  //     http: false,
  //     buffer: false,
  //     util: false,
  //     stream: false,
  //     querystring: false,
  //     events: false,
  //     crypto: false,
  //     fs: false,
  //     assert: false,
  //     zlib: false,
  //   },
  // },
  // optimizeDeps: {
  //   exclude: ["express", "methods", "parseurl", "serve-static"],
  // },


  // {
  //   "name": "DummyCorp",
  //   "email": "contact@dummycorp.com",
  //   "password": "dummyPass@456",
  //   "industry": "Software Development",
  //   "description": "DummyCorp is a leading software solutions provider specializing in AI and cloud computing.",
  //   "location": "New York, USA",
  //   "website": "https://dummycorp.com"
  // }
});
