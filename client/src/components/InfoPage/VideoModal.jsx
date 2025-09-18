import { useEffect } from "react";

export default function VideoModal({ closeVideoModal, videoObj }) {
  // Close modal on Escape key press and prevent body scroll
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        closeVideoModal();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [closeVideoModal]);

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeVideoModal();
    }
  };

  if (!videoObj) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-background/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-5xl mx-auto bg- rounded-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        {/* Header with title and close button */}
        <div className="flex items-center justify-between p-4 bg-gray-900">
          <h2 className="text-white text-lg md:text-xl font-semibold truncate pr-4">
            {videoObj.name || "Video"}
          </h2>
          <button
            onClick={closeVideoModal}
            className="flex-shrink-0 text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-700 cursor-pointer"
            aria-label="Close video modal"
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

        <div className="relative w-full bg-black" style={{ paddingBottom: "50%" }}>
          {videoObj.key ? (
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${videoObj.key}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
              title={videoObj.name || "Video player"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
              <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <p className="text-lg font-medium">Video not available</p>
              <p className="text-sm text-gray-500 mt-1">This video cannot be played</p>
            </div>
          )}
        </div>

        {videoObj.type && (
          <div className="px-4 py-2 bg-gray-900 text-sm text-gray-400">
            {videoObj.type} • {videoObj.site || "YouTube"}
          </div>
        )}
      </div>
    </div>
  );
}
