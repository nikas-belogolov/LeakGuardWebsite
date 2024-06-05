import { createRequestHandler } from "@remix-run/express";
import compression from "compression";
import express from "express";
import morgan from "morgan";

import mongoose from "mongoose";

import session from "express-session";
import passport from './passport'
import cookieParser from "cookie-parser"
import crypto from "node:crypto"


const viteDevServer =
  process.env.NODE_ENV === "production"
    ? undefined
    : await import("vite").then((vite) =>
        vite.createServer({
          server: { middlewareMode: true },
        })
      );

const remixHandler = createRequestHandler({
  getLoadContext(req, res) {
    return {
      req,
      res,
      session: req.session,
      isAuthenticated: req.isAuthenticated,
      user: req.user,
      login: req.login,
      logout: req.logout,
      passport
    }
  },
  build: viteDevServer
    ? () => viteDevServer.ssrLoadModule("virtual:remix/server-build")
    : await import("../../build/server/index.js"),
});

const app = express();

// Setup session middleware
export const sessionMiddleware = session({
  secret: crypto.randomBytes(64).toString('hex'), // replace with your own secret
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true
  }
});

app.use(cookieParser());
app.use(sessionMiddleware)

// Passport.js
app.use(passport.initialize());
app.use(passport.session());

app.use(compression());

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable("x-powered-by");

// handle asset requests
if (viteDevServer) {
  app.use(viteDevServer.middlewares);
} else {
  // Vite fingerprints its assets so we can cache forever.
  app.use(
    "/assets",
    express.static("build/client/assets", { immutable: true, maxAge: "1y" })
  );
}

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static("build/client", { maxAge: "1h" }));

app.use(morgan("tiny"));

// handle SSR requests
app.all("*", remixHandler);

const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`Express server listening at http://localhost:${port}`)
);

mongoose.connect(process.env.DB_CONNECTION_STRING, { dbName: process.env.DB_NAME });
const db = mongoose.connection
db.once("open", () => console.info("Connected to MongoDb..."));
db.on("error", (error) => console.error(error));
