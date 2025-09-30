import { useEffect, useState } from "react";
import { api } from "../services/api";

export const useSearchData = (query, filter, page) => {
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
        const response = await api.searchMulti(query, filter, page);

        if (page === 1) {
          setData(response.data); // Replace data for new search
        } else {
          setData((prevData) => ({
            ...response.data,
            results: [...(prevData?.results || []), ...response.data.results],
          })); // Append results for pagination
        }
      } catch (err) {
        setError(err.message);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    searchData();
  }, [query, filter, page]);

  return { data, loading, error };
};
