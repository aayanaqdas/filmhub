export default function HeroSlide({ item, isActive }) {
  return (
    <div
      className="relative flex-shrink-0 h-full rounded-xl overflow-hidden mr-[1%]"
      style={{
        flex: "0 0 98%",
        backgroundImage: `url(${item.backdrop})`,
        backgroundPosition: "center top 30%",
        backgroundSize: "cover",
      }}
    >
      {/* Gradients */}
      <div
        className={`hidden md:block absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent transition-opacity duration-700 ${
          isActive ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        className={`hidden md:block absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-700 ${
          isActive ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        className={`md:hidden absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-opacity duration-700 ${
          isActive ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Desktop Layout*/}
      <div
        className={`hidden md:flex relative z-10 items-center h-full px-6 lg:px-16 transition-all duration-700 ${
          isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
        }`}
      >
        <div className="max-w-2xl text-white">
          {item.logo ? (
            <img
              src={item.logo}
              alt={item.title}
              className="h-16 md:h-20 lg:h-24 xl:h-32 mb-4 object-contain"
            />
          ) : (
            <h1 className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4">
              {item.title}
            </h1>
          )}

          <div className="flex items-center justify-center space-x-4 mb-4">
            <span className="bg-gray-800/80 px-2 py-1 rounded-xl text-sm font-medium">
              {item.ageRating}
            </span>
            <span className="text-gray-300 text-sm">
              {item.year} • {item.genre}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div
        className={`md:hidden relative z-10 flex flex-col justify-end items-center h-full pb-20 px-4 transition-all duration-700 ${
          isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="text-primary-2 text-center">
          {item.logo ? (
            <img src={item.logo} alt={item.title} className="h-20 object-contain mx-auto mb-4" />
          ) : (
            <h1 className="text-xl font-bold mb-4">{item.title}</h1>
          )}

          <div className="flex items-center justify-center space-x-2 mb-3 text-xs">
            <span className="bg-gray-800/80 px-1 py-1 rounded text-xs font-medium">
              {item.ageRating}
            </span>
            <span className="text-primary-2">{item.year}</span>
            <span className="text-primary-2">•</span>
            <span className="text-priamry-2 text-center">{item.genre}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
