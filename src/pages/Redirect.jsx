import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function Redirect() {
  const { code } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const redirect = async () => {
      try {
        // Track click and get target URL
        const response = await axios.post(`${API_URL}/api/links/${code}/click`);
        
        if (response.data && response.data.targetUrl) {
          // Redirect to target URL
          window.location.href = response.data.targetUrl;
        }
      } catch (error) {
        // Link not found, redirect to dashboard
        if (error.response?.status === 404) {
          navigate('/');
        } else {
          // Try to get link info without tracking click
          try {
            const linkResponse = await axios.get(`${API_URL}/api/links/${code}`);
            if (linkResponse.data && linkResponse.data.targetUrl) {
              window.location.href = linkResponse.data.targetUrl;
            }
          } catch {
            navigate('/');
          }
        }
      }
    };

    redirect();
  }, [code, navigate]);

  return (
    <div className="text-center py-12">
      <div className="text-gray-500">Redirecting...</div>
    </div>
  );
}

export default Redirect;

