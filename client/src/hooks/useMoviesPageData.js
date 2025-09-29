import { useEffect, useState } from "react";
import { api } from "../services/api";

export const useMoviePageData = (mediaType, filters) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const movies = await api.getMovies(mediaType, filters);
        setData(movies.data.results);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (mediaType) {
      fetchMovies();
    }
  }, [mediaType, filters]);

  return { data, loading, error };
};
