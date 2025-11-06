import { createError } from "../lib/createError.js";
import Event from "../models/event.model.js";

export const createEvent = async (req, res, next) => {
  try {
    const userId = req.userId;
    const originalUser = req.userId;
    const event = new Event({ userId, originalUser, ...req.body });
    const savedEvent = await event.save();
    res.status(200).json({
      message: "Event created",
      event: savedEvent,
    });
  } catch (error) {
    next(error);
  }
};

export const getEvents = async (req, res, next) => {
  try {
    const { sort = "asc" } = req.query;
    const sortOptions = { endingTime: -1 };

    if (sort === "desc") {
      sortOptions.endingTime = 1;
    }

    const events = await Event.find({
      userId: req.userId,
    }).sort(sortOptions);

    res.status(200).json({
      message: "All Events List",
      events,
    });
  } catch (error) {
    next(error);
  }
};


export const getAllEvents = async (req, res, next) => {
  try {
    const { sort = "asc" } = req.query;
    const sortOptions = { endingTime: -1 };

    if (sort === "desc") {
      sortOptions.endingTime = 1;
    }

    const events = await Event.find().sort(sortOptions);

    res.status(200).json({
      message: "All Events List",
      events,
    });
  } catch (error) {
    next(error);
  }
};

export const getEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return next(createError(404, "event not found"));
    res.status(200).json(event);
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) return next(createError(404, "Event not found"));

    if (event.userId.toString() !== req.userId.toString()) {
      return next(createError(403, "You are not the owner of this event"));
    }

    const { status } = req.body;
    if (!status) {
      return next(createError(400, "Status is required"));
    }

    if (!["BUSY", "SWAPPABLE", "SWAP_PENDING"].includes(status)) {
      return next(createError(400, "Invalid status value"));
    }

    event.status = status;
    const updatedEvent = await event.save();

    res.status(200).json({
      message: "Event status updated successfully",
      event: updatedEvent,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);

    if (!event) return next(createError(404, "event not found"));

    if (event.userId.toString() !== req.userId.toString()) {
      return next(createError(403, "You are not the owner of this event"));
    }

    await Event.findByIdAndDelete(id);
    res.status(200).send("event has been deleted!");
  } catch (err) {
    console.log(err);
    next(err);
  }
};
