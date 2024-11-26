import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Button,
  CircularProgress,
} from '@mui/material';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust the import path as needed

const RecentApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const applicationsRef = collection(db, 'applications');
      const q = query(applicationsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const applicationsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convert timestamps to readable format
        dateSubmitted: doc.data().createdAt?.toDate().toLocaleDateString() || 'N/A',
      }));

      console.log('Fetched applications:', applicationsData); // Add this line to log fetched data

      // Filter out applications with status 'rejected'
      const filteredApplications = applicationsData.filter(app => app.status?.toLowerCase() !== 'rejected');
      console.log('Filtered applications:', filteredApplications); // Add this line to log filtered data
      
      setApplications(filteredApplications);
    } catch (err) {
      console.error("Error fetching applications:", err);
      setError("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleViewApplication = (applicationId) => {
    // Add your navigation logic here
    console.log('Viewing application:', applicationId);
  };

  if (loading) {
    return (
      <Grid container justifyContent="center" sx={{ py: 3 }}>
        <CircularProgress />
      </Grid>
    );
  }

  if (error) {
    return (
      <Grid container justifyContent="center" sx={{ py: 3 }}>
        <Typography color="error">{error}</Typography>
      </Grid>
    );
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Applications
            </Typography>
            {applications.length === 0 ? (
              <Typography color="textSecondary" align="center" sx={{ py: 3 }}>
                No applications found
              </Typography>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Applicant Name</TableCell>
                      <TableCell>Application ID</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Date Submitted</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {applications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell>
                          {app.firstName} {app.lastName}
                        </TableCell>
                        <TableCell>{app.id}</TableCell>
                        <TableCell>{app.applicationType || 'Regular'}</TableCell>
                        <TableCell>{app.dateSubmitted}</TableCell>
                        <TableCell>
                          <Chip
                            label={app.status || 'Pending'}
                            color={getStatusColor(app.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleViewApplication(app.id)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default RecentApplications;
