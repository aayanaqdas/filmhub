import { useState } from "react";
import { createPortal } from "react-dom";
import { countries } from "../countries";

export default function RegionSelect() {
  const [isShown, setIsShown] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(
    JSON.parse(localStorage.getItem("region")) || "US"
  );
  const [searchQuery, setSearchQuery] = useState("");

  const currentCountry = countries.find((country) => country.iso_3166_1 === selectedRegion);

  const filteredCountries = countries.filter(
    (country) =>
      country.english_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.iso_3166_1.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const selectCountry = (countryCode) => {
    document.body.classList.remove("lock-scrollbar");
    setSelectedRegion(countryCode);
    localStorage.setItem("region", JSON.stringify(countryCode));
    setIsShown(false);
    setSearchQuery("");

    window.location.reload();
  };

  const openModal = () => {
    setIsShown(true);
    document.body.classList.add("lock-scrollbar");
  };
  const closeModal = () => {
    document.body.classList.remove("lock-scrollbar");
    setIsShown(false);
    setSearchQuery("");
  };

  const selectRegionModal = () => {
    if (!isShown) return null;

    return createPortal(
      <div className="fixed inset-0 bg-background/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900 w-full rounded-lg max-w-lg max-h-[80vh]">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-white text-xl font-semibold">Select Region</h2>
                <p className="text-gray-400 text-sm mt-1">Shows content available in your region</p>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
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

            {/* Current Selection */}
            <div className="w-full flex items-center gap-3 p-3 rounded-lg bg-gray-800/50 mb-4">
              <span className="text-lg">{currentCountry.flag}</span>
              <span className="text-white text-left font-medium">
                {currentCountry.english_name}
              </span>
              <span className="text-gray-400 text-sm ml-auto">(Current)</span>
            </div>

            {/* Search Input */}
            <div className="relative mb-4">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="search"
                placeholder="Search for your country"
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-800/80 text-white rounded-lg border border-gray-700 outline-none focus:border-gray-500 transition-all duration-300 text-md"
                autoComplete="off"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                ></button>
              )}
            </div>

            {/* Countries List */}
            <div className="h-full max-h-80 sm:max-h-100 overflow-y-auto space-y-1">
              {filteredCountries.length > 0 ? (
                filteredCountries.map((country) => (
                  <button
                    key={country.iso_3166_1}
                    onClick={() => selectCountry(country.iso_3166_1)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors cursor-pointer ${
                      selectedRegion === country.iso_3166_1
                        ? "bg-primary/20 border border-primary"
                        : "hover:bg-gray-700/50 border border-transparent"
                    }`}
                  >
                    <span className="text-lg">{country.flag}</span>
                    <span className="text-white text-left">{country.english_name}</span>
                    <span className="text-gray-400 text-xs ml-auto">{country.iso_3166_1}</span>
                    {selectedRegion === country.iso_3166_1 && (
                      <svg
                        className="w-5 h-5 text-primary ml-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <p className="text-sm">No countries found</p>
                  <p className="text-xs mt-1">Try adjusting your search</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <>
      <button
        onClick={openModal}
        className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg overflow-hidden transition-all duration-200 whitespace-nowrap cursor-pointer text-gray-300 hover:bg-gray-700/50 hover:text-white border border-gray-600/50 hover:border-gray-500"
      >
        <span className="min-w-0 flex items-center gap-1 mr-2 truncate">
          <span className="text-base flex-shrink-0">{currentCountry?.flag}</span>
          <span className="hidden sm:block">{currentCountry?.english_name}</span>
          <span className="sm:hidden">{currentCountry?.iso_3166_1}</span>
        </span>
        <svg
          className={`w-3 h-3 ml-auto flex-shrink-0 transition-transform duration-200 ${
            isShown ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {selectRegionModal()}
    </>
  );
}
