import { Link } from 'react-router-dom';

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700">
              TinyLink
            </Link>
            <nav className="flex gap-4">
              <Link
                to="/"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Dashboard
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-gray-500 text-sm">
            © 2024 TinyLink - URL Shortener
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Layout;



