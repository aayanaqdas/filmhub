const axios = require("axios");
const NodeCache = require("node-cache");

const cache = new NodeCache({ stdTTL: 600 });
const apiKey = process.env.TMDB_API_KEY;
const tmdbBaseUrl = "https://api.themoviedb.org/3";

exports.handler = async (event, context) => {
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, body: JSON.stringify({ message: "Method not allowed" }) };
  }

  const mediaType = event.path.split("/")[3];
  const id = event.path.split("/")[4];
  const region = event.queryStringParameters.region || "US";

  if (!mediaType || !id) {
    return { statusCode: 400, body: JSON.stringify({ message: "Media type and ID are required" }) };
  }

  try {
    const appendToResponse =
      "images,videos,credits,reviews,recommendations,similar,release_dates,content_ratings,watch/providers,external_ids";
    const cacheKey = `details_${mediaType}_${id}_${region}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return { statusCode: 200, body: JSON.stringify(cachedData) };
    }

    const response = await axios.get(
      `${tmdbBaseUrl}/${mediaType}/${id}?api_key=${apiKey}&append_to_response=${appendToResponse}&region=${region}`
    );

    cache.set(cacheKey, response.data);
    return { statusCode: 200, body: JSON.stringify(response.data) };
  } catch (err) {
    console.error("Error:", err.response?.data || err.message);
    const status = err.response?.status || 500;
    const message = err.response?.data?.status_message || "Error fetching details";
    return { statusCode: status, body: JSON.stringify({ message }) };
  }
};
