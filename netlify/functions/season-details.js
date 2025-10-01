const axios = require("axios");

const apiKey = process.env.TMDB_API_KEY;
const tmdbBaseUrl = "https://api.themoviedb.org/3";

exports.handler = async (event, context) => {
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, body: JSON.stringify({ message: "Method not allowed" }) };
  }

  try {
    const id = event.path.split("/")[4];
    const seasonNumber = event.path.split("/")[6];
    const region = event.queryStringParameters.region || "US";

    const appendToResponse = "images,aggregate_credits,videos,watch/providers";
    const url = `${tmdbBaseUrl}/tv/${id}/season/${seasonNumber}?api_key=${apiKey}&append_to_response=${appendToResponse}&region=${region}`;

    const response = await axios.get(url);
    return { statusCode: 200, body: JSON.stringify({ data: response.data }) };
  } catch (err) {
    console.error("Error:", err.response?.data || err.message);
    const status = err.response?.status || 500;
    const message = err.response?.data?.status_message || "Error fetching season details";
    return { statusCode: status, body: JSON.stringify({ message }) };
  }
};
