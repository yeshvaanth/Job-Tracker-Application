import { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Select,
  MenuItem,
  TextField,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import UploadFileIcon from "@mui/icons-material/UploadFile";

function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [companyFilter, setCompanyFilter] = useState("");

  const [tempStatus, setTempStatus] = useState("All");
  const [tempCompany, setTempCompany] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, [statusFilter, companyFilter]);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem("token");

      const params = {};
      if (statusFilter !== "All") params.status = statusFilter;
      if (companyFilter) params.company = companyFilter;

      const res = await axios.get("http://localhost:5000/api/jobs", {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      setJobs(res.data);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to fetch jobs");
    }
  };

  const handleSearch = () => {
    setStatusFilter(tempStatus);
    setCompanyFilter(tempCompany);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchJobs();
    } catch (err) {
      console.error(err);
      setError("Failed to delete job");
    }
  };

  const handleUpload = async (id, file) => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("resume", file);

      await axios.post(`http://localhost:5000/api/jobs/upload/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      fetchJobs();
    } catch (err) {
      console.error(err);
      setError("Failed to upload resume");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ padding: 5 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4">Dashboard - Jobs</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/add-job")}
          >
            + Add Job
          </Button>
        </Box>

        {error && <Typography color="error">{error}</Typography>}


        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <Select
            value={tempStatus}
            onChange={(e) => setTempStatus(e.target.value)}
            sx={{ width: "200px" }}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Applied">Applied</MenuItem>
            <MenuItem value="Interview">Interview</MenuItem>
            <MenuItem value="Offer">Offer</MenuItem>
            <MenuItem value="Rejected">Rejected</MenuItem>
          </Select>

          <TextField
            fullWidth
            placeholder="Search by company"
            value={tempCompany}
            onChange={(e) => setTempCompany(e.target.value)}
          />

          <Button variant="outlined" onClick={handleSearch}>
            Search
          </Button>
        </Box>

        {jobs.length === 0 ? (
          <Typography>No jobs found.</Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>Company</b></TableCell>
                <TableCell><b>Position</b></TableCell>
                <TableCell><b>Status</b></TableCell>
                <TableCell><b>Notes</b></TableCell>
                <TableCell><b>Applied Date</b></TableCell>
                <TableCell><b>Resume</b></TableCell>
                <TableCell><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {jobs.map((job) => (
                <TableRow key={job._id}>
                  <TableCell>{job.company}</TableCell>
                  <TableCell>{job.position}</TableCell>
                  <TableCell>{job.status}</TableCell>
                  <TableCell>{job.notes || "-"}</TableCell>
                  <TableCell>
                    {new Date(job.appliedDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {job.resume ? (
                      <a
                        href={`http://localhost:5000/uploads/${job.resume}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Resume
                      </a>
                    ) : (
                      <Button
                        variant="outlined"
                        component="label"
                        size="small"
                        startIcon={<UploadFileIcon />}
                      >
                        Upload
                        <input
                          type="file"
                          hidden
                          onChange={(e) =>
                            handleUpload(job._id, e.target.files[0])
                          }
                        />
                      </Button>
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton color="primary">
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(job._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Container>
  );
}

export default Dashboard;
