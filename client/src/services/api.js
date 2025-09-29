import axios from "axios";

const serverHost = import.meta.env.VITE_SERVER_HOST;
const baseUrl = `${serverHost}/api`;

const userRegion = localStorage.getItem("region") || "US";

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
  getSeasonDetails: (mediaType, id, seasonNumber) =>
    apiCall(`/details/${mediaType}/${id}/season/${seasonNumber}`),

  // Search
  searchMulti: (query, page = 1) => apiCall(`/search/${encodeURIComponent(query)}?page=${page}`),

  getDiscoverMedia: (mediaType, filters = {}) => {
    const params = new URLSearchParams();

    if (filters.sortBy) {
      params.append("sort_by", filters.sortBy);
    }
    if (filters.providers && filters.providers.length > 0) {
      params.append("watch_region", userRegion);
      params.append("with_watch_providers", filters.providers.join("|"));
    }
    if (filters.genres && filters.genres.length > 0) {
      params.append("with_genres", filters.genres.join("|"));
    }
    if (filters.dateFrom) {
      params.append("primary_release_date.gte", filters.dateFrom);
    }
    if (filters.dateTo) {
      params.append("primary_release_date.lte", filters.dateTo);
    }

    const query = params.toString() ? `?${params.toString()}` : "";
    console.log(query);
    return apiCall(`/discover/${mediaType}${query}`);
  },
};
