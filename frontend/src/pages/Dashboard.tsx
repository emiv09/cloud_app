import React, { useRef } from 'react';
import { logout } from '../auth/useAuth';
import { useNavigate } from 'react-router-dom';
import { uploadFile } from '../api';

function Dashboard() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const goToMyFiles = () => {
    navigate('/my-files');
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const uploaded = await uploadFile(file);
      alert(`File "${uploaded}" uploaded successfully`);
    } catch (err: any) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      // Reset input to allow re-uploading same file
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative p-8 font-sans">
      {/* Logout button */}
      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 px-4 py-2 bg-black text-white rounded transition-colors duration-200 hover:bg-gray-800"
      >
        Logout
      </button>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Dashboard content */}
      <div className="flex flex-col items-center justify-center min-h-[80vh] w-full gap-6">
        <span className="text-2xl font-semibold text-center mb-2">
          Welcome to your dashboard!
        </span>
        <div className="flex flex-row items-center justify-center gap-4">
          <button
            className="px-6 py-2 bg-white text-green-600 border border-green-600 rounded transition-colors duration-300 hover:bg-green-50 hover:border-green-700 hover:text-green-700 cursor-pointer m-4"
            onClick={triggerUpload}
          >
            Upload File
          </button>
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded transition-colors duration-300 hover:bg-blue-700 cursor-pointer m-4"
            onClick={goToMyFiles}
          >
            See Your Files
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;