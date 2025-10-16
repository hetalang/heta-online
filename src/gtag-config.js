/* Global site tag (gtag.js) - Google Analytics */

const GA_MEASUREMENT_ID = 'G-3D4WTJ03NM';

// Loading gtag.js dynamically (without inlining in HTML)
(function loadGAScript(){
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`;
  document.head.appendChild(s);
})();

// Setting up the gtag function
window.dataLayer = window.dataLayer || [];
function gtag(){ window.dataLayer.push(arguments); }

// Base initialization and config
gtag('js', new Date());
gtag('config', GA_MEASUREMENT_ID);
