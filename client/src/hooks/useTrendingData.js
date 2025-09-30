// filepath: /Users/aqdas/Documents/aayan_projects/filmhub/client/src/hooks/useTrendingData.js
import { useEffect, useState } from "react";
import { api } from "../services/api";

export const useTrendingData = (timeWindow) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.getTrending(timeWindow);
        setData(response.data.results.filter((item) => item.media_type !== "person"));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [timeWindow]); // Only refetches on timeWindow change

  return { data, loading, error };
};
