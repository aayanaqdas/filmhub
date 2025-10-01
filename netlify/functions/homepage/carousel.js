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
    const cacheKey = `carousel_${region}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return { statusCode: 200, body: JSON.stringify(cachedData) };
    }

    const [movies, tv] = await Promise.all([
      axios.get(`${tmdbBaseUrl}/trending/movie/day?api_key=${apiKey}&region=${region}`),
      axios.get(`${tmdbBaseUrl}/trending/tv/day?api_key=${apiKey}&region=${region}`),
    ]);

    const combinedMedia = [
      ...movies.data.results.map((item) => ({ ...item, media_type: "movie" })),
      ...tv.data.results.map((item) => ({ ...item, media_type: "tv" })),
    ].filter((item) => item.backdrop_path);

    const shuffled = combinedMedia.sort(() => 0.5 - Math.random());
    const mediaWithDetails = await Promise.all(
      shuffled.slice(0, 10).map(async (media) => {
        try {
          const appendToResponse = "images,release_dates,content_ratings,watch/providers";
          const detailsResponse = await axios.get(
            `${tmdbBaseUrl}/${media.media_type}/${media.id}?api_key=${apiKey}&append_to_response=${appendToResponse}&region=${region}`
          );
          return { ...detailsResponse.data, media_type: media.media_type };
        } catch (err) {
          console.log(`Error fetching details for media id ${media.id}:`, err);
          return { ...media, media_type: media.media_type };
        }
      })
    );

    cache.set(cacheKey, mediaWithDetails);
    const data = { data: mediaWithDetails };
    return { statusCode: 200, body: JSON.stringify(data) };
  } catch (err) {
    console.error("Error:", err.response?.data || err.message);
    const status = err.response?.status || 500;
    const message = err.response?.data?.status_message || "Error fetching carousel data";
    return { statusCode: status, body: JSON.stringify({ message }) };
  }
};
