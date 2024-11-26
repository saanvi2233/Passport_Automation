import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, FormControl, InputLabel, Select, MenuItem, Button, Grid, Box, Typography, Card, CardContent, CircularProgress, Stack, Alert, Dialog, DialogActions, DialogTitle, DialogContent } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase'; // Make sure this path matches your Firebase config file

const ApplicationForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [applicationId, setApplicationId] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: null,
    gender: '',
    nationality: '',
    currentAddress: '',
    permanentAddress: '',
    passportType: '',
    emergencyContact: '',
    occupation: '',
    purpose: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleDateChange = (date) => {
    setFormData(prevData => ({
      ...prevData,
      dateOfBirth: date
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Create application object
      const applicationData = {
        personalInfo: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          dateOfBirth: formData.dateOfBirth ? formData.dateOfBirth.toISOString() : null,
          gender: formData.gender,
          nationality: formData.nationality,
          currentAddress: formData.currentAddress,
          permanentAddress: formData.permanentAddress,
          occupation: formData.occupation,
          emergencyContact: formData.emergencyContact
        },
        passportDetails: {
          type: formData.passportType,
          purpose: formData.purpose
        },
        applicationStatus: {
          status: 'Pending',
          submittedAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        verificationStatus: {
          documentsVerified: false,
          biometricVerified: false
        }
      };

      // Add to Firestore
      const docRef = await addDoc(collection(db, 'applications'), applicationData);
      setApplicationId(docRef.id);
      setOpenDialog(true);
    } catch (err) {
      console.error('Error submitting application:', err);
      setError('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    navigate('/verification', { state: { applicationId } });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ maxWidth: 800, margin: 'auto', p: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ mb: 3 }}
        >
          Back to Dashboard
        </Button>

        <Card elevation={3}>
          <CardContent>
            <Typography variant="h5" gutterBottom color="primary">
              Passport Application Form
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Personal Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Personal Information
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Date of Birth"
                    value={formData.dateOfBirth}
                    onChange={handleDateChange}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth required />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Gender</InputLabel>
                    <Select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      label="Gender"
                    >
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Nationality</InputLabel>
                    <Select
                      name="nationality"
                      value={formData.nationality}
                      onChange={handleInputChange}
                      label="Nationality"
                    >
                      <MenuItem value="IN">Indian</MenuItem>
                      <MenuItem value="US">American</MenuItem>
                      <MenuItem value="UK">British</MenuItem>
                      <MenuItem value="CA">Canadian</MenuItem>
                      <MenuItem value="AU">Australian</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Current Address"
                    name="currentAddress"
                    multiline
                    rows={3}
                    value={formData.currentAddress}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Permanent Address"
                    name="permanentAddress"
                    multiline
                    rows={3}
                    value={formData.permanentAddress}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>

                {/* Passport Details */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Passport Details
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Passport Type</InputLabel>
                    <Select
                      name="passportType"
                      value={formData.passportType}
                      onChange={handleInputChange}
                      label="Passport Type"
                    >
                      <MenuItem value="ordinary">Ordinary</MenuItem>
                      <MenuItem value="official">Official</MenuItem>
                      <MenuItem value="diplomatic">Diplomatic</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Purpose of Passport"
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Occupation"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Emergency Contact"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <Stack direction="row" spacing={2} justifyContent="flex-end">
                    <Button
                      variant="outlined"
                      onClick={() => navigate('/')}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                    >
                      {loading ? (
                        <CircularProgress size={24} />
                      ) : (
                        'Submit Application'
                      )}
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>

        {/* Success Dialog */}
        <Dialog open={openDialog} onClose={handleDialogClose}>
          <DialogTitle>Application Submitted Successfully</DialogTitle>
          <DialogContent>
            <Alert severity="success" sx={{ mt: 2 }}>
              Your application has been submitted successfully. Please proceed to document verification.
            </Alert>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} variant="contained" color="primary">
              Proceed to Verification
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default ApplicationForm;
