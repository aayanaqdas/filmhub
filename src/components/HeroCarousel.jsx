import { useState, useEffect } from "react";
import arrowSvg from "../assets/arrow.svg";
import StarRating from "./StarRating";

export default function HeroCarousel() {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isAutoPlayActive, setIsAutoPlayActive] = useState(true);
  const [isSlideTransitioning, setIsSlideTransitioning] = useState(false);

  const SLIDE_CHANGE_INTERVAL = 4000;
  const TRANSITION_DURATION = 150;
  const AUTOPLAY_RESUME_DELAY = 10000;

  const heroData = [
    {
      id: 1,
      title: "John Wick Chapter 4",
      description:
        "With the price on his head ever increasing, John Wick uncovers a path to defeating The High Table. But before he can earn his freedom, Wick must face off against a new enemy.",
      backdrop: "https://image.tmdb.org/t/p/original/i3OTGmLNOZIo4SRQLVfLjeWegB6.jpg",
      poster: "https://image.tmdb.org/t/p/original/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg",
      rating: 4,
    },
    {
      id: 2,
      title: "Spider-Man: No Way Home",
      description:
        "With Spider-Man's identity now revealed, Peter asks Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds start to appear.",
      backdrop: "https://image.tmdb.org/t/p/original/iQFcwSGbZXMkeyKrxbPnwnRo5fl.jpg",
      poster: "https://image.tmdb.org/t/p/original/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
      rating: 5,
    },
    {
      id: 3,
      title: "The Batman",
      description:
        "When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption.",
      backdrop: "https://image.tmdb.org/t/p/original/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg",
      poster: "https://image.tmdb.org/t/p/original/74xTEgt7R36Fpooo50r9T25onhq.jpg",
      rating: 4,
    },
    {
      id: 4,
      title: "Top Gun: Maverick",
      description:
        "After thirty years, Maverick is still pushing the envelope as a top naval aviator, but must confront ghosts of his past when he leads TOP GUN's elite graduates.",
      backdrop: "https://image.tmdb.org/t/p/original/AaV1YIdWKnjAIAOe8UUKBFm327v.jpg",
      poster: "https://image.tmdb.org/t/p/original/62HCnUTziyWcpDaBO2i1DX17ljH.jpg",
      rating: 5,
    },
  ];

  // Auto-play functionality with smooth transitions
  useEffect(() => {
    if (!isAutoPlayActive) return;

    const interval = setInterval(() => {
      setIsSlideTransitioning(true);
      setTimeout(() => {
        setActiveSlideIndex((prev) => (prev === heroData.length - 1 ? 0 : prev + 1));
        setIsSlideTransitioning(false);
      }, TRANSITION_DURATION);
    }, SLIDE_CHANGE_INTERVAL);

    return () => clearInterval(interval);
  }, [isAutoPlayActive, heroData.length]);

  const handleSlideClick = (index) => {
    if (index === activeSlideIndex) return; // Don't transition if same slide

    setIsSlideTransitioning(true);
    setTimeout(() => {
      setActiveSlideIndex(index);
      setIsSlideTransitioning(false);
    }, TRANSITION_DURATION);

    setIsAutoPlayActive(false); // Pause auto-play when user manually selects

    // Resume auto-play after delay
    setTimeout(() => {
      setIsAutoPlayActive(true);
    }, AUTOPLAY_RESUME_DELAY);
  };

  const currentSlide = heroData[activeSlideIndex];

  const handleCarouselMouseEnter = () => {
    setIsAutoPlayActive(false);
  };

  const handleCarouselMouseLeave = () => {
    setIsAutoPlayActive(true);
  };

  return (
    <div
      className="hero-carousel"
      onMouseEnter={handleCarouselMouseEnter}
      onMouseLeave={handleCarouselMouseLeave}
    >
      <div
        className={`hero-carousel__backdrop ${
          isSlideTransitioning ? "hero-carousel__backdrop--transitioning" : ""
        }`}
        style={{ backgroundImage: `url(${currentSlide.backdrop})` }}
      ></div>
      <div className="hero-carousel__overlay" />

      <div className="hero-carousel__content">
        <div
          className={`hero-carousel__main-content ${
            isSlideTransitioning ? "hero-carousel__main-content--transitioning" : ""
          }`}
        >
          <h1 className="hero-carousel__title">{currentSlide.title}</h1>
          <p className="hero-carousel__description">{currentSlide.description}</p>
          <StarRating rating={currentSlide.rating} />
          <button className="hero-carousel__cta-button">
            More Info
            <span className="hero-carousel__button-icon">
              <img src={arrowSvg} alt="arrow" />
            </span>
          </button>
        </div>

        {/* Desktop carousel preview */}
        <div className="hero-carousel__preview-container">
          {heroData.map((item, index) => (
            <div
              key={item.id}
              className={`hero-carousel__preview-item ${
                index === activeSlideIndex ? "hero-carousel__preview-item--active" : ""
              }`}
              style={{ backgroundImage: `url(${item.poster})` }}
              onClick={() => handleSlideClick(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
