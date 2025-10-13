import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Chọn file trước!");

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: 20, border: '1px solid #ddd', borderRadius: 8 }}>
      <h2>Upload file (raw + token)</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit" style={{ marginLeft: 10 }} disabled={loading}>
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
      {result?.rawUrl && (
        <div style={{ marginTop: 20 }}>
          <strong>Raw link (có token):</strong>
          <div>
            <code>{result.rawUrl}</code>
          </div>
          <a href={result.rawUrl} target="_blank" rel="noopener noreferrer">
            Tải về/Xem file raw
          </a>
        </div>
      )}
    </div>
  );
}
