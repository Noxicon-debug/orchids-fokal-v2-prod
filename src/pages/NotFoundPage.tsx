import React from 'react';
import { Link } from 'react-router-dom';
import PageTransition from '../components/common/PageTransition';
import { Home } from 'lucide-react';
import { TribalCorner, TribalZigzag, TribalDiamond } from '../components/common/TribalDecor';

const NotFoundPage: React.FC = () => {
  return (
    <PageTransition>
      <section className="min-h-[70vh] flex items-center justify-center bg-dark-950 relative overflow-hidden">
        {/* Tribal dot pattern background */}
        <div className="tribal-bg-dots" />

        {/* Corner tribal decorations */}
        <TribalCorner className="tribal-corner-deco tribal-corner-tl" color="#0864ed" />
        <TribalCorner className="tribal-corner-deco tribal-corner-br" color="#0864ed" />

        {/* Floating diamond accents */}
        <TribalDiamond className="absolute top-[15%] right-[12%] w-16 h-16 opacity-30" color="#0864ed" />
        <TribalDiamond className="absolute bottom-[18%] left-[10%] w-20 h-20 opacity-20" color="#0864ed" />

        {/* Zigzag accents */}
        <TribalZigzag className="absolute top-[8%] left-1/2 -translate-x-1/2 w-64 h-6 opacity-20" color="#0864ed" />
        <TribalZigzag className="absolute bottom-[8%] left-1/2 -translate-x-1/2 w-64 h-6 opacity-20" color="#0864ed" />

        <div className="container-custom text-center relative z-10">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6">
            4<span className="text-accent-500">0</span>4
          </h1>
          <h2 className="text-2xl md:text-4xl text-white mb-8">
            Page Not Found
          </h2>
          <p className="text-dark-300 max-w-lg mx-auto mb-10">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          <Link to="/" className="btn btn-accent inline-flex items-center">
            <Home size={18} className="mr-2" />
            Back to Home
          </Link>
        </div>
      </section>
    </PageTransition>
  );
};

export default NotFoundPage;
