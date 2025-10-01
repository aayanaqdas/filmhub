const axios = require("axios");
const NodeCache = require("node-cache");

const cache = new NodeCache({ stdTTL: 600 });
const apiKey = process.env.TMDB_API_KEY;
const tmdbBaseUrl = "https://api.themoviedb.org/3";

exports.handler = async (event, context) => {
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, body: JSON.stringify({ message: "Method not allowed" }) };
  }

  try {
    // Path should be /api/details/tv/{id}/season/{seasonNumber}
    const pathParts = event.path.split("/");
    const id = pathParts[4]; // tv show id
    const seasonNumber = pathParts[6]; // season number
    const region = event.queryStringParameters?.region || "US";

    if (!id || !seasonNumber) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "ID and season number are required" }),
      };
    }

    const cacheKey = `season_${id}_${seasonNumber}_${region}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return { statusCode: 200, body: JSON.stringify(cachedData) };
    }

    const appendToResponse = "images,aggregate_credits,videos,watch/providers";
    const url = `${tmdbBaseUrl}/tv/${id}/season/${seasonNumber}?api_key=${apiKey}&append_to_response=${appendToResponse}&region=${region}`;

    const response = await axios.get(url);
    const data = { data: response.data };
    cache.set(cacheKey, data);
    return { statusCode: 200, body: JSON.stringify(data) };
  } catch (err) {
    console.error("Error:", err.response?.data || err.message);
    const status = err.response?.status || 500;
    const message = err.response?.data?.status_message || "Error fetching season details";
    return { statusCode: status, body: JSON.stringify({ message }) };
  }
};
