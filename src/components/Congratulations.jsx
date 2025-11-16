import { useEffect, useState } from 'react';

export default function Congratulations({ onComplete }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
    const timer = setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, 3000); 

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-300">
      <div 
        className={`gradient-border rounded-lg p-12 max-w-2xl mx-4 text-center transition-all duration-500 transform ${
          show ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
        }`}
        style={{ backgroundColor: '#2D2D2D' }}
      >
        <div className="window-controls mb-6">
          <div className="window-dot window-dot-red"></div>
          <div className="window-dot window-dot-yellow"></div>
          <div className="window-dot window-dot-green"></div>
        </div>
        
        <div className="text-8xl mb-6 animate-bounce">🎉</div>
        
        <h2 className="text-4xl mb-4" style={{ fontFamily: 'Poppins, sans-serif', color: '#FFFFFF', fontWeight: 'bold' }}>
          Congratulations!
        </h2>
        
        <p className="text-xl mb-6" style={{ fontFamily: 'Poppins, sans-serif', color: '#F5D9E4' }}>
          You've completed your personalized learning path!
        </p>
        
        <p className="text-lg" style={{ fontFamily: 'Poppins, sans-serif', color: '#FF4081' }}>
          Returning to home screen...
        </p>
      </div>
    </div>
  );
}
