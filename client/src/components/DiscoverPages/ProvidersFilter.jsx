import RegionSelect from "../RegionSelect";

export default function WhereToWatchFilter({ filters, setFilters, providersForCountry }) {
  return (
    <div className="w-full mx-auto ">
      <label className="block font-medium text-primary-2 mb-2">Countries</label>
      <RegionSelect />
      <div className="flex flex-wrap gap-4 justify-center mt-5">
        {providersForCountry.map((provider) => {
          const isActive = filters.providers.includes(provider.provider_id);
          return (
            <img
              src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
              alt={provider.provider_name}
              key={provider.provider_id}
              className={`w-13 h-13 rounded-xl cursor-pointer border-2 transition-all ${
                isActive
                  ? "border-primary shadow-lg scale-105"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
              onClick={() => {
                setFilters((prev) => {
                  const already = prev.providers.includes(provider.provider_id);
                  return {
                    ...prev,
                    providers: already
                      ? prev.providers.filter((id) => id !== provider.provider_id)
                      : [...prev.providers, provider.provider_id],
                  };
                });
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
