// src/api.ts

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
};

export const uploadFile = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('http://localhost:8091/cloud/upload/', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'File upload failed');
    }

    const result = await response.json();
    return result.filename;
  } catch (err: any) {
    console.error('Upload error:', err.message);
    throw err;
  }
};

export const getFiles = async (): Promise<string[]> => {
  try {
    const response = await fetch('http://localhost:8091/cloud/files/', {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch files');
    }

    const data = await response.json();
    return data.files;
  } catch (err: any) {
    console.error('Fetch error:', err.message);
    throw err;
  }
};
