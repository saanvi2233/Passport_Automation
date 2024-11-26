import React, { useState, useEffect } from 'react';
import { 
  Box, Grid, Card, Typography, CardContent, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button 
} from '@mui/material';
import { NoteAdd, VerifiedUser, Assessment, TrendingUp } from '@mui/icons-material';
import { getApplications } from '../firebase';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const stats = [
    {
      title: 'Pending Verifications',
      value: '1',
      icon: <VerifiedUser />,
      color: '#2e7d32',
      increase: '+8%',
    },
    {
      title: 'Ready for Issuance',
      value: '3',
      icon: <NoteAdd />,
      color: '#ed6c02',
      increase: '+8%',
    },
  ];

  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await getApplications();
        setApplications(data);
      } catch (error) {
        console.error('Error fetching applications:', error);
      }
    };

    fetchApplications();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending Review':
        return 'warning';
      case 'Approved':
        return 'success';
      case 'Rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Welcome Section */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          color: 'white',
        }}
      >
        <Typography variant="h4" gutterBottom>
          Welcome to Passport Administration
        </Typography>
        <Typography variant="subtitle1">
          Here's what's happening with your passport applications today.
        </Typography>
      </Paper>

      {/* Stats Cards */}
       {/* Stats Cards */}
       <Grid container spacing={3} sx={{ mb: 3 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      backgroundColor: stat.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      mr: 2,
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Typography variant="h6">{stat.title}</Typography>
                </Box>
                <Typography variant="h4" sx={{ mt: 1 }}>
                  {stat.value}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {stat.increase} from last week
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      

      {/* Recent Applications */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Applications
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Full Name</TableCell>
                      <TableCell>Application ID</TableCell>
                      <TableCell>Passport Type</TableCell>
                      <TableCell>Purpose</TableCell>
                      <TableCell>Submission Date</TableCell>
                      <TableCell>Application Status</TableCell>
                      {/* <TableCell>Verification Status</TableCell> */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {applications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell>{app.personalInfo?.fullName || 'N/A'}</TableCell>
                        <TableCell>{app.id}</TableCell>
                        <TableCell>{app.passportDetails?.type || 'N/A'}</TableCell>
                        <TableCell>{app.passportDetails?.purpose || 'N/A'}</TableCell>
                        <TableCell>
              {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : new Date().toLocaleDateString()}
                        </TableCell>

                        <TableCell>
                          <Chip
                            label={app.applicationStatus?.status || 'N/A'}
                            color={getStatusColor(app.applicationStatus?.status)}
                            size="small"
                          />
                        </TableCell>
                        {/* <TableCell>
                          <Chip
                            label={
                              app.verificationStatus?.documentsVerified &&
                              app.verificationStatus?.biometricVerified
                                ? 'Verified'
                                : 'Pending'
                            }
                            color={
                              app.verificationStatus?.documentsVerified &&
                              app.verificationStatus?.biometricVerified
                                ? 'success'
                                : 'warning'
                            }
                            size="small"
                          />
                        </TableCell> */}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Link to="/apply" style={{ textDecoration: 'none' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    startIcon={<NoteAdd />}
                    sx={{
                      height: '48px',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        transition: 'transform 0.2s',
                      },
                    }}
                  >
                    New Application
                  </Button>
                </Link>
                <Link to="/verification" style={{ textDecoration: 'none' }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    startIcon={<VerifiedUser />}
                    sx={{
                      height: '48px',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        transition: 'transform 0.2s',
                      },
                    }}
                  >
                    Verify Documents
                  </Button>
                </Link>
                <Link to="/reports" style={{ textDecoration: 'none' }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    startIcon={<Assessment />}
                    sx={{
                      height: '48px',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        transition: 'transform 0.2s',
                      },
                    }}
                  >
                    Generate Reports
                  </Button>
                </Link>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
