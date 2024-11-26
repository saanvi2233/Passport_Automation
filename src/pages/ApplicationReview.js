import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getApplications, updateApplicationStatusInFirestore } from '../firebase'; // Import Firebase function
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  Paper,
  Chip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ApplicationReview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { newApplication, message } = location.state || {};
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

  const handleBack = () => {
    navigate('/apply');
  };

  const handleAccept = (applicationId) => {
   
  };

  const handleReject = async (applicationId) => {
    try {
      // Update the application status to "Rejected" in Firestore
      await updateApplicationStatusInFirestore(applicationId, 'Rejected');

      // Update the local state to reflect the changes
      setApplications((prevApplications) =>
        prevApplications.map((app) =>
          app.id === applicationId ? { ...app, status: 'Rejected' } : app
        )
      );

      console.log(`Application ID ${applicationId} rejected successfully.`);
    } catch (error) {
      console.error(`Error rejecting Application ID ${applicationId}:`, error);
    }
  };

  const handleverify=async(applicationId)=>{
     // Navigate to document verification page after accepting the application
     navigate('/verification', {
      state: {
        applicationId,
        message: `Verifying documents for Application ID: ${applicationId}`,
      },
    });
    try{
      await updateApplicationStatusInFirestore(applicationId,'Verified');

      setApplications((prevApplications)=>
        prevApplications.map((app)=>
          app.id===applicationId?{...app,status:'Verified'}:app
        ));
        console.log(`Application ID ${applicationId} verified successfully.`);
    }catch(error){
      console.log(`Error verifying Application ID ${applicationId}:`,error)
    }
  }

  return (
    <Box sx={{ maxWidth: '1200px', margin: 'auto', padding: 2 }}>
      {/* Back Button */}
      <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mb: 2 }}>
        Back to Application Form
      </Button>

      {/* Review Card */}
      {/* <Card sx={{ mb: 4 }}> */}
        {/* <CardContent> */}
          {/* <Typography variant="h5" gutterBottom>
            Application Review
          </Typography> */}
{/* 
          {newApplication ? (
            <>
              <TableContainer component={Paper} sx={{ mb: 4 }}>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>Application ID</TableCell>
                      <TableCell>{newApplication.id}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Full Name</TableCell>
                      <TableCell>{newApplication.name}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Date of Birth</TableCell>
                      <TableCell>
                        {newApplication.personalInfo.dateOfBirth
                          ? new Date(newApplication.personalInfo.dateOfBirth).toLocaleDateString()
                          : 'Not provided'}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Nationality</TableCell>
                      <TableCell>{newApplication.personalInfo.nationality}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Passport Type</TableCell>
                      <TableCell>{newApplication.type}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Status</TableCell>
                      <TableCell>{newApplication.status}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Priority</TableCell>
                      <TableCell>{newApplication.priority}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Date Submitted</TableCell>
                      <TableCell>{newApplication.dateSubmitted}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              <Typography variant="h6" gutterBottom>
                Required Documents
              </Typography>
              <Grid container spacing={2} sx={{ mb: 4 }}>
                {newApplication.documents.map((doc, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Typography variant="body1">• {doc}</Typography>
                  </Grid>
                ))}
              </Grid>
            </>
          ) : (
            <Typography color="error">
              No application data found. Please submit an application first.
            </Typography>
          )}
        </CardContent> */}
      {/* </Card> */}

      {/* All Applications Table */}
      <Typography variant="h5" gutterBottom>
        All Applications
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Application ID</TableCell>
              <TableCell>Applicant Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applications.map((app) => (
              <TableRow key={app.id}>
                <TableCell>{app.id}</TableCell>
                <TableCell>{app.personalInfo?.fullName || 'N/A'}</TableCell>
                <TableCell>
                          <Chip
                            label={app.applicationStatus?.status || 'N/A'}
                            color={getStatusColor(app.applicationStatus?.status)}
                            size="small"
                          />
                        </TableCell>
                <TableCell>{app.priority || 'Normal'}</TableCell>
                <TableCell>
                  <Grid container spacing={1}>
                    <Grid item>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleverify(app.id)}
                      >
                        Accept
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleReject(app.id)}
                      >
                        Reject
                      </Button>
                    </Grid>
                  </Grid>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ApplicationReview;
