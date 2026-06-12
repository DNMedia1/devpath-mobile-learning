import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // 'instant' overrides the global smooth scroll-behavior, which the route
    // transition would otherwise interrupt mid-animation
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}
