import React, { useState, useEffect } from 'react';

const CotDataForm = () => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0], // Current date in YYYY-MM-DD
    netChangePercent: '',
    longContracts: '',
    shortContracts: '',
    prevLongContracts: '',
    prevShortContracts: '',
    prevLongPercent: '',
  });

  const [computed, setComputed] = useState({
    changeLongContracts: 0,
    changeShortContracts: 0,
    longPercent: 0,
    shortPercent: 0,
    netPosition: 0,
  });

  useEffect(() => {
    const long = parseInt(formData.longContracts) || 0;
    short = parseInt(formData.shortContracts) || 0;
    const prevLong = parseInt(formData.prevLongContracts) || 0;
    const prevShort = parseInt(formData.prevShortContracts) || 0;

    const changeLong = long - prevLong;
    const changeShort = short - prevShort;
    const total = long + short;

    const longPct = total > 0 ? ((long / total) * 100).toFixed(2) : 0;
    const shortPct = total > 0 ? ((short / total) * 100).toFixed(2) : 0;
    const net = long - short;

    setComputed({
      changeLongContracts: changeLong,
      changeShortContracts: changeShort,
      longPercent: parseFloat(longPct),
      shortPercent: parseFloat(shortPct),
      netPosition: net,
    });
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form className="p-4 max-w-2xl mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">COT Data Input (Individual)</h2>

      <div className="mb-3">
        <label className="block font-medium">Current Date</label>
        <input type="text" name="date" value={formData.date} readOnly className="w-full border p-2" />
      </div>

      <div className="mb-3">
        <label className="block">Net Change %</label>
        <input type="number" step="0.01" name="netChangePercent" value={formData.netChangePercent} onChange={handleChange} className="w-full border p-2" />
      </div>

      <div className="mb-3">
        <label className="block">Previous Long Contracts</label>
        <input type="number" name="prevLongContracts" value={formData.prevLongContracts} onChange={handleChange} className="w-full border p-2" />
      </div>

      <div className="mb-3">
        <label className="block">Previous Short Contracts</label>
        <input type="number" name="prevShortContracts" value={formData.prevShortContracts} onChange={handleChange} className="w-full border p-2" />
      </div>

      <div className="mb-3">
        <label className="block">New Long Contracts</label>
        <input type="number" name="longContracts" value={formData.longContracts} onChange={handleChange} className="w-full border p-2" />
      </div>

      <div className="mb-3">
        <label className="block">New Short Contracts</label>
        <input type="number" name="shortContracts" value={formData.shortContracts} onChange={handleChange} className="w-full border p-2" />
      </div>

      <div className="mb-3">
        <label className="block">Previous Long %</label>
        <input type="number" name="prevLongPercent" value={formData.prevLongPercent} onChange={handleChange} className="w-full border p-2" />
      </div>

      <h3 className="text-lg font-semibold mt-4 mb-2">Computed Values</h3>

      <div className="mb-3">
        <label className="block">Change in Long Contracts</label>
        <input type="number" value={computed.changeLongContracts} readOnly className="w-full border p-2 bg-gray-100" />
      </div>

      <div className="mb-3">
        <label className="block">Change in Short Contracts</label>
        <input type="number" value={computed.changeShortContracts} readOnly className="w-full border p-2 bg-gray-100" />
      </div>

      <div className="mb-3">
        <label className="block">New Long %</label>
        <input type="number" value={computed.longPercent} readOnly className="w-full border p-2 bg-gray-100" />
      </div>

      <div className="mb-3">
        <label className="block">New Short %</label>
        <input type="number" value={computed.shortPercent} readOnly className="w-full border p-2 bg-gray-100" />
      </div>

      <div className="mb-3">
        <label className="block">Net Position (Long - Short)</label>
        <input type="number" value={computed.netPosition} readOnly className="w-full border p-2 bg-gray-100" />
      </div>
    </form>
  );
};

export default CotDataForm;
