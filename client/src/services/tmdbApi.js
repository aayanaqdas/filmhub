import axios from "axios";

const baseUrl = "http://localhost:8080/api";

const apiCall = async (endpoint) => {
  try {
    const response = await axios.get(`${baseUrl}${endpoint}`);
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const tmdbApi = {
  getHomepageCarousel: () => apiCall("/homepage/carousel"),
  getTrending: (timeWindow = "week") => apiCall(`/trending/all?time_window=${timeWindow}`),

  // Popular content
  getPopularPeople: () => apiCall(`/popular/person`),

  // Top rated
  getTopRatedTv: () => apiCall(`/top-rated/tv`),

  // Media details
  getMediaDetails: (mediaType, id) => apiCall(`/details/${mediaType}/${id}`),

  // Search
  searchMulti: (query, page = 1) => apiCall(`/search/${encodeURIComponent(query)}?page=${page}`),
};
