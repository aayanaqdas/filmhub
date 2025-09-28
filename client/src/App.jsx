import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import InfoPage from "./pages/InfoPage";
import SearchPage from "./pages/SearchPage";
import MoviesPage from "./pages/MoviesPage";

export default function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/:mediaType/:id/season/:seasonNumber" element={<InfoPage />} />
        <Route path="/:mediaType/:id" element={<InfoPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/movies" element={<MoviesPage />} />
      </Routes>
    </>
  );
}
