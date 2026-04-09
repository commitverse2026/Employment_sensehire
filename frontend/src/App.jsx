import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import config from "../features.config.js";
import SearchJobs from "./pages/SearchJobs";

import F01 from "./features/f01/f01.jsx";
import F02 from "./features/f02/f02.jsx";
import F03 from "./features/f03/f03.jsx";
import F04 from "./features/f04/f04.jsx";
import F05 from "./features/f05/f05.jsx";
import F06 from "./features/f06/f06.jsx";
import F07 from "./features/f07/f07.jsx";
import F08 from "./features/f08/f08.jsx";
import F09 from "./features/f09/f09.jsx";
import F10 from "./features/f10/f10.jsx";
import F11 from "./features/f11/f11.jsx";
import F12 from "./features/f12/f12.jsx";
import F13 from "./features/f13/f13.jsx";
import F14 from "./features/f14/f14.jsx";
import F15 from "./features/f15/f15.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Day2 */}
        {config.day2Enabled && (
          <Route path="/day2" element={<div>Day 2 unlocked!</div>} />
        )}

        <Route path="/f01" element={<F01 />} />
        <Route path="/f02" element={<F02 />} />
        <Route path="/f03" element={<F03 />} />
        <Route path="/f04" element={<F04 />} />
        <Route path="/f05" element={<F05 />} />
        <Route path="/f06" element={<F06 />} />
        <Route path="/f07" element={<F07 />} />
        <Route path="/f08" element={<F08 />} />
        <Route path="/f09" element={<F09 />} />
        <Route path="/f10" element={<F10 />} />
        <Route path="/f11" element={<F11 />} />
        <Route path="/f12" element={<F12 />} />
        <Route path="/f13" element={<F13 />} />
        <Route path="/f14" element={<F14 />} />
        <Route path="/f15" element={<F15 />} />

        <Route path="/search" element={<SearchJobs />} />

        <Route
          path="*"
          element={<div style={{ color: "white" }}>Page Not Found</div>}
        />
      </Routes>
    </BrowserRouter>
  );
}