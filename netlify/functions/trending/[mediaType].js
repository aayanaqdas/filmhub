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
  const page = event.queryStringParameters.page || 1;
  const region = event.queryStringParameters.region || "US";

  if (!mediaType) {
    return { statusCode: 400, body: JSON.stringify({ message: "Media type is required" }) };
  }

  try {
    const cacheKey = `trending_${mediaType}_${page}_${region}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return { statusCode: 200, body: JSON.stringify(cachedData) };
    }

    const response = await axios.get(
      `${tmdbBaseUrl}/trending/${mediaType}/day?api_key=${apiKey}&page=${page}&region=${region}`
    );

    cache.set(cacheKey, response.data);
    return { statusCode: 200, body: JSON.stringify(response.data) };
  } catch (err) {
    console.error("Error:", err.response?.data || err.message);
    const status = err.response?.status || 500;
    const message = err.response?.data?.status_message || "Error fetching trending data";
    return { statusCode: status, body: JSON.stringify({ message }) };
  }
};
