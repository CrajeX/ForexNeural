import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TradingDashboard from './components/TradingDashboard';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TradingDashboard />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
