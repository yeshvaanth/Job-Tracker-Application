const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');

const upload = require('../utils/multerConfig');
const { uploadResume, addJob, getJobs, getJob, updateJob, deleteJob } = require('../controllers/jobController');



router.use(protect);

// Job CRUD routes
router.route('/')
  .post(addJob)   
  .get(getJobs);                   

router.route('/:id')
  .get(getJob)     
  .put(updateJob)  
  .delete(deleteJob); 

// Resume upload route
router.post('/upload/:id', upload.single('resume'), uploadResume);


module.exports = router;
