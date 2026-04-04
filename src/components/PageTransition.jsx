import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function PageTransition({ children }) {
  const location = useLocation();

  useEffect(() => {
    // Reset scroll to top on page change
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div
      key={location.pathname}
      className="animate-fade-in"
    >
      {children}
    </div>
  );
}
