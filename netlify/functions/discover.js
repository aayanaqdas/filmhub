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
  const mediaType = pathParts[3]; // e.g., "movie", "tv"
  const queryParams = event.queryStringParameters || {};

  if (!mediaType) {
    return { statusCode: 400, body: JSON.stringify({ message: "Media type is required" }) };
  }

  try {
    // Build the URL with all query parameters
    const params = new URLSearchParams();

    // Add API key and include_adult=false
    params.append("api_key", apiKey);
    params.append("include_adult", "false");

    // Add all query parameters from the request
    Object.keys(queryParams).forEach((key) => {
      params.append(key, queryParams[key]);
    });

    const url = `${tmdbBaseUrl}/discover/${mediaType}?${params.toString()}`;

    const cacheKey = `discover_${mediaType}_${JSON.stringify(queryParams)}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return { statusCode: 200, body: JSON.stringify(cachedData) };
    }

    const response = await axios.get(url);
    const data = { data: response.data };
    cache.set(cacheKey, data);
    return { statusCode: 200, body: JSON.stringify(data) };
  } catch (err) {
    console.error("Error:", err.response?.data || err.message);
    const status = err.response?.status || 500;
    const message = err.response?.data?.status_message || "Error discovering media";
    return { statusCode: status, body: JSON.stringify({ message }) };
  }
};
