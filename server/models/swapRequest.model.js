import mongoose from "mongoose";

  const swapRequestSchema = new mongoose.Schema({
    requester: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  responder: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  mySlot: {
    type: mongoose.Schema.ObjectId,
    ref: 'Event',
    required: true
  },
  theirSlot: {
    type: mongoose.Schema.ObjectId,
    ref: 'Event',
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED'],
    default: 'PENDING'
  }
}, {
  timestamps: true
});

export default mongoose.model("SwapRequest", swapRequestSchema);