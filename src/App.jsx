import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import InfoPage from "./pages/InfoPage";

export default function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/:mediaType/:id" element={<InfoPage />} />
      </Routes>
    </>
  );
}
