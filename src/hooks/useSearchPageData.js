import { useEffect, useState } from "react";
import { tmdbApi } from "../services/tmdbApi";

export const useSearchData = (query) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query || query.trim().length === 0) {
      setData([]);
      setLoading(false);
      setError(null);
      return;
    }

    const searchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await tmdbApi.searchMulti(query);
        setData(response || []);
      } catch (err) {
        setError(err.message);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(searchData, 1000);
    return () => clearTimeout(timeoutId);
  }, [query]);

  return { data, loading, error };
};