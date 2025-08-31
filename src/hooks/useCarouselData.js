import { useEffect, useState } from "react";
import { tmdbApi } from "../services/tmdbApi";

export const useCarouselData = () => {
  const [carouselItems, setCarouselItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const resultAmount = 5;

  useEffect(() => {
    const fetchCarouselData = async () => {
      try {
        setLoading(true);
        const newReleases = await tmdbApi.getNewReleases();
        
        // Get first movies and fetch their logos and certifications
        const moviesWithDetails = await Promise.all(
          newReleases.results.slice(0, resultAmount).map(async (movie) => {
            try {
              // Fetch logo and certification in parallel
              const [imagesData, certificationData] = await Promise.all([
                tmdbApi.getMovieImages(movie.id),
                tmdbApi.getMovieCertification(movie.id)
              ]);
              
              // Get English logo
              const englishLogos = imagesData.logos.filter((logo) => logo.iso_639_1 === "en");
              const logoPath = englishLogos.length > 0 ? englishLogos[0].file_path : null;
              
              // Get US certification
              const usRelease = certificationData.results.find((result) => result.iso_3166_1 === "US");
              let certification = "NR";
              
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
              
              return {
                ...movie,
                logoPath,
                certification
              };
            } catch (err) {
              console.log(`Error fetching details for movie ${movie.id}:`, err);
              return { 
                ...movie, 
                logoPath: null, 
                certification: 'NR' 
              };
            }
          })
        );
        
        setCarouselItems(moviesWithDetails);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCarouselData();
  }, []);

  return { carouselItems, loading, error };
};