const axios = require("axios");
const NodeCache = require("node-cache");

const cache = new NodeCache({ stdTTL: 600 });
const apiKey = process.env.TMDB_API_KEY;
const tmdbBaseUrl = "https://api.themoviedb.org/3";

exports.handler = async (event, context) => {
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, body: JSON.stringify({ message: "Method not allowed" }) };
  }

  const id = event.pathParameters.id;

  if (!id) {
    return { statusCode: 400, body: JSON.stringify({ message: "ID is required" }) };
  }

  try {
    const appendToResponse = "images,combined_credits,external_ids";
    const cacheKey = `person_${id}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return { statusCode: 200, body: JSON.stringify(cachedData) };
    }

    const response = await axios.get(
      `${tmdbBaseUrl}/person/${id}?api_key=${apiKey}&append_to_response=${appendToResponse}`
    );

    cache.set(cacheKey, response.data);
    return { statusCode: 200, body: JSON.stringify(response.data) };
  } catch (err) {
    console.error("Error:", err.response?.data || err.message);
    const status = err.response?.status || 500;
    const message = err.response?.data?.status_message || "Error fetching person data";
    return { statusCode: status, body: JSON.stringify({ message }) };
  }
};
