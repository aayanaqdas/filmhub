const axios = require("axios");
const NodeCache = require("node-cache");

const cache = new NodeCache({ stdTTL: 600 });
const apiKey = process.env.TMDB_API_KEY;
const tmdbBaseUrl = "https://api.themoviedb.org/3";

exports.handler = async (event, context) => {
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, body: JSON.stringify({ message: "Method not allowed" }) };
  }

  const pathParts = event.path.split("/");
  const mediaType = pathParts[3]; // e.g., "movie", "tv", "person"
  const region = event.queryStringParameters?.region || "US";

  if (!mediaType) {
    return { statusCode: 400, body: JSON.stringify({ message: "Media type is required" }) };
  }

  try {
    const cacheKey = `popular_${mediaType}_${region}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return { statusCode: 200, body: JSON.stringify(cachedData) };
    }

    const response = await axios.get(
      `${tmdbBaseUrl}/discover/${mediaType}?api_key=${apiKey}&sort_by=popularity.desc&region=${region}&include_adult=false`
    );

    const data = { data: response.data };
    cache.set(cacheKey, data);
    return { statusCode: 200, body: JSON.stringify(data) };
  } catch (err) {
    console.error("Error:", err.response?.data || err.message);
    const status = err.response?.status || 500;
    const message = err.response?.data?.status_message || "Error fetching popular data";
    return { statusCode: status, body: JSON.stringify({ message }) };
  }
};
