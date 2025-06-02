import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const cardTypes = [
  {
    id: 'classic',
    name: 'Classic',
    icon: '/images/card-classic.svg',
    description: 'Everyday banking with no annual fee'
  },
  {
    id: 'optimo',
    name: 'Optimo',
    icon: '/images/card-optimo.svg',
    description: 'Optimized rewards for daily spending'
  },
  {
    id: 'femme',
    name: 'Femme',
    icon: '/images/card-femme.svg',
    description: 'Tailored benefits for women\'s lifestyle'
  },
  {
    id: 'gold',
    name: 'Gold',
    icon: '/images/card-gold.svg',
    description: 'Premium travel & entertainment perks'
  },
  {
    id: 'platinum',
    name: 'Platinum',
    icon: '/images/card-platinum.svg',
    description: 'Exclusive benefits for high-tier clients'
  }
];

const benefits = [
  {
    icon: '💳',
    title: 'Custom Cards',
    description: 'Choose from 5 different card types tailored to your lifestyle'
  },
  {
    icon: '🔒',
    title: 'Secure Banking',
    description: 'Advanced security features to protect your finances'
  },
  {
    icon: '🌟',
    title: 'Rewards Program',
    description: 'Earn points on every purchase and redeem for amazing perks'
  }
];

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    country: '',
    city: '',
    transactionVolume: 100,
    salary: 50000,
    debt: 0,
    cardType: ''
  });
  
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    // Hide intro after animation completes
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 2800);
    
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const value = e.target.type === 'number' 
      ? parseInt(e.target.value, 10) || 0 
      : e.target.value;
      
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const selectCard = (cardType) => {
    setFormData({
      ...formData,
      cardType
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    setError('');
    
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await axios.post(`${apiUrl}/api/waitlist`, formData);
      
      setMessage(response.data.message || 'Thank you! You have been added to our waitlist.');
      setFormData({
        name: '',
        email: '',
        country: '',
        city: '',
        transactionVolume: 100,
        salary: 50000,
        debt: 0,
        cardType: ''
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="App">
      {showIntro && (
        <div className="intro-overlay">
          <img src="/images/logo.svg" alt="FinCard Logo" className="intro-logo" />
          <h1 className="intro-text">Welcome to FinCard</h1>
          <p className="intro-tagline">Financial freedom at your fingertips</p>
        </div>
      )}
      
      <header className="App-header">
        <img src="/images/logo.svg" alt="FinCard Logo" className="logo" />
        <h1>FinCard Waitlist</h1>
        <p className="tagline">Join the waitlist for our revolutionary financial services</p>
        <img src="/images/header.svg" alt="FinCard Cards" className="header-image" />
      </header>

      <section className="intro-section">
        <h2>The Future of Finance</h2>
        <p>FinCard offers a suite of modern financial solutions designed to fit your lifestyle. Join our exclusive waitlist today to get early access to our innovative card offerings.</p>
        
        <div className="benefits">
          {benefits.map((benefit, index) => (
            <div key={index} className="benefit">
              <div className="benefit-icon">{benefit.icon}</div>
              <h3>{benefit.title}</h3>
              <p>{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="form-container">
        <div className="form-heading">
          <h2>Join the Revolution</h2>
          <p>Be among the first to experience the future of financial freedom</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="country">Country</label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="transactionVolume">
                Daily Transaction Volume (USD): ${formData.transactionVolume}
              </label>
              <input
                type="range"
                id="transactionVolume"
                name="transactionVolume"
                min="0"
                max="10000"
                step="100"
                value={formData.transactionVolume}
                onChange={handleChange}
                className="slider"
                required
              />
              <div className="range-values">
                <span>$0</span>
                <span>$10,000+</span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="salary">
                Annual Salary (USD): ${formData.salary.toLocaleString()}
              </label>
              <input
                type="range"
                id="salary"
                name="salary"
                min="0"
                max="500000"
                step="5000"
                value={formData.salary}
                onChange={handleChange}
                className="slider"
                required
              />
              <div className="range-values">
                <span>$0</span>
                <span>$500,000+</span>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="debt">
                Current Debt (USD): ${formData.debt.toLocaleString()}
              </label>
              <input
                type="range"
                id="debt"
                name="debt"
                min="0"
                max="250000"
                step="1000"
                value={formData.debt}
                onChange={handleChange}
                className="slider"
                required
              />
              <div className="range-values">
                <span>$0</span>
                <span>$250,000+</span>
              </div>
            </div>
          </div>

          <div className="card-section">
            <h2 className="card-section-title">Select Your Preferred Card</h2>
            <div className="card-options">
              {cardTypes.map(card => (
                <div
                  key={card.id}
                  className={`card-option ${card.id} ${formData.cardType === card.id ? 'selected' : ''}`}
                  onClick={() => selectCard(card.id)}
                >
                  <img src={card.icon} alt={card.name} className="card-icon" />
                  <p className="card-name">{card.name}</p>
                  <p className="card-description">{card.description}</p>
                </div>
              ))}
            </div>
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Join Waitlist'}
          </button>
        </form>

        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}
      </div>

      <footer className="footer">
        <p>© {new Date().getFullYear()} FinCard. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;