import { useState } from 'react';
import { signIn } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const Login = ({ onSwitchToSignUp }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { checkUser } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      await signIn(formData.email, formData.password);
      await checkUser();
    } catch (err) {
      if (err.code === 'UserNotConfirmedException') {
        setError('Please verify your email before logging in');
      } else if (err.code === 'NotAuthorizedException') {
        setError('Incorrect email or password');
      } else if (err.code === 'UserNotFoundException') {
        setError('User does not exist');
      } else {
        setError(err.message || 'Failed to log in. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-branding">
        <div className="branding-content">
          <h1 className="brand-title">NitroGym</h1>
          <p className="brand-tagline">Transform Your Body, Transform Your Life</p>
          <div className="brand-features">
            <div className="feature-item">
              <div>
                <h3>AI-Powered Plans</h3>
                <p>Personalized workout and diet plans based on your BCA</p>
              </div>
            </div>
            <div className="feature-item">
              <div>
                <h3>Track Progress</h3>
                <p>Monitor your daily goals and achievements</p>
              </div>
            </div>
            <div className="feature-item">
              <div>
                <h3>Real-Time Coaching</h3>
                <p>Chat with AI coach throughout your journey</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="auth-box">
        <h2>Welcome Back</h2>
        <p className="auth-subtitle">Log in to continue your fitness journey</p>

        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              disabled={loading}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account?{' '}
          <button className="link-button" onClick={onSwitchToSignUp}>
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
