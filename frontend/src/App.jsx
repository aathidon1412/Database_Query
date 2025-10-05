import { useState } from "react";

export default function App() {
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState(""); // auto-detected
  const [sampleRows, setSampleRows] = useState([]);
  const [showSample, setShowSample] = useState(false);
  const [englishQuery, setEnglishQuery] = useState("");

  // ✅ Detect file type based on extension
  const detectFileType = (filename) => {
    const ext = filename.split(".").pop().toLowerCase();
    if (ext === "xlsx" || ext === "xls") return "excel";
    if (ext === "csv") return "csv";
    if (ext === "tsv") return "tsv";
    if (ext === "xml") return "xml";
    if (ext === "json") return "json";
    return "";
  };

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    const type = detectFileType(selectedFile.name);
    setFileType(type);
  };

  // ✅ Upload to correct backend API
  const handleUpload = async () => {
    if (!file) return alert("Please select a file first!");
    if (!fileType) return alert("Unsupported file type!");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `http://localhost:5001/api/${fileType}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Upload failed");

      const result = await response.json();
      alert(
        `✅ ${result.message}\nInserted: ${result.inserted}\nBatch ID: ${result.batchId}`
      );
    } catch (err) {
      console.error(err);
      alert("❌ Error uploading file");
    }
  };

  // Helper: Flatten deeply nested objects (for XML)
const flattenObject = (obj) => {
  const result = {};
  for (const key in obj) {
    if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
      const flat = flattenObject(obj[key]);
      for (const subKey in flat) {
        result[`${key}.${subKey}`] = flat[subKey];
      }
    } else {
      result[key] = obj[key];
    }
  }
  return result;
};

// Modified fetchLatest function
const fetchLatest = async () => {
  if (!fileType) return alert("Please upload or select a file first!");

  try {
    const res = await fetch(`http://localhost:5001/api/${fileType}/latest`);
    if (!res.ok) throw new Error("Failed to fetch latest");
    const data = await res.json();

    let rows = data.rows || [];

    // Special handling for XML: flatten nested structure
    if (fileType === "xml") {
      const normalized = [];
      rows.forEach((r) => {
        const firstKey = Object.keys(r)[0];
        const inner = r[firstKey];

        if (Array.isArray(inner)) {
          inner.forEach((item) => normalized.push(flattenObject(item)));
        } else if (typeof inner === "object") {
          normalized.push(flattenObject(inner));
        } else {
          normalized.push({ [firstKey]: inner });
        }
      });
      rows = normalized;
    }

    setSampleRows(rows);
    setShowSample(true);
  } catch (err) {
    console.error(err);
    alert("Error fetching latest data");
  }
};


  const handleRunQuery = () => alert("SQL query execution not yet implemented");
  const handleEnglishQuery = () => {
    if (!englishQuery.trim())
      return alert("Please enter an English query first!");
    alert(`🧠 Translating English to SQL:\n"${englishQuery}"`);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start 
      bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 p-6"
    >
      <h1 className="text-5xl font-extrabold text-white drop-shadow-lg mb-10">
        Data Query Gateway
      </h1>

      <div className="grid md:grid-cols-3 gap-8 w-full max-w-6xl mb-10">
        {/* Upload Section */}
        <div className="backdrop-blur-lg bg-white/40 p-8 rounded-2xl shadow-2xl">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Upload Dataset
          </h2>
          <input
            type="file"
            accept=".csv,.tsv,.xlsx,.xls,.xml,.json"
            onChange={handleFileUpload}
            className="w-full mb-4 text-gray-700"
          />
          {file && (
            <p className="text-sm text-gray-600 mb-2">
              Selected file: <strong>{file.name}</strong> ({fileType})
            </p>
          )}
          <button
            onClick={handleUpload}
            className="w-full bg-blue-600 text-white py-2 rounded-xl shadow hover:bg-blue-700 transition"
          >
            Upload File
          </button>
          <button
            onClick={fetchLatest}
            className="mt-3 w-full bg-green-600 text-white py-2 rounded-xl shadow hover:bg-green-700 transition"
          >
            Show Uploaded Records
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
            placeholder="e.g. Show all employees older than 30..."
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

      {/* Display Latest Records */}
      {showSample && (
        <div className="w-full max-w-6xl backdrop-blur-lg bg-white/70 p-6 rounded-2xl shadow-2xl">
          <div className="flex justify-between items-center mb-2">
            <strong>
              Latest Records ({sampleRows.length}) — {fileType.toUpperCase()}
            </strong>
            <button
              onClick={() => setShowSample(false)}
              className="text-sm text-gray-600 underline"
            >
              Close
            </button>
          </div>

          {sampleRows.length === 0 ? (
            <div className="text-sm text-gray-700">
              No rows available in the latest upload.
            </div>
          ) : (
            <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
              <table className="min-w-full text-sm text-left">
                <thead>
                  <tr className="bg-gray-100">
                    {(() => {
                      const keySet = new Set();
                      sampleRows.forEach((r) =>
                        Object.keys(r || {}).forEach((k) => keySet.add(k))
                      );
                      const keys = Array.from(keySet);
                      return keys.map((k) => (
                        <th
                          key={k}
                          className="px-3 py-2 font-medium text-gray-700"
                        >
                          {k}
                        </th>
                      ));
                    })()}
                  </tr>
                </thead>
                <tbody>
                  {sampleRows.map((row, idx) => (
                    <tr
                      key={idx}
                      className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      {Object.keys(row).map((k) => {
                        let v = row[k];
                        if (
                          v &&
                          typeof v === "string" &&
                          /^\d{4}-\d{2}-\d{2}T/.test(v)
                        ) {
                          try {
                            v = new Date(v).toLocaleString();
                          } catch (e) {}
                        }
                        if (v && typeof v === "object")
                          v = JSON.stringify(v);
                        return (
                          <td
                            key={k}
                            className="px-3 py-2 align-top text-gray-800 whitespace-pre-wrap max-w-xs"
                          >
                            {v === undefined ? "-" : String(v)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
