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


export const createSwapRequest = async (req, res, next) => {
  const { mySlotId, theirSlotId } = req.body;
  if (!mySlotId || !theirSlotId)
    return next(createError(400, "Missing slot ids"));

  try {
    const mySlot = await Event.findById(mySlotId);
    const theirSlot = await Event.findById(theirSlotId);

    if (!mySlot || !theirSlot) {
      return next(createError(404, "One of the slots not found"));
    }

    if (mySlot.userId.toString() !== req.userId.toString()) {
      return next(createError(403, "You do not own the mySlotId"));
    }

    if (mySlot.status !== "SWAPPABLE" || theirSlot.status !== "SWAPPABLE") {
      return next(createError(400, "Both slots must be SWAPPABLE"));
    }

    const swapRequest = new SwapRequest({
      requester: req.userId,
      responder: theirSlot.userId,
      mySlot: mySlot._id,
      theirSlot: theirSlot._id,
      status: "PENDING",
    });

    await swapRequest.save();

    mySlot.status = "SWAP_PENDING";
    theirSlot.status = "SWAP_PENDING";
    await mySlot.save();
    await theirSlot.save();

    const populated = await SwapRequest.findById(swapRequest._id)
      .populate("requester", "name email")
      .populate("responder", "name email")
      .populate("mySlot")
      .populate("theirSlot");

    res.status(200).json(populated);
  } catch (error) {
    next(error);
  }
};


export const respondToSwapRequest = async (req, res, next) => {
  const { accept } = req.body;

  try {
    const reqSlot = await SwapRequest.findById(req.params.id);
    if (!reqSlot) {
      return next(createError(404, "Swap request not found"));
    }

    if (reqSlot.responder.toString() !== req.userId.toString()) {
      return next(createError(403, "Not authorized to respond"));
    }

    if (reqSlot.status !== "PENDING") {
      return next(createError(400, "Request already answered"));
    }

    const mySlot = await Event.findById(reqSlot.mySlot);
    const theirSlot = await Event.findById(reqSlot.theirSlot);

    if (!mySlot || !theirSlot) {
      reqSlot.status = "REJECTED";
      await reqSlot.save();
      return next(createError(404, "One of the slots no longer exists"));
    }

    if (!accept) {
      reqSlot.status = "REJECTED";
      mySlot.status = "SWAPPABLE";
      theirSlot.status = "SWAPPABLE";

      await mySlot.save();
      await theirSlot.save();
      await reqSlot.save();

      return res.status(200).json({ message: "Rejected", req: reqSlot });
    }

    if (mySlot.status !== "SWAP_PENDING" || theirSlot.status !== "SWAP_PENDING") {
      return next(createError(400, "Slots are not in SWAP_PENDING status"));
    }

    const tmpStartingTime = mySlot.startingTime;
    const tmpEndingTime = mySlot.endingTime;

    mySlot.startingTime = theirSlot.startingTime;
    mySlot.endingTime = theirSlot.endingTime;
    theirSlot.startingTime = tmpStartingTime;
    theirSlot.endingTime = tmpEndingTime;

    mySlot.status = "BUSY";
    theirSlot.status = "BUSY";
    reqSlot.status = "ACCEPTED";

    await mySlot.save();
    await theirSlot.save();
    await reqSlot.save();

    const populated = await SwapRequest.findById(reqSlot._id)
      .populate("requester", "name email")
      .populate("responder", "name email")
      .populate("mySlot")
      .populate("theirSlot");

    res.status(200).json({
      message: "Accepted and swapped successfully",
      req: populated,
    });
  } catch (err) {
    console.error(err);
    return next(createError(500, "Server error"));
  }
};


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