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
  const mediaType = pathParts[3]; // e.g., "multi", "movie", "tv", "person"
  const query = decodeURIComponent(pathParts[4]); // URL decode the query
  const page = event.queryStringParameters?.page || 1;
  const region = event.queryStringParameters?.region || "US";

  if (!mediaType || !query) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Media type and query are required" }),
    };
  }

  try {
    const cacheKey = `search_${mediaType}_${query}_${page}_${region}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return { statusCode: 200, body: JSON.stringify(cachedData) };
    }

    const response = await axios.get(
      `${tmdbBaseUrl}/search/${mediaType}?api_key=${apiKey}&query=${encodeURIComponent(
        query
      )}&page=${page}&region=${region}`
    );

    const data = { data: response.data };
    cache.set(cacheKey, data);
    return { statusCode: 200, body: JSON.stringify(data) };
  } catch (err) {
    console.error("Error:", err.response?.data || err.message);
    const status = err.response?.status || 500;
    const message = err.response?.data?.status_message || "Error searching";
    return { statusCode: status, body: JSON.stringify({ message }) };
  }
};
