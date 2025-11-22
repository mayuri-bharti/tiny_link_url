import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Stats from './pages/Stats';
import Redirect from './pages/Redirect';
import Layout from './components/Layout';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/code/:code" element={<Stats />} />
        <Route path="/:code" element={<Redirect />} />
      </Routes>
    </Layout>
  );
}

export default App;

