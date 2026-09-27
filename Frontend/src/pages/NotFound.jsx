import { Link, useNavigate } from "react-router";

import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="h-screen bg-[#05030f] text-white relative overflow-hidden flex flex-col">
      
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-700/30 blur-[140px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-700/25 blur-[140px] rounded-full" />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-16 py-5 shrink-0">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xl font-bold shadow-lg shadow-purple-500/30">
            J
          </div>

          <span className="text-xl md:text-2xl font-semibold">
            JobTrack
          </span>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-4 md:gap-6 text-purple-300">
          
          <Link
            to="/login"
            className="flex items-center gap-2 hover:text-white transition"
          >
            <Home size={18} />
            <span className="hidden sm:inline">Go Home</span>
          </Link>

          <div className="h-6 w-px bg-purple-500/40" />

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 hover:text-white transition"
          >
            <ArrowLeft size={18} />
            <span className="hidden sm:inline">Back</span>
          </button>

        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex-1 min-h-0 flex flex-col items-center justify-center text-center px-6 pb-6">
        
        {/* 404 Illustration */}
        <img
          src="/images/404.png"
          alt="404 Page Not Found"
          className="
            w-full
            max-w-2xl
            max-h-[42vh]
            object-contain
          "
        />

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold mt-2">
          Page{" "}
          <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Not Found
          </span>
        </h1>

        {/* Description */}
        <p className="mt-3 max-w-xl text-gray-400 text-base md:text-lg leading-relaxed">
          Oops! The page you're looking for doesn't exist
          or has been moved. Let's get you back on track.
        </p>

        {/* Button */}
        <Link
          to="/login"
          className="
            mt-5
            flex items-center gap-3
            px-6 py-3
            rounded-full
            bg-gradient-to-r from-purple-600 to-blue-500
            hover:from-purple-500 hover:to-blue-400
            shadow-lg shadow-purple-500/30
            transition-all duration-300
            hover:scale-105
          "
        >
          <Home size={19} />

          <span className="font-medium">
            Go Back Home
          </span>
        </Link>

      </main>
    </div>
  );
}

