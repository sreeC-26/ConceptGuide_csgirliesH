import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';

export default function AuthModal({ isOpen, onClose, mode = 'signin' }) {
  const [currentMode, setCurrentMode] = useState(mode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuthStore();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = currentMode === 'signin' 
      ? await signIn(email, password)
      : await signUp(email, password);

    setLoading(false);

    if (result.success) {
      onClose();
      setEmail('');
      setPassword('');
    } else {
      setError(result.error || 'An error occurred');
    }
  };

  const switchMode = () => {
    setCurrentMode(currentMode === 'signin' ? 'signup' : 'signin');
    setError('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
      <div className="gradient-border rounded-lg p-6 max-w-md w-full mx-4" style={{ backgroundColor: '#2D2D2D' }}>
        <div className="window-controls mb-4">
          <div className="window-dot window-dot-red"></div>
          <div className="window-dot window-dot-yellow"></div>
          <div className="window-dot window-dot-green"></div>
        </div>
        
        <h2 className="text-2xl mb-4" style={{ fontFamily: 'Poppins, sans-serif', color: '#FFFFFF' }}>
          {currentMode === 'signin' ? 'Sign In' : 'Sign Up'}
        </h2>

        {error && (
          <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: '#3A1A1A', border: '1px solid #FF5F56' }}>
            <p className="text-sm" style={{ fontFamily: 'Poppins, sans-serif', color: '#FF5F56' }}>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 text-sm" style={{ fontFamily: 'Poppins, sans-serif', color: '#F5D9E4' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 rounded-lg"
              style={{
                fontFamily: 'Poppins, sans-serif',
                backgroundColor: '#1A1A1A',
                border: '1px solid #FF4081',
                color: '#F5D9E4',
                outline: 'none'
              }}
            />
          </div>

          <div>
            <label className="block mb-2 text-sm" style={{ fontFamily: 'Poppins, sans-serif', color: '#F5D9E4' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 rounded-lg"
              style={{
                fontFamily: 'Poppins, sans-serif',
                backgroundColor: '#1A1A1A',
                border: '1px solid #FF4081',
                color: '#F5D9E4',
                outline: 'none'
              }}
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1"
            >
              {loading ? 'Loading...' : (currentMode === 'signin' ? 'Sign In' : 'Sign Up')}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={switchMode}
            className="text-sm underline"
            style={{ fontFamily: 'Poppins, sans-serif', color: '#FF4081' }}
          >
            {currentMode === 'signin' 
              ? "Don't have an account? Sign up" 
              : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}

