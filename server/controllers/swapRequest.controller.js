import mongoose from "mongoose";
import { createError } from "../lib/createError.js";
import Event from "../models/event.model.js";
import SwapRequest from "../models/swapRequest.model.js";


export const getSwappableSlots = async (req, res, next) => {
 try {
   const swappableSlots = await Event.find({
    userId: { $ne: req.userId },
    status: 'SWAPPABLE'
  })
    .populate('userId', 'name email')
    .sort({ startingTime: 1 });

   res.status(200).json({
    success: true,
    count: swappableSlots.length,
    data: swappableSlots
  });
 } catch (error) {
  next(error)
 };
};


export const createSwapRequest = async (req, res , next) => {
   const { mySlotId, theirSlotId } = req.body;
  if (!mySlotId || !theirSlotId) return next(createError(400,"Missing slot ids"));

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const mySlot = await Event.findById(mySlotId).session(session);

    const theirSlot = await Event.findById(theirSlotId).session(session);
    
    if (!mySlot || !theirSlot) {
      await session.abortTransaction();
      session.endSession();
      return next(createError(404,"One of the slots not found"));
    }

    if (mySlot.userId.toString() !== req.userId.toString()) {
      await session.abortTransaction();
      return next(createError(403, "You do not own the mySlotId"));
    }

    if (mySlot.status !== 'SWAPPABLE' || theirSlot.status !== 'SWAPPABLE') {
      await session.abortTransaction();
      session.endSession();
      return next(createError(400,"Both slots must be SWAPPABLE"));
    }

    const swapRequest = new SwapRequest({
      requester: req.userId,
      responder: theirSlot.userId,
      mySlot: mySlot._id,
      theirSlot: theirSlot._id,
      status: 'PENDING',
    });
    await swapRequest.save({ session });

    mySlot.status = 'SWAP_PENDING';
    theirSlot.status = 'SWAP_PENDING';
    await mySlot.save({ session });
    await theirSlot.save({ session });

    await session.commitTransaction();
    session.endSession();

    const populated = await SwapRequest.findById(swapRequest._id)
      .populate('requester', 'name email')
      .populate('responder', 'name email')
      .populate('mySlot')
      .populate('theirSlot');

    res.json(populated)
   } catch (error) {
    next(error);
  }
}


export const respondToSwapRequest = async (req, res,next) => {
  
  const { accept } = req.body;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const reqSlot = await SwapRequest.findById(req.params.id).session(session);
    if (!reqSlot) {
      await session.abortTransaction();
      session.endSession();
      return next(createError(404,"Swap request not found"));
    }

    if (reqSlot.responder.toString() !== req.userId.toString()) {
      await session.abortTransaction();
      session.endSession();
      return next(createError(403,"Not authorized to respond"));
    }
    if (reqSlot.status !== 'PENDING') {
      await session.abortTransaction();
      session.endSession();
      next(createError(400,"Request already answered"));
    }

    const mySlot = await Event.findById(reqSlot.mySlot).session(session);
    const theirSlot = await Event.findById(reqSlot.theirSlot).session(session);
    if (!mySlot || !theirSlot) {
      reqSlot.status = 'REJECTED';
      await reqSlot.save({ session });
      await session.commitTransaction();
      session.endSession();
      return next(createError(404,"One of slots no longer exist"));
    }

    if (!accept) {
      reqSlot.status = 'REJECTED';
      mySlot.status = 'SWAPPABLE';
      theirSlot.status = 'SWAPPABLE';
      await mySlot.save({ session });
      await theirSlot.save({ session });
      await reqSlot.save({ session });
      await session.commitTransaction();
      session.endSession();
      return res.status(200).json({ message: 'Rejected', req: reqSlot });
    }
   
    if (mySlot.status !== 'SWAP_PENDING' || theirSlot.status !== 'SWAP_PENDING') {
      await session.abortTransaction();
      session.endSession();
      return next(createError(400,"Slots are not in SWAP_PENDING status"));
    }

    const tmpStartingTime = mySlot.startingTime;
    const tmpEndingTime = mySlot.endingTime;
    mySlot.startingTime = theirSlot.startingTime;
    mySlot.endingTime = theirSlot.endingTime;
    theirSlot.startingTime = tmpStartingTime;
    theirSlot.endingTime = tmpEndingTime;


    mySlot.status = 'BUSY';
    theirSlot.status = 'BUSY';

    reqSlot.status = 'ACCEPTED';

    await mySlot.save({ session });
    await theirSlot.save({ session });
    await reqSlot.save({ session });

    await session.commitTransaction();
    session.endSession();

    const populated = await SwapRequest.findById(reqSlot._id)
      .populate('requester', 'name email')
      .populate('responder', 'name email')
      .populate('mySlot')
      .populate('theirSlot');

    res.status(200).json({ message: 'Accepted and swapped', req : populated });
  } catch (err) {
    console.error(err);
    await session.abortTransaction();
    session.endSession();
    return next(createError(500, "Server error"));
  }};
  


export const swapRequests = async (req, res, next) => {
   try {
    const incoming = await SwapRequest.find({ responder: req.userId }).sort({ createdAt: -1 })
      .populate('requester', 'name email')
      .populate('mySlot')
      .populate('theirSlot');

    const outgoing = await SwapRequest.find({ requester: req.userId }).sort({ createdAt: -1 })
      .populate('responder', 'name email')
      .populate('mySlot')
      .populate('theirSlot');
    res.status(200).json({ incoming, outgoing });
  } catch (err) {
    console.error(err);
    return next(createError(500, "Server error"));
  }};