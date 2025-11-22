import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import LinkForm from '../components/LinkForm';
import LinkTable from '../components/LinkTable';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function Dashboard() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/links`);
      setLinks(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load links. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (code) => {
    if (!window.confirm('Are you sure you want to delete this link?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/api/links/${code}`);
      setLinks(links.filter(link => link.code !== code));
    } catch (err) {
      setError('Failed to delete link. Please try again.');
      console.error(err);
    }
  };

  const handleAddLink = (newLink) => {
    setLinks([newLink, ...links]);
  };

  const filteredLinks = links.filter(link => {
    const searchLower = searchTerm.toLowerCase();
    return (
      link.code.toLowerCase().includes(searchLower) ||
      link.targetUrl.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <LinkForm onAdd={handleAddLink} />

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">All Links</h2>
            <input
              type="text"
              placeholder="Search by code or URL..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : filteredLinks.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {searchTerm ? 'No links match your search.' : 'No links yet. Create your first short link above!'}
          </div>
        ) : (
          <LinkTable links={filteredLinks} onDelete={handleDelete} />
        )}
      </div>
    </div>
  );
}

export default Dashboard;



