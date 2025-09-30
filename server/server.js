require("dotenv").config();

const express = require("express");
const axios = require("axios");
const app = express();
const cors = require("cors");
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 600 }); // Cache for 10 minutes (600 seconds)

const clientHost = process.env.CLIENT_HOST;

const corsOptions = {
  origin: ["http://localhost:5173", clientHost],
};

const apiKey = process.env.TMDB_API_KEY;
const PORT = process.env.PORT || 8080;
const tmdbBaseUrl = "https://api.themoviedb.org/3";

app.use(cors(corsOptions));

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Homepage trending data
app.get("/api/homepage/carousel", async (req, res) => {
  try {
    const region = req.query.region || "US";
    const cacheKey = `carousel_${region}`;

    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return res.status(200).json(cachedData);
    }

    const [movies, tv] = await Promise.all([
      axios.get(`${tmdbBaseUrl}/trending/movie/day?api_key=${apiKey}&region=${region}`),
      axios.get(`${tmdbBaseUrl}/trending/tv/day?api_key=${apiKey}&region=${region}`),
    ]);

    // Combine and filter out items without backdrop
    const combinedMedia = [
      ...movies.data.results.map((item) => ({ ...item, media_type: "movie" })),
      ...tv.data.results.map((item) => ({ ...item, media_type: "tv" })),
    ].filter((item) => item.backdrop_path);

    // Shuffle the array to mix movies and TV shows
    const shuffled = combinedMedia.sort(() => 0.5 - Math.random());

    // Get media details for the selected items
    const mediaWithDetails = await Promise.all(
      shuffled.slice(0, 10).map(async (media) => {
        try {
          // Single API call with all data appended
          const appendToResponse = "images,release_dates,content_ratings,watch/providers";
          const detailsResponse = await axios.get(
            `${tmdbBaseUrl}/${media.media_type}/${media.id}?api_key=${apiKey}&append_to_response=${appendToResponse}&region=${region}`
          );

          return { ...detailsResponse.data, media_type: media.media_type };
        } catch (err) {
          console.log(`Error fetching details for media id ${media.id}:`, err);
          return {
            ...media,
            media_type: media.media_type,
          };
        }
      })
    );

    cache.set(cacheKey, mediaWithDetails);
    res.status(200).json(mediaWithDetails);
  } catch (err) {
    console.error("Error:", err.response?.data || err.message);
    res.status(500).json({ message: "Error fetching carousel data" });
  }
});

// Individual trending endpoints
app.get("/api/trending/:mediaType", async (req, res) => {
  const { mediaType } = req.params;
  const timeWindow = req.query.time_window || "week";
  const region = req.query.region || "US";
  const cacheKey = `trending_${mediaType}_${timeWindow}_${region}`;

  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return res.status(200).json(cachedData);
  }

  try {
    const response = await axios.get(
      `${tmdbBaseUrl}/trending/${mediaType}/${timeWindow}?api_key=${apiKey}&region=${region}`
    );
    const data = { data: response.data };
    cache.set(cacheKey, data);
    res.status(200).json(data);
  } catch (err) {
    console.error("Error:", err.response?.data || err.message);
    res.status(500).json({ message: "Error fetching trending data" });
  }
});

// Popular content (use discover for region support)
app.get("/api/popular/:mediaType", async (req, res) => {
  const { mediaType } = req.params;
  const region = req.query.region || "US";
  const cacheKey = `popular_${mediaType}_${region}`;

  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return res.status(200).json(cachedData);
  }

  try {
    const response = await axios.get(
      `${tmdbBaseUrl}/discover/${mediaType}?api_key=${apiKey}&sort_by=popularity.desc&region=${region}&include_adult=false`
    );
    const data = { data: response.data };
    cache.set(cacheKey, data);
    res.status(200).json(data);
  } catch (err) {
    console.error("Error:", err.response?.data || err.message);
    res.status(500).json({ message: "Error fetching popular data" });
  }
});

// Top rated content (use discover for region support)
app.get("/api/top-rated/:mediaType", async (req, res) => {
  const { mediaType } = req.params;
  const region = req.query.region || "US";
  const cacheKey = `top_rated_${mediaType}_${region}`;

  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return res.status(200).json(cachedData);
  }

  try {
    const response = await axios.get(
      `${tmdbBaseUrl}/discover/${mediaType}?api_key=${apiKey}&sort_by=vote_average.desc&vote_count.gte=200&region=${region}&include_adult=false`
    );
    const data = { data: response.data };
    cache.set(cacheKey, data);
    res.status(200).json(data);
  } catch (err) {
    console.error("Error:", err.response?.data || err.message);
    res.status(500).json({ message: "Error fetching top rated data" });
  }
});

