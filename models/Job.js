import mongoose from 'mongoose';

const { Schema } = mongoose;

const jobSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Job title is required'],
    },
    company: {
      type: String,
    },
    location: {
      type: String,
      required: true,
    },
    salary: {
      type: String,
    },
    jobType: {
      type: String,
      enum: ['Full-Time', 'Part-Time', 'Internship', 'Freelance'],
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    requirements: {
      type: String,
    },
    contactEmail: {
      type: String,
    },
    category: {
      type: String,
    },
    budget: {
      type: Number,
    },
    postedDate: {
      type: Date,
      default: Date.now,
    },
    deadline: {
      type: Date,
    },
    applicants: [
      {
        user: {                      // Changed from workerId to user
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
        bidAmount: Number,
        coverLetter: String,
        appliedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('Job', jobSchema);
