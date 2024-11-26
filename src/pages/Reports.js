import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { getApplications } from '../firebase';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplicationsData = async () => {
      try {
        const data = await getApplications();
        setApplications(data);
      } catch (err) {
        console.error('Error fetching applications:', err);
        setError('Failed to fetch applications');
      } finally {
        setLoading(false);
      }
    };

    fetchApplicationsData();
  }, []);

  // Filter the applications based on the selected status
  const filteredApplications = applications.filter(
    (app) =>
      statusFilter === 'all' ||
      app.applicationStatus?.status?.toLowerCase() === statusFilter.toLowerCase()
  );

  // Create the data for the pie chart
  const statusCounts = {
    pending: 0,
    rejected: 0,
    verified: 0, // Keep verified count, remove approved
  };

  filteredApplications.forEach((app) => {
    const status = app.applicationStatus?.status?.toLowerCase();
    if (status === 'pending') statusCounts.pending += 1;
    if (status === 'rejected') statusCounts.rejected += 1;
    if (status === 'verified') statusCounts.verified += 1; // Count verified status
  });

  const pieData = [
    { name: 'Pending', value: statusCounts.pending },
    { name: 'Rejected', value: statusCounts.rejected },
    { name: 'Verified', value: statusCounts.verified }, // Include verified in pie data
  ];

  // Create the data for the line chart (status count per date)
  const lineData = [];
  const dateCounts = {};

  filteredApplications.forEach((app) => {
    const date = new Date(app.submittedAt).toLocaleDateString();
    const status = app.applicationStatus?.status?.toLowerCase();
    if (!dateCounts[date]) dateCounts[date] = { pending: 0, rejected: 0, verified: 0 }; // Remove approved
    dateCounts[date][status] += 1;
  });

  for (const date in dateCounts) {
    lineData.push({
      date,
      pending: dateCounts[date].pending,
      rejected: dateCounts[date].rejected,
      verified: dateCounts[date].verified, // Add verified count for each date
    });
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Typography variant="h4" gutterBottom>
        Passport Applications Report
      </Typography>

      {/* Filters */}
      <Box sx={{ mb: 3 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            label="Filter by Status"
          >
            <MenuItem value="all">All Applications</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
            <MenuItem value="verified">Verified</MenuItem> {/* Add verified option */}
          </Select>
        </FormControl>
      </Box>

      {/* Pie Chart */}
      <Typography variant="h6" gutterBottom>
        Application Status Distribution
      </Typography>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={150} label>
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={['#FFBB28', '#FF8042', '#9E9E9E'][index]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      {/* Line Chart */}
      <Typography variant="h6" gutterBottom>
        Application Status Over Time
      </Typography>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={lineData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="pending" stroke="#FFBB28" />
          <Line type="monotone" dataKey="rejected" stroke="#FF8042" />
          <Line type="monotone" dataKey="verified" stroke="#9E9E9E" /> {/* Add verified line */}
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default Reports;
