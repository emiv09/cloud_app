import React, { useEffect, useState } from 'react';
import { getFiles } from '../api';
import { useNavigate } from 'react-router-dom';

function MyFiles() {
  const [files, setFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fileBlobs, setFileBlobs] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const blobs: Record<string, string> = {};

    const fetchFiles = async () => {
      try {
        const filenames = await getFiles();
        if (!isMounted) return;
        setFiles(filenames);

        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('No access token found');

        for (const filename of filenames) {
          if (!isMounted) break;
          try {
            const res = await fetch(`http://localhost:8091/cloud/files/${filename}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            if (!res.ok) {
              blobs[filename] = '/placeholder.png';
              continue;
            }
            const blob = await res.blob();
            blobs[filename] = URL.createObjectURL(blob);
            if (isMounted) setFileBlobs({ ...blobs }); // actualizez progresiv
          } catch {
            blobs[filename] = '/placeholder.png';
            if (isMounted) setFileBlobs({ ...blobs });
          }
        }
      } catch (err: any) {
        if (isMounted) setError(err.message || 'Failed to load files');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchFiles();

    return () => {
      isMounted = false;
      Object.values(blobs).forEach((url) => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, []);

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="relative p-8 font-sans">
      <button
        onClick={goToDashboard}
        className="absolute top-4 right-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors duration-200"
      >
        Dashboard
      </button>

      <h2 className="text-2xl font-semibold mb-4">Your Files</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-4">
        {files.map((filename) => (
          <div className="w-full h-48 flex items-center justify-center bg-gray-100 rounded shadow-md p-2">
            <img
              src={fileBlobs[filename] || '/placeholder.png'}
              alt={filename}
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/placeholder.png';
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyFiles;
