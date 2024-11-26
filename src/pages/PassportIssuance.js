import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Paper,
  CircularProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Print, Send } from '@mui/icons-material';
import { savePassportData } from '../firebase';
import { getFirestore, collection, getDocs } from 'firebase/firestore'; // Firebase imports

const PassportIssuance = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const [passportData, setPassportData] = useState({
    passportNumber: '',
    applicantName: '',
    issuingAuthority: '',
    issueDate: '',
    expiryDate: '',
    trackingNumber: '',
    deliveryAddress: '',
  });

  const [recentPassports, setRecentPassports] = useState([]); // State to store recent passports

  const steps = ['Generate Passport', 'Review Details', 'Dispatch Passport'];

  useEffect(() => {
    // Fetch recent passport data from Firestore when the component mounts
    const fetchRecentPassports = async () => {
      const db = getFirestore();
      const passportsRef = collection(db, 'passports');
      const querySnapshot = await getDocs(passportsRef);
      const passports = [];
      querySnapshot.forEach((doc) => {
        passports.push({ id: doc.id, ...doc.data() });
      });
      setRecentPassports(passports); // Update the state with the fetched data
    };

    fetchRecentPassports();
  }, []); // Empty array means this runs once when the component is mounted

  const handleNext = async () => {
    if (activeStep === 0) {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API delay
      setPassportData({
        ...passportData,
        passportNumber: 'P' + Math.random().toString().slice(2, 10),
        issueDate: new Date().toISOString().split('T')[0],
        expiryDate: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0], // 10 years
      });
      setLoading(false);
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handlePreviewOpen = () => setPreviewOpen(true);
  const handlePreviewClose = () => setPreviewOpen(false);

  const handleDispatch = async () => {
    try {
      // Save passport data to Firebase
      await savePassportData(passportData);

      // After saving, fetch the updated list of passports and update the table
      const db = getFirestore();
      const passportsRef = collection(db, 'passports');
      const querySnapshot = await getDocs(passportsRef);
      const passports = [];
      querySnapshot.forEach((doc) => {
        passports.push({ id: doc.id, ...doc.data() });
      });
      setRecentPassports(passports); // Update the state with the latest passports

      alert('Passport dispatched successfully!');
      setActiveStep(3); // Move to the next step
    } catch (error) {
      console.error('Error dispatching passport:', error);
      alert('Failed to dispatch passport');
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Applicant Name"
                value={passportData.applicantName}
                onChange={(e) =>
                  setPassportData({ ...passportData, applicantName: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Issuing Authority"
                value={passportData.issuingAuthority}
                onChange={(e) =>
                  setPassportData({
                    ...passportData,
                    issuingAuthority: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleNext}
                disabled={loading || !passportData.applicantName || !passportData.issuingAuthority}
              >
                {loading ? <CircularProgress size={24} /> : 'Generate Passport'}
              </Button>
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Passport Number"
                value={passportData.passportNumber}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Issue Date"
                value={passportData.issueDate}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Expiry Date"
                value={passportData.expiryDate}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" fullWidth onClick={handleNext}>
                Approve Details
              </Button>
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Delivery Address"
                value={passportData.deliveryAddress}
                onChange={(e) =>
                  setPassportData({
                    ...passportData,
                    deliveryAddress: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="success"
                fullWidth
                startIcon={<Send />}
                onClick={handleDispatch}
              >
                Dispatch Passport
              </Button>
            </Grid>
          </Grid>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Section */}
      <Paper sx={{ p: 3, mb: 3, background: '#1976d2', color: 'white' }}>
        <Typography variant="h4">Passport Issuance</Typography>
        <Typography>Manage and issue passports efficiently.</Typography>
      </Paper>

      {/* Stepper Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stepper activeStep={activeStep}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Box sx={{ mt: 3 }}>{renderStepContent(activeStep)}</Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="outlined"
            >
              Back
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Recent Passports Table */}
      <TableContainer component={Paper}>
        <Typography variant="h6" sx={{ p: 2 }}>
          Recent Issuances
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Passport Number</TableCell>
              <TableCell>Applicant Name</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Render recent passport data */}
            {recentPassports.map((passport) => (
              <TableRow key={passport.id}>
                <TableCell>{passport.passportNumber}</TableCell>
                <TableCell>{passport.applicantName}</TableCell>
                <TableCell>
                  <Chip label="Dispatched" color="success" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onClose={handlePreviewClose}>
        <DialogTitle>Passport Preview</DialogTitle>
        <DialogContent>
          <Typography>Passport Number: {passportData.passportNumber}</Typography>
          <Typography>Applicant Name: {passportData.applicantName}</Typography>
          <Typography>Delivery Address: {passportData.deliveryAddress}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePreviewClose}>Close</Button>
          <Button variant="contained" color="primary" startIcon={<Print />}>
            Print
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PassportIssuance;
