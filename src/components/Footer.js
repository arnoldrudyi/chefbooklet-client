import React from "react";

import '../styles/Footer.css';

export default function Footer({ showLogin, showSignup }) {
  const scroll = () => {
    const element = document.getElementById('manual');

    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer>
      <div className="footer-wrapper" style={showSignup || showLogin ? { filter: "blur(5px)" } : {}}>
        <div className="footer-divider"></div>
        <div className="footer-content">
          <span style={{ color: '#CFCFCF', opacity: 0.8, fontWeight: '500' }}>&#169; 2024 ChefBooklet</span>
          <div className="footer-links">
            <span onClick={() => window.open('https://github.com/arnoldrudyi/chefbooklet-server')}>Contribute</span>
            <span onClick={() => {
              if (window.location.pathname === '/') {
                scroll();
              } else {
                window.location.href = "/?scrollToManual=true";
              }
            }}>How to use</span>
            <span onClick={() => window.location.href = "/"}>Get started</span>
          </div>
        </div>
      </div>
    </footer>
  );
};