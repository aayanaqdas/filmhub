import { useEffect, useState } from "react";
import { api } from "../services/api";

export const useDiscoverPageData = (mediaType, filters) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setLoading(true);
        const media = await api.getDiscoverMedia(mediaType, filters);
        setData(media.data.results);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (mediaType) {
      fetchMedia();
    }
  }, [mediaType, filters]);

  return { data, loading, error };
};
