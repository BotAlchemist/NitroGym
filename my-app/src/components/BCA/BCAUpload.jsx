import { useState } from 'react';
import { uploadBCAData } from '../../services/bcaService';
import './BCAUpload.css';

const BCAUpload = () => {
  const [bcaData, setBcaData] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!bcaData.trim()) {
      setError('Please enter your BCA report data');
      return;
    }

    setLoading(true);

    try {
      await uploadBCAData(bcaData);
      setSuccess(true);
      setBcaData('');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to upload BCA data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bca-upload-container">
      <div className="bca-upload-header">
        <h1>Upload BCA Report</h1>
        <p className="bca-subtitle">
          Paste your Body Composition Analysis report below. This data will help us create
          a personalized fitness and nutrition plan for you.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bca-form">
        {error && <div className="message error-message">{error}</div>}
        {success && (
          <div className="message success-message">
            BCA report uploaded successfully!
          </div>
        )}

        <div className="form-group">
          <label htmlFor="bcaData">BCA Report Data</label>
          <textarea
            id="bcaData"
            value={bcaData}
            onChange={(e) => setBcaData(e.target.value)}
            placeholder="Paste your complete BCA report here...

Example format:
- Weight: 75 kg
- Body Fat: 18%
- Muscle Mass: 60 kg
- BMR: 1650 kcal
- Visceral Fat: 8
..."
            rows={15}
            disabled={loading}
          />
          <span className="char-count">{bcaData.length} characters</span>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setBcaData('')}
            disabled={loading || !bcaData}
          >
            Clear
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading || !bcaData.trim()}
          >
            {loading ? 'Uploading...' : 'Save BCA Report'}
          </button>
        </div>
      </form>

      <div className="bca-info">
        <h3>What is BCA?</h3>
        <p>
          Body Composition Analysis (BCA) provides detailed metrics about your body including
          body fat percentage, muscle mass, water content, and more. This information helps
          create accurate fitness and nutrition plans tailored to your goals.
        </p>
      </div>
    </div>
  );
};

export default BCAUpload;
