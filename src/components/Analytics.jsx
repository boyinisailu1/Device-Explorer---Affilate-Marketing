import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Analytics Component
 * 
 * This component handles page view tracking for Google Analytics (GA4).
 * It listens to route changes and sends a pageview event to window.gtag.
 * 
 * To use:
 * 1. Add your GA4 Measurement ID to .env as VITE_GA_ID
 * 2. This component is already integrated in App.jsx
 */

const GA_ID = import.meta.env.VITE_GA_ID;

export default function Analytics() {
  const location = useLocation();

  useEffect(() => {
    if (!GA_ID || typeof window.gtag !== 'function') return;

    // Send pageview to GA4
    window.gtag('config', GA_ID, {
      page_path: location.pathname + location.search,
    });
  }, [location]);

  return null;
}

/**
 * Utility function to track custom events
 * @param {string} action - e.g., 'compare_devices'
 * @param {object} params - e.g., { device_count: 3 }
 */
export const trackEvent = (action, params = {}) => {
  if (!GA_ID || typeof window.gtag !== 'function') return;
  window.gtag('event', action, params);
};
