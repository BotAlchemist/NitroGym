import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import Login from './components/Auth/Login';
import SignUp from './components/Auth/SignUp';
import './App.css';

function App() {
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
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
        <h1>Welcome to NitroGym, {user.name}!</h1>
        <button onClick={signOut} className="btn-signout">
          Sign Out
        </button>
      </header>

      <div className="dashboard-content">
        <p>Email: {user.email}</p>
        <p>Your fitness journey starts here!</p>
        {/* Add more dashboard content here */}
      </div>
    </div>
  );
}

export default App;
