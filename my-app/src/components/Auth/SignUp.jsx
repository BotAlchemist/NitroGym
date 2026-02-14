import { useState } from 'react';
import { signUp, confirmSignUp } from '../../services/authService';
import './Auth.css';

const SignUp = ({ onSwitchToLogin, onSignUpSuccess }) => {
  const [step, setStep] = useState('signup'); // 'signup' or 'verify'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  });
  const [username, setUsername] = useState(''); // Store username from signup
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

    // Validation
    if (!formData.email || !formData.password || !formData.name) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const result = await signUp(formData.email, formData.password, formData.name);
      setUsername(result.username); // Store username for verification
      setStep('verify');
    } catch (err) {
      setError(err.message || 'Failed to sign up. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');

    if (!verificationCode) {
      setError('Please enter the verification code');
      return;
    }

    setLoading(true);

    try {
      await confirmSignUp(username, verificationCode);
      onSignUpSuccess && onSignUpSuccess();
    } catch (err) {
      setError(err.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'verify') {
    return (
      <div className="auth-container">
        <div className="auth-branding">
          <div className="branding-content">
            <h1 className="brand-title">NitroGym</h1>
            <p className="brand-tagline">Transform Your Body, Transform Your Life</p>
          </div>
        </div>
        <div className="auth-box">
          <h2>Verify Email</h2>
          <p className="auth-subtitle">
            We sent a verification code to <strong>{formData.email}</strong>
          </p>

          <form onSubmit={handleVerify}>
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label htmlFor="code">Verification Code</label>
              <input
                type="text"
                id="code"
                value={verificationCode}
                onChange={(e) => {
                  setVerificationCode(e.target.value);
                  setError('');
                }}
                placeholder="Enter 6-digit code"
                maxLength="6"
                disabled={loading}
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>
          </form>

          <p className="auth-footer">
            Didn't receive the code?{' '}
            <button className="link-button" onClick={() => setStep('signup')}>
              Try signing up again
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-branding">
        <div className="branding-content">
          <h1 className="brand-title">NitroGym</h1>
          <p className="brand-tagline">Transform Your Body, Transform Your Life</p>
          <div className="brand-features">
            <div className="feature-item">
              <span className="feature-icon">🎯</span>
              <div>
                <h3>AI-Powered Plans</h3>
                <p>Personalized workout and diet plans based on your BCA</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📊</span>
              <div>
                <h3>Track Progress</h3>
                <p>Monitor your daily goals and achievements</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">💬</span>
              <div>
                <h3>Real-Time Coaching</h3>
                <p>Chat with AI coach throughout your journey</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="auth-box">
        <h2>Create Account</h2>
        <p className="auth-subtitle">Join NitroGym and start your fitness journey</p>

        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              disabled={loading}
            />
          </div>

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
              placeholder="Min. 8 characters"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter password"
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{' '}
          <button className="link-button" onClick={onSwitchToLogin}>
            Log In
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
