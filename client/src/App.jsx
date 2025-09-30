import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import NavBar from "./components/NavBar";
import NotFoundPage from "./pages/NotFoundPage";
import Footer from "./components/Footer";

// Lazy load each page
const HomePage = lazy(() => import("./pages/HomePage"));
const InfoPage = lazy(() => import("./pages/InfoPage"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const DiscoverPage = lazy(() => import("./pages/DiscoverPage"));

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow">
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-full mt-20">
              <div className="text-white text-lg">Loading...</div>
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/:mediaType/:id/season/:seasonNumber" element={<InfoPage />} />
            <Route path="/:mediaType/:id" element={<InfoPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/:mediaType" element={<DiscoverPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
