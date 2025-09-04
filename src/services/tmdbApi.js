const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

// Get current date and 1 month ago for theatrical window
// const today = new Date().toISOString().split("T")[0];
// const threeMonthsAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

const apiCall = async (endpoint) => {
  try {
    // Check if endpoint already has query parameters
    const separator = endpoint.includes("?") ? "&" : "?";
    const response = await fetch(`${BASE_URL}${endpoint}${separator}api_key=${TMDB_API_KEY}`);
    if (!response.ok) throw new Error("Failed to fetch data");
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const tmdbApi = {
  // Home page data

  getTrendingMovies: () => apiCall(`/trending/movie/day`),
  getTrendingTV: () => apiCall(`/trending/tv/day`),
  //`/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&primary_release_date.gte=${threeMonthsAgo}&primary_release_date.lte=${today}&sort_by=popularity.desc&with_release_type=3`

  getTrending: () => apiCall("/trending/all/week"),
  getPopularMovies: () => apiCall("/movie/popular"),
  getTopRatedMovies: () => apiCall("/movie/top_rated"),
  getTopRatedTv: () => apiCall("/tv/top_rated"),
  getPopularPeople: () => apiCall("/person/popular"),

  // Movie/TV details and certifications
  getMediaImages: (mediaType, id) => apiCall(`/${mediaType}/${id}/images`),
  getMovieCertification: (id) => apiCall(`/movie/${id}/release_dates`),
  getTVCertification: (id) => apiCall(`/tv/${id}/content_ratings`),
  getMediaDetails: (mediaType, id) =>
    apiCall(
      `/${mediaType}/${id}?append_to_response=${
        mediaType === "person" ? "combined_credits" : "credits"
      }`
    ),

  getWatchProviders: (mediaType, id) => apiCall(`/${mediaType}/${id}/watch/providers`),

  // Search
  searchMulti: (query) => apiCall(`/search/multi?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`),

  // Discover
  discoverMovies: (params = "") => apiCall(`/discover/movie${params}`),
  discoverTV: (params = "") => apiCall(`/discover/tv${params}`),
};
