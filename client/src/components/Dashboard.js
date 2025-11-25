import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Box, Card, CardContent, Typography, Grid, 
  CircularProgress 
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import FavoriteIcon from '@mui/icons-material/Favorite';

const Dashboard = () => {
  const [analytics, setAnalytics] = useState({
    dau: 0,
    mau: 0,
    engagement: {},
    loading: true
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [dauRes, mauRes, engRes] = await Promise.all([
        axios.get('http://localhost:5000/api/analytics/dau'),
        axios.get('http://localhost:5000/api/analytics/mau'),
        axios.get('http://localhost:5000/api/analytics/engagement')
      ]);

      setAnalytics({
        dau: dauRes.data.dau,
        mau: mauRes.data.mau,
        engagement: engRes.data,
        loading: false
      });
    } catch (err) {
      console.error(err);
      setAnalytics(prev => ({ ...prev, loading: false }));
    }
  };

  if (analytics.loading) {
    return <CircularProgress />;
  }

  const StatCard = ({ title, value, icon, color }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          {icon}
          <Typography variant="h6" ml={1}>{title}</Typography>
        </Box>
        <Typography variant="h3" color={color}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" mb={3}>Analytics Dashboard</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <StatCard 
            title="Daily Active Users" 
            value={analytics.dau}
            icon={<PeopleIcon color="primary" />}
            color="primary.main"
          />
        </Grid>
        
        <Grid item xs={12} md={3}>
          <StatCard 
            title="Monthly Active Users" 
            value={analytics.mau}
            icon={<TrendingUpIcon color="success" />}
            color="success.main"
          />
        </Grid>
        
        <Grid item xs={12} md={3}>
          <StatCard 
            title="Total Posts" 
            value={analytics.engagement.totalPosts || 0}
            icon={<FavoriteIcon color="error" />}
            color="error.main"
          />
        </Grid>
        
        <Grid item xs={12} md={3}>
          <StatCard 
            title="Avg Engagement" 
            value={(analytics.engagement.avgLikes || 0).toFixed(1)}
            icon={<FavoriteIcon color="secondary" />}
            color="secondary.main"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