// Now playing content (for theatres filter)
app.get("/api/now-playing/:mediaType", async (req, res) => {
  const { mediaType } = req.params;
  const region = req.query.region || "US";
  const cacheKey = `now_playing_${mediaType}_${region}`;

  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return res.status(200).json(cachedData);
  }

  try {
    const response = await axios.get(
      `${tmdbBaseUrl}/${mediaType}/now_playing?api_key=${apiKey}&region=${region}`
    );
    const data = { data: response.data };
    cache.set(cacheKey, data);
    res.status(200).json(data);
  } catch (err) {
    console.error("Error:", err.response?.data || err.message);
    res.status(500).json({ message: "Error fetching now playing data" });
  }
});

// Latest content (for trailers, sorted by release date)
app.get("/api/latest/:mediaType", async (req, res) => {
  const { mediaType } = req.params;
  const region = req.query.region || "US";
  // const cacheKey = `latest_${mediaType}_${region}`;

  // const cachedData = cache.get(cacheKey);
  // if (cachedData) {
  //   return res.status(200).json(cachedData);
  // }

  try {
    const response = await axios.get(
      `${tmdbBaseUrl}/discover/${mediaType}?api_key=${apiKey}&sort_by=primary_release_date.desc&page=1&region=${region}&include_adult=false`
    );
    const data = { data: response.data };
    //cache.set(cacheKey, data);
    res.status(200).json(data);
  } catch (err) {
    console.error("Error:", err.response?.data || err.message);
    res.status(500).json({ message: "Error fetching latest data" });
  }
});

// Media details
app.get("/api/details/:mediaType/:id", async (req, res) => {
  try {
    const { mediaType, id } = req.params;
    const region = req.query.region || "US";

    const appendToResponse =
      mediaType === "movie"
        ? "images,release_dates,credits,videos,similar,recommendations,watch/providers,reviews"
        : "images,content_ratings,credits,videos,similar,recommendations,watch/providers,reviews";

    const url = `${tmdbBaseUrl}/${mediaType}/${id}?api_key=${apiKey}&include_adult=false&append_to_response=${appendToResponse},${
      mediaType === "person" ? "combined_credits" : "credits"
    }&region=${region}`;

    const response = await axios.get(url);
    res.status(200).json({ data: response.data });
  } catch (err) {
    console.error("Error:", err.response?.data || err.message);
    const status = err.response?.status || 500;
    const message = err.response?.data?.status_message || "Error fetching media details";
    res.status(status).json({ message });
  }
});

app.get("/api/details/tv/:id/season/:seasonNumber", async (req, res) => {
  try {
    const { id, seasonNumber } = req.params;
    const region = req.query.region || "US"; // Use region from query

    const appendToResponse = "images,aggregate_credits,videos,watch/providers";

    const url = `${tmdbBaseUrl}/tv/${id}/season/${seasonNumber}?api_key=${apiKey}&append_to_response=${appendToResponse}&region=${region}`;

    const response = await axios.get(url);
    res.status(200).json({ data: response.data });
  } catch (err) {
    console.error("Error:", err.response?.data || err.message);
    res.status(500).json({ message: "Error fetching season details" });
  }
});

// Search
app.get("/api/search/:query", async (req, res) => {
  try {
    const { query } = req.params;
    const page = req.query.page || 1;
    const region = req.query.region || "US"; // Use region from query

    const response = await axios.get(
      `${tmdbBaseUrl}/search/multi?api_key=${apiKey}&query=${encodeURIComponent(
        query
      )}&page=${page}&region=${region}`
    );
    res.status(200).json({ data: response.data });
  } catch (err) {
    console.error("Error:", err.response?.data || err.message);
    res.status(500).json({ message: "Error fetching search results" });
  }
});

app.get("/api/discover/:mediaType", async (req, res) => {
  try {
    const { mediaType } = req.params;
    const query = new URLSearchParams(req.query).toString(); // Includes region from client
    const url = `${tmdbBaseUrl}/discover/${mediaType}?api_key=${apiKey}&${query}&include_adult=false`;
    const response = await axios.get(url);
    res.status(200).json({ data: response.data });
  } catch (err) {
    console.error("Error:", err.response?.data || err.message);
    res.status(500).json({ message: "Error fetching discover results" });
  }
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
