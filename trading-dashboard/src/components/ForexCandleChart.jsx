import React, { useState, useEffect } from "react";
import { ResponsiveContainer, ComposedChart, XAxis, YAxis, Tooltip, Bar, Line } from "recharts";

const generateCandle = (lastClose) => {
  const open = lastClose;
  const change = (Math.random() - 0.5) * 0.5; // small random change
  const close = parseFloat((open + change).toFixed(4));
  const high = parseFloat((Math.max(open, close) + Math.random() * 0.3).toFixed(4));
  const low = parseFloat((Math.min(open, close) - Math.random() * 0.3).toFixed(4));
  const time = new Date().toLocaleTimeString();

  return { time, open, close, high, low };
};

const summarizeCandle = (candle) => {
  const trend = candle.close > candle.open ? "📈 Bullish" : candle.close < candle.open ? "📉 Bearish" : "➡️ Neutral";
  const change = (candle.close - candle.open).toFixed(4);
  const volatility = (candle.high - candle.low).toFixed(4);
  return { trend, change, volatility };
};

const ForexCandleChart = () => {
  const [candles, setCandles] = useState([]);
  const [intervalMs, setIntervalMs] = useState(1000);
  const [summary, setSummary] = useState({ trend: "", change: "", volatility: "" });

  useEffect(() => {
    let lastClose = 1.1000;
    const interval = setInterval(() => {
      const newCandle = generateCandle(lastClose);
      lastClose = newCandle.close;
      const updated = [...candles.slice(-29), newCandle];
      setCandles(updated);
      setSummary(summarizeCandle(newCandle));
    }, intervalMs);
    return () => clearInterval(interval);
  }, [intervalMs, candles]);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-xl font-bold mb-2 text-center">📉 Real-Time Forex Candlestick Chart</h1>

      <div className="flex justify-center mb-4">
        <label className="mr-2">Timeframe:</label>
        <select
          onChange={(e) => setIntervalMs(Number(e.target.value))}
          className="border px-2 py-1 rounded"
          defaultValue={1000}
        >
          <option value={1000}>1 Minute</option>
          <option value={3000}>5 Minutes</option>
          <option value={6000}>15 Minutes</option>
        </select>
      </div>

      <div className="bg-white p-4 rounded shadow mb-4">
        <p><strong>Trend:</strong> {summary.trend}</p>
        <p><strong>Price Change:</strong> {summary.change}</p>
        <p><strong>Volatility:</strong> {summary.volatility}</p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={candles}>
          <XAxis dataKey="time" />
          <YAxis domain={['dataMin - 0.001', 'dataMax + 0.001']} />
          <Tooltip />
          <Bar
            dataKey="close"
            fill="#8884d8"
            isAnimationActive={false}
            barSize={8}
          />
          <Line
            type="monotone"
            dataKey="high"
            stroke="#82ca9d"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="low"
            stroke="#ff6961"
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ForexCandleChart;
