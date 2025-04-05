const express = require("express");
const path = require("path"); //needed when setting up static/file paths
const dotenv = require("dotenv");
const pug = require("pug");
const requestIp = require("request-ip");
const ip3country = require("ip3country");

//load the environment variables from .env
if (process.env.ENV === "dev") {
  dotenv.config();
}

const eventAPIs = require("./modules/event/apis");

//set up the Express app
const app = express();
const port = process.env.PORT || "8888";

//set up application template engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

//set up folder for static files
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestIp.mw());
ip3country.init();

app.get("/", async (req, res) => {
  const country = ip3country.lookupStr(req.clientIp) ?? "CA";
  const events = await eventAPIs.getEventsByCountry(country);

  res.render("index", {
    googleMapsAPIKey: process.env.GOOGLE_MAPS_API_KEY,
    events: events,
  });
});

app.get("/search", async (req, res) => {
  const lat = req.query.lat;
  const lng = req.query.lng;
  const events = await eventAPIs.getEventsByLocation(lat, lng);

  res.render("search", {
    googleMapsAPIKey: process.env.GOOGLE_MAPS_API_KEY,
    events: events,
  });
});

app.get("/event/:id", async (req, res) => {
  const id = req.params.id;
  const event = await eventAPIs.getEventById(id);

  res.render("detail", {
    googleMapsAPIKey: process.env.GOOGLE_MAPS_API_KEY,
    event: event,
  });
});

if (process.env.ENV === "dev") {
  //set up server listening
  app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
  });
} else {
  module.exports = {
    app,
  };
}
