const API_KEY = "bdecce71774dcdd158c44f4096aa85bd";

export default async function handler(req, res) {
  // default shanghai
  const { lon = 121.47, lat = 31.23 } = req.query;
  const data = await fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}`
  ).then((res) => res.json());

  res.status(200).json(data);
}
