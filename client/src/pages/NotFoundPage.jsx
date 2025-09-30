export default function NotFoundPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">404 - Page Not Found</h1>
        <p className="text-gray-400">The page you're looking for doesn't exist.</p>
        <a href="/" className="text-primary-2 hover:underline">
          Go Home
        </a>
      </div>
    </div>
  );
}
