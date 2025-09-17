import { useEffect, useState } from "react";
import { api } from "../services/api";

export const useInfoPageData = (mediaType, id) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMediaDetails = async () => {
      try {
        setLoading(true);
        const mediaDetails = await api.getMediaDetails(mediaType, id);

        setData(mediaDetails.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (mediaType && id) {
      fetchMediaDetails();
    }
  }, [mediaType, id]);

  return { data, loading, error };
};
