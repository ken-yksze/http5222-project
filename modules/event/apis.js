const geohash = require("ngeohash");

async function getEventsByCountry(country) {
  const events = await fetch(
    `https://app.ticketmaster.com/discovery/v2/events?apikey=${process.env.TICKETMASTER_API_KEY}&countryCode=${country}&page=0&size=24&sort=date,asc`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then((res) => res.json())
    .then((data) => data._embedded.events)
    .catch(() => []);

  return events;
}

async function getEventsByLocation(lat, lng) {
  const geoPoint = geohash.encode(lat, lng);

  const events = await fetch(
    `https://app.ticketmaster.com/discovery/v2/events?apikey=${process.env.TICKETMASTER_API_KEY}&geoPoint=${geoPoint}&radius=10&unit=km&page=0&size=24&sort=distance,date,asc`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then((res) => res.json())
    .then((data) => data._embedded.events)
    .catch(() => []);

  return events;
}

async function getEventById(id) {
  const event = await fetch(
    `https://app.ticketmaster.com/discovery/v2/events/${id}?apikey=${process.env.TICKETMASTER_API_KEY}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then((res) => res.json())
    .catch(() => {});

  return event;
}

module.exports = {
  getEventsByCountry,
  getEventsByLocation,
  getEventById,
};
