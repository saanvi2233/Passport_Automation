import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Stepper,
  Step,
  StepLabel,
  Paper,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  LinearProgress,
  Container,
  Divider,
  Stack,
  Snackbar,
} from '@mui/material';
import {
  CloudUpload,
  CheckCircle,
  Error,
  ZoomIn,
  Delete,
  Description,
  Image,
  PictureAsPdf,
  Face,
  Fingerprint,
  ArrowForward,
  ArrowBack,
} from '@mui/icons-material';
import { getAuth } from 'firebase/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust this import path based on your firebase config file

const DocumentVerification = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [documents, setDocuments] = useState([]);
  const [verificationStatus, setVerificationStatus] = useState({});
  const [openPreview, setOpenPreview] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [loading, setLoading] = useState(false);
  const [biometricCaptured, setBiometricCaptured] = useState({
    face: false,
    fingerprint: false,
  });
  const [completedSteps, setCompletedSteps] = useState({});
  const [errorMessages, setErrorMessages] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const fileInputRef = useRef(null);

  const steps = [
    'Upload Documents',
    'Document Verification',
    'Biometric Verification',
    'Final Review',
  ];

  const requiredDocuments = [
    { name: 'ID Proof', type: 'image/*', required: true },
    { name: 'Address Proof', type: 'image/*,application/pdf', required: true },
    { name: 'Photograph', type: 'image/*', required: true },
    { name: 'Birth Certificate', type: 'image/*,application/pdf', required: true },
  ];

  const handleFileUpload = async (event, documentName) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessages({
          ...errorMessages,
          [documentName]: 'File size should not exceed 5MB',
        });
        return;
      }

      setLoading(true);
      try {
        const reader = new FileReader();
        reader.onload = async () => {
          setDocuments((prev) => [
            ...prev.filter((doc) => doc.name !== documentName),
            {
              name: documentName,
              file,
              preview: reader.result,
              type: file.type,
            },
          ]);
          
          await handleVerification(documentName);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        setErrorMessages({
          ...errorMessages,
          [documentName]: 'Error uploading file. Please try again.',
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleVerification = async (documentName) => {
    setLoading(true);
    try {
      // Simulate verification process
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      setVerificationStatus((prev) => ({
        ...prev,
        [documentName]: {
          status: 'verified',
          message: 'Document verified successfully',
          timestamp: new Date().toISOString(),
        },
      }));
    } catch (error) {
      setErrorMessages({
        ...errorMessages,
        [documentName]: 'Verification failed. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitToFirebase = async () => {
    if (!auth.currentUser) {
      setSnackbar({
        open: true,
        message: 'Please login to submit documents',
        severity: 'error'
      });
      return;
    }

    setLoading(true);
    try {
      const documentData = {
        userId: auth.currentUser.uid,
        documents: documents.map(doc => ({
          name: doc.name,
          type: doc.type,
          verificationStatus: verificationStatus[doc.name] || {},
        })),
        biometricData: biometricCaptured,
        status: 'submitted',
        createdAt: serverTimestamp(),
        completedSteps,
      };

      await addDoc(collection(db, 'documentVerifications'), documentData);

      setSnackbar({
        open: true,
        message: 'Documents submitted successfully!',
        severity: 'success'
      });

      // Navigate to insurance page after successful submission
      setTimeout(() => {
        navigate('/issuance');
      }, 2000);

    } catch (error) {
      console.error('Submission error:', error);
      setSnackbar({
        open: true,
        message: 'Error submitting documents. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const renderDocumentUpload = () => (
    <Grid container spacing={3}>
      {requiredDocuments.map((doc) => (
        <Grid item xs={12} sm={6} key={doc.name}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {doc.name}
              </Typography>
              <input
                type="file"
                accept={doc.type}
                style={{ display: 'none' }}
                onChange={(e) => handleFileUpload(e, doc.name)}
                ref={fileInputRef}
              />
              <Button
                variant="outlined"
                startIcon={<CloudUpload />}
                onClick={() => fileInputRef.current.click()}
                fullWidth
              >
                Upload
              </Button>
              {documents.find(d => d.name === doc.name) && (
                <Box mt={2}>
                  <Chip
                    label="Document Uploaded"
                    color="success"
                    icon={<CheckCircle />}
                  />
                </Box>
              )}
              {errorMessages[doc.name] && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {errorMessages[doc.name]}
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderFinalReview = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Final Review
        </Typography>
        <List>
          {documents.map((doc) => (
            <ListItem key={doc.name}>
              <ListItemIcon>
                <CheckCircle color="success" />
              </ListItemIcon>
              <ListItemText
                primary={doc.name}
                secondary={`Status: ${verificationStatus[doc.name]?.status || 'Pending'}`}
              />
            </ListItem>
          ))}
        </List>
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1" gutterBottom>
          Biometric Verification
        </Typography>
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <Chip
            icon={<Face />}
            label="Face Scan"
            color={biometricCaptured.face ? "success" : "default"}
          />
          <Chip
            icon={<Fingerprint />}
            label="Fingerprint"
            color={biometricCaptured.fingerprint ? "success" : "default"}
          />
        </Stack>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSubmitToFirebase}
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit and Continue to Insurance'}
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Document Verification
        </Typography>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {loading && <LinearProgress sx={{ mb: 2 }} />}

        {activeStep === 0 && renderDocumentUpload()}
        {activeStep === 3 && renderFinalReview()}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button
            disabled={activeStep === 0}
            onClick={() => setActiveStep((prev) => prev - 1)}
            startIcon={<ArrowBack />}
          >
            Back
          </Button>
          <Button
            disabled={activeStep === steps.length - 1}
            onClick={() => setActiveStep((prev) => prev + 1)}
            endIcon={<ArrowForward />}
          >
            Next
          </Button>
        </Box>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default DocumentVerification;
