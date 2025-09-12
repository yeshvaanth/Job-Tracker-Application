
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Box,
  Alert,
} from "@mui/material";
import CssBaseline from '@mui/material/CssBaseline';

function AddJob() {
  const [job, setJob] = useState({
    company: "",
    position: "",
    status: "Pending",
    notes: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please login again.");
        return;
      }

      const res = await axios.post("http://localhost:5000/api/jobs", job, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess("Job added successfully!");
      console.log("Job Added:", res.data);
      setJob({ company: "", position: "", status: "Pending", notes: "" });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to add job");
    }
  };

  return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",   
          bgcolor: "#f9f9f9",   
        }}
      >
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 3 }}>
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
  <Typography variant="h4">Add Job</Typography>
    <Button
      variant="outlined"
      color="secondary"
      onClick={() => navigate("/dashboard")}
    >
      ← Back to Dashboard
    </Button>
  </Box>


        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Company"
            name="company"
            value={job.company}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Position"
            name="position"
            value={job.position}
            onChange={handleChange}
            margin="normal"
            required
          />

          <Select
            fullWidth
            name="status"
            value={job.status}
            onChange={handleChange}
            sx={{ mt: 2 }}
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Applied">Applied</MenuItem>
            <MenuItem value="Interview">Interview</MenuItem>
            <MenuItem value="Offer">Offer</MenuItem>
            <MenuItem value="Rejected">Rejected</MenuItem>
          </Select>

          <TextField
            fullWidth
            label="Notes"
            name="notes"
            value={job.notes}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={3}
          />

          <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
            <Button type="submit" variant="contained" color="primary">
              Add Job
            </Button>
            <Button variant="outlined" onClick={() => navigate("/dashboard")}>
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
    </Box>
  );
}

export default AddJob;
