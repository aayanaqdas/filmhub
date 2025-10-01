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
    const region = event.queryStringParameters.region || "US";
    const filter = event.queryStringParameters.filter || "popular";
    const cacheKey = `latest_trailers_${filter}_${region}`;

    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return { statusCode: 200, body: JSON.stringify(cachedData) };
    }

    const streamingProviders = "8|9|337|384|350|531";
    let endpoint;
    if (filter === "popular") {
      endpoint = `${tmdbBaseUrl}/movie/popular?api_key=${apiKey}&region=${region}&page=1`;
    } else if (filter === "streaming") {
      endpoint = `${tmdbBaseUrl}/discover/movie?api_key=${apiKey}&sort_by=popularity.desc&with_watch_providers=${streamingProviders}&watch_region=${region}&page=1`;
    } else if (filter === "theatres") {
      endpoint = `${tmdbBaseUrl}/movie/now_playing?api_key=${apiKey}&region=${region}&page=1`;
    } else {
      endpoint = `${tmdbBaseUrl}/movie/popular?api_key=${apiKey}&region=${region}&page=1`;
    }

    const response = await axios.get(endpoint);
    const movies = response.data.results.slice(0, 10);

    const trailers = [];
    for (const movie of movies) {
      const videoRes = await axios.get(`${tmdbBaseUrl}/movie/${movie.id}/videos?api_key=${apiKey}`);
      const videoData = videoRes.data;
      const trailer = videoData.results.find(
        (v) => v.type.toLowerCase() === "trailer" && v.site === "YouTube"
      );
      if (trailer) {
        trailers.push({ ...trailer, movieTitle: movie.title });
      }
    }

    const data = { data: trailers };
    cache.set(cacheKey, data);
    return { statusCode: 200, body: JSON.stringify(data) };
  } catch (err) {
    console.error("Error:", err.response?.data || err.message);
    const status = err.response?.status || 500;
    const message = err.response?.data?.status_message || "Error fetching latest trailers";
    return { statusCode: status, body: JSON.stringify({ message }) };
  }
};
