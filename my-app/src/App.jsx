import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import Login from './components/Auth/Login';
import SignUp from './components/Auth/SignUp';
import BCAUpload from './components/BCA/BCAUpload';
import ProfileSetup from './components/Profile/ProfileSetup';
import './App.css';

function App() {
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'bca', or 'profile'
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <h2>Loading...</h2>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        {authMode === 'login' ? (
          <Login onSwitchToSignUp={() => setAuthMode('signup')} />
        ) : (
          <SignUp
            onSwitchToLogin={() => setAuthMode('login')}
            onSignUpSuccess={() => setAuthMode('login')}
          />
        )}
      </>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>NitroGym</h1>
        <nav className="dashboard-nav">
          <button 
            className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
            onClick={() => setCurrentPage('home')}
          >
            Home
          </button>
          <button 
            className={`nav-link ${currentPage === 'profile' ? 'active' : ''}`}
            onClick={() => setCurrentPage('profile')}
          >
            Profile
          </button>
          <button 
            className={`nav-link ${currentPage === 'bca' ? 'active' : ''}`}
            onClick={() => setCurrentPage('bca')}
          >
            Upload BCA
          </button>
        </nav>
        <button onClick={signOut} className="btn-signout">
          Sign Out
        </button>
      </header>

      <div className="dashboard-content">
        {currentPage === 'home' && (
          <div className="home-content">
            <h2>Welcome back, {user.name}!</h2>
            <p>Email: {user.email}</p>
            <p>Your fitness journey starts here!</p>
            
            <div className="quick-actions">
              <button 
                className="action-card"
                onClick={() => setCurrentPage('profile')}
              >
                <h3>Complete Profile</h3>
                <p>Set up your fitness profile for personalized recommendations</p>
              </button>
              <button 
                className="action-card"
                onClick={() => setCurrentPage('bca')}
              >
                <h3>Upload BCA Report</h3>
                <p>Get started by uploading your body composition analysis</p>
              </button>
            </div>
          </div>
        )}
        
        {currentPage === 'profile' && <ProfileSetup />}
        {currentPage === 'bca' && <BCAUpload />}
      </div>
    </div>
  );
}

export default App;
