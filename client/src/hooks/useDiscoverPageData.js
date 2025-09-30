import { useEffect, useState, useRef } from "react";
import { api } from "../services/api";

export const useDiscoverPageData = (mediaType, filters) => {
  const [data, setData] = useState(null);
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
        const media = await api.getDiscoverMedia(mediaType, filters, signal);
        if (!signal.aborted) {
          setData(media.data.results);
        }
      } catch (err) {
        if (!signal.aborted) {
          setError(err.message);
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
  }, [mediaType, filters]);

  return { data, loading, error };
};
