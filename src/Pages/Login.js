import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory, useNavigate } from 'react-router-dom'; // To handle redirection
import '../Css/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setErrorMessage("Both email and password are required");
      return;
    }

    try {
      const response = await axios.post('http://3.110.25.152:5000/v2/api/login', { email, password });

      if (response.data.token && response.data.jwt) {
        // Store the tokens in localStorage
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('jwtToken', response.data.jwt);

        
        navigate('/dashboard');
      }
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.message || "An error occurred");
      } else {
        setErrorMessage("Network error. Please try again later.");
      }
    }
  };

  useEffect(() => {
    const redictback = () => {
      const auth = localStorage.getItem('authToken');
      if (auth) {
        navigate('/dashboard');
      }
    };

    redictback();
  }, []);

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Admin Login</h2>
        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <p className="forgot-password">Forgot your password? <a href="#">Click here</a></p>
      </div>
    </div>
  );
};

export default Login;
