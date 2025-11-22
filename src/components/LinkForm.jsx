import { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function LinkForm({ onAdd }) {
  const [targetUrl, setTargetUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const validateUrl = (url) => {
    if (!url) return false;
    try {
      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const validateCode = (code) => {
    if (!code) return true; // Optional
    return /^[A-Za-z0-9]{6,8}$/.test(code);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validation
    if (!targetUrl.trim()) {
      setError('Please enter a URL');
      return;
    }

    if (!validateUrl(targetUrl)) {
      setError('Please enter a valid URL');
      return;
    }

    if (customCode && !validateCode(customCode)) {
      setError('Custom code must be 6-8 alphanumeric characters');
      return;
    }

    try {
      setLoading(true);
      const payload = { targetUrl: targetUrl.trim() };
      if (customCode.trim()) {
        payload.code = customCode.trim();
      }

      const response = await axios.post(`${API_URL}/api/links`, payload);
      
      setSuccess(true);
      setTargetUrl('');
      setCustomCode('');
      onAdd(response.data);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      if (err.response?.status === 409) {
        setError('This code already exists. Please choose a different one.');
      } else if (err.response?.status === 400) {
        setError(err.response.data.error || 'Invalid URL provided');
      } else {
        setError('Failed to create link. Please try again.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Create Short Link</h2>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          Link created successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="targetUrl" className="block text-sm font-medium text-gray-700 mb-1">
            Target URL *
          </label>
          <input
            type="text"
            id="targetUrl"
            value={targetUrl}
            onChange={(e) => {
              setTargetUrl(e.target.value);
              setError(null);
            }}
            placeholder="https://example.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="customCode" className="block text-sm font-medium text-gray-700 mb-1">
            Custom Code (Optional)
          </label>
          <input
            type="text"
            id="customCode"
            value={customCode}
            onChange={(e) => {
              setCustomCode(e.target.value);
              setError(null);
            }}
            placeholder="6-8 alphanumeric characters"
            pattern="[A-Za-z0-9]{6,8}"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
          <p className="mt-1 text-sm text-gray-500">
            Leave empty to generate automatically
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Creating...' : 'Create Link'}
        </button>
      </form>
    </div>
  );
}

export default LinkForm;



