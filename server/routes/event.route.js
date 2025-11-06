import express from 'express';
import { createEvent, deleteEvent, getEvents, getEvent, updateEvent, getAllEvents } from '../controllers/event.controller.js';
import { verifyToken} from '../middlware/verifyToken.js';



const router = express.Router();

router.post('/',verifyToken,createEvent);
router.get("/",verifyToken,getEvents);
router.get("/all",getAllEvents);
router.get("/:id",verifyToken,getEvent);
router.put("/:id",verifyToken, updateEvent);
router.delete("/:id",verifyToken,deleteEvent);


export default router;