import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '10px 20px',
      fontSize: '0.9rem',
      color: '#fff',
      backgroundColor: 'rgba(51, 51, 51, 0.5)', 
      backdropFilter: 'blur(10px)', 
      WebkitBackdropFilter: 'blur(10px)', 
      position: 'fixed',
      bottom: 0,
      width: '100%',
      zIndex: 10,
      borderTop: '1px solid rgba(68, 68, 68, 0.5)',
      opacity: 0.8, 
    }}>
    
      <span>
        Created by Beyazıt Bestami Sarıkaya for Panteon
      </span>
    </footer>
  );
};

export default Footer;
