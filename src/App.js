// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ApplicationReview from './pages/ApplicationReview';
import DocumentVerification from './pages/DocumentVerification';
import PassportIssuance from './pages/PassportIssuance';
import TrackApplication from './components/TrackApplication';
import ApplicationForm from './components/ApplicationForm'; // Fixed the missing quote here
import Reports from './pages/Reports';
import RecentApplications from './pages/RecentApplication';
import Signup from './components/Signup';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';



// MUI theme configuration
// const theme = createTheme({
//   palette: {
//     primary: {
//       main: '#1976d2', // Default blue
//     },
//     secondary: {
//       main: '#dc004e', // Default pink
//     },
//   },
// });
const appStyles = {
  backgroundImage: "url('/pp.jpg')", // Replace with your image URL
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  backgroundAttachment: 'fixed',
  minHeight: '100vh',
  fontFamily: 'Roboto, sans-serif', // Optional for consistency with MUI
};

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {/* <ThemeProvider theme={theme}> */}
      <div style={appStyles}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {/* <ThemeProvider theme={theme}> */}
      <Router>
        <Routes>
          {/* Public Route for Login */}
          

          {/* Protected Routes with Layout */}
          <Route element={<Layout />}>
            <Route 
              path="/" 
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } 
            />
             <Route path="/signup" element={
              <PrivateRoute>
              <Signup />
            </PrivateRoute>

             } />
            <Route 
              path="/applications" 
              element={
                <PrivateRoute>
                  <ApplicationReview />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/track" 
              element={
                <PrivateRoute>
                  <TrackApplication />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/verification" 
              element={
                <PrivateRoute>
                  <DocumentVerification />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/issuance" 
              element={
                <PrivateRoute>
                  <PassportIssuance />
                </PrivateRoute>
              } 
            />

<Route 
              path="/recent" 
              element={
                <PrivateRoute>
                  <RecentApplications/>
                </PrivateRoute>
              } 
            />
            <Route 
              path="/reports" 
              element={
                <PrivateRoute>
                  <Reports />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/apply" 
              element={
                <PrivateRoute>
                  <ApplicationForm />
                </PrivateRoute>
              } 
            />
          </Route>
        </Routes>
      </Router>
      </LocalizationProvider>

</div>   
   {/* </ThemeProvider> */}
      </LocalizationProvider>
  );
}

export default App;
