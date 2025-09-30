// filepath: /Users/aqdas/Documents/aayan_projects/filmhub/client/src/hooks/usePopularData.js
import { useEffect, useState } from "react";
import { api } from "../services/api";

// Define streaming provider IDs (adjust based on region; these are US examples)
const streamingProviders = [8, 9, 337, 384, 350, 531]; // Netflix, Prime, Disney+, HBO Max, Apple TV+, Paramount+

export const usePopularData = (filter) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let response;
        if (filter === "streaming") {
          // Fetch popular movies filtered by streaming providers
          response = await api.getDiscoverMedia("movie", {
            sortBy: "popularity.desc",
            providers: streamingProviders,
          });
        } else if (filter === "theatres") {
          response = await api.getNowPlaying("movie");
        }
        setData(response.data.results);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filter]);

  return { data, loading, error };
};
