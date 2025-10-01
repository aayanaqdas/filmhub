const axios = require("axios");

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
      mediaType === "movie"
        ? "images,release_dates,credits,videos,similar,recommendations,watch/providers,reviews"
        : "images,content_ratings,credits,videos,similar,recommendations,watch/providers,reviews";

    const url = `${tmdbBaseUrl}/${mediaType}/${id}?api_key=${apiKey}&include_adult=false&append_to_response=${appendToResponse},${
      mediaType === "person" ? "combined_credits" : "credits"
    }&region=${region}`;

    const response = await axios.get(url);
    return { statusCode: 200, body: JSON.stringify({ data: response.data }) };
  } catch (err) {
    console.error("Error:", err.response?.data || err.message);
    const status = err.response?.status || 500;
    const message = err.response?.data?.status_message || "Error fetching media details";
    return { statusCode: status, body: JSON.stringify({ message }) };
  }
};
