import { useState } from "react";

export default function ImageCard({ image, onImageClick }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const baseImgUrl = "https://image.tmdb.org/t/p/w500";

  return (
    <div
      className="flex-shrink-0 w-80 bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-600/30 hover:border-primary-2/50 hover:shadow-lg hover:shadow-primary-2/10 transition-all duration-300 group cursor-pointer"
      onClick={() => onImageClick(image)}
    >
      {/* Image Container */}
      <div className="aspect-video bg-gray-700 relative overflow-hidden">
        <img
          src={`${baseImgUrl}${image.file_path}`}
          alt="Movie/TV Image"
          className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-300 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
        />

        {/* Loading placeholder */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-700 animate-pulse flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
            </svg>
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="w-12 h-12 bg-primary-2/90 backdrop-blur-sm rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
              />
            </svg>
          </div>
        </div>

        {/* Resolution Badge */}
        <div className="absolute bottom-3 right-3">
          <span className="px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-xs font-medium rounded-md border border-gray-600/50">
            {image.width} × {image.height}
          </span>
        </div>
      </div>

      {/* Image Info */}
      <div className="p-4">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span className="capitalize">{image.width > image.height ? "Backdrop" : "Poster"}</span>
          <span className="text-primary-2 font-medium">
            {((image.width * image.height) / 1000000).toFixed(1)}MP
          </span>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs text-gray-400">
              {image.vote_average ? `${image.vote_average.toFixed(1)}/10` : "Unrated"}
            </span>
          </div>
          <span className="text-xs text-gray-500">•</span>
          <span className="text-xs text-gray-400">
            {image.iso_639_1 ? image.iso_639_1.toUpperCase() : "No Text"}
          </span>
        </div>
      </div>
    </div>
  );
}
