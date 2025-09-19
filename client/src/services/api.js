import axios from "axios";

const serverHost = import.meta.env.VITE_SERVER_HOST;
const baseUrl = `${serverHost}/api`;

const userRegion = localStorage.getItem("region") || "US"

const apiCall = async (endpoint) => {
  try {
    const separator = endpoint.includes("?") ? "&" : "?";
    const response = await axios.get(`${baseUrl}${endpoint}${separator}region=${userRegion}`);
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const api = {
  getHomepageCarousel: () => apiCall("/homepage/carousel"),
  getTrending: (timeWindow) => apiCall(`/trending/all?time_window=${timeWindow}`),

  // Popular content
  getPopularPeople: () => apiCall(`/popular/person`),

  // Top rated
  getTopRatedTv: () => apiCall(`/top-rated/tv`),

  // Media details
  getMediaDetails: (mediaType, id) => apiCall(`/details/${mediaType}/${id}`),

  // Search
  searchMulti: (query, page = 1) => apiCall(`/search/${encodeURIComponent(query)}?page=${page}`),
};
