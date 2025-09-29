export default function GenreFilter({ filters, setFilters, genres }) {
  return (
    <div>
      <label className="block font-medium text-primary-2 mb-2">Genres</label>
      <div className="flex flex-wrap gap-2">
        {genres.map((genre) => {
          const isActive = filters.genres.includes(genre.id);
          return (
            <button
              key={genre.id}
              type="button"
              className={`px-3 py-1 border text-sm rounded-full cursor-pointer transition-all ${
                isActive
                  ? "bg-primary text-primary-2 border-primary"
                  : "border-primary-2/20 text-primary-2 hover:bg-primary-2/10"
              }`}
              onClick={() => {
                setFilters((prev) => {
                  const already = prev.genres.includes(genre.id);
                  return {
                    ...prev,
                    genres: already
                      ? prev.genres.filter((id) => id !== genre.id)
                      : [...prev.genres, genre.id],
                  };
                });
              }}
            >
              {genre.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
