import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

export default function App() {
  const [file, setFile] = useState(null);
  const [englishQuery, setEnglishQuery] = useState("");
  const [sampleRows, setSampleRows] = useState([]);
  const [showSample, setShowSample] = useState(false);

  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
  };

  // ✅ API Integration for Upload
  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file); // 👈 field name MUST be "file"

      const response = await fetch("/api/excel/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      const result = await response.json();
      // Backend returns inserted, rowsInFile and totalInCollection
      alert(`✅ ${result.message}\nInserted: ${result.inserted} (in file: ${result.rowsInFile})\nTotal in collection: ${result.totalInCollection}`);
    } catch (error) {
      console.error(error);
      alert("❌ Error uploading file");
    }
  };

  const handleRunQuery = () => {
    alert("Running SQL query...");
  };

  const handleEnglishQuery = () => {
    if (englishQuery.trim()) {
      alert(`Converting English to SQL:\n"${englishQuery}"`);
    } else {
      alert("Please enter an English query!");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center 
      bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 p-6"
    >
      {/* Heading */}
      <h1 className="text-5xl font-extrabold text-white drop-shadow-lg mb-10">
        Data Query Gateway
      </h1>

      {/* Cards container */}
      <div className="grid md:grid-cols-3 gap-8 w-full max-w-6xl">
        {/* Upload Section */}
        <div className="backdrop-blur-lg bg-white/40 p-8 rounded-2xl shadow-2xl">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Upload Dataset
          </h2>
          <input
            type="file"
            onChange={handleFileUpload}
            className="w-full mb-4 text-gray-700"
          />
          <button
            onClick={handleUpload}
            className="w-full bg-blue-600 text-white py-2 rounded-xl shadow hover:bg-blue-700 transition"
          >
            Upload File
          </button>
          <button
            onClick={async () => {
              try {
                const res = await fetch("/api/excel/sample");
                if (!res.ok) throw new Error("Failed to fetch sample");
                const data = await res.json();
                setSampleRows(data.rows || []);
                setShowSample(true);
              } catch (err) {
                console.error(err);
                alert("Error fetching sample");
              }
            }}
            className="mt-3 w-full bg-green-600 text-white py-2 rounded-xl shadow hover:bg-green-700 transition"
          >
            Show Sample (first 5)
          </button>

          {showSample && (
            <div className="mt-4 p-3 bg-white/70 rounded-lg text-left max-h-80 overflow-auto">
              <div className="flex justify-between items-center mb-2">
                <strong>Sample Documents ({sampleRows.length})</strong>
                <button onClick={() => setShowSample(false)} className="text-sm text-gray-600 underline">Close</button>
              </div>

              {/* Build table columns from sampleRows keys */}
              {sampleRows.length === 0 ? (
                <div className="text-sm text-gray-700">No sample documents available.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm text-left">
                    <thead>
                      <tr className="bg-gray-100">
                        {(() => {
                          // Collect union of keys
                          const keySet = new Set();
                          sampleRows.forEach(r => Object.keys(r || {}).forEach(k => keySet.add(k)));
                          // Preferred order: batchId, uploadedAt, then others alphabetically
                          const keys = Array.from(keySet);
                          const pref = ["batchId", "uploadedAt"];
                          const ordered = [
                            ...pref.filter(k => keys.includes(k)),
                            ...keys.filter(k => !pref.includes(k)).sort()
                          ];
                          return ordered.map((k) => (
                            <th key={k} className="px-3 py-2 font-medium text-gray-700">{k}</th>
                          ));
                        })()}
                      </tr>
                    </thead>
                    <tbody>
                      {sampleRows.map((row, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          {(() => {
                            const keySet = new Set();
                            sampleRows.forEach(r => Object.keys(r || {}).forEach(k => keySet.add(k)));
                            const keys = Array.from(keySet);
                            const pref = ["batchId", "uploadedAt"];
                            const ordered = [
                              ...pref.filter(k => keys.includes(k)),
                              ...keys.filter(k => !pref.includes(k)).sort()
                            ];
                            return ordered.map((k) => {
                              let v = row[k];
                              // Format dates
                              if (v && typeof v === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(v)) {
                                try { v = new Date(v).toLocaleString(); } catch (e) {}
                              }
                              // Convert objects to brief JSON
                              if (v && typeof v === 'object') v = JSON.stringify(v);
                              return (
                                <td key={k} className="px-3 py-2 align-top text-gray-800 whitespace-pre-wrap max-w-xs">
                                  {v === undefined ? "-" : String(v)}
                                </td>
                              );
                            });
                          })()}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Run Query Section */}
        <div className="backdrop-blur-lg bg-white/40 p-8 rounded-2xl shadow-2xl">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Run SQL Query
          </h2>
          <textarea
            placeholder="Enter your SQL query here..."
            className="w-full p-2 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-400"
            rows="5"
          ></textarea>
          <button
            onClick={handleRunQuery}
            className="w-full bg-blue-600 text-white py-2 rounded-xl shadow hover:bg-blue-700 transition"
          >
            Run Query
          </button>
        </div>

        {/* English Query Section */}
        <div className="backdrop-blur-lg bg-white/40 p-8 rounded-2xl shadow-2xl">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            English Query
          </h2>
          <input
            type="text"
            value={englishQuery}
            onChange={(e) => setEnglishQuery(e.target.value)}
            placeholder="e.g. Show all students..."
            className="w-full p-2 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleEnglishQuery}
            className="w-full bg-blue-600 text-white py-2 rounded-xl shadow hover:bg-blue-700 transition"
          >
            Convert to SQL
          </button>
        </div>
      </div>
    </div>
  );
}
