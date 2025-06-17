import express from 'express';
import mongoose from 'mongoose';
import Job from '../models/Job.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();


router.post('/', protect, async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      salary,
      jobType,
      description,
      requirements,
      contactEmail,
      category,
      budget,
      deadline,
    } = req.body;

    if (!title || !location || !jobType || !description) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newJob = new Job({
      user: req.user._id,
      title,
      company,
      location,
      salary,
      jobType,
      description,
      requirements,
      contactEmail,
      category,
      budget,
      deadline,
    });

    await newJob.save();
    res.status(201).json(newJob);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.get('/my-jobs', protect, async (req, res) => {
  try {
    const jobs = await Job.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get('/applied', protect, async (req, res) => {
  try {
    const jobs = await Job.find({ 'applicants.workerId': req.user._id });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.put('/:jobId', protect, async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findOne({ _id: jobId, user: req.user._id });

    if (!job) {
      return res.status(404).json({ error: 'Job not found or unauthorized' });
    }

    const {
      title,
      company,
      location,
      salary,
      jobType,
      description,
      requirements,
      contactEmail,
      category,
      budget,
      deadline,
    } = req.body;

    job.title = title || job.title;
    job.company = company || job.company;
    job.location = location || job.location;
    job.salary = salary || job.salary;
    job.jobType = jobType || job.jobType;
    job.description = description || job.description;
    job.requirements = requirements || job.requirements;
    job.contactEmail = contactEmail || job.contactEmail;
    job.category = category || job.category;
    job.budget = budget || job.budget;
    job.deadline = deadline || job.deadline;

    await job.save();
    res.status(200).json(job);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.delete('/:jobId', protect, async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findOne({ _id: jobId, user: req.user._id });

    if (!job) {
      return res.status(404).json({ error: 'Job not found or unauthorized' });
    }

    await job.remove();
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.post('/:jobId/apply', protect, async (req, res) => {
  try {
    const { jobId } = req.params;
    const { bidAmount, coverLetter } = req.body;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ error: 'Invalid job ID' });
    }

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    const alreadyApplied = job.applicants.some(
      (app) => app.workerId.toString() === req.user._id.toString()
    );

    if (alreadyApplied) {
      return res.status(400).json({ error: 'Already applied to this job' });
    }

    job.applicants.push({
      workerId: req.user._id,
      bidAmount,
      coverLetter,
    });

    await job.save();
    res.status(200).json({ message: 'Applied successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:jobId', protect, async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findOne({ _id: jobId, user: req.user._id });

    if (!job) {
      return res.status(404).json({ error: 'Job not found or unauthorized' });
    }

    await job.remove();
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('applicants.user', 'name email');
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  } catch (err) {
    console.error('Error fetching job:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
export default router;
