import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

export default function App() {
  const [file, setFile] = useState(null);
  const [englishQuery, setEnglishQuery] = useState("");

  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (file) {
      alert(`File "${file.name}" uploaded successfully!`);
    } else {
      alert("Please select a file first!");
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
