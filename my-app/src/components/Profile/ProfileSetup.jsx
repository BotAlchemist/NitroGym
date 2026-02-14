import { useState } from 'react';
import { saveProfile } from '../../services/profileService';
import './ProfileSetup.css';

const ProfileSetup = () => {
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    height: '',
    weight: '',
    goal: '',
    activityLevel: '',
    dietaryPreference: '',
    injuries: [],
    experience: '',
    daysPerWeek: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInjuryChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      injuries: checked
        ? [...prev.injuries, value]
        : prev.injuries.filter(i => i !== value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validate required fields
    if (!formData.age || !formData.gender || !formData.height || !formData.weight ||
        !formData.goal || !formData.activityLevel || !formData.dietaryPreference) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      // Save to S3 via API Gateway
      await saveProfile(formData);
      
      // Also save to localStorage for quick access
      localStorage.setItem('userProfile', JSON.stringify(formData));
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-setup-container">
      <div className="profile-header">
        <h1>Complete Your Profile</h1>
        <p className="profile-subtitle">
          Help us personalize your fitness journey with accurate recommendations
        </p>
      </div>

      <form onSubmit={handleSubmit} className="profile-form">
        {error && <div className="message error-message">{error}</div>}
        {success && (
          <div className="message success-message">
            Profile saved successfully!
          </div>
        )}

        {/* Essential Fields */}
        <div className="form-section">
          <h2 className="section-title">Essential Information</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="age">Age <span className="required">*</span></label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Enter your age"
                min="15"
                max="100"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="gender">Gender <span className="required">*</span></label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="height">Height (cm) <span className="required">*</span></label>
              <input
                type="number"
                id="height"
                name="height"
                value={formData.height}
                onChange={handleChange}
                placeholder="170"
                min="100"
                max="250"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="weight">Current Weight (kg) <span className="required">*</span></label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="70"
                min="30"
                max="300"
                step="0.1"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="goal">Primary Goal <span className="required">*</span></label>
            <select
              id="goal"
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              required
            >
              <option value="">Select your primary goal</option>
              <option value="lose-fat">Lose Fat</option>
              <option value="gain-muscle">Gain Muscle</option>
              <option value="recomposition">Recomposition</option>
              <option value="improve-stamina">Improve Stamina</option>
              <option value="general-fitness">General Fitness</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="activityLevel">Activity Level <span className="required">*</span></label>
            <select
              id="activityLevel"
              name="activityLevel"
              value={formData.activityLevel}
              onChange={handleChange}
              required
            >
              <option value="">Select activity level</option>
              <option value="sedentary">Sedentary (little to no exercise)</option>
              <option value="lightly-active">Lightly Active (1-3 days/week)</option>
              <option value="moderately-active">Moderately Active (3-5 days/week)</option>
              <option value="very-active">Very Active (6-7 days/week)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="dietaryPreference">Dietary Preference <span className="required">*</span></label>
            <select
              id="dietaryPreference"
              name="dietaryPreference"
              value={formData.dietaryPreference}
              onChange={handleChange}
              required
            >
              <option value="">Select dietary preference</option>
              <option value="no-restrictions">No Restrictions (Veg, Egg & Non-Veg)</option>
              <option value="veg">Vegetarian</option>
              <option value="eggitarian">Eggitarian</option>
              <option value="non-veg">Non-Vegetarian</option>
              <option value="jain">Jain</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Optional Fields */}
        <div className="form-section">
          <h2 className="section-title">Additional Information (Optional)</h2>

          <div className="form-group">
            <label>Injuries / Medical Conditions</label>
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  value="knee-pain"
                  checked={formData.injuries.includes('knee-pain')}
                  onChange={handleInjuryChange}
                />
                Knee Pain
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  value="back-pain"
                  checked={formData.injuries.includes('back-pain')}
                  onChange={handleInjuryChange}
                />
                Back Pain
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  value="diabetes"
                  checked={formData.injuries.includes('diabetes')}
                  onChange={handleInjuryChange}
                />
                Diabetes
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  value="thyroid"
                  checked={formData.injuries.includes('thyroid')}
                  onChange={handleInjuryChange}
                />
                Thyroid
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  value="none"
                  checked={formData.injuries.includes('none')}
                  onChange={handleInjuryChange}
                />
                None
              </label>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="experience">Workout Experience</label>
              <select
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
              >
                <option value="">Select experience level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="daysPerWeek">Available Days per Week</label>
              <select
                id="daysPerWeek"
                name="daysPerWeek"
                value={formData.daysPerWeek}
                onChange={handleChange}
              >
                <option value="">Select days</option>
                <option value="3">3 days</option>
                <option value="4">4 days</option>
                <option value="5">5 days</option>
                <option value="6">6 days</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSetup;
