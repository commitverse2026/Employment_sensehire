import React, { useEffect, useState } from 'react';

const EmployerDashboard = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/f12/sorted-applicants')
      .then((res) => res.json())
      .then((data) => {
        setCandidates(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center text-blue-400 text-xl font-bold">
      Calculating Rankings...
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 p-8 text-white">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-black text-blue-400 mb-2">Employer Dashboard</h1>
        <p className="text-gray-400 mb-10 text-lg font-medium">Top candidates ranked by profile similarity.</p>
        
        <div className="bg-gray-800 rounded-3xl shadow-2xl border border-gray-700 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-700/50 text-gray-400 uppercase text-xs tracking-widest">
              <tr>
                <th className="px-8 py-5">Rank</th>
                <th className="px-8 py-5">Candidate</th>
                <th className="px-8 py-5">Location</th>
                <th className="px-8 py-5 text-right">Match</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {candidates.map((c, index) => (
                <tr key={c.id} className="hover:bg-gray-750 transition-colors group">
                  <td className="px-8 py-6 font-mono text-2xl font-bold">
                    {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
                  </td>
                  <td className="px-8 py-6">
                    <div className="font-bold text-white text-lg group-hover:text-blue-300">{c.name}</div>
                    <div className="text-gray-500 text-sm italic">{c.role}</div>
                  </td>
                  <td className="px-8 py-6 text-gray-400">{c.location}</td>
                  <td className="px-8 py-6 text-right">
                    <span className="bg-blue-900/40 text-blue-300 px-4 py-2 rounded-xl border border-blue-800 font-black text-xl">
                      {(c.score * 100).toFixed(0)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;