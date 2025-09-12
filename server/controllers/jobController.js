const Job = require('../models/Job');

exports.addJob = async (req,res) =>{
    try{
        const {company, position, status, notes} = req.body;
        if(!company || !position){
            return res.status(401).json({ message: 'Company and Position are required' })
        }
        const job = await Job.create({
            userId: req.user.userId,
            company,
            position,    
            status,
            notes,
        })
        res.status(201).json(job);
    }catch (err) {
        res.status(500).json({ message: 'Error creating job', error: err.message });
    }
}

// Get Job by ID
exports.getJob = async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching job', error: err.message });
  }
};

// Update Job
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true }
    );
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: 'Error updating job', error: err.message });
  }
};

// Delete Job
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json({ message: 'Job deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting job', error: err.message });
  }
};



// Upload resume to a job
exports.uploadResume = async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    job.resume = req.file.filename;
    await job.save();

    res.json({ message: 'Resume uploaded', file: req.file.filename });
  } catch (err) {
    res.status(500).json({ message: 'Resume upload failed', error: err.message });
  }
};


exports.getJobs = async (req, res) => {
  try {
    const { status, company } = req.query;

    let query = { userId: req.user.userId };

    if (status && status !== "All") {
      query.status = status;  // exact match
    }

    if (company) {
      query.company = { $regex: company, $options: "i" }; 
    }

    const jobs = await Job.find(query).sort({ appliedDate: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching jobs", error: err.message });
  }
};


