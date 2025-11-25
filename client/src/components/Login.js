import React, { useState } from 'react';
import { 
  Card, CardContent, TextField, Button, Typography, 
  Box, Alert, Tabs, Tab 
} from '@mui/material';
import axios from 'axios';

const Login = ({ onLogin }) => {
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = tabValue === 0 ? 'login' : 'register';
      const payload = tabValue === 0 
        ? { email: formData.email, password: formData.password }
        : formData;

      const res = await axios.post(
        `http://localhost:5000/api/auth/${endpoint}`,
        payload
      );

      onLogin(res.data.token, res.data.user);
    } catch (err) {
      setError(err.response?.data?.msg || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '70vh' 
      }}
    >
      <Card sx={{ maxWidth: 450, width: '100%' }}>
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
            Microblog Analytics
          </Typography>
          
          <Tabs 
            value={tabValue} 
            onChange={(e, newValue) => setTabValue(newValue)}
            centered
            sx={{ mb: 3 }}
          >
            <Tab label="Login" />
            <Tab label="Register" />
          </Tabs>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            {tabValue === 1 && (
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                margin="normal"
                required
              />
            )}
            
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
            />
            
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              sx={{ mt: 3 }}
              disabled={loading}
            >
              {loading ? 'Processing...' : (tabValue === 0 ? 'Login' : 'Register')}
            </Button>
          </form>

          {tabValue === 0 && (
            <Alert severity="info" sx={{ mt: 2 }}>
              <strong>Demo credentials:</strong><br />
              Email: harsh@example.com<br />
              Password: password123
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
