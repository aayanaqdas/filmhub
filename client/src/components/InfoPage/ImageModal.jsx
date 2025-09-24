import { useEffect, useState } from "react";

export default function ImageModal({ closeImageModal, imageObj }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const baseImgUrl = "https://image.tmdb.org/t/p/original";

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        closeImageModal();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [closeImageModal]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeImageModal();
    }
  };

  if (!imageObj) {
    return null;
  }

  // Determine image type and set appropriate max heights
  const imageType =
    imageObj.imageType || (imageObj.width > imageObj.height ? "backdrop" : "poster");
  const isPortrait = imageObj.width < imageObj.height;

  return (
    <div
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-6xl mx-auto rounded-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gray-900 flex-shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-white text-lg md:text-xl font-semibold">
              {imageType === "logo" ? "Logo" : imageType === "poster" ? "Poster" : "Backdrop"} Image
            </h2>
            <span className="px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded-full">
              {imageObj.width} × {imageObj.height}
            </span>
          </div>
          <button
            onClick={closeImageModal}
            className="flex-shrink-0 text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-700 cursor-pointer"
            aria-label="Close image modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Image Container */}
        <div className="relative bg-black flex items-center justify-center flex-1 min-h-0">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-2"></div>
            </div>
          )}
          <img
            src={`${baseImgUrl}${imageObj.file_path}`}
            alt="Full size image"
            className={`transition-opacity duration-300 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            } ${
              isPortrait
                ? "max-h-full max-w-full object-contain" // For portrait images
                : "max-w-full max-h-full object-contain" // For landscape images
            }`}
            style={{
              maxHeight: isPortrait ? "calc(95vh - 140px)" : "calc(95vh - 140px)", // Account for header + footer
              maxWidth: "100%",
            }}
            onLoad={() => setImageLoaded(true)}
          />
        </div>

        {/* Footer with image info */}
        <div className="px-4 py-3 bg-gray-900 flex items-center justify-between text-sm text-gray-400 flex-shrink-0">
          <div className="flex items-center gap-4 flex-wrap">
            <span>
              Resolution: {imageObj.width} × {imageObj.height}
            </span>
            <span>•</span>
            <span>Aspect Ratio: {(imageObj.width / imageObj.height).toFixed(2)}:1</span>
            {imageObj.vote_average && (
              <>
                <span>•</span>
                <span>Rating: {imageObj.vote_average.toFixed(1)}/10</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span>{imageObj.iso_639_1 ? imageObj.iso_639_1.toUpperCase() : "No Text"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
