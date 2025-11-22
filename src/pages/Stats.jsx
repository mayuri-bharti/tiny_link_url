import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function Stats() {
  const { code } = useParams();
  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, [code]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/links/${code}`);
      setLink(response.data);
      setError(null);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Link not found');
      } else {
        setError('Failed to load link statistics. Please try again.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <Link
          to="/"
          className="inline-block text-blue-600 hover:text-blue-700"
        >
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        to="/"
        className="inline-block text-blue-600 hover:text-blue-700 mb-4"
      >
        ← Back to Dashboard
      </Link>

      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Link Statistics</h1>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Short Code
            </label>
            <div className="flex items-center gap-2">
              <code className="px-3 py-2 bg-gray-100 rounded text-lg font-mono">
                {link.code}
              </code>
              <button
                onClick={() => {
                  const shortUrl = `${window.location.origin}/${link.code}`;
                  navigator.clipboard.writeText(shortUrl);
                  alert('Copied to clipboard!');
                }}
                className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Copy Link
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target URL
            </label>
            <a
              href={link.targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 break-all"
            >
              {link.targetUrl}
            </a>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Clicks
            </label>
            <p className="text-2xl font-bold text-gray-900">{link.totalClicks}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Clicked
            </label>
            <p className="text-gray-900">{formatDate(link.lastClicked)}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Created At
            </label>
            <p className="text-gray-900">{formatDate(link.createdAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stats;



