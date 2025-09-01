import { useEffect, useState } from "react";
import { tmdbApi } from "../services/tmdbApi";

export const useInfoPageData = (mediaType, id) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMediaDetails = async () => {
      try {
        setLoading(true);

        // Fetch media details and images in parallel
        const [mediaDetails, imagesData, certificationData] = await Promise.all([
          tmdbApi.getMediaDetails(mediaType, id),
          tmdbApi.getMediaImages(mediaType, id),

          mediaType === "movie"
            ? tmdbApi.getMovieCertification(id)
            : tmdbApi.getTVCertification(id),
        ]);

        // Get English logo
        const englishLogos = imagesData.logos.filter((logo) => logo.iso_639_1 === "en");
        const logoPath = englishLogos.length > 0 ? englishLogos[0].file_path : null;

        // Get certification based on media type
        let certification = "NR";

        if (mediaType === "movie") {
          // For movies: look into release_dates
          const usRelease = certificationData.results.find((result) => result.iso_3166_1 === "US");

          if (usRelease && usRelease.release_dates.length > 0) {
            certification = usRelease.release_dates[0].certification || "NR";
          } else {
            // Fallback to any other country with certification
            for (const result of certificationData.results) {
              if (result.release_dates.length > 0 && result.release_dates[0].certification) {
                certification = result.release_dates[0].certification;
                break;
              }
            }
          }
        } else {
          // For TV shows: look into results and rating
          const usRating = certificationData.results.find((result) => result.iso_3166_1 === "US");

          if (usRating && usRating.rating) {
            certification = usRating.rating;
          } else {
            // Fallback to any other country with rating
            for (const result of certificationData.results) {
              if (result.rating) {
                certification = result.rating;
                break;
              }
            }
          }
        }

        setData({
          ...mediaDetails,
          logoPath,
          certification,
        });
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
