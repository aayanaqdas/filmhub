import { useEffect, useState, useRef } from "react";
import { api } from "../services/api";

export const useDiscoverPageData = (mediaType, filters, page) => {
  const [data, setData] = useState({ results: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    // Abort any previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create a new AbortController for the current request
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    const fetchMedia = async () => {
      try {
        setLoading(true);
        setError(null);
        const media = await api.getDiscoverMedia(mediaType, filters, signal, page);

        if (!signal.aborted) {
          if (page === 1) {
            setData(media.data); // Replace data for new discover
          } else {
            setData((prevData) => ({
              ...media.data,
              results: [...(prevData?.results || []), ...(media.data.results || [])],
            })); // Append results for pagination
          }
        }
      } catch (err) {
        if (!signal.aborted) {
          setError(err.message);
          setData({ results: [] });
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };

    if (mediaType && filters) {
      fetchMedia();
    }

    // Cleanup: abort on unmount or dependency change
    return () => {
      if (abortControllerRef.current && !abortControllerRef.current.signal.aborted) {
        abortControllerRef.current.abort();
      }
    };
  }, [mediaType, filters, page]);

  return { data, loading, error };
};
