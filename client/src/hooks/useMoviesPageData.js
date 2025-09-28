import { useEffect, useState } from "react";
import { api } from "../services/api";

export const useMoviePageData = (mediaType) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const movies = await api.getMovies(mediaType);
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
  }, [mediaType]);

  return { data, loading, error };
};
