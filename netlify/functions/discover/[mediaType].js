const axios = require("axios");
const NodeCache = require("node-cache");

const cache = new NodeCache({ stdTTL: 600 });
const apiKey = process.env.TMDB_API_KEY;
const tmdbBaseUrl = "https://api.themoviedb.org/3";

exports.handler = async (event, context) => {
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, body: JSON.stringify({ message: "Method not allowed" }) };
  }

  const mediaType = event.pathParameters.mediaType;
  const filters = event.queryStringParameters; // Parse other filters like genre, etc.
  const region = filters.region || "US";

  if (!mediaType) {
    return { statusCode: 400, body: JSON.stringify({ message: "Media type is required" }) };
  }

  try {
    let url = `${tmdbBaseUrl}/discover/${mediaType}?api_key=${apiKey}&region=${region}`;
    // Add filters (e.g., genre, year) from query params
    Object.keys(filters).forEach((key) => {
      if (key !== "mediaType" && key !== "region") {
        url += `&${key}=${filters[key]}`;
      }
    });

    const cacheKey = `discover_${mediaType}_${JSON.stringify(filters)}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return { statusCode: 200, body: JSON.stringify(cachedData) };
    }

    const response = await axios.get(url);
    cache.set(cacheKey, response.data);
    return { statusCode: 200, body: JSON.stringify(response.data) };
  } catch (err) {
    console.error("Error:", err.response?.data || err.message);
    const status = err.response?.status || 500;
    const message = err.response?.data?.status_message || "Error discovering media";
    return { statusCode: status, body: JSON.stringify({ message }) };
  }
};
