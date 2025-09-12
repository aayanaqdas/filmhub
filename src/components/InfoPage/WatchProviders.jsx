import { useState, useEffect } from "react";
import cameraIcon from "../../assets/camera-icon.svg";

export default function WatchProviderSection({ watchProviders }) {
  const [activeTab, setActiveTab] = useState("streaming");

  const buy = watchProviders?.buy || [];
  const rent = watchProviders?.rent || [];
  const streaming = watchProviders?.flatrate || [];
  const free = watchProviders?.free || [];

  const tabs = [
    {
      key: "streaming",
      label: "Streaming",
      data: streaming,
      count: streaming.length,
    },
    {
      key: "free",
      label: "Free",
      data: free,
      count: free.length,
    },
    {
      key: "buy",
      label: "Buy",
      data: buy,
      count: buy.length,
    },
    {
      key: "rent",
      label: "Rent",
      data: rent,
      count: rent.length,
    },
  ];

  useEffect(() => {
    const hasAnyProviders = tabs.some((tab) => tab.count > 0);
    if (hasAnyProviders) {
      const currentTab = tabs.find((tab) => tab.key === activeTab);
      if (currentTab?.count === 0) {
        const firstAvailableTab = tabs.find((tab) => tab.count > 0);
        if (firstAvailableTab) {
          setActiveTab(firstAvailableTab.key);
        }
      }
    }
  }, [watchProviders]);

  const currentData = tabs.find((tab) => tab.key === activeTab)?.data || [];

  const tabBtns = tabs.map((tab) => {
    return (
      <button
        key={tab.key}
        onClick={() => setActiveTab(tab.key)}
        className={`px-3 py-2.5 text-sm font-medium rounded-lg flex items-center gap-2 transition-all duration-200 whitespace-nowrap cursor-pointer ${
          activeTab === tab.key
            ? "bg-primary-2/20 text-primary-2 shadow-sm"
            : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
        }`}
      >
        {tab.label}
        <span
          className={`text-xs px-1.5 py-0.5 rounded-full ${
            activeTab === tab.key
              ? "bg-primary-2/30 text-primary-2"
              : "bg-gray-600/50 text-gray-400"
          }`}
        >
          {tab.count}
        </span>
      </button>
    );
  });

  const providerContent = currentData.map((provider) => {
    return (
      <a
        href={watchProviders.link}
        target="_blank"
        rel="noopener noreferrer"
        key={provider.provider_id}
        className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-700/50 transition-all duration-200 cursor-pointer group min-w-0"
        title={provider.provider_name}
      >
        <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden bg-gray-700 flex-shrink-0">
          <img
            src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
            alt={provider.provider_name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </div>
        <span className="text-xs text-gray-300 text-center truncate w-full max-w-[100px]">
          {provider.provider_name}
        </span>
      </a>
    );
  });

  return (
    <section className="w-full pt-5">
      <h1 className="text-white text-2xl md:text-3xl font-bold mb-4">Watch now</h1>
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50">
        <div className="w-full p-4 border-b border-gray-700/50">
          <div className="flex gap-2 flex-wrap">{tabBtns}</div>
        </div>
        <div className="p-4 md:p-6">
          {currentData.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
              {providerContent}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-700/50 flex items-center justify-center">
                <img src={cameraIcon} alt="No content" className="w-10 h-10" />
              </div>
              <p className="text-gray-400 text-sm">No provider available for this option</p>
            </div>
          )}
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-3 text-center sm:text-left">
        Streaming data provided by{" "}
        <a
          href="https://www.justwatch.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="border-b border-gray-500 hover:text-primary-2 hover:border-primary-2 transition-colors"
        >
          JustWatch
        </a>
      </p>
    </section>
  );
}
