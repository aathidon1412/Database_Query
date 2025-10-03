import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'


function App() {
   const [uploadStatus, setUploadStatus] = useState("");
  const [sql, setSql] = useState("");
  const [question, setQuestion] = useState("");
  const [tableData, setTableData] = useState([]);

  // ✅ File upload
  const handleUpload = async (e) => {
    e.preventDefault();
    const fileInput = document.getElementById("file-input");
    if (!fileInput.files.length) return;

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    try {
      const response = await fetch("/api/excel/upload", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      setUploadStatus(result.success ? result.message : result.error);
    } catch (err) {
      setUploadStatus("❌ Upload failed");
    }
  };

  // ✅ Run SQL Query
  const runSQLQuery = async () => {
    try {
      const response = await fetch("/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sql }),
      });
      const result = await response.json();
      if (result.success) setTableData(result.data);
      else alert("❌ Error: " + result.error);
    } catch {
      alert("❌ SQL query failed");
    }
  };

  // ✅ Run English Query
  const runEnglishQuery = async () => {
    try {
      const response = await fetch("/query-eng", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const result = await response.json();
      if (result.success) setTableData(result.data);
      else alert("❌ Error: " + result.error);
    } catch {
      alert("❌ English query failed");
    }
  };

  // ✅ Render Table
  const renderTable = () => {
    if (!tableData || tableData.length === 0) {
      return <p>No data found.</p>;
    }

    const headers = Object.keys(tableData[0]);
    return (
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
        <thead>
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                style={{ border: "1px solid #d1d5db", padding: "8px", background: "#f3f4f6" }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, idx) => (
            <tr key={idx}>
              {headers.map((h) => (
                <td key={h} style={{ border: "1px solid #d1d5db", padding: "8px" }}>
                  {row[h]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", background: "#f9fafb", padding: "20px", color: "#333" }}>
      <h1 style={{ color: "#1f2937" }}>SQL Query API Gateway</h1>

      {/* File Upload Section */}
      <div style={{ marginBottom: "20px" }}>
        <h3>📁 Upload a File (.csv, .xlsx, .json)</h3>
        <form onSubmit={handleUpload}>
          <input type="file" id="file-input" required />
          <button type="submit" style={btnStyle}>Upload</button>
        </form>
        <p>{uploadStatus}</p>
      </div>

      {/* SQL Query Section */}
      <div style={{ marginBottom: "20px" }}>
        <h3>🧠 Run SQL Query</h3>
        <textarea
          rows="3"
          cols="60"
          value={sql}
          onChange={(e) => setSql(e.target.value)}
          placeholder="SELECT * FROM tablename;"
        />
        <br />
        <button onClick={runSQLQuery} style={btnStyle}>Run Query</button>
      </div>

      {/* English Query Section */}
      <div style={{ marginBottom: "20px" }}>
        <h3>💬 Ask in English</h3>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g. Show all students"
        />
        <button onClick={runEnglishQuery} style={btnStyle}>Run English Query</button>
      </div>

      {/* Table Output */}
      <div>{renderTable()}</div>
    </div>
  );
}

const btnStyle = {
  backgroundColor: "#2563eb",
  color: "white",
  border: "none",
  padding: "10px 20px",
  borderRadius: "5px",
  cursor: "pointer",
  marginLeft: "10px"
};

export default App;


  
