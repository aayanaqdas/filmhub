import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import NavBar from "./components/NavBar";
import NotFoundPage from "./pages/NotFoundPage";

// Lazy load each page
const HomePage = lazy(() => import("./pages/HomePage"));
const InfoPage = lazy(() => import("./pages/InfoPage"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const DiscoverPage = lazy(() => import("./pages/DiscoverPage"));

export default function App() {
  return (
    <>
      <NavBar />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/:mediaType/:id/season/:seasonNumber" element={<InfoPage />} />
          <Route path="/:mediaType/:id" element={<InfoPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/:mediaType" element={<DiscoverPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </>
  );
}
