import SearchCard from "../CardSections/SearchCard";
import noImg from "../../assets/no_image.svg";
import MediaGalleryFilters from "./MediaGalleryFilters";
import ImageModal from "./ImageModal";
import { useState } from "react";

export default function CollectionPage({ data, loading, error }) {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  if (!data) {
    return (
      <div className="w-full h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-2"></div>
      </div>
    );
  }
  if (loading) {
    return (
      <div className="w-full h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-2"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-red-500 text-xl">Error: {error}</div>
        </div>
      </div>
    );
  }
  const openImageModal = (image) => {
    setSelectedImage(image);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setSelectedImage(null);
  };
  return (
    <div className="w-full">
      {/* Backdrop Section */}
      <div className="relative w-full h-72 md:h-[420px] overflow-hidden">
        <img
          src={`https://image.tmdb.org/t/p/original${data.backdrop_path}`}
          alt={`Backdrop for ${data.name}`}
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ objectPosition: "center 30%" }}
        />
        {/* Desktop Overlay: full dark overlay */}
        <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/40 z-10" />
        {/* Mobile Overlay: fade from left */}
        <div className="md:hidden absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent z-10" />
        {/* Desktop Content */}
        <div className="hidden md:flex absolute inset-0 z-20 items-center px-16 max-w-6xl mx-auto">
          {/* Poster */}
          <img
            src={data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : noImg}
            alt={data.name}
            className="w-48 rounded-lg shadow-xl mr-10 flex-shrink-0"
          />
          {/* Info */}
          <div className="flex flex-col justify-center">
            <h1 className="text-white text-4xl font-bold mb-2">{data.name}</h1>
            <h2 className="text-white text-xl mb-2">Overview</h2>
            <p className="text-primary-2 text-base max-w-2xl">{data.overview}</p>
            <div className="mt-4 text-white text-base">
              {data.parts && <div>Number of Movies: {data.parts.length}</div>}
            </div>
          </div>
        </div>
        {/* Mobile Content */}
        <div className="md:hidden absolute inset-0 z-20 flex items-end h-full px-4 pb-4">
          {/* Poster */}
          <div className="flex items-end w-full">
            <img
              src={data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : noImg}
              alt={data.name}
              className="w-24 rounded-lg shadow-xl mr-3 flex-shrink-0"
            />
            <div className="flex flex-col justify-end">
              <h1 className="text-white text-lg font-bold mb-1">{data.name}</h1>

              {data.parts && (
                <div className="text-white text-sm">Number of Movies: {data.parts.length}</div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Overview and details for mobile */}
      <div className="md:hidden px-6 pt-4 pb-2">
        <h2 className="text-white text-2xl md:text-3xl font-bold mb-4">Overview</h2>
        <p className="text-primary-2 text-sm">{data.overview}</p>
      </div>

      <div className="max-w-6xl mx-auto">
        <MediaGalleryFilters images={data.images} onImageClick={openImageModal} />

        <div className="flex flex-col p-6">
          <h1 className="text-white text-2xl md:text-3xl font-bold mb-4">Movies</h1>
          <div className="space-y-4">
            {data?.parts?.map((item) => (
              <SearchCard
                key={item.id}
                id={item.id}
                title={item.title}
                mediaType={item.media_type}
                posterPath={item.poster_path}
                voteAverage={item.vote_average}
                overview={item.overview}
                releaseDate={item.release_date}
              />
            ))}
          </div>
        </div>
      </div>
      {isImageModalOpen && selectedImage && (
        <ImageModal closeImageModal={closeImageModal} imageObj={selectedImage} />
      )}
    </div>
  );
}
