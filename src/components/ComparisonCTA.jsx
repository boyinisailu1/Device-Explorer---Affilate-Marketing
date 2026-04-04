import { Link } from 'react-router-dom';
import { BarChart3, ArrowRight } from 'lucide-react';

export default function ComparisonCTA() {
  return (
    <div className="py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass rounded-3xl p-8 md:p-12 border border-white/10 relative overflow-hidden group">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Glowing orb */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/20 blur-3xl rounded-full group-hover:bg-blue-500/30 transition-all duration-500"></div>
          
          <div className="relative z-10">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-3 flex-shrink-0">
                <BarChart3 className="w-full h-full text-white" />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Compare Devices Side by Side
                </h3>
                <p className="text-gray-400 text-lg">
                  Don't guess—know exactly how devices stack up against each other. Compare specs, prices, and features in seconds.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link 
                to="/compare" 
                className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full font-bold text-white hover:shadow-[0_0_40px_rgba(59,130,246,0.6)] transition-all group/btn"
              >
                Start Comparing
                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
              
              <Link 
                to="/devices" 
                className="flex items-center justify-center gap-2 px-8 py-4 glass rounded-full font-bold text-white glass-hover transition-all"
              >
                Browse All Devices
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
