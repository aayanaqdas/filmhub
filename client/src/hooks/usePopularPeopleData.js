// filepath: /Users/aqdas/Documents/aayan_projects/filmhub/client/src/hooks/usePopularPeopleData.js
import { useEffect, useState } from "react";
import { api } from "../services/api";

export const usePopularPeopleData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.getPopularPeople();
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
  }, []);

  return { data, loading, error };
};
