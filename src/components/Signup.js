// src/components/Signup.js
import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { 
  TextField, 
  Button, 
  Typography, 
  Container, 
  Box, 
  Alert,
  CircularProgress 
} from '@mui/material';
import { db } from '../firebase'; // Import your firebase config
import { doc, setDoc } from 'firebase/firestore';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  // Password validation
  const isPasswordValid = (password) => {
    return password.length >= 6;
  };

  // Email validation
  const isEmailValid = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Handle signup form submission
  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    // Validate input
    if (!isEmailValid(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!isPasswordValid(password)) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create a user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        // Add any additional user data you want to store
      });

      console.log('User signed up successfully:', user);
      
      // Show success message
      alert('Sign up successful! Redirecting to dashboard...');
      
      // Navigate to dashboard
      navigate('/');
      
    } catch (err) {
      console.error('Signup error:', err);
      // Handle specific Firebase error codes
      switch (err.code) {
        case 'auth/email-already-in-use':
          setError('This email is already registered. Please use a different email or try logging in.');
          break;
        case 'auth/invalid-email':
          setError('Invalid email address format.');
          break;
        case 'auth/operation-not-allowed':
          setError('Email/password accounts are not enabled. Please contact support.');
          break;
        case 'auth/weak-password':
          setError('Password is too weak. Please use a stronger password.');
          break;
        default:
          setError('Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Box 
        sx={{ 
          maxWidth: 400, 
          margin: 'auto', 
          mt: 4,
          p: 3,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: 'white'
        }}
      >
        <Typography variant="h4" gutterBottom align="center">
          Sign Up
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSignup}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{ mb: 2 }}
            error={!!error && error.includes('email')}
            disabled={loading}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{ mb: 3 }}
            error={!!error && error.includes('password')}
            helperText="Password must be at least 6 characters long"
            disabled={loading}
          />
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            fullWidth
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Sign Up'
            )}
          </Button>
        </form>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2">
            Already have an account?{' '}
            <Button 
              color="primary" 
              onClick={() => navigate('/login')}
              disabled={loading}
            >
              Log In
            </Button>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Signup;
