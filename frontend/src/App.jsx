import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import config from '../features.config.js'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {config.day2Enabled && (
          <Route path="/day2" element={<div>Day 2 unlocked!</div>} />
        )}
      </Routes>
    </BrowserRouter>
  )
}