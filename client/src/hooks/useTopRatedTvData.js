// filepath: /Users/aqdas/Documents/aayan_projects/filmhub/client/src/hooks/useTopRatedTvData.js
import { useEffect, useState } from "react";
import { api } from "../services/api";

export const useTopRatedTvData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.getTopRatedTv();
        setData(response.data.results);
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || err.response?.data?.error || err.message;
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []); // No dependencies; fetches once

  return { data, loading, error };
};
