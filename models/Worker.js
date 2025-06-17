import mongoose from 'mongoose';



const workerProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    experience: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      default: null,
    },
    hourlyRate: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const workerProfile= mongoose.model('WorkerProfile', workerProfileSchema);
export default workerProfile