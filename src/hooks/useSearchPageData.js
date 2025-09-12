import { useEffect, useState } from "react";
import { tmdbApi } from "../services/tmdbApi";

export const useSearchData = (query, page) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Reset data when query changes
  useEffect(() => {
    if (!query || query.trim().length === 0) {
      setData([]);
      setLoading(false);
      setError(null);
      return;
    }

    // Clear previous results when starting a new search
    if (page === 1) {
      setData([]);
    }
  }, [query]);

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
        const response = await tmdbApi.searchMulti(query, page);

        if (page === 1) {
          setData(response);
        } else {
          setData((prevData) => ({
            ...response,
            results: [...(prevData?.results || []), ...response.results],
          }));
        }
      } catch (err) {
        setError(err.message);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    searchData();
  }, [query, page]);

  return { data, loading, error };
};
